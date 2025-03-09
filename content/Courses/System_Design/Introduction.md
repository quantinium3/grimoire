---
id: Introduction
aliases: []
tags: []
title: Introduction
---

## System Design 
It is the process of the defining the elements of a system, as well as their interactions and relationships, in order to satisfy a set of requirements. It focuses on the high level design of the software, including the architecture and components.

### Scalability VS Performance
Lets understand this with and example. Think of a supermarket. We have one cashier(lets name him dan) that can checkout a customer in 1 minute. If we have one customer come every 1 min, then no customer has to wait. This means our supermarket is scalable for one customer. 

Now if two customers come at once. This would lead the second customer to wait 1 minute extra. This is fine but imagine if we have 10 people coming at once(Stonks). This can lead to bad customer experience as they have to wait for longer for their cart to be checked out.

How can we make it better? Add more dans. Now if we add 10 dans, then each of 10 customers can go to each dan and get the cart checked out. We just scaled up our cashier system but the performance of each dan is still the same.

Now what if we replace dan with a robot(dystopia) which can checkout a cart in 15 seconds. Here we increased performance.

- If you have **performance** problem, your system is slow for one user.
- If you have **scalability** problem, your system is fine for one user but not for more.

### Latency VS Throughput
- Latency refers to the amount of time it takes for a system to respond to a request.
- Throughput refers to the number of requests that a system can handle at the same time.
