// Practice questions implementation for "Cracking the Coding Interview" course
// This file contains additional practice questions for various topics

const fs = require('fs');
const path = require('path');

// Base directory for course content
const COURSE_DIR = path.join(__dirname, 'course_content');
const PROBLEMS_DIR = path.join(COURSE_DIR, 'problems');

// Ensure problems directory exists
if (!fs.existsSync(PROBLEMS_DIR)) {
  fs.mkdirSync(PROBLEMS_DIR, { recursive: true });
}

// Additional practice problems for Arrays and Strings topic
const moreArraysAndStringsProblems = [
  {
    id: 3,
    topic_id: 1,
    title: "Is Unique",
    description: "Implement an algorithm to determine if a string has all unique characters. What if you cannot use additional data structures?",
    difficulty: "easy",
    estimated_minutes: 10,
    xp_reward: 10,
    details: {
      starter_code: `public boolean isUnique(String str) {
    // Your code here
}`,
      test_cases: `Input: "abcdefg"
Output: true

Input: "hello"
Output: false

Input: ""
Output: true`,
      constraints: `0 <= str.length <= 128
str consists of ASCII characters.`,
      input_format: "A string str",
      output_format: "Boolean indicating if all characters in the string are unique",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "Consider using a data structure to track characters we've seen.",
      "Could you use a bit vector to reduce the space usage?",
      "For the follow-up (no additional data structures), could you compare every character with every other character?",
      "If you're allowed to modify the input string, could sorting help?"
    ],
    solution: {
      approach_description: "We can use a boolean array to track which characters we've seen. If we encounter a character we've already seen, the string doesn't have all unique characters.",
      code_solution: `public boolean isUnique(String str) {
    // Assuming ASCII character set (128 characters)
    if (str.length() > 128) {
        return false; // Can't have more than 128 unique characters
    }
    
    boolean[] charSet = new boolean[128];
    
    for (int i = 0; i < str.length(); i++) {
        int val = str.charAt(i);
        
        // If character already exists, return false
        if (charSet[val]) {
            return false;
        }
        
        charSet[val] = true;
    }
    
    return true;
}

// Follow-up: Without additional data structures
public boolean isUniqueNoDS(String str) {
    // Check each character against all other characters
    for (int i = 0; i < str.length(); i++) {
        for (int j = i + 1; j < str.length(); j++) {
            if (str.charAt(i) == str.charAt(j)) {
                return false;
            }
        }
    }
    return true;
}`,
      language: "java",
      time_complexity: "O(n)",
      space_complexity: "O(1)",
      is_optimal: true
    },
    companies: ["Amazon", "Microsoft", "Google"]
  },
  {
    id: 4,
    topic_id: 1,
    title: "URLify",
    description: "Write a method to replace all spaces in a string with '%20'. You may assume that the string has sufficient space at the end to hold the additional characters, and that you are given the 'true' length of the string.",
    difficulty: "easy",
    estimated_minutes: 15,
    xp_reward: 10,
    details: {
      starter_code: `public void urlify(char[] str, int trueLength) {
    // Your code here
}`,
      test_cases: `Input: "Mr John Smith    ", 13
Output: "Mr%20John%20Smith"

Input: "Hello World  ", 11
Output: "Hello%20World"`,
      constraints: `1 <= str.length <= 10^4
str has sufficient space at the end to hold the additional characters.`,
      input_format: "A character array and an integer representing the true length of the string",
      output_format: "The character array with spaces replaced by '%20'",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "It's easier to edit the string from the end to the beginning.",
      "Count the number of spaces to determine the new length of the string.",
      "Start from the end of the true length and work backwards.",
      "Be careful with the indices when replacing characters."
    ],
    solution: {
      approach_description: "We first count the number of spaces to determine the new length of the string. Then, we edit the string from the end to the beginning, replacing spaces with '%20'.",
      code_solution: `public void urlify(char[] str, int trueLength) {
    // Count spaces
    int spaceCount = 0;
    for (int i = 0; i < trueLength; i++) {
        if (str[i] == ' ') {
            spaceCount++;
        }
    }
    
    // Calculate new length
    int index = trueLength + spaceCount * 2;
    
    // If there are no spaces, we're done
    if (index == trueLength) return;
    
    // Convert from end
    for (int i = trueLength - 1; i >= 0; i--) {
        if (str[i] == ' ') {
            str[index - 1] = '0';
            str[index - 2] = '2';
            str[index - 3] = '%';
            index -= 3;
        } else {
            str[index - 1] = str[i];
            index--;
        }
    }
}`,
      language: "java",
      time_complexity: "O(n)",
      space_complexity: "O(1)",
      is_optimal: true
    },
    companies: ["Microsoft", "Facebook", "Amazon"]
  },
  {
    id: 5,
    topic_id: 1,
    title: "String Compression",
    description: "Implement a method to perform basic string compression using the counts of repeated characters. For example, the string 'aabcccccaaa' would become 'a2b1c5a3'. If the 'compressed' string would not become smaller than the original string, your method should return the original string.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 15,
    details: {
      starter_code: `public String compress(String str) {
    // Your code here
}`,
      test_cases: `Input: "aabcccccaaa"
Output: "a2b1c5a3"

Input: "abcd"
Output: "abcd"

Input: "aabb"
Output: "aabb"`,
      constraints: `0 <= str.length <= 10^4
str consists of lowercase English letters.`,
      input_format: "A string str",
      output_format: "The compressed string or the original string if compression doesn't reduce length",
      time_complexity: "O(n)",
      space_complexity: "O(n)"
    },
    hints: [
      "Try using a StringBuilder to avoid string concatenation inefficiency.",
      "Check if the compressed string will be shorter before building it.",
      "Be careful with the last character - make sure it gets counted.",
      "Consider edge cases like empty strings and strings with a single character."
    ],
    solution: {
      approach_description: "We iterate through the string, counting consecutive characters. When the character changes, we append the previous character and its count to our result. We need to handle the last character separately.",
      code_solution: `public String compress(String str) {
    // Check for empty string
    if (str == null || str.isEmpty()) {
        return str;
    }
    
    // Check if compression would create a longer string
    int compressedLength = countCompressedLength(str);
    if (compressedLength >= str.length()) {
        return str;
    }
    
    StringBuilder compressed = new StringBuilder(compressedLength);
    int countConsecutive = 0;
    
    for (int i = 0; i < str.length(); i++) {
        countConsecutive++;
        
        // If next character is different or we're at the end of the string
        if (i + 1 >= str.length() || str.charAt(i) != str.charAt(i + 1)) {
            compressed.append(str.charAt(i));
            compressed.append(countConsecutive);
            countConsecutive = 0;
        }
    }
    
    return compressed.toString();
}

private int countCompressedLength(String str) {
    int compressedLength = 0;
    int countConsecutive = 0;
    
    for (int i = 0; i < str.length(); i++) {
        countConsecutive++;
        
        // If next character is different or we're at the end of the string
        if (i + 1 >= str.length() || str.charAt(i) != str.charAt(i + 1)) {
            compressedLength += 1 + String.valueOf(countConsecutive).length();
            countConsecutive = 0;
        }
    }
    
    return compressedLength;
}`,
      language: "java",
      time_complexity: "O(n)",
      space_complexity: "O(n)",
      is_optimal: true
    },
    companies: ["Amazon", "Microsoft", "Google", "Apple"]
  }
];

