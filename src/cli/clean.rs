use anyhow::{Context, Result};
use std::path::Path;
use tokio::fs::remove_dir_all;

pub async fn clean_content(dir: &str) -> Result<()> {
    remove_dir_all(Path::new(dir))
        .await
        .with_context(|| format!("failed to clean dir: {}", dir))?;
    Ok(())
}
