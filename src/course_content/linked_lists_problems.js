// Practice problems for Linked Lists topic
// Based on "Cracking the Coding Interview" by Gayle Laakmann McDowell

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
      starter_code: `public void removeDuplicates(LinkedListNode head) {
    // Your code here
}`,
      test_cases: `Input: 1->2->3->2->1
Output: 1->2->3
Input: 1->1->1->1->1
Output: 1`,
      constraints: `0 <= list length <= 30000
The values of the list nodes are in the range [0, 100]`,
      input_format: "The head of a linked list",
      output_format: "The head of the linked list with duplicates removed",
      time_complexity: "O(n)",
      space_complexity: "O(n) or O(1) for follow-up"
    },
    hints: [
      "Have you tried using a hash table? You can use it to track which elements have been seen.",
      "Without extra space, you can use two pointers: current and runner.",
      "The runner pointer can check all subsequent nodes for duplicates.",
      "Without a buffer, you'll need O(n²) time."
    ],
    solution: `// Solution 1: Using a hash set (O(n) time, O(n) space)
public void removeDuplicates(LinkedListNode head) {
    if (head == null) return;
    
    HashSet<Integer> set = new HashSet<>();
    LinkedListNode current = head;
    LinkedListNode previous = null;
    
    while (current != null) {
        if (set.contains(current.data)) {
            // Duplicate found, remove it
            previous.next = current.next;
        } else {
            // New element, add to set
            set.add(current.data);
            previous = current;
        }
        current = current.next;
    }
}

// Solution 2: Without a buffer (O(n²) time, O(1) space)
public void removeDuplicatesNoBuffer(LinkedListNode head) {
    if (head == null) return;
    
    LinkedListNode current = head;
    
    while (current != null) {
        // Remove all future nodes with the same value
        LinkedListNode runner = current;
        while (runner.next != null) {
            if (runner.next.data == current.data) {
                runner.next = runner.next.next;
            } else {
                runner = runner.next;
            }
        }
        current = current.next;
    }
}`
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
      starter_code: `public LinkedListNode kthToLast(LinkedListNode head, int k) {
    // Your code here
}`,
      test_cases: `Input: 1->2->3->4->5, k=2
Output: 4 (the 2nd to last element)
Input: 1->2->3->4->5, k=1
Output: 5 (the last element)`,
      constraints: `1 <= k <= list length
The values of the list nodes are in the range [0, 100]`,
      input_format: "The head of a linked list and an integer k",
      output_format: "The kth to last node of the linked list",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "Can you solve this recursively? Be careful with the base case.",
      "Try using two pointers, with one pointer k nodes ahead of the other.",
      "When the first pointer reaches the end, the second pointer will be at the kth to last element."
    ],
    solution: `// Solution 1: Two-pointer technique
public LinkedListNode kthToLast(LinkedListNode head, int k) {
    LinkedListNode p1 = head;
    LinkedListNode p2 = head;
    
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
}

// Solution 2: Recursive approach (returns the value, not the node)
public int kthToLastRecursive(LinkedListNode head, int k) {
    if (head == null) {
        return 0;
    }
    
    int index = kthToLastRecursive(head.next, k) + 1;
    if (index == k) {
        System.out.println("Kth to last element: " + head.data);
    }
    
    return index;
}`
  },
  {
    id: 8,
    topic_id: 2,
    title: "Delete Middle Node",
    description: "Implement an algorithm to delete a node in the middle (i.e., any node but the first and last node, not necessarily the exact middle) of a singly linked list, given only access to that node.",
    difficulty: "easy",
    estimated_minutes: 10,
    xp_reward: 10,
    details: {
      starter_code: `public boolean deleteMiddleNode(LinkedListNode node) {
    // Your code here
}`,
      test_cases: `Input: the node 'c' from a->b->c->d->e->f
Output: a->b->d->e->f`,
      constraints: `The node to be deleted is not the first or last node
The node contains a value between 0 and 100`,
      input_format: "A node from a linked list (not the head or tail)",
      output_format: "Boolean indicating if the operation was successful",
      time_complexity: "O(1)",
      space_complexity: "O(1)"
    },
    hints: [
      "You don't have access to the head of the list, only to the node to be deleted.",
      "Can you make this node look like the next node?"
    ],
    solution: `public boolean deleteMiddleNode(LinkedListNode node) {
    if (node == null || node.next == null) {
        return false; // Cannot delete last node with this method
    }
    
    // Copy data from the next node to this node
    LinkedListNode next = node.next;
    node.data = next.data;
    
    // Delete the next node
    node.next = next.next;
    
    return true;
}`
  },
  {
    id: 9,
    topic_id: 2,
    title: "Partition",
    description: "Write code to partition a linked list around a value x, such that all nodes less than x come before all nodes greater than or equal to x. If x is contained within the list, the values of x only need to be after the elements less than x. The partition element x can appear anywhere in the 'right partition'; it does not need to appear between the left and right partitions.",
    difficulty: "medium",
    estimated_minutes: 20,
    xp_reward: 20,
    details: {
      starter_code: `public LinkedListNode partition(LinkedListNode head, int x) {
    // Your code here
}`,
      test_cases: `Input: 3->5->8->5->10->2->1, x=5
Output: 3->2->1->5->8->5->10 (or any other valid partition)`,
      constraints: `The list can contain duplicate values
The values of the list nodes are in the range [0, 100]`,
      input_format: "The head of a linked list and an integer x",
      output_format: "The head of the partitioned linked list",
      time_complexity: "O(n)",
      space_complexity: "O(1)"
    },
    hints: [
      "Create two different linked lists: one for elements less than x and one for elements greater than or equal to x.",
      "Iterate through the original list, inserting each element into the appropriate new list.",
      "Merge the two lists at the end."
    ],
    solution: `public LinkedListNode partition(LinkedListNode head, int x) {
    LinkedListNode beforeStart = null;
    LinkedListNode beforeEnd = null;
    LinkedListNode afterStart = null;
    LinkedListNode afterEnd = null;
    
    // Partition list
    while (head != null) {
        LinkedListNode next = head.next;
        head.next = null;
        
        if (head.data < x) {
            // Insert node into end of before list
            if (beforeStart == null) {
                beforeStart = head;
                beforeEnd = beforeStart;
            } else {
                beforeEnd.next = head;
                beforeEnd = head;
            }
        } else {
            // Insert node into end of after list
            if (afterStart == null) {
                afterStart = head;
                afterEnd = afterStart;
            } else {
                afterEnd.next = head;
                afterEnd = head;
            }
        }
        
        head = next;
    }
    
    if (beforeStart == null) {
        return afterStart;
    }
    
    // Merge before list and after list
    beforeEnd.next = afterStart;
    
    return beforeStart;
}`
  },
  {
    id: 10,
    topic_id: 2,
    title: "Sum Lists",
    description: "You have two numbers represented by a linked list, where each node contains a single digit. The digits are stored in reverse order, such that the 1's digit is at the head of the list. Write a function that adds the two numbers and returns the sum as a linked list. FOLLOW UP: Suppose the digits are stored in forward order. Repeat the above problem.",
    difficulty: "hard",
    estimated_minutes: 25,
    xp_reward: 25,
    details: {
      starter_code: `public LinkedListNode sumLists(LinkedListNode l1, LinkedListNode l2) {
    // Your code here
}

// Follow up
public LinkedListNode sumListsForward(LinkedListNode l1, LinkedListNode l2) {
    // Your code here
}`,
      test_cases: `Input: (7->1->6) + (5->9->2), which represents 617 + 295
Output: 2->1->9, which represents 912

Follow up:
Input: (6->1->7) + (2->9->5), which represents 617 + 295
Output: 9->1->2, which represents 912`,
      constraints: `The linked lists can have different lengths
The values of the list nodes are single digits (0-9)`,
      input_format: "Two linked lists representing numbers",
      output_format: "A linked list representing the sum",
      time_complexity: "O(max(n, m))",
      space_complexity: "O(max(n, m))"
    },
    hints: [
      "For the reverse order problem, try using elementary math addition.",
      "Keep track of the carry as you move along the lists.",
      "For the forward order problem, consider using recursion.",
      "You might need to pad the shorter list with zeros."
    ],
    solution: `// Reverse order (easier case)
public LinkedListNode sumLists(LinkedListNode l1, LinkedListNode l2) {
    LinkedListNode dummyHead = new LinkedListNode(0);
    LinkedListNode current = dummyHead;
    int carry = 0;
    
    while (l1 != null || l2 != null) {
        int x = (l1 != null) ? l1.data : 0;
        int y = (l2 != null) ? l2.data : 0;
        int sum = carry + x + y;
        carry = sum / 10;
        
        current.next = new LinkedListNode(sum % 10);
        current = current.next;
        
        if (l1 != null) l1 = l1.next;
        if (l2 != null) l2 = l2.next;
    }
    
    if (carry > 0) {
        current.next = new LinkedListNode(carry);
    }
    
    return dummyHead.next;
}

// Forward order (follow up)
public LinkedListNode sumListsForward(LinkedListNode l1, LinkedListNode l2) {
    // Pad the shorter list with zeros
    int length1 = length(l1);
    int length2 = length(l2);
    
    if (length1 < length2) {
        l1 = padList(l1, length2 - length1);
    } else if (length2 < length1) {
        l2 = padList(l2, length1 - length2);
    }
    
    // Recursive call to add lists
    PartialSum sum = addListsHelper(l1, l2);
    
    // If there's a carry, insert it at the beginning
    if (sum.carry == 0) {
        return sum.sum;
    } else {
        LinkedListNode result = new LinkedListNode(sum.carry);
        result.next = sum.sum;
        return result;
    }
}

private PartialSum addListsHelper(LinkedListNode l1, LinkedListNode l2) {
    if (l1 == null && l2 == null) {
        return new PartialSum();
    }
    
    // Add smaller digits recursively
    PartialSum sum = addListsHelper(l1.next, l2.next);
    
    // Add current digits and the carry
    int val = sum.carry + l1.data + l2.data;
    
    // Create new node with the sum % 10
    LinkedListNode result = new LinkedListNode(val % 10);
    result.next = sum.sum;
    
    // Update sum and carry
    sum.sum = result;
    sum.carry = val / 10;
    
    return sum;
}

private int length(LinkedListNode head) {
    int length = 0;
    while (head != null) {
        length++;
        head = head.next;
    }
    return length;
}

private LinkedListNode padList(LinkedListNode head, int padding) {
    LinkedListNode newHead = head;
    for (int i = 0; i < padding; i++) {
        LinkedListNode node = new LinkedListNode(0);
        node.next = newHead;
        newHead = node;
    }
    return newHead;
}

// Helper class for the forward order solution
class PartialSum {
    public LinkedListNode sum = null;
    public int carry = 0;
}`
  }
];

module.exports = linkedListsProblems;
