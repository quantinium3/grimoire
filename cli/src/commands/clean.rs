use crate::error::SSGError;

pub async fn clean_content(dir: &str) -> Result<(), SSGError> {
    println!("directory: {}", dir);
    Ok(())
}
