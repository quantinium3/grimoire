use std::collections::HashMap;

use serde::{Deserialize, Serialize};

pub const GRIMOIRE_CONFIG_NAME: &'static str = "grimoire.config.json";

#[derive(Serialize, Debug, Clone, Deserialize)]
pub struct Config {
    pub project_name: String,
    pub content_dir: String,
    pub description: String,
    pub domain: String,
}

#[derive(Deserialize, Debug)]
pub struct FrontMatter {
    pub title: String,
    pub author: Option<String>,
    pub date: Option<String>,
    pub tags: Option<String>,
    pub description: Option<String>,
    pub slug: String,
    pub draft: Option<bool>,
    pub extra: Option<HashMap<String, serde_json::Value>>,
}
