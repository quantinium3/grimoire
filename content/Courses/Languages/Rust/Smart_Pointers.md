---
id: Smart Pointers
aliases: []
tags: []
title: Smart Pointers
---
A pointer is a general concept for a variable that contains an address in memory. This address refers to, or "points at", some other data.

Smart Pointer on the other hand, are data structures that act like a pointer but also have additional metadata and capabilities. `String` and `vec<T>` are also smart pointers. Smart pointers are usually implemented using structs. Unlike ordinary structs, smart pointers implement the `Deref` and `Drop` traits. The `Deref` trait allows an instance of smart pointer struct to behave like reference. The `Drop` trait allows you to customize the code that's run when an instance of the smart pointer goes out of scope.

The most common smart pointers in std library are - 
- `Box<T>` for allocating values on the heap.
- `Rc<T>`, a references counting type that enables multiple ownership.
- `Ref<T>` and `RefMut<T>`, accessed through `RefCell<T>` a type that enforces the borrowing rules at runtime instead of compile time.

## **USING `Box<T>` to point to Data on the heap**
Boxes allow you to store data on the heap rather than the stack. What remains on the stack is the pointer to the heap data.

We'll use them in situations such as - 
- When you have a type whose size can’t be known at compile time and you want to use a value of that type in a context that requires an exact size
- When you have a large amount of data and you want to transfer ownership but ensure the data won’t be copied when you do so.
- When you want to own a value and you care only that it’s a type that implements a particular trait rather than being of a specific type

### **Using a `Box<T>` to store data on the heap**
```rust
fn main() {
    let b = Box::new(5); // Store the value 5 on the heap
    println!("b = {}", b); // Dereference the box to access the value
}
```
- `Box::new(5)` allocates memory on the heap to store the value 5.
- The variable b is a `Box<i32>` that points to this heap-allocated value.
- When you print `b`, Rust automatically dereferences the box to access the value inside.

### **Enabling recursive types with boxes**
Rust needs to know the size of types at compile time, but recursive types (like linked lists or trees) have an indeterminate size. `Box<T>` can be used to create recursive types by storing the recursive part on the heap.

```rust
enum List {
    Cons(i32, Box<List>), // Recursive part is boxed
    Nil, // Base case
}

fn main() {
    let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))));
}
```

`Box<List>` allows the `Cons` variant to hold another `List` without causing infinite size issues as rust knows the size of a pointer and it  doesn't change based on the amount of data it's pointing to.

The `Cons` variant needs the size of an `i32` plus the space to store the box’s pointer data. The `Nil` variant stores no values, so it needs less space than the `Cons` variant. We now know that any `List` value will take up the size of an `i32` plus the size of a box’s pointer data. By using a `box`, we’ve broken the infinite, recursive chain, so the compiler can figure out the size it needs to store a `List` value.

![[Pasted image 20250226131333.png]]

Boxes provide only the indirection and heap allocation; they don’t have any other special capabilities.They also don’t have the performance overhead that these special capabilities incur, so they can be useful in cases like the cons list where the indirection is the only feature we need.

The `Box<T>` type is a smart pointer because it implements the `Deref` trait, which allows `Box<T>` values to be treated like references. When a `Box<T>` value goes out of scope, the heap data that the box is pointing to is cleaned up as well because of the `Drop` trait implementation. 

## **Treating Smart Pointers Like Regular References with the `Deref` Trait**
Implementing the `Deref` trait allows you to customize the behaviour of the dereference operator `*`. By implementing `Deref` lets us to write code that operates on references and use that code with smart pointers too.

### **References**
The variable `x` holds value `5` and the variable `y` stores the address of `x`. Therefore when we dereference `y` we get the value stored at address `x` i.e. 5.
```rust
fn main() {
    let x = 5;
    let y = &x;

    assert_eq!(5, x);
    assert_eq!(5, *y);
}
```

We can write it using `Box<T>` too cause it implements the `Deref` Trait. The main difference here is we store a copy of x in y which is stored in the heap and we can use the dereference operator to dereference it and get value of y.

```rust
fn main() {
    let x = 5;
    let y = Box::new(x);

    assert_eq!(5, x);
    assert_eq!(5, *y);
}
```

### **Implementing `MyBox<T>`**
```rust
use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0;
    }
}
```
1. **`MyBox<T>`**:
   - This is a tuple struct that wraps a value of type `T`. It’s similar to `Box<T>`, but it’s a custom implementation.

2. **`new` Constructor**:
   - The `new` function creates an instance of `MyBox` by wrapping the provided value `x`.

3. **`Deref` Implementation**:
   - The `Deref` trait is implemented for `MyBox<T>`.
   - The `type Target = T;` line specifies that the target type for dereferencing is `T`.
   - The `deref` method returns a reference to the inner value (`&self.0`).

4. **Dereferencing in `main`**:
   - `*y` works because `MyBox<T>` implements the `Deref` trait. The `*` operator calls the `deref` method, which returns a reference to the inner value (`5` in this case).

