---
id: redis
aliases: []
tags: []
---

**Redis** (Remote Dictionary Server) is an open-source, in-memory data structure store, used as a database, cache, and message broker. It is known for its high performance, flexibility, and rich set of features.

### Key features
- **In-Memory Storage**: Redis primarily stores data in memory, which allows for extremely fast read and write operations. This makes it ideal for use cases where low latency is critical, such as caching, session storage, and real-time analytics.
- **Persistence**: Although Redis is an in-memory store, it provides options for persistence. You can configure Redis to periodically save snapshots of the dataset to disk (RDB persistence) or log every write operation to an append-only file (AOF persistence). This ensures data durability even in the event of a system crash.
  - **Data Structures**: Redis supports a variety of data structures, including: 
  - **Strings**: Simple key-value pairs.
  - **Hashes**: Maps between string fields and string values, useful for representing objects.
  - **Lists**: Collections of strings sorted by insertion order.
  - **Sets**: Unordered collections of unique strings.
  - **Sorted **Sets: Sets where each element is associated with a score, allowing for range queries.
  - **Bitmaps**: Efficiently store and manipulate binary data.
  - **HyperLogLogs**: Probabilistic data structure for estimating the cardinality of a set.
  - **Geospatial Indexes**: Store and query geographic coordinates.
  - **Atomic Operations**: Redis supports atomic operations on its data structures, which means that complex operations can be executed without the risk of race conditions. For example, you can increment a value, push to a list, or add to a set atomically	

