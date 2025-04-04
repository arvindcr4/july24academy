'use client';

import { useState, useEffect } from 'react';
import { Button, ProgressBar, Badge } from '@/components/ui';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface CourseDetailProps {
  params: {
    id: string;
  };
}

export default function CourseDetail() {
  const params = useParams();
  const courseId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '1';
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        
        const courseData = {
          id: parseInt(courseId),
          title: 'Algebra Fundamentals',
          description: 'Master the core concepts of algebra, from equations to functions and beyond.',
          difficulty_level: 'Beginner',
          estimated_hours: 40,
          completion_percentage: 65,
          lessons: [
            {
              id: 1,
              title: 'Introduction to Algebra',
              description: 'Learn the basic concepts and notation of algebra.',
              completed: true,
              content: `
# Introduction to Algebra

Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations.

## Key Concepts

- **Variables**: Letters that represent unknown values
- **Constants**: Fixed values that don't change
- **Expressions**: Combinations of variables and constants using operations
- **Equations**: Mathematical statements that assert the equality of two expressions

## Example

The equation \`x + 5 = 10\` uses a variable \`x\` to represent an unknown value.
To solve this equation, we need to find the value of \`x\` that makes the equation true.

\`\`\`
x + 5 = 10
x = 10 - 5
x = 5
\`\`\`

Therefore, \`x = 5\` is the solution to the equation.
              `
            },
            {
              id: 2,
              title: 'Solving Linear Equations',
              description: 'Learn techniques for solving first-degree equations.',
              completed: false,
              content: `
# Solving Linear Equations

Linear equations are equations where the variable has a degree of 1 (no exponents).

## Steps to Solve Linear Equations

1. Simplify each side of the equation by combining like terms
2. Use addition or subtraction to isolate the variable term on one side
3. Use multiplication or division to solve for the variable

## Examples

### Example 1: Simple Equation

\`\`\`
2x + 3 = 11
2x = 11 - 3
2x = 8
x = 4
\`\`\`

### Example 2: Equation with Variables on Both Sides

\`\`\`
3x + 2 = 5x - 4
3x - 5x = -4 - 2
-2x = -6
x = 3
\`\`\`
              `
            },
            {
              id: 3,
              title: 'Working with Expressions',
              description: 'Learn how to manipulate and simplify algebraic expressions.',
              completed: false,
              content: `
# Working with Algebraic Expressions

Algebraic expressions are combinations of variables, constants, and operations.

## Key Operations

- **Simplifying**: Combining like terms
- **Expanding**: Multiplying terms to remove parentheses
- **Factoring**: Finding common factors to simplify expressions

## Examples

### Simplifying Expressions

\`\`\`
3x + 2y + 5x - y = 8x + y
\`\`\`

### Expanding Expressions

\`\`\`
2(x + 3) = 2x + 6
\`\`\`

### Factoring Expressions

\`\`\`
6x + 9 = 3(2x + 3)
\`\`\`
              `
            }
          ],
          practice_questions: [
            {
              id: 1,
              question: "Solve for x: 2x + 5 = 15",
              options: ["x = 5", "x = 10", "x = 7.5", "x = 3"],
              correct_answer: "x = 5",
              explanation: "To solve 2x + 5 = 15, subtract 5 from both sides to get 2x = 10, then divide both sides by 2 to get x = 5."
            },
            {
              id: 2,
              question: "Simplify the expression: 3(x + 2) - 2(x - 1)",
              options: ["x + 8", "x + 4", "5x + 4", "5x - 4"],
              correct_answer: "x + 8",
              explanation: "3(x + 2) - 2(x - 1) = 3x + 6 - 2x + 2 = x + 8"
            }
          ]
        };
        
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  const currentLesson = course?.lessons?.[currentLessonIndex];
  const currentQuestion = course?.practice_questions?.[0];

  const handleNextLesson = () => {
    if (currentLessonIndex < (course?.lessons?.length || 0) - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setShowQuestion(false);
      setIsCorrect(null);
      setUserAnswer('');
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setShowQuestion(false);
      setIsCorrect(null);
      setUserAnswer('');
    }
  };

  const handlePractice = () => {
    setShowQuestion(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswer(answer);
    setIsCorrect(answer === currentQuestion?.correct_answer);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Course Not Found</h1>
          <p className="mt-4">The course you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/courses" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Courses
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>
            <Badge variant={course.difficulty_level === 'Beginner' ? 'info' : course.difficulty_level === 'Intermediate' ? 'success' : 'warning'}>
              {course.difficulty_level}
            </Badge>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{course.completion_percentage}%</span>
            </div>
            <ProgressBar value={course.completion_percentage} max={100} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 border-r border-gray-200 pr-6">
              <h3 className="text-lg font-bold mb-4">Lessons</h3>
              <ul className="space-y-2">
                {course.lessons.map((lesson: any, index: number) => (
                  <li 
                    key={lesson.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      index === currentLessonIndex 
                        ? 'bg-blue-100 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-100'
                    } ${lesson.completed ? 'text-gray-700' : 'text-gray-900'}`}
                    onClick={() => setCurrentLessonIndex(index)}
                  >
                    <div className="flex items-center">
                      {lesson.completed && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>{lesson.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:col-span-3">
              {!showQuestion ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handlePreviousLesson}
                        disabled={currentLessonIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleNextLesson}
                        disabled={currentLessonIndex === course.lessons.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none mb-6">
                    <div dangerouslySetInnerHTML={{ __html: currentLesson?.content.replace(/\n/g, '<br>') }} />
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <Button onClick={handlePractice}>
                      Practice Questions
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Practice Question</h2>
                    <Button variant="outline" onClick={() => setShowQuestion(false)}>
                      Back to Lesson
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-medium mb-4">{currentQuestion?.question}</h3>
                    
                    <div className="space-y-3">
                      {currentQuestion?.options.map((option: string) => (
                        <div 
                          key={option}
                          className={`p-3 rounded-lg border cursor-pointer ${
                            userAnswer === option 
                              ? isCorrect 
                                ? 'bg-green-100 border-green-500' 
                                : 'bg-red-100 border-red-500'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                          onClick={() => handleAnswerSelect(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    {isCorrect !== null && (
                      <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="font-bold mb-2">
                          {isCorrect ? 'Correct!' : 'Incorrect!'}
                        </div>
                        <div>
                          {currentQuestion?.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