// Practice problems for Linked Lists topic
const linkedListsProblems = [
  {
    id: 6,
    topic_id: 2,
    title: "Remove Duplicates",
    description: "Write code to remove duplicates from an unsorted linked list. How would you solve this problem if a temporary buffer is not allowed?",
    difficulty: "medium",
    estimated_minutes: 15,
    xp_reward: 15,
    details: {
      starter_code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public void removeDuplicates(ListNode head) {
    // Your code here
}`,
      test_cases: `Input: 1->2->3->2->1
Output: 1->2->3

Input: 1->1->1->1->1
Output: 1

Input: 1->2->3->4
Output: 1->2->3->4`,
      constraints: `0 <= number of nodes <= 10^4
-10^9 <= node.val <= 10^9`,
      input_format: "The head of a linked list",
      output_format: "The linked list with duplicates removed",
      time_complexity: "O(n)",
      space_complexity: "O(n)"
    },
    hints: [
      "Consider using a hash table to track which values have been seen.",
      "For the follow-up (no buffer allowed), you can use two pointers.",
      "The runner technique might be useful for the no-buffer solution.",
      "Be careful with the head node and null pointers."
    ],
    solution: {
      approach_description: "We use a HashSet to keep track of values we've seen. As we traverse the list, if we encounter a value we've seen before, we skip that node by updating the previous node's next pointer.",
      code_solution: `public void removeDuplicates(ListNode head) {
    // Handle empty list
    if (head == null) return;
    
    HashSet<Integer> values = new HashSet<>();
    ListNode current = head;
    ListNode previous = null;
    
    while (current != null) {
        // If we've seen this value before, remove the node
        if (values.contains(current.val)) {
            previous.next = current.next;
        } else {
            // Add the value to our set and move previous
            values.add(current.val);
            previous = current;
        }
        current = current.next;
    }
}

// Follow-up: Without a buffer
public void removeDuplicatesNoBuffer(ListNode head) {
    // Handle empty list
    if (head == null) return;
    
    ListNode current = head;
    
    while (current != null) {
        // Remove all future nodes with the same value
        ListNode runner = current;
        while (runner.next != null) {
            if (runner.next.val == current.val) {
                runner.next = runner.next.next;
            } else {
                runner = runner.next;
            }
        }
        current = current.next;
    }
}`,
      language: "java",
      time_complexity: "O(n)",
      space_complexity: "O(n)",
      is_optimal: true
    },
    companies: ["Amazon", "Microsoft", "Google", "Facebook"]
  },
  {
    id: 7,
    topic_id: 2,
    title: "Return Kth to Last",
    description: "Implement an algorithm to find the kth to last element of a singly linked list.",
    difficulty: "medium",
    estimated_minutes: 15,
    xp_reward: 15,
    details: {
      starter_code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public ListNode kthToLast(ListNode head, int k) {
    // Your code here
}`,
      test_cases: `Input: 1->2->3->4->5, k=2
Output: 4 (the 2nd to last element is 4)

Input: 1->2->3, k=3
Output: 1 (the 3rd to last element is 1)

Input: 1->2, k=3
Output: null (there is no 3rd to last element)`,
      constraints: `0 <= number of nodes <= 10^4
1 <= k <= 10^4
-10^9 <= node.val <= 10^9`,
      input_format: "The head of a linked list and an integer k",
      output_format: "The kth to last node in the linked list",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "Consider using two pointers.",
      "What if you moved one pointer k nodes ahead, then moved both pointers until the first one hits the end?",
      "You could also find the length of the list first, then find the (length - k)th node.",
      "Recursive solutions are possible but may use O(n) space due to the call stack."
    ],
    solution: {
      approach_description: "We use two pointers, p1 and p2. First, we move p1 k nodes ahead. Then, we move both p1 and p2 until p1 reaches the end. At that point, p2 will be at the kth to last node.",
      code_solution: `public ListNode kthToLast(ListNode head, int k) {
    ListNode p1 = head;
    ListNode p2 = head;
    
    // Move p1 k nodes ahead
    for (int i = 0; i < k; i++) {
        if (p1 == null) return null; // List is too short
        p1 = p1.next;
    }
    
    // Move both pointers until p1 reaches the end
    while (p1 != null) {
        p1 = p1.next;
        p2 = p2.next;
    }
    
    return p2;
}`,
      language: "java",
      time_complexity: "O(n)",
      space_complexity: "O(1)",
      is_optimal: true
    },
    companies: ["Amazon", "Microsoft", "Facebook", "Apple"]
  }
];

