# Course Design Instructions for Math Academy-Style Learning Platforms

This document provides comprehensive guidelines for designing and implementing educational courses similar to those on mathacademy.com. It covers course structure, content organization, question formulation, and handling PDF book uploads.

## Table of Contents

1. [Course Structure](#course-structure)
2. [Content Organization](#content-organization)
3. [Lesson Design](#lesson-design)
4. [Practice Problem Design](#practice-problem-design)
5. [Question Types and Formulation](#question-types-and-formulation)
6. [Processing PDF Books](#processing-pdf-books)
7. [Gamification Elements](#gamification-elements)
8. [Database Schema](#database-schema)

## Course Structure

### Tracks and Topics

Organize your curriculum into high-level tracks, each containing multiple topics:

```javascript
// Example track definition
const tracks = [
  {
    id: 1,
    title: "Interview Fundamentals",
    description: "Essential knowledge about the interview process and preparation strategies.",
    icon: "interview_icon.svg",
    order_index: 1
  },
  // Additional tracks...
];
```

Each track should:
- Have a clear, descriptive title
- Include a concise description of what learners will gain
- Be assigned an order index for proper sequencing
- Have a representative icon

### Topics

Within each track, organize content into topics:

```javascript
// Example topic definition
const topics = [
  {
    id: 1,
    track_id: 3,
    title: "Arrays and Strings",
    description: "Fundamental techniques for manipulating arrays and strings.",
    order_index: 1
  },
  // Additional topics...
];
```

Topics should:
- Be logically grouped under appropriate tracks
- Have progressive difficulty levels
- Include 3-7 lessons each
- Be sequenced in a logical learning progression

## Content Organization

### File Structure

Organize your course content in a structured directory:

```
/src/course_content/
  ├── course_tracks.js       # High-level tracks
  ├── [topic]_topics.js      # Topics for each track
  ├── [topic]_lessons.js     # Lessons for each topic
  └── [topic]_problems.js    # Practice problems for each topic
```

### Content Relationships

Establish clear relationships between content elements:
- Tracks contain Topics
- Topics contain Lessons and Problems
- Lessons may have Prerequisites
- Lessons include Key Points

## Lesson Design

### Lesson Structure

Each lesson should follow this structure:

```javascript
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
    
    Arrays are one of the most fundamental data structures in computer science...
    
    ## Memory Layout
    
    In memory, an array looks like this:
    
    [0]   [1]   [2]   [3]   [4]
    
    ## Basic Operations
    
    ### 1. Accessing Elements
    
    Accessing an element at a specific index is an O(1) operation:
    
    \`\`\`java
    int value = array[3]; // Get the element at index 3
    \`\`\`
    
    // Additional content...
  `
}
```

### Markdown Content Guidelines

Format lesson content using Markdown with these sections:
1. **Title**: Main concept name (H1)
2. **Introduction**: Brief overview of the concept
3. **Core Sections**: Detailed explanations (H2)
4. **Subsections**: Specific aspects or techniques (H3)
5. **Code Examples**: Include practical examples in relevant languages
6. **Diagrams**: Use ASCII diagrams when helpful
7. **Time/Space Complexity**: Include for algorithms and data structures
8. **Best Practices**: Practical advice for implementation

### Key Points

Identify 3-5 key points for each lesson that summarize the critical concepts:

```sql
INSERT INTO key_points (lesson_id, content, order_index) VALUES
(1, 'An equation is a mathematical statement that asserts the equality of two expressions', 1),
(1, 'To solve an equation, isolate the variable on one side', 2),
(1, 'The solution to an equation is the value that makes the equation true', 3);
```

## Practice Problem Design

### Problem Structure

Design practice problems with this structure:

```javascript
{
  id: 1,
  topic_id: 1,
  title: "Is Unique",
  description: "Implement an algorithm to determine if a string has all unique characters.",
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
    Output: false`,
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
  solution: `// Solution with detailed explanation...`
}
```

### Problem Difficulty Levels

Categorize problems by difficulty:
- **Easy**: Fundamental concepts, straightforward application
- **Medium**: Multiple concepts, some algorithmic thinking
- **Hard**: Complex algorithms, optimization challenges

### XP Rewards

Assign XP rewards based on difficulty and estimated time:
- Easy: 5-15 XP
- Medium: 15-25 XP
- Hard: 25-40 XP

## Question Types and Formulation

### Question Types

Support multiple question formats:

1. **Multiple Choice**
   ```javascript
   {
     type: 'multiple_choice',
     question: 'Which of the following is an equation?',
     options: [
       { id: 'a', label: 'x + 5', value: 'x + 5' },
       { id: 'b', label: 'x + 5 = 10', value: 'x + 5 = 10' },
       { id: 'c', label: 'x > 5', value: 'x > 5' },
       { id: 'd', label: 'x + 5 < 10', value: 'x + 5 < 10' }
     ],
     correctAnswer: 'x + 5 = 10',
     explanation: 'An equation contains an equals sign (=) and asserts that two expressions are equal.'
   }
   ```

2. **Numeric Answer**
   ```javascript
   {
     type: 'numeric',
     question: 'Solve for x: 3x + 5 = 14',
     correctAnswer: '3',
     explanation: 'Subtract 5 from both sides: 3x = 9. Then divide both sides by 3: x = 3.'
   }
   ```

3. **Text Answer**
   ```javascript
   {
     type: 'text',
     question: 'What data structure would you use to efficiently check if an element exists in a collection?',
     correctAnswer: 'hash table',
     acceptableAnswers: ['hash table', 'hashmap', 'hash set', 'hashset', 'dictionary'],
     explanation: 'Hash tables provide O(1) average-case lookup time, making them ideal for existence checks.'
   }
   ```

4. **Expression Answer**
   ```javascript
   {
     type: 'expression',
     question: 'Write an expression for the area of a circle with radius r.',
     correctAnswer: 'π*r^2',
     acceptableAnswers: ['π*r^2', 'pi*r^2', 'pi*r*r', 'π*r*r', 'πr²'],
     explanation: 'The area of a circle is calculated using the formula A = πr².'
   }
   ```

### Question Formulation Guidelines

When creating questions:

1. **Be Clear and Specific**
   - Use precise language
   - Avoid ambiguity
   - State exactly what you're asking for

2. **Provide Context**
   - Include relevant background information
   - Define any specialized terms
   - Set up the problem scenario clearly

3. **Include Constraints**
   - Specify input ranges
   - Note time/space complexity requirements
   - Mention any special conditions

4. **Design Distractors (for Multiple Choice)**
   - Make incorrect options plausible
   - Include common misconceptions
   - Avoid obviously wrong answers

5. **Write Explanations**
   - Explain the correct answer thoroughly
   - Address why incorrect approaches fail
   - Include step-by-step reasoning

## Processing PDF Books

### PDF Extraction Workflow

When converting a PDF book into course content:

1. **Extract Text and Structure**
   - Use PDF parsing libraries to extract text
   - Preserve chapter and section structure
   - Identify code blocks, diagrams, and equations

2. **Content Segmentation**
   - Divide content into logical lessons
   - Group related concepts into topics
   - Maintain the book's progression structure

3. **Question Generation**
   - Identify key concepts in each section
   - Create questions that test understanding
   - Include examples from the book as practice problems

### Implementation Example

```javascript
// PDF processing function (conceptual)
async function processPdfBook(pdfPath) {
  // Extract text content
  const pdfContent = await extractPdfText(pdfPath);
  
  // Segment into chapters and sections
  const chapters = segmentIntoChapters(pdfContent);
  
  // Generate course structure
  const courseStructure = {
    title: extractBookTitle(pdfContent),
    description: generateDescription(pdfContent),
    topics: chapters.map((chapter, index) => ({
      id: index + 1,
      title: chapter.title,
      description: chapter.summary,
      order_index: index + 1,
      lessons: generateLessonsFromChapter(chapter)
    }))
  };
  
  // Generate practice problems
  const problems = generateProblemsFromContent(pdfContent);
  
  return { courseStructure, problems };
}

// Generate lessons from chapter content
function generateLessonsFromChapter(chapter) {
  return chapter.sections.map((section, index) => ({
    id: `${chapter.id}_${index + 1}`,
    title: section.title,
    description: generateSectionSummary(section),
    order_index: index + 1,
    content: formatContentAsMarkdown(section.content),
    estimated_minutes: estimateReadingTime(section.content),
    xp_reward: calculateXpReward(section.complexity)
  }));
}

// Generate practice problems from content
function generateProblemsFromContent(content) {
  const problems = [];
  
  // Extract examples and exercises
  const examples = extractExamples(content);
  const exercises = extractExercises(content);
  
  // Convert examples to practice problems
  examples.forEach(example => {
    problems.push(convertExampleToProblem(example));
  });
  
  // Convert exercises to practice problems
  exercises.forEach(exercise => {
    problems.push(convertExerciseToProblem(exercise));
  });
  
  return problems;
}
```

### PDF Content Adaptation Guidelines

When adapting PDF content:

1. **Maintain Original Structure**
   - Follow the book's logical progression
   - Preserve the author's teaching approach
   - Keep related concepts together

2. **Enhance with Interactive Elements**
   - Add interactive visualizations
   - Include step-by-step walkthroughs
   - Create interactive code examples

3. **Supplement with Additional Resources**
   - Add modern examples
   - Include links to related content
   - Provide alternative explanations

4. **Create Varied Question Types**
   - Convert text examples to multiple-choice questions
   - Transform exercises into coding problems
   - Create conceptual questions from chapter summaries

## Gamification Elements

### XP and Progression

Implement a progression system:

```sql
-- XP History Table
CREATE TABLE IF NOT EXISTS xp_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Daily Streaks Table
CREATE TABLE IF NOT EXISTS daily_streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  streak_count INTEGER NOT NULL,
  streak_date DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Streak Mechanics

Implement daily streaks to encourage regular learning:
- Award streak bonuses for consecutive days of learning
- Display current streak prominently
- Provide streak recovery mechanisms

### Achievement System

Create achievements for:
- Completing courses
- Mastering difficult concepts
- Maintaining learning streaks
- Solving challenging problems

## Database Schema

### Core Tables

Implement these essential tables:

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  xp INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  difficulty TEXT,
  category_id INTEGER,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses (id)
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER,
  title TEXT NOT NULL,
  content TEXT,
  difficulty INTEGER,
  xp_reward INTEGER DEFAULT 10,
  order_index INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics (id)
);

-- Problems Table
CREATE TABLE IF NOT EXISTS problems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  difficulty INTEGER,
  xp_reward INTEGER DEFAULT 20,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES topics (id)
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  lesson_id INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (lesson_id) REFERENCES lessons (id)
);

-- Practice Attempts Table
CREATE TABLE IF NOT EXISTS practice_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  problem_id INTEGER NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (problem_id) REFERENCES problems(id)
);
```

### Relationship Management

Implement these relationship tables:

```sql
-- Prerequisites Table
CREATE TABLE IF NOT EXISTS prerequisites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  prerequisite_lesson_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (prerequisite_lesson_id) REFERENCES lessons(id)
);

-- Key Points Table
CREATE TABLE IF NOT EXISTS key_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

---

By following these guidelines, you can create a comprehensive, engaging learning platform similar to mathacademy.com. This structure supports adaptive learning, gamification, and a clear progression path for learners while maintaining high-quality educational content.
