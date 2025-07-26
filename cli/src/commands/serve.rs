use crate::error::SSGError;

pub async fn serve_content(port: u16, open: bool) -> Result<(), SSGError> {
    println!("Serving content at port: {}", port);
    println!("opening in browser: {}", open);
    Ok(())
}
