use crate::error::SSGError;

pub async fn build_content(include_draft: bool, output_dir: &str) -> Result<(), SSGError> {
    println!("building content");
    println!("include draft: {0}", include_draft);
    println!("output_dir: {0}", output_dir);
    Ok(())
}
