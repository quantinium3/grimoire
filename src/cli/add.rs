use crate::{
    consts::GRIMOIRE_CONFIG_NAME,
    utils::{get_content_dir, get_embedded_files},
};
use anyhow::{Context, Result, bail};
use std::{path::Path, time::SystemTime};
use time_util::print_system_time_to_rfc3339;
use tokio::fs::{create_dir_all, write};

pub async fn add_content<P: AsRef<Path>>(dirname: P) -> Result<()> {
    if !Path::new(GRIMOIRE_CONFIG_NAME).exists() {
        bail!(
            "Failed to add content: Are you inside the project dir? Have you run `grimoire init`?"
        );
    }

    let content_dir_str = get_content_dir()
        .await
        .context("failed to get content directory")?;

    let content_dir = Path::new(&content_dir_str);

    let dirname_path = dirname.as_ref();
    let path = if dirname_path == Path::new("static") {
        content_dir.join("static")
    } else {
        content_dir.join(dirname_path)
    };

    if !path.exists() {
        create_dir_all(&path)
            .await
            .with_context(|| format!("failed to create directory: {}", path.display()))?;
    }

    let filename = format!(
        "{}.md",
        get_timestamp().context("Failed to get timestamp to create a new file")?
    );

    let content_type = if dirname_path == Path::new("static") {
        "static.md"
    } else {
        "blog.md"
    };
    let contents = get_embedded_files(content_type)
        .with_context(|| format!("Failed to get: {}", content_type))?;

    write(&path.join(&filename), contents)
        .await
        .with_context(|| format!("Failed to create file: {}", filename))?;
    Ok(())
}

fn get_timestamp() -> Result<String> {
    let now = SystemTime::now();
    let timestamp = print_system_time_to_rfc3339(&now)
        .replace(':', "-")
        .replace('.', "-");
    Ok(timestamp)
}
