---
id: Packages
aliases: []
tags: []
title: Packages
---

### 1. **Defining a Package**

A **package** in Java is a mechanism to organize related classes, interfaces, and other types into a single namespace. It helps avoid naming conflicts, provides modularity, and improves code maintainability.

- **Purpose**:
  - Group related classes and interfaces.
  - Prevent naming collisions (e.g., two classes with the same name in different packages).
  - Provide access control (e.g., restricting access to package members).
  - Facilitate code reuse and organization.

- **How to Define a Package**:
  - Use the `package` keyword at the top of a Java source file.
  - Syntax: `package packageName;`
  - Example:
    ```java
    package com.example.myapp;
    public class MyClass {
        public void display() {
            System.out.println("Hello from MyClass!");
        }
    }
    ```
  - The above code declares that `MyClass` belongs to the `com.example.myapp` package.

- **Directory Structure**:
  - The package name must correspond to the directory structure where the source file is stored.
  - For example, `com.example.myapp.MyClass` should be in the directory `com/example/myapp/`.
  - Compiled `.class` files must also follow this structure.

- **Default Package**:
  - If no `package` statement is specified, the class belongs to the **default package** (no namespace).
  - Example:
    ```java
    // No package statement
    public class Test {
        // Class in default package
    }
    ```
  - Using the default package is discouraged for large projects due to lack of organization.

- **Rules**:
  - The `package` statement must be the first non-comment line in the source file.
  - Only one `package` statement is allowed per file.
  - All classes in the same source file belong to the declared package.

---

### 2. **CLASSPATH**

The **CLASSPATH** is an environment variable or a parameter that tells the Java Virtual Machine (JVM) and Java compiler where to look for user-defined classes and packages.

- **Purpose**:
  - Specifies the location of `.class` files and other resources (e.g., JAR files).
  - Helps the JVM locate classes during compilation and runtime.

- **How CLASSPATH Works**:
  - The JVM searches for classes in the directories or JAR files listed in the CLASSPATH.
  - The search includes:
    - The standard Java library (automatically included).
    - Directories or JAR files specified in the CLASSPATH.
    - The current directory (if included, often denoted by a dot `.`).

- **Setting CLASSPATH**:
  - **Environment Variable**:
    - Set the CLASSPATH variable on your system.
    - Example (Unix/Linux):
      ```bash
      export CLASSPATH=/path/to/classes:/path/to/lib.jar
      ```
    - Example (Windows):
      ```cmd
      set CLASSPATH=C:\path\to\classes;C:\path\to\lib.jar
      ```
  - **Command-Line Option**:
    - Use the `-cp` or `-classpath` option when running `javac` or `java`.
    - Example:
      ```bash
      javac -cp /path/to/classes MyClass.java
      java -cp /path/to/classes com.example.myapp.MyClass
      ```

- **Default CLASSPATH**:
  - If not set, the default CLASSPATH is the current directory (`.`).
  - Example: If you run `java MyClass`, the JVM looks for `MyClass.class` in the current directory.

- **Common Issues**:
  - **ClassNotFoundException**: Occurs if the JVM cannot find the class in the CLASSPATH.
  - **NoClassDefFoundError**: Occurs if a class was available during compilation but not at runtime.
  - Solution: Ensure the correct path to the `.class` file or JAR is included in the CLASSPATH.

- **Example**:
  - Directory structure:
    ```
    /home/user/myapp/com/example/myapp/MyClass.class
    ```
  - Set CLASSPATH:
    ```bash
    export CLASSPATH=/home/user/myapp
    ```
  - Run:
    ```bash
    java com.example.myapp.MyClass
    ```

---

### 3. **Package Naming**

Package naming follows a **convention** to ensure uniqueness and clarity. It helps avoid naming conflicts and makes code easier to understand.