// Practice problems for Stacks and Queues topic
const stacksQueuesProblems = [
  {
    id: 8,
    topic_id: 3,
    title: "Three in One",
    description: "Describe how you could use a single array to implement three stacks.",
    difficulty: "hard",
    estimated_minutes: 30,
    xp_reward: 25,
    details: {
      starter_code: `public class FixedMultiStack {
    // Your implementation here
}`,
      test_cases: `// Create a three-stack structure
FixedMultiStack stacks = new FixedMultiStack(3); // Each stack can hold 3 items

// Push to different stacks
stacks.push(0, 1); // Push 1 to stack 0
stacks.push(1, 2); // Push 2 to stack 1
stacks.push(2, 3); // Push 3 to stack 2

// Pop from stacks
stacks.pop(0); // Should return 1
stacks.pop(1); // Should return 2
stacks.pop(2); // Should return 3

// Check if stacks are empty
stacks.isEmpty(0); // Should return true
stacks.isEmpty(1); // Should return true
stacks.isEmpty(2); // Should return true`,
      constraints: `The implementation should handle stack operations: push, pop, peek, and isEmpty.
The implementation should handle stack overflow and underflow.`,
      input_format: "Method calls to the multi-stack implementation",
      output_format: "Results of the method calls",
      time_complexity: "O(1) for all operations",
      space_complexity: "O(n) where n is the total capacity of all stacks"
    },
    hints: [
      "Consider dividing the array into three equal parts.",
      "You'll need to keep track of the top element for each stack.",
      "What if the stacks have different sizes? How would you allocate the array space?",
      "Consider a flexible division approach where stack divisions can change size."
    ],
    solution: {
      approach_description: "We divide the array into three equal parts, each representing a stack. We keep track of the top element index for each stack and implement the standard stack operations.",
      code_solution: `public class FixedMultiStack {
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
        // Check if stack is full
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
        int value = values[topIndex];
        values[topIndex] = 0; // Clear
        sizes[stackNum]--;
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
    
    // Stack exceptions
    public class FullStackException extends Exception {
    }
    
    public class EmptyStackException extends Exception {
    }
}

// Alternative: Flexible Division Approach
public class FlexibleMultiStack {
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
            return adjustIndex(start + size - 1);
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
    
    // Additional methods for the flexible implementation would go here
    // This would include push, pop, peek, isEmpty, and methods to handle
    // stack expansion and contraction
}`,
      language: "java",
      time_complexity: "O(1)",
      space_complexity: "O(n)",
      is_optimal: true
    },
    companies: ["Amazon", "Microsoft", "Google", "Facebook"]
  }
];

