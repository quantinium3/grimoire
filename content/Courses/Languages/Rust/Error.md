---
id: Error
aliases: 
tags:
  - "#Rust/Errors"
  - Rust
  - Rust/Result
title: Error
---

## Error Handling
Rust takes a robust and thoughtful approach to handling errors, recognizing that errors are an inevitable part of software engineering.

Rust groups error in two categories - 
- Recoverable - such as `file not found` error. This is recoverable and can be done automatically or reported to user.
- Non-Recoverable - They are symptoms of bugs, such as trying to access location beyond the end of array.

### Unrecoverable Error
Sometimes bad things may happen and we want a way to just exit and display what bad has happened. For this rust has a `panic!` macro. There are two ways to cause a panic in practice: by taking an action that causes our code to panic (such as accessing an array past the end) or by explicitly calling the `panic!` macro.

panic prints a failure message, unwind and clean up the stack and quit.

```rust
fn main() {
    panic!("crash and burn");
}
```
### Recoverable Error
Most error aren't serious enough to require the program to stop entirely. Sometimes if something fails we can somewhat guess why it may fail and can therefore handle it.

Rust implements a `Result<T, E>` enum to handle potential errors.
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```
Here `T` represents the type of the value that will be returned in a success case within the `Ok` variant, and `E` represents the type of error that will be returned in a failure case.

For example while opening a file
```rust
use std::fs::File;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => panic!("Problem opening the file: {error:?}"),
    };
}
```

Here we see if opening file succeeds then the its ok. If it fails we panic.

We can extend this approach to handle different types of errors.
```rust
use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let greeting_file_result = File::open("hello.txt");

    let greeting_file = match greeting_file_result {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(fc) => fc,
                Err(e) => panic!("Problem creating the file: {e:?}"),
            },
            other_error => {
                panic!("Problem opening the file: {other_error:?}");
            }
        },
    };
}
```
For example here if the file in not found, we try to create it and then handle the error that may occur while creating the file and if its some other error we then also panic.

### Shortcuts for Panic on Error: unwrap and expect
Using match works well enough, but it can be a bit verbose and doesn’t always communicate intent well. The Result enum has some helper methods defined on it to do various, more specific tasks.

The `unwrap` method is a shortcut method implement just like the `match` expression. If the Result value is the `Ok` variant, unwrap will return the value inside the `Ok`. If the Result is the `Err` variant, unwrap will call the `panic!` macro for us.

```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt").unwrap();
}
```

Similarly, the expect method lets us also choose the panic! error message. Using expect instead of unwrap and providing good error messages can convey your intent and make tracking down the source of a panic easier.

```rust
use std::fs::File;

fn main() {
    let greeting_file = File::open("hello.txt")
        .expect("hello.txt should be included in this project");
}
```

### Propagating errors
When a function’s implementation calls something that might fail, instead of handling the error within the function itself you can return the error to the calling code so that it can decide what to do. This is known as propagating the error and gives more control to the calling code, where there might be more information or logic that dictates how the error should be handled than what you have available in the context of your code.

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let username_file_result = File::open("hello.txt");

    let mut username_file = match username_file_result {
        Ok(file) => file,
        Err(e) => return Err(e),
    };

    let mut username = String::new();

    match username_file.read_to_string(&mut username) {
        Ok(_) => Ok(username),
        Err(e) => Err(e),
    }
}
```

If the code succeeds without any problem the function receive and `Ok` value that hold a `String` - the username. If the function encounter any error, the calling code will receive an `Err` value that hold the instance of `io::Error` that contains info about the problem that happened here.

The pattern of propagating errors is so common in rust that it provides a `?` operator for this.

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut username_file = File::open("hello.txt")?;
    let mut username = String::new();
    username_file.read_to_string(&mut username)?;
    Ok(username)
}
```
The `?` operator can only be used in functions whose return type is compatible with the value the `?` is used on. This is because the `?` operator is defined to perform an early return of a value out of the function, in the same manner as the match expressions.

The `?` operator can also used with the `Option<T>` enum. If you have a function that returns an `Option<T>`, the `?` operator can be used to automatically propagate None values. Here's how it works:
- If the value is Some(value):
  - The `?` operator unwraps the Some and returns the inner value, allowing the computation to continue.
- If the value is None:
  - The `?` operator immediately returns None from the enclosing function, propagating the None upward.

```rust
fn find_username(id: u32) -> Option<String> {
    match find_user(id) {
        Some(user) => Some(user.username),
        None => None,
    }
}

fn find_username(id: u32) -> Option<String> {
    let user = find_user(id)?;
    Some(user.username)
}

fn find_user(id: u32) -> Option<User> {
    // Simulate a database lookup
    if id == 1 {
        Some(User { username: String::from("Alice") })
    } else {
        None
    }
}
```

### To Panic or not panic
#### When to Use panic!:
- Unrecoverable Errors: Use panic! when an error is unrecoverable, such as when a program enters a "bad state" (e.g., invalid values, broken invariants, or unsafe conditions).
- Examples, Prototypes, and Tests: In examples, prototypes, and tests, panic! (via unwrap or expect) is acceptable for simplicity, as robust error handling can obscure the main point.
- Logical Guarantees: Use panic! when you have logical guarantees that an error cannot occur (e.g., hardcoded valid values), even if the compiler cannot verify it.
- Safety and Security: Panic when invalid inputs could lead to unsafe or harmful behavior, such as out-of-bounds memory access.

#### When to Use Result:
- Recoverable Errors: Use Result for errors that the calling code might recover from, such as parsing malformed data or handling rate limits.
- Default Choice: Returning Result is the default choice for functions that might fail, as it allows the caller to decide how to handle errors.

#### Guidelines for Error Handling:
- Bad State: Panic when the program enters a bad state (e.g., invalid inputs, broken invariants) and recovery is not feasible.
- Expected Failures: Use Result for expected failures, such as user input errors or network issues.
- Type System: Leverage Rust’s type system (e.g., Option, u32) to enforce valid values at compile time, reducing the need for runtime checks.

#### Custom Types for Validation:
- Encapsulate Validation: Create custom types (e.g., a Guess type for values between 1 and 100) to enforce validation rules and avoid repetitive checks.
- Private Fields: Use private fields to ensure values are only set through controlled constructors that enforce validation.

```rust
pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {value}.");
        }
        Guess { value }
    }

    pub fn value(&self) -> i32 {
        self.value
    }
}
```
This Guess type ensures values are always within the valid range, panicking if not, and encapsulates the validation logic.
