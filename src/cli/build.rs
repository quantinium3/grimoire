use crate::{
    consts::FrontMatter,
    utils::{get_content_dir, get_embedded_files, get_slug},
};

use anyhow::{Context, Result, bail};
use comrak::{Options, Plugins, markdown_to_html_with_plugins};
use gray_matter::{Matter, engine::YAML};
use serde::Serialize;
use std::{path::Path};
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
    url: String,
}

pub async fn build_content(include_drafts: bool, output_dir: &str) -> Result<()> {
    println!("Building content...");

    let content_dir = get_content_dir().await?;

    // Create output directory
    create_dir_all(output_dir)
        .await
        .context("failed to create output directory")?;

    // Build navigation items
    let nav_items = get_nav_items(&content_dir).await?;

    // Build pages in order
    create_index_page(&content_dir, output_dir, &nav_items).await?;
    create_static_pages(&content_dir, output_dir, &nav_items, include_drafts).await?;
    create_blog_categories(&content_dir, output_dir, &nav_items, include_drafts).await?;

    println!("✓ Build completed!");
    Ok(())
}

async fn get_nav_items(content_dir: &str) -> Result<Vec<String>> {
    let mut nav_items: Vec<String> = Vec::new();

    // Add static page slugs to navbar
    let static_dir = Path::new(content_dir).join("static");
    if static_dir.exists() {
        for entry in WalkDir::new(&static_dir)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.path().extension().and_then(|ext| ext.to_str()) == Some("md"))
        {
            let slug = get_page_slug(entry.path()).await?;
            nav_items.push(slug);
        }
    }

    // Add directory names for categories (except static)
    for entry in WalkDir::new(content_dir)
        .max_depth(1)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_dir())
        .filter(|e| {
            if let Some(dir_name) = e.file_name().to_str() {
                !dir_name.starts_with('.')
                    && dir_name != "static"
                    && dir_name != "target"
                    && dir_name != "node_modules"
                    && e.path() != Path::new(content_dir)
            } else {
                false
            }
        })
    {
        if let Some(dir_name) = entry.file_name().to_str() {
            nav_items.push(dir_name.to_string());
        }
    }

    nav_items.sort();
    Ok(nav_items)
}

async fn get_page_slug(path: &Path) -> Result<String> {
    let file_content = read_to_string(path).await?;
    let document = parse_content(&file_content)?;
    
    if let Some(slug) = document.metadata.slug {
        Ok(slug)
    } else if let Some(title) = document.metadata.title {
        Ok(title.to_lowercase()
            .replace(' ', "-")
            .replace(['(', ')', '[', ']', '{', '}', '/', '\\', ':', ';', ',', '.', '?', '!', '@', '#', '$', '%', '^', '&', '*', '+', '=', '|', '`', '~', '"', '\''], ""))
    } else {
        get_slug(path.to_string_lossy().as_ref()).await
    }
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

    let file_content = read_to_string(&index_path).await?;
    let document = parse_content(&file_content)?;

    let content = render_page(&document, "index.html", nav_items, None).await?;

    write(Path::new(output_dir).join("index.html"), content)
        .await
        .context("failed to write index.html")?;

    println!("✓ Created index.html");
    Ok(())
}

async fn create_static_pages(
    content_dir: &str,
    output_dir: &str,
    nav_items: &[String],
    include_drafts: bool,
) -> Result<()> {
    let static_dir = Path::new(content_dir).join("static");
    
    if !static_dir.exists() {
        println!("No static directory found, skipping static pages");
        return Ok(());
    }

    for entry in WalkDir::new(&static_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().and_then(|ext| ext.to_str()) == Some("md"))
    {
        let file_content = read_to_string(entry.path())
            .await
            .with_context(|| format!("Failed to read file: {}", entry.path().to_string_lossy()))?;

        let document = parse_content(&file_content)?;

        // Skip drafts unless include_drafts is true
        if document.metadata.draft.unwrap_or(false) && !include_drafts {
            continue;
        }

        let slug = get_page_slug(entry.path()).await
            .with_context(|| {
                format!(
                    "Failed to get slug of file: {}",
                    entry.path().to_string_lossy()
                )
            })?;

        let content = render_page(&document, "static.html", nav_items, None)
            .await
            .context(format!("Failed to render static page: {}", slug))?;

        // Write to root of output directory as slug.html
        let output_path = Path::new(output_dir).join(format!("{}.html", slug));
        write(&output_path, content)
            .await
            .context(format!("Failed to create static page: {}", slug))?;

        println!("✓ Created static page: {}.html", slug);
    }

    Ok(())
}

