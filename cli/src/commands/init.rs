use anyhow::{bail, Context, Result};
use tokio::fs::{create_dir_all, try_exists};

pub async fn init_project(name: &str) -> Result<()> {
    // initialize project
    // @name - name of the project
    // create all dirs -> create all files -> put content in those files
    // file :- content/blog, content/pages, templates/blog.hbs, templates/index.hbs,
    // templates/page.hbs
    //
    // println -> cd ${name} 
    // println -> grimoire build
    println!("initializing project: {}", name);

    ensure_dir(name).await?;
    initialize_project(name).await?;
    
    Ok(())
}

async fn initialize_project(name: &str) -> Result<()> {
    let dirs = [
        "content/blog",
        "content/pages",
        "templates",
        "static/css",
        "static/images",
        "static/js"
    ];

    for dir in dirs {
        let full_path = format!("{}/{}", name, dir);
        create_dir_all(&full_path).await.with_context(|| format!("Failed to create directory: '{}'", full_path))?;
    }

    Ok(())
}
async fn ensure_dir(name: &str) -> Result<()> {
    if try_exists(name).await? {
        bail!("'{}' already exist", name);
    }

    create_dir_all(name).await.with_context(|| format!("failed to create directory: '{}'", name))?;
    Ok(())
}
