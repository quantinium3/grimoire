use crate::error::SSGError;

pub async fn add_content(
    directory: &str,
    title: Option<&String>,
    draft: bool,
    tags: Option<&String>,
) -> Result<(), SSGError> {
    println!("creating directory and file the following detail: ");
    println!("dir: {}", directory);
    println!("title: {:?}", title);
    println!("draft: {}", draft);
    println!("tags: {:?}", tags);
    Ok(())
}
