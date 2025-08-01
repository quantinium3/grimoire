use anyhow::Result;
use axum::{
    Router,
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use futures_util::stream::StreamExt;
use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::PathBuf;
use std::sync::Arc;
use tokio::{
    process::Command,
    sync::{
        broadcast::{self, Sender},
        mpsc,
    },
};
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing::Level;

pub async fn serve_content(port: u16, _open: bool) -> Result<()> {
    tracing_subscriber::fmt().with_max_level(Level::INFO).init();
    let (tx, _) = broadcast::channel::<String>(16);
    let tx = Arc::new(tx);

    let content_dir = PathBuf::from("content");
    let tx_clone = Arc::clone(&tx);
    tokio::spawn(async move {
        if let Err(e) = watch_files(&content_dir, tx_clone).await {
            tracing::error!("File watcher error: {:?}", e);
        }
    });

    let dist_dir = PathBuf::from("dist");

    if !dist_dir.exists() {
        tracing::error!("Dist directory does not exist: {:?}", dist_dir);
        return Err(anyhow::anyhow!("Dist directory not found"));
    }

    let app = Router::new()
        .route(
            "/ws",
            get({
                let tx = Arc::clone(&tx);
                move |ws| ws_handler(ws, tx)
            }),
        )
        .fallback_service(
            ServeDir::new(&dist_dir).fallback(ServeFile::new(dist_dir.join("index.html"))),
        )
        .layer(TraceLayer::new_for_http());

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], port));
    tracing::info!("Server starting on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<std::net::SocketAddr>(),
    )
    .await?;

    Ok(())
}

async fn watch_files(
    content_dir: &PathBuf,
    tx: Arc<Sender<String>>,
) -> Result<(), Box<dyn std::error::Error>> {
    if !content_dir.exists() {
        return Err(anyhow::anyhow!("Content directory does not exist: {:?}", content_dir).into());
    }

    let (mut watcher, mut rx) = {
        let config = Config::default()
            .with_poll_interval(std::time::Duration::from_secs(1))
            .with_compare_contents(true); // More reliable change detection
        let (tx_watcher, rx) = mpsc::channel(32); // Increased buffer size
        let watcher = RecommendedWatcher::new(
            move |res: Result<Event, notify::Error>| {
                if let Err(e) = tx_watcher.blocking_send(res) {
                    tracing::error!("Failed to send watcher event: {:?}", e);
                }
            },
            config,
        )?;
        (watcher, rx)
    };

    watcher.watch(content_dir, RecursiveMode::Recursive)?;

    while let Some(event) = rx.recv().await {
        match event {
            Ok(event) => match event.kind {
                EventKind::Modify(_) | EventKind::Create(_) => {
                    for path in event.paths {
                        let relative_path = path
                            .strip_prefix(content_dir)
                            .map(|p| p.to_string_lossy().into_owned())
                            .unwrap_or_else(|_| path.to_string_lossy().into_owned());

                        tracing::info!("Detected change in: {}", relative_path);

                        let output = Command::new("grimoire")
                            .arg("build")
                            .arg(&relative_path)
                            .output()
                            .await;

                        match output {
                            Ok(output) => {
                                if output.status.success() {
                                    tracing::info!(
                                        "Grimoire build successful for {}",
                                        relative_path
                                    );
                                    let _ = tx.send("reload".to_string()).map_err(|e| {
                                        tracing::error!("Failed to send reload signal: {:?}", e);
                                    });
                                } else {
                                    tracing::error!(
                                        "Grimoire build failed: {}",
                                        String::from_utf8_lossy(&output.stderr)
                                    );
                                }
                            }
                            Err(e) => {
                                tracing::error!("Failed to run grimoire build: {:?}", e);
                            }
                        }
                    }
                }
                _ => {}
            },
            Err(e) => {
                tracing::error!("File watch error: {:?}", e);
            }
        }
    }

    Ok(())
}

async fn ws_handler(ws: WebSocketUpgrade, tx: Arc<Sender<String>>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, tx))
}

async fn handle_socket(mut socket: WebSocket, tx: Arc<Sender<String>>) {
    let mut rx = tx.subscribe();

    if let Err(e) = socket
        .send(Message::Text("WebSocket connected!".to_string().into()))
        .await
    {
        tracing::error!("Failed to send welcome message: {:?}", e);
        return;
    }

    loop {
        tokio::select! {
            result = rx.recv() => {
                match result {
                    Ok(msg) if msg == "reload" => {
                        if let Err(e) = socket.send(Message::Text("reload".to_string().into())).await {
                            tracing::error!("Failed to send reload message: {:?}", e);
                            return;
                        }
                    }
                    Ok(_) => {}
                    Err(e) => {
                        tracing::error!("Broadcast channel error: {:?}", e);
                        return;
                    }
                }
            }
            Some(result) = socket.next() => {
                match result {
                    Ok(Message::Close(_)) => {
                        tracing::info!("WebSocket connection closed by client");
                        return;
                    }
                    Ok(_) => {}
                    Err(e) => {
                        tracing::error!("WebSocket error: {:?}", e);
                        return;
                    }
                }
            }
        }
    }
}
