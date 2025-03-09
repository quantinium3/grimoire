---
id: OOP Concepts
aliases: []
tags: []
title: OOP Concepts
---

### Class
A class is like a blueprint or template for creating objects. It defines the properties (data) and behaviors (functions or methods) that objects created from it will have.

```java
class Car {
    // Attributes (data)
    String model;
    int year;
    double speed;

    // Method (behavior)
    void accelerate() {
        speed += 10;
    }
}
```
Here, `Car` defines what a car *is*—it has a model, a year, and a speed, and it can accelerate. But this class doesn’t do anything on its own yet.

### Object
An object is an instance of a class—think of it as the actual cake baked from the recipe. When you create an object, you’re taking the class blueprint and making a real, tangible thing in memory that you can interact with.

```java
Car myCar = new Car();
myCar.model = "Toyota Camry";  // Set the model
myCar.year = 2020;             // Set the year
myCar.speed = 0;               // Set initial speed
myCar.accelerate();            // Call the method; speed becomes 10
```
- `new Car()` creates a new object (instance) of the `Car` class in memory.
- `myCar` is a reference variable that points to this object so you can use it.

### Class and Object Fundamentals
- **Class**: Defines the structure and behavior (static definition).
- **Object**: A runtime entity with actual data, created from the class.
- A single class can create multiple objects, each with its own data:
```java
Car car1 = new Car();
Car car2 = new Car();
car1.model = "Honda Civic";
car2.model = "Ford Mustang";
```
Here, `car1` and `car2` are distinct objects with their own `model` values, but they share the same structure defined by the `Car` class.

### Creating Objects
Creating an object typically involves:
1. **Declaration**: Declaring a reference variable (e.g., `Car myCar`).
2. **Instantiation**: Using `new` to allocate memory for the object (e.g., `new Car()`).
3. **Initialization**: Optionally setting initial values (e.g., via a constructor).

A constructor is a special method in the class that initializes an object when it’s created. Let’s add one to `Car`:
```java
class Car {
    String model;
    int year;
    double speed;

    // Constructor
    Car(String m, int y) {
        model = m;
        year = y;
        speed = 0;  // Default speed
    }

    void accelerate() {
        speed += 10;
    }
}

Car myCar = new Car("Tesla Model 3", 2022);
```

### Assigning Object Reference Variables
In OOP languages like Java, variables of a class type (e.g., `Car myCar`) are *references*, not the objects themselves. They store the memory address of the object. This matters when you assign one reference to another:
```java
Car carA = new Car("BMW X5", 2021);
Car carB = carA;  // carB now points to the same object as carA
carB.model = "Audi Q7";  // This changes carA’s model too!

Car carC = new Car("Audi Q7", 2021);  // A separate object
```

### Size of an “Empty Object”?
An empty object comes from a class with no fields (instance variables). For example:
```java
class Empty {
    // No fields, no methods (or just methods, which don’t affect object size)
}
```
When you create an object with `Empty obj = new Empty();`, it still takes up some memory. Why? Because the language’s runtime needs to track the object’s existence, identity, and type, even if it holds no data.

In Java, an object’s size is determined by the Java Virtual Machine (JVM) and includes:
1. **Object header**: Metadata like the object’s class type and hashcode.
2. **Alignment**: Memory is padded to align with the system’s word size (e.g., 8 bytes on a 64-bit JVM).

For an empty object:
- **Object header**: Typically 12 bytes on a 64-bit JVM (8 bytes for the class pointer, 4 bytes for identity hashcode/mark word).
- **Padding**: Rounded up to a multiple of 8 bytes.

So, an empty object in Java is usually **16 bytes** on a 64-bit JVM (12 bytes header + 4 bytes padding). On a 32-bit JVM, it’s often **8 bytes** (smaller header).

### Methods
A **method** is a block of code inside a class that defines a behavior or action an object (or sometimes the class itself) can perform. It’s like a function tied to the class, often operating on the object’s data (instance variables).

