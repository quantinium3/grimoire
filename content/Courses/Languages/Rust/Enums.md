---
id: Enums
aliases: 
tags:
  - "#Rust/Enums"
  - Rust
  - Rust/Option
description: Enums in rust
title: Enums
---

Enums in Rust, short for "enumerations," are a powerful feature that allow you to define a type by enumerating its possible variants. Enums are useful for representing data that can be one of several different forms

### Syntax
An enum is defined using the enum keyword, followed by the name of the enum and a set of variants enclosed in curly braces {}. Each variant can optionally hold data.

```rust
enum Direction {
    North,
    South,
    East,
    West,
}
```
Enums can be useful to represent data in possible forms. For example - As of present the two used standard for IP protocols are IPv4 and IPv6. This can be easily be defined using enums and then matched using rust's `match` operator when needed.

```rust
enum IpAddrKind {
    V4,
    V6,
}
```
You can create instances of an enum by using one of its variants:

```rust
let ipv4 = IpAddrKind::V4;
```
### Enums can store data
Enums can also hold data. Each variant can have different types and amounts of associated data. This makes enums more flexible than simple constants.

```rust
enum WebEvent {
    PageLoad,                 // No data
    KeyPress(char),           // Single character
    Click { x: i64, y: i64 }, // Named fields
}

let load = WebEvent::PageLoad;
let press = WebEvent::KeyPress('a');
let click = WebEvent::Click { x: 100, y: 200 };
```

### Some inbuilt enums
Rust standard libraries has defined some enums for being used such as the `Option` enum or the `Result` enum.

#### `Option<T>` enum
`Option<T>` enum is implemented in Rust to not use `NULL` in as the way to showcase the absense of values as in other languages. Use of `NULL` is considered bad as using a null values as a non-null values can lead to many problems.

Due to this reason, the rust's standard library instead of implementing `NULL` have implemented an `Option<T>` enum. It is used to represent a value that can either be something `(Some)` or nothing `(None)`. This is particularly useful for handling situations where a value might be absent, without resorting to null pointers or other error-prone mechanisms.

```rust
enum Option<T> {
    None,
    Some<T>,
}
```

**Why Use Option?**
  - The Option enum is used to handle cases where a value might not exist. For example:
  - When looking up a key in a map, the key might not exist.
  - When parsing user input, the input might be invalid.
  - When accessing an element in a collection, the index might be out of bounds.
By using Option, Rust forces you to explicitly handle both cases (Some and None), which helps prevent runtime errors like null pointer exceptions.

## `match` Control Flow Construct
Rust has an extremely powerful control flow construct called match that allows you to compare a value against a series of patterns and then execute code based on which pattern matches.

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```
### Matching with `Option<T>`
```
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }

    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
```
### Catching all patterns and the _ placeholder
Using match construct can be really powerful when have to match one val with other and then execute something.

the `other` and `_` are catch-all patterns to deal with match's we didnt specifically define.

#### `Other` - Named catch-all
This is used when we want to store the value of the expression that didnt match previous expressions.
```rust
fn main() {
    let number = 7;

    match number {
        1 => println!("One"),
        2 => println!("Two"),
        other => println!("Number: {}", other),
    }
}
```
 #### `_` - wild card pattern
This is used when we just want to handle the mismatching but dont wanna store the value of amtch express

```rust
fn main() {
    let number = 7;

    match number {
        1 => println!("One"),
        2 => println!("Two"),
        _ => println!("Other number"), // `_` catches all other values
    }
}
```

## Control flow with `if let`

The if let syntax lets you combine if and let into a less verbose way to handle values that match one pattern while ignoring the rest
```rust
let config_max = Some(3u8);
if let Some(max) = config_max {
    println!("The maximum is configured to be {max}");
}
```
