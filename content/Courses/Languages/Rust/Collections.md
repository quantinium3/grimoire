---
id: Collections
aliases: 
tags:
  - "#Rust/Collections"
  - Rust
  - Rust/Collections/Vectors
  - Rust/Collections/HashMap
  - Rust/Collections/String
title: Collections
---

## Vectors
Vectors allow you to store more than one value in a single data structure that puts all the values next to each other in memory. Vectors can only store values of the same type. They are similar to vector in C++.

### Create a vector
```rust
let v: Vec<i32> = Vec::new();
```
Here we had to define the type cause we haven't put any value in the vector.

Generally rust compiler will infer the type of data that is stored inside the vector if put an element while defining the vector.
```rust
    let v = vec![1, 2, 3];
```
### Update a vector
We use the push method to push element to the back of the vector
```rust
    let mut v = Vec::new();

    v.push(5);
    v.push(6);
    v.push(7);
    v.push(8);
```
### Reading elements of a vector
In rust we have two way to get the value of a vector at an index - `[]`,`get()`. The vectors in rust at 0 indexed so first element is at index 0.

```rust
    let v = vec![1, 2, 3, 4, 5];

    let third: &i32 = &v[2];
    println!("The third element is {third}");

    let third: Option<&i32> = v.get(2);
    match third {
        Some(third) => println!("The third element is {third}"),
        None => println!("There is no third element."),
    }
```

### Iterating over the values in a vector
To iterate over elements in a vector we can use for loop to get a mutable or immutable reference of elements in a vector
```rust
    let v = vec![1, 2, 3, 4, 5];
    for i in &b {
        println!("{i}")
    }

    let mut v = vec![100, 32, 57];
    for i in t &mut v {
        *i += 50;
    }

```
Vectors (`Vec<T>`) implement the `iter()` method, which returns an iterator over references to the elements in the vector.
```rust
    let v = vec![1, 2, 3, 4, 5];
    for i in v.iter() {
        println!("{i}")
    }
```

### Using an enum to store multiple types
Vectors can only store values that are of the same type. This can be inconvenient; there are definitely use cases for needing to store a list of items of different types

```rust
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }

    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
```

### Dropping a vector
Vector in rust implement the `Drop` trait i.e. when a vector goes out of scope it would be freed.

```rust
    {
        let v = vec![1, 2, 3, 4];

        // do stuff with v
    } // <- v goes out of scope and is freed here
```

## String
Rust only has one string type in the core language, which is `str` - string literal.

The `String` type, which is provided by rust's standard library is a growable, mutable, owned, UTF-8, heap allocated string type.

A `String` is a wrapper around `Vec<u8>` but the `len()` method return the number of bytes not the number of characters. For example the string `"hola"` is 4 bytes long(each char is 1-byte in UTF-8) but the string `"Здравствуйте"` is 24 bytes long(each cyrillic character is 2 bytes long in UTF-8).

Since `String` is UTF-8 encoded this means that a character can take 1 to 4 bytes to store a char making byte level indexing unreliable. There if we do `&s[0]` this would give us a compilation error.

### Creating a new string
Many of the same operations available with `Vec<T>` are available with `String` as well because `String` is actually implemented as a wrapper around a vector of bytes with some extra guarantees, restrictions, and capabilities
```rust
    let mut s = String::new();
    let v = String::new("hello")
```
This creates a new, empty string `s` into which we can load data. `v` is a string that is allocated to with initialized string.

### Updating a string
We can grow a string using `push_str` method to append a string slice. 
```rust
    let mut s = String::from("foo");
    s.push_str("bar");
```
this appends the string literal `"bar"` to the string `"foo"`. The `push_str` doesn't take ownership of the string literal.

The `push` method can be used to append a single character.
```rust
    let mut s = String::from("lo");
    s.push('l');
```
### Concatenation of string
In Rust, the `+` operator is used to concatenate strings

Using the + Operator:
- The `+` operator uses the `add` method, which has the signature `fn add(self, s: &str) -> String`.
- When you use `+`, the first string (`s1`) is moved into the `add` method, meaning it is no longer valid after the operation.
- The second string (`s2`) is passed as a reference (`&s2`), and Rust automatically coerces `&String` to `&str` using deref coercion.
- The result is a new String that combines the contents of `s1` and `s2`.

```rust
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // s1 is moved, s2 remains valid
```
If we need to concatenate multiple strings, the behavior of the + operator gets unwieldy:

```rust
    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");

    let s = s1 + "-" + &s2 + "-" + &s3;

```
this can be made easier using the `format!` macro.
```rust
    let s = format!("{s1}-{s2}-{s3}"); // all are valid afterwards
```

### Ways to interpret string
Rust provides three perspectives for working with strings:
- Bytes: The raw byte representation (e.g., [224, 164, 168, ...] for the Hindi word "नमस्ते").
- Scalar Values (Unicode): The char type, which represents Unicode scalar values (e.g., ['न', 'म', 'स', '्', 'त', 'े'] for "नमस्ते").
- Grapheme Clusters: The closest thing to human-readable "letters" (e.g., ["न", "म", "स्", "ते"] for "नमस्ते").
Each perspective is useful depending on the context, and Rust allows you to choose the appropriate one.

### Iterating over a string
The best way to operate on pieces of strings is to be explicit about whether you want characters or bytes.

```rust
for c in "Зд".chars() {
    println!("{c}");
}
// З
// д
```

```rust
for b in "Зд".bytes() {
    println!("{b}");
}

// 208
// 151
// 208
// 180
```

## Hash Maps
The type `HashMap<K, V>` stores a mapping of keys of type `K` to values of type `V` using a hashing function, which determines how it places these keys and values into memory

### Creating a new map
One way to create an empty hash map is to use `new` and to add elements with `insert`.
```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
```

### Accessing elements in a hash map
We can get a value out of the hash map by providing its key to the `get` method.

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    let team_name = String::from("Blue");
    let score = scores.get(&team_name).copied().unwrap_or(0);
```

### Iterating over a hash map
```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    for (key, value) in &scores {
        println!("{key}: {value}");
    }
```

### Ownership in hash map
For types that implement the Copy trait, like `i32`, the values are copied into the hash map. For owned values like `String`, the values will be moved and the hash map will be the owner of those values,

```rust
    use std::collections::HashMap;

    let field_name = String::from("Favorite color");
    let field_value = String::from("Blue");

    let mut map = HashMap::new();
    map.insert(field_name, field_value);
    // field_name and field_value are invalid at this point, try using them and
    // see what compiler error you get!
```

### Overwriting a value
If we insert a key and a value into a hash map and then insert that same key with a different value, the value associated with that key will be replaced.

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Blue"), 25);

    println!("{scores:?}");
```

### Adding a Key and Value Only If a Key Isn’t Present
Hash maps have a special API for this called entry that takes the key you want to check as a parameter. The return value of the entry method is an enum called Entry that represents a value that might or might not exist.

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50);

    println!("{scores:?}");
```
