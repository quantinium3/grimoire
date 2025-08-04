use anyhow::{Context, Result};
use std::path::Path;
use tokio::fs::remove_dir_all;

pub async fn clean_content<P: AsRef<Path>>(dir: P) -> Result<()> {
    remove_dir_all(&dir)
        .await
        .with_context(|| format!("failed to clean dir: {}", dir.as_ref().display()))?;
    Ok(())
}
