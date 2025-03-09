---
id: Ownership
aliases: 
tags:
  - "#Rust/Ownership"
  - "#Rust/Scope"
  - "#Rust/Slices"
  - "#Rust/Strings"
  - "#Rust/Borrowing"
  - "#Rust/References"
  - Rust
title: Ownership
---

Ownership is Rust's way of managing memory safety without a garbage collector. It enforces strict rules at compile time to ensure memory safety, prevent data races, and eliminate common bugs like null pointer dereferencing or use-after-free errors.
### Stack and Heap
The stack and heap are two regions of memory used for different purposes in a program. They differ in how memory is allocated, accessed, and managed.

#### Stack - 
- **Structure**: The stack is a LIFO (Last-In, First-Out) data structure. It grows and shrinks automatically as functions are called and return.
- **Allocation**: Memory is allocated in a contiguous block. Each function call creates a new stack frame, which contains local variables, function parameters, and return addresses.
- **Speed**: Extremely fast because memory allocation and deallocation are just pointer adjustments.
- **Size**: Limited in size (typically a few MB per thread).
- **Lifetime**: Memory is automatically reclaimed when a function returns (its stack frame is popped).
- **Use Case**: Ideal for small, fixed-size data with predictable lifetimes (e.g., local variables, function arguments).

```rust
fn main() {
    let x = 5; // `x` is stored on the stack
    let y = 10; // `y` is stored on the stack
    let sum = add(x, y); // Function call creates a new stack frame
    println!("Sum: {}", sum);
}

fn add(a: i32, b: i32) -> i32 {
    a + b // `a` and `b` are stored on the stack
}
```
#### Heap - 
- **Structure**: The heap is a more flexible memory region where data can be allocated and freed in any order.
- **Allocation**: Memory is allocated dynamically at runtime. You request a block of memory of a specific size, and the memory manager finds a suitable spot.
- **Speed**: Slower than the stack because it involves finding and managing memory blocks.
- **Size**: Much larger than the stack (limited by available system memory).
- **Lifetime**: Memory must be explicitly allocated and deallocated (or managed by a garbage collector or ownership system, as in Rust).
- **Use Case**: Ideal for data with dynamic size or unpredictable lifetimes (e.g., strings, collections, or large objects).

```rust
fn main() {
    let s = String::from("hello"); // `s` is stored on the heap
    println!("{}", s);
}
```
###  The Three Rules of Ownership
- **Each value in Rust has a single owner.** - 
	- At any given time, a piece of data is owned by exactly one variable.
	- When the owner goes out of scope, the value is dropped (memory is freed).
- **There can only be one owner at a time.**
	- If you assign a value to another variable or pass it to a function, the ownership is _moved_. The original owner no longer has access to the value.
- **Ownership can be borrowed, but with strict rules.** - 
	- Instead of transferring ownership, you can create references to the value. These references can be either:
		- **Immutable references (`&T`)**: Multiple immutable references are allowed, but no mutable references can exist simultaneously.
		- **Mutable references (`&mut T`)**: Only one mutable reference is allowed at a time, and no immutable references can coexist.


### Variable Scope
Variable scope refers to the region of code where a variable is valid and can be accessed. It is defined by where the variable is declared and how long it lives in memory.

- Block Scope 
```rust
{   // s is not valid here, it’s not yet declared 
	let s = "hello"; // s is valid from this point forward 
	// do stuff with s 
} 
// this scope is now over, and s is no longer valid
```

### String Type
- **String Literals vs. `String` Type**
    - **String literals**: Immutable, hardcoded text stored in the program's binary.
    - **`String` type**: Mutable, dynamically allocated on the heap, and can store text of unknown size at compile time (e.g., user input).
- **Creating a `String`**  
	- Use the `String::from` function to create a `String` from a string literal:
```rust
let s = String::from("hello");
```
- - **Ownership and Heap Memory**
    - The `String` type owns its heap-allocated data.
    - When a `String` goes out of scope, Rust automatically frees the memory (no manual memory management or garbage collection needed)

`String` can be mutated as they are heap allocated and we can append a string literal at the end of it. This isnt possible with string literals as they are hardcoded in programs binary.

```rust
    let mut s = String::from("hello");
    s.push_str(", world!"); // push_str() appends a literal to a String
    println!("{s}"); // This will print `hello, world!`
```
### Memory Allocation
There are two well know and most used ways to allocate data on the heap.

#### Manual Memory Management
- **How it works**:  
    Developers explicitly allocate and deallocate memory using functions like `malloc` (in C) or `new`/`delete` (in C++).
    - **Allocation**: Request memory from the heap using `malloc` or similar functions.
    - **Deallocation**: Free memory using `free` or similar functions when it’s no longer needed.
	
```c
int* arr = (int*)malloc(10 * sizeof(int)); // Allocate memory for 10 integers
if (arr == NULL) {
    // Handle allocation failure
}
// Use the array
free(arr); // Free the memory when done
```

- **Pros**:
    - Full control over memory allocation and deallocation.
    - Predictable performance (no garbage collection pauses).
