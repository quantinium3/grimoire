---
id: Packaging
aliases: 
tags:
  - "#Rust/Packaging"
  - Rust
title: Packaging
---

A crate is a smallest amount of code that the rust compiler considers at a time. A small hello world program can be considered a crate. Crates can contain modules and the modules may have other files that get compiled with the crate.

A Crate can be of two types:
- Binary - Programs you can compile to an executable to run. They must have a main function.
- Library - These crates define functionality to be shared with multiple projects. For example `rand` crate that we import to generate a random number.

A **package** is a bundle of one or more crates that provides a set of functionality. A package contains a `Cargo.toml` file that describes how to build those crates

### Modules Reference
- **Start from the crate root** - When compiling a crate, the compiler first looks in the crate root file (usually src/lib.rs for a library crate or src/main.rs for a binary crate) for code to compile.
- **Declaring modules** - Modules are used to organize code into separate namespaces. You declare a module using the mod keyword.
```rust
mod garden;
```
This tell the compiler to look for the `garden` module in one of the following places - 
  - inline - inside the same file `mod garden { }`
  - seperate file such as `src/garden.rs`
  - inside a subdirectory `src/garden/mod.rs`
- **Declaring submodules** - In any file other than crate root you can make submodules. For example `mod vegetables` in `garden` modules. The compiler will then look for the module in the following places - 
  - Inline, directly following mod vegetables, within curly brackets instead of the semicolon
  - In the file src/garden/vegetables.rs
  - In the file src/garden/vegetables/mod.rs
- **Paths to code in modules** - To refers to items inside modules we can use the path anywhere inside that crate as long as privacy rules apply.For example, an `Asparagus` struct in the garden vegetables module would be found at `crate::garden::vegetables::Asparagus`
- **Private vs. public** - Code within a module is private from its parent modules by default. To make a module public, declare it with pub mod instead of mod.
- **The `use` keyword** - Within a scope we can use the `use` keyword to reduce repetition. For example we can refer `crate::garden::vegetables::Asparagus` as `Asparagus`.

### Paths for referring to an item in module
To show Rust where to find an item in a module tree, we use a path in the same way we use a path when navigating a filesystem. To call a function, we need to know its path.

A path can take two forms:
- An absolute path is the full path starting from a crate root; for code from an external crate, the absolute path begins with the crate name, and for code from the current crate, it starts with the literal crate.
- A relative path starts from the current module and uses self, super, or an identifier in the current module.

