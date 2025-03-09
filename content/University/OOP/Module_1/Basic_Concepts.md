---
id: Basic Concepts
aliases: []
tags: []
title: Basic Concepts
---

## Basic Concepts
The four key principles of OOP in Java are:

### Encapsulation
It is the process of bundling data and methods that operate on the data into single unit (classes) and restricting direct access to some of the object's details.
#### Key features
- Prevent direct access to private data members.
- Access Modifiers:
    - `private` -> Accessible only within same class.
    - `protected` -> Accessible within same package and subclasses
    - `public` -> Accessible from anywhere.
    - `default` (no modifier) -> Accessible within the same package

```text
Modifier    Class   Package Subclass    World
public        Y        Y       Y         Y 
protected     Y        Y       Y         N
no modifier   Y        Y       N         N
private       Y        N       N         N
```

```java
class BankAccount {
    private double balance; // Private variable

    // Constructor
    public BankAccount(double balance) {
        this.balance = balance;
    }

    // Public methods to access private data
    public void deposit(double amount) {
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
        } else {
            System.out.println("Insufficient funds");
        }
    }

    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount(1000);
        account.deposit(500);
        System.out.println("Balance: " + account.getBalance()); // Output: 1500
    }
}
```

- `balance` is `private`, meaning it cannot be accessed directly.
- The `getBalance()`, `deposit()`, and `withdraw()` methods provide controlled access.

### Abstraction
Abstraction is the process of hiding complex implementation details and exposing only necessary functionality.
#### Key Features 
- Achieved using abstract classes and interfaces.
- Abstract classes can have both abstract and non-abstract methods.
- Interfaces only contain method declarations (Java 8+ allows default methods).

```java
abstract class Vehicle {
    abstract void start(); // Abstract method (no body)

    public void stop() {
        System.out.println("Vehicle stopped");
    }
}

class Car extends Vehicle {
    @Override
    void start() {
        System.out.println("Car is starting");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle myCar = new Car();
        myCar.start(); // Output: Car is starting
        myCar.stop();  // Output: Vehicle stopped
    }
}
```
- `Vehicle` is an abstract class, meaning it cannot be instantiated.
- `start()` is an abstract method, so it must be implemented by any subclass (`Car` in this case).
- `stop()` is a concrete method (implemented in `Vehicle`) that can be used by all subclasses.

### Inheritance
Inheritance is the mechanism in which one class (child/subclass) acquires the properties of another class(parent/superclass).
#### Key features
- Enable code reusability
- The `extends` keyword is used to inherit a class.
- The `super` keyword is used to access parent class members.

```java
// Parent Class
class Animal {
    String name;

    public void eat() {
        System.out.println(name + " is eating");
    }
}

// Child Class
class Dog extends Animal {
    public void bark() {
        System.out.println(name + " is barking");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Buddy";
        myDog.eat();  // Output: Buddy is eating
        myDog.bark(); // Output: Buddy is barking
    }
}
```
- `Dog` class inherits properties and methods from the Animal class.
- `myDog` can access both `eat()` (from Animal) and `bark()` (from Dog).

#### Types of Inheritance in Java
##### Single Inheritance
- A subclass inherits from a single superclass.
- The subclass gets access to public and protected members of the superclass.
- Used to avoid code duplication and promote reusability.

```java
// Superclass
class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

// Subclass
class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks.");
    }
}

// Main Class
public class SingleInheritance {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat();  // Inherited method
        dog.bark(); // Own method
    }
}

output: 
This animal eats food.
The dog barks.
```

##### Multilevel inheritance
- A class inherits from another class, which itself inherits from another class.
- It creates a chain of inheritance.
- The last derived class gets access to all properties of the previous classes.

```java
// Grandparent class
class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

// Parent class
class Mammal extends Animal {
    void walk() {
        System.out.println("Mammals can walk.");
    }
}

// Child class
class Dog extends Mammal {
    void bark() {
        System.out.println("Dogs bark.");
    }
}

// Main class
public class MultilevelInheritance {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat();  // Inherited from Animal
        dog.walk(); // Inherited from Mammal
        dog.bark(); // Own method
    }
}

output: 
This animal eats food.
Mammals can walk.
Dogs bark.
```

##### Hierarchical inheritance
- One parent class is inherited by multiple child classes.
- It creates a tree-like structure.

```java
// Superclass
class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

// Subclass 1
class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks.");
    }
}

// Subclass 2
class Cat extends Animal {
    void meow() {
        System.out.println("The cat meows.");
    }
}

// Main class
public class HierarchicalInheritance {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat();  // Inherited method
        dog.bark(); // Own method

        Cat cat = new Cat();
        cat.eat();  // Inherited method
        cat.meow(); // Own method
    }
}

output: 
This animal eats food.
The dog barks.
This animal eats food.
The cat meows.
```

