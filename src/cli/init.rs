use crate::consts::GRIMOIRE_CONFIG_NAME;
use anyhow::{Context, Result, bail};
use dialoguer::{Confirm, Input};
use serde::Serialize;
use std::env::current_dir;
use std::path::{Path, PathBuf};
use std::time::SystemTime;
use time_util::print_system_time_to_rfc3339;
use tokio::fs::{create_dir_all, read_dir, write};

use crate::utils::get_embedded_files;

#[derive(Serialize, Debug, Clone)]
pub struct Config {
    pub project_name: String,
    pub content_dir: String,
    pub description: String,
    pub domain: String,
}

pub async fn init_project<P: AsRef<Path>>(path: P) -> Result<()> {
    let project_path = get_absolute_path(path).context("Failed to resolve project path")?;

    ensure_project_directory(&project_path)
        .await
        .context("Failed to prepare project directory")?;

    let project_name =
        extract_project_name(&project_path).context("Failed to determine project name")?;

    let config =
        collect_project_config(project_name).context("Failed to collect project configuration")?;

    create_project_structure(&config, &project_path)
        .await
        .context("Failed to create project structure")?;

    println!(
        "Project '{}' initialized successfully at {}",
        config.project_name,
        project_path.display()
    );

    Ok(())
}

async fn ensure_project_directory(project_path: &Path) -> Result<()> {
    create_dir_all(project_path)
        .await
        .with_context(|| format!("Failed to create directory: {}", project_path.display()))?;

    if !is_directory_empty(project_path).await? {
        let should_continue = Confirm::new()
            .with_prompt(format!(
                "Directory '{}' is not empty. Continue anyway?",
                project_path.display()
            ))
            .default(false)
            .interact()
            .context("Failed to get user confirmation")?;

        if !should_continue {
            bail!("Project initialization cancelled by user");
        }
    }

    Ok(())
}

fn extract_project_name(project_path: &Path) -> Result<String> {
    project_path
        .file_name()
        .and_then(|name| name.to_str())
        .map(|s| s.to_string())
        .context("Invalid project path: cannot determine project name")
}

async fn create_project_structure(config: &Config, project_path: &Path) -> Result<()> {
    create_config_file(config, project_path)
        .await
        .context("Failed to create configuration file")?;

    create_directory_structure(config, project_path)
        .await
        .context("Failed to create directory structure")?;

    create_template_files(project_path)
        .await
        .context("Failed to create template files")?;

    create_static_files(project_path)
        .await
        .context("Failed to create static files")?;

    create_example_content(config, project_path)
        .await
        .context("Failed to create example content")?;

    Ok(())
}

async fn create_config_file(config: &Config, project_path: &Path) -> Result<()> {
    let config_content =
        serde_json::to_string_pretty(config).context("Failed to serialize configuration")?;

    let config_path = project_path.join(GRIMOIRE_CONFIG_NAME);
    write(&config_path, config_content)
        .await
        .with_context(|| format!("Failed to write configuration to {}", config_path.display()))?;

    Ok(())
}

async fn create_directory_structure(config: &Config, project_path: &Path) -> Result<()> {
    let directories = [
        "templates",
        &format!("{}/blog", config.content_dir),
        &format!("{}/static", config.content_dir),
        "static/js",
        "static/css",
        "static/images",
    ];

    for dir in &directories {
        let dir_path = project_path.join(dir);
        create_dir_all(&dir_path)
            .await
            .with_context(|| format!("Failed to create directory: {}", dir_path.display()))?;
    }

    Ok(())
}

async fn create_template_files(project_path: &Path) -> Result<()> {
    let template_files = ["index.html", "blog.html", "static.html"];
    let templates_dir = project_path.join("templates");

    for template_file in template_files {
        let content = get_embedded_files(template_file)
            .with_context(|| format!("Failed to get embedded template: {}", template_file))?;

        let file_path = templates_dir.join(template_file);
        write(&file_path, content)
            .await
            .with_context(|| format!("Failed to write template: {}", file_path.display()))?;
    }

    Ok(())
}

async fn create_static_files(project_path: &Path) -> Result<()> {
    let static_dir = project_path.join("static");

    let static_files = [("style.css", "style.css"), ("script.js", "script.js")];

    for (embedded_name, file_name) in static_files {
        let content = get_embedded_files(embedded_name)
            .with_context(|| format!("Failed to get embedded file: {}", embedded_name))?;

        let file_path = static_dir.join(file_name);
        write(&file_path, content)
            .await
            .with_context(|| format!("Failed to write static file: {}", file_path.display()))?;
    }

    Ok(())
}

async fn create_example_content(config: &Config, project_path: &Path) -> Result<()> {
    let now = SystemTime::now();
    let timestamp = generate_timestamp(&now)?;

    let content_types = ["blog", "static"];

    for content_type in &content_types {
        let content = get_embedded_files(&format!("{}.md", content_type))
            .with_context(|| format!("Failed to get embedded content: {}.md", content_type))?;

        let content_path = project_path
            .join(&config.content_dir)
            .join(content_type)
            .join(format!("{}.md", timestamp));

        write(&content_path, content).await.with_context(|| {
            format!(
                "Failed to write example content: {}",
                content_path.display()
            )
        })?;
    }

    let index_content =
        get_embedded_files("index.md").context("Failed to get embedded index.md")?;

    let index_path = project_path.join(&config.content_dir).join("index.md");
    write(&index_path, index_content)
        .await
        .with_context(|| format!("Failed to write index.md: {}", index_path.display()))?;

    Ok(())
}

fn collect_project_config(project_name: String) -> Result<Config> {
    println!("Setting up Grimoire: {}\n", project_name);

    let should_continue = Confirm::new()
        .with_prompt("Do you want to continue with project initialization?")
        .default(true)
        .interact()
        .context("Failed to get initialization confirmation")?;

    if !should_continue {
        bail!("Project initialization cancelled");
    }

    let content_dir = Input::<String>::new()
        .with_prompt("Content directory name")
        .default("content".to_string())
        .interact_text()
        .context("Failed to get content directory name")?;

    let description = Input::<String>::new()
        .with_prompt("Project description")
        .default(format!("A new Grimoire project: {}", project_name))
        .interact_text()
        .context("Failed to get project description")?;

    let domain = Input::<String>::new()
        .with_prompt("Project domain")
        .default("http://localhost:8080".to_string())
        .interact_text()
        .context("Failed to get project domain")?;

    Ok(Config {
        project_name,
        content_dir,
        description,
        domain,
    })
}

async fn is_directory_empty<P: AsRef<Path>>(path: P) -> Result<bool> {
    let path_ref = path.as_ref();

    if !path_ref.exists() {
        bail!(format!(
            "Directory doesnt exist: {}",
            path.as_ref().display()
        ));
    }

    let mut entries = read_dir(path_ref)
        .await
        .with_context(|| format!("Failed to read directory: {}", path_ref.display()))?;

    Ok(entries.next_entry().await?.is_none())
}

fn get_absolute_path<P: AsRef<Path>>(path: P) -> Result<PathBuf> {
    let path_ref = path.as_ref();

    if path_ref.is_absolute() {
        Ok(path_ref.to_path_buf())
    } else {
        let current = current_dir().context("Failed to get current working directory")?;
        Ok(current.join(path_ref))
    }
}

fn generate_timestamp(time: &SystemTime) -> Result<String> {
    let timestamp = print_system_time_to_rfc3339(time)
        .replace(':', "-")
        .replace('.', "-");
    Ok(timestamp)
}
