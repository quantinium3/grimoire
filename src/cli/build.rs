use crate::{
    consts::FrontMatter,
    utils::{copy_dir, get_config, get_content_dir, get_slug},
};
use anyhow::{Context, Result, bail};
use comrak::{adapters::SyntaxHighlighterAdapter, markdown_to_html_with_plugins, Options, Plugins};
use gray_matter::{Matter, engine::YAML};
use serde::Serialize;
use std::{collections::HashMap, path::Path};
use tera::Tera;
use tokio::fs::{copy, create_dir_all, read_to_string, write};
use walkdir::WalkDir;
use syntect::{highlighting::ThemeSet, html::{css_for_theme_with_class_style, ClassStyle, ClassedHTMLGenerator}};
use syntect::parsing::SyntaxSet;
use syntect::util::LinesWithEndings;

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

#[derive(Debug, PartialEq, Serialize)]
enum NavType {
    FILE,
    DIR,
}

#[derive(Debug, Serialize, PartialEq)]
struct NavItem {
    name: String,
    nav_type: NavType,
}

struct SyntectAdapter {
    syntax_set: SyntaxSet,
}

impl SyntectAdapter {
    fn new() -> Self {
        Self {
            syntax_set: SyntaxSet::load_defaults_newlines(),
        }
    }
}


impl SyntaxHighlighterAdapter for SyntectAdapter {
    fn write_highlighted(
        &self,
        output: &mut dyn std::io::Write,
        lang: Option<&str>,
        code: &str,
    ) -> std::io::Result<()> {
        let lang = lang.unwrap_or("text");
        let syntax = self.syntax_set
            .find_syntax_by_token(lang)
            .unwrap_or_else(|| self.syntax_set.find_syntax_plain_text());
        
        let mut html_generator = ClassedHTMLGenerator::new_with_class_style(
            syntax, 
            &self.syntax_set, 
            ClassStyle::Spaced
        );
        
        for line in LinesWithEndings::from(code) {
            html_generator.parse_html_for_line_which_includes_newline(line)
                .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;
        }
        
        write!(output, "{}", html_generator.finalize())?;
        Ok(())
    }

    fn write_pre_tag(
        &self,
        output: &mut dyn std::io::Write,
        _attributes: HashMap<String, String>,
    ) -> std::io::Result<()> {
        output.write_all(b"<pre class=\"code\">")?;
        Ok(())
    }

    fn write_code_tag(
        &self,
        output: &mut dyn std::io::Write,
        _attributes: HashMap<String, String>,
    ) -> std::io::Result<()> {
        output.write_all(b"<code>")?;
        Ok(())
    }
}

pub async fn build_content<P: AsRef<Path>>(include_draft: bool, output_dir: P) -> Result<()> {
    let content_dir = get_content_dir()
        .await
        .context("Failed to get content directory")?;

    let content_dir = Path::new(content_dir.as_str());
    create_dir_all(&output_dir)
        .await
        .context("Failed to create output dir")?;

    let nav_items = get_nav_items(&content_dir)
        .await
        .context("Failed to get navbar items")?;


    generate_syntax_themes(&output_dir.as_ref()).await?;

    let static_dir = Path::new("static");
    create_index_page(&content_dir, &output_dir.as_ref(), &nav_items).await?;
    create_static_pages(&content_dir, output_dir.as_ref(), &nav_items, include_draft).await?;
    create_blog_categories(&content_dir, output_dir.as_ref(), &nav_items, include_draft).await?;
    copy_static_content(&static_dir, output_dir.as_ref()).await?;
    Ok(())
}

async fn copy_static_content(static_dir: &Path, output_dir: &Path) -> Result<()> {
    copy_dir(static_dir.join("images"), output_dir.join("images"))
        .await
        .context("failed to copy images")?;

    copy(static_dir.join("style.css"), output_dir.join("style.css"))
        .await
        .context("failed to copy style.css")?;

    copy(static_dir.join("script.js"), output_dir.join("script.js"))
        .await
        .context("failed to copy script.js")?;

    Ok(())
}

