---
id: Concurrency
aliases: []
tags: []
---

**Concurrent programming**, where different parts of a program execute independently

## Using Threads to run code Simultaneously
In an operating system, most programs are run in a process, and the operating system will manage multiple processes. Within a program, you can have different parts being run by threads.

Concurrent programming can help us improve performance but also adds complexity to the code and can lead to bugs such as race conditions, deadlocks, etc.

### Threads
#### Creating a new thread
To create a new thread, we call the `thread::spawn` function and pass it a closure containing the code we want to run in the new thread.

```rust
use std::thread;
use std::time::Duration;

fn main() {
    thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {i} from the spawned thread!");
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {i} from the main thread!");
        thread::sleep(Duration::from_millis(1));
    }
}
```
> When the main threads exit, all spawn threads must also exit even if they are not finished.

#### Waiting for all threads to finish
we can wait for a spawned thread to not end even if the main thread has finished exiting by using `join` method. The return type of `thread::spawn` is JoinHandle. A JoinHandle is an owned value that, when we call the `join` method on it, it'll wait for the thread to finish.
```rust
use std::thread;
use std::time::Duration;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..10 {
            println!("hi number {i} from the spawned thread!");
            thread::sleep(Duration::from_millis(1));
        }
    });

    for i in 1..5 {
        println!("hi number {i} from the main thread!");
        thread::sleep(Duration::from_millis(1));
    }

    handle.join().unwrap();
}
```

#### Using move closures with threads
the `move` keyword is used in closures to indicate that the closure should take ownership of the variables it captures from its surrounding environment.

```rust
use std::thread;

fn main() {
    let v = vec![1, 2, 3];

    let handle = thread::spawn(move || {
        println!("Here's a vector: {v:?}");
    });

    handle.join().unwrap();
}
```
we use the `move` keyword to pass the ownership of `v` to the new thread. The vector needs to be moved into the new thread as to make sure that the vector is being modified at one place. Since keeping it in the main thread and passing a reference in the new thread can cause bugs, therefore we transfer the ownership of `v` to the spawned thread.

## Using Message Passing
One increasingly popular approach to safe concurrency is message passing, where threads or actors communicate by sending each other messages containing data.

To accomplish this we use channels. A channel has two halves: a transmitter and receiver.

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {received}");
}
```

- we create a new channel using `mpsc::channel` function. `mpsc - multiple producer, single customer`. The mpsc channel returns a tuple, `(tx, rx)` - (transmitter, receiver)
- The transmitter has a `send` method that takes the value we want to send which returns a `Result<T, E>`.
- The receiver has two useful methods: `recv` and `try_recv`.

### **`recv` Method**
The `recv` method blocks the current thread until a message is received from the channel. If no message is available, the thread will wait indefinitely until a message is sent.

- **Blocking**: The thread is blocked until a message is received.
- **Result**: Returns a `Result<T, RecvError>`. If a message is received, it returns `Ok(message)`. If the sender is dropped and no more messages will be sent, it returns `Err(RecvError)`.

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("Hello");
        tx.send(val).unwrap();
    });

    // Block until a message is received
    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

### **`try_recv` Method**
The `try_recv` method attempts to receive a message from the channel without blocking. If no message is available, it returns immediately with an error instead of waiting.

- **Non-blocking**: The thread is not blocked. If no message is available, it returns immediately.
- **Result**: Returns a `Result<T, TryRecvError>`. If a message is received, it returns `Ok(message)`. If no message is available, it returns `Err(TryRecvError::Empty)`. If the sender is dropped and no more messages will be sent, it returns `Err(TryRecvError::Disconnected)`.

#### Example:
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        thread::sleep(Duration::from_secs(1)); // Simulate some work
        let val = String::from("Hello");
        tx.send(val).unwrap();
    });

    loop {
        match rx.try_recv() {
            Ok(message) => {
                println!("Got: {}", message);
                break;
            }
            Err(mpsc::TryRecvError::Empty) => {
                println!("No message yet, doing other work...");
                thread::sleep(Duration::from_millis(200)); // Simulate other work
            }
            Err(mpsc::TryRecvError::Disconnected) => {
                println!("Sender dropped, no more messages.");
                break;
            }
        }
    }
}
```
#### **Channels and Ownership:**
- Channels in Rust (`mpsc`) allow threads to send and receive messages.
- When you send a value through a channel using `tx.send(val)`, **ownership of the value is transferred** to the receiver.
- This means you can't use the value after sending it, as it no longer belongs to the sender.

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap(); // Ownership of `val` is transferred to the receiver
        println!("val is {val}"); // Error! `val` is no longer valid here
    });

    let received = rx.recv().unwrap();
    println!("Got: {received}");
}
```

#### **Sending Multiple Values:**
- You can send multiple values through a channel, and the receiver can process them one by one.
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx.send(val).unwrap(); // Send each value
            thread::sleep(Duration::from_secs(1)); // Pause between sends
        }
    });

    for received in rx {
        println!("Got: {received}"); // Print each received value
    }
}
```

#### **Multiple Producers:**
- You can have multiple threads sending messages to the same receiver by cloning the transmitter (`tx`).
```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx1 = tx.clone(); // Clone the transmitter

    // First thread
    thread::spawn(move || {
        let vals = vec![
            String::from("hi"),
            String::from("from"),
            String::from("the"),
            String::from("thread"),
        ];

        for val in vals {
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    // Second thread
    thread::spawn(move || {
        let vals = vec![
            String::from("more"),
            String::from("messages"),
            String::from("for"),
            String::from("you"),
        ];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_secs(1));
        }
    });

    for received in rx {
        println!("Got: {received}");
    }
}
```

## Shared-State Concurrency
Shared memory concurrency is like multiple ownership: multiple threads can access the same memory location at the same time. 

### Using mutexes to allow access to data from one thread at a time.
Mutex (mutual exclusion) allows one thread to access some data at any given time. This is done using locks which signals that the thread want to access that data. This can really help in creating race conditions and deadlocks.

If we have to access a data, we put a lock on it and when you're done with the data that mutex guards, you must unlock it for other threads to use it.

#### API of Mutex<T>
```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }

    println!("m = {m:?}");
}
```
We create a `Mutex<T>` with the `new` function. We use the lock method that returns a smart pointer called `MutexGuard`, wrapped in a `LockResult` that we handled with the call to unwrap. The `MutexGuard` implements `Deref` to point to out inner data and `Drop` trait to release the lock automatically when it goes goes out of scope.

### Sharing a `Mutex<T>` Between Multiple Threads using `Arc<T>`
`Arc<T>` is a reference counter like `Rc<T>` but is atomic in nature ie it's an atomically reference counted type.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

> `Rc<T>` came with the risk of creating reference cycles, where two `Rc<T>` came with the risk of creating reference cycles which may cause memory leaks. Similarly `Mutex<T>` comes with the risk of creating deadlocks.
