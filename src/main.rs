mod cli;
mod site;
use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(name = "grimoire")]
#[command(about = "a simple and dumb static site generator")]
#[command(version = "0.1.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    Init {
        project_name: String,
    },

    Add {
        #[arg(short('t'), long("type"))]
        content_type: String,
    },

    Build {
        #[arg(long)]
        include_drafts: bool,

        #[arg(short('o'), long, default_value = "public")]
        output_dir: String,
    },

    Serve {
        #[arg(short('p'), long, default_value = "5000")]
        port: u16,

        #[arg(long)]
        open: bool,
    },

    List {
        #[arg(short('l'), long("list"))]
        dirname: Option<String>,
    },

    Clean {
        #[arg(default_value = "public")]
        directory: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Init { project_name } => init_project(project_name).await?,
        Commands::Add { content_type } => add_content(content_type).await?,
        Commands::Build {
            include_drafts,
            output_dir,
        } => build_content(*include_drafts, output_dir).await?,
        Commands::Serve { port, open } => serve_content(*port, *open).await?,
        Commands::List { dirname } => list_content(dirname.as_ref()).await?,
        Commands::Clean { directory } => clean_content(directory).await?,
    }
    Ok(())
}
