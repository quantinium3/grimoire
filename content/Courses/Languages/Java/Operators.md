---
id: Operators
aliases: []
tags: []
title: Operators
---

### Categories of Java Operators
1. **Arithmetic Operators**
2. **Relational Operators**
3. **Logical Operators**
4. **Bitwise Operators**
5. **Assignment Operators**
6. **Unary Operators**
7. **Conditional (Ternary) Operator**
8. **Instanceof Operator**
9. **Other Operators (e.g., Dot, Cast)**

---

### 1. **Arithmetic Operators**
- **Purpose**: Perform basic mathematical operations.
- **Operators**:
  - `+` : Addition
  - `-` : Subtraction
  - `*` : Multiplication
  - `/` : Division
  - `%` : Modulus (remainder)
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        int a = 10, b = 3;
        System.out.println("a + b = " + (a + b)); // 13
        System.out.println("a - b = " + (a - b)); // 7
        System.out.println("a * b = " + (a * b)); // 30
        System.out.println("a / b = " + (a / b)); // 3 (integer division)
        System.out.println("a % b = " + (a % b)); // 1 (remainder)
    }
}
```
- **Note**: `+` can also concatenate strings (e.g., `"Hello " + "World"` → `"Hello World"`).

---

### 2. **Relational Operators**
- **Purpose**: Compare two operands and return a boolean (`true` or `false`).
- **Operators**:
  - `==` : Equal to
  - `!=` : Not equal to
  - `>` : Greater than
  - `<` : Less than
  - `>=` : Greater than or equal to
  - `<=` : Less than or equal to
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        int x = 5, y = 10;
        System.out.println("x == y: " + (x == y)); // false
        System.out.println("x != y: " + (x != y)); // true
        System.out.println("x > y: " + (x > y));   // false
        System.out.println("x < y: " + (x < y));   // true
        System.out.println("x >= y: " + (x >= y)); // false
        System.out.println("x <= y: " + (x <= y)); // true
    }
}
```
- **Note**: Use `equals()` for object comparison (e.g., `String`), not `==`, which checks reference equality.

---

### 3. **Logical Operators**
- **Purpose**: Combine boolean expressions.
- **Operators**:
  - `&&` : Logical AND (true if both operands are true)
  - `||` : Logical OR (true if at least one operand is true)
  - `!` : Logical NOT (inverts the boolean value)
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        boolean a = true, b = false;
        System.out.println("a && b: " + (a && b)); // false
        System.out.println("a || b: " + (a || b)); // true
        System.out.println("!a: " + (!a));         // false
    }
}
```
- **Short-Circuiting**: `&&` and `||` evaluate the second operand only if necessary (e.g., `false && expr` skips `expr`).

---

### 4. **Bitwise Operators**
- **Purpose**: Perform operations on individual bits of integer types.
- **Operators**:
  - `&` : Bitwise AND
  - `|` : Bitwise OR
  - `^` : Bitwise XOR (exclusive OR)
  - `~` : Bitwise NOT (complement)
  - `<<` : Left shift
  - `>>` : Right shift (signed)
  - `>>>` : Unsigned right shift
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        int a = 5;  // Binary: 0101
        int b = 3;  // Binary: 0011
        System.out.println("a & b: " + (a & b));  // 1 (0001)
        System.out.println("a | b: " + (a | b));  // 7 (0111)
        System.out.println("a ^ b: " + (a ^ b));  // 6 (0110)
        System.out.println("~a: " + (~a));        // -6 (inverts bits)
        System.out.println("a << 1: " + (a << 1)); // 10 (1010)
        System.out.println("a >> 1: " + (a >> 1)); // 2 (0010)
    }
}
```
- **Use Case**: Low-level programming, flags, or optimization.

---

### 5. **Assignment Operators**
- **Purpose**: Assign values to variables, often combined with other operations.
- **Operators**:
  - `=` : Simple assignment
  - `+=` : Add and assign
  - `-=` : Subtract and assign
  - `*=` : Multiply and assign
  - `/=` : Divide and assign
  - `%=` : Modulus and assign
  - `&=` : Bitwise AND and assign
  - `|=` : Bitwise OR and assign
  - `^=` : Bitwise XOR and assign
  - `<<=` : Left shift and assign
  - `>>=` : Right shift and assign
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        int x = 10;
        x += 5;  // x = x + 5
        System.out.println("x += 5: " + x); // 15
        x *= 2;  // x = x * 2
        System.out.println("x *= 2: " + x); // 30
    }
}
```

---

### 6. **Unary Operators**
- **Purpose**: Operate on a single operand.
- **Operators**:
  - `+` : Unary plus (indicates positive value, rarely used)
  - `-` : Unary minus (negates value)
  - `++` : Increment (increases by 1)
  - `--` : Decrement (decreases by 1)
  - `!` : Logical NOT (inverts boolean)
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        int a = 5;
        System.out.println("-a: " + (-a));   // -5
        a++;  // a = a + 1
        System.out.println("a++: " + a);    // 6
        a--;  // a = a - 1
        System.out.println("a--: " + a);    // 5
        boolean b = true;
        System.out.println("!b: " + (!b));  // false
    }
}
```
- **Note**: `++a` (pre-increment) vs. `a++` (post-increment) differ in when the value is updated in expressions.

---

### 7. **Conditional (Ternary) Operator**
- **Purpose**: A shorthand for `if-else` statements.
- **Syntax**: `condition ? valueIfTrue : valueIfFalse`
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        int a = 10, b = 20;
        int max = (a > b) ? a : b;
        System.out.println("Max: " + max); // 20
    }
}
```
- **Significance**: Concise way to assign values based on conditions.

---

### 8. **Instanceof Operator**
- **Purpose**: Tests whether an object is an instance of a specific class or interface.
- **Syntax**: `object instanceof ClassName`
- **Example**:
```java
public class Main {
    public static void main(String[] args) {
        String str = "Hello";
        System.out.println("str instanceof String: " + (str instanceof String)); // true
        System.out.println("str instanceof Object: " + (str instanceof Object)); // true
    }
}
```
- **Use Case**: Useful in polymorphism and type checking.

---

### 9. **Other Operators**
- **Dot Operator (`.`)**
  - **Purpose**: Accesses members (fields, methods) of an object or class.
  - **Example**: `System.out.println()` uses `.` to access `out` and `println`.
- **Cast Operator**
  - **Purpose**: Converts one data type to another.
  - **Example**: 
```java
double d = 5.7;
int i = (int) d; // Casts double to int
System.out.println(i); // 5
```

---

### Operator Precedence
Operators have a hierarchy determining the order of evaluation:
- Highest: `()`, `[]`, `.`
- Unary: `++`, `--`, `!`, `~`
- Arithmetic: `*`, `/`, `%`, then `+`, `-`
- Relational: `<`, `>`, `<=`, `>=`, then `==`, `!=`
- Logical: `&&`, then `||`
- Ternary: `?:`
- Assignment: `=`, `+=`, etc.
- **Tip**: Use parentheses `()` to override precedence.

---
