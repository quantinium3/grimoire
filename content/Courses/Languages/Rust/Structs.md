---
id: Structs
aliases: 
tags:
  - "#Rust/Structs"
  - "#Rust/Impl"
  - "#Rust/Methods"
  - Rust
title: Structs
---

In Rust, a **struct** (short for "structure") is a custom data type that allows you to group together related data. Structs are similar to tuples, but unlike tuples, structs give names to each piece of data, making the code more readable and manageable.

### Defining a Struct
You define a struct using the `struct` keyword, followed by the name of the struct and a block of fields. Each field has a name and a type.
```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

In this example, `User` is a struct with four fields:
- `username` of type `String`
- `email` of type `String`
- `sign_in_count` of type `u64`
- `active` of type `bool`

### Creating an Instance of a Struct
To use a struct, you create an **instance** of it by specifying values for each field.
```rust
let user1 = User {
    username: String::from("john_doe"),
    email: String::from("john@example.com"),
    sign_in_count: 1,
    active: true,
};
```

Here, `user1` is an instance of the `User` struct with specific values for each field.
### Accessing Struct Fields
You can access the fields of a struct using dot notation.
```rust
println!("Username: {}", user1.username);
println!("Email: {}", user1.email);
```

### Mutable Structs
If you want to modify a struct after creating it, you must declare the instance as mutable.
```rust
let mut user1 = User {
    username: String::from("john_doe"),
    email: String::from("john@example.com"),
    sign_in_count: 1,
    active: true,
};

user1.email = String::from("john.doe@example.com");
```

### Field Init Shorthand
If you have variables with the same names as the struct fields, you can use the **field init shorthand** to avoid repetition.
```rust
let username = String::from("john_doe");
let email = String::from("john@example.com");

let user1 = User {
    username,
    email,
    sign_in_count: 1,
    active: true,
};
```

### Struct Update Syntax
```rust
let user2 = User {
    username: String::from("jane_doe"),
    email: String::from("jane@example.com"),
    ..user1
};
```

Here, `user2` will have the same `sign_in_count` and `active` values as `user1`, but a different `username` and `email`.

### Tuple Structs
Rust also supports **tuple structs**, which are similar to tuples but have a name. They are useful when you want to give a tuple a meaningful name.

```rust
struct Color(i32, i32, i32);
let black = Color(0, 0, 0);
```

### Unit-Like Structs
You can define a struct with no fields, called a **unit-like struct**. These are useful when you need to implement a trait but don’t need to store any data.

```rust
struct EmptyStruct;
let empty = EmptyStruct;
```

## Methods 
_Methods_ are similar to functions: we declare them with the `fn` keyword and a name, they can have parameters and a return value, and they contain some code that’s run when the method is called from somewhere else but unlike functions, methods are defined within the context of a `struct` , `enum` or trait object and their first parameter is always self.

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```
To define a function within context of a `struct` we use `impl` (implementation) block. As we see above the `impl` block contain all the methods that can be called on the struct Rypectangle.

The first parameters of a methods is `&self` as it is an alias for the type that the `impl` block is. 

> Methods can take ownership of `self`, borrow `self` immutably, as we’ve done here, or borrow `self` mutably, just as they can any other parameter.

The main reason for using `impl` instead of functions, in addition to providing method syntax and not having to repeat the type `self` in every method signature is for **organization**. We can put all the things that are related to an instance in an `impl` block.

### Associated functions
You can also define **associated functions** (similar to static methods in other languages) that don’t take `self` as a parameter. These are often used for constructors.

```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}
```
The `Self` keywords in the return type and in the body of the function are aliases for the type that appears after the `impl` keyword, which in this case is `Rectangle`.

To call this associated function, we use the `::` syntax with the struct name; `let sq = Rectangle::square(3);`
