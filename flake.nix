{
  description = "Grimoire";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ { self, nixpkgs, systems, fenix, ... }:
    let
      inherit (nixpkgs) lib;

      eachSystem = lib.genAttrs (import systems);
      pkgsFor = eachSystem (system:
        import nixpkgs {
          inherit system;
        });

      fs = lib.fileset;
      src = fs.difference
        (fs.gitTracked ./cli)
        (fs.unions [
          ./cli/flake.lock
          (fs.fileFilter (file: lib.strings.hasInfix ".git" file.name) ./cli)
          (fs.fileFilter (file: file.hasExt "md") ./cli)
          (fs.fileFilter (file: file.hasExt "nix") ./cli)
        ]);

    in
    {
      packages = lib.mapAttrs
        (system: pkgs:
          let
            grimoire = pkgs.stdenv.mkDerivation {
              name = "grimoire";
              src = ./.;
              nativeBuildInputs = [ pkgs.bun ];
              buildPhase = ''
                bun build ./build.ts --compile --outfile grimoire
              '';
              installPhase = ''
                mkdir -p $out/bin
                cp grimoire $out/bin/grimoire
                chmod +x $out/bin/grimoire
              '';
            };

            grimoire-cli = pkgs.rustPlatform.buildRustPackage {
              pname = "grimoire-cli";
              version = "0.1.0";
              src = fs.toSource {
                root = ./cli;
                fileset = src;
              };
              cargoLock = {
                lockFile = ./cli/Cargo.lock;
                allowBuiltinFetchGit = true;
              };
              buildType = "release";
              doCheck = false;
              strictDeps = true;
              postInstall = ''
                cp ${grimoire}/bin/grimoire $out/bin/grimoire
              '';
              buildInputs = [ grimoire ];
            };

          in
          {
            default = grimoire-cli;
            grimoire-cli = grimoire-cli;
            grimoire = grimoire;
          })
        pkgsFor;

      devShells = lib.mapAttrs
        (system: pkgs: {
          default = pkgs.mkShell {
            packages = with pkgs; [
              bacon
              bun
              (fenix.packages.${system}.combine (
                with fenix.packages.${system}; [
                  stable.cargo
                  stable.clippy
                  stable.rust-analyzer
                  stable.rustc
                  default.rustfmt
                ]
              ))
            ];
            env = {
              RUST_SRC_PATH = pkgs.rustPlatform.rustLibSrc;
              PATH = lib.makeBinPath [ pkgs.bun "${self.packages.${system}.tsBinary}/bin" ];
            };
          };
        })
        pkgsFor;
    };
}
