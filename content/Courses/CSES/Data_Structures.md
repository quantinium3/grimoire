---
id: Data Structures
aliases: []
tags: []
title: Data Structures
---

## Dynamic Arrays
An array whose size can be changed automatically during runtime.
```cpp
vector<int> vec;
vec.push_back(5);
vec.push_back(7);
vec.push_back(9);
vec.push_back(11);

cout << vec[0] << endl;
cout << vec[1] << endl;

// normal for loop
for(int i = 0; i < vec.size(); i++) {
    cout << vec[i] << endl;
}

//range based loop
for(const int& i : vec) {
    cout << i << endl;
}


cout << vec.back() << endl; // 11
vec.pop_back();
cout << vec.back() << endl; // 9

//size 10, initial value = 0
vector<int> vec(10);

//size 10, initial value = 5
vector<int> vec(10, 5);
```

## Strings
A dynamic arrays like vector but only contains chars.

```cpp
string a = "abcde";
string b = a + a;
cout << b << endl; // abcdeabcde
b[0] = 'd';
cout << b << endl; // dbcdeabcde
string c = substr(3, 4);
cout << c << endl; // deab
```

## Set
Maintains a collection of elements just like vector but has no duplicates.

C++ has two set implementations: 
- `set` - based on a binary tree and its operations work in O(logN) time.
- `unordered_set` - uses hashing and its operation take O(1) on average.

```cpp
set<int> s;
s.insert(3);
s.insert(2);
s.insert(5);

cout << s.count(3) << endl; // 1
cout << s.count(4) << endl; // 0

s.erase(3);
s.insert(4);
cout << s.count(3) << endl; // 0
cout << s.count(4) << endl; // 1
```

a set can be used like a vector but cant use the indexes to get the values.

```cpp
set<int> s = {2, 5, 6, 8};
cout << s.size() << endl; // 4

for(const int& i : s) {
    cout << i << endl;
}
```

c++ also contains `multiset` and `unordered_multiset` that otherwise work like `set` and `unordered_set` but they can contain multiple instances of an element.

```cpp
multiset<int> m;
m.insert(5);
m.insert(5);
m.insert(5);
cout << m.count(5) << endl; // 5

m.erase(5);
cout << m.count(5) << endl; // 0

//if want to remove only one instance 
s.erase(s.find(5));
cout << m.count(5) << endl; // 2
```

## Map
A generalized array of key-value pairs. The structure map is based on balanced binary tree and accessing element takes O(logN) time, while the `unordered_map` uses hashing and accessing elements take O(1) time.

```cpp
map<string, int> m;
m['monkey'] = 4;
m['banana'] = 3;
m['harpsichord'] = 9;
cout << m['banana'] << endl; // 3

for(const auto& i: m) {
    cout << i.first << " " << i.second << endl;
}
```

if the `key-value` pair are not present in the map but they are requested, the `key-value` pair is put into the map with value = 0;
```cpp
cout << m['hi'] << endl;
```

To check if a key exists in a map: 
```cpp
if(m.count("hi")) {
    // key exists
}
```

## Bitset
An array whose value is either 0 or 1.
```cpp
bitset<10> s;

s[1] = 1;
s[3] = 1;
s[4] = 1;

cout << s[4] << endl; // 1
cout << s[5] << endl; // 0

bitset<10> s(string("0010011010"));
cout << s[4] << endl; // 1
cout << s[5] << endl; // 0
```

they are good cause we can to bitwise operations on them.

```cpp
bitset<10> a(string("0010110110"))
bitset<10> b(string("1011011000"))

cout << (a & b) << endl;
cout << (a | b) << endl;
cout << (a ^ b) << endl;
```

## Deque
A queue like data structure where we can insert and pop from both ends.

```cpp
deque<int> d;
d.push_back(5);
d.push_back(2);
d.push_front(3);

d.pop_back();
d.pop_front();
```

deque is slower than a vector but still pushing and popping are O(1) operations.

## Stack
A LIFO data structure that has two O(1) operations: pushing on top of stack and popping of the stack.

```cpp
stack<int> s;
s.push(3);
s.push(2);
s.push(5);

cout << s.top() << endl;
s.pop();
cout << s.top() << endl;
```

## Queue
A FIFO based data structure which also has two O(1) operations: pushing at end of queue and popping from front of queue.

```cpp
queue<int> q;
q.push(3);
q.push(2);
q.push(5);

cout << q.front() << endl; // 3
q.pop();
cout << q.front() << endl; // 2
```

## Priority queue
A heap based data structure.
```cpp
priority_queue<int> q; // max heap
q.push(3);
q.push(5);
q.push(7);
q.push(2);

cout << q.top() << endl; // 7
q.pop();
q.push(6);
cout << q.top() << endl; // 6

priority_queue<int, vector<int> , greater<int>> q; // min heap
```

## Policy based data structures
g++ also contains some data structures that are not part of c++ std library.
```cpp
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;

typedef tree<int,null_type,less<int>,rb_tree_tag,tree_order_statistics_node_update> indexed_set;
indexed_set s;
s.insert(2);
s.insert(3);
s.insert(7);
s.insert(9);

auto x = s.find_by_order(2);
cout << *x << "\n"; // 7
cout << s.order_of_key(7) << "\n"; // 2
```

If the element does not appear in the set, we get the position that the element would have in the set
```cpp
cout << s.order_of_key(6) << "\n"; // 2
cout << s.order_of_key(8) << "\n"; // 3
```

both work in logarithmic time.

