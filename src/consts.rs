use std::collections::HashMap;

use serde::{Deserialize, Serialize};

pub const GRIMOIRE_CONFIG_NAME: &'static str = "grimoire.config.json";

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub project_name: String,
    pub description: String,
    pub domain: String,
    pub content_dir: String,
}

#[derive(Deserialize, Debug)]
pub struct FrontMatter {
    pub title: Option<String>,
    pub author: Option<String>,
    pub date: Option<String>,
    pub tags: Option<String>,
    pub description: Option<String>,
    pub slug: Option<String>,
    pub draft: Option<bool>,
    pub extra: HashMap<String, serde_json::Value>,
}
