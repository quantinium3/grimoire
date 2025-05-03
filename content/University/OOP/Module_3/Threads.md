---
id: Threads
aliases: []
tags: []
title: Threads
---

### 1. **Introduction to Multithreading**

**Multithreading** is the ability of a program to execute multiple threads concurrently, allowing tasks to run in parallel within the same process. A **thread** is a lightweight unit of execution, and multithreading improves performance, responsiveness, and resource utilization.

- **Key Concepts**:
  - A **process** is an executing program with its own memory space.
  - A **thread** is a subset of a process, sharing the same memory and resources.
  - Multithreading enables tasks like UI updates, background processing, and parallel computations.

- **Advantages**:
  - Improved performance on multi-core processors.
  - Better resource sharing (threads share memory).
  - Enhanced responsiveness (e.g., GUI remains active while processing).
  - Simplified modeling of concurrent tasks.

- **Challenges**:
  - **Race conditions**: When multiple threads access shared resources unpredictably.
  - **Deadlocks**: When threads wait indefinitely for each other.
  - **Thread safety**: Ensuring shared data is accessed correctly.

- **Java’s Role**:
  - Java provides built-in support for multithreading via the `java.lang.Thread` class and `java.lang.Runnable` interface.
  - The Java Virtual Machine (JVM) manages thread scheduling and execution.

---

### 2. **The Main Thread**

The **main thread** is the primary thread of execution in a Java program, automatically created by the JVM when the program starts.

- **Key Points**:
  - Entry point: The `main` method (`public static void main(String[] args)`).
  - Responsible for executing the program’s initial code.
  - Can create and manage other threads.
  - Program terminates when the main thread (and all non-daemon threads) finishes.

- **Accessing the Main Thread**:
  - Use `Thread.currentThread()` to get the current thread (main thread in the `main` method).
  - Example:
    ```java
    package com.example.myapp;
    public class MainThreadDemo {
        public static void main(String[] args) {
            Thread mainThread = Thread.currentThread();
            System.out.println("Main thread: " + mainThread.getName());
            System.out.println("Priority: " + mainThread.getPriority());
        }
    }
    ```
    **Output**:
    ```
    Main thread: main
    Priority: 5
    ```

- **Key Methods**:
  - `getName()`: Returns the thread’s name (default: “main”).
  - `setName(String name)`: Sets a custom name.
  - `getPriority()`: Returns the thread’s priority.
  - `isAlive()`: Checks if the thread is running.

- **Relevance**:
  - The main thread is the starting point for creating other threads.
  - Exceptions in the main thread (if unhandled) terminate the program.

---

### 3. **Java Thread Model**

Java’s thread model defines how threads are created, managed, and executed. It is built around the `Thread` class and `Runnable` interface, with support for thread lifecycle, scheduling, and synchronization.

- **Creating Threads**:
  1. **Extend `Thread` Class**:
     - Override the `run()` method.
     - Example:
       ```java
       package com.example.myapp;
       public class MyThread extends Thread {
           public void run() {
               System.out.println("Thread running: " + getName());
           }
           public static void main(String[] args) {
               MyThread t1 = new MyThread();
               t1.start(); // Starts the thread
           }
       }
       ```
  2. **Implement `Runnable` Interface** (Preferred):
     - Implement the `run()` method.
     - Pass the `Runnable` object to a `Thread` constructor.
     - Example:
       ```java
       package com.example.myapp;
       public class MyRunnable implements Runnable {
           public void run() {
               System.out.println("Runnable running: " + Thread.currentThread().getName());
           }
           public static void main(String[] args) {
               MyRunnable r = new MyRunnable();
               Thread t1 = new Thread(r, "RunnableThread");
               t1.start();
           }
       }
       ```
     - **Why Preferred?**: Allows the class to extend another class and promotes better design (separation of task and thread).

- **Thread Lifecycle**:
  - **New**: Thread created but not started (`new Thread()`).
  - **Runnable**: Thread is ready to run after `start()` is called (may be running or waiting for CPU).
  - **Blocked/Waiting**: Thread is waiting for a monitor lock (e.g., in `synchronized` block) or explicitly waiting (`wait()`, `sleep()`).
  - **Timed Waiting**: Thread is waiting for a specified time (`sleep(millis)`, `wait(millis)`).
  - **Terminated**: Thread has completed execution or stopped (`run()` finishes or exception occurs).

- **Key Methods**:
  - `start()`: Begins thread execution; calls `run()`.
  - `run()`: Contains the thread’s task (override in `Thread` or implement in `Runnable`).
  - `sleep(long millis)`: Pauses the thread for the specified time.
  - `join()`: Makes the calling thread wait for this thread to finish.
  - `interrupt()`: Interrupts the thread (e.g., to stop a sleeping thread).

