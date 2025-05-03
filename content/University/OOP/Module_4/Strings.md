---
id: Strings
aliases: []
tags: []
title: Strings
---

### 1. **Fundamentals of Characters and Strings**

Characters and strings are essential for text processing in Java. They represent textual data and are widely used in I/O, user interfaces, and data manipulation.

- **Characters**:
  - Represented by the `char` primitive type or the `Character` wrapper class.
  - Java uses **Unicode** (16-bit, UTF-16) to support international characters.
  - Example: `'A'`, `'\u0041'` (Unicode for 'A'), `'\n'` (newline).
  - `Character` class provides utility methods (e.g., `isDigit()`, `toUpperCase()`).
  - Example:
    ```java
    char ch = 'A';
    System.out.println(Character.isLetter(ch)); // true
    System.out.println(Character.toLowerCase(ch)); // a
    ```

- **Strings**:
  - Represented by the `String` class (immutable) or mutable classes like `StringBuffer` and `StringBuilder`.
  - A `String` is a sequence of characters (e.g., `"Hello"`).
  - Stored in the **String pool** (a special area in heap memory) for memory efficiency.
  - Example:
    ```java
    String str = "Hello";
    System.out.println(str.length()); // 5
    ```

- **Key Points**:
  - `char` is a 16-bit Unicode character; `String` is a sequence of `char` values.
  - Strings are **immutable** (cannot be modified after creation), ensuring thread-safety and memory efficiency.
  - Use `Character` for character-specific operations, `String` for text manipulation.

---

### 2. **The String Class**

The `String` class, in the `java.lang` package, is used to create and manipulate immutable strings. It is one of the most commonly used classes in Java.

- **Key Characteristics**:
  - **Immutable**: Once created, a `String` object’s content cannot change (modifications create new `String` objects).
  - Stored in the **String pool** for reuse (e.g., `"Hello"` is shared across variables).
  - Automatically imported (no need for `import java.lang.String`).
  - Supports various methods for manipulation, searching, and comparison.

- **Creating Strings**:
  - **Literal**: `String str = "Hello";` (uses String pool).
  - **Constructor**: `String str = new String("Hello");` (creates a new object in heap, not recommended).
  - Example:
    ```java
    String s1 = "Hello"; // String pool
    String s2 = "Hello"; // Reuses same object
    String s3 = new String("Hello"); // New object in heap
    System.out.println(s1 == s2); // true (same pool reference)
    System.out.println(s1 == s3); // false (different objects)
    System.out.println(s1.equals(s3)); // true (same content)
    ```

- **Common Methods** (See **String Operations** for detailed usage):
  - `length()`: Returns the number of characters.
  - `charAt(int index)`: Returns the character at the specified index.
  - `substring(int begin, int end)`: Extracts a portion of the string.
  - `equals(Object obj)`: Compares content for equality.
  - `compareTo(String other)`: Compares lexicographically.
  - `toUpperCase()`, `toLowerCase()`: Converts case.
  - `trim()`: Removes leading/trailing whitespace.
  - `indexOf(String str)`: Finds the index of a substring.
  - `replace(char old, char new)`: Replaces characters.

- **Key Points**:
  - Use `equals()` for content comparison, not `==` (which compares references).
  - String literals are interned (stored in the String pool) for efficiency.
  - Avoid excessive `String` concatenation in loops (use `StringBuilder` instead).

---

### 3. **String Operations**

The `String` class provides a rich set of methods for manipulating and processing strings. These operations are critical for text processing tasks.

- **Common String Operations**:
  ```java
  package com.example.myapp;
  public class StringOperationsDemo {
      public static void main(String[] args) {
          String str = "  Hello, Java!  ";
          // Length
          System.out.println("Length: " + str.length()); // 15
          // Character access
          System.out.println("Char at 2: " + str.charAt(2)); // H
          // Substring
          System.out.println("Substring: " + str.substring(2, 7)); // Hello
          // Case conversion
          System.out.println("Upper: " + str.toUpperCase()); //   HELLO, JAVA!  
          System.out.println("Lower: " + str.toLowerCase()); //   hello, java!  
          // Trim
          System.out.println("Trim: " + str.trim()); // Hello, Java!
          // Replace
          System.out.println("Replace: " + str.replace("Java", "World")); //   Hello, World!  
          // Index of
          System.out.println("Index of 'Java': " + str.indexOf("Java")); // 9
          // Contains
          System.out.println("Contains 'Hello': " + str.contains("Hello")); // true
          // Comparison
          String s1 = "apple";
          String s2 = "banana";
          System.out.println("Compare: " + s1.compareTo(s2)); // Negative (apple < banana)
          // Equality
          System.out.println("Equals: " + s1.equals("apple")); // true
          // Split
          String csv = "a,b,c";
          String[] parts = csv.split(",");
          System.out.println("Split: " + java.util.Arrays.toString(parts)); // [a, b, c]
          // Concat
          System.out.println("Concat: " + s1.concat(" pie")); // apple pie
      }
  }
  ```

