// Lessons for Linked Lists topic
// Based on "Cracking the Coding Interview" by Gayle Laakmann McDowell

const linkedListsLessons = [
  {
    id: 6,
    topic_id: 2,
    title: "Linked List Basics",
    description: "Introduction to linked lists, types, and basic operations.",
    order_index: 1,
    estimated_minutes: 25,
    xp_reward: 20,
    content: `
# Linked List Basics

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence.

## Basic Structure

A linked list node typically contains:
1. Data (the value stored in the node)
2. A reference (or pointer) to the next node

\`\`\`java
class Node {
    int data;
    Node next;
    
    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}
\`\`\`

## Types of Linked Lists

### Singly Linked List
- Each node points to the next node
- The last node points to null
- Only forward traversal is possible

\`\`\`
A → B → C → D → null
\`\`\`

### Doubly Linked List
- Each node has two pointers: next and prev
- The last node's next points to null
- The first node's prev points to null
- Both forward and backward traversal is possible

\`\`\`
null ← A ⟷ B ⟷ C ⟷ D → null
\`\`\`

### Circular Linked List
- The last node points back to the first node
- No null references
- Can be singly or doubly linked

\`\`\`
A → B → C → D → A (loops back)
\`\`\`

## Basic Operations

### Creating a Linked List

\`\`\`java
// Create nodes
Node head = new Node(1);
Node second = new Node(2);
Node third = new Node(3);

// Connect nodes
head.next = second;
second.next = third;
// third.next is already null
\`\`\`

### Traversing a Linked List

\`\`\`java
Node current = head;
while (current != null) {
    System.out.println(current.data);
    current = current.next;
}
\`\`\`

### Inserting a Node

#### At the Beginning

\`\`\`java
public Node insertAtBeginning(Node head, int data) {
    Node newNode = new Node(data);
    newNode.next = head;
    return newNode; // New head
}
\`\`\`

#### At the End

\`\`\`java
public Node insertAtEnd(Node head, int data) {
    Node newNode = new Node(data);
    
    // If the list is empty
    if (head == null) {
        return newNode;
    }
    
    // Find the last node
    Node current = head;
    while (current.next != null) {
        current = current.next;
    }
    
    // Insert at the end
    current.next = newNode;
    return head;
}
\`\`\`

#### After a Given Node

\`\`\`java
public void insertAfter(Node prevNode, int data) {
    // Check if prevNode is null
    if (prevNode == null) {
        System.out.println("Previous node cannot be null");
        return;
    }
    
    Node newNode = new Node(data);
    newNode.next = prevNode.next;
    prevNode.next = newNode;
}
\`\`\`

### Deleting a Node

#### At the Beginning

\`\`\`java
public Node deleteAtBeginning(Node head) {
    if (head == null) {
        return null;
    }
    
    return head.next;
}
\`\`\`

#### At the End

\`\`\`java
public Node deleteAtEnd(Node head) {
    if (head == null || head.next == null) {
        return null;
    }
    
    Node current = head;
    while (current.next.next != null) {
        current = current.next;
    }
    
    current.next = null;
    return head;
}
\`\`\`

#### A Specific Node

\`\`\`java
public Node deleteNode(Node head, int key) {
    // If the list is empty
    if (head == null) {
        return null;
    }
    
    // If head node itself holds the key
    if (head.data == key) {
        return head.next;
    }
    
    // Search for the key to be deleted
    Node current = head;
    while (current.next != null && current.next.data != key) {
        current = current.next;
    }
    
    // If key was not present in linked list
    if (current.next == null) {
        return head;
    }
    
    // Unlink the node from linked list
    current.next = current.next.next;
    
    return head;
}
\`\`\`

## Time Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Access    | O(n)           |
| Search    | O(n)           |
| Insertion | O(1)*          |
| Deletion  | O(1)*          |

*Assuming you have a reference to the node where the insertion/deletion is happening. If you need to search for the position first, it becomes O(n).

## Space Complexity

The space complexity of a linked list is O(n), where n is the number of nodes.

## Advantages of Linked Lists

1. Dynamic size (can grow and shrink during execution)
2. Efficient insertions and deletions (when you have a reference to the node)
3. No need to pre-allocate memory

## Disadvantages of Linked Lists

1. Random access is not allowed (must traverse from the beginning)
2. Extra memory for pointers
3. Not cache-friendly (nodes can be scattered in memory)
4. Reverse traversal is difficult in singly linked lists
`
  },
  {
    id: 7,
    topic_id: 2,
    title: "Linked List Implementation",
    description: "Implementing linked lists in different programming languages.",
    order_index: 2,
    estimated_minutes: 30,
    xp_reward: 25,
    content: `
# Linked List Implementation

This lesson covers how to implement linked lists in different programming languages and explores various implementation techniques.

## Implementing a Singly Linked List in Java

\`\`\`java
class Node {
    int data;
    Node next;
    
    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class SinglyLinkedList {
    Node head;
    
    // Constructor
    public SinglyLinkedList() {
        this.head = null;
    }
    
    // Insert at the beginning
    public void insertAtBeginning(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }
    
    // Insert at the end
    public void insertAtEnd(int data) {
        Node newNode = new Node(data);
        
        // If the list is empty
        if (head == null) {
            head = newNode;
            return;
        }
        
        // Find the last node
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        
        // Insert at the end
        current.next = newNode;
    }
    
    // Delete a node with given key
    public void deleteNode(int key) {
        // Store head node
        Node temp = head, prev = null;
        
        // If head node itself holds the key to be deleted
        if (temp != null && temp.data == key) {
            head = temp.next; // Changed head
            return;
        }
        
        // Search for the key to be deleted, keep track of the
        // previous node as we need to change prev.next
        while (temp != null && temp.data != key) {
            prev = temp;
            temp = temp.next;
        }
        
        // If key was not present in linked list
        if (temp == null) return;
        
        // Unlink the node from linked list
        prev.next = temp.next;
    }
    
    // Print the linked list
    public void printList() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " ");
            current = current.next;
        }
        System.out.println();
    }
    
    // Get the size of the linked list
    public int size() {
        int count = 0;
        Node current = head;
        while (current != null) {
            count++;
            current = current.next;
        }
        return count;
    }
    
    // Check if the list is empty
    public boolean isEmpty() {
        return head == null;
    }
    
    // Search for a node with given key
    public boolean search(int key) {
        Node current = head;
        while (current != null) {
            if (current.data == key) {
                return true;
            }
            current = current.next;
        }
        return false;
    }
    
    // Get the node at a specific position (0-based index)
    public Node getNodeAt(int index) {
        if (index < 0) {
            return null;
        }
        
        Node current = head;
        int count = 0;
        
        while (current != null) {
            if (count == index) {
                return current;
            }
            count++;
            current = current.next;
        }
        
        // Index out of bounds
        return null;
    }
}
\`\`\`

## Implementing a Doubly Linked List in Java

\`\`\`java
class DoublyNode {
    int data;
    DoublyNode next;
    DoublyNode prev;
    
    public DoublyNode(int data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class DoublyLinkedList {
    DoublyNode head;
    DoublyNode tail;
    
    // Constructor
    public DoublyLinkedList() {
        this.head = null;
        this.tail = null;
    }
    
    // Insert at the beginning
    public void insertAtBeginning(int data) {
        DoublyNode newNode = new DoublyNode(data);
        
        // If the list is empty
        if (head == null) {
            head = newNode;
            tail = newNode;
            return;
        }
        
        newNode.next = head;
        head.prev = newNode;
        head = newNode;
    }
    
    // Insert at the end
    public void insertAtEnd(int data) {
        DoublyNode newNode = new DoublyNode(data);
        
        // If the list is empty
        if (head == null) {
            head = newNode;
            tail = newNode;
            return;
        }
        
        tail.next = newNode;
        newNode.prev = tail;
        tail = newNode;
    }
    
    // Delete a node with given key
    public void deleteNode(int key) {
        // If the list is empty
        if (head == null) {
            return;
        }
        
        DoublyNode current = head;
        
        // If head node itself holds the key
        if (current.data == key) {
            head = current.next;
            
            // If there's only one node
            if (head == null) {
                tail = null;
            } else {
                head.prev = null;
            }
            
            return;
        }
        
        // Search for the key
        while (current != null && current.data != key) {
            current = current.next;
        }
        
        // If key was not present
        if (current == null) {
            return;
        }
        
        // If it's the last node
        if (current == tail) {
            tail = current.prev;
            tail.next = null;
            return;
        }
        
        // Unlink the node from linked list
        current.prev.next = current.next;
        current.next.prev = current.prev;
    }
    
    // Print the linked list forward
    public void printForward() {
        DoublyNode current = head;
        while (current != null) {
            System.out.print(current.data + " ");
            current = current.next;
        }
        System.out.println();
    }
    
    // Print the linked list backward
    public void printBackward() {
        DoublyNode current = tail;
        while (current != null) {
            System.out.print(current.data + " ");
            current = current.prev;
        }
        System.out.println();
    }
}
\`\`\`

## Implementing a Linked List in Python

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    # Insert at the beginning
    def insert_at_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    # Insert at the end
    def insert_at_end(self, data):
        new_node = Node(data)
        
        # If the list is empty
        if self.head is None:
            self.head = new_node
            return
        
        # Find the last node
        current = self.head
        while current.next:
            current = current.next
        
        # Insert at the end
        current.next = new_node
    
    # Delete a node with given key
    def delete_node(self, key):
        # Store head node
        temp = self.head
        
        # If head node itself holds the key to be deleted
        if temp and temp.data == key:
            self.head = temp.next
            return
        
        # Search for the key to be deleted
        prev = None
        while temp and temp.data != key:
            prev = temp
            temp = temp.next
        
        # If key was not present
        if temp is None:
            return
        
        # Unlink the node
        prev.next = temp.next
    
    # Print the linked list
    def print_list(self):
        current = self.head
        while current:
            print(current.data, end=" ")
            current = current.next
        print()
\`\`\`

## Implementing a Linked List in JavaScript

\`\`\`javascript
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }
    
    // Insert at the beginning
    insertAtBeginning(data) {
        const newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
    }
    
    // Insert at the end
    insertAtEnd(data) {
        const newNode = new Node(data);
        
        // If the list is empty
        if (!this.head) {
            this.head = newNode;
            return;
        }
        
        // Find the last node
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        
        // Insert at the end
        current.next = newNode;
    }
    
    // Delete a node with given key
    deleteNode(key) {
        // Store head node
        let temp = this.head;
        let prev = null;
        
        // If head node itself holds the key
        if (temp && temp.data === key) {
            this.head = temp.next;
            return;
        }
        
        // Search for the key
        while (temp && temp.data !== key) {
            prev = temp;
            temp = temp.next;
        }
        
        // If key was not present
        if (!temp) {
            return;
        }
        
        // Unlink the node
        prev.next = temp.next;
    }
    
    // Print the linked list
    printList() {
        let current = this.head;
        let result = '';
        while (current) {
            result += current.data + ' ';
            current = current.next;
        }
        console.log(result);
    }
}
\`\`\`

## Common Linked List Patterns

### Runner Technique (Two Pointers)
The runner technique uses two pointers that move through the list at different speeds.

Example: Finding the middle of a linked list
\`\`\`java
public Node findMiddle(Node head) {
    if (head == null) {
        return null;
    }
    
    Node slow = head;
    Node fast = head;
    
    // Fast pointer moves twice as fast as slow pointer
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // When fast reaches the end, slow is at the middle
    return slow;
}
\`\`\`

### Recursive Approach
Many linked list operations can be implemented recursively.

Example: Reversing a linked list recursively
\`\`\`java
public Node reverseRecursive(Node head) {
    // Base case: empty list or only one node
    if (head == null || head.next == null) {
        return head;
    }
    
    // Reverse the rest of the list
    Node newHead = reverseRecursive(head.next);
    
    // Change references for the current node
    head.next.next = head;
    head.next = null;
    
    return newHead;
}
\`\`\`

## Choosing the Right Linked List Type

- **Singly Linked List**: Use when memory is a concern and you only need forward traversal.
- **Doubly Linked List**: Use when you need bidirectional traversal or quick deletion of nodes.
- **Circular Linked List**: Use when you need to cycle through the list repeatedly.
`
  },
  {
    id: 8,
    topic_id: 2,
    title: "Linked List Problems",
    description: "Common problems and techniques for solving linked list questions.",
    order_index: 3,
    estimated_minutes: 35,
    xp_reward: 30,
    content: `
# Linked List Problems

This lesson covers common linked list problems and techniques for solving them in coding interviews.

## Common Linked List Problems

### 1. Detecting a Cycle

Problem: Determine if a linked list has a cycle (a node that points back to a previous node).

Solution using Floyd's Cycle-Finding Algorithm (Tortoise and Hare):

\`\`\`java
public boolean hasCycle(Node head) {
    if (head == null || head.next == null) {
        return false;
    }
    
    Node slow = head;
    Node fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;          // Move one step
        fast = fast.next.next;     // Move two steps
        
        if (slow == fast) {
            return true;  // Cycle detected
        }
    }
    
    return false;  // No cycle
}
\`\`\`

### 2. Finding the Start of a Cycle

Problem: If a linked list has a cycle, find the node where the cycle begins.

Solution:

\`\`\`java
public Node detectCycle(Node head) {
    if (head == null || head.next == null) {
        return null;
    }
    
    Node slow = head;
    Node fast = head;
    boolean hasCycle = false;
    
    // Detect cycle
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) {
            hasCycle = true;
            break;
        }
    }
    
    if (!hasCycle) {
        return null;
    }
    
    // Find the start of the cycle
    slow = head;
    while (slow != fast) {
        slow = slow.next;
        fast = fast.next;
    }
    
    return slow;
}
\`\`\`

### 3. Reversing a Linked List

Problem: Reverse a singly linked list.

Iterative Solution:

\`\`\`java
public Node reverse(Node head) {
    Node prev = null;
    Node current = head;
    Node next = null;
    
    while (current != null) {
        next = current.next;    // Store next node
        current.next = prev;    // Reverse the link
        prev = current;         // Move prev forward
        current = next;         // Move current forward
    }
    
    return prev;  // New head
}
\`\`\`

Recursive Solution:

\`\`\`java
public Node reverseRecursive(Node head) {
    // Base case
    if (head == null || head.next == null) {
        return head;
    }
    
    // Reverse the rest of the list
    Node newHead = reverseRecursive(head.next);
    
    // Change references
    head.next.next = head;
    head.next = null;
    
    return newHead;
}
\`\`\`

### 4. Finding the Middle of a Linked List

Problem: Find the middle node of a linked list.

Solution:

\`\`\`java
public Node findMiddle(Node head) {
    if (head == null) {
        return null;
    }
    
    Node slow = head;
    Node fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
\`\`\`

### 5. Removing the Nth Node From End

Problem: Remove the nth node from the end of a linked list.

Solution:

\`\`\`java
public Node removeNthFromEnd(Node head, int n) {
    // Create a dummy node to handle edge cases
    Node dummy = new Node(0);
    dummy.next = head;
    
    Node first = dummy;
    Node second = dummy;
    
    // Advance first pointer by n+1 steps
    for (int i = 0; i <= n; i++) {
        if (first == null) {
            return head;  // n is greater than the length of the list
        }
        first = first.next;
    }
    
    // Move both pointers until first reaches the end
    while (first != null) {
        first = first.next;
        second = second.next;
    }
    
    // Remove the nth node from the end
    second.next = second.next.next;
    
    return dummy.next;
}
\`\`\`

### 6. Merging Two Sorted Lists

Problem: Merge two sorted linked lists into one sorted list.

Solution:

\`\`\`java
public Node mergeTwoLists(Node l1, Node l2) {
    // Create a dummy node to simplify the code
    Node dummy = new Node(0);
    Node current = dummy;
    
    while (l1 != null && l2 != null) {
        if (l1.data <= l2.data) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    
    // Attach the remaining nodes
    if (l1 != null) {
        current.next = l1;
    } else {
        current.next = l2;
    }
    
    return dummy.next;
}
\`\`\`

### 7. Palindrome Linked List

Problem: Determine if a linked list is a palindrome.

Solution:

\`\`\`java
public boolean isPalindrome(Node head) {
    if (head == null || head.next == null) {
        return true;
    }
    
    // Find the middle of the linked list
    Node slow = head;
    Node fast = head;
    
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Reverse the second half
    Node secondHalf = reverse(slow.next);
    Node firstHalf = head;
    
    // Compare the first and second half
    while (secondHalf != null) {
        if (firstHalf.data != secondHalf.data) {
            return false;
        }
        firstHalf = firstHalf.next;
        secondHalf = secondHalf.next;
    }
    
    return true;
}

private Node reverse(Node head) {
    Node prev = null;
    Node current = head;
    
    while (current != null) {
        Node next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}
\`\`\`

### 8. Intersection of Two Linked Lists

Problem: Find the node at which two linked lists intersect.

Solution:

\`\`\`java
public Node getIntersectionNode(Node headA, Node headB) {
    if (headA == null || headB == null) {
        return null;
    }
    
    Node a = headA;
    Node b = headB;
    
    // If the lists have different lengths, this approach will align them
    while (a != b) {
        a = (a == null) ? headB : a.next;
        b = (b == null) ? headA : b.next;
    }
    
    return a;  // Either the intersection point or null
}
\`\`\`

## Techniques for Solving Linked List Problems

### 1. Two Pointer Technique
- **Fast and Slow Pointers**: Useful for finding cycles, middle elements, or nth elements from the end.
- **Left and Right Pointers**: Useful for operations that require comparing elements from different parts of the list.

### 2. Dummy Node
- Create a dummy node at the beginning of the list to simplify edge cases, especially when the head might change.

### 3. Recursion
- Many linked list problems can be solved recursively, which can lead to elegant solutions.

### 4. Reversing Lists or Portions of Lists
- Reversing a linked list is a common operation that can be useful in many problems.

### 5. Hash Table
- Using a hash table to store nodes can help with problems involving duplicates, cycles, or intersections.

## Tips for Linked List Problems in Interviews

1. **Draw it out**: Visualize the linked list and the operations you're performing.
2. **Test with examples**: Use small examples to verify your approach.
3. **Handle edge cases**: Consider empty lists, single-node lists, and other edge cases.
4. **Be careful with null pointers**: Always check for null before dereferencing.
5. **Consider time and space complexity**: Aim for O(n) time and O(1) space when possible.
6. **Use helper functions**: Break down complex operations into smaller, reusable functions.
7. **Understand the problem constraints**: Some problems may have specific requirements about modifying the original list.
`
  },
  {
    id: 9,
    topic_id: 2,
    title: "Advanced Linked List Concepts",
    description: "Advanced linked list types and applications in real-world systems.",
    order_index: 4,
    estimated_minutes: 25,
    xp_reward: 25,
    content: `
# Advanced Linked List Concepts

This lesson covers advanced linked list types, optimizations, and real-world applications.

## Advanced Linked List Types

### 1. Skip List

A skip list is a probabilistic data structure that allows O(log n) search complexity as well as O(log n) insertion complexity within an ordered sequence of elements.

Structure:
- Multiple layers of linked lists
- Each higher layer acts as an "express lane" for the lists below
- Elements are randomly promoted to higher levels

\`\`\`
Level 3: 1 -----------------------> 9
Level 2: 1 --------> 5 --------> 9
Level 1: 1 --> 3 --> 5 --> 7 --> 9
Level 0: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9
\`\`\`

Time Complexity:
- Search: O(log n) average
- Insert: O(log n) average
- Delete: O(log n) average

Applications:
- Used in Redis for sorted sets
- Efficient implementation of priority queues

### 2. XOR Linked List

An XOR linked list is a memory-efficient doubly linked list that uses bitwise XOR to store the addresses of both previous and next nodes in a single pointer.

Structure:
- Each node contains data and a single pointer (prev XOR next)
- To traverse, you need both the current node and the previous node

\`\`\`
A <-> B <-> C <-> D
\`\`\`

In a regular doubly linked list:
- A: prev=null, next=&B
- B: prev=&A, next=&C
- C: prev=&B, next=&D
- D: prev=&C, next=null

In an XOR linked list:
- A: link = null XOR &B
- B: link = &A XOR &C
- C: link = &B XOR &D
- D: link = &C XOR null

Advantages:
- Memory efficient (one pointer instead of two)

Disadvantages:
- More complex to implement
- Not supported directly in high-level languages like Java or Python

### 3. Unrolled Linked List

An unrolled linked list is a variation where each node contains an array of elements instead of just a single element.

Structure:
- Each node contains an array of elements and a pointer to the next node
- The array size is typically fixed

\`\`\`
[1,2,3,4] -> [5,6,7,8] -> [9,10,11,12]
\`\`\`

Advantages:
- Better cache performance
- Reduced memory overhead for pointers
- Faster traversal

Disadvantages:
- More complex insertions and deletions
- Variable time complexity for operations

### 4. Self-Adjusting List

A self-adjusting list reorganizes itself based on access patterns to improve future access times.

Types:
- **Move-to-Front**: Moves accessed elements to the front of the list
- **Transpose**: Swaps an accessed element with its predecessor
- **Count**: Maintains a count of accesses and sorts by frequency

Advantages:
- Adapts to usage patterns
- Can approach O(1) for frequently accessed elements

Disadvantages:
- Overhead for reorganization
- Unpredictable performance

## Memory Management Optimizations

### 1. Memory Pools

Instead of allocating each node individually, a memory pool pre-allocates a large chunk of memory and manages node allocation internally.

Benefits:
- Reduced allocation overhead
- Better memory locality
- Less fragmentation

Implementation:
\`\`\`java
class NodePool {
    private Node[] pool;
    private int nextAvailable;
    
    public NodePool(int size) {
        pool = new Node[size];
        for (int i = 0; i < size; i++) {
            pool[i] = new Node();
            if (i < size - 1) {
                pool[i].next = pool[i + 1];
            }
        }
        nextAvailable = 0;
    }
    
    public Node allocate(int data) {
        if (nextAvailable == -1) {
            return null;  // Pool is full
        }
        
        Node node = pool[nextAvailable];
        nextAvailable = (node.next != null) ? indexOf(node.next) : -1;
        
        node.data = data;
        node.next = null;
        return node;
    }
    
    public void free(Node node) {
        int index = indexOf(node);
        if (index != -1) {
            node.next = (nextAvailable != -1) ? pool[nextAvailable] : null;
            nextAvailable = index;
        }
    }
    
    private int indexOf(Node node) {
        for (int i = 0; i < pool.length; i++) {
            if (pool[i] == node) {
                return i;
            }
        }
        return -1;
    }
}
\`\`\`

### 2. Cache-Conscious Linked Lists

Techniques to improve cache performance:
- **Node Clustering**: Store nodes that are likely to be accessed together in contiguous memory
- **Prefetching**: Hint to the processor to load future nodes into cache
- **Reducing Pointer Chasing**: Use array-based representations where possible

## Real-World Applications

### 1. LRU Cache Implementation

Least Recently Used (LRU) cache uses a doubly linked list and a hash map to achieve O(1) operations.

\`\`\`java
class LRUCache {
    private class Node {
        int key;
        int value;
        Node prev;
        Node next;
    }
    
    private int capacity;
    private HashMap<Integer, Node> map;
    private Node head, tail;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>();
        head = new Node();
        tail = new Node();
        head.next = tail;
        tail.prev = head;
    }
    
    public int get(int key) {
        if (!map.containsKey(key)) {
            return -1;
        }
        
        Node node = map.get(key);
        removeNode(node);
        addToHead(node);
        return node.value;
    }
    
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.value = value;
            removeNode(node);
            addToHead(node);
        } else {
            if (map.size() == capacity) {
                map.remove(tail.prev.key);
                removeNode(tail.prev);
            }
            
            Node newNode = new Node();
            newNode.key = key;
            newNode.value = value;
            
            map.put(key, newNode);
            addToHead(newNode);
        }
    }
    
    private void addToHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }
    
    private void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}
\`\`\`

### 2. File Systems

Many file systems use linked lists to manage free blocks and directory structures.

Example: FAT (File Allocation Table)
- Each file is represented as a linked list of clusters
- The FAT serves as a lookup table for the next cluster in the chain

### 3. Blockchain

Blockchain technology uses a linked list structure where each block contains:
- Data
- Hash of the current block
- Hash of the previous block

This creates an immutable chain of blocks that is resistant to tampering.

### 4. Text Editors

Text editors often use piece tables or rope data structures (specialized linked lists) to efficiently handle text operations:
- Inserting text
- Deleting text
- Undo/redo operations

### 5. Graph Representations

Adjacency lists use linked lists to represent graphs:
- Each vertex has a linked list of its adjacent vertices
- Efficient for sparse graphs

## Performance Considerations

When working with linked lists in performance-critical applications:

1. **Consider the access pattern**: If random access is frequent, arrays might be better.
2. **Evaluate memory overhead**: Pointers add significant overhead for small data items.
3. **Analyze cache behavior**: Linked lists typically have poor cache locality.
4. **Benchmark different implementations**: The theoretical advantages might not translate to real-world performance.
5. **Use specialized variants**: Choose the right type of linked list for your specific needs.

## Conclusion

Advanced linked list concepts extend beyond the basic implementations and can provide significant benefits in specific scenarios. Understanding these advanced concepts will help you choose the right data structure for your application and optimize its performance.
`
  }
];

module.exports = linkedListsLessons;
