use anyhow::{Context, Result};
use tokio::process::Command;
use which::which;

pub async fn build_content(include_drafts: bool, output_dir: &str) -> Result<()> {
    println!("Building content...");

    let input_dir = "content";
    let grimoire_path =
        which("grimoire").context("Failed to find 'grimoire' executable in PATH")?;

    let output = Command::new(grimoire_path)
        .args([
            "-i",
            input_dir,
            "-o",
            output_dir,
            "--include-drafts",
            if include_drafts { "true" } else { "false" },
        ])
        .output()
        .await
        .context("Failed to execute grimoire command")?;

    if output.status.success() {
        println!("✓ Grimoire compiled successfully");

        let stdout = String::from_utf8_lossy(&output.stdout);
        if !stdout.trim().is_empty() {
            println!("Output:\n{}", stdout);
        }

        Ok(())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("✗ Failed to build content");
        if !stderr.trim().is_empty() {
            eprintln!("Error details:\n{}", stderr);
        }

        anyhow::bail!(
            "Grimoire build failed with exit code: {:?}",
            output.status.code()
        );
    }
}
