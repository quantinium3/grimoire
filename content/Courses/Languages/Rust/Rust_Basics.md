---
id: Rust_Basics
aliases: 
tags:
  - "#Rust/Variables"
  - "#Rust/DataTypes"
  - "#Rust/Syntax"
  - "#Rust/Comments"
  - "#Rust/Conditionals"
  - "#Rust/Loops"
  - Rust
---

## Variables and Mutability

### Variables
In Rust, you declare a variable using the let keyword. By default, variables in Rust are immutable, meaning once a value is bound to a variable, it cannot be changed.

```Rust
let x = 5;
x = 6; // This will cause a compile-time error
```

### Mutability
If you want a variable to be mutable, you need to explicitly declare it as such using the mut keyword. This allows you to change the value of the variable after it has been initialized.

```rust
let mut x = 5;
x = 6; // This is allowed because x is mutable
```
In this example, x is declared as mutable, so you can change its value from 5 to 6 without any issues.

> **Why Immutability?**
  Immutability is a key feature in Rust that helps prevent certain kinds of bugs, especially in concurrent programming. When a variable is immutable, you can be sure that its value won't change unexpectedly, which makes reasoning about the code easier and safer.

### Shadowing
Rust also allows variable shadowing, where you can declare a new variable with the same name as a previous variable. The new variable shadows the previous one, and it can have a different type or mutability.

```rust
let x = 5;
let x = x + 1; // This is allowed, and x is now 6
let x = "hello"; // This is also allowed, and x is now a string
```
Shadowing is different from mutability because each let declaration creates a new variable, and the old variable is no longer accessible.

### Constants
Rust also has constants, which are always immutable. Constants are declared using the const keyword and must have a type annotation. They are evaluated at compile time and can be declared in any scope.

```rust
const MAX_POINTS: u32 = 100_000;
```

## Data Types
Rust is a statically typed language, which means that the type of every variable must be known at compile time. Rust provides a rich set of data types that can be broadly categorized into scalar and compound types

- **Scalar types** - Scalar types represent a single value. Rust has four primary scalar types:
  - Integers - 
    - Integers are whole numbers without a fractional component.
    - Rust has signed (i) and unsigned (u) integers of various sizes:
      `i8, i16, i32, i64, i128, isize (signed)`
      `u8, u16, u32, u64, u128, usize (unsigned)`
  - Floating point numbers - 
    - Floating-point numbers have a fractional component.
    - Rust has two floating-point types:
      `f32 (32-bit, single precision)`
      `f64 (64-bit, double precision, default)`
  - Booleans - 
    - Booleans have two possible values: true or false.
    - The type is `bool`.
  - Characters - 
    - Characters represent a single Unicode scalar value.
    - The type is `char`, and it is enclosed in single quotes (').
    - `char` in Rust is 4 bytes, allowing it to represent more than just ASCII (e.g., emojis, accented letters).

```rust
let x: i32 = 42;
let y: u64 = 100;

let x: f32 = 3.14;
let y: f64 = 2.71828;

let is_rust_fun: bool = true;

let letter: char = 'A';
let emoji: char = '😊';
```

- **Compound Types** - Compound types group multiple values into one type. Rust has two primitive compound types:
  - Tuples - 
    - Tuples group values of different types into a single compound type.
    - They have a fixed length: once declared, they cannot grow or shrink in size.
    - Access elements using dot notation (.0, .1, etc.) or destructuring.
  - Arrays - 
    - Arrays store multiple values of the same type.
    - They have a fixed length, and their size is determined at compile time.
    - Arrays are stored on the stack, making them fast but inflexible.

```rust
let tup: (i32, f64, char) = (42, 3.14, 'A');
let (x, y, z) = tup; // Destructuring
println!("The first value is {}", tup.0);

let arr: [i32; 5] = [1, 2, 3, 4, 5];
println!("The first element is {}", arr[0]);
```

- **Custom Types** - Rust also allows you to define your own custom types using struct, enum, and union.
  - Structs - 
    - Structs are custom data types that group related data together.
    - They are similar to classes in other languages but without inheritance.
  - Enums - 
    - Enums allow you to define a type by enumerating its possible variants.
    - Each variant can optionally hold data.
  - Unions - 
    - Unions are similar to structs but share the same memory location for all fields.
    - They are primarily used for low-level programming and FFI (Foreign Function Interface).

```rust
//struct 
struct Person {
    name: String,
    age: u8,
}

let person = Person {
    name: String::from("Alice"),
    age: 30,
};

// enum
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

let dir = Direction::Up;
```

- **Other types**
  - String- 
    - `String`: A growable, heap-allocated string.
    - `&str`: A string slice, which is a reference to a part of a string.
  - Option and Result - 
    - `Option<T>`: Represents an optional value, either Some(T) or None.
    - `Result<T, E>`: Represents either a success (Ok(T)) or an error (Err(E)).
  - Slices - 
    - Slices are references to a contiguous sequence of elements in a collection.

```rust
let s1: String = String::from("Hello");
let s2: &str = "world";

let some_number: Option<i32> = Some(5);
let no_number: Option<i32> = None;

let result: Result<i32, &str> = Ok(42);
let error: Result<i32, &str> = Err("Something went wrong");

let arr = [1, 2, 3, 4, 5];
let slice: &[i32] = &arr[1..3]; // [2, 3]
```

## Functions
Functions are a fundamental building block in Rust, and understanding them is key to writing effective Rust code

### Function syntax
In Rust, functions are declared using the fn keyword. Here's the basic structure:

```rust
fn function_name(parameter1: Type1, parameter2: Type2) -> ReturnType {
    // Function body
    return value; // Optional return statement
}
```

- `fn`: Keyword to define a function.
- `function_name`: The name of the function (use snake_case by convention).
- `parameter`: Type: Parameters with their types (Rust is statically typed).
- `-> ReturnType`: Specifies the return type of the function.
- `return value`: Optional; the last expression in the function is automatically returned if return is omitted.

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y // No semicolon means this is the return value
}

