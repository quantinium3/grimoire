---
id: Generics
aliases: 
tags:
  - "#Rust/Generics"
  - Rust
title: Generics
---

Generics in Rust allow you to write flexible, reusable code that can work with any data type. They enable you to define functions, structs, enums, and methods that operate on generic types rather than specific types. This reduces code duplication and increases type safety.

### Generic Functions
You can define functions that accept parameters of any type using generics. The generic type is specified in angle brackets `(<T>)`.
```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```
- `T` is a placeholder for any type.
- `PartialOrd` is a trait that ensures the type `T` can be compared (required for the > operator).
- This function works for any type that implements `PartialOrd`, such as integers, floats, or custom types.

### Generic Structs
You can define structs that use generic types for their fields.

```rust
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer_point = Point { x: 5, y: 10 };
    let float_point = Point { x: 1.0, y: 4.0 };
}
```
- `Point<T>` can hold values of any type `T`.
- Both `x` and `y` must be of the same type `T`.

If we want `x` and `y` to have different types.
```rust
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let mixed_point = Point { x: 5, y: 4.0 };
}
```

### Generic Enums
Enums can also use generics. A common example is Rust’s `Option<T>` and `Result<T, E>` enums.
```rust
enum Option<T> { // Option<T> can hold a value of type T (Some) or no value (None).
    Some(T), 
    None,
}

enum Result<T, E> { // Result<T, E> can hold a success value of type T (Ok) or an error of type E (Err).
    Ok(T),
    Err(E),
}
```

### Generic Methods
You can implement methods for structs or enums using generics.

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };
    println!("p.x = {}", p.x());
}
```

### Trait Bounds
To restrict generics to types that implement specific behavior, you can use trait bounds.
```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```
- T: PartialOrd ensures that T implements the PartialOrd trait, allowing comparison.

We can also use multiple trait bounds with the + syntax:
```rust
fn print_and_return<T: PartialOrd + std::fmt::Display>(value: T) -> T {
    println!("Value: {}", value);
    value
}
```

### Where Clause
```rust
fn some_function<T, U>(t: T, u: U) -> i32
where
    T: std::fmt::Display + Clone,
    U: Clone + std::fmt::Debug,
{
    println!("T: {}", t);
    println!("U: {:?}", u);
    42
}
```

Rust’s generics are zero-cost abstractions. The compiler generates specialized code for each concrete type used with generics, ensuring no runtime overhead.

For example, if you use `Point<i32>` and `Point<f64>`, the compiler generates two separate versions of the `Point` struct and its methods, optimized for `i32` and `f64`.

