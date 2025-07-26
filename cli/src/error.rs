use std::io;

use thiserror::Error;

#[derive(Error, Debug)]
pub enum SSGError {
    #[error("Failed to build static site: {0}")]
    BuildFailure(String),

    #[error("IO Error: {0}")]
    IOError(#[from] io::Error),

    #[error("Failed to initialize project: {0}")]
    InitFailure(String),

    #[error("Failed to parse: {0}")]
    ParseError(String), // change this to use proper parse error rather than string
}