// Practice problems for Trees and Graphs topic
const treesGraphsProblems = [
  {
    id: 9,
    topic_id: 4,
    title: "Route Between Nodes",
    description: "Given a directed graph and two nodes (S and E), design an algorithm to find out whether there is a route from S to E.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 20,
    details: {
      starter_code: `class Graph {
    private Node[] nodes;
    
    // Node class for the graph
    class Node {
        private String name;
        private Node[] children;
        private boolean visited;
        
        // Constructor and methods
    }
    
    // Constructor and methods
}

public boolean routeExists(Graph graph, Node start, Node end) {
    // Your code here
}`,
      test_cases: `// Example 1: Route exists
Graph g1 = createGraph();
Node s1 = g1.getNode("A");
Node e1 = g1.getNode("E");
routeExists(g1, s1, e1); // Should return true

// Example 2: No route exists
Graph g2 = createGraph();
Node s2 = g2.getNode("E");
Node e2 = g2.getNode("A");
routeExists(g2, s2, e2); // Should return false`,
      constraints: `The graph may contain cycles.
1 <= number of nodes <= 10^4`,
      input_format: "A graph and two nodes, start and end",
      output_format: "Boolean indicating if a route exists from start to end",
      time_complexity: "O(V + E) where V is the number of vertices and E is the number of edges",
      space_complexity: "O(V)"
    },
    hints: [
      "This problem can be solved using graph traversal algorithms.",
      "Both BFS and DFS can be used, but one might be more efficient.",
      "BFS is typically better for finding the shortest path.",
      "Don't forget to mark nodes as visited to avoid cycles."
    ],
    solution: {
      approach_description: "We can use either Breadth-First Search (BFS) or Depth-First Search (DFS) to find if a route exists. BFS is often preferred for finding the shortest path between nodes, while DFS might be simpler to implement recursively.",
      code_solution: `// BFS Implementation
public boolean routeExists(Graph graph, Node start, Node end) {
    if (start == end) return true;
    
    // Use BFS
    Queue<Node> queue = new LinkedList<>();
    
    // Mark all nodes as not visited
    for (Node node : graph.getNodes()) {
        node.setVisited(false);
    }
    
    // Mark the start node as visited and enqueue it
    start.setVisited(true);
    queue.add(start);
    
    while (!queue.isEmpty()) {
        Node current = queue.remove();
        
        // Check all adjacent nodes
        for (Node neighbor : current.getChildren()) {
            if (!neighbor.isVisited()) {
                if (neighbor == end) {
                    return true;
                }
                neighbor.setVisited(true);
                queue.add(neighbor);
            }
        }
    }
    
    return false;
}

// DFS Implementation
public boolean routeExistsDFS(Graph graph, Node start, Node end) {
    if (start == end) return true;
    
    // Mark all nodes as not visited
    for (Node node : graph.getNodes()) {
        node.setVisited(false);
    }
    
    return dfs(start, end);
}

private boolean dfs(Node current, Node end) {
    if (current == end) return true;
    
    current.setVisited(true);
    
    for (Node neighbor : current.getChildren()) {
        if (!neighbor.isVisited()) {
            if (dfs(neighbor, end)) {
                return true;
            }
        }
    }
    
    return false;
}`,
      language: "java",
      time_complexity: "O(V + E)",
      space_complexity: "O(V)",
      is_optimal: true
    },
    companies: ["Facebook", "Amazon", "Google", "Microsoft"]
  }
];

