use std::path::Path;

use anyhow::{Context, Result};
use tokio::fs::remove_dir_all;

pub async fn clean_content(dir: &str) -> Result<()> {
    remove_dir_all(Path::new(dir))
        .await
        .with_context(|| format!("failed to clean dir: {}", dir))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use tokio::fs::create_dir_all;

    use super::*;

    #[tokio::test]
    async fn test_clean_content() {
        let path = Path::new("dist").join("style");
        create_dir_all(&path).await.unwrap();
        assert!(path.exists());
        clean_content("dist").await.unwrap();
        assert!(!path.exists());
    }
}