- **Key Operations**:
  - **Accessing Characters**: `charAt()`, `toCharArray()` (converts to `char[]`).
  - **Substrings**: `substring()` extracts portions (0-based indexing).
  - **Searching**: `indexOf()`, `lastIndexOf()`, `contains()`.
  - **Modification**: `replace()`, `replaceAll()` (regex), `trim()`.
  - **Case Conversion**: `toUpperCase()`, `toLowerCase()`.
  - **Comparison**: `equals()`, `equalsIgnoreCase()`, `compareTo()`, `compareToIgnoreCase()`.
  - **Splitting/Joining**: `split()` (splits into array), `String.join()` (Java 8+).
  - **Concatenation**: `concat()` or `+` operator (creates new `String`).

- **Key Points**:
  - Most operations return a **new** `String` due to immutability.
  - Methods like `indexOf()` return `-1` if the substring is not found.
  - Handle `StringIndexOutOfBoundsException` for invalid indices (e.g., `charAt(-1)`).
  - Use `String.format()` or `printf()` for formatted strings.

---

### 4. **Data Conversion using valueOf() Methods**

The `String` class provides `valueOf()` methods to convert various data types (primitives, objects) into `String` representations. These are static methods used for data conversion.

- **Syntax**:
  ```java
  String.valueOf(dataType value)
  ```

- **Supported Types**:
  - Primitives: `int`, `long`, `float`, `double`, `boolean`, `char`.
  - Objects: Any object (calls `toString()`).
  - Arrays: `char[]`.

- **Examples**:
  ```java
  package com.example.myapp;
  public class ValueOfDemo {
      public static void main(String[] args) {
          // Primitives
          int num = 42;
          String str1 = String.valueOf(num); // "42"
          double d = 3.14;
          String str2 = String.valueOf(d); // "3.14"
          boolean b = true;
          String str3 = String.valueOf(b); // "true"
          char ch = 'A';
          String str4 = String.valueOf(ch); // "A"
          // Array
          char[] arr = {'H', 'i'};
          String str5 = String.valueOf(arr); // "Hi"
          // Object
          Object obj = new Integer(100);
          String str6 = String.valueOf(obj); // "100"
          // Output
          System.out.println(str1 + ", " + str2 + ", " + str3 + ", " + str4 + ", " + str5 + ", " + str6);
      }
  }
  ```
  **Output**:
  ```
  42, 3.14, true, A, Hi, 100
  ```

- **Key Points**:
  - `valueOf()` is overloaded for different types.
  - For objects, `valueOf()` calls `toString()`; override `toString()` in custom classes for meaningful output.
  - Alternative: Use `String.valueOf()` instead of concatenation with `"" + value` for clarity.
  - `null` input returns the string `"null"`.

- **Parsing Strings to Primitives** (Reverse Conversion):
  - Use wrapper class methods: `Integer.parseInt()`, `Double.parseDouble()`, etc.
  - Example:
    ```java
    String str = "123";
    int num = Integer.parseInt(str); // 123
    double d = Double.parseDouble("3.14"); // 3.14
    ```
  - Handle `NumberFormatException` for invalid inputs.

---

### 5. **StringBuffer Class and Methods**

The `StringBuffer` class, in the `java.lang` package, provides a **mutable** alternative to `String` for efficient string manipulation, especially in scenarios involving frequent modifications (e.g., loops). It is **thread-safe** (synchronized), unlike `StringBuilder` (non-thread-safe, faster).

- **Key Characteristics**:
  - **Mutable**: Can modify contents without creating new objects.
  - **Thread-safe**: Synchronized methods ensure safe use in multithreaded environments.
  - Default capacity: 16 characters (expands automatically).

- **Creating StringBuffer**:
  ```java
  StringBuffer sb1 = new StringBuffer(); // Empty, capacity 16
  StringBuffer sb2 = new StringBuffer("Hello"); // Initialized with "Hello"
  StringBuffer sb3 = new StringBuffer(50); // Capacity 50
  ```

- **Common Methods**:
  - **append(type value)**: Adds data (primitives, strings, objects) to the end.
  - **insert(int offset, type value)**: Inserts data at the specified index.
  - **delete(int start, int end)**: Removes characters from `start` to `end-1`.
  - **replace(int start, int end, String str)**: Replaces characters with `str`.
  - **reverse()**: Reverses the characters.
  - **setCharAt(int index, char ch)**: Sets the character at `index`.
  - **length()**: Returns the number of characters.
  - **capacity()**: Returns the current capacity.
  - **ensureCapacity(int minCapacity)**: Ensures at least the specified capacity.
  - **toString()**: Converts to `String`.

