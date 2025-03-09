---
id: Garbage Collection
aliases: []
tags: []
title: Garbage Collection
---

### What is Garbage Collection?
Garbage collection (GC) is an automatic memory management feature in many programming languages. It’s the process of identifying and freeing up memory that’s no longer in use by a program—essentially cleaning up “garbage” objects so that memory can be reused. This saves developers from manually allocating and deallocating memory (like in C or C++).

In short: GC finds objects you’re done with and reclaims their memory for you.

### Why Do We Need It?
When you create objects (e.g., with `new` in Java), they take up space in the **heap**—a region of memory for dynamic allocation. If you stop using an object (say, by losing all references to it), that memory doesn’t free itself automatically. Without garbage collection:
- You’d have to manually deallocate memory (error-prone and tedious).
- Unused objects would pile up, leading to **memory leaks**—where memory is occupied but inaccessible, eventually crashing your program.

GC automates this cleanup, making coding easier and safer.

### How Does Garbage Collection Work?
Garbage collection typically involves two main steps:
1. **Identifying garbage**: Finding objects that are no longer reachable.
2. **Reclaiming memory**: Freeing up the space those objects occupied.

#### Key Concept: Reachability
An object is “reachable” if there’s a way to get to it from a **root**—a starting point like:
- Local variables on the stack (e.g., in a method).
- Static variables in a class.
- References held by active threads.

If an object can’t be reached from any root through a chain of references, it’s **unreachable** and considered garbage.

```java
public class Example {
    public static void main(String[] args) {
        Object obj = new Object();  // obj references a new object
        obj = null;                // No references to the object remain
        // At this point, the object is unreachable and eligible for GC
    }
}
```
- Initially, `obj` points to an object in the heap.
- After `obj = null`, no references point to that object—it’s garbage.

#### The Process (Simplified)
1. **Mark**: The garbage collector scans the heap, starting from roots, and marks all reachable objects.
2. **Sweep**: It then sweeps through the heap and reclaims memory from unmarked (unreachable) objects.
3. **Compact (optional)**: Some GCs move remaining objects to reduce fragmentation, making future allocations more efficient.


### Garbage Collection in Java
Java’s garbage collector is built into the Java Virtual Machine (JVM) and runs automatically. Here’s how it plays out:

#### The Heap
- Java’s heap is divided into regions:
  - **Young Generation**: New objects go here (split into Eden and Survivor spaces).
  - **Old Generation**: Long-lived objects get promoted here.
  - **Metaspace**: Class metadata (not technically garbage-collected in the same way).
- GC is generational: it assumes most objects die young (short-lived) and optimizes for that.

#### Types of GC in Java
- **Minor GC**: Cleans the Young Generation (fast, frequent).
- **Major GC**: Cleans the Old Generation (slower, less frequent).
- **Full GC**: Cleans the entire heap (slowest, rare).

#### When Does GC Run?
- The JVM decides, based on heap usage or memory pressure.
- You can’t force GC directly, but `System.gc()` suggests it (not guaranteed).

### How Does It Know What’s Garbage?
Java uses a **reference counting** idea conceptually, but modern GCs rely on **tracing**:
- **Reference Counting**: Each object tracks how many references point to it (used in Python, not Java). If it hits zero, it’s garbage. Problem: Can’t detect cycles (e.g., A points to B, B points to A, but no one else points to them).
- **Tracing**: Java’s approach. Starts from roots and follows all references. Anything not visited is garbage, even in cycles.

#### Cycle Example
```java
public class Node {
    Node next;

    public static void main(String[] args) {
        Node a = new Node();
        Node b = new Node();
        a.next = b;
        b.next = a;  // Circular reference
        a = null;
        b = null;  // Both are unreachable despite the cycle
        // GC will still collect them
    }
}
```
- Even though `a` and `b` reference each other, no root points to them—GC reclaims them.

---

### Advantages of Garbage Collection
1. **No manual memory management**: No `malloc`/`free` like in C.
2. **Prevents leaks**: Automatically cleans up unused objects.
3. **Safer**: Avoids dangling pointers or double-free errors.

---

### Disadvantages
1. **Performance overhead**: GC pauses the program briefly to run (though modern GCs minimize this).
2. **Unpredictable timing**: You don’t control when it happens.
3. **Memory usage**: May hold onto memory longer than necessary until GC kicks in.

---

### Controlling GC (Sort Of)
- **Finalize**: Deprecated in Java 9+, but historically, you could override `finalize()` to run code before an object is collected (unreliable).
- **Weak References**: Use `WeakReference` for objects you’re okay with GC collecting early.
- **Tuning**: JVM flags (e.g., `-Xmx`, `-XX:+UseG1GC`) let you adjust heap size or GC algorithm (e.g., G1, CMS).

#### Weak Reference Example
```java
import java.lang.ref.WeakReference;

public class Main {
    public static void main(String[] args) {
        Object obj = new Object();
        WeakReference<Object> weakRef = new WeakReference<>(obj);
        obj = null;  // Only weak reference remains
        System.gc(); // Suggest GC
        System.out.println(weakRef.get());  // Likely null if GC ran
    }
}
```
- `weakRef` doesn’t prevent GC; the object can be collected if no strong references exist.

