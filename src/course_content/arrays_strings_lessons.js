// Lessons for Arrays and Strings topic
// Based on "Cracking the Coding Interview" by Gayle Laakmann McDowell

const arraysAndStringsLessons = [
  {
    id: 1,
    topic_id: 1,
    title: "Array Basics",
    description: "Introduction to arrays, memory layout, and basic operations.",
    order_index: 1,
    estimated_minutes: 20,
    xp_reward: 15,
    content: `
# Array Basics

Arrays are one of the most fundamental data structures in computer science. They store elements of the same type in contiguous memory locations, allowing for efficient access to elements using indices.

## Memory Layout

In memory, an array looks like this:

  [0]   [1]   [2]   [3]   [4]  

Each element occupies the same amount of memory, and the elements are stored next to each other. This contiguous storage is what enables O(1) access time.

## Basic Operations

### 1. Accessing Elements

Accessing an element at a specific index is an O(1) operation:

\`\`\`java
int value = array[3]; // Get the element at index 3
\`\`\`

### 2. Updating Elements

Updating an element is also an O(1) operation:

\`\`\`java
array[3] = 42; // Set the element at index 3 to 42
\`\`\`

### 3. Traversing an Array

Iterating through all elements is an O(n) operation:

\`\`\`java
for (int i = 0; i < array.length; i++) {
    // Process array[i]
}
\`\`\`

### 4. Insertion and Deletion

Inserting or deleting elements at arbitrary positions requires shifting elements, making these O(n) operations.

## Static vs. Dynamic Arrays

### Static Arrays

- Fixed size determined at creation
- Cannot be resized after creation
- Example: arrays in Java, C++

### Dynamic Arrays

- Can grow or shrink in size
- Implemented with resizing strategies (typically doubling size when full)
- Example: ArrayList in Java, vector in C++, list in Python

## Time Complexity Summary

| Operation | Time Complexity |
|-----------|----------------|
| Access    | O(1)           |
| Search    | O(n)           |
| Insertion | O(n)           |
| Deletion  | O(n)           |

## Space Complexity

The space complexity of an array is O(n), where n is the number of elements in the array.
`
  },
  {
    id: 2,
    topic_id: 1,
    title: "String Manipulation",
    description: "Common string operations and techniques for string manipulation.",
    order_index: 2,
    estimated_minutes: 25,
    xp_reward: 20,
    content: `
# String Manipulation

Strings are sequences of characters and are implemented differently across programming languages. In many languages, strings are immutable, meaning they cannot be changed after creation.

## String Basics

### String Representation

Strings are typically represented as arrays of characters with a null terminator (in languages like C/C++) or as objects with methods (in languages like Java, Python).

### String Creation

\`\`\`java
// Java
String str1 = "Hello";
String str2 = new String("World");

// Python
# str1 = "Hello"
# str2 = str("World")
\`\`\`

## Common String Operations

### 1. Concatenation

\`\`\`java
// Java
String result = str1 + " " + str2; // "Hello World"

// Python
# result = str1 + " " + str2
\`\`\`

### 2. Substring

\`\`\`java
// Java
String sub = str1.substring(1, 4); // "ell"

// Python
# sub = str1[1:4] # "ell"
\`\`\`

### 3. Character Access

\`\`\`java
// Java
char c = str1.charAt(1); // 'e'

// Python
# c = str1[1] # 'e'
\`\`\`

### 4. String Length

\`\`\`java
// Java
int length = str1.length(); // 5

// Python
# length = len(str1) # 5
\`\`\`

## String Immutability

In languages like Java and Python, strings are immutable. This means that operations that appear to modify a string actually create a new string.

\`\`\`java
// Java
String s = "Hello";
s = s + " World"; // Creates a new string, doesn't modify the original
\`\`\`

This has implications for performance, especially when doing many string operations in a loop.

## String Builder/Buffer

For efficient string manipulation in languages with immutable strings, use StringBuilder (Java) or similar constructs:

\`\`\`java
// Java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result = sb.toString(); // "Hello World"
\`\`\`

## Common String Problems

1. **Checking for unique characters**: Determine if a string has all unique characters
2. **Reversing a string**: Reverse the characters in a string
3. **Checking for anagrams**: Determine if two strings are anagrams of each other
4. **String compression**: Implement basic string compression using character counts

## Time Complexity

| Operation                | Time Complexity |
|--------------------------|----------------|
| Access character         | O(1)           |
| Find substring           | O(n*m)         |
| Concatenation            | O(n+m)         |
| StringBuilder operations | Amortized O(1) |

Where n and m are the lengths of the strings involved.
`
  },
  {
    id: 3,
    topic_id: 1,
    title: "Hash Tables",
    description: "Understanding hash tables and their applications with arrays and strings.",
    order_index: 3,
    estimated_minutes: 30,
    xp_reward: 25,
    content: `
# Hash Tables

Hash tables are data structures that map keys to values using a hash function. They provide average-case O(1) time complexity for insertions, deletions, and lookups.

## Hash Table Basics

A hash table consists of:
1. An array of buckets/slots
2. A hash function that maps keys to bucket indices

## Hash Function

The hash function converts a key into an array index:

\`\`\`
index = hash_function(key) % array_size
\`\`\`

A good hash function:
- Distributes keys uniformly across the array
- Is fast to compute
- Minimizes collisions

## Collisions

Collisions occur when two different keys hash to the same index. There are several strategies to handle collisions:

### 1. Chaining

Each bucket contains a linked list of all key-value pairs that hash to that bucket.

\`\`\`
[0] -> (key1, value1) -> (key5, value5)
[1] -> (key2, value2)
[2] -> (key3, value3) -> (key6, value6) -> (key7, value7)
[3] -> (key4, value4)
\`\`\`

### 2. Open Addressing

When a collision occurs, look for another open slot in the array using a probing sequence:
- Linear probing: Check the next slot, then the next, etc.
- Quadratic probing: Check slots at quadratic distances
- Double hashing: Use a second hash function to determine the step size

## Hash Table Operations

### Insertion

1. Compute the hash code for the key
2. Map the hash code to an index in the array
3. If the slot is empty, insert the key-value pair
4. If the slot is occupied, handle the collision

### Lookup

1. Compute the hash code for the key
2. Map the hash code to an index in the array
3. If the slot contains the key, return the value
4. If using chaining, search the linked list
5. If using open addressing, follow the probing sequence

### Deletion

1. Compute the hash code for the key
2. Map the hash code to an index in the array
3. If the slot contains the key, remove the key-value pair
4. If using chaining, remove from the linked list
5. If using open addressing, mark the slot as "deleted" (not empty)

## Hash Table Implementation in Different Languages

### Java
\`\`\`java
HashMap<String, Integer> map = new HashMap<>();
map.put("apple", 5);
int count = map.get("apple"); // 5
map.remove("apple");
\`\`\`

### Python
\`\`\`python
# Dictionary
map = {}
map["apple"] = 5
count = map["apple"]  # 5
del map["apple"]
\`\`\`

## Applications of Hash Tables

1. **Implementing associative arrays**: Store key-value pairs
2. **Database indexing**: Quick lookup of records
3. **Caching**: Store results of expensive operations
4. **String problems**: Track character frequencies, check for anagrams
5. **De-duplication**: Quickly check if an element has been seen before

## Time and Space Complexity

| Operation | Average Case | Worst Case |
|-----------|--------------|------------|
| Insert    | O(1)         | O(n)       |
| Delete    | O(1)         | O(n)       |
| Search    | O(1)         | O(n)       |

Space complexity: O(n), where n is the number of key-value pairs stored.

The worst-case time complexity occurs when there are many collisions, which can happen with a poor hash function or when the hash table is very full.
`
  },
  {
    id: 4,
    topic_id: 1,
    title: "ArrayList and Resizable Arrays",
    description: "Implementation and usage of dynamic arrays that can resize.",
    order_index: 4,
    estimated_minutes: 25,
    xp_reward: 20,
    content: `
# ArrayList and Resizable Arrays

While basic arrays have a fixed size, many programming languages provide dynamic array implementations that can grow or shrink as needed. These are often called ArrayList (Java), vector (C++), or list (Python).

## Dynamic Array Basics

A dynamic array is an array that can resize itself when it reaches capacity. It typically:
1. Starts with a fixed-size array
2. When the array is full, creates a new, larger array (usually 2x the size)
3. Copies all elements from the old array to the new one
4. Discards the old array

## Implementation

Here's a simplified implementation of a dynamic array:

\`\`\`java
public class DynamicArray<T> {
    private T[] array;
    private int size;
    private int capacity;
    
    @SuppressWarnings("unchecked")
    public DynamicArray(int initialCapacity) {
        array = (T[]) new Object[initialCapacity];
        size = 0;
        capacity = initialCapacity;
    }
    
    public void add(T element) {
        if (size == capacity) {
            resize();
        }
        array[size++] = element;
    }
    
    @SuppressWarnings("unchecked")
    private void resize() {
        capacity *= 2;
        T[] newArray = (T[]) new Object[capacity];
        for (int i = 0; i < size; i++) {
            newArray[i] = array[i];
        }
        array = newArray;
    }
    
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException();
        }
        return array[index];
    }
    
    public int size() {
        return size;
    }
}
\`\`\`

## Amortized Time Complexity

While resizing an array is an O(n) operation, it happens infrequently enough that the amortized time complexity for adding an element is O(1).

Consider adding n elements:
- Most additions are O(1)
- Resizing operations are O(n), but occur after 1, 2, 4, 8, ... elements
- Total cost: n + n/2 + n/4 + n/8 + ... ≈ 2n
- Amortized cost per operation: 2n/n = O(1)

## ArrayList in Java

\`\`\`java
import java.util.ArrayList;

ArrayList<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
int value = list.get(1); // 2
list.remove(1);
int newSize = list.size(); // 2
\`\`\`

## List in Python

\`\`\`python
my_list = []
my_list.append(1)
my_list.append(2)
my_list.append(3)
value = my_list[1]  # 2
my_list.pop(1)
new_size = len(my_list)  # 2
\`\`\`

## Common Operations

| Operation | Description | Time Complexity |
|-----------|-------------|----------------|
| add/append | Add element to end | Amortized O(1) |
| get/access | Get element at index | O(1) |
| set | Update element at index | O(1) |
| remove | Remove element at index | O(n) |
| insert | Insert element at index | O(n) |
| size/length | Get number of elements | O(1) |

## When to Use Dynamic Arrays

- When you need a sequence of elements with efficient random access
- When you don't know the size in advance or the size might change
- When you need to append elements frequently
- When you need to iterate through elements in order

## When Not to Use Dynamic Arrays

- When you need efficient insertions/deletions in the middle (use linked lists)
- When you need to search by value frequently (use hash tables)
- When you have a fixed size that won't change (use regular arrays)
`
  },
  {
    id: 5,
    topic_id: 1,
    title: "String Buffer and StringBuilder",
    description: "Efficient string manipulation using mutable string classes.",
    order_index: 5,
    estimated_minutes: 20,
    xp_reward: 15,
    content: `
# String Buffer and StringBuilder

In languages with immutable strings (like Java), string concatenation can be inefficient, especially in loops. StringBuffer and StringBuilder provide mutable string classes for more efficient string manipulation.

## String Immutability Problem

Consider this Java code:

\`\`\`java
String result = "";
for (int i = 0; i < 10000; i++) {
    result += "a";
}
\`\`\`

This creates a new string object for each iteration, resulting in O(n²) time complexity and excessive memory usage.

## StringBuilder Solution

StringBuilder provides a mutable sequence of characters:

\`\`\`java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append("a");
}
String result = sb.toString();
\`\`\`

This has O(n) time complexity and much better memory usage.

## StringBuilder vs. StringBuffer

- **StringBuilder**: Not thread-safe, but faster
- **StringBuffer**: Thread-safe (synchronized methods), but slower

Use StringBuilder unless you need thread safety.

## Common Operations

### Creating a StringBuilder

\`\`\`java
// Empty StringBuilder
StringBuilder sb1 = new StringBuilder();

// With initial content
StringBuilder sb2 = new StringBuilder("Hello");

// With initial capacity
StringBuilder sb3 = new StringBuilder(100);
\`\`\`

### Appending Content

\`\`\`java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
// sb contains "Hello World"
\`\`\`

### Inserting Content

\`\`\`java
StringBuilder sb = new StringBuilder("Hello World");
sb.insert(5, " Beautiful");
// sb contains "Hello Beautiful World"
\`\`\`

### Deleting Content

\`\`\`java
StringBuilder sb = new StringBuilder("Hello Beautiful World");
sb.delete(5, 15);
// sb contains "Hello World"
\`\`\`

### Replacing Content

\`\`\`java
StringBuilder sb = new StringBuilder("Hello World");
sb.replace(6, 11, "Java");
// sb contains "Hello Java"
\`\`\`

### Reversing Content

\`\`\`java
StringBuilder sb = new StringBuilder("Hello");
sb.reverse();
// sb contains "olleH"
\`\`\`

### Converting to String

\`\`\`java
StringBuilder sb = new StringBuilder("Hello");
String str = sb.toString();
\`\`\`

## Time Complexity

| Operation | Time Complexity |
|-----------|----------------|
| append    | Amortized O(1) |
| insert    | O(n)           |
| delete    | O(n)           |
| replace   | O(n)           |
| reverse   | O(n)           |
| toString  | O(n)           |

## Equivalent in Other Languages

### Python
Python strings are immutable, but string concatenation is optimized:

\`\`\`python
# For small numbers of concatenations:
result = "Hello" + " " + "World"

# For many concatenations:
parts = []
for i in range(10000):
    parts.append("a")
result = "".join(parts)
\`\`\`

### JavaScript
JavaScript strings are immutable, but modern JavaScript engines optimize string concatenation:

\`\`\`javascript
// For small numbers of concatenations:
let result = "Hello" + " " + "World";

// For many concatenations:
let parts = [];
for (let i = 0; i < 10000; i++) {
    parts.push("a");
}
let result = parts.join("");
\`\`\`

## Best Practices

1. Use StringBuilder when concatenating strings in loops
2. Set an initial capacity if you know the approximate final size
3. Use StringBuffer only when thread safety is required
4. Convert to String only when the final result is needed
`
  }
];

module.exports = arraysAndStringsLessons;