#### Key Features of Methods
- **Belongs to objects**: Typically, methods work with an object’s instance variables.
- **Has a return type**: Could return something (e.g., `int`, `String`) or nothing (`void`).
- **Can take parameters**: Inputs to customize its behavior.

```java
public class Dog {
    String name;
    int age;

    // Method to make the dog bark
    public void bark() {
        System.out.println(name + " says Woof!");
    }
}

class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Rex";
        myDog.bark();        // Outputs: Rex says Woof!
    }
}
```
---

### Static Methods
A **static method** belongs to the *class* itself, not to individual objects. It’s marked with the `static` keyword and can be called without creating an instance of the class.

#### Key Features of Static Methods
- **No object needed**: Call it using the class name (e.g., `ClassName.method()`).
- **Can’t access instance variables directly**: Since it’s not tied to an object, it only works with static (class-level) data or parameters passed to it.
- **Common uses**: Utility functions, helpers, or operations that don’t depend on object state.

```java
public class MathUtils {
    // Static method to add two numbers
    public static int add(int a, int b) {
        return a + b;
    }

    // Static variable
    public static int counter = 0;

    // Static method using a static variable
    public static void incrementCounter() {
        counter++;
    }
}

class Main {
    public static void main(String[] args) {
        // Call static method without an object
        int sum = MathUtils.add(5, 3);  // No need for 'new MathUtils()'
        System.out.println("Sum: " + sum);  // Outputs: 8

        MathUtils.incrementCounter();
        System.out.println("Counter: " + MathUtils.counter);  // Outputs: 1
    }
}
```
---

### Constructors
A **constructor** is a special method called automatically when an object is created with `new`. It initializes the object’s state (instance variables).

#### Key Features of Constructors
- **Same name as the class**: No return type (not even `void`).
- **Runs once per object**: Executes when `new` is called.
- **Can be public, private, etc.**: Controls how objects are created (public is common).

#### Example
```java
public class Cat {
    String name;
    int lives;

    // Constructor
    public Cat(String name, int lives) {
        this.name = name;   // 'this' distinguishes instance variable from parameter
        this.lives = lives;
    }

    public void meow() {
        System.out.println(name + " says Meow!");
    }
}

class Main {
    public static void main(String[] args) {
        Cat myCat = new Cat("Whiskers", 9);  // Constructor runs here
        myCat.meow();  // Outputs: Whiskers says Meow!
    }
}
```
---

### Overloading Constructors
**Constructor overloading** means defining multiple constructors in the same class with different parameter lists. This gives flexibility in how objects can be created.

#### Key Features of Overloading
- **Same name, different parameters**: Differ by number, type, or order of parameters.
- **Still called with `new`**: Java picks the right one based on the arguments you provide.
- **Improves usability**: Lets users instantiate objects in various ways.

```java
public class Student {
    String name;
    int age;
    String major;

    // Constructor 1: Full initialization
    public Student(String name, int age, String major) {
        this.name = name;
        this.age = age;
        this.major = major;
    }

    // Constructor 2: Name and age only
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        this.major = "Undecided";  // Default value
    }

    // Constructor 3: Name only
    public Student(String name) {
        this.name = name;
        this.age = 18;      // Default age
        this.major = "Undecided";
    }

    public void display() {
        System.out.println("Name: " + name + ", Age: " + age + ", Major: " + major);
    }
}

class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Alice", 20, "Computer Science");
        Student s2 = new Student("Bob", 19);
        Student s3 = new Student("Charlie");

        s1.display();  // Name: Alice, Age: 20, Major: Computer Science
        s2.display();  // Name: Bob, Age: 19, Major: Undecided
        s3.display();  // Name: Charlie, Age: 18, Major: Undecided
    }
}
```

- You can call one constructor from another using `this()` to avoid code duplication:
  ```java
  public Student(String name) {
      this(name, 18);  // Calls the (String, int) constructor
  }
  ```
- Overloading applies to regular methods too, not just constructors.

---