- **Naming Convention**:
  - Use a **reverse domain name** to ensure uniqueness, as domain names are globally unique.
  - Example: If your organization’s domain is `example.com`, the package name might be `com.example`.
  - Structure: `topLevelDomain.organizationName.projectName.subModule`.
  - Examples:
    - `com.google.utils`
    - `org.apache.commons`
    - `com.example.myapp.model`

- **Rules**:
  - Use lowercase letters for package names (convention, not enforced).
  - Avoid using reserved keywords (e.g., `class`, `public`).
  - Separate levels with dots (`.`), e.g., `com.example.myapp`.
  - Each level corresponds to a directory in the file system.

- **Examples**:
  - Valid: `com.example.myapp`, `edu.university.cs101`
  - Invalid: `com.example.my-app` (hyphens not allowed), `Com.Example` (uppercase discouraged).

- **Why Follow Conventions?**:
  - Prevents naming conflicts with other developers’ packages.
  - Makes it easier to locate and understand the purpose of a package.
  - Aligns with industry standards, improving code readability.

- **Standard Packages**:
  - Java provides built-in packages, e.g.:
    - `java.lang` (automatically imported, contains `String`, `System`, etc.).
    - `java.util` (contains `ArrayList`, `HashMap`, etc.).
    - `java.io` (for input/output operations).

---

### 4. **Accessibility of Packages**

Accessibility in packages refers to how classes, methods, and fields within a package can be accessed by other classes, either within the same package or from outside it. Java uses **access modifiers** to control accessibility.

- **Access Modifiers**:
  - **`public`**: The member (class, method, field) is accessible from everywhere.
  - **`protected`**: The member is accessible within the same package and also in subclasses (even in different packages).
  - **`default`** (also called package-private): If no modifier is specified, the member is accessible only within the same package.
  - **`private`**: The member is accessible only within the same class.

- **Package Accessibility Rules**:
  - **Classes**:
    - A `public` class is accessible from any package.
    - A `default` (no modifier) class is accessible only within the same package.
    - Example:
      ```java
      package com.example.myapp;
      public class PublicClass {
          // Accessible everywhere
      }
      class DefaultClass {
          // Accessible only in com.example.myapp
      }
      ```
  - **Members (Fields, Methods, Constructors)**:
    - `public`: Accessible from any class.
    - `protected`: Accessible within the same package and in subclasses.
    - `default`: Accessible only within the same package.
    - `private`: Accessible only within the same class.
    - Example:
      ```java
      package com.example.myapp;
      public class MyClass {
          public int publicField = 1;
          protected int protectedField = 2;
          int defaultField = 3; // package-private
          private int privateField = 4;
      }
      ```

- **Accessing Across Packages**:
  - To access a class or member in another package, you must:
    1. Import the package/class (see **Using Package Members** below).
    2. Ensure the class/member is `public` or `protected` (if accessed via inheritance).
  - Example:
    ```java
    package com.example.other;
    import com.example.myapp.MyClass;
    public class Test {
        public void testAccess() {
            MyClass obj = new MyClass();
            System.out.println(obj.publicField); // OK
            // System.out.println(obj.defaultField); // Error: not visible
        }
    }
    ```

- **Package-Private Advantage**:
  - Using `default` access restricts visibility to the package, which is useful for internal implementation details.
  - Example: Utility classes or helper classes used only within a package.

---

### 5. **Using Package Members**

To use classes, interfaces, or other members from a package, you need to **import** them or refer to them using their **fully qualified name**. Here’s how it works:

- **Fully Qualified Name**:
  - Refers to the complete package path plus the class name.
  - Example: `com.example.myapp.MyClass`.
  - Usage:
    ```java
    public class Test {
        public static void main(String[] args) {
            com.example.myapp.MyClass obj = new com.example.myapp.MyClass();
            obj.display();
        }
    }
    ```
  - Drawback: Fully qualified names are verbose and make code harder to read.

