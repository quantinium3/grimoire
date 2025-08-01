use serde::Deserialize;
use std::collections::HashMap;

use anyhow::{Context, Result};
use comrak::{Options, Plugins, markdown_to_html_with_plugins};
use gray_matter::{Matter, engine::YAML};
use rust_embed::RustEmbed;
use tokio::fs::read_to_string;

use crate::consts::{Config, FrontMatter, GRIMOIRE_CONFIG_NAME};

#[derive(RustEmbed)]
#[folder = "static"]
struct StaticAssets;

pub fn get_embedded_files(path: &str) -> Result<String> {
    let file =
        StaticAssets::get(path).context(format!("Failed to get the embedded file: {}", path))?;

    Ok(String::from_utf8(file.data.to_vec())
        .context("Failed to convert embedded file to string")?)
}

pub async fn get_content_dir() -> Result<String> {
    let file = read_to_string(GRIMOIRE_CONFIG_NAME)
        .await
        .context(format!("Failed to read: {}", GRIMOIRE_CONFIG_NAME))?;

    let config: Config = serde_json::from_str(&file)?;
    Ok(config.content_dir)
}

pub async fn get_slug(path: &str) -> Result<String> {
    let content = read_to_string(path)
        .await
        .context("Failed to read contents of file and get the title")?;
    let matter = Matter::<YAML>::new();
    let result = matter
        .parse::<FrontMatter>(content.as_str())
        .context("Failed to parse frontmatter from content")?;
    let title = result
        .data
        .as_ref()
        .context("failed to get title")?
        .title
        .to_owned();
    Ok(title)
}