### The `this` Keyword
The `this` keyword refers to the *current object*—the instance of the class that’s running the code. It’s used to distinguish between instance variables and parameters or to call other constructors/methods within the same class.

#### Key Uses of `this`
1. **Disambiguate variable names**: When a parameter has the same name as an instance variable.
2. **Call another constructor**: Chain constructor calls.
3. **Pass the current object**: Send `this` to another method or object.

```java
public class Person {
    String name;
    int age;

    // Constructor using 'this' to avoid name clashes
    public Person(String name, int age) {
        this.name = name;  // 'this.name' is the instance variable, 'name' is the parameter
        this.age = age;
    }

    // Constructor chaining with 'this'
    public Person(String name) {
        this(name, 18);  // Calls the (String, int) constructor
    }

    // Method using 'this' to pass the current object
    public void introduce(Person other) {
        System.out.println("Hi, I'm " + this.name + ". Nice to meet you, " + other.name + "!");
    }
}

class Main {
    public static void main(String[] args) {
        Person p1 = new Person("Alice", 20);
        Person p2 = new Person("Bob");
        p1.introduce(p2);  // Outputs: Hi, I'm Alice. Nice to meet you, Bob!
    }
}
```
---

### Using Objects as Parameters
You can pass objects to methods just like primitive types (e.g., `int`). The method receives a reference to the object and can interact with its data or call its methods.

```java
public class Book {
    String title;
    int pages;

    public Book(String title, int pages) {
        this.title = title;
        this.pages = pages;
    }

    // Method that takes an object as a parameter
    public void comparePages(Book otherBook) {
        if (this.pages > otherBook.pages) {
            System.out.println(this.title + " has more pages than " + otherBook.title);
        } else {
            System.out.println(otherBook.title + " has more pages or equal to " + this.title);
        }
    }
}

class Main {
    public static void main(String[] args) {
        Book b1 = new Book("Java Basics", 300);
        Book b2 = new Book("Python Guide", 250);
        b1.comparePages(b2);  // Outputs: Java Basics has more pages than Python Guide
    }
}
```
---

### Argument Passing
In Java, argument passing follows a simple rule: **everything is passed by value**. But what “value” means depends on the type:
- **Primitive types** (e.g., `int`, `double`): The actual value is copied.
- **Objects**: The *reference* (memory address) is copied, not the object itself. This means changes to the object’s fields are visible to the caller, but reassigning the reference isn’t.

```java
public class Box {
    int size;

    public Box(int size) {
        this.size = size;
    }

    // Method with primitive parameter
    public void changePrimitive(int value) {
        value = 100;  // Changes local copy, not the original
    }

    // Method with object parameter
    public void changeObject(Box b) {
        b.size = 200;  // Changes the object’s field (visible to caller)
        b = new Box(300);  // Reassigns local reference (not visible to caller)
    }
}

class Main {
    public static void main(String[] args) {
        int num = 10;
        Box myBox = new Box(50);

        myBox.changePrimitive(num);
        System.out.println("Num: " + num);  // Still 10 (pass-by-value)

        myBox.changeObject(myBox);
        System.out.println("Box size: " + myBox.size);  // Now 200 (object modified)
    }
}
```
---

### Returning Objects
Methods can return objects, allowing you to create or modify an object and send it back to the caller. The return type is the class name (or a superclass/interface).

```java
public class Point {
    int x;
    int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // Method returning a new object
    public Point move(int dx, int dy) {
        return new Point(this.x + dx, this.y + dy);
    }

    public void display() {
        System.out.println("Point: (" + x + ", " + y + ")");
    }
}

class Main {
    public static void main(String[] args) {
        Point p1 = new Point(3, 4);
        Point p2 = p1.move(2, -1);  // Returns a new Point object
        p1.display();  // Point: (3, 4)
        p2.display();  // Point: (5, 3)
    }
}
```
---
### `finalize()`
`finalize()` is a method in Java, defined in the `Object` class, that can be overridden by a subclass. It’s called by the garbage collector when it determines that an object is no longer reachable (i.e., there are no references to it) and is about to be reclaimed.
- It gives an object a last chance to perform cleanup (e.g., releasing resources like file handles or network connections) before it’s destroyed.
- `protected void finalize() throws Throwable`
- **How it works**: 
  - The garbage collector (GC) identifies objects that are eligible for collection.
  - If an object overrides `finalize()`, the GC places it in a queue for finalization.
  - A separate Finalizer thread runs the `finalize()` method.
  - After `finalize()` executes, the object can be collected in the next GC cycle.
