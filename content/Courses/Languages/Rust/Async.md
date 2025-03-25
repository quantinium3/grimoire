---
id: Async
aliases: []
tags: []
title: Async
---

## Futures and Async Rust
The Key elements of asynchronous programming in Rust are futures and Rust's `async` and `await` keywords.

A future is a value that may not be ready now but will become ready at some point in the future. Rust provides a `Future` trait as a building block so that different async operations can be implemented with different data structures but with a common interface.

