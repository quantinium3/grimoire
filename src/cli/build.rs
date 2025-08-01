use crate::{
    consts::FrontMatter,
    utils::{get_content_dir, get_embedded_files, get_slug},
};

use anyhow::{Context, Result, bail};

use comrak::{Options, Plugins, markdown_to_html_with_plugins};

use gray_matter::{Matter, engine::YAML};

use serde::Serialize;

use std::{collections::HashMap, path::Path};

use tera::Tera;

use tokio::fs::{create_dir_all, read_to_string, write};

use walkdir::WalkDir;

#[derive(Debug)]
struct Document {
    metadata: FrontMatter,
    content: String,
    html_content: String,
}

#[derive(Serialize, Debug, Clone)]
struct PostInfo {
    slug: String,
    title: String,
    date: Option<String>,
    description: Option<String>,
    tags: Option<Vec<String>>,
}

pub async fn build_content(include_drafts: bool, output_dir: &str) -> Result<()> {
    println!("Building content...");

    let content_dir = get_content_dir().await?;

    let nav_items = get_nav_items(&content_dir).await?;

    create_dir_all(output_dir)
        .await
        .context("failed to create output directory")?;

    create_index_page(&content_dir, output_dir, &nav_items).await?;

    create_static_pages(&content_dir, output_dir, &nav_items, include_drafts).await?;

    create_post_pages(&content_dir, output_dir, &nav_items, include_drafts).await?;

    Ok(())
}

async fn get_nav_items(dirname: &str) -> Result<Vec<String>> {
    let mut nav_items: Vec<String> = Vec::new();

    let walker = WalkDir::new(dirname).follow_links(false);

    for entry in walker
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_dir())
    {
        if let Some(dir_name) = entry.file_name().to_str() {
            if dir_name.starts_with('.') || dir_name == "target" || dir_name == "node_modules" {
                continue;
            }

            if dir_name == "static" {
                let static_walker = WalkDir::new(entry.path()).follow_links(false);

                for static_entry in static_walker
                    .into_iter()
                    .filter_map(|e| e.ok())
                    .filter(|e| e.path().extension().and_then(|ext| ext.to_str()) == Some("md"))
                {
                    let slug = get_slug(static_entry.path().to_string_lossy().as_ref()).await?;
                    nav_items.push(slug);
                }
            } else {
                nav_items.push(dir_name.to_string());
            }
        }
    }

    nav_items.sort();
    Ok(nav_items)
}

async fn create_static_pages(
    content_dir: &str,
    output_dir: &str,
    nav_items: &[String],
    include_drafts: bool,
) -> Result<()> {
    for entry in WalkDir::new(Path::new(content_dir).join("static"))
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().and_then(|e| e.to_str()) == Some("md"))
    {
        let file_content = read_to_string(entry.path())
            .await
            .with_context(|| format!("Failed to read file: {}", entry.path().to_string_lossy()))?;

        let document = parse_content(&file_content)?;

        // Skip drafts unless include_drafts is true
        if document.metadata.draft.unwrap_or(false) && !include_drafts {
            continue;
        }

        let slug = get_slug(entry.path().to_string_lossy().as_ref())
            .await
            .with_context(|| {
                format!(
                    "Failed to get slug of file: {}",
                    entry.path().to_string_lossy()
                )
            })?;

        let content = get_content(entry.path(), "static.html", nav_items)
            .await
            .context(format!("Failed to convert: {}", slug))?;

        write(Path::new(output_dir).join(&slug), content)
            .await
            .context(format!("Failed to create: {}", slug))?;
    }

    Ok(())
}

async fn create_index_page(
    content_dir: &str,
    output_dir: &str,
    nav_items: &[String],
) -> Result<()> {
    let index_path = Path::new(content_dir).join("index.md");

    if !index_path.exists() {
        bail!("index.md doesn't exist in content directory");
    }

    let content = get_content(&index_path, "blog.html", nav_items).await?;

    write(Path::new(output_dir).join("index.html"), content)
        .await
        .context("failed to write index.html")?;

    Ok(())
}

async fn get_content(path: &Path, template: &str, nav_items: &[String]) -> Result<String> {
    let file = read_to_string(path)
        .await
        .with_context(|| format!("Failed to read: {:?}", path))?;

    let document = parse_content(&file)?;

    let html_output = render_with_tera(document, template, nav_items)?;

    Ok(html_output)
}

fn render_with_tera(document: Document, template: &str, nav_items: &[String]) -> Result<String> {
    let templ = get_embedded_files(template)?;

    let mut tera = Tera::default();
    tera.add_raw_template("document", &templ)?;

    let mut context = tera::Context::new();

    context.insert(
        "title",
        &document.metadata.title.as_deref().unwrap_or("Untitled"),
    );

    context.insert(
        "author",
        &document.metadata.author.as_deref().unwrap_or("Unknown"),
    );

    context.insert(
        "description",
        &document.metadata.description.as_deref().unwrap_or(""),
    );

    if let Some(date) = &document.metadata.date {
        context.insert("date", date);
    }

    if let Some(tags) = &document.metadata.tags {
        context.insert("tags", tags);
    }

    if let Some(slug) = &document.metadata.slug {
        context.insert("slug", slug);
    }

    context.insert("content", &document.html_content);
    context.insert("raw_content", &document.content);
    context.insert("navbar", nav_items);

    for (key, value) in &document.metadata.extra {
        context.insert(key, value);
    }

    let rendered = tera
        .render("document", &context)
        .context("Failed to render template")?;

    Ok(rendered)
}