- **Key Points**:
  - It’s not guaranteed to run, as the GC might never reclaim the object, or the program might exit first.
  - It’s deprecated since Java 9 (2017) and removed in some later versions because it’s unreliable and can cause issues (e.g., delaying garbage collection or resurrecting objects).
  - Modern practice favors explicit cleanup methods like `close()` with try-with-resources or using `Cleaner` (introduced in Java 9).
- **Example**:
  ```java
  class MyClass {
      @Override
      protected void finalize() throws Throwable {
          System.out.println("Object is being finalized");
          super.finalize(); // Call the parent’s finalize
      }
  }

  public class Test {
      public static void main(String[] args) {
          MyClass obj = new MyClass();
          obj = null; // Make it eligible for GC
          System.gc(); // Suggest garbage collection (not guaranteed)
      }
  }
  ```

### `final` Keyword
- **What it is**: `final` is a keyword in Java (and some other languages like C++) that restricts modification, depending on where it’s applied.
- **Uses and Effects**:
  1. **Final Variable**:
     - Makes a variable constant; its value can’t be changed once assigned.
     - Must be initialized at declaration or in a constructor (for instance fields).
     - Example:
       ```java
       final int MAX_VALUE = 100;
       MAX_VALUE = 200; // Error: cannot reassign
       ```
  2. **Final Method**:
     - Prevents a method from being overridden in a subclass.
     - Useful for ensuring a method’s behavior remains consistent.
     - Example:
       ```java
       class Parent {
           final void display() {
               System.out.println("This is final");
           }
       }
       class Child extends Parent {
           void display() { // Error: cannot override
               System.out.println("Override attempt");
           }
       }
       ```
  3. **Final Class**:
     - Prevents a class from being subclassed (no inheritance).
     - Often used for security or to enforce immutability (e.g., `String` class in Java).
     - Example:
       ```java
       final class MyFinalClass {
           // Class body
       }
       class SubClass extends MyFinalClass { // Error: cannot inherit
       }
       ```
- **Key Points**:
  - `final` enhances performance slightly (e.g., the compiler can inline final methods), but its main purpose is design clarity and safety.
  - It’s unrelated to `finalize()` despite the similar name—`final` is about immutability or inheritance, while `finalize()` is about object lifecycle.

### **Inheritance Basics**
Inheritance is a mechanism in OOP where a class (called a *subclass* or *derived class*) inherits properties and behaviors (fields and methods) from another class (called a *superclass* or *base class*). It promotes code reuse and establishes a "is-a" relationship between classes.

- **Example**: If `Animal` is a superclass with a method `makeSound()`, a subclass `Dog` can inherit it and use or modify it.
  ```java
  class Animal {
      void makeSound() {
          System.out.println("Some sound");
      }
  }

  class Dog extends Animal {
      // Inherits makeSound() automatically
  }

  public class Main {
      public static void main(String[] args) {
          Dog dog = new Dog();
          dog.makeSound(); // Outputs: "Some sound"
      }
  }
  ```
- **Key Points**:
  - The subclass can add its own fields/methods or modify inherited ones.
  - Use keywords like `extends` (Java) or `:` (C++) to inherit.

---

### **Access Control**
Access control determines how inherited members (fields, methods) are accessible in the subclass or outside it. Common access modifiers include:
- **Public**: Accessible everywhere.
- **Protected**: Accessible within the same package and also in subclasses (even if in different packages).
- **Private**: Accessible only within the same class (not inherited).
- **Default** (no modifier): Accessible only within the same package.

