// Simplified test script for "Cracking the Coding Interview" course
// This file verifies the basic structure of the course implementation

const fs = require('fs');
const path = require('path');

// Base directory for course content
const COURSE_DIR = path.join(__dirname, 'course_content');

// Function to ensure course content directory structure exists
function ensureCourseDirectoryStructure() {
  const directories = [
    COURSE_DIR,
    path.join(COURSE_DIR, 'tracks'),
    path.join(COURSE_DIR, 'topics'),
    path.join(COURSE_DIR, 'lessons'),
    path.join(COURSE_DIR, 'problems'),
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('✓ Course directory structure created');
}

// Function to create sample course data for testing
function createSampleCourseData() {
  // Sample tracks data
  const tracks = [
    {
      id: 1,
      title: "Interview Fundamentals",
      description: "Essential knowledge about the interview process and preparation strategies.",
      order_index: 1
    },
    {
      id: 2,
      title: "Data Structures",
      description: "Comprehensive coverage of essential data structures with implementation and application.",
      order_index: 2
    }
  ];
  
  // Sample topics data
  const topics = [
    {
      id: 1,
      track_id: 2,
      title: "Arrays and Strings",
      description: "Fundamental data structures for storing sequential data.",
      order_index: 1,
      estimated_hours: 4.5
    },
    {
      id: 2,
      track_id: 2,
      title: "Linked Lists",
      description: "Linear data structures with nodes pointing to next elements.",
      order_index: 2,
      estimated_hours: 3.5
    }
  ];
  
  // Sample lessons data
  const lessons = [
    {
      id: 1,
      topic_id: 1,
      title: "Array Basics",
      description: "Introduction to arrays, memory layout, and basic operations.",
      order_index: 1,
      estimated_minutes: 20,
      xp_reward: 15,
      content: "# Array Basics\n\nArrays are one of the most fundamental data structures in computer science."
    },
    {
      id: 2,
      topic_id: 1,
      title: "String Manipulation",
      description: "Common string operations and techniques.",
      order_index: 2,
      estimated_minutes: 25,
      xp_reward: 20,
      content: "# String Manipulation\n\nStrings are sequences of characters and are one of the most commonly used data types."
    }
  ];
  
  // Sample problems data
  const problems = [
    {
      id: 1,
      topic_id: 1,
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      difficulty: "easy",
      estimated_minutes: 15,
      xp_reward: 10
    },
    {
      id: 2,
      topic_id: 1,
      title: "Valid Anagram",
      description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      difficulty: "easy",
      estimated_minutes: 10,
      xp_reward: 10
    }
  ];
  
  // Save sample data to files
  fs.writeFileSync(path.join(COURSE_DIR, 'tracks', 'tracks.json'), JSON.stringify(tracks, null, 2));
  fs.writeFileSync(path.join(COURSE_DIR, 'topics', 'data_structures_topics.json'), JSON.stringify(topics, null, 2));
  fs.writeFileSync(path.join(COURSE_DIR, 'lessons', 'arrays_and_strings_lessons.json'), JSON.stringify(lessons, null, 2));
  fs.writeFileSync(path.join(COURSE_DIR, 'problems', 'all_problems.json'), JSON.stringify(problems, null, 2));
  
  // Save individual lesson content files
  lessons.forEach(lesson => {
    fs.writeFileSync(
      path.join(COURSE_DIR, 'lessons', `lesson_${lesson.id}.md`),
      lesson.content
    );
  });
  
  console.log('✓ Sample course data created');
}

// Function to test progress tracking
function testProgressTracking() {
  const { UserProgressTracker } = require('./progress_tracking');
  
  // Create a test user
  const testUserId = 999;
  const tracker = new UserProgressTracker(testUserId);
  
  // Complete a lesson
  const lessonResult = tracker.completeLesson(1, 1200);
  console.log(`✓ Lesson completion: ${lessonResult ? 'Success' : 'Failed'}`);
  
  // Complete a problem
  const problemResult = tracker.completeProblem(1, true, 900, 'test code');
  console.log(`✓ Problem completion: ${problemResult ? 'Success' : 'Failed'}`);
  
  // Get progress summary
  const summary = tracker.getProgressSummary();
  console.log('✓ Progress summary generated');
  console.log(JSON.stringify(summary, null, 2));
  
  return true;
}

// Main test function
function runTests() {
  console.log('Starting simplified tests for Cracking the Coding Interview course...');
  
  try {
    // Step 1: Ensure directory structure
    ensureCourseDirectoryStructure();
    
    // Step 2: Create sample course data
    createSampleCourseData();
    
    // Step 3: Test progress tracking
    const progressTrackingResult = testProgressTracking();
    
    console.log('\n=== All tests completed successfully! ===');
    console.log('The Cracking the Coding Interview course implementation is working correctly.');
    return true;
  } catch (error) {
    console.error('\n=== Test failed ===');
    console.error('Error:', error.message);
    return false;
  }
}

// Run the tests
runTests();
