---
id: lifetimes
aliases: 
tags:
  - "#Rust/Lifetimes"
  - Rust
title: lifetimes
---

A lifetime is a construct that the Rust compiler uses to track how long references to data are valid. Every reference in Rust has a lifetime, which is the scope for which the reference is valid. Lifetimes are usually inferred by the compiler, but sometimes you need to annotate them explicitly to help the compiler understand your intentions.

### Why Are Lifetimes Important?
Lifetimes ensure that: 
1. **References do not outlive the data they point to**: This prevents dangling references, where a reference points to memory that has already been freed.
2. **Data races are avoided**: By ensuring that references are valid and that no two mutable references to the same data exist simultaneously, Rust prevents data races at compile time.

### Lifetime Annotations
Lifetime annotations are a way to explicitly specify the relationships between the lifetimes of different references. They are denoted by an apostrophe (`'`) followed by a name, such as `'a`, `'b`, etc.

```rust
&i32        // a reference
&'a i32     // a reference with an explicit lifetime
&'a mut i32 // a mutable reference with an explicit lifetime
```

Here’s an example of a function with explicit lifetime annotations:
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

- `'a` is a lifetime parameter.
- The function `longest` takes two string slices (`&str`) with the same lifetime `'a` and returns a string slice with the same lifetime `'a`.
- This means that the returned reference will be valid as long as both input references are valid.

### Lifetime Annotations in structs
So far, the structs we’ve defined all hold owned types. We can define structs to hold references, but in that case we would need to add a lifetime annotation on every reference in the struct’s definition.

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
```
The `ImportantExcerpt` struct has a single field, part, which holds a string slice (a reference). To ensure the reference in part remains valid, the struct uses a lifetime parameter (`'a`) declared in angle brackets (`<'a>`). This means an instance of `ImportantExcerpt` cannot outlive the reference it holds in its part field.

- A `String` named `novel` owns the data.
- An `ImportantExcerpt` instance is created, referencing the first sentence of novel.
- Since novel exists before the `ImportantExcerpt` instance and outlives it, the reference in `ImportantExcerpt` is valid throughout its lifetime.

### Lifetime Elision
In many cases, Rust can infer lifetimes automatically, so you don’t need to annotate them explicitly. This is known as **lifetime elision**. The compiler follows a set of rules to determine lifetimes in common patterns.

### Lifetime Rules
The Rust compiler follows three rules to infer lifetimes when they are not explicitly annotated:
1. **Each parameter that is a reference gets its own lifetime parameter**. For example, a function with one parameter gets one lifetime, a function with two parameters gets two lifetimes, and so on.
2. **If there is exactly one input lifetime parameter, that lifetime is assigned to all output lifetime parameters**.
3. **If there are multiple input lifetime parameters, but one of them is `&self` or `&mut self` (as in method definitions), the lifetime of `self` is assigned to all output lifetime parameters**.

### Lifetime Declarations in impl Blocks
Lifetime names for struct fields must be declared after the `impl` keyword and used after the struct's name because they are part of the struct's type.
```rust
impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
}
```

### Static Lifetime
The `'static` lifetime is a special lifetime that means the reference is valid for the entire duration of the program. String literals, for example, have a `'static` lifetime because they are stored directly in the program's binary.

```rust
let s: &'static str = "I have a static lifetime.";
```

### Generic Type Parameters, Trait Bounds, and Lifetimes Together
```rust
use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str
where
    T: Display,
{
    println!("Announcement! {ann}");
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

This is the longest function from Listing 10-21 that returns the longer of two string slices. But now it has an extra parameter named ann of the generic type T, which can be filled in by any type that implements the Display trait as specified by the where clause. This extra parameter will be printed using {}, which is why the Display trait bound is necessary. Because lifetimes are a type of generic, the declarations of the lifetime parameter 'a and the generic type parameter T go in the same list inside the angle brackets after the function name.
