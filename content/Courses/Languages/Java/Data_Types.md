---
id: Data Types
aliases: []
tags: []
title: Data Types
---

## Data types
Java has eight primitive data types:
### byte
- size - 1 byte (8 bits)
- stores whole number from -128 to 127
```java
byte smallNumber = 100;
```
### short
- size - 2 bytes (16 bits)
- stores value from - 32,768 to 32,767
```java
short mediumNumber = 30000;
```
### int
- size - 4 bytes (32 bits)
- stores values from --2,147,483,648 to 2,147,483,647
```java
int number = 100000;
```
### long
- size - 8 bytes (64 bits)
- stores values from -2^63 to 2^63 - 1
```java
long bigNumber = 9223372036854775807L; // Add 'L' at the end
```
### float
- size - 4 bytes (32 bits)
- stores decimal values with ~7 decimal precision
```java
float decimalNumber = 3.14f; // Add 'f' at the end
```
### double
- size - 8 bytes (64 bits)
- stores decimal values with ~15 decimal precision
```java
double preciseNumber = 3.14159265358979;
```
### char
- size - 2 bytes (16 bits)
- stores a single unicode character.
```java
char letter = 'A';
```
### boolean
- size - 1 bit
```java
boolean yes = true;
```

### default values
| Data Type | Default Value |
|-----------|--------------|
| byte      | 0 |
| short     | 0 |
| int       | 0 |
| long      | 0L |
| float     | 0.0f |
| double    | 0.0d |
| char      | '\u0000' (null character) |
| boolean   | false |

## Variables
A **variable** is a named storage location in memory. It has:
1. **Data type** (primitive or reference type)
2. **Name** (identifier)
3. **Value** (stored data)
```java
int age = 20;        // Declaration + Initialization
double price;        // Declaration only
price = 99.99;       // Assigning a value later
```

### **Variable Naming Rules**
- Can contain **letters, digits, underscores (_) and dollar signs ($)**
- **Cannot** start with a number
- **Cannot** use reserved keywords (e.g., `int`, `class`)
- Java follows **camelCase** naming convention:
```java
  int studentAge = 25;
```
