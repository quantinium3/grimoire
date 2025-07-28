use anyhow::{Context, Result};
use colored::Colorize;
use rust_embed::RustEmbed;
use std::path::Path;
use tokio::fs::{self, create_dir_all};

#[derive(RustEmbed)]
#[folder = "static/"]
struct StaticAssets;

pub async fn init_project(name: &str) -> Result<()> {
    let path = Path::new(name);

    create_dir_all(path)
        .await
        .with_context(|| format!("Failed to create directory: {}", name))?;

    let dirs = [
        "templates",
        "content/blog",
        "content/pages",
        "static/js",
        "static/images",
        "static/styles",
    ];

    for dir in dirs {
        let dir_path = path.join(dir);
        create_dir_all(&dir_path)
            .await
            .with_context(|| format!("Failed to create directory: {}", dir_path.display()))?;
    }

    let template_files = [
        ("templates/index.hbs"),
        ("templates/blog.hbs"),
        ("templates/page.hbs"),
    ];

    for file in template_files {
        write_embedded_file(path, file)
            .await
            .with_context(|| format!("Failed to write file: {}", file))?;
    }

    println!("Initialized new project: {}", name);
    println!("{}", "run:".cyan());
    println!("    cd {}", name.cyan());
    println!("    {}", "grimoire build".cyan());

    Ok(())
}

async fn write_embedded_file(project_path: &Path, asset_path: &str) -> Result<()> {
    let content = StaticAssets::get(asset_path)
        .with_context(|| format!("failed to get embedded file: {}", asset_path))?;
    let out_path = project_path.join(asset_path);
    if let Some(parent) = out_path.parent() {
        create_dir_all(parent).await.with_context(|| {
            format!(
                "Failed to create parent directory for: {}",
                out_path.display()
            )
        })?;
    }

    fs::write(&out_path, content.data.as_ref())
        .await
        .with_context(|| format!("Failed to write file to disk: {}", out_path.display()))?;
    Ok(())
}