- **Importing Packages/Classes**:
  - Use the `import` keyword to avoid writing fully qualified names.
  - Syntax:
    ```java
    import packageName.subPackage.ClassName; // Import specific class
    import packageName.subPackage.*; // Import all classes in package
    ```
  - Example:
    ```java
    import com.example.myapp.MyClass;
    public class Test {
        public static void main(String[] args) {
            MyClass obj = new MyClass();
            obj.display();
        }
    }
    ```

- **Types of Imports**:
  - **Single-Type Import**:
    - Imports a specific class or interface.
    - Example: `import java.util.ArrayList;`
  - **On-Demand Import** (Importing Entire Package):
    - Imports all classes in a package (but not subpackages).
    - Example: `import java.util.*;`
    - Note: This does not import subpackages like `java.util.concurrent`.
  - **Static Import**:
    - Imports static members (fields, methods) of a class.
    - Example:
      ```java
      import static java.lang.Math.PI;
      import static java.lang.Math.sqrt;
      public class Test {
          public static void main(String[] args) {
              System.out.println(PI); // No need for Math.PI
              System.out.println(sqrt(16)); // No need for Math.sqrt
          }
      }
      ```

- **Automatic Imports**:
  - The `java.lang` package is automatically imported in every Java program.
  - Example: You can use `String`, `System`, or `Math` without importing.

- **Resolving Naming Conflicts**:
  - If two imported packages contain classes with the same name, use the fully qualified name or import only one class.
  - Example:
    ```java
    import java.util.Date;
    import java.sql.Date; // Conflict: two Date classes
    ```
    Solution:
    ```java
    java.util.Date utilDate = new java.util.Date();
    java.sql.Date sqlDate = new java.sql.Date();
    ```

- **Rules for Imports**:
  - Imports must appear after the `package` statement and before class declarations.
  - Importing a package does not import its subpackages.
  - Unused imports do not affect performance but should be removed for clarity (modern IDEs do this automatically).

- **Accessing Package Members**:
  - Ensure the member is accessible based on its access modifier (`public`, `protected`, `default`, `private`).
  - Example:
    ```java
    package com.example.other;
    import com.example.myapp.MyClass;
    public class Test {
        public static void main(String[] args) {
            MyClass obj = new MyClass();
            System.out.println(obj.publicField); // OK
            // System.out.println(obj.privateField); // Error: not accessible
        }
    }
    ```

---

### Summary for Exam Preparation

- **Defining Package**:
  - Use `package` keyword to group classes.
  - Matches directory structure.
  - Default package if no `package` statement.

- **CLASSPATH**:
  - Tells JVM where to find `.class` files.
  - Set via environment variable or `-cp` option.
  - Default is current directory (`.`).

- **Package Naming**:
  - Use reverse domain name (e.g., `com.example.myapp`).
  - Lowercase, no hyphens, follow conventions.

- **Accessibility of Packages**:
  - Controlled by `public`, `protected`, `default`, `private`.
  - `default` restricts to same package.
  - `public` allows access from any package.

- **Using Package Members**:
  - Import with `import` or use fully qualified names.
  - Single-type, on-demand, and static imports.
  - Resolve conflicts with fully qualified names.

---

### Example Program for Practice

**File 1: `com/example/myapp/MyClass.java`**
```java
package com.example.myapp;
public class MyClass {
    public int publicField = 1;
    protected int protectedField = 2;
    int defaultField = 3;
    private int privateField = 4;
    public void display() {
        System.out.println("Public: " + publicField);
        System.out.println("Protected: " + protectedField);
        System.out.println("Default: " + defaultField);
        System.out.println("Private: " + privateField);
    }
}
```

**File 2: `com/example/other/Test.java`**
```java
package com.example.other;
import com.example.myapp.MyClass;
public class Test {
    public static void main(String[] args) {
        MyClass obj = new MyClass();
        obj.display();
        System.out.println("Accessing public field: " + obj.publicField);
        // System.out.println(obj.defaultField); // Error: not visible
    }
}
```

**Compile and Run**:
```bash
# Compile
javac com/example/myapp/MyClass.java
javac com/example/other/Test.java
# Run
java -cp . com.example.other.Test
```