- **Thread States**:
  - Use `Thread.getState()` to check the state (e.g., `NEW`, `RUNNABLE`, `TERMINATED`).

- **Example with Lifecycle**:
  ```java
  package com.example.myapp;
  public class ThreadDemo implements Runnable {
      public void run() {
          try {
              System.out.println("Thread sleeping");
              Thread.sleep(1000);
              System.out.println("Thread awake");
          } catch (InterruptedException e) {
              System.out.println("Thread interrupted");
          }
      }
      public static void main(String[] args) throws InterruptedException {
          Thread t1 = new Thread(new ThreadDemo());
          System.out.println("State: " + t1.getState()); // NEW
          t1.start();
          System.out.println("State: " + t1.getState()); // RUNNABLE
          t1.join();
          System.out.println("State: " + t1.getState()); // TERMINATED
      }
  }
  ```

- **Java’s Thread Model Features**:
  - **Preemptive Scheduling**: JVM assigns CPU time to threads based on priority and scheduling.
  - **Platform Independence**: Java threads are managed by the JVM, not the OS directly.
  - **Daemon Threads**: Background threads (e.g., garbage collector) that terminate when all non-daemon threads finish. Set with `setDaemon(true)` before `start()`.

---

### 4. **Thread Priorities**

**Thread priorities** determine the relative importance of threads, influencing the order in which the JVM schedules them for execution.

- **Key Points**:
  - Priorities range from `Thread.MIN_PRIORITY` (1) to `Thread.MAX_PRIORITY` (10), with `Thread.NORM_PRIORITY` (5) as the default.
  - Higher-priority threads are scheduled before lower-priority ones, but this is **not guaranteed** (depends on the OS and JVM).
  - Use sparingly, as over-reliance on priorities can lead to platform-dependent behavior.

- **Methods**:
  - `setPriority(int priority)`: Sets the thread’s priority.
  - `getPriority()`: Returns the thread’s priority.

- **Example**:
  ```java
  package com.example.myapp;
  public class PriorityDemo {
      public static void main(String[] args) {
          Thread t1 = new Thread(() -> System.out.println("Low priority thread"));
          Thread t2 = new Thread(() -> System.out.println("High priority thread"));
          t1.setPriority(Thread.MIN_PRIORITY); // 1
          t2.setPriority(Thread.MAX_PRIORITY); // 10
          t1.start();
          t2.start();
      }
  }
  ```
  - **Output**: Order is not guaranteed, but `t2` is likely to run first due to higher priority.

- **Best Practices**:
  - Avoid heavy reliance on priorities; use synchronization for critical tasks.
  - Test threading behavior across platforms, as scheduling varies.

---

### 5. **Synchronization in Java**

**Synchronization** ensures that only one thread can access a shared resource at a time, preventing race conditions and ensuring thread safety.

- **Why Needed?**:
  - Multiple threads accessing shared data (e.g., a counter) can lead to inconsistent results.
  - Example (Race Condition):
    ```java
    package com.example.myapp;
    public class Counter {
        private int count = 0;
        public void increment() {
            count++; // Not thread-safe
        }
        public int getCount() {
            return count;
        }
        public static void main(String[] args) throws InterruptedException {
            Counter counter = new Counter();
            Runnable task = () -> {
                for (int i = 0; i < 1000; i++) {
                    counter.increment();
                }
            };
            Thread t1 = new Thread(task);
            Thread t2 = new Thread(task);
            t1.start();
            t2.start();
            t1.join();
            t2.join();
            System.out.println("Count: " + counter.getCount()); // May not be 2000
        }
    }
    ```

- **Synchronization Mechanisms**:
  1. **Synchronized Method**:
     - Add the `synchronized` keyword to a method to lock the object’s monitor.
     - Example:
       ```java
       public synchronized void increment() {
           count++;
       }
       ```
  2. **Synchronized Block**:
     - Lock a specific object or block of code.
     - Example:
       ```java
       public void increment() {
           synchronized(this) {
               count++;
           }
       }
       ```
  3. **Static Synchronization**:
     - Use `synchronized` on static methods or blocks to lock the class’s monitor.
     - Example:
       ```java
       public static synchronized void staticMethod() {
           // Thread-safe
       }
       ```