async fn generate_syntax_themes(output_dir: &Path) -> Result<()> {
    let theme_set = ThemeSet::load_defaults();
    
    let dark_theme = &theme_set.themes["base16-mocha.dark"];
    let css_dark = css_for_theme_with_class_style(dark_theme, ClassStyle::Spaced)
        .context("Failed to generate dark theme CSS")?;
    
    write(output_dir.join("theme-dark.css"), css_dark).await
        .context("Failed to write dark theme CSS")?;
    
    let light_theme = &theme_set.themes["base16-ocean.light"];
    let css_light = css_for_theme_with_class_style(light_theme, ClassStyle::Spaced)
        .context("Failed to generate light theme CSS")?;
    
    write(output_dir.join("theme-light.css"), css_light).await
        .context("Failed to write light theme CSS")?;
    
    let main_css = r#"
/* Syntax highlighting with automatic light/dark theme switching */
@import url("theme-light.css") (prefers-color-scheme: light);
@import url("theme-dark.css") (prefers-color-scheme: dark);

/* Default to light theme for older browsers */
@import url("theme-light.css");

/* Code block styling */
.code {
    font-family: 'Fira Code', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 1rem 0;
}

/* Light theme body styling */
@media (prefers-color-scheme: light) {
    .code {
        background-color: #fdf6e3;
        border: 1px solid #eee8d5;
    }
}

/* Dark theme body styling */
@media (prefers-color-scheme: dark) {
    .code {
        background-color: #002b36;
        border: 1px solid #073642;
    }
}
"#;
    
    write(output_dir.join("syntax.css"), main_css).await
        .context("Failed to write main syntax CSS")?;
    
    Ok(())
}

fn create_highlighted_content(input: &str, options: &Options) -> Result<String> {
    let adapter = SyntectAdapter::new();
    let mut plugins = Plugins::default();
    plugins.render.codefence_syntax_highlighter = Some(&adapter);

    Ok(markdown_to_html_with_plugins(input, options, &plugins))
}

async fn create_blog_categories(
    content_dir: &Path,
    output_dir: &Path,
    nav_items: &[NavItem],
    include_drafts: bool,
) -> Result<()> {
    for entry in WalkDir::new(content_dir)
        .min_depth(1)
        .max_depth(1)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_dir())
        .filter(|e| {
            if let Some(dir_name) = e.file_name().to_str() {
                !dir_name.starts_with('.') && dir_name != "static"
            } else {
                false
            }
        })
    {
        let dir_name = entry.file_name().to_string_lossy();
        let category_dir = output_dir.join(dir_name.as_ref());

        create_dir_all(&category_dir)
            .await
            .with_context(|| format!("Failed to create blog category directory: {}", dir_name))?;

        let mut posts = Vec::new();

        for post_entry in WalkDir::new(entry.path())
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.path().extension().and_then(|ext| ext.to_str()) == Some("md"))
        {
            let file_content = read_to_string(post_entry.path()).await.with_context(|| {
                format!(
                    "Failed to read blog post file: {}",
                    post_entry.path().to_string_lossy()
                )
            })?;

            let document = parse_content(&file_content, post_entry.path()).await?;
            if document.metadata.draft.unwrap_or(false) && !include_drafts {
                continue;
            }

            let slug = get_slug(post_entry.path()).await.with_context(|| {
                format!(
                    "Failed to get slug for blog post: {}",
                    post_entry.path().to_string_lossy()
                )
            })?;

            let post_content = render_page(&document, "static.html", nav_items)
                .await
                .with_context(|| format!("Failed to process blog post: {}", slug))?;

            let post_file_path = category_dir.join(format!("{}.html", slug));

            write(&post_file_path, &post_content)
                .await
                .with_context(|| format!("Failed to write blog post file: {}", slug))?;

            let title = document.metadata.title.clone();

            let tags = document.metadata.tags.as_ref().map(|tags_str| {
                tags_str
                    .split(',')
                    .map(|tag| tag.trim().to_string())
                    .filter(|tag| !tag.is_empty())
                    .collect::<Vec<String>>()
            });

            posts.push(PostInfo {
                slug: slug.clone(),
                title,
                date: document.metadata.date.clone(),
                description: document.metadata.description.clone(),
                tags,
                url: format!("/{}/{}.html", dir_name, &slug),
            });

            println!("✓ Created blog post: {}/{}.html", dir_name, slug);
        }

        posts.sort_by(|a, b| match (&b.date, &a.date) {
            (Some(date_b), Some(date_a)) => date_b.cmp(date_a),
            (Some(_), None) => std::cmp::Ordering::Less,
            (None, Some(_)) => std::cmp::Ordering::Greater,
            (None, None) => a.title.cmp(&b.title),
        });

        // Category index uses blog.html template (the listing template)
        let index_content = create_category_index(dir_name.as_ref(), &posts, nav_items).await?;

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

async fn create_category_index(
    category: &str,
    posts: &[PostInfo],
    nav_items: &[NavItem],
) -> Result<String> {
    // Use blog.html template for category listings
    let template_file = Path::new("templates").join("index.html");
    let template_content = read_to_string(&template_file)
        .await
        .with_context(|| format!("Failed to read template file: {:?}", template_file))?;

    let mut tera = Tera::default();
    tera.add_raw_template("category_index", &template_content)?;
    let config = get_config().await?;

    let mut context = tera::Context::new();
    context.insert("heading", &config.project);
    context.insert("title", &format!("{} Posts", category));
    context.insert("author", &config.author);
    context.insert(
        "description",
        &format!("All posts in the {} category", category),
    );
    context.insert("navbar", nav_items);
    context.insert("posts", posts);

    let rendered = tera
        .render("category_index", &context)
        .context("Failed to render category index template")?;

    Ok(rendered)
}

