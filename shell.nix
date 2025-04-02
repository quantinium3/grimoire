{ pkgs ? import <nixpkgs> { } }:
pkgs.mkShell {
  buildInputs = with pkgs; [
    bun
    util-linux
    pkg-config
    cairo
    pango
    libjpeg
    giflib
    pixman
  ];
  shellHook = ''
    export LD_LIBRARY_PATH=/nix/store/gm5g3xyn8iwxkag8gs6rf3ci64bqld80-util-linux-minimal-2.39.4-lib/lib:$LD_LIBRARY_PATH
  '';
}