- **Cons**:
    - Error-prone: Forgetting to free memory leads to **memory leaks**.
    - Freeing memory too early leads to **dangling pointers**.
    - Freeing memory twice leads to **undefined behavior**
	
#### **Garbage Collection (GC)**
- **How it works**:  
    The runtime system (e.g., in Java, Python, or Go) automatically tracks memory usage and reclaims memory that is no longer referenced by the program.
    - **Reference Counting**: Counts references to objects and frees memory when the count drops to zero (used in Python).
    - **Tracing GC**: Periodically scans the heap to identify unreachable objects (used in Java, Go).
	
```python
s = "hello"  # Memory is allocated automatically
s = "world"  # Old string "hello" is garbage collected
```

- **Pros**:
    - No manual memory management required.
    - Prevents memory leaks, dangling pointers, and double-free errors.
- **Cons**:
    - Overhead: GC introduces runtime performance costs (e.g., pauses for tracing).
    - Less control: Developers can’t predict exactly when memory will be freed.

#### Rust’s Approach: Ownership and Borrowing
Rust takes a unique approach that combines the best of both worlds:
- **No Garbage Collector**: Rust avoids runtime overhead by not using a GC.
- **No Manual Memory Management**: Rust enforces strict compile-time rules (ownership, borrowing, and lifetimes) to ensure memory safety.

```rust
fn main() {
    let x = 5;
    let y = x;
}
```

Here we can guess that `x` is being bound to 5 and the for y we make a copy of `x` and store it in y. This is how it happens for integers, floats, etc cause these are small data types and all can be done on compile time. 

For example the assembly of this may look like this.
```rust
mov dword ptr [rsp - 8], 5 
mov dword ptr [rsp - 4], 5
ret
```
The compiler being an intelligent being know the value of `x` is 5 so it just make two variable with value `5`.

But in case of data structures such as `String` this isn't possible as we don't know what the size of the `String` needs to be cause the user may append string literal 


