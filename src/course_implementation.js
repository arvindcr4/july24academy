// Course implementation for "Cracking the Coding Interview" in MathAcademy style
// This file contains the implementation of course topics and lessons

const fs = require('fs');
const path = require('path');

// Base directory for course content
const COURSE_DIR = path.join(__dirname, 'course_content');

// Create directory structure if it doesn't exist
function createDirectoryStructure() {
  const directories = [
    COURSE_DIR,
    path.join(COURSE_DIR, 'tracks'),
    path.join(COURSE_DIR, 'topics'),
    path.join(COURSE_DIR, 'lessons'),
    path.join(COURSE_DIR, 'problems'),
    path.join(COURSE_DIR, 'code_examples'),
    path.join(COURSE_DIR, 'assessments'),
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Course tracks data
const tracks = [
  {
    id: 1,
    title: "Interview Fundamentals",
    description: "Essential knowledge about the interview process and preparation strategies.",
    icon: "interview_icon.svg",
    order_index: 1
  },
  {
    id: 2,
    title: "Data Structures",
    description: "Comprehensive coverage of essential data structures with implementation and application.",
    icon: "data_structures_icon.svg",
    order_index: 2
  },
  {
    id: 3,
    title: "Algorithms",
    description: "Core algorithmic concepts and techniques for solving coding problems.",
    icon: "algorithms_icon.svg",
    order_index: 3
  },
  {
    id: 4,
    title: "System Design",
    description: "Approaches to designing scalable systems and architecture.",
    icon: "system_design_icon.svg",
    order_index: 4
  },
  {
    id: 5,
    title: "Language-Specific",
    description: "Language-specific knowledge and implementation details.",
    icon: "languages_icon.svg",
    order_index: 5
  }
];

// Topics for Data Structures track
const dataStructuresTopics = [
  {
    id: 1,
    track_id: 2,
    title: "Arrays and Strings",
    description: "Fundamental data structures for storing sequential data.",
    icon: "arrays_icon.svg",
    order_index: 1,
    estimated_hours: 4.5
  },
  {
    id: 2,
    track_id: 2,
    title: "Linked Lists",
    description: "Linear data structures with nodes pointing to next elements.",
    icon: "linked_lists_icon.svg",
    order_index: 2,
    estimated_hours: 3.5
  },
  {
    id: 3,
    track_id: 2,
    title: "Stacks and Queues",
    description: "Abstract data types for LIFO and FIFO operations.",
    icon: "stacks_queues_icon.svg",
    order_index: 3,
    estimated_hours: 3.0
  },
  {
    id: 4,
    track_id: 2,
    title: "Trees and Graphs",
    description: "Hierarchical and network data structures.",
    icon: "trees_graphs_icon.svg",
    order_index: 4,
    estimated_hours: 6.0
  },
  {
    id: 5,
    track_id: 2,
    title: "Hash Tables",
    description: "Data structures that map keys to values using a hash function.",
    icon: "hash_tables_icon.svg",
    order_index: 5,
    estimated_hours: 3.0
  }
];

// Lessons for Arrays and Strings topic
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

// Example in Java:
// int value = array[3]; // Get the element at index 3

### 2. Updating Elements

Updating an element is also an O(1) operation:

```java
array[3] = 42; // Set the element at index 3 to 42
```

### 3. Traversing an Array

Iterating through all elements is an O(n) operation:

```java
for (int i = 0; i < array.length; i++) {
    // Process array[i]
}
```

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

Arrays have a space complexity of O(n), where n is the number of elements.

## Common Interview Considerations

1. **Boundary Conditions**: Always check for array bounds to avoid index out of bounds errors.
2. **Empty Arrays**: Consider how your algorithm handles empty arrays.
3. **Memory Usage**: For large arrays, be mindful of memory constraints.
4. **Cache Locality**: Arrays have excellent cache locality due to contiguous memory allocation.
    `,
    key_points: [
      "Arrays provide O(1) access time for elements",
      "Insertion/deletion at arbitrary positions costs O(n) time",
      "Memory is contiguous, which provides cache locality benefits",
      "Array size is fixed in many languages, requiring resizing strategies"
    ]
  },
  {
    id: 2,
    topic_id: 1,
    title: "String Manipulation",
    description: "Common string operations and techniques.",
    order_index: 2,
    estimated_minutes: 25,
    xp_reward: 20,
    content: `
# String Manipulation

Strings are sequences of characters and are one of the most commonly used data types in programming. In interview questions, string manipulation is a frequent topic.

## String Representation

In most programming languages, strings are represented as arrays of characters. However, there are important differences in how strings are handled across languages:

- **Java/C#**: Strings are immutable objects
- **C/C++**: Strings can be character arrays or string objects
- **Python**: Strings are immutable sequences of Unicode characters
- **JavaScript**: Strings are immutable primitive values

## Common String Operations

### 1. Concatenation

Joining two or more strings:

```java
String combined = str1 + str2;
```

**Note**: In languages with immutable strings, concatenation creates a new string object, which can be inefficient for multiple concatenations.

### 2. Substring

Extracting a portion of a string:

```java
String sub = str.substring(startIndex, endIndex);
```

### 3. String Comparison

Comparing string content:

```java
boolean areEqual = str1.equals(str2); // Java
```

**Note**: Be careful with == operator in languages like Java, as it compares references, not content.

### 4. String Searching

Finding substrings:

```java
int index = str.indexOf("pattern");
```

## String Builders and Buffers

For efficient string manipulation, especially when building strings incrementally, use StringBuilder (Java) or similar constructs:

```java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
    sb.append(",");
}
String result = sb.toString();
```

This is much more efficient than string concatenation in a loop, which would create many intermediate string objects.

## Common String Techniques in Interviews

### 1. Two-Pointer Technique

Useful for problems like palindrome checking:

```java
boolean isPalindrome(String s) {
    int left = 0;
    int right = s.length() - 1;
    
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
```

### 2. Character Counting/Hashing

Useful for anagram detection, character frequency analysis:

```java
Map<Character, Integer> getCharFrequency(String s) {
    Map<Character, Integer> freqMap = new HashMap<>();
    
    for (char c : s.toCharArray()) {
        freqMap.put(c, freqMap.getOrDefault(c, 0) + 1);
    }
    
    return freqMap;
}
```

### 3. String Building

Creating strings based on patterns or transformations:

```java
String reverseWords(String s) {
    String[] words = s.split(" ");
    StringBuilder result = new StringBuilder();
    
    for (int i = words.length - 1; i >= 0; i--) {
        result.append(words[i]);
        if (i > 0) {
            result.append(" ");
        }
    }
    
    return result.toString();
}
```

## Time and Space Complexity

| Operation | Time Complexity |
|-----------|----------------|
| Access    | O(1)           |
| Search    | O(n)           |
| Concatenation | O(n+m)     |
| Substring | O(n)           |

## Character Encoding Considerations

- ASCII: 128 characters (7 bits)
- Extended ASCII: 256 characters (8 bits)
- Unicode: Supports multiple languages and symbols
  - UTF-8: Variable-length encoding (1-4 bytes)
  - UTF-16: Variable-length encoding (2 or 4 bytes)

## Interview Tips

1. **Immutability**: Remember that strings are immutable in many languages
2. **StringBuilder**: Use for efficient string construction
3. **Null Checks**: Always handle null strings
4. **Empty Strings**: Consider empty string edge cases
5. **Case Sensitivity**: Be clear about case sensitivity requirements
    `,
    key_points: [
      "Strings are immutable in many languages, requiring careful handling for efficiency",
      "StringBuilder provides efficient concatenation for building strings",
      "Two-pointer technique is useful for many string problems",
      "Character counting/hashing helps solve anagram and frequency problems"
    ]
  },
  {
    id: 3,
    topic_id: 1,
    title: "Multi-dimensional Arrays",
    description: "Working with matrices and multi-dimensional data.",
    order_index: 3,
    estimated_minutes: 30,
    xp_reward: 25,
    content: `
# Multi-dimensional Arrays

Multi-dimensional arrays store data in a grid-like structure and are commonly used to represent matrices, game boards, and other 2D or 3D data.

## 2D Arrays (Matrices)

A 2D array is essentially an array of arrays. It can be visualized as a grid with rows and columns:

```
+-------+-------+-------+
| [0,0] | [0,1] | [0,2] |
+-------+-------+-------+
| [1,0] | [1,1] | [1,2] |
+-------+-------+-------+
| [2,0] | [2,1] | [2,2] |
+-------+-------+-------+
```

### Declaration and Initialization

```java
// Declaration
int[][] matrix = new int[3][4]; // 3 rows, 4 columns

// Initialization with values
int[][] matrix = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};
```

### Accessing Elements

```java
int value = matrix[1][2]; // Access element at row 1, column 2 (value 7)
```

### Traversal Techniques

#### Row-Major Traversal

```java
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        // Process matrix[i][j]
    }
}
```

#### Column-Major Traversal

```java
for (int j = 0; j < matrix[0].length; j++) {
    for (int i = 0; i < matrix.length; i++) {
        // Process matrix[i][j]
    }
}
```

## Common Matrix Operations

### 1. Matrix Transposition

Swapping rows and columns:

```java
int[][] transpose(int[][] matrix) {
    int m = matrix.length;
    int n = matrix[0].length;
    int[][] result = new int[n][m];
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    
    return result;
}
```

### 2. Matrix Rotation

Rotating a matrix 90 degrees clockwise:

```java
void rotateMatrix(int[][] matrix) {
    int n = matrix.length;
    
    // Transpose
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    
    // Reverse each row
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n/2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[i][n-1-j];
            matrix[i][n-1-j] = temp;
        }
    }
}
```

### 3. Diagonal Traversal

Traversing the diagonals of a matrix:

```java
// Main diagonal (top-left to bottom-right)
for (int i = 0; i < matrix.length; i++) {
    // Process matrix[i][i]
}

// Anti-diagonal (top-right to bottom-left)
for (int i = 0; i < matrix.length; i++) {
    // Process matrix[i][matrix.length-1-i]
}
```

## Memory Layout

In memory, 2D arrays can be stored in two ways:

### Row-Major Order

Elements of each row are stored contiguously:
```
[1,2,3,4,5,6,7,8,9]
```
representing:
```
[1,2,3]
[4,5,6]
[7,8,9]
```

### Column-Major Order

Elements of each column are stored contiguously:
```
[1,4,7,2,5,8,3,6,9]
```
representing:
```
[1,2,3]
[4,5,6]
[7,8,9]
```

Most languages use row-major order (C, C++, Java, Python), while some scientific computing languages use column-major order (FORTRAN, MATLAB).

## Jagged Arrays

Jagged arrays are arrays of arrays where each sub-array can have a different length:

```java
int[][] jaggedArray = new int[3][];
jaggedArray[0] = new int[4];
jaggedArray[1] = new int[2];
jaggedArray[2] = new int[5];
```

## Space Optimization Techniques

### 1. Sparse Matrices

When most elements are zero, use alternative representations:

- **Dictionary of Keys (DOK)**: Store only non-zero elements with their coordinates
- **Coordinate List (COO)**: Store list of (row, column, value) tuples
- **Compressed Sparse Row (CSR)**: Store row indices, column indices, and values separately

### 2. Bit Matrices

For boolean matrices, use bits instead of boolean values to save space.

## Time and Space Complexity

For an m×n matrix:

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Access    | O(1)           | -               |
| Traversal | O(m×n)         | O(1)            |
| Rotation  | O(m×n)         | O(1) in-place   |
| Transpose | O(m×n)         | O(m×n)          |

## Interview Tips

1. **Boundary Checking**: Always verify row and column indices are within bounds
2. **In-place Operations**: Consider if operations can be done in-place to save space
3. **Edge Cases**: Handle empty matrices and single-element matrices
4. **Symmetry**: Exploit symmetry properties when applicable
5. **Traversal Patterns**: Be familiar with different traversal patterns (spiral, diagonal, etc.)
    `,
    key_points: [
      "Row-major vs column-major ordering affects memory layout and access patterns",
      "Matrix traversal can be done row-by-row, column-by-column, or diagonally",
      "Common matrix operations include transposition, rotation, and searching",
      "Space optimization techniques are important for large or sparse matrices"
    ]
  },
  {
    id: 4,
    topic_id: 1,
    title: "Array Techniques",
    description: "Advanced techniques like two-pointer, sliding window, and prefix sums.",
    order_index: 4,
    estimated_minutes: 35,
    xp_reward: 30,
    content: `
# Array Techniques

Advanced array techniques are essential for solving complex interview problems efficiently. This lesson covers three powerful techniques: two-pointer approach, sliding window, and prefix sums.

## Two-Pointer Technique

The two-pointer technique uses two pointers to iterate through an array in a single pass, often reducing the time complexity from O(n²) to O(n).

### Common Patterns

#### 1. Opposite Ends Inward

Start with pointers at both ends of the array and move them toward each other:

```java
int left = 0;
int right = array.length - 1;

while (left < right) {
    // Process array[left] and array[right]
    
    left++;
    right--;
}
```

**Example Problem: Two Sum (Sorted Array)**

```java
int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        
        if (sum == target) {
            return new int[] {left + 1, right + 1}; // 1-indexed result
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[] {-1, -1}; // No solution
}
```

#### 2. Fast and Slow Pointers

One pointer moves faster than the other:

```java
int slow = 0;
int fast = 0;

while (fast < array.length) {
    // Process using both pointers
    
    slow++;
    fast += 2; // Fast moves twice as quickly
}
```

**Example Problem: Remove Duplicates from Sorted Array**

```java
int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    
    int slow = 0; // Position to place next unique element
    
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    
    return slow + 1; // Length of unique elements
}
```

#### 3. Parallel Traversal

Both pointers move in the same direction but maintain a relationship:

```java
int left = 0;
int right = 0;

while (right < array.length) {
    // Process window from left to right
    
    // Update pointers based on conditions
    if (condition) {
        left++;
    }
    right++;
}
```

## Sliding Window Technique

The sliding window technique is used to process subarrays of a specific size or with certain properties, typically in O(n) time.

### Fixed-Size Window

```java
int k = 3; // Window size
int[] result = new int[array.length - k + 1];

// Calculate initial window
int windowSum = 0;
for (int i = 0; i < k; i++) {
    windowSum += array[i];
}
result[0] = windowSum;

// Slide window and update
for (int i = 1; i <= array.length - k; i++) {
    windowSum = windowSum - array[i-1] + array[i+k-1];
    result[i] = windowSum;
}
```

**Example Problem: Maximum Sum Subarray of Size K**

```java
int maxSumSubarray(int[] nums, int k) {
    int maxSum = 0;
    int windowSum = 0;
    
    // Calculate sum of first window
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    maxSum = windowSum;
    
    // Slide window and update maxSum
    for (int i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i-k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}
```

### Variable-Size Window

```java
int left = 0;
int right = 0;
int result = 0;

while (right < array.length) {
    // Add element at right to current window
    
    // Shrink window from left if needed
    while (windowViolatesConstraint()) {
        // Remove element at left from window
        left++;
    }
    
    // Update result
    result = Math.max(result, right - left + 1);
    
    // Expand window
    right++;
}
```

**Example Problem: Longest Substring Without Repeating Characters**

```java
int lengthOfLongestSubstring(String s) {
    int[] charIndex = new int[128]; // Assuming ASCII
    Arrays.fill(charIndex, -1);
    
    int maxLength = 0;
    int left = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        
        // If character is in current window, move left pointer
        if (charIndex[c] >= left) {
            left = charIndex[c] + 1;
        }
        
        // Update result
        maxLength = Math.max(maxLength, right - left + 1);
        
        // Store index of current character
        charIndex[c] = right;
    }
    
    return maxLength;
}
```

## Prefix Sums

Prefix sums precompute cumulative sums to enable O(1) range sum queries.

### Building Prefix Sum Array

```java
int[] buildPrefixSum(int[] nums) {
    int[] prefixSum = new int[nums.length + 1];
    
    for (int i = 0; i < nums.length; i++) {
        prefixSum[i + 1] = prefixSum[i] + nums[i];
    }
    
    return prefixSum;
}
```

### Range Sum Query

```java
int rangeSum(int[] prefixSum, int left, int right) {
    return prefixSum[right + 1] - prefixSum[left];
}
```

**Example Problem: Subarray Sum Equals K**

```java
int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixSumCount = new HashMap<>();
    prefixSumCount.put(0, 1); // Empty subarray
    
    int count = 0;
    int currentSum = 0;
    
    for (int num : nums) {
        currentSum += num;
        
        // If there's a prefix sum such that (currentSum - prefixSum = k)
        // then we've found subarrays that sum to k
        count += prefixSumCount.getOrDefault(currentSum - k, 0);
        
        // Update prefix sum count
        prefixSumCount.put(currentSum, prefixSumCount.getOrDefault(currentSum, 0) + 1);
    }
    
    return count;
}
```

## 2D Prefix Sums

For matrix range sum queries:

```java
int[][] buildPrefixSum2D(int[][] matrix) {
    int m = matrix.length;
    int n = matrix[0].length;
    int[][] prefixSum = new int[m + 1][n + 1];
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            prefixSum[i + 1][j + 1] = prefixSum[i + 1][j] + prefixSum[i][j + 1] 
                                     - prefixSum[i][j] + matrix[i][j];
        }
    }
    
    return prefixSum;
}

int getRegionSum(int[][] prefixSum, int row1, int col1, int row2, int col2) {
    return prefixSum[row2 + 1][col2 + 1] - prefixSum[row2 + 1][col1] 
           - prefixSum[row1][col2 + 1] + prefixSum[row1][col1];
}
```

## Time and Space Complexity

| Technique | Time Complexity | Space Complexity |
|-----------|----------------|-----------------|
| Two-Pointer | O(n)         | O(1)            |
| Sliding Window | O(n)      | O(1)            |
| Prefix Sums | O(n) preprocessing, O(1) per query | O(n) |
| 2D Prefix Sums | O(m×n) preprocessing, O(1) per query | O(m×n) |

## Interview Tips

1. **Sorted Arrays**: Two-pointer technique often works well with sorted arrays
2. **Subarray Problems**: Consider sliding window for subarray/substring problems
3. **Range Queries**: Use prefix sums for frequent range sum calculations
4. **Edge Cases**: Always check empty arrays and single-element arrays
5. **Initialization**: Be careful with initial values for pointers and sums
    `,
    key_points: [
      "Two-pointer technique uses two indices to solve problems in a single pass",
      "Sliding window is ideal for finding subarrays with specific properties",
      "Prefix sums enable O(1) range sum queries after O(n) preprocessing",
      "These techniques often reduce O(n²) solutions to O(n)"
    ]
  }
];

// Code examples for Array Basics lesson
const arrayBasicsCodeExamples = [
  {
    id: 1,
    lesson_id: 1,
    title: "Basic Array Operations",
    description: "Common operations on arrays",
    code_content: `// Creating an array
int[] numbers = new int[5];

// Initializing with values
numbers[0] = 10;
numbers[1] = 20;
numbers[2] = 30;
numbers[3] = 40;
numbers[4] = 50;

// Accessing elements - O(1)
int thirdElement = numbers[2]; // Gets 30

// Iterating through an array
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}

// Using enhanced for loop
for (int num : numbers) {
    System.out.println(num);
}`,
    language: "java",
    order_index: 1
  },
  {
    id: 2,
    lesson_id: 1,
    title: "Dynamic Arrays",
    description: "Working with resizable arrays",
    code_content: `// Creating an ArrayList (dynamic array)
ArrayList<Integer> dynamicArray = new ArrayList<>();

// Adding elements
dynamicArray.add(10);
dynamicArray.add(20);
dynamicArray.add(30);

// Accessing elements
int element = dynamicArray.get(1); // Gets 20

// Inserting at specific position
dynamicArray.add(1, 15); // Inserts 15 at index 1
// Array is now [10, 15, 20, 30]

// Removing elements
dynamicArray.remove(2); // Removes element at index 2 (20)
// Array is now [10, 15, 30]

// Getting size
int size = dynamicArray.size(); // 3

// Checking if empty
boolean isEmpty = dynamicArray.isEmpty(); // false

// Clearing all elements
dynamicArray.clear();
// Array is now []`,
    language: "java",
    order_index: 2
  }
];

