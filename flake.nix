{
  description = "Grimoire - a simple and dumb static site generator";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";

    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@ { self
    , nixpkgs
    , systems
    , ...
    }:
    let
      inherit (nixpkgs) lib;
      eachSystem = lib.genAttrs (import systems);
      pkgsFor = eachSystem
        (system: import nixpkgs {
          localSystem.system = system;
        });
    in
    {
      packages = lib.mapAttrs
        (system: pkgs:
          let
            fs = lib.fileset;
            src = fs.difference (fs.gitTracked ./.) (fs.unions [
              ./flake.lock
              (fs.fileFilter (file: lib.strings.hasInfix ".git" file.name) ./.)
              (fs.fileFilter (file: file.hasExt ".md") ./.)
              (fs.fileFilter (file: file.hasExt ".nix") ./.)
            ]);

          in
          {
            default = self.packages.${system}.grimoire;
            grimoire = pkgs.rustPlatform.buildRustPackage {
              name = "grimoire";
              src = fs.toSource {
                root = ./.;
                fileset = src;
              };

              cargoLock = {
                lockFile = ./Cargo.lock;
                allowBuiltinFetchGit = true;
              };

              buildType = "release";
              doCheck = false;
              strictDeps = true;
            };
          })
        pkgsFor;

      devShells =
        lib.mapAttrs
          (system: pkgs: {
            default = self.devShells.${system}.grimoire;

            grimoire = pkgs.mkShell
              {
                packages = with pkgs; [
                  bacon
                  cargo-nextest
                  (inputs.fenix.packages.${system}.combine (
                    with inputs.fenix.packages.${system}; [
                      stable.cargo
                      stable.clippy
                      stable.rust-analyzer
                      stable.rustc

                      default.rustfmt
                    ]
                  ))
                ];
                env.RUST_SRC_PATH = pkgs.rustPlatform.rustLibSrc;
              };
          })
          pkgsFor;
    };
}
