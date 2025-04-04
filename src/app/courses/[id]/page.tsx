'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, ProgressBar, Badge } from '@/components/ui';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Section {
  id: string;
  type: 'content' | 'question';
  title: string;
  content?: string;
  question?: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  completed: boolean;
}

interface CourseData {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  completion_percentage: number;
  sections: Section[];
}

export default function CourseDetail() {
  const params = useParams();
  const courseId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '1';
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [sectionResults, setSectionResults] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        
        const courseData: CourseData = {
          id: parseInt(courseId),
          title: 'Algebra Fundamentals',
          description: 'Master the core concepts of algebra, from equations to functions and beyond.',
          difficulty_level: 'Beginner',
          estimated_hours: 40,
          completion_percentage: 65,
          sections: [
            {
              id: 'section-1',
              type: 'content',
              title: 'Introduction to Algebra',
              content: `
# Introduction to Algebra

Algebra is a branch of mathematics that uses symbols and letters to represent numbers and quantities in formulas and equations.

## Key Concepts

- **Variables**: Letters that represent unknown values
- **Constants**: Fixed values that don't change
- **Expressions**: Combinations of variables and constants using operations
- **Equations**: Mathematical statements that assert the equality of two expressions
              `,
              completed: true
            },
            {
              id: 'question-1',
              type: 'question',
              title: 'Variables in Algebra',
              question: "What do variables represent in algebra?",
              options: [
                "Only positive numbers", 
                "Unknown values or quantities", 
                "Only integers", 
                "Only decimal numbers"
              ],
              correct_answer: "Unknown values or quantities",
              explanation: "Variables in algebra are symbols (usually letters) that represent unknown values or quantities in mathematical expressions and equations.",
              completed: false
            },
            {
              id: 'section-2',
              type: 'content',
              title: 'Basic Algebraic Equations',
              content: `
## Example

The equation \`x + 5 = 10\` uses a variable \`x\` to represent an unknown value.
To solve this equation, we need to find the value of \`x\` that makes the equation true.

\`\`\`
x + 5 = 10
x = 10 - 5
x = 5
\`\`\`

Therefore, \`x = 5\` is the solution to the equation.
              `,
              completed: false
            },
            {
              id: 'question-2',
              type: 'question',
              title: 'Solving Equations',
              question: "Solve for x: 2x + 5 = 15",
              options: ["x = 5", "x = 10", "x = 7.5", "x = 3"],
              correct_answer: "x = 5",
              explanation: "To solve 2x + 5 = 15, subtract 5 from both sides to get 2x = 10, then divide both sides by 2 to get x = 5.",
              completed: false
            },
            {
              id: 'section-3',
              type: 'content',
              title: 'Solving Linear Equations',
              content: `
# Solving Linear Equations

Linear equations are equations where the variable has a degree of 1 (no exponents).

## Steps to Solve Linear Equations

1. Simplify each side of the equation by combining like terms
2. Use addition or subtraction to isolate the variable term on one side
3. Use multiplication or division to solve for the variable
              `,
              completed: false
            },
            {
              id: 'question-3',
              type: 'question',
              title: 'Linear Equations',
              question: "Which of the following is a linear equation?",
              options: [
                "y = x²", 
                "y = 3x + 2", 
                "y = 1/x", 
                "y = √x"
              ],
              correct_answer: "y = 3x + 2",
              explanation: "A linear equation has variables with a degree of 1 (no exponents). The equation y = 3x + 2 is linear because x has a degree of 1.",
              completed: false
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

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer]);

  const handleAnswerSelect = (sectionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [sectionId]: answer }));
    
    const section = course?.sections.find(s => s.id === sectionId);
    if (section && section.type === 'question') {
      const isCorrect = answer === section.correct_answer;
      setSectionResults(prev => ({ ...prev, [sectionId]: isCorrect }));
      setShowExplanation(prev => ({ ...prev, [sectionId]: true }));
      
      const currentIndex = course.sections.findIndex(s => s.id === sectionId);
      if (currentIndex < course.sections.length - 1) {
        const timer = setTimeout(() => {
          setCurrentSectionIndex(currentIndex + 1);
        }, 1500);
        setAutoAdvanceTimer(timer);
      }
    }
  };

  const handleNextSection = () => {
    if (course && currentSectionIndex < course.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const handleContinue = () => {
    if (course && currentSectionIndex < course.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
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

  const completedSections = course.sections.filter(section => 
    section.completed || (section.type === 'question' && sectionResults[section.id] === true)
  ).length;
  const progressPercentage = Math.round((completedSections / course.sections.length) * 100);
  const currentSection = course.sections[currentSectionIndex];

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
              <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
            </div>
            <ProgressBar value={progressPercentage} max={100} />
          </div>
          
          <div className="flex justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={handlePreviousSection}
              disabled={currentSectionIndex === 0}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={handleNextSection}
              disabled={currentSectionIndex === course.sections.length - 1}
            >
              Next
            </Button>
          </div>
          
          <div ref={contentContainerRef} className="min-h-[400px] relative">
            <div 
              key={currentSection.id} 
              ref={el => sectionRefs.current[currentSection.id] = el}
              className="p-6 rounded-lg border border-blue-500 shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4">{currentSection.title}</h2>
              
              {currentSection.type === 'content' && (
                <div className="prose max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: currentSection.content?.replace(/\n/g, '<br>') || '' }} />
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleContinue}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {currentSection.type === 'question' && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-4">{currentSection.question}</h3>
                  
                  <div className="space-y-3">
                    {currentSection.options?.map((option) => (
                      <div 
                        key={option}
                        className={`p-3 rounded-lg border cursor-pointer ${
                          userAnswers[currentSection.id] === option 
                            ? sectionResults[currentSection.id] 
                              ? 'bg-green-100 border-green-500' 
                              : 'bg-red-100 border-red-500'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                        onClick={() => handleAnswerSelect(currentSection.id, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  
                  {showExplanation[currentSection.id] && (
                    <div className={`mt-6 p-4 rounded-lg ${sectionResults[currentSection.id] ? 'bg-green-100' : 'bg-red-100'}`}>
                      <div className="font-bold mb-2">
                        {sectionResults[currentSection.id] ? 'Correct!' : 'Incorrect!'}
                      </div>
                      <div>
                        {currentSection.explanation}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
