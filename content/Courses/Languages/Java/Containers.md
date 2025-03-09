---
id: Containers
aliases: []
tags: []
title: Containers
---

## Arrays
An **array** in Java is a container that holds multiple values of the **same data type** in a **fixed-size, contiguous memory location**. 

```java
int[] numbers = new int[5]; // Creates an array of size 5 with default values (0)
int[] nums = {10, 20, 30, 40, 50}; // Declares and initializes an array

numbers[0] = 100;
numbers[1] = 200;
numbers[2] = 300;

System.out.println(numbers[0]); // Output: 100
System.out.println(numbers[2]); // Output: 300

System.out.println(numbers.length); // Output: 3

for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

for (int num : numbers) {
    System.out.println(num);
}

// multi dimensional array
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

System.out.println(matrix[0][1]); // Output: 2

for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}

Arrays.sort(numbers);
System.out.println(Arrays.toString(numbers));
```

## **Default Values in Arrays**
When an array is created with `new`, elements get default values:

| Data Type  | Default Value |
|------------|--------------|
| `int[]`    | `0` |
| `double[]` | `0.0` |
| `char[]`   | `'\u0000'` (null character) |
| `boolean[]` | `false` |
| `String[]` | `null` |

---

## **Arraylists**
`ArrayList` is a **resizable array** implementation in Java, part of the `java.util` package. Unlike arrays, `ArrayList` can grow or shrink dynamically.

```java
ArrayList<Type> listName = new ArrayList<>();
```
```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>(); // Creates an empty ArrayList
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        System.out.println(names); // Output: [Alice, Bob, Charlie]

        System.out.println(names.get(1)); // Output: Bob

        names.set(1, "David");
        System.out.println(names); // Output: [Alice, David, Charlie]
        names.remove(0); // Removes "Alice"
        System.out.println(names.size()); // Output: 2

        for (int i = 0; i < names.size(); i++) {
            System.out.println(names.get(i));
        }

        // range base loop
        for (String name : names) {
            System.out.println(name);
        }

        //using forEach
        names.forEach(System.out::println);

        System.out.println(names.contains("Bob")); // Output: false
        Collections.sort(names) // sorting

        names.clear();
        System.out.println(names); // Output: []
    }
}
```
## **ArrayList vs. Arrays**
| Feature      | Array | ArrayList |
|-------------|-------|-----------|
| Size        | Fixed | Dynamic (Resizable) |
| Performance | Faster | Slightly slower (due to resizing) |
| Type        | Can store primitives | Stores only objects (Wrapper classes for primitives) |
| Flexibility | Low | High (Built-in methods) |

