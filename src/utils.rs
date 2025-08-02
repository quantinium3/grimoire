use std::path::Path;

use anyhow::{Context, Result};
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
    let path = Path::new(path);
    let file_name = path
        .file_stem()
        .and_then(|stem| stem.to_str())
        .context("Failed to extract file stem")?;
    Ok(file_name.to_lowercase().replace(' ', "-").replace(
        [
            '(', ')', '[', ']', '{', '}', '/', '\\', ':', ';', ',', '.', '?', '!', '@', '#', '$',
            '%', '^', '&', '*', '+', '=', '|', '`', '~', '"', '\'',
        ],
        "",
    ))
}