async fn create_blog_categories(
    content_dir: &str,
    output_dir: &str,
    nav_items: &[String],
    include_drafts: bool,
) -> Result<()> {
    let content_path = Path::new(content_dir);

    // Get all directories except static and the content root
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
            .with_context(|| format!("Failed to create blog category directory: {}", dir_name))?;

        let mut posts = Vec::new();

        // Process all markdown files in this blog category
        for post_entry in WalkDir::new(entry.path())
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.path().extension().and_then(|ext| ext.to_str()) == Some("md"))
        {
            let file_content = read_to_string(post_entry.path())
                .await
                .with_context(|| {
                    format!(
                        "Failed to read blog post file: {}",
                        post_entry.path().to_string_lossy()
                    )
                })?;

            let document = parse_content(&file_content)?;

            // Skip drafts unless include_drafts is true
            if document.metadata.draft.unwrap_or(false) && !include_drafts {
                continue;
            }

            let slug = get_page_slug(post_entry.path())
                .await
                .with_context(|| {
                    format!(
                        "Failed to get slug for blog post: {}",
                        post_entry.path().to_string_lossy()
                    )
                })?;

            // Create individual blog post
            let post_content = render_page(&document, "blog.html", nav_items, None)
                .await
                .with_context(|| format!("Failed to process blog post: {}", slug))?;

            let post_file_path = category_dir.join(format!("{}.html", slug));

            write(&post_file_path, &post_content)
                .await
                .with_context(|| format!("Failed to write blog post file: {}", slug))?;

            // Collect post info for category index
            let title = document
                .metadata
                .title
                .clone()
                .unwrap_or_else(|| slug.clone());

            let tags = document.metadata.tags.map(|tags_str| {
                tags_str.split(',')
                    .map(|tag| tag.trim().to_string())
                    .filter(|tag| !tag.is_empty())
                    .collect::<Vec<String>>()
            });

            posts.push(PostInfo {
                slug: slug.clone(),
                title: title.clone(),
                date: document.metadata.date.clone(),
                description: document.metadata.description.clone(),
                tags,
                url: format!("/{}/{}.html", dir_name, slug),
            });

            println!("✓ Created blog post: {}/{}.html", dir_name, slug);
        }

        // Sort posts by date (newest first) then by title
        posts.sort_by(|a, b| match (&b.date, &a.date) {
            (Some(date_b), Some(date_a)) => date_b.cmp(date_a),
            (Some(_), None) => std::cmp::Ordering::Less,
            (None, Some(_)) => std::cmp::Ordering::Greater,
            (None, None) => a.title.cmp(&b.title),
        });

        // Create category index page
        let index_content = create_category_index(dir_name, &posts, nav_items)?;

        let index_path = category_dir.join("index.html");

        write(&index_path, index_content)
            .await
            .with_context(|| format!("Failed to write blog category index for: {}", dir_name))?;

        println!(
            "✓ Created blog category index: {}/index.html with {} posts",
            dir_name,
            posts.len()
        );
    }

    Ok(())
}

async fn render_page(
    document: &Document, 
    template: &str, 
    nav_items: &[String],
    extra_context: Option<&tera::Context>
) -> Result<String> {
    let templ = get_embedded_files(template)?;

    let mut tera = Tera::default();
    tera.add_raw_template("document", &templ)?;

    let mut context = tera::Context::new();

    // Basic document fields
    context.insert("title", &document.metadata.title.as_deref().unwrap_or("Untitled"));
    context.insert("author", &document.metadata.author.as_deref().unwrap_or("Unknown"));
    context.insert("description", &document.metadata.description.as_deref().unwrap_or(""));
    context.insert("content", &document.html_content);
    context.insert("raw_content", &document.content);
    context.insert("navbar", nav_items);

    // Optional fields
    if let Some(date) = &document.metadata.date {
        context.insert("date", date);
    }

    if let Some(tags) = &document.metadata.tags {
        let tags_vec: Vec<String> = tags.split(',')
            .map(|tag| tag.trim().to_string())
            .filter(|tag| !tag.is_empty())
            .collect();
        context.insert("tags", &tags_vec);
    }

    if let Some(slug) = &document.metadata.slug {
        context.insert("slug", slug);
    }

    // Insert extra frontmatter fields if present
    if let Some(extra) = &document.metadata.extra {
        for (key, value) in extra {
            context.insert(key, value);
        }
    }

    // Add any extra context provided
    if let Some(extra_ctx) = extra_context {
        for (key, value) in extra_ctx.clone().into_json().as_object().unwrap() {
            context.insert(key, value);
        }
    }

    let rendered = tera
        .render("document", &context)
        .context("Failed to render template")?;

    Ok(rendered)
}

fn create_category_index(
    category: &str,
    posts: &[PostInfo],
    nav_items: &[String],
) -> Result<String> {
    // Use index.html template for category indexes
    let template_content = get_embedded_files("index.html")
        .context("Failed to get index.html template for category index")?;

    let mut tera = Tera::default();
    tera.add_raw_template("category_index", &template_content)?;

    let mut context = tera::Context::new();
    context.insert("title", &format!("{} Posts", category));
    context.insert("author", "Unknown");
    context.insert("description", &format!("All posts in the {} category", category));
    context.insert("navbar", nav_items);
    
    // Category-specific context
    context.insert("category", category);
    context.insert("category_title", &format!("{} - Posts", category.to_uppercase()));
    context.insert("posts", posts);
    
    // Create a simple HTML content listing all posts
    let posts_html = posts.iter()
        .map(|post| {
            let date_str = post.date.as_deref().unwrap_or("No date");
            let desc_str = post.description.as_deref().unwrap_or("No description");
            format!(
                r#"<article>
                    <h3><a href="{}">{}</a></h3>
                    <p class="post-meta">Date: {}</p>
                    <p>{}</p>
                </article>"#,
                post.url, post.title, date_str, desc_str
            )
        })
        .collect::<Vec<String>>()
        .join("\n");

    context.insert("content", &posts_html);
    context.insert("raw_content", &posts_html);

    let rendered = tera
        .render("category_index", &context)
        .context("Failed to render category index template")?;

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
        extra: None,
    });

    // Configure markdown options
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