![string_representation](https://doc.rust-lang.org/stable/book/img/trpl04-01.svg)
As we can see in this, A string `s1` is made up of three parts - pointer to address on heap, length of string and the total capacity of string. These are stored on the stack. 

When we assign `s1 = s2` ,  we copy the pointer, the length, and the capacity that are on the stack.

![string_assignment](https://doc.rust-lang.org/stable/book/img/trpl04-02.svg)

Now if we cloned string `s1` and then assigned that to `s2` we would have the following representation: 
![string_clone](https://doc.rust-lang.org/stable/book/img/trpl04-03.svg)
There cloning is considered an expensive process as we have to allocate new memory in the heap for the new string. If we don't clone the ownership of the `s1` is transferred to `s2`  not making this an expensive operation due to no heap allocations.

There its generally not recommended to clone a data as that can be an expensive operation.

The operation of `s1 = s2` may sound like shallow copy in other languages as we copy the stack data but in Rust we invalidate `s1` , therefore it is called a `move` operation. `s1` was moved into `s2`.

## Scope and Assignment
In Rust, when you assign a new value to an existing variable, Rust automatically calls the `drop` function to free the memory of the original value immediately. For example, in the code:
```rust
let mut s = String::from("hello"); 
s = String::from("ahoy"); 
println!("{s}, world!");
```

In Rust, if you need to create a **deep copy** of heap data (not just the stack data like pointers, length, and capacity), you can use the `clone` method. For example:

```rust
let s1 = String::from("hello");
let s2 = s1.clone();
println!("s1 = {s1}, s2 = {s2}");
```

- The `clone` method creates a full copy of the `String`'s heap data, so both `s1` and `s2` are independent and valid.
- This is different from a move or shallow copy, as `clone` explicitly duplicates the data, allowing both variables to coexist.

In Rust, certain types, like integers, have a known size at compile time and are stored entirely on the stack. For these types, copying the value is fast and straightforward, so Rust automatically performs a **trivial copy** instead of a move. This means that after assigning one variable to another, both variables remain valid. For example:

```rust
let x = 5;
let y = x;
println!("x = {x}, y = {y}");
```

Here, `x` and `y` are both valid because the value `5` is copied, not moved. This behavior is enabled by the **`Copy` trait**, which is automatically implemented for types that can be stored entirely on the stack. Example :
- All the integer types, such as `u32`.
- The Boolean type, `bool`, with values `true` and `false`.
- All the floating-point types, such as `f64`.
- The character type, `char`.
- Tuples, if they only contain types that also implement `Copy`. For example, `(i32, i32)` implements `Copy`, but `(i32, String)` does not.

## Ownership and Functions
In Rust, passing a value to a function follows the same ownership rules as assigning a value to a variable.

```rust
fn main() {
    let s = String::from("hello");  // s comes into scope

    takes_ownership(s);             // s's value moves into the function...
                                    // ... and so is no longer valid here

    let x = 5;                      // x comes into scope

    makes_copy(x);                  // x would move into the function,
                                    // but i32 is Copy, so it's okay to still
                                    // use x afterward

} // Here, x goes out of scope, then s. But because s's value was moved, nothing
  // special happens.

fn takes_ownership(some_string: String) { // some_string comes into scope
    println!("{some_string}");
} // Here, some_string goes out of scope and `drop` is called. The backing
  // memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
    println!("{some_integer}");
} // Here, some_integer goes out of scope. Nothing special happens.
```

### Return values and scopes

Returning a value can transfer ownership cause we are returning the value from the function.

```rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership moves its return
                                        // value into s1

    let s2 = String::from("hello");     // s2 comes into scope

    let s3 = takes_and_gives_back(s2);  // s2 is moved into
                                        // takes_and_gives_back, which also
                                        // moves its return value into s3
} // Here, s3 goes out of scope and is dropped. s2 was moved, so nothing
  // happens. s1 goes out of scope and is dropped.

fn gives_ownership() -> String {             // gives_ownership will move its
                                             // return value into the function
                                             // that calls it

    let some_string = String::from("yours"); // some_string comes into scope

    some_string                              // some_string is returned and
                                             // moves out to the calling
                                             // function
}

// This function takes a String and returns one
fn takes_and_gives_back(a_string: String) -> String { // a_string comes into
                                                      // scope

    a_string  // a_string is returned and moves out to the calling function
}
```

This way of giving ownership and taking back ownership of the variable by returning seems tedious therefore we use references to deal with this.

## References and Borrowing
Instead of returning a tuple from a function to be able to use that variable again we will pass it as a reference to the function.

>  A _reference_ is like a pointer in that it’s an address we can follow to access the data stored at that address; that data is owned by some other variable. Unlike a pointer, a reference is guaranteed to point to a valid value of a particular type for the life of that reference.

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{s1}' is {len}.");
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

In the above example we pass reference of `s1` to `calculate length` , therefore we are able to use it the function without the variable being dropped when function finishes running as the `s1` owner is still the main function.

We call the action of creating a reference _borrowing_. As in real life, if a person owns something, you can borrow it from them. When you’re done, you have to give it back. You don’t own it.

There are two types of references:
- **Immutable Reference (`&T`)** - 
	- An immutable reference allows you to read the data but not modify it.
	- Multiple immutable references to the same data are allowed at the same time.
- **Mutable Reference (`&mut T`)**
	- - A mutable reference allows you to read and modify the data.
	- Only one mutable reference to a particular piece of data is allowed at a time (no other references, mutable or immutable, can exist simultaneously).

Once caveat of mutable references have one big restriction that you cant make more than one mutable references as this can cause data races but we can have as many immutable references as we want.

### Dangling references
In languages like C or C++ it's really easy to create dangling pointers. In Rust,  the compiler guarantees that references will never be dangling references: if you have a reference to some data, the compiler will ensure that the data will not go out of scope before the reference to the data does.

```rust
fn dangle() -> &String { // dangle returns a reference to a String

    let s = String::from("hello"); // s is a new String

    &s // we return a reference to the String, s
} // Here, s goes out of scope, and is dropped. Its memory goes away.
  // Danger!
```

### The Rules of References 
The rules of references - 
- At any given time, you can have _either_ one mutable reference _or_ any number of immutable references.
- References must always be valid.

## Slices
_Slices_ let you reference a contiguous sequence of elements in a [collection](https://doc.rust-lang.org/stable/book/ch08-00-common-collections.html) rather than the whole collection. A slice is a kind of reference, so it does not have ownership.

### String slices
A _string slice_ is a reference to part of a `String`, and it looks like this:
```rust
    let s = String::from("hello world");

    let hello = &s[0..5];
    let world = &s[6..11];
```

Rather than a reference to the entire `String`, `hello` is a reference to a portion of the `String`, specified in the extra `[0..5]` bit. We create slices using a range within brackets by specifying `[starting_index..ending_index]`, where `starting_index` is the first position in the slice and `ending_index` is one more than the last position in the slice. Internally, the slice data structure stores the starting position and the length of the slice, which corresponds to `ending_index` minus `starting_index`.

![slice_representation](https://doc.rust-lang.org/stable/book/img/trpl04-07.svg)
> String slice range indices must occur at valid UTF-8 character boundaries. If you attempt to create a string slice in the middle of a multibyte character, your program will exit with an error.

#### String literals as slices
As we know that string literals are stored inside the binary
```rust
let s = "Hello, world!";
```

The type of `s` here is `&str`: it’s a slice pointing to that specific point of the binary. This is also why string literals are immutable; `&str` is an immutable reference.

#### Other parameters
String slices, as you might imagine, are specific to strings. But there’s a more general slice type too. Consider this array:
```rust
let a = [1, 2, 3, 4, 5];
```

```rust
let a = [1, 2, 3, 4, 5];
let slice = &a[1..3];
assert_eq!(slice, &[2, 3]);
```
This slice has the type `&[i32]`. It works the same way as string slices do, by storing a reference to the first element and a length
