---
id: Exceptions
aliases: []
tags: []
title: Exceptions
---

### 1. **Exception**

An **exception** in Java is an event that disrupts the normal flow of a program during execution, typically due to an error or unexpected condition (e.g., dividing by zero, accessing a null object, or reading a nonexistent file).

- **Key Points**:
  - Exceptions are objects derived from the `java.lang.Throwable` class.
  - `Throwable` has two subclasses:
    - **`Error`**: Represents serious problems that a program usually cannot recover from (e.g., `OutOfMemoryError`, `StackOverflowError`). Errors are typically not caught.
    - **`Exception`**: Represents recoverable conditions that a program can handle (e.g., `IOException`, `NullPointerException`).
  - Exceptions are thrown by the Java runtime or explicitly by code and can be caught and handled.

- **Why Handle Exceptions?**:
  - Prevents program crashes.
  - Allows graceful error recovery.
  - Provides meaningful error messages to users.
  - Ensures resources (e.g., files, database connections) are properly closed.

---

### 2. **Handling of Exception**

Exception handling in Java is the process of responding to exceptions to prevent program termination and manage errors gracefully. Java uses a structured mechanism involving `try`, `catch`, `finally`, `throw`, and `throws`.

- **Core Mechanism**:
  - **Try-catch**: Used to catch and handle exceptions.
  - **Finally**: Ensures code (e.g., resource cleanup) executes regardless of whether an exception occurs.
  - **Throw**: Explicitly throws an exception.
  - **Throws**: Declares that a method may throw exceptions.

- **Benefits**:
  - Separates error-handling code from normal code.
  - Improves code robustness and maintainability.
  - Supports debugging with stack traces.

---

### 3. **Using try-catch**

The `try-catch` block is used to enclose code that might throw an exception and handle it if it occurs.

- **Syntax**:
  ```java
  try {
      // Code that might throw an exception
  } catch (ExceptionType variable) {
      // Handle the exception
  }
  ```

- **How It Works**:
  - Code in the `try` block is executed.
  - If an exception is thrown, the JVM looks for a matching `catch` block.
  - If caught, the `catch` block executes, and the program continues.
  - If not caught, the exception propagates up the call stack, potentially terminating the program.

- **Example**:
  ```java
  package com.example.myapp;
  public class Test {
      public static void main(String[] args) {
          try {
              int result = 10 / 0; // Throws ArithmeticException
          } catch (ArithmeticException e) {
              System.out.println("Error: Division by zero");
              System.out.println("Message: " + e.getMessage());
          }
          System.out.println("Program continues");
      }
  }
  ```
  **Output**:
  ```
  Error: Division by zero
  Message: / by zero
  Program continues
  ```

- **Key Points**:
  - The `catch` block must specify the exact exception type or a superclass (e.g., `Exception` catches all exceptions).
  - Use `e.getMessage()` or `e.printStackTrace()` to get details about the exception.
  - Multiple `catch` blocks can be used for different exception types (see below).

---

### 4. **Catching Multiple Exceptions**

A single `try` block can have multiple `catch` blocks to handle different types of exceptions, or you can use a multi-catch block (Java 7+) to catch multiple exceptions in one `catch`.

- **Multiple Catch Blocks**:
  ```java
  try {
      // Code that might throw exceptions
      int[] arr = new int[5];
      arr[10] = 100; // Throws ArrayIndexOutOfBoundsException
      int result = 10 / 0; // Throws ArithmeticException
  } catch (ArithmeticException e) {
      System.out.println("Arithmetic error: " + e.getMessage());
  } catch (ArrayIndexOutOfBoundsException e) {
      System.out.println("Array error: " + e.getMessage());
  } catch (Exception e) {
      System.out.println("General error: " + e.getMessage());
  }
  ```

- **Rules**:
  - Order matters: Catch more specific exceptions before general ones (e.g., `ArithmeticException` before `Exception`).
  - If a `catch` block for a superclass (e.g., `Exception`) is placed first, it will catch all exceptions, making subsequent `catch` blocks unreachable (compiler error).

