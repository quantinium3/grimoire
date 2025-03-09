i**REDIS** stands for remote dictionary server. It uses the same data data structures as a normal programming languages to create a streamlined process for storing data.

## Understanding Data Types

### Strings
Strings store a sequence of bytes, text, serialized objects, binary arrays, etc

**Example** - store and get a string of data
```plaintext
SET bike:1 "Process 134"
GET bike:1
```

> A good practice is to put data as in format: `<ENTITY>:<ID>` value

[`SET`](https://redis.io/docs/latest/commands/set/) and the [`GET`](https://redis.io/docs/latest/commands/get/) commands are the way we set and retrieve a string value. SET command is will replace any existing value related to that key. So SET performs and assignment.

The ability to set or retrieve the value of multiple keys in a single command is also useful for reduced latency. [`MSET`](https://redis.io/docs/latest/commands/mset/) and [`MGET`](https://redis.io/docs/latest/commands/mget/) are for this. MGET returns an array.

```plaintext
    > mset bike:1 "Deimos" bike:2 "Ares" bike:3 "Vanth"
    OK
    > mget bike:1 bike:2 bike:3
    1) "Deimos"
    2) "Ares"
    3) "Vanth"
```

#### Strings as counters
The [`INCR`](https://redis.io/docs/latest/commands/incr/) command parses the string value as an integer, increments it by one, and finally sets the obtained value as the new value. There are other similar commands like [`INCRBY`](https://redis.io/docs/latest/commands/incrby/), [`DECR`](https://redis.io/docs/latest/commands/decr/) and [`DECRBY`](https://redis.io/docs/latest/commands/decrby/). The INCR command is atomic in nature.

**BASIC COMMANDS**
- [`SET`](https://redis.io/docs/latest/commands/set/) stores a string value.
- [`SETNX`](https://redis.io/docs/latest/commands/setnx/) stores a string value only if the key doesn't already exist. Useful for implementing locks.
- [`GET`](https://redis.io/docs/latest/commands/get/) retrieves a string value.
- [`MGET`](https://redis.io/docs/latest/commands/mget/) retrieves multiple string values in a single operation.
- [`INCR`](https://redis.io/docs/latest/commands/incr/) atomically increments counters stored at a given key by 1.
- [`INCRBY`](https://redis.io/docs/latest/commands/incrby/) atomically increments (and decrements when passing a negative number) counters stored at a given key.
- Another command exists for floating point counters: [`INCRBYFLOAT`](https://redis.io/docs/latest/commands/incrbyfloat/).

> **Limitation** - The max size of value is 512MB.


### JSON
Similar to string, you can store data as JSON in redis.

**Commands** - 
```plaintext
> JSON.SET bike $ '"Hyperion"' // assign value to key
OK
> JSON.GET bike $ // get the value
"[\"Hyperion\"]"
> JSON.TYPE bike $ // get the type
1) "string"
> JSON.STRLEN bike $ // get the length of value
1) (integer) 8
> JSON.STRAPPEND bike $ '" (Enduro bikes)"'  // append to value
1) (integer) 23
> JSON.GET bike $ 
"[\"Hyperion (Enduro bikes)\"]"
> JSON.SET crashes $ 0  // use it as counter
OK
> JSON.NUMINCRBY crashes $ 1
"[1]"
> JSON.NUMINCRBY crashes $ 1.5
"[2.5]"
> JSON.NUMINCRBY crashes $ -0.75
"[1.75]"
> JSON.NUMMULTBY crashes $ 24
"[42]"
> JSON.SET newbike $ '["Deimos", {"crashes": 0}, null]'
OK
> JSON.GET newbike $
"[[\"Deimos\",{\"crashes\":0},null]]"
> JSON.GET newbike $[1].crashes
"[0]"
> JSON.DEL newbike $[-1]
(integer) 1
> JSON.GET newbike $
"[[\"Deimos\",{\"crashes\":0}]]"
> JSON.SET riders $ []
OK
> JSON.ARRAPPEND riders $ '"Norem"'
1) (integer) 1
> JSON.GET riders $
"[[\"Norem\"]]"
> JSON.ARRINSERT riders $ 1 '"Prickett"' '"Royce"' '"Castilla"'
1) (integer) 4
> JSON.GET riders $
"[[\"Norem\",\"Prickett\",\"Royce\",\"Castilla\"]]"
> JSON.ARRTRIM riders $ 1 1
1) (integer) 1
> JSON.GET riders $
"[[\"Prickett\"]]"
> JSON.ARRPOP riders $
1) "\"Prickett\""
> JSON.ARRPOP riders $
1) (nil)
> JSON.SET bike:1 $ '{"model": "Deimos", "brand": "Ergonom", "price": 4972}'
OK
> JSON.OBJLEN bike:1 $
1) (integer) 3
> JSON.OBJKEYS bike:1 $
1) 1) "model"
   2) "brand"
   3) "price"
```

#### JSON path
Redis implements its own way to get elements from a json path.

Here’s the information converted into a **Markdown table**:

| Syntax Element     | Description                                                                                                                                                                                                                                                 |     |     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- |
| `$`                | The root (outermost JSON element), starts the path.                                                                                                                                                                                                         |     |     |
| `.` or `[]`        | Selects a child element.                                                                                                                                                                                                                                    |     |     |
| `..`               | Recursively descends through the JSON document.                                                                                                                                                                                                             |     |     |
| `*`                | Wildcard, returns all elements.                                                                                                                                                                                                                             |     |     |
| `[]`               | Subscript operator, accesses an array element.                                                                                                                                                                                                              |     |     |
| `[,]`              | Union, selects multiple elements.                                                                                                                                                                                                                           |     |     |
| `[start:end:step]` | Array slice where `start`, `end`, and `step` are index values. You can omit values from the slice (e.g., `[3:]`, `[:8:2]`) to use defaults: `start` defaults to the first index, `end` to the last, `step` to 1. Use `[*]` or `[:]` to select all elements. |     |     |
| `?()`              | Filters a JSON object or array. Supports comparison operators`!=`, `<`, `<=`, `>`, `>=`), logical operators (`&&`, `<br>```), and parentheses (`(`, `)`).                                                                                                   |     |     |
| `()`               | Script expression.                                                                                                                                                                                                                                          |     |     |
| `@`                | The current element, used in filter or script expressions.                                                                                                                                                                                                  |     |     |

This table provides a clear and concise overview of the syntax elements and their descriptions. You can use it in your documentation or notes!
#### Limitation

> A JSON value passed to a command can have a depth of up to 128.