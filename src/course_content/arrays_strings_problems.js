// Practice problems for Arrays and Strings topic
// Based on "Cracking the Coding Interview" by Gayle Laakmann McDowell

const arraysAndStringsProblems = [
  {
    id: 1,
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
    solution: `// Solution 1: Using a hash set
public boolean isUnique(String str) {
    // If string length exceeds character set size, it must have duplicates
    if (str.length() > 128) return false;
    
    HashSet<Character> charSet = new HashSet<>();
    for (int i = 0; i < str.length(); i++) {
        char c = str.charAt(i);
        if (charSet.contains(c)) {
            return false;
        }
        charSet.add(c);
    }
    return true;
}

// Solution 2: Using a bit vector (assuming only lowercase a-z)
public boolean isUnique(String str) {
    // If string length exceeds character set size, it must have duplicates
    if (str.length() > 26) return false;
    
    int checker = 0;
    for (int i = 0; i < str.length(); i++) {
        int val = str.charAt(i) - 'a';
        if ((checker & (1 << val)) > 0) {
            return false;
        }
        checker |= (1 << val);
    }
    return true;
}

// Solution 3: No additional data structures (O(n²) time)
public boolean isUnique(String str) {
    // If string length exceeds character set size, it must have duplicates
    if (str.length() > 128) return false;
    
    for (int i = 0; i < str.length(); i++) {
        for (int j = i + 1; j < str.length(); j++) {
            if (str.charAt(i) == str.charAt(j)) {
                return false;
            }
        }
    }
    return true;
}`
  },
  {
    id: 2,
    topic_id: 1,
    title: "Check Permutation",
    description: "Given two strings, write a method to decide if one is a permutation of the other.",
    difficulty: "easy",
    estimated_minutes: 15,
    xp_reward: 15,
    details: {
      starter_code: `public boolean checkPermutation(String s1, String s2) {
    // Your code here
}`,
      test_cases: `Input: s1 = "abc", s2 = "bca"
Output: true
Input: s1 = "abc", s2 = "bad"
Output: false
Input: s1 = "abc", s2 = "abcd"
Output: false`,
      constraints: `0 <= s1.length, s2.length <= 5000
s1 and s2 consist of lowercase English letters.`,
      input_format: "Two strings s1 and s2",
      output_format: "Boolean indicating if s1 is a permutation of s2",
      time_complexity: "O(n)",
      space_complexity: "O(1) or O(c) where c is the size of the character set"
    },
    hints: [
      "Permutations have the same characters, just in a different order.",
      "How would you check if two strings have exactly the same characters?",
      "Could sorting the strings help?",
      "Can you use a hash table or an array to count character frequencies?"
    ],
    solution: `// Solution 1: Sort the strings
public boolean checkPermutation(String s1, String s2) {
    // Permutations must be the same length
    if (s1.length() != s2.length()) return false;
    
    // Sort both strings and compare
    char[] a1 = s1.toCharArray();
    char[] a2 = s2.toCharArray();
    Arrays.sort(a1);
    Arrays.sort(a2);
    return new String(a1).equals(new String(a2));
}

// Solution 2: Count character frequencies
public boolean checkPermutation(String s1, String s2) {
    // Permutations must be the same length
    if (s1.length() != s2.length()) return false;
    
    // Assuming ASCII character set
    int[] counts = new int[128];
    
    // Count characters in s1
    for (int i = 0; i < s1.length(); i++) {
        counts[s1.charAt(i)]++;
    }
    
    // Check against s2
    for (int i = 0; i < s2.length(); i++) {
        counts[s2.charAt(i)]--;
        if (counts[s2.charAt(i)] < 0) {
            return false;
        }
    }
    
    return true;
}`
  },
  {
    id: 3,
    topic_id: 1,
    title: "URLify",
    description: "Write a method to replace all spaces in a string with '%20'. You may assume that the string has sufficient space at the end to hold the additional characters, and that you are given the 'true' length of the string.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 20,
    details: {
      starter_code: `public void urlify(char[] str, int trueLength) {
    // Your code here
}`,
      test_cases: `Input: "Mr John Smith    ", 13
Output: "Mr%20John%20Smith"
Input: "Hello World  ", 11
Output: "Hello%20World"`,
      constraints: `1 <= str.length <= 10000
str contains only ASCII characters.`,
      input_format: "A character array str and an integer trueLength representing the length of the string without trailing spaces",
      output_format: "The character array with spaces replaced by '%20'",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "It's often easiest to modify strings by working from the end of the string.",
      "You might find it easier to first count the number of spaces.",
      "Can you do this in-place?"
    ],
    solution: `public void urlify(char[] str, int trueLength) {
    // Count spaces
    int spaceCount = 0;
    for (int i = 0; i < trueLength; i++) {
        if (str[i] == ' ') {
            spaceCount++;
        }
    }
    
    // Calculate new length
    int index = trueLength + spaceCount * 2;
    
    // If there are no spaces at the end, we need to add a null terminator
    if (trueLength < str.length) str[trueLength] = '\\0';
    
    // Replace spaces from end to beginning
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
}`
  },
  {
    id: 4,
    topic_id: 1,
    title: "Palindrome Permutation",
    description: "Given a string, write a function to check if it is a permutation of a palindrome. A palindrome is a word or phrase that is the same forwards and backwards. A permutation is a rearrangement of letters. The palindrome does not need to be limited to just dictionary words.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 20,
    details: {
      starter_code: `public boolean isPalindromePermutation(String phrase) {
    // Your code here
}`,
      test_cases: `Input: "Tact Coa"
Output: true (permutations: "taco cat", "atco cta", etc.)
Input: "hello"
Output: false`,
      constraints: `1 <= phrase.length <= 5000
phrase contains only ASCII characters.`,
      input_format: "A string phrase",
      output_format: "Boolean indicating if the string is a permutation of a palindrome",
      time_complexity: "O(n)",
      space_complexity: "O(c) where c is the size of the character set"
    },
    hints: [
      "Think about what makes a string a palindrome.",
      "Have you considered case sensitivity?",
      "For a string to be a permutation of a palindrome, what must be true about the counts of each character?",
      "Could you use a bit vector to track this?"
    ],
    solution: `public boolean isPalindromePermutation(String phrase) {
    // Convert to lowercase and remove non-letters
    String cleanPhrase = phrase.toLowerCase().replaceAll("[^a-z]", "");
    
    // Count character frequencies
    int[] charCounts = new int[26]; // Assuming only lowercase letters
    for (char c : cleanPhrase.toCharArray()) {
        charCounts[c - 'a']++;
    }
    
    // Check if at most one character has an odd count
    boolean foundOdd = false;
    for (int count : charCounts) {
        if (count % 2 != 0) {
            if (foundOdd) {
                return false;
            }
            foundOdd = true;
        }
    }
    
    return true;
}

// Alternative solution using bit vector
public boolean isPalindromePermutation(String phrase) {
    // Convert to lowercase and remove non-letters
    String cleanPhrase = phrase.toLowerCase().replaceAll("[^a-z]", "");
    
    // Use a bit vector to track odd/even counts
    int bitVector = 0;
    for (char c : cleanPhrase.toCharArray()) {
        int index = c - 'a';
        // Toggle the bit at position index
        bitVector ^= (1 << index);
    }
    
    // Check if bitVector has at most one bit set to 1
    // (x & (x-1)) clears the lowest set bit in x
    return bitVector == 0 || (bitVector & (bitVector - 1)) == 0;
}`
  },
  {
    id: 5,
    topic_id: 1,
    title: "One Away",
    description: "There are three types of edits that can be performed on strings: insert a character, remove a character, or replace a character. Given two strings, write a function to check if they are one edit (or zero edits) away.",
    difficulty: "medium",
    estimated_minutes: 25,
    xp_reward: 25,
    details: {
      starter_code: `public boolean oneEditAway(String first, String second) {
    // Your code here
}`,
      test_cases: `Input: first = "pale", second = "ple"
Output: true
Input: first = "pales", second = "pale"
Output: true
Input: first = "pale", second = "bale"
Output: true
Input: first = "pale", second = "bake"
Output: false`,
      constraints: `0 <= first.length, second.length <= 5000
first and second consist of lowercase English letters.`,
      input_format: "Two strings first and second",
      output_format: "Boolean indicating if the strings are one edit (or zero edits) away",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "Start by checking the lengths of the strings.",
      "Can you break this into cases based on the length difference?",
      "What does it mean if the strings are the same length?",
      "What does it mean if the strings differ by one character in length?"
    ],
    solution: `public boolean oneEditAway(String first, String second) {
    // If lengths differ by more than 1, they can't be one edit away
    if (Math.abs(first.length() - second.length()) > 1) {
        return false;
    }
    
    // Get shorter and longer string
    String s1 = first.length() <= second.length() ? first : second;
    String s2 = first.length() <= second.length() ? second : first;
    
    int index1 = 0;
    int index2 = 0;
    boolean foundDifference = false;
    
    while (index1 < s1.length() && index2 < s2.length()) {
        if (s1.charAt(index1) != s2.charAt(index2)) {
            // If this is the second difference, return false
            if (foundDifference) {
                return false;
            }
            
            foundDifference = true;
            
            // If strings are the same length, move shorter pointer
            if (s1.length() == s2.length()) {
                index1++;
            }
            
            // Always move longer pointer
            index2++;
        } else {
            // If characters match, move both pointers
            index1++;
            index2++;
        }
    }
    
    return true;
}`
  }
];

module.exports = arraysAndStringsProblems;
