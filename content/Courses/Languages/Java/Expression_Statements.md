---
id: Expression Statements
aliases: []
tags: []
title: Expression Statements
---

### **Expressions**
An **expression** is a combination of variables, literals, operators, and method calls that evaluates to a single value. It represents a computation and always produces a result of a specific data type (e.g., `int`, `boolean`, `String`).

#### Key Characteristics:
- Must evaluate to a value.
- Can be part of a larger expression or statement.
- Can include operators (e.g., `+`, `-`, `==`) and operands (e.g., variables, constants).
- Example: `5 + 3` evaluates to `8`.

```java
public class Main {
    public static void main(String[] args) {
        int a = 10, b = 5;
        System.out.println(a + b);          // 15 (arithmetic)
        System.out.println(a > b);          // true (relational)
        System.out.println(a > 0 && b < 10); // true (logical)
        System.out.println(Math.max(a, b)); // 10 (method call)
        int c = a + b;                      // c = 15 (assignment expression)
    }
}
```
- **Note**: Parentheses `()` can be used to control the order of evaluation in complex expressions.

---

### **Statements**
A **statement** is a complete unit of execution in Java that performs an action. Unlike expressions, statements don’t necessarily produce a value—they instruct the program to *do something* (e.g., assign a value, control flow, or call a method).

#### Key Characteristics:
- Ends with a semicolon (`;`) in most cases (except block statements).
- Can contain expressions.
- Represents an actionable command.

#### Types of Statements:
1. **Expression Statements**:
   - An expression followed by a semicolon becomes a statement.
   - Example: `x = 5;` (assigns `5` to `x`).
   - Example: `System.out.println("Hello");` (calls a method).
2. **Declaration Statements**:
   - Declare variables and optionally initialize them.
   - Example: `int x;` or `int x = 10;`.
3. **Control Flow Statements**:
   - Alter the execution path of a program.
   - **Types**:
     - **Conditional**: `if`, `if-else`, `switch`.
     - **Looping**: `for`, `while`, `do-while`.
     - **Branching**: `break`, `continue`, `return`.
   - Example: `if (x > 0) System.out.println("Positive");`.
4. **Block Statements**:
   - Group multiple statements within curly braces `{}`.
   - Example:
```java
{
    int x = 5;
    System.out.println(x);
}
```
5. **Empty Statement**:
   - A standalone semicolon (`;`) that does nothing.
   - Example: `for (int i = 0; i < 5; i++);` (loop does nothing).

#### Examples:
```java
public class Main {
    public static void main(String[] args) {
        // Expression Statement
        int x = 10;                     // Assignment
        System.out.println(x);          // Method call

        // Declaration Statement
        double y = 5.5;

        // Control Flow Statement
        if (x > 0) {
            System.out.println("x is positive"); // Block statement
        }

        // Loop Statement
        for (int i = 0; i < 3; i++) {
            System.out.println(i);
        }
    }
}
```
- **Output**:
```
10
x is positive
0
1
2
```

---

### Key Differences Between Expressions and Statements
| **Aspect**           | **Expression**                     | **Statement**                     |
|----------------------|------------------------------------|-----------------------------------|
| **Purpose**          | Evaluates to a value              | Performs an action                |
| **Result**           | Always produces a value           | May or may not produce a value    |
| **Examples**         | `5 + 3`, `x > y`, `Math.sqrt(4)` | `x = 5;`, `if (x > 0) { ... }`   |
| **Semicolon**        | Not required unless part of a statement | Usually ends with `;` (except blocks) |
| **Composition**      | Can be part of a statement        | Can contain expressions           |

---
