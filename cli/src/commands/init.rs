use anyhow::{Context, Error, Result};
use colored::Colorize;
use rust_embed::RustEmbed;
use std::{path::Path, time::SystemTime};
use time_util::print_system_time_to_rfc3339;
use tokio::fs::{self, create_dir_all};

#[derive(RustEmbed)]
#[folder = "static/"]
struct StaticAssets;

pub async fn init_project(name: &str) -> Result<()> {
    let path = Path::new(name);
    let content_dir = "content";

    create_dir_all(path)
        .await
        .with_context(|| format!("Failed to create directory: {}", name))?;

    let dirs = [
        "templates",
        &format!("{}/blog", content_dir),
        &format!("{}/static", content_dir),
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

    write_examples(&path.join(content_dir)).await?;

    println!("Initialized new project: {}", name);
    println!("{}", "run:".cyan());
    println!("    cd {}", name.cyan());
    println!("    {}", "grimoire build".cyan());

    Ok(())
}

async fn write_embedded_file(project_path: &Path, asset_path: &str) -> Result<()> {
    let content = get_embedded_file(asset_path)?;
    let out_path = project_path.join(asset_path);
    if let Some(parent) = out_path.parent() {
        create_dir_all(parent).await.with_context(|| {
            format!(
                "Failed to create parent directory for: {}",
                out_path.display()
            )
        })?;
    }

    fs::write(&out_path, content)
        .await
        .with_context(|| format!("Failed to write file to disk: {}", out_path.display()))?;
    Ok(())
}

async fn write_examples(outdir: &Path) -> Result<()> {
    let content = get_embedded_file("examples/blog.md")?;
    let now = SystemTime::now();
    let timestamp = print_system_time_to_rfc3339(&now)
        .replace(":", "-")
        .replace(".", "-");
    println!("{}", timestamp);

    let blog_path = Path::new(outdir)
        .join("blog")
        .join(format!("{}.md", timestamp));
    fs::write(&blog_path, &content)
        .await
        .with_context(|| format!("Failed to create example in blog dir"))?;

    let content = get_embedded_file("examples/static.md")?;
    let static_path = Path::new(outdir)
        .join("static")
        .join(format!("{}.md", timestamp));
    fs::write(static_path, content)
        .await
        .with_context(|| format!("Failed to create example in static dir"))?;

    let content = get_embedded_file("examples/index.md")?;
    fs::write(Path::new(outdir).join("index.md"), content)
        .await
        .with_context(|| format!("Failed to create index.md"))?;

    Ok(())
}

fn get_embedded_file(path: &str) -> Result<String, Error> {
    let file = StaticAssets::get(path)
        .ok_or_else(|| anyhow::anyhow!("failed to get embedded file: {}", path))?;

    String::from_utf8(file.data.to_vec())
        .map_err(|_| anyhow::anyhow!("failed to convert embedded file to string: {}", path))
}

#[cfg(test)]
mod tests {
    use tokio::fs::remove_dir_all;
    use walkdir::WalkDir;

    use super::*;

    #[tokio::test]
    async fn test_init_project() {
        let name = "test";
        let path = Path::new(name);
        let content_dir = "content";
        init_project(name)
            .await
            .map_err(|err| format!("failed to init project {}", err))
            .unwrap();

        assert!(Path::new(name).exists());

        let dirs = [
            "templates",
            &format!("{}/blog", content_dir),
            &format!("{}/static", content_dir),
            "static/js",
            "static/images",
            "static/styles",
        ];

        for dir in dirs {
            let dir_path = path.join(dir);
            assert!(
                dir_path.exists(),
                "Directory {} does not exist",
                dir_path.display()
            );
        }

        let template_files = [
            ("templates/index.hbs"),
            ("templates/blog.hbs"),
            ("templates/page.hbs"),
        ];

        for file in template_files {
            let template_path = path.join(file);
            assert!(
                template_path.exists(),
                "template {} does not exist",
                template_path.display()
            );
        }

        for entry in WalkDir::new("test/content") {
            println!("{:#?}", entry.unwrap().path().display());
        }

        for dir in dirs {
            let dir_path = path.join(dir);
            remove_dir_all(dir_path).await.unwrap();
        }
        remove_dir_all(Path::new(name)).await.unwrap();
    }
}