fn parse_content(input: &str) -> Result<Document> {
    let matter = Matter::<YAML>::new();
    let result = matter
        .parse::<FrontMatter>(input)
        .context("Failed to parse frontmatter in markdown")?;

    let metadata: FrontMatter = result.data.unwrap_or_else(|| FrontMatter {
        title: None,
        author: None,
        date: None,
        tags: None,
        description: None,
        slug: None,
        draft: None,
        extra: HashMap::new(),
    });

    let mut options = Options::default();
    options.extension.strikethrough = true;
    options.extension.tagfilter = true;
    options.extension.table = true;
    options.extension.autolink = true;
    options.extension.tasklist = true;
    options.extension.superscript = true;
    options.extension.header_ids = Some("user-content-".to_string());
    options.extension.footnotes = true;
    options.extension.description_lists = true;
    options.extension.front_matter_delimiter = Some("---".to_string());
    options.parse.smart = true;
    options.parse.default_info_string = Some("text".to_string());
    options.render.hardbreaks = false;
    options.render.github_pre_lang = true;
    options.render.width = 80;
    options.render.unsafe_ = false;

    let plugins = Plugins::default();
    let html_content = markdown_to_html_with_plugins(&result.content, &options, &plugins);

    Ok(Document {
        metadata,
        content: result.content,
        html_content,
    })
}

async fn create_post_pages(
    content_dir: &str,
    output_dir: &str,
    nav_items: &[String],
    include_drafts: bool,
) -> Result<()> {
    let content_path = Path::new(content_dir);

    for entry in WalkDir::new(content_dir)
        .max_depth(1)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_dir())
        .filter(|e| {
            if let Some(dir_name) = e.file_name().to_str() {
                !dir_name.starts_with('.')
                    && dir_name != "target"
                    && dir_name != "node_modules"
                    && dir_name != "static"
                    && e.path() != content_path
            } else {
                false
            }
        })
    {
        let dir_name = entry.file_name().to_str().unwrap();
        let category_dir = Path::new(output_dir).join(dir_name);

        create_dir_all(&category_dir)
            .await
            .with_context(|| format!("Failed to create category directory: {}", dir_name))?;

        let mut posts = Vec::new();

        for post_entry in WalkDir::new(entry.path())
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.path().extension().and_then(|ext| ext.to_str()) == Some("md"))
        {
            let file_content = read_to_string(post_entry.path()).await.with_context(|| {
                format!(
                    "Failed to read post file: {}",
                    post_entry.path().to_string_lossy()
                )
            })?;

            let document = parse_content(&file_content)?;

            // Skip drafts unless include_drafts is true
            if document.metadata.draft.unwrap_or(false) && !include_drafts {
                continue;
            }

            let slug = get_slug(post_entry.path().to_string_lossy().as_ref())
                .await
                .with_context(|| {
                    format!(
                        "Failed to get slug for: {}",
                        post_entry.path().to_string_lossy()
                    )
                })?;

            let post_content = get_content(post_entry.path(), "post.html", nav_items)
                .await
                .with_context(|| format!("Failed to process post: {}", slug))?;

            let post_file_path = category_dir.join(format!("{}.html", slug));

            write(&post_file_path, &post_content)
                .await
                .with_context(|| format!("Failed to write post file: {}", slug))?;

            posts.push(PostInfo {
                slug: slug.clone(),
                title: document
                    .metadata
                    .title
                    .clone()
                    .unwrap_or_else(|| slug.clone()),
                date: document.metadata.date.clone(),
                description: document.metadata.description.clone(),
                tags: document.metadata.tags.map(|tags| {
                    tags.split(',')
                        .map(|tag| tag.trim().to_string())
                        .filter(|tag| !tag.is_empty())
                        .collect::<Vec<String>>()
                }),
            });

            println!("✓ Created {}/{}.html", dir_name, slug);
        }

        posts.sort_by(|a, b| match (&b.date, &a.date) {
            (Some(date_b), Some(date_a)) => date_b.cmp(date_a),
            (Some(_), None) => std::cmp::Ordering::Less,
            (None, Some(_)) => std::cmp::Ordering::Greater,
            (None, None) => a.title.cmp(&b.title),
        });

        let index_content = create_category_index(dir_name, &posts, nav_items)?;

        let index_path = category_dir.join("index.html");

        write(&index_path, index_content)
            .await
            .with_context(|| format!("Failed to write category index for: {}", dir_name))?;

        println!(
            "✓ Created {}/index.html with {} posts",
            dir_name,
            posts.len()
        );
    }

    Ok(())
}

fn create_category_index(
    category: &str,
    posts: &[PostInfo],
    nav_items: &[String],
) -> Result<String> {
    let template_content = get_embedded_files("index.html")
        .or_else(|_| get_embedded_files("static.html"))
        .context("Failed to get category index template")?;

    let mut tera = Tera::default();
    tera.add_raw_template("category_index", &template_content)?;

    let mut context = tera::Context::new();
    context.insert("category", category);
    context.insert(
        "category_title",
        &format!("{} - Posts", category.to_uppercase()),
    );
    context.insert("posts", posts);
    context.insert("navbar", nav_items);
    context.insert("title", &format!("{} Posts", category));
    context.insert(
        "description",
        &format!("All posts in the {} category", category),
    );

    let rendered = tera
        .render("category_index", &context)
        .context("Failed to render category index template")?;

    Ok(rendered)
}
