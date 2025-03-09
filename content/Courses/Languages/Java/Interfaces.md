---
id: Interfaces
aliases: []
tags: []
---

### **Interface?**
An interface is a fully abstract construct in OOP that defines a contract—a set of methods (and sometimes constants) that a class must implement. It specifies *what* a class should do, but not *how* it should do it. Think of it as a blueprint or a promise that any implementing class will provide specific functionality.

- **Key Characteristics**:
  - Cannot be instantiated directly (like abstract classes).
  - Contains method declarations (no implementation, traditionally) and constants.
  - Classes "implement" an interface, rather than "extend" it.

- **Syntax Example (Java)**:
  ```java
  interface Animal {
      void makeSound(); // Abstract method by default
      void move();      // Another abstract method
  }

  class Dog implements Animal {
      public void makeSound() {
          System.out.println("Woof!");
      }

      public void move() {
          System.out.println("Running...");
      }
  }

  public class Main {
      public static void main(String[] args) {
          Dog dog = new Dog();
          dog.makeSound(); // Outputs: "Woof!"
          dog.move();      // Outputs: "Running..."
      }
  }
  ```

---

### **Key Features of Interfaces**
#### **1. Methods**
- Traditionally, all methods in an interface are abstract (no body) and implicitly `public` and `abstract`.
- Since Java 8, interfaces can also have:
  - **Default Methods**: Methods with a body, allowing backward-compatible enhancements.
  - **Static Methods**: Utility methods tied to the interface itself.
  
  ```java
  interface Animal {
      void makeSound(); // Abstract method

      default void sleep() { // Default method
          System.out.println("Sleeping...");
      }

      static void info() { // Static method
          System.out.println("This is an Animal interface");
      }
  }

  class Dog implements Animal {
      public void makeSound() {
          System.out.println("Woof!");
      }
  }

  public class Main {
      public static void main(String[] args) {
          Dog dog = new Dog();
          dog.makeSound(); // Outputs: "Woof!"
          dog.sleep();     // Outputs: "Sleeping..."
          Animal.info();   // Outputs: "This is an Animal interface"
      }
  }
  ```

#### **2. Fields**
- All fields in an interface are implicitly `public`, `static`, and `final` (i.e., constants).
- Example:
  ```java
  interface Animal {
      int LEG_COUNT = 4; // Constant
      void makeSound();
  }
  ```

#### **3. Multiple Interfaces**
A class can implement multiple interfaces, separated by commas.
- Example:
  ```java
  interface Swimmer {
      void swim();
  }

  interface Flyer {
      void fly();
  }

  class Duck implements Swimmer, Flyer {
      public void swim() {
          System.out.println("Swimming...");
      }

      public void fly() {
          System.out.println("Flying...");
      }
  }
  ```

---

### **Interfaces vs. Abstract Classes**

| Feature                | Interface                              | Abstract Class                        |
|-----------------------|----------------------------------------|---------------------------------------|
| **Methods**           | Traditionally abstract; can have default/static methods (Java 8+). | Can have abstract and concrete methods. |
| **Fields**            | Only constants (`public static final`).| Can have instance variables.          |
| **Inheritance**       | Supports multiple inheritance.         | Single inheritance only.              |
| **Instantiation**     | Cannot be instantiated.                | Cannot be instantiated.               |
| **Use Case**          | Defines a capability or role (e.g., `Runnable`). | Defines a partial implementation (e.g., `Animal`). |

- **When to Use**:
  - Use an *interface* for a contract or capability (e.g., `Comparable`, `Serializable`).
  - Use an *abstract class* when you need shared code or state across subclasses.

---

### **Polymorphism with Interfaces**
Interfaces are a cornerstone of runtime polymorphism. You can use an interface type as a reference to any object that implements it.
- Example:
  ```java
  interface Animal {
      void makeSound();
  }

  class Dog implements Animal {
      public void makeSound() {
          System.out.println("Woof!");
      }
  }

  class Cat implements Animal {
      public void makeSound() {
          System.out.println("Meow!");
      }
  }

  public class Main {
      public static void main(String[] args) {
          Animal[] animals = {new Dog(), new Cat()};
          for (Animal a : animals) {
              a.makeSound(); // Outputs: "Woof!" then "Meow!"
          }
      }
  }
  ```
- The `Animal` reference dynamically calls the correct `makeSound()` based on the object’s actual type.

---

### **Extending Interfaces**
Interfaces can inherit from other interfaces using the `extends` keyword (not `implements`).
- Example:
  ```java
  interface BasicAnimal {
      void eat();
  }

  interface AdvancedAnimal extends BasicAnimal {
      void sleep();
  }

  class Dog implements AdvancedAnimal {
      public void eat() {
          System.out.println("Eating...");
      }

      public void sleep() {
          System.out.println("Sleeping...");
      }
  }
  ```

---

### **Common Examples in Practice**
- **Java**: `Runnable`, `Comparable`, `List` (interfaces in the Java API).
---