fn main() {
    let result = add(3, 5);
    println!("Result: {}", result); // Output: Result: 8
}
```

### Parameters and Arguments
Functions can take zero or more parameters and each parameter must have a type annotation.
```rust
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    greet("Alice"); // Output: Hello, Alice!
}
```
### Return Values
- Functions can return values using the `->` syntax.
- If the last expression in the function doesn't end with a semicolon, it is automatically returned.
- You can also use the return keyword explicitly, but it's optional for the last expression.

```rust
fn is_even(num: i32) -> bool {
    num % 2 == 0
}

fn main() {
    println!("Is 4 even? {}", is_even(4)); // Output: Is 4 even? true
}
```

### Expressions and Statements
- **Expressions**: Evaluate to a value (e.g., `x + y`, `5`, `if condition { ... }`).
- **Statements**:Perform an action but do not return a value (e.g., `let x = 5;`, `println!()`).

## Comments 
```rust
// hello, world

// So we’re doing something complicated here, long enough that we need
// multiple lines of comments to do it! Whew! Hopefully, this comment will
// explain what’s going on.

fn main() {
    let lucky_number = 7; // I’m feeling lucky today
}

fn main() {
    // I’m feeling lucky today
    let lucky_number = 7;
}

/* Multiline comment
fn main() {
    // I’m feeling lucky today
    let lucky_number = 7;
}
*/

```

## Control Flow
Control flow in Rust allows you to dictate the order in which your code executes.

### Conditional Statements
Rust uses `if`, `else if`, and `else` to execute code based on conditions. Unlike some languages, Rust requires the condition to be a boolean value (`true` or `false`).

```rust
if condition1 {
    // Code to execute if condition1 is true
} else if condition2 {
    // Code to execute if condition2 is true
} else {
    // Code to execute if all conditions are false
}
```

```rust
fn main() {
    let number = 7;

    if number < 5 {
        println!("Condition 1: number is less than 5");
    } else if number == 5 {
        println!("Condition 2: number is equal to 5");
    } else {
        println!("Condition 3: number is greater than 5");
    }
}
```

**Using `if` in a `let` statement** 
if is an expression in Rust, so it can be used to assign a value:
```rust
fn main() {
    let condition = true;
   let number = if condition { 5 } else { 6 }; // gives you the ternary feel
    println!("The value of number is: {}", number);
}
```

### Loops
Rust provides three types of loops: `loop`, `while`, and `for`.
- **loop** - the `loop` keyword will create an infinite loop.
```rust
fn main() {
    let mut count = 0;

    loop {
        count += 1;
        println!("Count: {}", count);

        if count == 3 {
            break; // Exit the loop
        }
    }
}
```
- **while** - The `while` loop runs as long as a condition is true.
```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }

    println!("LIFTOFF!");
}
```

- **for** - The `for` loop is used to iterate over a collection, such as an array or a range.
```rust
fn main() {
    let arr = [10, 20, 30, 40, 50];

    for element in arr.iter() {
        println!("The value is: {}", element);
    }

    // Iterate over a range
    for number in 1..4 {
        println!("{}!", number); // Prints 1, 2, 3
    }
}
```

### Pattern Matching
The match expression is a powerful control flow construct in Rust. It allows you to compare a value against a series of patterns and execute code based on the matching pattern.

```rust
match value {
    pattern1 => { /* code */ },
    pattern2 => { /* code */ },
    _ => { /* default case */ },
}
```

```rust
fn main() {
    let number = 3;

    match number {
        1 => println!("One"),
        2 => println!("Two"),
        3 => println!("Three"),
        _ => println!("Something else"), // Default case
    }
}
```

Using match with enums 
```rust
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

fn main() {
    let dir = Direction::Up;

    match dir {
        Direction::Up => println!("Going up!"),
        Direction::Down => println!("Going down!"),
        Direction::Left => println!("Going left!"),
        Direction::Right => println!("Going right!"),
    }
}
```

### Extra
- `if let` and `while let` - These constructs are shorthand for match when you only care about one pattern.

```rust
fn main() {
    let some_value = Some(5);

    if let Some(x) = some_value {
        println!("x is: {}", x); // Prints: x is: 5
    } else {
        println!("No value");
    }
}

fn main() {
    let mut stack = vec![1, 2, 3];

    while let Some(top) = stack.pop() {
        println!("Popped: {}", top); // Prints: 3, 2, 1
    }
}
```

- Control Flow with `break` and `continue`
  - `break`: Exits a loop immediately.
  - `continue`: Skips the rest of the current iteration and moves to the next iteration.

```rust
fn main() {
    let mut count = 0;
    loop {
        count += 1;
        if count == 3 {
            continue; // Skip the rest of this iteration
        }
        println!("Count: {}", count);
        if count == 5 {
            break; // Exit the loop
        }
    }
}
```
- Nested loops and labels
  - You can label loops to control which loop break or continue applies to.

```rust
fn main() {
    let mut count = 0;

    'outer: loop {
        'inner: loop {
            if count >= 5 {
                break 'outer; // Exit the outer loop
            }
            count += 1;
            println!("Count: {}", count);
        }
    }
}
```
