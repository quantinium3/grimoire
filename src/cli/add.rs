use anyhow::{Context, Result, bail};
use std::{path::Path, time::SystemTime};
use time_util::print_system_time_to_rfc3339;
use tokio::fs::write;

use crate::{
    consts::GRIMOIRE_CONFIG_NAME,
    utils::{get_content_dir, get_embedded_files},
};

pub async fn add_content(dirname: &str) -> Result<()> {
    if !Path::new(GRIMOIRE_CONFIG_NAME).exists() {
        bail!("Failed to add content. are you inside the project dir? have you run grimoire init?")
    }

    let dir = match dirname {
        "static" => Path::new("static"),
        _ => Path::new(dirname),
    };

    let content_type = match dirname {
        "static" => "static.md",
        _ => "blog.md",
    };
    let now = SystemTime::now();
    let timestamp = print_system_time_to_rfc3339(&now)
        .replace(":", "-")
        .replace(".", "-");

    let contents = get_embedded_files(content_type)?;
    let content_dir = get_content_dir().await?;

    let content_path = Path::new(content_dir.as_str());
    write(
        content_path.join(dir).join(format!("{}.md", timestamp)),
        contents,
    )
    .await
    .context("Failed to create new file");

    Ok(())
}
