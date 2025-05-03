---
id: Interfaces
aliases: []
tags: []
title: Interfaces
---

### 1. **Interfaces in Java**

An **interface** in Java is a blueprint for a class that defines a set of abstract methods (and optionally constants or default methods) that a class must implement. Interfaces are used to achieve **abstraction**, **multiple inheritance**, and **loose coupling** in Java programs.

- **Key Characteristics**:
  - An interface is implicitly **abstract**; you don’t need to use the `abstract` keyword.
  - All methods in an interface are implicitly **public** and **abstract** (unless they are `default` or `static` methods, introduced in Java 8).
  - All fields in an interface are implicitly **public**, **static**, and **final** (i.e., constants).
  - Interfaces cannot be instantiated directly.
  - A class can implement multiple interfaces, unlike extending multiple classes.

- **Syntax**:
  ```java
  interface InterfaceName {
      // Constant (public static final)
      int CONSTANT = 10;
      // Abstract method (public abstract)
      void methodName();
      // Default method (Java 8+)
      default void defaultMethod() {
          System.out.println("Default implementation");
      }
      // Static method (Java 8+)
      static void staticMethod() {
          System.out.println("Static method in interface");
      }
  }
  ```

- **Purpose**:
  - Define a contract that implementing classes must follow.
  - Enable polymorphism (e.g., treating different classes uniformly via an interface type).
  - Support multiple inheritance (a class can implement multiple interfaces).

---

### 2. **Implementing Interfaces**

A class **implements** an interface using the `implements` keyword. By doing so, it agrees to provide concrete implementations for all abstract methods declared in the interface.

- **Syntax**:
  ```java
  class ClassName implements InterfaceName {
      // Provide implementation for abstract methods
      @Override
      public void methodName() {
          // Implementation
      }
  }
  ```

- **Example**:
  ```java
  package com.example.myapp;
  interface Vehicle {
      void start();
      void stop();
      default void honk() {
          System.out.println("Beep beep!");
      }
  }
  public class Car implements Vehicle {
      @Override
      public void start() {
          System.out.println("Car started");
      }
      @Override
      public void stop() {
          System.out.println("Car stopped");
      }
  }
  class Test {
      public static void main(String[] args) {
          Car car = new Car();
          car.start(); // Car started
          car.stop();  // Car stopped
          car.honk();  // Beep beep!
      }
  }
  ```

- **Key Points**:
  - A class must implement **all abstract methods** of the interface, or it must be declared `abstract` itself.
  - If a class implements multiple interfaces, it must provide implementations for all abstract methods in all interfaces.
  - Example with multiple interfaces:
    ```java
    interface Movable {
        void move();
    }
    interface Audible {
        void makeSound();
    }
    class Robot implements Movable, Audible {
        @Override
        public void move() {
            System.out.println("Robot moving");
        }
        @Override
        public void makeSound() {
            System.out.println("Beep boop");
        }
    }
    ```

- **Rules**:
  - The implementing class must use the `public` access modifier for interface methods (since interface methods are implicitly `public`).
  - Use `@Override` to ensure correctness and improve readability.
  - A class can implement multiple interfaces (e.g., `implements Interface1, Interface2`).
  - If two interfaces declare methods with the same signature, the class provides a single implementation that satisfies both.

- **Accessing Interface Members**:
  - Use an instance of the implementing class to call instance methods (abstract or default).
  - Use the interface name to access static methods or constants (e.g., `InterfaceName.CONSTANT`).

- **Polymorphism with Interfaces**:
  - An interface type can reference any object of a class that implements it.
  - Example:
    ```java
    Vehicle vehicle = new Car();
    vehicle.start(); // Calls Car’s start method
    ```

---

### 3. **Interface vs. Abstract Classes**

Both **interfaces** and **abstract classes** are used to achieve abstraction in Java, but they serve different purposes and have distinct features. Understanding their differences is critical for exams.

#### **Abstract Classes**
- An **abstract class** is a class that cannot be instantiated and may contain both abstract (unimplemented) and concrete (implemented) methods.
- Declared using the `abstract` keyword.
- Syntax:
  ```java
  abstract class AbstractClass {
      // Abstract method
      abstract void abstractMethod();
      // Concrete method
      void concreteMethod() {
          System.out.println("Concrete implementation");
      }
      // Fields
      int field;
  }
  ```

- **Key Characteristics**:
  - Can have **instance fields**, **constructors**, and **concrete methods**.
  - Supports all access modifiers (`public`, `protected`, `private`, etc.).
  - A class can only **extend one abstract class** (single inheritance).
  - Can contain both abstract and non-abstract methods.

