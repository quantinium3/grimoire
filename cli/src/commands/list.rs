use crate::error::SSGError;

pub async fn list_content(dirname: Option<&String>) -> Result<(), SSGError> {
    println!("listing content");
    println!("dirname: {:?}", dirname);
    Ok(())
}
