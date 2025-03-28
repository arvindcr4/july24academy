// Practice problems for Stacks and Queues topic
// Based on "Cracking the Coding Interview" by Gayle Laakmann McDowell

const stacksQueuesProblems = [
  {
    id: 11,
    topic_id: 3,
    title: "Three in One",
    description: "Describe how you could use a single array to implement three stacks.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 20,
    details: {
      starter_code: `class FixedMultiStack {
    // Your implementation here
}`,
      test_cases: `// Create a three-stack structure with capacity 10 per stack
FixedMultiStack stacks = new FixedMultiStack(10);

// Stack 0 operations
stacks.push(0, 1);
stacks.push(0, 2);
stacks.push(0, 3);
int value1 = stacks.pop(0); // Should return 3

// Stack 1 operations
stacks.push(1, 4);
stacks.push(1, 5);
int value2 = stacks.peek(1); // Should return 5

// Stack 2 operations
stacks.push(2, 6);
boolean isEmpty = stacks.isEmpty(2); // Should return false
stacks.pop(2); // Should return 6
isEmpty = stacks.isEmpty(2); // Should return true`,
      constraints: `You must use a single array to implement three stacks.
Each stack should have the same capacity.
The implementation should handle stack overflow and underflow.`,
      input_format: "N/A - This is a design problem",
      output_format: "N/A - This is a design problem",
      time_complexity: "O(1) for all operations",
      space_complexity: "O(n) where n is the total capacity of all stacks"
    },
    hints: [
      "Consider dividing the array into three equal parts, one for each stack.",
      "Keep track of the top element index for each stack.",
      "For a more space-efficient approach, consider a flexible division that allows stacks to use more space when needed."
    ],
    solution: `// Solution 1: Fixed Division
class FixedMultiStack {
    private int numberOfStacks = 3;
    private int stackCapacity;
    private int[] values;
    private int[] sizes;
    
    public FixedMultiStack(int stackSize) {
        stackCapacity = stackSize;
        values = new int[stackSize * numberOfStacks];
        sizes = new int[numberOfStacks];
    }
    
    // Push value onto stack
    public void push(int stackNum, int value) throws FullStackException {
        // Check if we have space
        if (isFull(stackNum)) {
            throw new FullStackException();
        }
        
        // Increment stack pointer and update top value
        sizes[stackNum]++;
        values[indexOfTop(stackNum)] = value;
    }
    
    // Pop item from stack
    public int pop(int stackNum) throws EmptyStackException {
        if (isEmpty(stackNum)) {
            throw new EmptyStackException();
        }
        
        int topIndex = indexOfTop(stackNum);
        int value = values[topIndex]; // Get top value
        values[topIndex] = 0; // Clear
        sizes[stackNum]--; // Shrink
        return value;
    }
    
    // Return top element
    public int peek(int stackNum) throws EmptyStackException {
        if (isEmpty(stackNum)) {
            throw new EmptyStackException();
        }
        return values[indexOfTop(stackNum)];
    }
    
    // Return if stack is empty
    public boolean isEmpty(int stackNum) {
        return sizes[stackNum] == 0;
    }
    
    // Return if stack is full
    public boolean isFull(int stackNum) {
        return sizes[stackNum] == stackCapacity;
    }
    
    // Return index of the top of the stack
    private int indexOfTop(int stackNum) {
        int offset = stackNum * stackCapacity;
        int size = sizes[stackNum];
        return offset + size - 1;
    }
}

// Solution 2: Flexible Division
class FlexibleMultiStack {
    private class StackInfo {
        public int start, size, capacity;
        
        public StackInfo(int start, int capacity) {
            this.start = start;
            this.capacity = capacity;
            this.size = 0;
        }
        
        public boolean isWithinStack(int index) {
            // If outside of bounds of array, return false
            if (index < 0 || index >= values.length) {
                return false;
            }
            
            // If index wraps around, adjust it
            int contiguousIndex = index < start ? index + values.length : index;
            int end = start + capacity;
            return start <= contiguousIndex && contiguousIndex < end;
        }
        
        public int lastCapacityIndex() {
            return adjustIndex(start + capacity - 1);
        }
        
        public int lastElementIndex() {
            return size == 0 ? -1 : adjustIndex(start + size - 1);
        }
        
        public boolean isFull() {
            return size == capacity;
        }
        
        public boolean isEmpty() {
            return size == 0;
        }
    }
    
    private StackInfo[] info;
    private int[] values;
    
    public FlexibleMultiStack(int numberOfStacks, int defaultSize) {
        info = new StackInfo[numberOfStacks];
        for (int i = 0; i < numberOfStacks; i++) {
            info[i] = new StackInfo(defaultSize * i, defaultSize);
        }
        values = new int[numberOfStacks * defaultSize];
    }
    
    // Push value onto stack num
    public void push(int stackNum, int value) throws FullStackException {
        if (allStacksAreFull()) {
            throw new FullStackException();
        }
        
        // If this stack is full, expand it
        StackInfo stack = info[stackNum];
        if (stack.isFull()) {
            expand(stackNum);
        }
        
        // Find the index of the top element in the array + 1, and increment the stack pointer
        stack.size++;
        values[adjustIndex(stack.lastElementIndex())] = value;
    }
    
    // Remove value from stack
    public int pop(int stackNum) throws EmptyStackException {
        StackInfo stack = info[stackNum];
        if (stack.isEmpty()) {
            throw new EmptyStackException();
        }
        
        // Remove last element
        int value = values[adjustIndex(stack.lastElementIndex())];
        values[adjustIndex(stack.lastElementIndex())] = 0; // Clear item
        stack.size--; // Shrink size
        return value;
    }
    
    // Get top element
    public int peek(int stackNum) throws EmptyStackException {
        StackInfo stack = info[stackNum];
        if (stack.isEmpty()) {
            throw new EmptyStackException();
        }
        return values[adjustIndex(stack.lastElementIndex())];
    }
    
    // Shift items in stack over by one element
    private void shift(int stackNum) {
        StackInfo stack = info[stackNum];
        
        // If this stack is at its full capacity, move next stack over
        if (stack.size >= stack.capacity) {
            int nextStack = (stackNum + 1) % info.length;
            shift(nextStack);
            stack.capacity++;
        }
        
        // Shift all elements in stack over by one
        int index = stack.lastCapacityIndex();
        while (stack.isWithinStack(index)) {
            values[index] = values[previousIndex(index)];
            index = previousIndex(index);
        }
        
        // Adjust stack data
        values[stack.start] = 0; // Clear item
        stack.start = nextIndex(stack.start); // Move start
        stack.capacity--; // Shrink capacity
    }
    
    // Expand stack by shifting over other stacks
    private void expand(int stackNum) {
        shift((stackNum + 1) % info.length);
        info[stackNum].capacity++;
    }
    
    // Returns true if all stacks are full
    private boolean allStacksAreFull() {
        return numberOfElements() == values.length;
    }
    
    // Returns the number of elements in all stacks
    private int numberOfElements() {
        int size = 0;
        for (StackInfo sd : info) {
            size += sd.size;
        }
        return size;
    }
    
    // Adjust index to be within the range of 0 -> length - 1
    private int adjustIndex(int index) {
        int max = values.length;
        return ((index % max) + max) % max;
    }
    
    // Get the previous index, adjusted for wrap-around
    private int previousIndex(int index) {
        return adjustIndex(index - 1);
    }
    
    // Get the next index, adjusted for wrap-around
    private int nextIndex(int index) {
        return adjustIndex(index + 1);
    }
}`
  },
  {
    id: 12,
    topic_id: 3,
    title: "Stack Min",
    description: "How would you design a stack which, in addition to push and pop, has a function min which returns the minimum element? Push, pop and min should all operate in O(1) time.",
    difficulty: "medium",
    estimated_minutes: 15,
    xp_reward: 15,
    details: {
      starter_code: `class MinStack {
    // Your implementation here
}`,
      test_cases: `MinStack stack = new MinStack();
stack.push(5);
stack.push(6);
stack.push(3);
stack.push(7);
int min1 = stack.min(); // Should return 3
stack.pop(); // Removes 7
int min2 = stack.min(); // Should still return 3
stack.pop(); // Removes 3
int min3 = stack.min(); // Should return 5`,
      constraints: `All operations must be O(1) time complexity.
The stack can contain duplicate values.`,
      input_format: "N/A - This is a design problem",
      output_format: "N/A - This is a design problem",
      time_complexity: "O(1) for all operations",
      space_complexity: "O(n) where n is the number of elements in the stack"
    },
    hints: [
      "Consider keeping track of the minimum at each state of the stack.",
      "What if you had a separate stack that kept track of the minimums?",
      "When would you push to and pop from this second stack?"
    ],
    solution: `// Solution 1: Using an additional stack to track minimums
class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;
    
    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int value) {
        stack.push(value);
        
        // If minStack is empty or the new value is less than or equal to the current minimum,
        // push it onto minStack
        if (minStack.isEmpty() || value <= minStack.peek()) {
            minStack.push(value);
        }
    }
    
    public int pop() {
        if (stack.isEmpty()) {
            throw new EmptyStackException();
        }
        
        int value = stack.pop();
        
        // If the popped value is the current minimum, remove it from minStack as well
        if (value == minStack.peek()) {
            minStack.pop();
        }
        
        return value;
    }
    
    public int top() {
        if (stack.isEmpty()) {
            throw new EmptyStackException();
        }
        
        return stack.peek();
    }
    
    public int min() {
        if (minStack.isEmpty()) {
            throw new EmptyStackException();
        }
        
        return minStack.peek();
    }
}

// Solution 2: Each node stores the minimum at its state
class MinStack2 {
    private class StackNode {
        private int value;
        private int min;
        private StackNode next;
        
        public StackNode(int value, int min) {
            this.value = value;
            this.min = min;
        }
    }
    
    private StackNode top;
    
    public MinStack2() {
        top = null;
    }
    
    public void push(int value) {
        int newMin = (top == null) ? value : Math.min(value, top.min);
        StackNode node = new StackNode(value, newMin);
        node.next = top;
        top = node;
    }
    
    public int pop() {
        if (top == null) {
            throw new EmptyStackException();
        }
        
        int value = top.value;
        top = top.next;
        return value;
    }
    
    public int top() {
        if (top == null) {
            throw new EmptyStackException();
        }
        
        return top.value;
    }
    
    public int min() {
        if (top == null) {
            throw new EmptyStackException();
        }
        
        return top.min;
    }
}`
  },
  {
    id: 13,
    topic_id: 3,
    title: "Stack of Plates",
    description: "Imagine a (literal) stack of plates. If the stack gets too high, it might topple. Therefore, in real life, we would likely start a new stack when the previous stack exceeds some threshold. Implement a data structure SetOfStacks that mimics this. SetOfStacks should be composed of several stacks and should create a new stack once the previous one exceeds capacity. SetOfStacks.push() and SetOfStacks.pop() should behave identically to a single stack (that is, pop() should return the same values as it would if there were just a single stack). FOLLOW UP: Implement a function popAt(int index) which performs a pop operation on a specific sub-stack.",
    difficulty: "hard",
    estimated_minutes: 25,
    xp_reward: 25,
    details: {
      starter_code: `class SetOfStacks {
    // Your implementation here
}`,
      test_cases: `SetOfStacks stacks = new SetOfStacks(3); // Capacity of 3 per stack
stacks.push(1);
stacks.push(2);
stacks.push(3);
stacks.push(4); // Should create a new stack
stacks.push(5);
int value1 = stacks.pop(); // Should return 5
int value2 = stacks.pop(); // Should return 4
int value3 = stacks.pop(); // Should return 3

// Follow up
SetOfStacks stacks2 = new SetOfStacks(3);
for (int i = 1; i <= 9; i++) {
    stacks2.push(i);
}
int value4 = stacks2.popAt(0); // Should return 3 (top of first stack)
int value5 = stacks2.popAt(1); // Should return 6 (top of second stack)`,
      constraints: `Each individual stack has a fixed capacity.
The data structure should create a new stack when the previous one is full.
The pop operation should behave as if there was just a single stack.`,
      input_format: "N/A - This is a design problem",
      output_format: "N/A - This is a design problem",
      time_complexity: "O(1) for push and pop, O(n) for popAt",
      space_complexity: "O(n) where n is the total number of elements"
    },
    hints: [
      "You will need to keep track of the capacity and size of each stack.",
      "For the follow-up, consider what happens when you pop from a stack that's not the last one.",
      "Do you want to maintain the property that each stack (except possibly the last one) is at full capacity?"
    ],
    solution: `import java.util.ArrayList;
import java.util.EmptyStackException;

class SetOfStacks {
    private ArrayList<Stack> stacks = new ArrayList<>();
    private int capacity;
    
    public SetOfStacks(int capacity) {
        this.capacity = capacity;
    }
    
    public void push(int value) {
        Stack last = getLastStack();
        if (last != null && !last.isFull()) {
            // Add to the last stack
            last.push(value);
        } else {
            // Create a new stack
            Stack stack = new Stack(capacity);
            stack.push(value);
            stacks.add(stack);
        }
    }
    
    public int pop() {
        Stack last = getLastStack();
        if (last == null) {
            throw new EmptyStackException();
        }
        
        int value = last.pop();
        
        // If the last stack is empty, remove it
        if (last.isEmpty()) {
            stacks.remove(stacks.size() - 1);
        }
        
        return value;
    }
    
    public int popAt(int index) {
        if (index < 0 || index >= stacks.size()) {
            throw new IndexOutOfBoundsException();
        }
        
        return leftShift(index, true);
    }
    
    private int leftShift(int index, boolean removeTop) {
        Stack stack = stacks.get(index);
        int removedItem;
        
        if (removeTop) {
            removedItem = stack.pop();
        } else {
            removedItem = stack.removeBottom();
        }
        
        if (stack.isEmpty()) {
            stacks.remove(index);
        } else if (index < stacks.size() - 1) {
            // If this isn't the last stack, borrow an item from the next stack
            int v = leftShift(index + 1, false);
            stack.push(v);
        }
        
        return removedItem;
    }
    
    private Stack getLastStack() {
        if (stacks.isEmpty()) {
            return null;
        }
        return stacks.get(stacks.size() - 1);
    }
    
    // Inner Stack class with capacity limit and ability to remove from bottom
    private class Stack {
        private class Node {
            int value;
            Node above;
            Node below;
            
            Node(int value) {
                this.value = value;
            }
        }
        
        private int capacity;
        private int size = 0;
        private Node top;
        private Node bottom;
        
        public Stack(int capacity) {
            this.capacity = capacity;
        }
        
        public boolean isFull() {
            return size == capacity;
        }
        
        public boolean isEmpty() {
            return size == 0;
        }
        
        public void push(int value) {
            if (size >= capacity) {
                return;
            }
            
            size++;
            Node n = new Node(value);
            
            if (size == 1) {
                bottom = n;
            }
            
            join(n, top);
            top = n;
        }
        
        public int pop() {
            if (top == null) {
                throw new EmptyStackException();
            }
            
            Node t = top;
            top = top.below;
            size--;
            return t.value;
        }
        
        public int removeBottom() {
            if (bottom == null) {
                throw new EmptyStackException();
            }
            
            Node b = bottom;
            bottom = bottom.above;
            if (bottom != null) {
                bottom.below = null;
            }
            size--;
            return b.value;
        }
        
        private void join(Node above, Node below) {
            if (above != null) above.below = below;
            if (below != null) below.above = above;
        }
    }
}`
  },
  {
    id: 14,
    topic_id: 3,
    title: "Queue via Stacks",
    description: "Implement a MyQueue class which implements a queue using two stacks.",
    difficulty: "medium",
    estimated_minutes: 15,
    xp_reward: 15,
    details: {
      starter_code: `class MyQueue<T> {
    // Your implementation here
}`,
      test_cases: `MyQueue<Integer> queue = new MyQueue<>();
queue.add(1);
queue.add(2);
queue.add(3);
int value1 = queue.remove(); // Should return 1
int value2 = queue.peek(); // Should return 2
queue.add(4);
int value3 = queue.remove(); // Should return 2`,
      constraints: `You may only use the standard stack operations: push, pop, peek, and isEmpty.
The queue should support the operations: add (enqueue), remove (dequeue), peek, and isEmpty.`,
      input_format: "N/A - This is a design problem",
      output_format: "N/A - This is a design problem",
      time_complexity: "O(1) amortized for all operations",
      space_complexity: "O(n) where n is the number of elements in the queue"
    },
    hints: [
      "The major difference between a queue and a stack is the order (first-in first-out vs. last-in first-out).",
      "How would you use two stacks to create a queue-like behavior?",
      "Consider using one stack for enqueuing and another for dequeuing."
    ],
    solution: `import java.util.Stack;

class MyQueue<T> {
    private Stack<T> stackNewest; // for push
    private Stack<T> stackOldest; // for pop
    
    public MyQueue() {
        stackNewest = new Stack<>();
        stackOldest = new Stack<>();
    }
    
    public int size() {
        return stackNewest.size() + stackOldest.size();
    }
    
    public void add(T value) {
        // Push onto stackNewest, which always has the newest elements on top
        stackNewest.push(value);
    }
    
    // Move elements from stackNewest to stackOldest
    private void shiftStacks() {
        if (stackOldest.isEmpty()) {
            while (!stackNewest.isEmpty()) {
                stackOldest.push(stackNewest.pop());
            }
        }
    }
    
    public T peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        
        shiftStacks(); // Ensure stackOldest has the current elements
        return stackOldest.peek(); // Retrieve the oldest item
    }
    
    public T remove() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        
        shiftStacks(); // Ensure stackOldest has the current elements
        return stackOldest.pop(); // Pop the oldest item
    }
    
    public boolean isEmpty() {
        return stackNewest.isEmpty() && stackOldest.isEmpty();
    }
}`
  },
  {
    id: 15,
    topic_id: 3,
    title: "Sort Stack",
    description: "Write a program to sort a stack such that the smallest items are on the top. You can use an additional temporary stack, but you may not copy the elements into any other data structure (such as an array). The stack supports the following operations: push, pop, peek, and isEmpty.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 20,
    details: {
      starter_code: `public static void sortStack(Stack<Integer> s) {
    // Your implementation here
}`,
      test_cases: `Stack<Integer> stack = new Stack<>();
stack.push(5);
stack.push(10);
stack.push(7);
stack.push(2);
sortStack(stack);
// After sorting, popping elements should give: 2, 5, 7, 10`,
      constraints: `You can only use one additional stack for temporary storage.
You cannot copy the elements into any other data structure.
The stack supports only: push, pop, peek, and isEmpty operations.`,
      input_format: "A stack of integers",
      output_format: "The same stack sorted with smallest elements on top",
      time_complexity: "O(n²)",
      space_complexity: "O(n)"
    },
    hints: [
      "One approach is to pop each element from the original stack and insert it into the correct position in the temporary stack.",
      "How would you insert an element in the correct position in a sorted stack?",
      "Consider using recursion to solve this problem."
    ],
    solution: `import java.util.Stack;

// Solution 1: Iterative approach
public static void sortStack(Stack<Integer> s) {
    Stack<Integer> tempStack = new Stack<>();
    
    while (!s.isEmpty()) {
        // Pop an element from the original stack
        int tmp = s.pop();
        
        // While temporary stack is not empty and its top element is greater than tmp
        while (!tempStack.isEmpty() && tempStack.peek() > tmp) {
            // Move elements back to the original stack
            s.push(tempStack.pop());
        }
        
        // Push tmp to the temporary stack
        tempStack.push(tmp);
    }
    
    // Copy the elements back to the original stack
    while (!tempStack.isEmpty()) {
        s.push(tempStack.pop());
    }
}

// Solution 2: Recursive approach
public static void sortStackRecursive(Stack<Integer> s) {
    if (!s.isEmpty()) {
        // Remove the top element
        int tmp = s.pop();
        
        // Sort the remaining stack
        sortStackRecursive(s);
        
        // Insert the top element in the correct position
        insertSorted(s, tmp);
    }
}

private static void insertSorted(Stack<Integer> s, int value) {
    // If stack is empty or value is greater than the top element, push value
    if (s.isEmpty() || value > s.peek()) {
        s.push(value);
        return;
    }
    
    // Remove the top element
    int tmp = s.pop();
    
    // Insert value in the correct position in the remaining stack
    insertSorted(s, value);
    
    // Push back the removed element
    s.push(tmp);
}`
  }
];

module.exports = stacksQueuesProblems;