##### Multiple inheritance
- Java does not support multiple inheritance of classes (a class inheriting from multiple classes) to avoid the "diamond problem" (ambiguity when two parent classes have methods with the same name). However, multiple inheritance is achieved using interfaces.
- Multiple inheritance refers to the ability of a class to inherit properties and behaviors (methods and fields) from more than one superclass.

```java
interface CanFly {
    void fly();
}

interface CanSwim {
    void swim();
}

class Duck implements CanFly, CanSwim {
    public void fly() {
        System.out.println("The duck flies.");
    }
    public void swim() {
        System.out.println("The duck swims.");
    }
}

public class Main {
    public static void main(String[] args) {
        Duck duck = new Duck();
        duck.fly();  // From CanFly
        duck.swim(); // From CanSwim
    }
}

output:
The duck flies.
The duck swims.
```

##### Hybrid inheritance
- Hybrid inheritance is a combination of two or more types of inheritance (e.g., hierarchical and multilevel). In Java, this is achieved using a mix of class inheritance and interface implementation, as direct multiple class inheritance is not allowed.

```java
class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

interface CanRun {
    void run();
}

class Dog extends Animal implements CanRun {
    void bark() {
        System.out.println("The dog barks.");
    }
    public void run() {
        System.out.println("The dog runs.");
    }
}

class Puppy extends Dog {
    void play() {
        System.out.println("The puppy plays.");
    }
}

public class Main {
    public static void main(String[] args) {
        Puppy puppy = new Puppy();
        puppy.eat();  // From Animal
        puppy.bark(); // From Dog
        puppy.run();  // From CanRun
        puppy.play(); // From Puppy
    }
}

output: 
This animal eats food.
The dog barks.
The dog runs.
The puppy plays.
```

### Polymorphism
Polymorphism is the property by which an object can take many forms, meaning a method or function behaves differently based on the object calling it.

#### Compile time polymorphism - Method overloading
- Occurs when multiple methods have the same name but different parameters.
- The method to be called is determined at compile time.
- Can be achieved by changing:
    - Number of parameters
    - Data type of parameters
    - Order of parameters

```java
class MathOperations {
    // Method with one integer parameter
    int add(int a, int b) {
        return a + b;
    }

    // Method with three integer parameters
    int add(int a, int b, int c) {
        return a + b + c;
    }

    // Method with two double parameters
    double add(double a, double b) {
        return a + b;
    }
}

public class CompileTimePolymorphism {
    public static void main(String[] args) {
        MathOperations obj = new MathOperations();
        System.out.println("Sum (int, int): " + obj.add(5, 10)); 
        System.out.println("Sum (int, int, int): " + obj.add(5, 10, 15)); 
        System.out.println("Sum (double, double): " + obj.add(5.5, 2.5));
    }
}

output: 
Sum (int, int): 15
Sum (int, int, int): 30
Sum (double, double): 8.0
```

##### Runtime Polymorphism - Method Overriding
- Occurs when a subclass provides a specific implementation of a method that is already defined in the parent class.
- The method to be executed is determined at runtime.
- Requires inheritance and method overriding.

**Rules:** - 
- Method name and parameters must be identical in the parent and child classes.
- The return type must be the same or a subtype (covariant return type).
- The access modifier of the overriding method cannot be more restrictive than the overridden method.
- Only instance methods can be overridden (not static methods).
- The `@Override` annotation is recommended to ensure correctness.

```java
// Parent class
class Animal {
    void sound() {
        System.out.println("Animals make different sounds.");
    }
}

// Child class overriding the method
class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dogs bark.");
    }
}

// Child class overriding the method
class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Cats meow.");
    }
}

// Main class
public class RuntimePolymorphism {
    public static void main(String[] args) {
        Animal myAnimal;   // Reference variable of Animal

        myAnimal = new Dog();
        myAnimal.sound();  // Calls Dog's overridden method

        myAnimal = new Cat();
        myAnimal.sound();  // Calls Cat's overridden method
    }
}

output: 
Dogs bark.
Cats meow.
```

Polymorphism can be achieved using interfaces too.
```java
// Interface
interface Animal {
    void makeSound();
}

// Dog class implementing the interface
class Dog implements Animal {
    public void makeSound() {
        System.out.println("Dog barks.");
    }
}

// Cat class implementing the interface
class Cat implements Animal {
    public void makeSound() {
        System.out.println("Cat meows.");
    }
}

// Main class
public class InterfacePolymorphism {
    public static void main(String[] args) {
        Animal animal;

        animal = new Dog();
        animal.makeSound();  // Calls Dog's implementation

        animal = new Cat();
        animal.makeSound();  // Calls Cat's implementation
    }
}

output: 
Dog barks.
Cat meows.
```

