use anyhow::Result;
use std::collections::HashMap;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

pub async fn list_content(dirname: Option<&String>) -> Result<()> {
    let path = match dirname {
        Some(dir) => dir,
        None => ".",
    };

    let mut entries: Vec<PathBuf> = Vec::new();
    for entry in WalkDir::new(path).sort_by_file_name() {
        let entry = entry?;
        entries.push(entry.path().to_path_buf());
    }

    if !entries.is_empty() {
        entries.remove(0);
    }

    let tree = build_tree(&entries, Path::new(path));

    print_tree(&tree, "", true);

    Ok(())
}

#[derive(Debug)]
struct TreeNode {
    name: String,
    is_dir: bool,
    children: Vec<TreeNode>,
}

fn build_tree(entries: &[PathBuf], root: &Path) -> Vec<TreeNode> {
    let mut tree_map: HashMap<PathBuf, TreeNode> = HashMap::new();

    for entry in entries {
        let relative_path = entry.strip_prefix(root).unwrap_or(entry);
        let is_dir = entry.is_dir();
        let name = entry
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

        let icon = if is_dir {
            "󱧼"
        } else if name.ends_with(".md") {
            ""
        // } else if name.ends_with(".rs") {
        //     ""
        } else {
            ""
        };

        let node = TreeNode {
            name: format!("{} {}", icon, name),
            is_dir,
            children: Vec::new(),
        };

        tree_map.insert(relative_path.to_path_buf(), node);
    }

    let mut sorted_entries: Vec<_> = entries.iter().collect();
    sorted_entries.sort_by_key(|entry| std::cmp::Reverse(entry.components().count()));

    for entry in sorted_entries {
        let relative_path = entry.strip_prefix(root).unwrap_or(entry);

        if let Some(parent_path) = relative_path.parent() {
            if parent_path != Path::new("") && tree_map.contains_key(&parent_path.to_path_buf()) {
                if let Some(child_node) = tree_map.remove(&relative_path.to_path_buf()) {
                    if let Some(parent_node) = tree_map.get_mut(&parent_path.to_path_buf()) {
                        parent_node.children.push(child_node);
                    }
                }
            }
        }
    }

    let mut root_children: Vec<TreeNode> = tree_map.into_values().collect();

    sort_children(&mut root_children);
    sort_all_children(&mut root_children);

    root_children
}

fn sort_children(children: &mut Vec<TreeNode>) {
    children.sort_by(|a, b| match (a.is_dir, b.is_dir) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.name.cmp(&b.name),
    });
}

fn sort_all_children(nodes: &mut Vec<TreeNode>) {
    for node in nodes.iter_mut() {
        sort_children(&mut node.children);
        sort_all_children(&mut node.children);
    }
}

fn print_tree(nodes: &[TreeNode], prefix: &str, is_root: bool) {
    for (i, node) in nodes.iter().enumerate() {
        let is_last = i == nodes.len() - 1;

        if is_root && nodes.len() == 1 {
            println!("{}", node.name);
        } else {
            let connector = if is_last { "└── " } else { "├── " };
            println!("{}{}{}", prefix, connector, node.name);
        }

        if !node.children.is_empty() {
            let new_prefix = if is_root && nodes.len() == 1 {
                format!("{}", prefix)
            } else {
                let extension = if is_last { "    " } else { "│   " };
                format!("{}{}", prefix, extension)
            };
            print_tree(&node.children, &new_prefix, false);
        }
    }
}
