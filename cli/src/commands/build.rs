use anyhow::Result;
use which::which;
use deno_core::{JsRuntime, ModuleCode, ModuleType, ResolutionKind, RuntimeOptions, futures};
use tokio::process::Command;

pub async fn build_content(include_draft: bool, output_dir: &str) -> Result<()> {
    println!("building content");
    let input_dir = "content";

    let output = Command::new(which("grimoire")?)
        .args(&[
            "-i",
            &input_dir,
            "-o",
            &output_dir,
            "--include-drafts",
            &include_drafts,
        ])
        .output()
        .await?;

    if output.status.success() {
        println!("Grimoire compiled successfully");
        println!("{}", String::from_utf8_lossy(&output.stdout));
    } else {
        println!("Failed to create grimoire.");
        println!("{}", String::from_utf8_lossy(&output.stderr));
    }

    Ok(())
}