- **Multi-Catch Block (Java 7+)**:
  - Use a single `catch` block to handle multiple exception types.
  - Syntax: `catch (ExceptionType1 | ExceptionType2 variable)`.
  - Example:
    ```java
    try {
        String str = null;
        System.out.println(str.length()); // Throws NullPointerException
        int result = 10 / 0; // Throws ArithmeticException
    } catch (NullPointerException | ArithmeticException e) {
        System.out.println("Error: " + e.getMessage());
    }
    ```

- **Key Points**:
  - Multi-catch is concise but requires exceptions to be unrelated (not in the same inheritance hierarchy).
  - The variable in a multi-catch block is implicitly `final` and cannot be reassigned.

---

### 5. **Using finally Clause**

The `finally` block contains code that executes **always**, whether an exception is thrown or not, typically used for resource cleanup (e.g., closing files or database connections).

- **Syntax**:
  ```java
  try {
      // Code that might throw an exception
  } catch (ExceptionType e) {
      // Handle the exception
  } finally {
      // Code that always executes
  }
  ```

- **Example**:
  ```java
  package com.example.myapp;
  import java.io.*;
  public class Test {
      public static void main(String[] args) {
          FileReader file = null;
          try {
              file = new FileReader("file.txt");
              // Read file
          } catch (FileNotFoundException e) {
              System.out.println("File not found: " + e.getMessage());
          } finally {
              if (file != null) {
                  try {
                      file.close();
                  } catch (IOException e) {
                      System.out.println("Error closing file");
                  }
              }
              System.out.println("Finally block executed");
          }
      }
  }
  ```

- **Key Points**:
  - The `finally` block executes even if:
    - No exception is thrown.
    - An exception is thrown and caught.
    - An exception is thrown and not caught (before the program terminates).
    - A `return`, `break`, or `continue` statement is executed in `try` or `catch`.
  - **Exception**: `finally` does not execute if the JVM exits (e.g., `System.exit(0)`).
  - `finally` is optional; a `try` block can have `catch` or `finally`, or both.
  - Use for cleanup to avoid resource leaks.

- **Try-with-Resources (Java 7+)**:
  - Simplifies resource management by automatically closing resources that implement `AutoCloseable`.
  - Example:
    ```java
    try (FileReader file = new FileReader("file.txt")) {
        // Use file
    } catch (FileNotFoundException e) {
        System.out.println("File not found");
    }
    // No need for finally; file is closed automatically
    ```

---

### 6. **Types of Exceptions**

Java exceptions are classified into two main categories: **Checked Exceptions** and **Unchecked Exceptions**.

- **Checked Exceptions**:
  - Checked at **compile-time**.
  - Must be declared in a method’s `throws` clause or handled in a `try-catch` block.
  - Derived from `Exception` but not `RuntimeException`.
  - Examples:
    - `IOException` (file operations).
    - `SQLException` (database operations).
    - `ClassNotFoundException`.
  - Example:
    ```java
    import java.io.*;
    public class Test {
        public static void readFile() throws IOException {
            FileReader file = new FileReader("file.txt");
        }
    }
    ```

- **Unchecked Exceptions**:
  - Checked at **runtime**.
  - Do not need to be declared or caught (though they can be).
  - Derived from `RuntimeException` (a subclass of `Exception`).
  - Examples:
    - `NullPointerException` (accessing null object).
    - `ArithmeticException` (division by zero).
    - `ArrayIndexOutOfBoundsException`.
    - `IllegalArgumentException`.
  - Example:
    ```java
    public class Test {
        public static void main(String[] args) {
            String str = null;
            System.out.println(str.length()); // Throws NullPointerException
        }
    }
    ```

- **Errors** (Not Exceptions):
  - Represent serious, unrecoverable problems (e.g., `OutOfMemoryError`, `VirtualMachineError`).
  - Derived from `Error`, not `Exception`.
  - Not typically caught or handled.

- **Hierarchy**:
  ```
  Throwable
  ├── Error (e.g., OutOfMemoryError, StackOverflowError)
  └── Exception
      ├── RuntimeException (Unchecked, e.g., NullPointerException, ArithmeticException)
      └── Other Exceptions (Checked, e.g., IOException, SQLException)
  ```

- **Key Points**:
  - Checked exceptions enforce error handling at compile-time.
  - Unchecked exceptions are programmer errors and can be avoided with proper coding.
  - Use checked exceptions for recoverable conditions, unchecked for programming errors.

---

### 7. **Throwing Exceptions**