- **Example**:
  ```java
  class Animal {
      public String name = "Generic Animal";
      protected int age = 5;
      private String secret = "Hidden";
  }

  class Dog extends Animal {
      void display() {
          System.out.println(name);  // Accessible (public)
          System.out.println(age);   // Accessible (protected)
          // System.out.println(secret); // Error: private not inherited
      }
  }
  ```

---

### **Multilevel Inheritance**
This occurs when a class inherits from a subclass, forming a chain of inheritance (e.g., `A → B → C`).
- **Example**:
  ```java
  class Animal {
      void eat() {
          System.out.println("Eating...");
      }
  }

  class Mammal extends Animal {
      void walk() {
          System.out.println("Walking...");
      }
  }

  class Dog extends Mammal {
      void bark() {
          System.out.println("Barking...");
      }
  }

  public class Main {
      public static void main(String[] args) {
          Dog dog = new Dog();
          dog.eat();  // From Animal
          dog.walk(); // From Mammal
          dog.bark(); // From Dog
      }
  }
  ```
- **Note**: While multilevel inheritance is useful, excessive levels can complicate code maintenance.

---

### **Method Overloading (Polymorphism)**
Method overloading is a form of *compile-time polymorphism*, where multiple methods share the same name but differ in parameters (number, type, or order). The compiler decides which method to call based on the arguments.

- **Example**:
  ```java
  class Calculator {
      int add(int a, int b) {
          return a + b;
      }

      double add(double a, double b) {
          return a + b;
      }

      int add(int a, int b, int c) {
          return a + b + c;
      }
  }

  public class Main {
      public static void main(String[] args) {
          Calculator calc = new Calculator();
          System.out.println(calc.add(2, 3));       // Calls int version
          System.out.println(calc.add(2.5, 3.5));   // Calls double version
          System.out.println(calc.add(1, 2, 3));    // Calls three-int version
      }
  }
  ```
- **Key Points**:
  - Return type alone doesn’t define overloading; parameter lists must differ.
  - It’s resolved at compile time.

---

### **Method Overriding (Polymorphism)**
Method overriding is a form of *runtime polymorphism*, where a subclass provides a specific implementation of a method already defined in its superclass. The method signature (name, parameters) must match exactly.

- **Rules**:
  - Must have the same name, return type (or covariant), and parameters.
  - Access level cannot be more restrictive than the superclass method.
  - Use `@Override` annotation (in Java) for clarity.

- **Example**:
  ```java
  class Animal {
      void makeSound() {
          System.out.println("Some sound");
      }
  }

  class Dog extends Animal {
      @Override
      void makeSound() {
          System.out.println("Woof!");
      }
  }

  public class Main {
      public static void main(String[] args) {
          Animal myDog = new Dog(); // Upcasting
          myDog.makeSound();       // Outputs: "Woof!" (runtime decision)
      }
  }
  ```
- **Key Points**:
  - It’s resolved at runtime based on the object’s actual type, not the reference type.
  - Enables dynamic behavior in inheritance hierarchies.

---

### **Abstract Classes**
An abstract class is a class that cannot be instantiated directly and is meant to be inherited. It can contain both abstract methods (no implementation) and concrete methods (with implementation).

- **Syntax**:
  ```java
  abstract class Animal {
      abstract void makeSound(); // Abstract method (no body)

      void sleep() {            // Concrete method
          System.out.println("Sleeping...");
      }
  }

  class Dog extends Animal {
      void makeSound() {        // Must implement abstract method
          System.out.println("Woof!");
      }
  }

  public class Main {
      public static void main(String[] args) {
          Dog dog = new Dog();
          dog.makeSound(); // Outputs: "Woof!"
          dog.sleep();     // Outputs: "Sleeping..."
      }
  }
  ```
- **Key Points**:
  - Subclasses must implement all abstract methods unless they are also abstract.
  - Used to define a common interface or template for subclasses.
  - Contrast with interfaces: Abstract classes can have state (fields) and concrete methods.

---
