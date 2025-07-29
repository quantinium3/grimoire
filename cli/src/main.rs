use anyhow::Result;
use clap::{Parser, Subcommand};
use commands::{
    add::add_content, build::build_content, clean::clean_content, init::init_project,
    list::list_content, serve::serve_content,
};
mod commands;

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
        name: String,
    },

    Add {
        #[arg(short('d'), long("dir"))]
        directory: String,
    },

    Build {
        #[arg(long)]
        include_drafts: bool,

        #[arg(short, long, default_value = "public")]
        output: String,
    },

    Serve {
        #[arg(short, long, default_value = "5000")]
        port: u16,

        #[arg(short, long)]
        open: bool,
    },

    List {
        #[arg(short('d'), long("dir"))]
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
        Commands::Init { name } => init_project(name).await?,
        Commands::Add { directory } => add_content(directory).await?,
        Commands::List { dirname } => list_content(dirname.as_ref()).await?,
        Commands::Build {
            include_drafts,
            output,
        } => build_content(*include_drafts, output).await?,
        Commands::Serve { port, open } => serve_content(*port, *open).await?,
        Commands::Clean { directory } => clean_content(directory).await?,
    }
    Ok(())
}