- **Example**:
  ```java
  package com.example.myapp;
  public class StringBufferDemo {
      public static void main(String[] args) {
          StringBuffer sb = new StringBuffer("Hello");
          // Append
          sb.append(" Java"); // Hello Java
          System.out.println("Append: " + sb);
          // Insert
          sb.insert(5, ","); // Hello, Java
          System.out.println("Insert: " + sb);
          // Delete
          sb.delete(0, 6); // Java
          System.out.println("Delete: " + sb);
          // Replace
          sb.replace(0, 4, "World"); // World
          System.out.println("Replace: " + sb);
          // Reverse
          sb.reverse(); // dlroW
          System.out.println("Reverse: " + sb);
          // Capacity and length
          System.out.println("Length: " + sb.length()); // 5
          System.out.println("Capacity: " + sb.capacity()); // 21 (16 + "Hello".length())
          // Convert to String
          String result = sb.toString();
          System.out.println("To String: " + result);
      }
  }
  ```
  **Output**:
  ```
  Append: Hello Java
  Insert: Hello, Java
  Delete: Java
  Replace: World
  Reverse: dlroW
  Length: 5
  Capacity: 21
  To String: dlroW
  ```

- **StringBuffer vs. StringBuilder**:
  - `StringBuffer`: Thread-safe (synchronized), slower, used in multithreaded environments.
  - `StringBuilder`: Not thread-safe, faster, used in single-threaded environments.
  - Example (Use `StringBuilder` for better performance):
    ```java
    StringBuilder sb = new StringBuilder("Hello");
    sb.append(" World"); // Hello World
    ```

- **Key Points**:
  - Use `StringBuffer` for thread-safe string manipulation.
  - Use `StringBuilder` for single-threaded performance.
  - Methods return the `StringBuffer` object (chaining possible, e.g., `sb.append("x").append("y")`).
  - Handle `StringIndexOutOfBoundsException` for invalid indices.

---

### Connecting to Previous Topics

- **Packages**:
  - `String`, `StringBuffer`, and `Character` are in `java.lang` (automatically imported).
  - Custom string utilities can be organized in packages (e.g., `com.example.myapp.utils`).
  - Ensure classes using I/O or threading with strings are in the `CLASSPATH`.

- **Interfaces**:
  - `String` implements `CharSequence` (also implemented by `StringBuffer`, `StringBuilder`).
  - Example: `CharSequence cs = "Hello";` or `CharSequence cs = new StringBuffer("Hello");`.
  - `Serializable` and `Comparable` are implemented by `String` and `StringBuffer`.

- **Exception Handling**:
  - String operations like `charAt()` or `substring()` throw `StringIndexOutOfBoundsException` (unchecked).
  - Parsing with `Integer.parseInt()` throws `NumberFormatException`.
  - Example:
    ```java
    try {
        String str = "abc";
        System.out.println(str.charAt(5)); // Throws StringIndexOutOfBoundsException
    } catch (StringIndexOutOfBoundsException e) {
        System.err.println("Invalid index: " + e.getMessage());
    }
    ```

- **Multithreading**:
  - `String` is immutable and thread-safe by design.
  - `StringBuffer` is synchronized, suitable for multithreaded environments.
  - Example:
    ```java
    StringBuffer sb = new StringBuffer();
    Runnable task = () -> sb.append(Thread.currentThread().getName() + " ");
    Thread t1 = new Thread(task);
    Thread t2 = new Thread(task);
    t1.start();
    t2.start();
    ```

- **I/O**:
  - Strings are used extensively in I/O (e.g., reading/writing files, console I/O).
  - Example (Reading file into `String`):
    ```java
    try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"))) {
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        String content = sb.toString();
    } catch (IOException e) {
        System.err.println("Error: " + e.getMessage());
    }
    ```
  - `transient` fields in serialized objects may include `String` or `StringBuffer`.

---

### **Practice Program**:
   ```java
   package com.example.myapp;
   import java.io.*;
   public class StringDemo {
       public static void main(String[] args) {
           // String operations
           String str = "  Hello, Java!  ";
           System.out.println("Trim: " + str.trim());
           System.out.println("Substring: " + str.substring(2, 7));
           System.out.println("Replace: " + str.replace("Java", "World"));
           // valueOf
           int num = 42;
           String strNum = String.valueOf(num);
           System.out.println("valueOf: " + strNum);
           try {
               int parsed = Integer.parseInt(strNum);
               System.out.println("Parsed: " + parsed);
           } catch (NumberFormatException e) {
               System.err.println("Invalid number: " + e.getMessage());
           }
           // StringBuffer
           StringBuffer sb = new StringBuffer("Java");
           sb.append(" is fun!");
           sb.reverse();
           System.out.println("StringBuffer: " + sb);
           // File I/O with String
           try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
               writer.write(str);
           } catch (IOException e) {
               System.err.println("Error: " + e.getMessage());
           }
       }
   }
   ```

   **Compile and Run**:
   ```bash
   javac com/example/myapp/StringDemo.java
   java -cp . com.example.myapp.StringDemo
   ```
