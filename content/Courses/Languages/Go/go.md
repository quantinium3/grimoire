---
id: Go
aliases: []
tags: []
---

## Hello World

```go
package main
import "fmt"
func main() {
	fmt.Println("hello world")
}
```
## Basic Data types
```go
bool

string

int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // alias for uint8

rune // alias for int32
     // represents a Unicode code point

float32 float64

complex64 complex128
```

## Declaring a varible
```go
var message string = "Hello" // specifically assigning message as string and it is a variable.
message := "hello" // letting the compiler choose type of message according to whats on the right.

mileage, company := 8029, "Toyota"
// the above is similar to
mileage := 8029
company := "Toyota"

```

## Type conversion
```go
temperatureFloat := 88.26
temperatureInt := int64(temperatureFloat)

```

## Conditional
```go
if height > 6 {
    fmt.Println("You are super tall!")
} else if height > 4 {
    fmt.Println("You are tall enough!")
} else {
    fmt.Println("You are not tall enough!")
}
```

```go
if INITIAL_STATEMENT; CONDITION {
}

if length := getLength(email); length < 1 {
    fmt.Println("Email is invalid")
}

```
## Functions

```go
func sub(x int, y int) int {
  return x-y
}
```

Ignoring return values

```go
func getPoint() (x int, y int) {
  return 3, 4
}

// ignore y value
x, _ := getPoint()
```

### Variadic functions
Many functions, especially those in std library, can take an abitrary number of final arguments. This is accomplished by using "..." syntax in function signature.

```go
func concat(strs ...string) string {
    final := ""
    // strs is just a slice of strings
    for i := 0; i < len(strs); i++ {
        final += strs[i]
    }
    return final
}

func main() {
    final := concat("Hello ", "there ", "friend!")
    fmt.Println(final)
    // Output: Hello there friend!
}
```

==fmt.Println== and ==fmt.Sprintf== both are variadic function as we can pass as many arguments in them as we want.

## Structs
```go
type car struct {
  make string
  model string
  doors int
  mileage int
  frontWheel wheel
  backWheel wheel
}

type wheel struct {
  radius int
  material string
}

myCar := car{}
myCar.frontWheel.radius = 5 // Use dot operator to access fields of a struct
```
### Struct Methods
```go
type rect struct {
  width int
  height int
}

// area has a receiver of (r rect)
// rect is the struct
// r is the placeholder
func (r rect) area() int {
  return r.width * r.height
}

var r = rect{
  width: 5,
  height: 10,
}

fmt.Println(r.area())
// prints 50
```

