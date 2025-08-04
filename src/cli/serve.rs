use std::{net::SocketAddr, path::Path};

use anyhow::Result;
use axum::{http::StatusCode, routing::get, Router};
use tower_http::{
    services::ServeFile, trace::TraceLayer
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use walkdir::WalkDir;
use tower::util::ServiceExt;

pub async fn serve_content(port: u16, open: bool) -> Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!("{}=info,tower_http=info", env!("CARGO_CRATE_NAME")).into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = create_static_server("public")?;
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    
    println!("Server running at http://localhost:{}", port);
    
    if open {
        if let Err(e) = open_browser(&format!("http://localhost:{}", port)) {
            tracing::warn!("Failed to open browser: {}", e);
        }
    }

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .await
        .map_err(|e| anyhow::anyhow!("Server error: {}", e))?;

    Ok(())
}

fn create_static_server(directory: &str) -> Result<Router> {
    let mut router = Router::new();
    let mut route_count = 0;
    let mut directory_routes = std::collections::HashMap::new();
    
    for entry in WalkDir::new(directory)
        .follow_links(true)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        if entry.file_type().is_file() {
            let file_path = entry.path();
            let relative_path = file_path.strip_prefix(directory)?;
            
            let route_path = format!("/{}", relative_path.to_string_lossy().replace('\\', "/"));
            let serve_path = file_path.to_path_buf();
            router = router.route(&route_path, get(move || async move {
                ServeFile::new(&serve_path).oneshot(
                    axum::http::Request::builder()
                        .uri("/")
                        .body(axum::body::Body::empty())
                        .unwrap()
                ).await
            }));
            
            route_count += 1;
            tracing::debug!("Added route: {} -> {:?}", route_path, file_path);
            if file_path.file_name().and_then(|n| n.to_str()) == Some("index.html") {
                let parent_route = if let Some(parent) = relative_path.parent() {
                    if parent.as_os_str().is_empty() {
                        "/".to_string()
                    } else {
                        format!("/{}", parent.to_string_lossy().replace('\\', "/"))
                    }
                } else {
                    "/".to_string()
                };
                
                if parent_route != "/" {
                    directory_routes.insert(parent_route, file_path.to_path_buf());
                }
            }
        }
    }
    
    for (dir_route, index_path) in directory_routes {
        let serve_path = index_path.clone();
        router = router.route(&dir_route, get(move || async move {
            ServeFile::new(&serve_path).oneshot(
                axum::http::Request::builder()
                    .uri("/")
                    .body(axum::body::Body::empty())
                    .unwrap()
            ).await
        }));
        tracing::info!("Added directory route: {} -> {:?}", dir_route, index_path);
        route_count += 1;
        
        let dir_route_with_slash = format!("{}/", dir_route);
        let serve_path_with_slash = index_path.clone();
        router = router.route(&dir_route_with_slash, get(move || async move {
            ServeFile::new(&serve_path_with_slash).oneshot(
                axum::http::Request::builder()
                    .uri("/")
                    .body(axum::body::Body::empty())
                    .unwrap()
            ).await
        }));
        route_count += 1;
    }
    
    let index_path = Path::new(directory).join("index.html");
    if index_path.exists() {
        let index_serve_path = index_path.clone();
        router = router.route("/", get(move || async move {
            ServeFile::new(&index_serve_path).oneshot(
                axum::http::Request::builder()
                    .uri("/")
                    .body(axum::body::Body::empty())
                    .unwrap()
            ).await
        }));
        tracing::info!("Added root route serving index.html");
    }
    
    println!("📋 Created {} file routes", route_count);
    
    router = router.fallback(|| async {
        (StatusCode::NOT_FOUND, "File not found")
    });
    
    Ok(router.layer(TraceLayer::new_for_http()))
}

fn open_browser(url: &str) -> Result<()> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(["/c", "start", url])
            .spawn()?;
    }
    
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(url)
            .spawn()?;
    }
    
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(url)
            .spawn()?;
    }
    
    Ok(())
}
