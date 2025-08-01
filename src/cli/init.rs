use crate::{
    consts::{Config, GRIMOIRE_CONFIG_NAME},
    utils::get_embedded_files,
};
use anyhow::{Context, Result, bail};
use colored::Colorize;
use dialoguer::{Confirm, Input};
use rust_embed::RustEmbed;
use std::{path::Path, time::SystemTime};
use time_util::print_system_time_to_rfc3339;
use tokio::fs::{create_dir_all, write};

#[derive(RustEmbed)]
#[folder = "static"]
struct StaticAssets;

pub async fn init_project(project_name: &str) -> Result<()> {
    let project_path = Path::new(project_name);

    // initialize dir | templates | examples | config
    let content_dir = create_init_config(project_name).await?;
    create_init_dirs(project_path, &content_dir).await?;
    create_init_templates(project_path).await?;
    create_init_examples(project_path, &content_dir).await?;

    println!("Initialized new project: {}", project_name);
    println!("{}", "run:".bold().cyan());
    println!("    cd {}", project_name.cyan());
    println!("    {}", "grimoire build".cyan());
    Ok(())
}

async fn create_init_templates(project_path: &Path) -> Result<()> {
    let files = ["index.html", "page.html", "post.html"];
    for file in files {
        let contents = get_embedded_files(file)?;
        write(project_path.join("templates").join(file), contents)
            .await
            .context(format!("Failed to write template: {}", file))?;
    }
    Ok(())
}

async fn create_init_config(project_name: &str) -> Result<String> {
    let confirm = Confirm::new()
        .with_prompt("Do you want to continue?")
        .interact()
        .context("Failed to confirm initialization")?;

    if !confirm {
        bail!("Failed to init grimoire: confirmation negative");
    }

    let content_dir = Input::<String>::new()
        .with_prompt("Enter content directory name (default: content): ")
        .default("content".into())
        .interact_text()
        .context("Failed to input content directory")?;

    let description = Input::<String>::new()
        .with_prompt("Enter description: ")
        .default("".into())
        .interact_text()
        .context("Failed to input project description")?;

    let domain = Input::<String>::new()
        .with_prompt("Enter project domain: ")
        .default("http://localhost".into())
        .interact_text()
        .context("Failed to input project domain")?;

    let config = Config {
        project_name: project_name.to_string(),
        content_dir: content_dir.clone(),
        description,
        domain,
    };

    let contents = serde_json::to_string(&config).context("Failed to parse config")?;

    let project_path = Path::new(project_name);
    write(project_path.join(GRIMOIRE_CONFIG_NAME), contents)
        .await
        .context(format!("Failed to write to {}", GRIMOIRE_CONFIG_NAME))?;
    Ok(content_dir)
}

async fn create_init_examples(project_path: &Path, content_dir: &str) -> Result<()> {
    let dirs = ["blog", "static"];
    let now = SystemTime::now();
    for dir in dirs {
        let contents = get_embedded_files(&format!("{}.md", dir))?;
        let timestamp = print_system_time_to_rfc3339(&now)
            .replace(":", "-")
            .replace(".", "-");
        write(
            project_path
                .join(content_dir)
                .join(dir)
                .join(&format!("{}.md", timestamp)),
            contents,
        )
        .await
        .context("failed to write init examples")?;
    }

    // write to /index.md for root
    let contents = get_embedded_files("index.md")?;
    write(project_path.join(content_dir).join("index.md"), contents)
        .await
        .context("Failed to write to index.md")?;
    Ok(())
}

async fn create_init_dirs(project_path: &Path, content_dir: &str) -> Result<()> {
    let dirs = [
        "templates",
        &format!("{}/blog", content_dir),
        &format!("{}/static", content_dir),
        "static/js",
        "static/css",
        "static/images",
    ];

    for dir in dirs {
        let dir_path = project_path.join(dir);
        create_dir_all(&dir_path)
            .await
            .with_context(|| format!("Failed to create directory: {}", dir_path.display()))?;
    }

    Ok(())
}
