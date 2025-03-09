---
id: Javascript
aliases: []
tags: []
---

Javascript / Java (same thing) is the language used to make websites by making them dynamic.
- [Just-in-time-compiled](https://www.howtogeek.com/devops/what-is-just-in-time-jit-compilation/#what-does-jit-compilation-do) - Compiling of program while it's being executed.
- [Prototype-based](https://developer.mozilla.org/en-US/docs/Glossary/Prototype-based_programming)
- Single-threaded
- Dynamic language

```js
console.log("Hello World");
```

In JS, you can use a template literal to interpolate dynamic values into a string templates. Kinda like python f-string.
Template literals start with back-ticks. It allows us to interpolate dynamic values into string template.
```js
const v = 5; //declare using const
let w = 5; // declare using let
console.log(`v is ${v}`);
```

### null
It's null. Most programming languages have it. null values are 'falsy'
**Conversion^ - 
- False - boolean
- 0 - number zero
- '' = empty string 

### undefined poor man's null.

**undefined** means the variable was never assigned a value.
**null** is just same but we assign it explicitly. It doesn't mean we can't assign undefined.

### Operators and if-else
Normal operator usage and normal if else and ternary operator like python or c.

### Functions 
```js
console.log(getLabel(3))
// prints 'awful'

function getLabel(numStars) {
  if (numStars > 7) {
    return 'great'
  } else if (numStars > 3) {
    return 'okay'
  } else {
    return 'awful'
  }
}
```
JS interpreter reads whole first and function definition are globally scoped, then goes back to executing where it is called. In JS it doesn't matter where the function definitions occur. 

#### Other ways to define a function
```js
//using the function keyworkd
function add(x, y) {
    return x + y;
}
const add = function(x, y) {
  return x + y
}

// Fat arrow function
const add = (x, y) => {
  return x + y
}
```

### Arrays
These are dynamically allocated arrays. Python list. C++ vectors.
```js
const numbers = [1, 2, 3, 4, 5]
const strings = ['banana', 'apple', 'pear']
const miscellaneous = [true, 7, 'adamantium']
numbers.push(6);
console.log(numbers[0])
```
### Loops 
```js
for (let i = 0; i < 10; i++) {
  console.log(i)
}

let list = [4, 5, 6];
// for...in return the keys
for (let i in list) {
  console.log(i); // "0", "1", "2",
}
//for...of return the values.
for (let i of list) {
  console.log(i); // 4, 5, 6
}
```

### Objects 
JS has a object type. They are variables that can hold more complex information than basic types like String, Number and Boolean.
```js
const apple = {
  name: 'Apple',
  radius: 2,
  color: 'red',
}
```

**Syntactic Sugar**

```js
const name = 'Apple'
const radius = 2
const color = 'red'
const apple = {
  name,
  radius,
  color,
}

// Similar to 
const name = 'Apple'
const radius = 2
const color = 'red'
const apple = {
  name: name,
  radius: radius,
  color: color,
}
```
#### Object Methods
Javascript Object have methods. Methods are functions that are defined inside an object. They can access and change the properties of the object in question.

```js
const person = {
  firstName: 'Lane',
  lastName: 'Wagner',
  getFullName() {
    return this.firstName + ' ' + this.lastName
  }
}

console.log(person.getFullName())
```

Methods can mutate the properties of their object.

```js
const tree = {
  height: 256,
  color: 'green',
  cut() {
    this.height /= 2
  }
}

tree.cut()
console.log(tree.height)
// prints 128
```

### this
```js
const author = {
  firstName: 'Lane',
  lastName: 'Wagner',
  getName() {
    return `${this.firstName} ${this.lastName}`
  }
}
console.log(author.getName())
// Prints: Lane Wagner
```

```js
const author = {
  firstName: 'Lane',
  lastName: 'Wagner',
  getName: () => {
    return `${this.firstName} ${this.lastName}`
  }
}
console.log(author.getName())
// Prints: undefined undefined
// because the parent scope (the scope outside of the author object)
// never defined .firstName and .lastName properties
```

As we can see when we use the **fat arrow function**  syntax, you sometimes get a different this object. 

==this== points to the object on which it is called.

This is due to property how **fat arrow functions** work. With a fat arrow function ==this== will always refer to the same object that its parent scope would. 

Essentially ==this's == value depends on which context it appears - function, class or global. 

### Errors
Gonna catch deez errors.

It's try catch finally. finally is rarely used so we generally use try-catch. 

```js
try {
  //code to run
} catch (err) {
  //if err occurs log it out
  console.log(err.message);
} finally {
  // It will always run. [OPTIONAL]
}
```

Throwing our own error. If we know something bad will happen if the input is of something we know is entered, we can throw an error.
```js
throw new Error('something went wrong');
```

### Runtime
A runtime environment is where your program runs. Since JS can run in many places outside browsers so different runtimes are made.

#### Different runtime
- A Browser
- Nodejs
- A web worker within a browser
- Deno.js
- Bun and many more.

#### Whats different in all these runtime
- Performance
- API - you can use Canvas api to render graphics in browser but can't do those things in node or bun that don't support those.
- Global object - In browsers, global object is ==window== but in node it's ==global==.

[JS Runtimes](https://www.freecodecamp.org/news/javascript-engine-and-runtime-explained/)