You can explicitly **throw** an exception using the `throw` keyword to signal an error condition. A method can declare that it throws exceptions using the `throws` keyword.

- **Throw Keyword**:
  - Syntax: `throw new ExceptionType("message");`
  - Example:
    ```java
    public class Test {
        public static void checkAge(int age) {
            if (age < 18) {
                throw new IllegalArgumentException("Age must be 18 or older");
            }
            System.out.println("Age is valid");
        }
        public static void main(String[] args) {
            try {
                checkAge(16);
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
    ```
    **Output**:
    ```
    Error: Age must be 18 or older
    ```

- **Throws Keyword**:
  - Used in a method signature to declare that it may throw one or more checked exceptions.
  - Syntax: `returnType methodName() throws ExceptionType1, ExceptionType2`
  - Example:
    ```java
    import java.io.*;
    public class Test {
        public static void readFile() throws IOException {
            FileReader file = new FileReader("file.txt");
        }
        public static void main(String[] args) {
            try {
                readFile();
            } catch (IOException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
    ```

- **Key Points**:
  - Only `Throwable` objects (`Error` or `Exception`) can be thrown.
  - `throws` is required for checked exceptions but optional for unchecked exceptions.
  - Use meaningful exception messages to aid debugging.

---

### 8. **Writing Exception Subclasses**

You can create **custom exceptions** by extending `Exception` (for checked exceptions) or `RuntimeException` (for unchecked exceptions). Custom exceptions allow you to define application-specific error conditions.

- **Syntax**:
  ```java
  class CustomException extends Exception {
      public CustomException() {
          super();
      }
      public CustomException(String message) {
          super(message);
      }
      public CustomException(String message, Throwable cause) {
          super(message, cause);
      }
  }
  ```

- **Example**:
  ```java
  package com.example.myapp;
  // Custom checked exception
  class InvalidBalanceException extends Exception {
      public InvalidBalanceException(String message) {
          super(message);
      }
  }
  // Class using the custom exception
  class BankAccount {
      private double balance;
      public void withdraw(double amount) throws InvalidBalanceException {
          if (amount > balance) {
              throw new InvalidBalanceException("Insufficient balance: " + balance);
          }
          balance -= amount;
          System.out.println("Withdrawal successful. New balance: " + balance);
      }
      public void deposit(double amount) {
          balance += amount;
      }
  }
  // Test class
  public class Test {
      public static void main(String[] args) {
          BankAccount account = new BankAccount();
          account.deposit(100.0);
          try {
              account.withdraw(150.0);
          } catch (InvalidBalanceException e) {
              System.out.println("Error: " + e.getMessage());
          }
      }
  }
  ```
  **Output**:
  ```
  Error: Insufficient balance: 100.0
  ```

- **Key Points**:
  - Extend `Exception` for checked exceptions, `RuntimeException` for unchecked.
  - Provide constructors to pass error messages or causes.
  - Use custom exceptions to make error handling specific to your application.
  - Store custom exceptions in appropriate packages (e.g., `com.example.myapp.exceptions`).

- **Best Practices**:
  - Use meaningful names (e.g., `InvalidBalanceException` instead of `MyException`).
  - Include detailed messages for debugging.
  - Consider adding fields or methods to the custom exception for additional context (e.g., error codes).

---

###  **Practice Program**:
   ```java
   package com.example.myapp;
   import java.io.*;
   class InsufficientFundsException extends Exception {
       public InsufficientFundsException(String message) {
           super(message);
       }
   }
   class Account {
       private double balance;
       public Account(double balance) {
           this.balance = balance;
       }
       public void withdraw(double amount) throws InsufficientFundsException {
           if (amount > balance) {
               throw new InsufficientFundsException("Balance too low: " + balance);
           }
           balance -= amount;
       }
   }
   public class Test {
       public static void main(String[] args) {
           Account account = new Account(50.0);
           try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
               account.withdraw(100.0);
           } catch (InsufficientFundsException | FileNotFoundException e) {
               System.out.println("Error: " + e.getMessage());
           } catch (IOException e) {
               System.out.println("IO Error: " + e.getMessage());
           } finally {
               System.out.println("Cleanup complete");
           }
       }
   }
   ```

   **Compile and Run**:
   ```bash
   javac com/example/myapp/*.java
   java -cp . com.example.myapp.Test
   ```
