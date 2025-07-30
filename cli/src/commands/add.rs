use anyhow::{Context, Result};
use rust_embed::RustEmbed;
use std::{path::Path, time::SystemTime};
use time_util::print_system_time_to_rfc3339;
use tokio::fs::create_dir_all;

#[derive(RustEmbed)]
#[folder = "static/"]
struct StaticAssets;

pub async fn add_content(directory: &str) -> Result<()> {
    let now = SystemTime::now();
    let asset_path_buf = match directory {
        "static" => Path::new("examples").join("static.md"),
        _ => Path::new("examples").join("blog.md"),
    };
    let asset_path = asset_path_buf
        .to_str()
        .ok_or_else(|| anyhow::anyhow!("failed to convert path to string: {:?}", asset_path_buf))?;

    let content = get_embedded_file(asset_path)
        .with_context(|| format!("failed to get embedded file at: {}", asset_path))?;

    let timestamp = print_system_time_to_rfc3339(&now)
        .replace(":", "-")
        .replace(".", "-");

    if !Path::new("content").exists() {
        println!("No content directory found. Did you run `grimoire init`")
    }

    let outpath = Path::new("content")
        .join(directory)
        .join(format!("{}.md", timestamp));

    if let Some(parent) = outpath.parent() {
        create_dir_all(parent)
            .await
            .with_context(|| format!("failed to create directory: {}", parent.display()))?;
    }

    tokio::fs::write(&outpath, content)
        .await
        .with_context(|| format!("failed to write file: {}", outpath.display()))?;

    println!("Created file: {}", outpath.display());
    println!("creating directory and file the following detail: ");
    Ok(())
}

fn get_embedded_file(path: &str) -> Result<String> {
    let file = StaticAssets::get(path)
        .with_context(|| format!("failed to get embedded file: {}", path))?;

    String::from_utf8(file.data.to_vec())
        .with_context(|| format!("failed to convert embedded file to UTF-8: {}", path))
}

mod tests {
    use tokio::fs::remove_dir_all;

    use super::*;
    use std::fs::read_dir;

    #[tokio::test]
    async fn test_add_content_dir() {
        let dirname = "blog";
        let path = Path::new("content").join(dirname);
        create_dir_all(&path).await.unwrap();

        add_content(dirname).await.unwrap();

        let count = read_dir(&path)
            .unwrap()
            .filter_map(|entry| entry.ok())
            .filter(|entry| entry.file_type().map(|ft| ft.is_file()).unwrap_or(false))
            .count();
        assert_eq!(count, 1);
        remove_dir_all(&path).await.unwrap();
    }

    #[tokio::test]
    async fn test_add_content_static() {
        let dirname = "static";
        let path = Path::new("content").join(dirname);
        create_dir_all(&path).await.unwrap();

        add_content(dirname).await.unwrap();

        let count = read_dir(&path)
            .unwrap()
            .filter_map(|entry| entry.ok())
            .filter(|entry| entry.file_type().map(|ft| ft.is_file()).unwrap_or(false))
            .count();
        assert_eq!(count, 1);
        remove_dir_all(&path).await.unwrap();
    }
}
