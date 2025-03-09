---
id: Intro
aliases: []
tags: []
title: Intro
---

## Object Oriented Methodology
OOM is an approach to software development that focuses on designing and structuring programs around objects rather than functions or logic. **OOP** is a programming paradigm based on the concept of objects. Objects contain data (fields, attributes or properties) and have action they can perform (procedures and methods).

### Key concepts of OOM
#### Objects
- Objects are instances of a class with specifically defined data. 
- They represent real-world entities (e.g., a Car, a Bank Account, a Student).
- Each object has attributes (data) and methods (functions).

#### Classes
- A class is a blueprint for creating objects.
- It defines the attributes (variables) and behaviors (methods) of objects.

#### Methods
- These are the functions that are defined inside a class that describe the behaviour of an object. 
- They are useful for re-usability or keeping functionality encapsulated inside one object at a time.

#### Attributes
- These are defined in the class template and represent the state of an object. Objects contain data stored in the attribute field.

```java
public class Car {
    private String brand;
    private int speed;

    public Car(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }

    public void accelerate(int increase) {
        this.speed += increase;
    }

    // Getters
    public String getBrand() {
        return brand;
    }

    public int getSpeed() {
        return speed;
    }

    // Setters
    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }
}
```

## Programming paradigms
A **programming paradigm** is a fundamental style or approach to programming that defines how code is structured and executed.

### Imperative Paradigm
- In imperative paradigm, programs are written as a sequence of instructions that change the program's state.
- It focuses on **how** a task should be performed.

#### Procedural
- Based on procedures (functions) that operate on data.
- Code is executed step by step.
- Uses loops, conditional and variables.
- Ex - C, Python, JavaScript (when using functions)

```py
def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result

print(factorial(5))  # Output: 120
```

#### Object Oriented Programming
- Based on objects that contain both data and their behaviors.
- Uses classes, objects, encapsulation, abstraction, inheritance and polymorphism.
- Ex - Java, C++, Python.

```ts
class Car {
    constructor(public brand: string, public speed: number) {}

    accelerate(increase: number) {
        this.speed += increase;
    }
}

const myCar = new Car("Tesla", 100);
myCar.accelerate(20);
console.log(myCar.speed); // Output: 120
```

### Declarative Paradigm
- In it, **what** needs to be done is specified rather than **how** it needs to be done. 
- It focuses on describing the problem rather than specifying the steps to solve it.

#### Functional 
- Based on pure functions i.e a function should be not change non-local state and should be deterministic.
- Uses recursion, higher-order functions, currying. 
- Avoids changing state i.e. variables are immutable.
- Ex - Haskell, Lisp.
```js
const square = x => x * x;
const numbers = [1, 2, 3, 4, 5];
const squaredNumbers = numbers.map(square);
console.log(squaredNumbers); // Output: [1, 4, 9, 16, 25]

```
#### Logic Programming
- Based on rules and facts instead of explicit instructions.
- Uses Predicate logic to derive conclusions
- Ex - Prolog
```prolog
father(john, bob).
father(bob, alice).
grandfather(X, Y) :- father(X, Z), father(Z, Y).
```

## Evolution
**Object-Oriented Methodology (OOM)** evolved as a response to the increasing complexity of software development. It introduced a way to model real-world entities in a more structured, modular, and reusable manner.

### **Origins in Simula (1960s)**
- **Before Object-Oriented Programming (OOP),** programming was mostly procedural (e.g., using languages like Fortran, COBOL, and Assembly).  
- **Simula (1967)** – Developed by `Ole-Johan Dahl` and `Kristen Nygaard` in Norway.
  - Introduced **classes, objects, and inheritance.**
  - Used for simulation and modeling of real-world systems.
  - Laid the groundwork for OOP principles.

### **Birth of OOP - Smalltalk (1970s)**
- Developed by `Alan Kay` and `Xerox PARC` in the early 1970s.
- Introduced **fully object-oriented concepts**:
  - **Encapsulation** – Data and methods bundled in objects.
  - **Message Passing** – Objects communicate by sending messages.
  - **Dynamic Binding** – Methods can be overridden at runtime.
- **Smalltalk became the first true object-oriented language.**

### **Growth and adoption - C++ (1980s) – Bridging Procedural and OO Paradigms**
- **Bjarne Stroustrup** developed **C++** as an extension of C.
- Combined procedural programming with object-oriented features.
- Added features like:
  - **Classes and Objects**
  - **Constructors & Destructors**
  - **Operator Overloading**
  - **Inheritance & Polymorphism**
- **Impact:** C++ became widely used in system software, games, and applications.

### **OOP Gains Popularity (1990s)**
- **Objective-C (1983)** – Combined Smalltalk’s messaging with C syntax.
- **Eiffel (1986)** – Focused on software reliability and reusability.
- **Python (1991)** – Introduced a simpler, beginner-friendly approach to OOP.
- **Java (1995)** – Created by **James Gosling** at Sun Microsystems.
  - Designed to be **platform-independent** (WORA – Write Once, Run Anywhere).
  - Used in **enterprise applications, web applications, and mobile development (Android).**
  - Popularized concepts like **interfaces, garbage collection, and abstraction.**

### **The Rise of Enterprise Applications (2000s)**
- **C# (2000)** – Microsoft's alternative to Java, used in Windows applications.
- **Ruby (1995, but popular in 2000s)** – Brought simplicity with OOP and metaprogramming.
- **Object-Oriented Databases (OODBs)** – Emerged to store objects directly.

### **Hybrid and Multi-Paradigm Languages (2010s – Present)**
- **JavaScript & TypeScript** – Became dominant for web development.
  - JavaScript was initially procedural but later adopted OOP concepts.
  - TypeScript (2012) added static typing and better OOP support.
- **Swift (2014)** – Apple’s modern take on OOP, replacing Objective-C.
- **Kotlin (2016)** – A modern alternative to Java, widely used in Android development.

### **Emergence of Functional & Object-Oriented Fusion**
- **Languages like Python, JavaScript, and Swift** now support both **OOP and functional programming.**
- **Microservices and Cloud Computing** reduced reliance on monolithic OO systems.
- **Design Patterns** (e.g., Singleton, Factory, MVC) became essential for scalable applications.


## Benefits of OOP
- Modularity - OOP allows code to be divided into self-contained objects, each representing a specific module or entity
- Improves code readability and organization.
- Simplifies debugging and make maintenance of code easier.
- Make code reusable due to inheritance.
- Encapsulation enhances security by hiding implementation details and only exposing what is necessary.
- Polymorphism makes systems easier to extend and modify without altering existing code
- OOP’s structured approach (classes, objects, encapsulation) makes it easier to update or fix code.
- OOP mimics real-world entities by representing them as objects with properties and behaviors, making it intuitive to design software.
- Inheritance and polymorphism allow new features to be added by extending existing classes or implementing new interfaces, without modifying the original code