// Practice problems for Arrays and Strings topic
const arraysAndStringsProblems = [
  {
    id: 1,
    topic_id: 1,
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "easy",
    estimated_minutes: 15,
    xp_reward: 10,
    details: {
      starter_code: `public int[] twoSum(int[] nums, int target) {
    // Your code here
}`,
      test_cases: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Input: nums = [3,2,4], target = 6
Output: [1,2]

Input: nums = [3,3], target = 6
Output: [0,1]`,
      constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
      input_format: "An array of integers and a target integer",
      output_format: "An array of two indices",
      time_complexity: "O(n)",
      space_complexity: "O(n)"
    },
    hints: [
      "A naive approach would be to check every pair of numbers in the array.",
      "Can we use additional data structures to improve the time complexity?",
      "Consider using a hash map to store values we've seen so far.",
      "For each number, check if target - current number exists in the hash map."
    ],
    solution: {
      approach_description: "We use a hash map to store each number and its index as we iterate through the array. For each number, we check if the complement (target - current number) exists in the hash map. If it does, we've found our solution.",
      code_solution: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> numMap = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        if (numMap.containsKey(complement)) {
            return new int[] {numMap.get(complement), i};
        }
        
        numMap.put(nums[i], i);
    }
    
    // No solution found (per problem constraints, this shouldn't happen)
    return new int[] {};
}`,
      language: "java",
      time_complexity: "O(n)",
      space_complexity: "O(n)",
      is_optimal: true
    },
    companies: ["Google", "Amazon", "Facebook", "Microsoft"]
  },
  {
    id: 2,
    topic_id: 1,
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.",
    difficulty: "easy",
    estimated_minutes: 10,
    xp_reward: 10,
    details: {
      starter_code: `public boolean isAnagram(String s, String t) {
    // Your code here
}`,
      test_cases: `Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false`,
      constraints: `1 <= s.length, t.length <= 5 * 10^4
s and t consist of lowercase English letters.`,
      input_format: "Two strings s and t",
      output_format: "Boolean indicating if t is an anagram of s",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "Consider the definition of an anagram. What must be true about the character counts?",
      "Could you use a data structure to count characters?",
      "What if you counted characters in s and then compared with t?",
      "Alternatively, could you sort both strings and compare them directly?"
    ],
    solution: {
      approach_description: "We can solve this by counting the frequency of each character in both strings and comparing the counts. Since we're dealing with lowercase English letters, we can use an array of size 26 instead of a hash map.",
      code_solution: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) {
        return false;
    }
    
    int[] charCount = new int[26];
    
    // Count characters in s
    for (char c : s.toCharArray()) {
        charCount[c - 'a']++;
    }
    
    // Decrement counts for characters in t
    for (char c : t.toCharArray()) {
        charCount[c - 'a']--;
        // If count becomes negative, t has more of this character than s
        if (charCount[c - 'a'] < 0) {
            return false;
        }
    }
    
    // All counts should be zero for an anagram
    return true;
}`,
      language: "java",
      time_complexity: "O(n)",
      space_complexity: "O(1)",
      is_optimal: true
    },
    companies: ["Amazon", "Microsoft", "Facebook"]
  }
];

// Function to save course data to JSON files
function saveCourseData() {
  // Save tracks
  fs.writeFileSync(
    path.join(COURSE_DIR, 'tracks', 'tracks.json'),
    JSON.stringify(tracks, null, 2)
  );

  // Save topics for Data Structures track
  fs.writeFileSync(
    path.join(COURSE_DIR, 'topics', 'data_structures_topics.json'),
    JSON.stringify(dataStructuresTopics, null, 2)
  );

  // Save lessons for Arrays and Strings topic
  fs.writeFileSync(
    path.join(COURSE_DIR, 'lessons', 'arrays_and_strings_lessons.json'),
    JSON.stringify(arraysAndStringsLessons, null, 2)
  );

  // Save code examples for Array Basics lesson
  fs.writeFileSync(
    path.join(COURSE_DIR, 'code_examples', 'array_basics_examples.json'),
    JSON.stringify(arrayBasicsCodeExamples, null, 2)
  );

  // Save practice problems for Arrays and Strings topic
  fs.writeFileSync(
    path.join(COURSE_DIR, 'problems', 'arrays_and_strings_problems.json'),
    JSON.stringify(arraysAndStringsProblems, null, 2)
  );

  // Save individual lesson content as markdown files
  arraysAndStringsLessons.forEach(lesson => {
    fs.writeFileSync(
      path.join(COURSE_DIR, 'lessons', `lesson_${lesson.id}.md`),
      lesson.content
    );
  });

  console.log('Course data saved successfully!');
}

// Main function to create course content
function createCourseContent() {
  console.log('Creating course content directory structure...');
  createDirectoryStructure();
  
  console.log('Saving course data...');
  saveCourseData();
  
  console.log('Course content implementation complete!');
}

// Execute the main function
createCourseContent();