- **Thread-Safe Counter Example**:
  ```java
  package com.example.myapp;
  public class Counter {
      private int count = 0;
      public synchronized void increment() {
          count++;
      }
      public int getCount() {
          return count;
      }
      public static void main(String[] args) throws InterruptedException {
          Counter counter = new Counter();
          Runnable task = () -> {
              for (int i = 0; i < 1000; i++) {
                  counter.increment();
              }
          };
          Thread t1 = new Thread(task);
          Thread t2 = new Thread(task);
          t1.start();
          t2.start();
          t1.join();
          t2.join();
          System.out.println("Count: " + counter.getCount()); // Always 2000
      }
  }
  ```

- **Key Points**:
  - Synchronization uses a **monitor** (lock) to ensure mutual exclusion.
  - Only one thread can hold the monitor at a time.
  - Over-synchronization can reduce performance (use minimal synchronized blocks).
  - Use `synchronized` blocks for fine-grained control.

- **Connection to Exception Handling**:
  - Synchronization may involve exceptions (e.g., `InterruptedException` in `wait()`).
  - Example: Handle `InterruptedException` in synchronized code (see Interthread Communication).

---

### 6. **Interthread Communication**

**Interthread communication** allows threads to coordinate by signaling each other, typically using `wait()`, `notify()`, and `notifyAll()`. This is more efficient than polling (e.g., checking a flag repeatedly).

- **Key Methods** (Defined in `Object` class):
  - `wait()`: Causes the current thread to wait (release the monitor) until another thread calls `notify()` or `notifyAll()` on the same object.
  - `notify()`: Wakes up one waiting thread.
  - `notifyAll()`: Wakes up all waiting threads.
  - These methods must be called within a `synchronized` block or method.

- **Example (Producer-Consumer Problem)**:
  ```java
  package com.example.myapp;
  import java.util.LinkedList;
  import java.util.Queue;
  public class ProducerConsumer {
      private Queue<Integer> queue = new LinkedList<>();
      private final int LIMIT = 10;
      public synchronized void produce(int item) throws InterruptedException {
          while (queue.size() == LIMIT) {
              wait(); // Wait if queue is full
          }
          queue.add(item);
          System.out.println("Produced: " + item);
          notify(); // Notify consumer
      }
      public synchronized int consume() throws InterruptedException {
          while (queue.isEmpty()) {
              wait(); // Wait if queue is empty
          }
          int item = queue.remove();
          System.out.println("Consumed: " + item);
          notify(); // Notify producer
          return item;
      }
      public static void main(String[] args) {
          ProducerConsumer pc = new ProducerConsumer();
          Thread producer = new Thread(() -> {
              try {
                  for (int i = 1; i <= 5; i++) {
                      pc.produce(i);
                      Thread.sleep(100);
                  }
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          });
          Thread consumer = new Thread(() -> {
              try {
                  for (int i = 1; i <= 5; i++) {
                      pc.consume();
                      Thread.sleep(200);
                  }
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          });
          producer.start();
          consumer.start();
      }
  }
  ```
  **Output** (Example):
  ```
  Produced: 1
  Consumed: 1
  Produced: 2
  Consumed: 2
  Produced: 3
  ...
  ```

- **Key Points**:
  - `wait()`, `notify()`, and `notifyAll()` require the thread to own the object’s monitor (i.e., be in a `synchronized` block).
  - Use `while` loops (not `if`) to check conditions after `wait()` to handle spurious wakeups.
  - `InterruptedException` must be handled when using `wait()` or `sleep()`.
  - `notifyAll()` is safer than `notify()` when multiple threads are waiting.

- **Alternatives**:
  - Java’s `java.util.concurrent` package provides high-level constructs like `BlockingQueue`, `ExecutorService`, and `Lock` for better thread coordination.
  - Example: Use `ArrayBlockingQueue` instead of manual `wait()/notify()`.

---

### **Practice Program**:
   ```java
   package com.example.myapp;
   public class ThreadTest {
       private static int sharedCounter = 0;
       public static synchronized void increment() {
           sharedCounter++;
       }
       public static void main(String[] args) throws InterruptedException {
           Runnable task = () -> {
               for (int i = 0; i < 1000; i++) {
                   increment();
               }
           };
           Thread t1 = new Thread(task, "Thread1");
           Thread t2 = new Thread(task, "Thread2");
           t1.setPriority(Thread.MAX_PRIORITY);
           t2.setPriority(Thread.MIN_PRIORITY);
           t1.start();
           t2.start();
           t1.join();
           t2.join();
           System.out.println("Final counter: " + sharedCounter); // 2000
       }
   }
   ```

   **Compile and Run**:
   ```bash
   javac com/example/myapp/ThreadTest.java
   java -cp . com.example.myapp.ThreadTest
   ```
