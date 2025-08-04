use std::path::Path;

use anyhow::{Context, Result, anyhow, bail};
use gray_matter::{Matter, engine::YAML};
use rust_embed::RustEmbed;
use tokio::fs::{copy, create_dir_all, read_to_string};
use walkdir::WalkDir;

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

pub async fn get_config() -> Result<Config> {
    let file = read_to_string(GRIMOIRE_CONFIG_NAME)
        .await
        .context(format!("Failed to read: {}", GRIMOIRE_CONFIG_NAME))?;

    let config: Config = serde_json::from_str(&file)?;
    Ok(config)
}

pub async fn get_slug<P: AsRef<Path>>(path: P) -> Result<String> {
    let path_ref = path.as_ref();
    let content = read_to_string(path_ref)
        .await
        .with_context(|| format!("Failed to read file: {}", path_ref.display()))?;

    let matter = Matter::<YAML>::new();
    let res = matter.parse::<FrontMatter>(&content);

    let data = res?
        .data
        .ok_or_else(|| anyhow!("No frontmatter found in file: {}", path_ref.display()))?;

    Ok(data.slug)
}

pub async fn copy_dir<A: AsRef<Path>, B: AsRef<Path>>(from: A, to: B) -> Result<()> {
    let from = from.as_ref();
    let to = to.as_ref();

    if !from.exists() {
        bail!(
            "Source path {} does not exist",
            from.to_str().unwrap_or("<invalid path>")
        );
    }

    if !from.is_dir() {
        bail!(
            "Source path {} is not a directory",
            from.to_str().unwrap_or("<invalid_path>")
        );
    }

    create_dir_all(to)
        .await
        .context(format!("Failed to create directory: {:?}", to))?;

    for entry in WalkDir::new(from).into_iter().filter_map(|e| e.ok()) {
        let entry_path = entry.path();

        let rel_path = entry_path.strip_prefix(from)?;
        let dest_path = to.join(rel_path);

        if entry.file_type().is_dir() {
            if !dest_path.exists() {
                create_dir_all(&dest_path)
                    .await
                    .context(format!("Failed to create directory: {:?}", dest_path))?;
            }
        } else {
            if let Some(parent) = dest_path.parent() {
                create_dir_all(parent)
                    .await
                    .context(format!("Failed to create parent directory: {:?}", parent))?;
            }

            let _bytes_copied = copy(entry_path, &dest_path).await.context(format!(
                "Failed to copy file from {:?} to {:?}",
                entry_path, dest_path
            ))?;
        }
    }

    Ok(())
}