async fn create_static_pages(
    content_dir: &Path,
    output_dir: &Path,
    nav_items: &[NavItem],
    include_drafts: bool,
) -> Result<()> {
    let static_dir = content_dir.join("static");

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

        let document = parse_content(&file_content, entry.path()).await?;
        if document.metadata.draft.unwrap_or(false) && !include_drafts {
            continue;
        }

        let slug = get_slug(entry.path()).await.with_context(|| {
            format!(
                "Failed to get slug of file: {}",
                entry.path().to_string_lossy()
            )
        })?;

        // Static pages use static.html template and are stored at root
        let content = render_page(&document, "static.html", nav_items)
            .await
            .with_context(|| format!("Failed to render static page: {}", slug))?;

        let output_path = output_dir.join(format!("{}.html", slug));
        write(&output_path, content)
            .await
            .with_context(|| format!("Failed to create static page: {}", slug))?;

        println!("✓ Created static page: {}.html", slug);
    }

    Ok(())
}

async fn create_index_page(
    content_dir: &Path,
    output_dir: &Path,
    nav_items: &[NavItem],
) -> Result<()> {
    let index_path = content_dir.join("index.md");

    if !index_path.exists() {
        bail!("index.md doesn't exist in content directory");
    }

    let file_content = read_to_string(&index_path).await?;
    let document = parse_content(&file_content, &index_path).await?;

    let content = render_page(&document, "static.html", nav_items).await?;

    write(output_dir.join("index.html"), content)
        .await
        .context("failed to write index.html")?;

    println!("✓ Created index.html");
    Ok(())
}

async fn render_page(document: &Document, template: &str, nav_items: &[NavItem]) -> Result<String> {
    let templ = read_to_string(Path::new("templates").join(template))
        .await
        .with_context(|| format!("Failed to read template file: {}", template))?;
    let config = get_config().await.context("Failed to get project name")?;

    let mut tera = Tera::default();
    tera.add_raw_template("document", &templ)?;

    let mut context = tera::Context::new();

    context.insert("heading", &config.project);
    context.insert("title", &document.metadata.title);
    context.insert(
        "author",
        &document
            .metadata
            .author
            .as_deref()
            .unwrap_or(&config.author),
    );
    context.insert(
        "description",
        &document.metadata.description.as_deref().unwrap_or(""),
    );
    context.insert("content", &document.html_content);
    context.insert("raw_content", &document.content);
    context.insert("navbar", nav_items);
    if let Some(date) = &document.metadata.date {
        context.insert("date", date);
    }
    if let Some(tags) = &document.metadata.tags {
        let tags_vec: Vec<String> = tags
            .split(',')
            .map(|tag| tag.trim().to_string())
            .filter(|tag| !tag.is_empty())
            .collect();
        context.insert("tags", &tags_vec);
    }
    if let Some(extra) = &document.metadata.extra {
        for (key, value) in extra {
            context.insert(key, value);
        }
    }
    let rendered = tera
        .render("document", &context)
        .context("Failed to render template")?;

    Ok(rendered)
}

async fn parse_content(input: &str, path: &Path) -> Result<Document> {
    let matter = Matter::<YAML>::new();
    let result = matter
        .parse::<FrontMatter>(input)
        .context("Failed to parse frontmatter in markdown")?;
    let metadata = if let Some(data) = result.data {
        data
    } else {
        FrontMatter {
            title: "Untitled".to_string(),
            author: None,
            date: None,
            tags: None,
            description: None,
            slug: get_slug(path).await?,
            draft: None,
            extra: None,
        }
    };

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
    options.render.unsafe_ = true;

    let html_content = create_highlighted_content(&result.content, &options)?;

    Ok(Document {
        metadata,
        content: result.content,
        html_content,
    })
}

async fn get_nav_items<P: AsRef<Path>>(content_dir: P) -> Result<Vec<NavItem>> {
    let mut nav_items: Vec<NavItem> = Vec::new();

    let static_dir = content_dir.as_ref().join("static");
    if static_dir.exists() {
        for entry in WalkDir::new(&static_dir)
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.path().extension().and_then(|ext| ext.to_str()) == Some("md"))
        {
            let slug = get_slug(entry.path()).await?;
            nav_items.push(NavItem {
                name: slug,
                nav_type: NavType::FILE,
            });
        }
    }

    let dirs = WalkDir::new(&content_dir)
        .min_depth(1)
        .max_depth(1)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|entry| entry.file_type().is_dir())
        .filter(|entry| entry.file_name() != "static")
        .map(|entry| NavItem {
            name: entry.file_name().to_string_lossy().into(),
            nav_type: NavType::DIR,
        })
        .collect::<Vec<NavItem>>();

    nav_items.extend(dirs);

    Ok(nav_items)
}