### **Implicit Deref Coercions with Functions and Methods**
#### **What is Deref Coercion?**
Deref coercion is a convenience in Rust that automatically converts a reference to a type that implements the `Deref` trait into a reference to another type. This happens when you pass a reference to a function or method, and the type of the reference doesn’t exactly match the parameter type expected by the function.

For example:
- `&String` can be automatically converted to `&str` because `String` implements the `Deref` trait to return `&str`.
- Similarly, `&MyBox<String>` can be converted to `&str` through a sequence of `deref` calls.

When you pass a reference to a function, Rust checks if the type of the reference implements the `Deref` trait. If it does, Rust calls the `deref` method as many times as necessary to convert the reference into the type expected by the function.

For example:
1. If you pass `&MyBox<String>` to a function that expects `&str`, Rust will:
   - Call `deref` on `&MyBox<String>` to get `&String`.
   - Call `deref` on `&String` to get `&str`.

### **Example: Deref Coercion in Action**

Let’s use the `MyBox<T>` type and the `hello` function to demonstrate deref coercion.

#### **1. Define `MyBox<T>` and Implement `Deref`**

```rust
use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
```

Here, `MyBox<T>` is a custom smart pointer that implements the `Deref` trait. The `deref` method returns a reference to the inner value.

```rust
fn hello(name: &str) {
    println!("Hello, {name}!");
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&m);
}
```

1. `m` is a `MyBox<String>` containing the string `"Rust"`.
2. `&m` is a reference to `MyBox<String>`.
3. Rust calls `deref` on `&MyBox<String>`, which returns `&String`.
4. Rust calls `deref` on `&String`, which returns `&str`.
5. The `&str` matches the parameter type of the `hello` function, so the function executes successfully.

If Rust didn’t have deref coercion, you would need to manually convert `&MyBox<String>` into `&str` using explicit dereferencing and slicing:

```rust
fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&(*m)[..]);
}
```

1. `*m` dereferences `MyBox<String>` into `String`.
2. `&(*m)[..]` takes a full slice of the `String` to get `&str`.

This is much harder to read and write compared to the version with deref coercion.

#### **Why is Deref Coercion Useful?**
1. **Convenience**:
   - You don’t need to manually add `&` and `*` operators when passing references or smart pointers to functions.
   - Code becomes cleaner and easier to read.

2. **Flexibility**:
   - You can write functions that accept `&str` and still pass `&String`, `&MyBox<String>`, or other types that implement `Deref<Target = str>`.

3. **No Runtime Cost**:
   - Deref coercion happens at compile time, so there’s no performance penalty.


### Deref Coercion and Mutability
Rust does deref coercion when it finds types and trait implementations in three cases:

- From `&T` to `&U` when `T: Deref<Target=U>`
- From `&mut T` to `&mut U` when `T: DerefMut<Target=U>`
- From `&mut T` to `&U` when `T: Deref<Target=U>`

> immutable references will never coerce to mutable references.

## **Running Code on Cleanup with the Drop Trait**
The `Drop` trait lets you customize what we wanna do with the smart pointer when it goes out of scope such as releasing resources.

- The `Drop` trait has a single method: `fn drop(&mut self)`.
- It is automatically called when an instance of the type is about to go out of scope.

```rust
struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        println!("Dropping resource: {}", self.name);
    }
}

fn main() {
    let _res = Resource { name: String::from("MyResource") };
    println!("Resource created");
} // `_res` goes out of scope here, and `drop` is called automatically
```

### **Dropping a value early with `std::mem::drop`**
`std::mem::drop` is a function in Rust's standard library that explicitly drops a value before it would naturally go out of scope. This is useful when you want to force resource cleanup at a specific point in your program.

- Moves the value into the function, consuming it.
- Calls the `Drop` trait (if implemented) for the value.
- Ensures the value is deallocated and cleaned up immediately.
- Does **not** require the value to be mutable.

```rust
struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        println!("Dropping resource: {}", self.name);
    }
}

fn main() {
    let res = Resource { name: String::from("MyResource") };
    println!("Resource created");

    std::mem::drop(res); // Explicitly drop `res` here

    println!("Resource manually dropped");
} // No automatic drop since `res` is already consumed
```

```
Resource created
Dropping resource: MyResource
Resource manually dropped
```

## **`Rc<T>`, the Reference Counted Smart Pointer**
`Rc<T>` (Reference Counted Smart Pointer) is a type in Rust's standard library that allows multiple ownership of a value using reference counting. It enables multiple parts of a program to share ownership of a value, and the value is only dropped when the last reference to it is gone.

1. **Reference Counting:** It keeps track of how many `Rc` instances refer to the same value.
2. **Shared Ownership:** Multiple `Rc<T>` instances can own the same value.
3. **Immutable Borrowing:** `Rc<T>` only allows shared (`&T`) access, meaning you cannot mutate the value directly.
4. **Thread-Local:** `Rc<T>` is **not** thread-safe. Use `Arc<T>` for multi-threading.

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(10); // Create a reference-counted integer
    let b = Rc::clone(&a); // Increase reference count
    let c = Rc::clone(&a); // Increase reference count

    println!("a = {}, reference count = {}", a, Rc::strong_count(&a));
}
```