// Practice problems for Bit Manipulation topic
const bitManipulationProblems = [
  {
    id: 10,
    topic_id: 5,
    title: "Insertion",
    description: "You are given two 32-bit numbers, N and M, and two bit positions, i and j. Write a method to insert M into N such that M starts at bit j and ends at bit i. You can assume that the bits j through i have enough space to fit all of M. That is, if M = 10011, you can assume that there are at least 5 bits between j and i. You would not, for example, have j = 3 and i = 2, because M could not fully fit between bit 3 and bit 2.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 20,
    details: {
      starter_code: `public int insertion(int n, int m, int i, int j) {
    // Your code here
}`,
      test_cases: `Input: N = 1024 (10000000000), M = 19 (10011), i = 2, j = 6
Output: 1100 (10001001100)

Input: N = 0, M = 31 (11111), i = 0, j = 4
Output: 31 (11111)`,
      constraints: `0 <= i <= j <= 31
0 <= M < 2^(j-i+1)`,
      input_format: "Four integers: N, M, i, and j",
      output_format: "An integer representing N with M inserted from bit j to bit i",
      time_complexity: "O(1)",
      space_complexity: "O(1)"
    },
    hints: [
      "You'll need to clear the bits j through i in N before inserting M.",
      "Create a mask to clear the bits.",
      "Shift M so that it lines up with bits j through i.",
      "Combine the cleared N with the shifted M."
    ],
    solution: {
      approach_description: "We need to clear the bits j through i in N, then shift M to line up with bit position i, and finally combine them with OR. To clear the bits, we create a mask with 1s everywhere except for bits j through i.",
      code_solution: `public int insertion(int n, int m, int i, int j) {
    // Create a mask to clear bits j through i in n
    // Example: j = 4, i = 2
    // mask = 11100011
    
    // Create left part of mask: all 1s, then 0s (1s << (j+1))
    int allOnes = ~0; // all 1s
    int left = allOnes << (j + 1);
    
    // Create right part of mask: 1s, then all 0s (1 << i) - 1
    int right = (1 << i) - 1;
    
    // Combine left and right to create mask with 0s for bits j through i
    int mask = left | right;
    
    // Clear bits j through i in n
    int clearedN = n & mask;
    
    // Shift m to line up with bit position i
    int shiftedM = m << i;
    
    // Combine cleared n with shifted m
    return clearedN | shiftedM;
}`,
      language: "java",
      time_complexity: "O(1)",
      space_complexity: "O(1)",
      is_optimal: true
    },
    companies: ["Google", "Microsoft", "Amazon"]
  }
];

// Function to save all practice problems
function saveAllProblems() {
  // Combine all problems
  const allProblems = [
    ...moreArraysAndStringsProblems,
    ...linkedListsProblems,
    ...stacksQueuesProblems,
    ...treesGraphsProblems,
    ...bitManipulationProblems
  ];
  
  // Save all problems to a single file
  fs.writeFileSync(
    path.join(PROBLEMS_DIR, 'all_problems.json'),
    JSON.stringify(allProblems, null, 2)
  );
  
  // Save problems by topic
  fs.writeFileSync(
    path.join(PROBLEMS_DIR, 'arrays_strings_additional_problems.json'),
    JSON.stringify(moreArraysAndStringsProblems, null, 2)
  );
  
  fs.writeFileSync(
    path.join(PROBLEMS_DIR, 'linked_lists_problems.json'),
    JSON.stringify(linkedListsProblems, null, 2)
  );
  
  fs.writeFileSync(
    path.join(PROBLEMS_DIR, 'stacks_queues_problems.json'),
    JSON.stringify(stacksQueuesProblems, null, 2)
  );
  
  fs.writeFileSync(
    path.join(PROBLEMS_DIR, 'trees_graphs_problems.json'),
    JSON.stringify(treesGraphsProblems, null, 2)
  );
  
  fs.writeFileSync(
    path.join(PROBLEMS_DIR, 'bit_manipulation_problems.json'),
    JSON.stringify(bitManipulationProblems, null, 2)
  );
  
  console.log(`Saved ${allProblems.length} practice problems to ${PROBLEMS_DIR}`);
}

// Main function to create practice problems
function createPracticeProblems() {
  console.log('Creating practice problems...');
  saveAllProblems();
  console.log('Practice problems implementation complete!');
}

// Execute the main function
createPracticeProblems();
