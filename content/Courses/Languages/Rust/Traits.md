---
id: Traits
aliases: 
tags:
  - "#Rust/Traits"
  - Rust
title: Traits
---

A trait defines the functionality a particular type has and can share with other types. We can use traits to define shared behavior in an abstract way. We can use trait bounds to specify that a generic type can be any type that has certain behavior.

> Traits are similar to a feature often called interfaces in other languages, although with some differences.

### Defining a trait
You define a trait using the trait keyword, followed by the method signatures that types implementing the trait must provide.

```rust
trait Summary {
    fn summarize(&self) -> String;
}
```
- `Summary` is a trait with a single method, `summarize`.
- Any type that implements the `Summary` trait must provide an implementation for the `summarize` method.

### Implementing a trait
```rust
struct NewsArticle {
    headline: String,
    location: String,
    author: String,
    content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

struct Tweet {
    username: String,
    content: String,
    reply: bool,
    retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```

- `NewsArticle` and `Tweet` both implement the `Summary` trait.
- Each provides its own implementation of the `summarize` method.

### Default implementation
You can provide default implementations for methods in a trait. Types can use the default implementation or override it.

```rust
trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}

impl Summary for NewsArticle {}
```
We can use this to provide a default method for implementation or can create our own implementation of certain methods.

### Trait Bounds
Traits can be used as constraints on generic types to ensure they implement specific behavior. This is called a trait bound.
```rust
fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```
- The notify function accepts any type `T` that implements the `Summary` trait.
- This ensures that the `summarize` method can be called on `item`.

### Using where Clauses
For complex trait bounds, you can use a where clause to improve readability.
```rust
fn some_function<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
    println!("T: {}", t);
    println!("U: {:?}", u);
    42
}
```

### Trait objects
Traits can be used to achieve dynamic polymorphism through trait objects. A trait object is a pointer to an instance of a type that implements a specific trait.

```rust
fn notify(item: &dyn Summary) {
    println!("Breaking news! {}", item.summarize());
}
```
- `dyn Summary` is a trait object that can hold any type implementing the `Summary` trait.
- Trait objects allow for dynamic dispatch, meaning the method to call is determined at runtime.

### Deriving traits
Many traits can be automatically derived using the `#[derive]` attribute.
```rust
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}
```
The compiler generates implementations for Debug, Clone, and PartialEq.

### Associated types
```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}

struct Counter {
    count: u32,
}

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        self.count += 1;
        Some(self.count)
    }
}
```
`Item` is an associated type that the implementing type (`Counter`) specifies as `u32`.

### Trait inheritence
Traits can inherit from other traits, requiring implementors to provide implementations for both the parent and child traits.

```rust
trait Printable: Summary {
    fn print(&self) {
        println!("{}", self.summarize());
    }
}

impl Printable for NewsArticle {}
```
`Printable` requires `Summary` to be implemented first.

### Returning Types that implements Traits
We can use `impl Trait` to specify that a function returns a type that implements a particular trait, without naming the concrete type.

```rust
fn returns_summarizable() -> impl Summary {
    Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    }
}
```





