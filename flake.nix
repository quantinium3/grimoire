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
  outputs = inputs @ { self, nixpkgs, systems, fenix,... }:
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
          (fs.fileFilter (file: file.name == "flake.lock") ./cli)
          (fs.fileFilter (file: lib.strings.hasInfix ".git" file.name) ./cli)
          (fs.fileFilter (file: file.hasExt "md") ./cli)
          (fs.fileFilter (file: file.hasExt "nix") ./cli)
        ]);
    in
    {
      packages = eachSystem (system:
        let
          pkgs = pkgsFor.${system};
          
          grimoire = pkgs.stdenv.mkDerivation {
            pname = "grimoire";
            version = "0.1.0";
            src = lib.fileset.toSource {
              root = ./.;
              fileset = fs.unions [
                ./build.js
              ];
            };
            nativeBuildInputs = [ pkgs.bun ];
            buildPhase = ''
              runHook preBuild
              bun build ./build.js --compile --outfile grimoire
              runHook postBuild
            '';
            installPhase = ''
              runHook preInstall
              mkdir -p $out/bin
              cp grimoire $out/bin/
              runHook postInstall
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
            };
            buildType = "release";
            doCheck = true;
            strictDeps = true;
            nativeBuildInputs = [ pkgs.installShellFiles ];
            postInstall = ''
              # Install the grimoire binary alongside grimoire-cli
              mkdir -p $out/bin
              cp ${grimoire}/bin/grimoire $out/bin/
            '';
          };
        in
        {
          default = grimoire-cli;
          grimoire-cli = grimoire-cli;
          grimoire = grimoire;
        });

      devShells = eachSystem (system: {
        default = pkgsFor.${system}.mkShell {
          packages = with pkgsFor.${system}; [
            bacon
            bun
            bun2nix.packages.${system}.default
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
          shellHook = ''
            export PATH="$PATH:${self.packages.${system}.grimoire}/bin"
          '';
        };
      });
    };
}