## Interfaces
[Interface](https://go.dev/tour/methods/9)  is defined as a set of method signatures.

```go
type shape interface {
  area() float64
  perimeter() float64
}

type rect struct {
    width, height float64
}
func (r rect) area() float64 {
    return r.width * r.height
}
func (r rect) perimeter() float64 {
    return 2*r.width + 2*r.height
}

type circle struct {
    radius float64
}
func (c circle) area() float64 {
    return math.Pi * c.radius * c.radius
}
func (c circle) perimeter() float64 {
    return 2 * math.Pi * c.radius
}
```

Name your interface for better understanding==
```go
type Copier interface {
  Copy(string, string) int
}
type Copier interface { // This is easier to understand than the above one.
  Copy(sourceFile string, destinationFile string) (bytesCopied int)
}
```
### Type Assertions
A type assertion provides access to an interface value underlying concrete value.

```go
t := i.(T) // This statement asserts that the interface value i holds the concrete type T and assigns the underlying T value to the variable t.
```

If ==i== doesn't hold a ==T==, the statement will trigger a panic.

To test where an interface value holds a specific type, a type assertion can return two values. ==Value== and ==Bool== that tells if the assertion succeeded.
```go
t, ok := i.(T)
```

If i holds a T, then t will be the underlying value and ==ok== will be true and thus we can explicitly give an error out.

### Type switches
A [type switch](https://go.dev/tour/methods/16) is a construct that permits several type assertion in series.

```go
switch v := i.(type) {
case T:
    // here v has type T
case S:
    // here v has type S
default:
    // no match; here v has the same type as i
}
```

Some things to remember:
- Keep interface small and concise.
- Interfaces should have no knowledge of satisfying types.
- Interfaces are not classes.

## Error
When something goes wrong inside a function, it should return a error value as it's last param. The programmer can thus check it by comparing it to ==nil== if the error occurred.

```go
// Atoi converts a stringified number to an integer
i, err := strconv.Atoi("42b")
if err != nil {
    fmt.Println("couldn't convert:", err)
    // because "42b" isn't a valid integer, we print:
    // couldn't convert: strconv.Atoi: parsing "42b": invalid syntax
    // Note:
    // 'parsing "42b": invalid syntax' is returned by the .Error() method
    return
}
// if we get here, then
// i was converted successfully
```

### Error interface
Because errors are interfaces, you can build your own custom types that implement the error interface.
```go
type userError struct {
    name string
}

func (e userError) Error() string {
    return fmt.Sprintf("%v has a problem with their account", e.name)
}
```
```c
func sendSMS(msg, userName string) error {
    if !canSendToUser(userName) {
        return userError{name: userName}
    }
    ...
}
```

### Error Package
The Go standard library has a [=="errors"==](https://pkg.go.dev/errors) package.

## Loops
```go
for INITIAL; CONDITION; AFTER{ // C-style loops without the parenthesis.
  // do something
}
```
go doesn't have any while loop

It's just:
```go
for CONDITION {
  // do some stuff while CONDITION is true
}
```
## Arrays
Same as C-arrays with type at the end instead of the start.
```go
var myInts [10]int
primes := [6]int{2, 3, 5, 7, 11, 13}
```

### Slices
Dynamically allocated array. Empty slice is nil.
Slices always have an underlying array, though it isn't always specified explicitly.  To explicitly create a slice over an array, we do this:
```go
primes := [6]int{2, 3, 5, 7, 11, 13}
mySlice := primes[1:4]
// mySlice = {3, 5, 7}

// arrayname[lowIndex:highIndex]
// arrayname[lowIndex:]
// arrayname[:highIndex]
// arrayname[:]

// lower index is inclusive but the high index is exclusive.
```

### Make
Most of the time since we don't need to think about the underlying array of the slice. We can create a new slice using the [make](https://pkg.go.dev/builtin#make) function
```go
// func make([]T, len, cap) []T
mySlice := make([]int, 5, 10)

// the capacity argument is usually omitted and defaults to the length
mySlice := make([]int, 5)
```

### Spread Operator
The spread(...) operator allows us to pass a slice into a variadic function.

```go
func printStrings(strings ...string) {
	for i := 0; i < len(strings); i++ {
		fmt.Println(strings[i])
	}
}

func main() {
    names := []string{"bob", "sue", "alice"}
    printStrings(names...)
}
```

### Append
```go
func append(slice []Type, elems ...Type) []Type
```
You should append things to the same slice.
```go
mySlice := []int{1, 2, 3}
mySlice = append(mySlice, 4)
```
### Slices of slices - 2D matrix
```go
rows := [][]int{}
```

### Range based loop
Go provides syntactic sugar to iterate easily over elements of slice.
```go
for INDEX, ELEMENT := range SLICE {
}
```
```c
fruits := []string{"apple", "banana", "grape"}
for i, fruit := range fruits {
    fmt.Println(i, fruit)
}
// 0 apple
// 1 banana
// 2 grape
```

## Maps
Maps are like pythons dicts, javascript's objects. In other sense key-value pairs. Hash map.
Empty map is equal to ==nil==.

```go
ages := make(map[string]int)
ages["John"] = 37
ages["Mary"] = 24
ages["Mary"] = 21 // overwrites 24
```

```go
ages = map[string]int{
  "John": 37,
  "Mary": 21,
}
```

### Insert an element
> m[key] = elem

### Get an element
> elem = m[key]

### Delete an element
> delete(m, key)

### Check if key exists
> elem, ok := m[key]

### Nested maps
```go
map[string]map[string]int
map[rune]map[string]int
map[int]map[string]map[string]int
```

## Advanced Functions
### Currying
Curryied function are those function with more than one argument that can wait for an argument unlike normal function that require all arguments before calling.

It allows a function with multiple arguments to be transformed into a sequence of functions, each taking a single argument.

Although proper currying is not possible in go we can simulate it.
```haskell
add x = /y -> x + y   currying function in haskell. add function wait for y and then proceed to give x + y.
```
To understand currying properly. refer to [[Currying.md]]
```go
func main() {
  squareFunc := selfMath(multiply)
  doubleFunc := selfMath(add)

  fmt.Println(squareFunc(5))
  // prints 25

  fmt.Println(doubleFunc(5))
  // prints 10
}

func multiply(x, y int) int {
  return x * y
}

func add(x, y int) int {
  return x + y
}

func selfMath(mathFunc func(int, int) int) func (int) int {
  return func(x int) int {
    return mathFunc(x, x)
  }
}
```
### Defer
The ==defer== keyword allows a function to be executed automatically just before its enclosing function returns. 

Usually its for cleanup like closing files, releasing resources, etc when a function is finished executing.

```go
func main() {
    fmt.Println("Opening file...")
    file, err := os.Open("example.txt")
    if err != nil {
        fmt.Println("Error opening file:", err)
        return
    }
    defer file.Close() // Ensure the file is closed when main exits

    fmt.Println("Reading file...")
    // Assume some file reading operations here

    fmt.Println("File reading completed.")
}
```

### Closures
A closure is a function value that references variables from outside its body. The function may access and modify the variables within its scope even after the outer function has finished executing.
```go
func concatter() func(string) string {
	doc := ""
	return func(word string) string {
		doc += word + " "
		return doc
	}
}

func main() {
	harryPotterAggregator := concatter()
	harryPotterAggregator("Mr.")
	harryPotterAggregator("and")
	harryPotterAggregator("Mrs.")
	harryPotterAggregator("Dursley")
	harryPotterAggregator("of")
	harryPotterAggregator("number")
	harryPotterAggregator("four,")
	harryPotterAggregator("Privet")

	fmt.Println(harryPotterAggregator("Drive"))
	// Mr. and Mrs. Dursley of number four, Privet Drive
}
```

### Anonymous Functions
Anonymous function are those function that have no name.
They are useful when defining a function that will only return once or while defining a quick closure.

```go
// doMath accepts a function that converts one int into another
// and a slice of ints. It returns a slice of ints that have been
// converted by the passed in function.
func doMath(f func(int) int, nums []int) []int {
	var results []int
	for _, n := range nums {
		results = append(results, f(n))
	}
	return results
}

func main() {
	nums := []int{1, 2, 3, 4, 5}
	
    // Here we define an anonymous function that doubles an int
    // and pass it to doMath
	allNumsDoubled := doMath(func(x int) int {
	    return x + x
	}, nums)
	
	fmt.Println(allNumsDoubled)
    // prints:
    // [2 4 6 8 10]
}

```
## Pointers 
Points to a memory address.

```go
var p *int
myString := "hello"
myStringPtr := &myString
```
**Go has no pointer arithmetic**

## Local Development

### Packages
Every Go program is made up of packages.
A package named main has an entrypoint at the ==main()== function. A main package is being compiled into an executable programming.

When naming a Go package, it's name is generally same as the name of the file. If i wanted to make a go package to create a random number. I can write ==package rnd== but it's preferred to write ==package rand==.

A directory of a go code must have **at most** one package. All the ==.go== file in a single directory must belong to one package.

### Modules
A file name ==go.mod== at root of the project declares the module. It contains:
- Module Path -  It not only servers as an import path prefix for package within but also where the go command should look to download it. Like ==require github.com/google/examplepackage v1.3.0==
- The version of Go.
- Any dependencies we use.

```go
module github.com/wagslane/hellogo

go 1.22.1

// replace github.com/wagslane/mystrings v0.0.0 => ../mystrings       // we write this to tell this module is at ../mustrings locally. This should be avoided. Just publish your code to a remote location. That's just how go creaters thought of handling packages and i think its better than npm at it.

require (
	github.com/wagslane/mystrings v0.0.0
)
```

## Channels
### Concurrency
ypically, our code is executed one line at a time, one after the other. This is called sequential execution or synchronous execution.
If the computer we're running our code on has multiple cores, we can even execute multiple tasks at exactly the same time. If we're running on a single core, a single core executes code at almost the same time by switching between tasks very quickly. Either way, the code we write looks the same in Go and takes advantage of whatever resources are available.

In go We just use the ==go== keyword before an operation to make it concurrent. The ==go== keyword spawns a new [goroutine](https://gobyexample.com/goroutines) when calling a functions

### Channels 
Channels are typed, thread-safe queue. Channels allow different goroutines to communicate with each other.

```go
ch := make(chan int) // make a channel.
ch <- 69 // send data to channel using the send operator.
v := <-ch // receive data from ch channel.
```

This reads and removes value from channel ch and saves it to v.

A [deadlock](https://yourbasic.org/golang/detect-deadlock/#:~:text=yourbasic.org%2Fgolang,look%20at%20this%20simple%20example.) is when a group of goroutines are all blocking so none of them can operate.This is a common bug that you need to watch out for in concurrent programming.

Empty structs are often used a ==tokens== in Go programs. In this context, a token is a unary value. We don't care what is passed through, we care if it is passed or not.

We can block and wait until something is sent on channel using 
```go
<-ch // this will block until it pops a single item off the channel, then continue, discarding an item.
```

### Buffered Channels
Channels can optionally be buffered.
We can provide a buffer length as the second argument to ==make()== to create a buffered channel.
```go
ch := make(chan int, 100)
```

A buffered channel only allows us to send data and only block channels when the buffer is full and receiving block only when the buffer is empty.

### Closing Channels
Channels can be explicitly closed by a sender:
```go
ch := make(chan int)

// do some stuff with the channel

close(ch)
```

We can check if a channel is closed 
```go
v, ok := <-ch
```

### Range
Channels can be ranged over. In this the channel will receive the value over the channel (blocking at each iteration if nothing new is there) and will exit only when the channel is closed.

```go
for item := range ch {
    // item is the next value received from the channel
}
```

### Select
Sometimes we have a single goroutine and we want to process the data in the order it comes in.

A ==select== statement is used to listen to multiple channels at the same time.

```go
select {
case i, ok := <- chInts:
    fmt.Println(i)
case s, ok := <- chStrings:
    fmt.Println(s)
default: 
    // receiving from ch would block
    // so do something else
}
```
The ==default== case in a ==select== statement executes immediately if no other channel has a value ready.A default case stops the ==select== statement from blocking.

### Tickers
- [time.Tick()](https://golang.org/pkg/time/#Tick) returns a channel that sends a value on a given interval.
- [time.After()](https://golang.org/pkg/time/#After) sends a value once after the duration has passed.
- [time.Sleep()](https://golang.org/pkg/time/#Sleep) blocks the current goroutine for specific amount of time.

### Read only channels
A channel can be marked as read-only by casting it from a ==chan== to a ==<-chan== type.
```go
func main() {
    ch := make(chan int)
    readCh(ch)
}

func readCh(ch <-chan int) {
    // ch can only be read from
    // in this function
}
```

### Write only channels
We can similarly make then write only by shifting the arrow.
```go
func writeCh(ch chan<- int) {
    // ch can only be written to
    // in this function
}
```

### Extra Stuff
#### A send to a nil channel blocks forever
```go
var c chan string // c is nil
c <- "let's get started" // blocks
```

#### A receive from a nil channel blocks forever
```go
var c chan string // c is nil
fmt.Println(<-c) // blocks
```

#### A send to a closed channel panics
```go
var c = make(chan int, 100)
close(c)
c <- 1 // panic: send on closed channel
```

#### A receive from a closed channel returns the zero value immediately
```go
var c = make(chan int, 100)
close(c)
fmt.Println(<-c) // 0
```

## Mutexes - 
Mutually excludes different threads from accessing the same data at the same time.
Mutexes allow us to lock access to data to control the access of data by goroutines.

Go std library provides a built-in implementation of a mutex with the sync.Mutex type and its two methods
- [Lock()](https://golang.org/pkg/sync/#Mutex.Lock)
- [Unlock()](https://golang.org/pkg/sync/#Mutex.Unlock)

```go
func protected(){
    mu.Lock() // 
    defer mu.Unlock() // use defer to ensure that we never forget to unlock.
    // the rest of the function is protected
    // any other calls to `mu.Lock()` will block
}
```

### Maps are not thread-safe.
Map are not safe for concurrent use. If you have multiple go routines accessing the same map, at least one of them is writing to the map. We must lock the map with a mutex.

### RW Mutex
The standard library also exposes a [sync.RWMutex](https://golang.org/pkg/sync/#RWMutex) and it has these methods :
- [RLock()](https://golang.org/pkg/sync/#RWMutex.RLock)
- [RUnlock()](https://golang.org/pkg/sync/#RWMutex.RUnlock)

It can help with performance if we have ==read intensive== task

Maps are cool with concurrent reads as we are not mutating data so more than one goroutines can read a map at the same time.

## Generics
As go doesn't have classes so it was impossible to reuse code that does the same thing.

As of Go v1.18, support for [generics](https://blog.boot.dev/golang/how-to-use-golangs-generics/) was released.

### Type parameters
Put simply, generics allow us to use variables to refer to specific types.
```go
func splitAnySlice[T any](s []T) ([]T, []T) {
    mid := len(s)/2
    return s[:mid], s[mid:]
}
```

### Constraints
Constraints are just interfaces that allow us to write generics that only operate within the constraints of a given interface type.
```go
type stringer interface {
    String() string
}

func concat[T stringer](vals []T) string {
    result := ""
    for _, val := range vals {
        // this is where the .String() method
        // is used. That's why we need a more specific
        // constraint instead of the any constraint
        result += val.String()
    }
    return result
}
```

### Interface type lists
We can now simply list a bunch of types to get a new interface/constraint.

```go
// Ordered is a type constraint that matches any ordered type.
// An ordered type is one that supports the <, <=, >, and >= operators.
type Ordered interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
        ~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~uintptr |
        ~float32 | ~float64 |
        ~string
}
```

### Generic type naming
```go
func splitAnySlice[T any](s []T) ([]T, []T) {
    mid := len(s)/2
    return s[:mid], s[mid:]
}
```
==T== is just a variable name and can be anything. ==T== has just become a convention like ==i== for for loops.

```go
func splitAnySlice[MyAnyType any](s []MyAnyType) ([]MyAnyType, []MyAnyType) {
    mid := len(s)/2
    return s[:mid], s[mid:]
}
```
