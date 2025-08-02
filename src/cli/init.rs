use crate::{
    consts::{Config, GRIMOIRE_CONFIG_NAME},
    utils::get_embedded_files,
};
use anyhow::{Context, Result, bail};
use colored::Colorize;
use dialoguer::{Confirm, Input};
use rust_embed::RustEmbed;
use std::{env, path::Path, time::SystemTime};
use time_util::print_system_time_to_rfc3339;
use tokio::fs::{create_dir_all, write};

#[derive(RustEmbed)]
#[folder = "static"]
struct StaticAssets;

pub async fn init_project<P: AsRef<Path>>(path: P) -> Result<()> {
    let path = path.as_ref();

    let (project_path, project_name) = resolve_project_path_and_name(path)?;

    create_dir_all(&project_path).await.with_context(|| {
        format!(
            "Failed to create project directory: {}",
            project_path.display()
        )
    })?;

    if project_path.exists() && project_path.is_dir() {
        let is_empty = project_path
            .read_dir()
            .context("Failed to read project directory")?
            .next()
            .is_none();

        if !is_empty && path.to_string_lossy() != "." {
            let confirm = Confirm::new()
                .with_prompt(&format!(
                    "Directory '{}' already exists and is not empty. Continue anyway?",
                    project_path.display()
                ))
                .interact()
                .context("Failed to confirm initialization")?;

            if !confirm {
                bail!("Initialization cancelled");
            }
        }
    }

    // Initialize project components
    let content_dir = create_init_config(&project_path, &project_name).await?;
    create_init_dirs(&project_path, &content_dir).await?;
    create_init_templates(&project_path).await?;
    create_init_examples(&project_path, &content_dir).await?;

    println!("Initialized new project: {}", project_name);
    println!("{}", "run:".bold().cyan());

    if path.to_string_lossy() != "." {
        println!("    cd {}", project_path.display().to_string().cyan());
    }
    println!("    {}", "grimoire build".cyan());
    Ok(())
}

fn resolve_project_path_and_name(path: &Path) -> Result<(&Path, String)> {
    if path.to_string_lossy() == "." {
        let current_dir = env::current_dir().context("Failed to get current directory")?;
        let project_name = current_dir
            .file_name()
            .and_then(|name| name.to_str())
            .context("Failed to get current directory name")?
            .to_string();
        Ok((path, project_name))
    } else if path.is_absolute() {
        let project_name = path
            .file_name()
            .and_then(|name| name.to_str())
            .context("Failed to get project name from absolute path")?
            .to_string();
        Ok((path, project_name))
    } else {
        let project_name = path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or_else(|| path.to_str().unwrap_or("project"))
            .to_string();
        Ok((path, project_name))
    }
}

async fn create_init_templates<P: AsRef<Path>>(project_path: P) -> Result<()> {
    let project_path = project_path.as_ref();
    let files = ["index.html", "blog.html", "static.html"];

    for file in files {
        let contents = get_embedded_files(file)?;
        write(project_path.join("templates").join(file), contents)
            .await
            .context(format!("Failed to write template: {}", file))?;
    }
    Ok(())
}

async fn create_init_config<P: AsRef<Path>>(project_path: P, project_name: &str) -> Result<String> {
    let project_path = project_path.as_ref();

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

    write(project_path.join(GRIMOIRE_CONFIG_NAME), contents)
        .await
        .context(format!("Failed to write to {}", GRIMOIRE_CONFIG_NAME))?;

    Ok(content_dir)
}

async fn create_init_examples<P: AsRef<Path>>(project_path: P, content_dir: &str) -> Result<()> {
    let project_path = project_path.as_ref();
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

async fn create_init_dirs<P: AsRef<Path>>(project_path: P, content_dir: &str) -> Result<()> {
    let project_path = project_path.as_ref();
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
