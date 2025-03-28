// Lessons for Stacks and Queues topic
// Based on "Cracking the Coding Interview" by Gayle Laakmann McDowell

const stacksQueuesLessons = [
  {
    id: 10,
    topic_id: 3,
    title: "Stack Basics",
    description: "Introduction to stacks, implementation, and basic operations.",
    order_index: 1,
    estimated_minutes: 20,
    xp_reward: 15,
    content: `
# Stack Basics

A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. The last element added to the stack is the first one to be removed.

## Stack Operations

The primary operations of a stack are:

1. **Push**: Add an element to the top of the stack
2. **Pop**: Remove the top element from the stack
3. **Peek/Top**: View the top element without removing it
4. **isEmpty**: Check if the stack is empty

## Stack Implementation

Stacks can be implemented using arrays or linked lists.

### Array Implementation

\`\`\`java
public class ArrayStack<T> {
    private static final int DEFAULT_CAPACITY = 10;
    private T[] array;
    private int top;
    
    @SuppressWarnings("unchecked")
    public ArrayStack() {
        array = (T[]) new Object[DEFAULT_CAPACITY];
        top = -1;
    }
    
    public void push(T item) {
        if (top == array.length - 1) {
            resize();
        }
        array[++top] = item;
    }
    
    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        T item = array[top];
        array[top--] = null; // Help garbage collection
        return item;
    }
    
    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return array[top];
    }
    
    public boolean isEmpty() {
        return top == -1;
    }
    
    public int size() {
        return top + 1;
    }
    
    @SuppressWarnings("unchecked")
    private void resize() {
        T[] newArray = (T[]) new Object[array.length * 2];
        System.arraycopy(array, 0, newArray, 0, array.length);
        array = newArray;
    }
}
\`\`\`

### Linked List Implementation

\`\`\`java
public class LinkedStack<T> {
    private static class Node<T> {
        private T data;
        private Node<T> next;
        
        public Node(T data) {
            this.data = data;
        }
    }
    
    private Node<T> top;
    private int size;
    
    public LinkedStack() {
        top = null;
        size = 0;
    }
    
    public void push(T item) {
        Node<T> newNode = new Node<>(item);
        newNode.next = top;
        top = newNode;
        size++;
    }
    
    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        T item = top.data;
        top = top.next;
        size--;
        return item;
    }
    
    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return top.data;
    }
    
    public boolean isEmpty() {
        return top == null;
    }
    
    public int size() {
        return size;
    }
}
\`\`\`

## Time Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Push      | O(1)           |
| Pop       | O(1)           |
| Peek      | O(1)           |
| isEmpty   | O(1)           |
| Size      | O(1)           |

Note: For the array implementation, if resizing is needed, push can be O(n) in the worst case. However, the amortized time complexity is still O(1).

## Stack in Standard Libraries

### Java
\`\`\`java
import java.util.Stack;

Stack<Integer> stack = new Stack<>();
stack.push(1);
stack.push(2);
int top = stack.pop(); // 2
boolean empty = stack.isEmpty(); // false
int peek = stack.peek(); // 1
\`\`\`

### Python
\`\`\`python
# Using a list as a stack
stack = []
stack.append(1)
stack.append(2)
top = stack.pop()  # 2
peek = stack[-1]   # 1
empty = len(stack) == 0  # false
\`\`\`

### JavaScript
\`\`\`javascript
// Using an array as a stack
const stack = [];
stack.push(1);
stack.push(2);
const top = stack.pop(); // 2
const peek = stack[stack.length - 1]; // 1
const empty = stack.length === 0; // false
\`\`\`

## Applications of Stacks

1. **Function Call Management**: The call stack keeps track of function calls in programming languages.
2. **Expression Evaluation**: Stacks are used to evaluate arithmetic expressions (infix, postfix, prefix).
3. **Undo Mechanism**: Applications use stacks to implement undo functionality.
4. **Backtracking Algorithms**: Stacks help in algorithms that need to backtrack, like maze solving.
5. **Balanced Parentheses**: Checking if parentheses in an expression are balanced.
6. **Browser History**: The back button in web browsers uses a stack to keep track of visited pages.

## Example: Balanced Parentheses

\`\`\`java
public boolean isBalanced(String expression) {
    Stack<Character> stack = new Stack<>();
    
    for (char c : expression.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (stack.isEmpty()) {
                return false;
            }
            
            char top = stack.pop();
            if ((c == ')' && top != '(') || 
                (c == ']' && top != '[') || 
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}
\`\`\`

## Example: Infix to Postfix Conversion

\`\`\`java
public String infixToPostfix(String infix) {
    StringBuilder postfix = new StringBuilder();
    Stack<Character> stack = new Stack<>();
    
    for (char c : infix.toCharArray()) {
        // If the character is an operand, add it to the result
        if (Character.isLetterOrDigit(c)) {
            postfix.append(c);
        }
        // If the character is '(', push it to the stack
        else if (c == '(') {
            stack.push(c);
        }
        // If the character is ')', pop and add to result until '(' is found
        else if (c == ')') {
            while (!stack.isEmpty() && stack.peek() != '(') {
                postfix.append(stack.pop());
            }
            stack.pop(); // Remove '('
        }
        // If the character is an operator
        else {
            while (!stack.isEmpty() && precedence(c) <= precedence(stack.peek())) {
                postfix.append(stack.pop());
            }
            stack.push(c);
        }
    }
    
    // Pop all remaining operators from the stack
    while (!stack.isEmpty()) {
        postfix.append(stack.pop());
    }
    
    return postfix.toString();
}

private int precedence(char operator) {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '^':
            return 3;
    }
    return -1;
}
\`\`\`

## Stack vs. Heap

It's important to note that the "stack" data structure is different from the "stack" memory region in a program:

- **Stack Data Structure**: The abstract data type we've been discussing.
- **Stack Memory**: A region of memory that stores local variables and function call information.
- **Heap Memory**: A region of memory used for dynamic memory allocation.

## Best Practices

1. Always check if the stack is empty before popping or peeking.
2. Consider using a linked list implementation if the maximum size is unknown.
3. Use an array implementation if memory efficiency is a concern.
4. Be aware of the potential for stack overflow in recursive algorithms.
5. Consider using the standard library implementation unless you have specific requirements.
`
  },
  {
    id: 11,
    topic_id: 3,
    title: "Queue Basics",
    description: "Introduction to queues, implementation, and basic operations.",
    order_index: 2,
    estimated_minutes: 20,
    xp_reward: 15,
    content: `
# Queue Basics

A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. The first element added to the queue is the first one to be removed.

## Queue Operations

The primary operations of a queue are:

1. **Enqueue**: Add an element to the back of the queue
2. **Dequeue**: Remove the front element from the queue
3. **Peek/Front**: View the front element without removing it
4. **isEmpty**: Check if the queue is empty

## Queue Implementation

Queues can be implemented using arrays or linked lists.

### Array Implementation (Circular Queue)

\`\`\`java
public class ArrayQueue<T> {
    private static final int DEFAULT_CAPACITY = 10;
    private T[] array;
    private int front;
    private int rear;
    private int size;
    
    @SuppressWarnings("unchecked")
    public ArrayQueue() {
        array = (T[]) new Object[DEFAULT_CAPACITY];
        front = 0;
        rear = -1;
        size = 0;
    }
    
    public void enqueue(T item) {
        if (size == array.length) {
            resize();
        }
        rear = (rear + 1) % array.length;
        array[rear] = item;
        size++;
    }
    
    public T dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        T item = array[front];
        array[front] = null; // Help garbage collection
        front = (front + 1) % array.length;
        size--;
        return item;
    }
    
    public T peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return array[front];
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public int size() {
        return size;
    }
    
    @SuppressWarnings("unchecked")
    private void resize() {
        T[] newArray = (T[]) new Object[array.length * 2];
        for (int i = 0; i < size; i++) {
            newArray[i] = array[(front + i) % array.length];
        }
        array = newArray;
        front = 0;
        rear = size - 1;
    }
}
\`\`\`

### Linked List Implementation

\`\`\`java
public class LinkedQueue<T> {
    private static class Node<T> {
        private T data;
        private Node<T> next;
        
        public Node(T data) {
            this.data = data;
        }
    }
    
    private Node<T> front;
    private Node<T> rear;
    private int size;
    
    public LinkedQueue() {
        front = null;
        rear = null;
        size = 0;
    }
    
    public void enqueue(T item) {
        Node<T> newNode = new Node<>(item);
        if (isEmpty()) {
            front = newNode;
        } else {
            rear.next = newNode;
        }
        rear = newNode;
        size++;
    }
    
    public T dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        T item = front.data;
        front = front.next;
        if (front == null) {
            rear = null; // Queue is now empty
        }
        size--;
        return item;
    }
    
    public T peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return front.data;
    }
    
    public boolean isEmpty() {
        return front == null;
    }
    
    public int size() {
        return size;
    }
}
\`\`\`

## Time Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Enqueue   | O(1)           |
| Dequeue   | O(1)           |
| Peek      | O(1)           |
| isEmpty   | O(1)           |
| Size      | O(1)           |

Note: For the array implementation, if resizing is needed, enqueue can be O(n) in the worst case. However, the amortized time complexity is still O(1).

## Queue in Standard Libraries

### Java
\`\`\`java
import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> queue = new LinkedList<>();
queue.add(1);
queue.add(2);
int front = queue.remove(); // 1
boolean empty = queue.isEmpty(); // false
int peek = queue.peek(); // 2
\`\`\`

### Python
\`\`\`python
from collections import deque

queue = deque()
queue.append(1)
queue.append(2)
front = queue.popleft()  # 1
peek = queue[0]  # 2
empty = len(queue) == 0  # false
\`\`\`

### JavaScript
\`\`\`javascript
// Using an array as a queue (not efficient for large queues)
const queue = [];
queue.push(1);
queue.push(2);
const front = queue.shift(); // 1
const peek = queue[0]; // 2
const empty = queue.length === 0; // false
\`\`\`

## Applications of Queues

1. **CPU Scheduling**: Operating systems use queues for process scheduling.
2. **Breadth-First Search**: Queues are used in BFS algorithms for graph traversal.
3. **Print Queue**: Printer jobs are processed in the order they are received.
4. **Message Queues**: Used in distributed systems for asynchronous communication.
5. **Buffering**: Used in scenarios where data is transferred between processes at different rates.
6. **Waiting Lists**: Managing customers or requests in a first-come, first-served manner.

## Example: Level Order Traversal of a Binary Tree

\`\`\`java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) {
        return result;
    }
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.remove();
            currentLevel.add(node.val);
            
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        
        result.add(currentLevel);
    }
    
    return result;
}
\`\`\`

## Types of Queues

### 1. Simple Queue
The basic queue we've discussed, with FIFO behavior.

### 2. Circular Queue
A queue where the last position is connected to the first position, forming a circle. This is often used in array implementations to efficiently use space.

### 3. Priority Queue
A queue where elements have priorities, and higher priority elements are dequeued before lower priority ones.

\`\`\`java
import java.util.PriorityQueue;

PriorityQueue<Integer> pq = new PriorityQueue<>(); // Min heap by default
pq.add(3);
pq.add(1);
pq.add(2);
int highest = pq.poll(); // 1 (lowest value has highest priority)

// For max heap
PriorityQueue<Integer> maxPq = new PriorityQueue<>(Collections.reverseOrder());
maxPq.add(3);
maxPq.add(1);
maxPq.add(2);
int highest = maxPq.poll(); // 3 (highest value has highest priority)
\`\`\`

### 4. Deque (Double-Ended Queue)
A queue that allows insertion and removal of elements from both ends.

\`\`\`java
import java.util.Deque;
import java.util.LinkedList;

Deque<Integer> deque = new LinkedList<>();
deque.addFirst(1);
deque.addLast(2);
int first = deque.removeFirst(); // 1
int last = deque.removeLast(); // 2
\`\`\`

## Best Practices

1. Always check if the queue is empty before dequeuing or peeking.
2. Use a circular array implementation for better space efficiency.
3. Consider using a linked list implementation if the maximum size is unknown.
4. Choose the appropriate queue type based on your requirements.
5. Use the standard library implementation unless you have specific requirements.
6. Be aware of the potential for queue overflow in bounded queues.
`
  },
  {
    id: 12,
    topic_id: 3,
    title: "Stack and Queue Problems",
    description: "Common problems and techniques for solving stack and queue questions.",
    order_index: 3,
    estimated_minutes: 30,
    xp_reward: 25,
    content: `
# Stack and Queue Problems

This lesson covers common stack and queue problems and techniques for solving them in coding interviews.

## Common Stack Problems

### 1. Valid Parentheses

Problem: Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Solution:

\`\`\`java
public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty()) {
                return false;
            }
            
            char top = stack.pop();
            if ((c == ')' && top != '(') || 
                (c == ']' && top != '[') || 
                (c == '}' && top != '{')) {
                return false;
            }
        }
    }
    
    return stack.isEmpty();
}
\`\`\`

### 2. Min Stack

Problem: Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Solution:

\`\`\`java
class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;
    
    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }
    
    public void pop() {
        if (stack.isEmpty()) {
            return;
        }
        
        int val = stack.pop();
        if (val == minStack.peek()) {
            minStack.pop();
        }
    }
    
    public int top() {
        if (stack.isEmpty()) {
            throw new EmptyStackException();
        }
        return stack.peek();
    }
    
    public int getMin() {
        if (minStack.isEmpty()) {
            throw new EmptyStackException();
        }
        return minStack.peek();
    }
}
\`\`\`

### 3. Evaluate Reverse Polish Notation

Problem: Evaluate the value of an arithmetic expression in Reverse Polish Notation (postfix notation).

Solution:

\`\`\`java
public int evalRPN(String[] tokens) {
    Stack<Integer> stack = new Stack<>();
    
    for (String token : tokens) {
        if (token.equals("+") || token.equals("-") || token.equals("*") || token.equals("/")) {
            int b = stack.pop();
            int a = stack.pop();
            
            switch (token) {
                case "+":
                    stack.push(a + b);
                    break;
                case "-":
                    stack.push(a - b);
                    break;
                case "*":
                    stack.push(a * b);
                    break;
                case "/":
                    stack.push(a / b);
                    break;
            }
        } else {
            stack.push(Integer.parseInt(token));
        }
    }
    
    return stack.pop();
}
\`\`\`

### 4. Largest Rectangle in Histogram

Problem: Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.

Solution:

\`\`\`java
public int largestRectangleArea(int[] heights) {
    Stack<Integer> stack = new Stack<>();
    int maxArea = 0;
    int i = 0;
    
    while (i < heights.length) {
        // If stack is empty or current height is greater than the top of stack
        if (stack.isEmpty() || heights[i] >= heights[stack.peek()]) {
            stack.push(i++);
        } else {
            // Calculate area with the top of stack as the smallest bar
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
    }
    
    // Process remaining elements in the stack
    while (!stack.isEmpty()) {
        int height = heights[stack.pop()];
        int width = stack.isEmpty() ? i : i - stack.peek() - 1;
        maxArea = Math.max(maxArea, height * width);
    }
    
    return maxArea;
}
\`\`\`

## Common Queue Problems

### 1. Implement Stack using Queues

Problem: Implement a last-in-first-out (LIFO) stack using only two queues.

Solution:

\`\`\`java
class MyStack {
    private Queue<Integer> q1;
    private Queue<Integer> q2;
    
    public MyStack() {
        q1 = new LinkedList<>();
        q2 = new LinkedList<>();
    }
    
    // Push element x onto stack
    public void push(int x) {
        q1.add(x);
    }
    
    // Removes the element on top of the stack and returns it
    public int pop() {
        if (q1.isEmpty()) {
            throw new EmptyStackException();
        }
        
        // Move all elements except the last one from q1 to q2
        while (q1.size() > 1) {
            q2.add(q1.remove());
        }
        
        // Get the last element from q1 (top of the stack)
        int top = q1.remove();
        
        // Swap q1 and q2
        Queue<Integer> temp = q1;
        q1 = q2;
        q2 = temp;
        
        return top;
    }
    
    // Get the top element
    public int top() {
        if (q1.isEmpty()) {
            throw new EmptyStackException();
        }
        
        // Move all elements except the last one from q1 to q2
        while (q1.size() > 1) {
            q2.add(q1.remove());
        }
        
        // Get the last element from q1 (top of the stack)
        int top = q1.remove();
        
        // Add the top element to q2
        q2.add(top);
        
        // Swap q1 and q2
        Queue<Integer> temp = q1;
        q1 = q2;
        q2 = temp;
        
        return top;
    }
    
    // Return whether the stack is empty
    public boolean empty() {
        return q1.isEmpty();
    }
}
\`\`\`

### 2. Implement Queue using Stacks

Problem: Implement a first-in-first-out (FIFO) queue using only two stacks.

Solution:

\`\`\`java
class MyQueue {
    private Stack<Integer> stack1; // for push
    private Stack<Integer> stack2; // for pop
    
    public MyQueue() {
        stack1 = new Stack<>();
        stack2 = new Stack<>();
    }
    
    // Push element x to the back of queue
    public void push(int x) {
        stack1.push(x);
    }
    
    // Removes the element from the front of queue and returns it
    public int pop() {
        if (empty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        
        // If stack2 is empty, transfer all elements from stack1
        if (stack2.isEmpty()) {
            while (!stack1.isEmpty()) {
                stack2.push(stack1.pop());
            }
        }
        
        return stack2.pop();
    }
    
    // Get the front element
    public int peek() {
        if (empty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        
        // If stack2 is empty, transfer all elements from stack1
        if (stack2.isEmpty()) {
            while (!stack1.isEmpty()) {
                stack2.push(stack1.pop());
            }
        }
        
        return stack2.peek();
    }
    
    // Return whether the queue is empty
    public boolean empty() {
        return stack1.isEmpty() && stack2.isEmpty();
    }
}
\`\`\`

### 3. Sliding Window Maximum

Problem: Given an array nums and a sliding window of size k moving from the left of the array to the right, return the maximum element in each window.

Solution using a Deque:

\`\`\`java
public int[] maxSlidingWindow(int[] nums, int k) {
    if (nums == null || nums.length == 0 || k <= 0) {
        return new int[0];
    }
    
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new LinkedList<>(); // Store indices
    
    for (int i = 0; i < n; i++) {
        // Remove elements outside the window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.removeFirst();
        }
        
        // Remove smaller elements as they are not useful
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.removeLast();
        }
        
        // Add current element
        deque.addLast(i);
        
        // Add to result if we have a full window
        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }
    
    return result;
}
\`\`\`

### 4. Design Circular Queue

Problem: Design your implementation of the circular queue.

Solution:

\`\`\`java
class MyCircularQueue {
    private int[] queue;
    private int front;
    private int rear;
    private int size;
    private int capacity;
    
    public MyCircularQueue(int k) {
        queue = new int[k];
        front = 0;
        rear = -1;
        size = 0;
        capacity = k;
    }
    
    public boolean enQueue(int value) {
        if (isFull()) {
            return false;
        }
        
        rear = (rear + 1) % capacity;
        queue[rear] = value;
        size++;
        return true;
    }
    
    public boolean deQueue() {
        if (isEmpty()) {
            return false;
        }
        
        front = (front + 1) % capacity;
        size--;
        return true;
    }
    
    public int Front() {
        if (isEmpty()) {
            return -1;
        }
        return queue[front];
    }
    
    public int Rear() {
        if (isEmpty()) {
            return -1;
        }
        return queue[rear];
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public boolean isFull() {
        return size == capacity;
    }
}
\`\`\`

## Techniques for Solving Stack and Queue Problems

### 1. Recognizing Stack Problems
- Problems involving matching or balancing elements
- Problems requiring last-in-first-out processing
- Problems involving parsing expressions
- Problems requiring backtracking or undo operations

### 2. Recognizing Queue Problems
- Problems involving first-in-first-out processing
- Problems requiring level-by-level processing
- Problems involving breadth-first search
- Problems requiring ordering based on arrival time

### 3. Using Two Stacks/Queues
Many problems can be solved by using two stacks or two queues, where one data structure is used for input and the other for output.

### 4. Using Monotonic Stacks/Queues
A monotonic stack/queue maintains elements in increasing or decreasing order, which is useful for problems like finding the next greater element or sliding window maximum.

### 5. Using Deques
Deques (double-ended queues) combine the features of stacks and queues, allowing efficient operations at both ends.

## Tips for Stack and Queue Problems in Interviews

1. **Identify the pattern**: Determine if the problem is a good fit for a stack or queue.
2. **Consider edge cases**: Empty stacks/queues, single-element stacks/queues, etc.
3. **Optimize space**: Sometimes you can use a single data structure instead of two.
4. **Use standard libraries**: Unless asked to implement from scratch, use built-in stack and queue implementations.
5. **Draw it out**: Visualize the operations to better understand the problem.
6. **Test with examples**: Use small examples to verify your approach.
7. **Consider time and space complexity**: Aim for O(n) time and O(n) space or better.
`
  },
  {
    id: 13,
    topic_id: 3,
    title: "Advanced Stack and Queue Applications",
    description: "Advanced applications and variations of stacks and queues.",
    order_index: 4,
    estimated_minutes: 25,
    xp_reward: 20,
    content: `
# Advanced Stack and Queue Applications

This lesson covers advanced applications and variations of stacks and queues used in real-world systems and algorithms.

## Advanced Stack Applications

### 1. Expression Evaluation

Stacks can be used to evaluate arithmetic expressions in various notations:

#### Infix Evaluation (with Precedence)

\`\`\`java
public int evaluateInfix(String expression) {
    Stack<Integer> values = new Stack<>();
    Stack<Character> operators = new Stack<>();
    
    for (int i = 0; i < expression.length(); i++) {
        char c = expression.charAt(i);
        
        // Skip whitespace
        if (c == ' ') {
            continue;
        }
        
        // If the character is a digit, parse the number
        if (Character.isDigit(c)) {
            StringBuilder sb = new StringBuilder();
            while (i < expression.length() && Character.isDigit(expression.charAt(i))) {
                sb.append(expression.charAt(i++));
            }
            i--; // Adjust for the loop increment
            values.push(Integer.parseInt(sb.toString()));
        }
        // If the character is an opening bracket, push it to the operators stack
        else if (c == '(') {
            operators.push(c);
        }
        // If the character is a closing bracket, solve the inner expression
        else if (c == ')') {
            while (!operators.isEmpty() && operators.peek() != '(') {
                values.push(applyOperation(operators.pop(), values.pop(), values.pop()));
            }
            operators.pop(); // Remove the '('
        }
        // If the character is an operator
        else if (c == '+' || c == '-' || c == '*' || c == '/') {
            while (!operators.isEmpty() && precedence(c) <= precedence(operators.peek())) {
                values.push(applyOperation(operators.pop(), values.pop(), values.pop()));
            }
            operators.push(c);
        }
    }
    
    // Process any remaining operators
    while (!operators.isEmpty()) {
        values.push(applyOperation(operators.pop(), values.pop(), values.pop()));
    }
    
    return values.pop();
}

private int precedence(char op) {
    if (op == '+' || op == '-') {
        return 1;
    }
    if (op == '*' || op == '/') {
        return 2;
    }
    return 0;
}

private int applyOperation(char op, int b, int a) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
    }
    return 0;
}
\`\`\`

### 2. Syntax Parsing

Stacks are used in compilers and interpreters for syntax parsing, particularly for checking nested structures like parentheses, brackets, and braces.

### 3. Backtracking Algorithms

Stacks are essential for implementing backtracking algorithms, such as:

#### Depth-First Search (DFS)

\`\`\`java
public void dfs(Graph graph, int start) {
    boolean[] visited = new boolean[graph.getVertexCount()];
    Stack<Integer> stack = new Stack<>();
    
    stack.push(start);
    
    while (!stack.isEmpty()) {
        int vertex = stack.pop();
        
        if (!visited[vertex]) {
            visited[vertex] = true;
            System.out.print(vertex + " ");
            
            // Get all adjacent vertices
            List<Integer> neighbors = graph.getNeighbors(vertex);
            
            // Push all unvisited neighbors to the stack
            for (int neighbor : neighbors) {
                if (!visited[neighbor]) {
                    stack.push(neighbor);
                }
            }
        }
    }
}
\`\`\`

#### Maze Solving

\`\`\`java
public List<Point> solveMaze(int[][] maze, Point start, Point end) {
    int rows = maze.length;
    int cols = maze[0].length;
    boolean[][] visited = new boolean[rows][cols];
    Stack<Point> stack = new Stack<>();
    Map<Point, Point> parentMap = new HashMap<>();
    
    // Directions: up, right, down, left
    int[] dx = {-1, 0, 1, 0};
    int[] dy = {0, 1, 0, -1};
    
    stack.push(start);
    visited[start.x][start.y] = true;
    
    while (!stack.isEmpty()) {
        Point current = stack.pop();
        
        if (current.equals(end)) {
            // Found the end, reconstruct the path
            return reconstructPath(parentMap, start, end);
        }
        
        // Try all four directions
        for (int i = 0; i < 4; i++) {
            int newX = current.x + dx[i];
            int newY = current.y + dy[i];
            Point next = new Point(newX, newY);
            
            // Check if the new position is valid
            if (isValid(maze, visited, newX, newY)) {
                stack.push(next);
                visited[newX][newY] = true;
                parentMap.put(next, current);
            }
        }
    }
    
    // No path found
    return Collections.emptyList();
}

private boolean isValid(int[][] maze, boolean[][] visited, int x, int y) {
    int rows = maze.length;
    int cols = maze[0].length;
    
    return x >= 0 && x < rows && y >= 0 && y < cols && maze[x][y] == 0 && !visited[x][y];
}

private List<Point> reconstructPath(Map<Point, Point> parentMap, Point start, Point end) {
    List<Point> path = new ArrayList<>();
    Point current = end;
    
    while (!current.equals(start)) {
        path.add(current);
        current = parentMap.get(current);
    }
    
    path.add(start);
    Collections.reverse(path);
    
    return path;
}
\`\`\`

### 4. Function Call Stack Simulation

Stacks can be used to simulate the function call stack, which is useful for algorithms that would normally use recursion but need to avoid stack overflow.

\`\`\`java
public int factorial(int n) {
    Stack<Integer> stack = new Stack<>();
    Stack<Integer> results = new Stack<>();
    
    stack.push(n);
    results.push(1);
    
    while (!stack.isEmpty()) {
        int current = stack.pop();
        int result = results.pop();
        
        if (current <= 1) {
            results.push(result);
        } else {
            stack.push(current - 1);
            results.push(result * current);
        }
    }
    
    return results.pop();
}
\`\`\`

## Advanced Queue Applications

### 1. Breadth-First Search (BFS)

Queues are fundamental for BFS algorithms, which are used for finding the shortest path in unweighted graphs.

\`\`\`java
public void bfs(Graph graph, int start) {
    boolean[] visited = new boolean[graph.getVertexCount()];
    Queue<Integer> queue = new LinkedList<>();
    
    visited[start] = true;
    queue.add(start);
    
    while (!queue.isEmpty()) {
        int vertex = queue.remove();
        System.out.print(vertex + " ");
        
        // Get all adjacent vertices
        List<Integer> neighbors = graph.getNeighbors(vertex);
        
        // Enqueue all unvisited neighbors
        for (int neighbor : neighbors) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.add(neighbor);
            }
        }
    }
}
\`\`\`

### 2. Level Order Processing

Queues are used for level-by-level processing of hierarchical structures like trees.

\`\`\`java
public List<List<Integer>> levelOrderTraversal(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) {
        return result;
    }
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.remove();
            currentLevel.add(node.val);
            
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        
        result.add(currentLevel);
    }
    
    return result;
}
\`\`\`

### 3. Shortest Path in a Maze

BFS can be used to find the shortest path in a maze or grid.

\`\`\`java
public int shortestPath(int[][] grid, Point start, Point end) {
    int rows = grid.length;
    int cols = grid[0].length;
    boolean[][] visited = new boolean[rows][cols];
    Queue<Point> queue = new LinkedList<>();
    Queue<Integer> distances = new LinkedList<>();
    
    // Directions: up, right, down, left
    int[] dx = {-1, 0, 1, 0};
    int[] dy = {0, 1, 0, -1};
    
    queue.add(start);
    distances.add(0);
    visited[start.x][start.y] = true;
    
    while (!queue.isEmpty()) {
        Point current = queue.remove();
        int distance = distances.remove();
        
        if (current.equals(end)) {
            return distance;
        }
        
        // Try all four directions
        for (int i = 0; i < 4; i++) {
            int newX = current.x + dx[i];
            int newY = current.y + dy[i];
            
            // Check if the new position is valid
            if (isValid(grid, visited, newX, newY)) {
                queue.add(new Point(newX, newY));
                distances.add(distance + 1);
                visited[newX][newY] = true;
            }
        }
    }
    
    // No path found
    return -1;
}
\`\`\`

### 4. Task Scheduling

Priority queues are used for task scheduling in operating systems and other applications.

\`\`\`java
class Task implements Comparable<Task> {
    private int id;
    private int priority;
    private String description;
    
    public Task(int id, int priority, String description) {
        this.id = id;
        this.priority = priority;
        this.description = description;
    }
    
    @Override
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
    
    // Getters and setters
}

public class TaskScheduler {
    private PriorityQueue<Task> taskQueue;
    
    public TaskScheduler() {
        taskQueue = new PriorityQueue<>();
    }
    
    public void addTask(Task task) {
        taskQueue.add(task);
    }
    
    public Task getNextTask() {
        if (taskQueue.isEmpty()) {
            return null;
        }
        return taskQueue.poll();
    }
    
    public boolean hasMoreTasks() {
        return !taskQueue.isEmpty();
    }
}
\`\`\`

## Advanced Data Structures Based on Stacks and Queues

### 1. LRU Cache (Least Recently Used)

An LRU cache uses a combination of a doubly linked list and a hash map to achieve O(1) operations.

\`\`\`java
class LRUCache {
    private class Node {
        int key;
        int value;
        Node prev;
        Node next;
    }
    
    private int capacity;
    private Map<Integer, Node> cache;
    private Node head, tail;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        cache = new HashMap<>();
        head = new Node();
        tail = new Node();
        head.next = tail;
        tail.prev = head;
    }
    
    public int get(int key) {
        Node node = cache.get(key);
        if (node == null) {
            return -1;
        }
        
        // Move to head (most recently used)
        moveToHead(node);
        return node.value;
    }
    
    public void put(int key, int value) {
        Node node = cache.get(key);
        
        if (node == null) {
            Node newNode = new Node();
            newNode.key = key;
            newNode.value = value;
            
            cache.put(key, newNode);
            addNode(newNode);
            
            if (cache.size() > capacity) {
                // Remove the least recently used item
                Node tail = popTail();
                cache.remove(tail.key);
            }
        } else {
            // Update the value
            node.value = value;
            moveToHead(node);
        }
    }
    
    private void addNode(Node node) {
        node.prev = head;
        node.next = head.next;
        
        head.next.prev = node;
        head.next = node;
    }
    
    private void removeNode(Node node) {
        Node prev = node.prev;
        Node next = node.next;
        
        prev.next = next;
        next.prev = prev;
    }
    
    private void moveToHead(Node node) {
        removeNode(node);
        addNode(node);
    }
    
    private Node popTail() {
        Node res = tail.prev;
        removeNode(res);
        return res;
    }
}
\`\`\`

### 2. Trie (Prefix Tree)

A trie is a tree-like data structure that can be implemented using queues for operations like breadth-first traversal.

\`\`\`java
class TrieNode {
    private Map<Character, TrieNode> children;
    private boolean isEndOfWord;
    
    public TrieNode() {
        children = new HashMap<>();
        isEndOfWord = false;
    }
    
    public Map<Character, TrieNode> getChildren() {
        return children;
    }
    
    public boolean isEndOfWord() {
        return isEndOfWord;
    }
    
    public void setEndOfWord(boolean endOfWord) {
        isEndOfWord = endOfWord;
    }
}

class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void insert(String word) {
        TrieNode current = root;
        
        for (char c : word.toCharArray()) {
            current.getChildren().putIfAbsent(c, new TrieNode());
            current = current.getChildren().get(c);
        }
        
        current.setEndOfWord(true);
    }
    
    public boolean search(String word) {
        TrieNode node = searchPrefix(word);
        return node != null && node.isEndOfWord();
    }
    
    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }
    
    private TrieNode searchPrefix(String word) {
        TrieNode current = root;
        
        for (char c : word.toCharArray()) {
            if (!current.getChildren().containsKey(c)) {
                return null;
            }
            current = current.getChildren().get(c);
        }
        
        return current;
    }
    
    // BFS traversal of the trie
    public List<String> getAllWords() {
        List<String> result = new ArrayList<>();
        Queue<TrieNode> nodeQueue = new LinkedList<>();
        Queue<String> prefixQueue = new LinkedList<>();
        
        nodeQueue.add(root);
        prefixQueue.add("");
        
        while (!nodeQueue.isEmpty()) {
            TrieNode current = nodeQueue.remove();
            String prefix = prefixQueue.remove();
            
            if (current.isEndOfWord()) {
                result.add(prefix);
            }
            
            for (Map.Entry<Character, TrieNode> entry : current.getChildren().entrySet()) {
                char c = entry.getKey();
                TrieNode child = entry.getValue();
                
                nodeQueue.add(child);
                prefixQueue.add(prefix + c);
            }
        }
        
        return result;
    }
}
\`\`\`

### 3. Graph Algorithms

Many graph algorithms use stacks (for DFS) or queues (for BFS) as their core data structure.

#### Topological Sort

\`\`\`java
public List<Integer> topologicalSort(Graph graph) {
    int vertices = graph.getVertexCount();
    boolean[] visited = new boolean[vertices];
    Stack<Integer> stack = new Stack<>();
    
    // Visit all vertices
    for (int i = 0; i < vertices; i++) {
        if (!visited[i]) {
            topologicalSortUtil(graph, i, visited, stack);
        }
    }
    
    // Create result list from stack
    List<Integer> result = new ArrayList<>();
    while (!stack.isEmpty()) {
        result.add(stack.pop());
    }
    
    return result;
}

private void topologicalSortUtil(Graph graph, int vertex, boolean[] visited, Stack<Integer> stack) {
    visited[vertex] = true;
    
    // Visit all adjacent vertices
    for (int neighbor : graph.getNeighbors(vertex)) {
        if (!visited[neighbor]) {
            topologicalSortUtil(graph, neighbor, visited, stack);
        }
    }
    
    // Push current vertex to stack
    stack.push(vertex);
}
\`\`\`

## Best Practices for Advanced Stack and Queue Applications

1. **Choose the right data structure**: Understand the problem requirements and select the appropriate data structure.
2. **Consider time and space complexity**: Optimize for the specific constraints of your problem.
3. **Use standard libraries**: Leverage built-in implementations for common operations.
4. **Handle edge cases**: Consider empty structures, single-element structures, and other edge cases.
5. **Test thoroughly**: Verify your solution with various test cases.
6. **Document your code**: Explain complex algorithms and data structures for maintainability.
7. **Consider thread safety**: If your application is multi-threaded, use thread-safe implementations or add synchronization.
`
  }
];

module.exports = stacksQueuesLessons;