- **Example**:
  ```java
  package com.example.myapp;
  abstract class Vehicle {
      int speed;
      abstract void start();
      void displaySpeed() {
          System.out.println("Speed: " + speed);
      }
  }
  class Car extends Vehicle {
      @Override
      void start() {
          System.out.println("Car started");
          speed = 60;
      }
  }
  ```

#### **Comparison: Interface vs. Abstract Class**

| **Feature**                  | **Interface**                                                                 | **Abstract Class**                                                  |
|------------------------------|-------------------------------------------------------------------------------|--------------------------------------------------------------------|
| **Keyword**                  | `interface`                                                                  | `abstract class`                                                   |
| **Methods**                  | Abstract methods (implicitly `public abstract`), default methods, static methods | Abstract and concrete methods (any access modifier)                 |
| **Fields**                   | Only constants (`public static final`)                                       | Instance fields, any access modifier                               |
| **Inheritance**              | A class can implement multiple interfaces                                    | A class can extend only one abstract class                         |
| **Constructors**             | No constructors                                                              | Can have constructors                                              |
| **Access Modifiers**         | Methods are implicitly `public`                                              | Methods/fields can have any access modifier (`public`, `private`, etc.) |
| **Use Case**                 | Defines a contract for unrelated classes; supports multiple inheritance       | Provides a common base with shared code for related classes         |
| **Instantiation**            | Cannot be instantiated                                                       | Cannot be instantiated                                             |
| **Java Version Enhancements** | Default/static methods (Java 8+), private methods (Java 9+)                 | No significant changes                                              |

- **Example Combining Both**:
  ```java
  package com.example.myapp;
  interface Drivable {
      void drive();
  }
  abstract class Vehicle {
      int speed;
      abstract void start();
      void displaySpeed() {
          System.out.println("Speed: " + speed);
      }
  }
  class Car extends Vehicle implements Drivable {
      @Override
      void start() {
          System.out.println("Car started");
          speed = 60;
      }
      @Override
      public void drive() {
          System.out.println("Car driving");
      }
  }
  class Test {
      public static void main(String[] args) {
          Car car = new Car();
          car.start();       // Car started
          car.drive();       // Car driving
          car.displaySpeed(); // Speed: 60
      }
  }
  ```

- **When to Use**:
  - **Interface**:
    - When you want to define a contract that multiple unrelated classes can follow (e.g., `Comparable`, `Runnable`).
    - When you need multiple inheritance.
    - Example: `List` interface implemented by `ArrayList`, `LinkedList`.
  - **Abstract Class**:
    - When you want to share code (fields, methods) among closely related classes.
    - When you need non-public methods or instance fields.
    - Example: `AbstractList` as a base for `ArrayList`.

- **Java 8+ Changes**:
  - Interfaces can now have `default` and `static` methods, making them more flexible.
  - Example:
    ```java
    interface Example {
        default void defaultMethod() {
            System.out.println("Default method");
        }
    }
    ```
  - This reduces the gap between interfaces and abstract classes, but abstract classes are still better for shared state and complex hierarchies.

---

#### **Practice Program**
**File 1: `com/example/myapp/Shape.java`**
```java
package com.example.myapp;
public interface Shape {
    double getArea();
    default void display() {
        System.out.println("Shape with area: " + getArea());
    }
}
```

**File 2: `com/example/myapp/AbstractShape.java`**
```java
package com.example.myapp;
public abstract class AbstractShape {
    protected String color;
    public AbstractShape(String color) {
        this.color = color;
    }
    public String getColor() {
        return color;
    }
    public abstract void draw();
}
```

**File 3: `com/example/myapp/Circle.java`**
```java
package com.example.myapp;
public class Circle extends AbstractShape implements Shape {
    private double radius;
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
    @Override
    public void draw() {
        System.out.println("Drawing a " + getColor() + " circle");
    }
}
```

**File 4: `com/example/myapp/Test.java`**
```java
package com.example.myapp;
public class Test {
    public static void main(String[] args) {
        Circle circle = new Circle("Red", 5.0);
        circle.draw();       // Drawing a Red circle
        circle.display();    // Shape with area: 78.53981633974483
        System.out.println("Color: " + circle.getColor()); // Color: Red
    }
}
```

**Compile and Run**:
```bash
javac com/example/myapp/*.java
java -cp . com.example.myapp.Test
```
