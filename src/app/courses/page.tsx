'use client';

import { Button } from '@/components/ui';
import { ProgressBar } from '@/components/ui';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useState, useEffect } from 'react';

export default function Courses() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Fetch categories and courses
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call for categories
        const categoriesData = [
          { id: 'all', name: 'All Courses' },
          { id: 'math', name: 'Mathematics' },
          { id: 'cs', name: 'Computer Science' },
          { id: 'physics', name: 'Physics' }
        ];
        
        // Simulate API call for courses
        const coursesData = [
          {
            id: 1,
            title: 'Algebra Fundamentals',
            description: 'Master the core concepts of algebra, from equations to functions and beyond.',
            difficulty_level: 'Beginner',
            estimated_hours: 40,
            topicsCount: 8,
            lessonsCount: 24,
            tags: [{ id: 1, name: 'Math' }, { id: 2, name: 'Algebra' }],
            authors: [{ name: 'Dr. Jane Smith' }],
            category: 'math',
            enrollment: {
              completion_percentage: 65
            }
          },
          {
            id: 2,
            title: 'Calculus I',
            description: 'Learn the fundamentals of calculus including limits, derivatives, and integrals.',
            difficulty_level: 'Intermediate',
            estimated_hours: 60,
            topicsCount: 10,
            lessonsCount: 30,
            tags: [{ id: 1, name: 'Math' }, { id: 3, name: 'Calculus' }],
            authors: [{ name: 'Prof. Michael Johnson' }],
            category: 'math',
            enrollment: null
          },
          {
            id: 3,
            title: 'Introduction to Programming',
            description: 'Start your coding journey with this comprehensive introduction to programming concepts.',
            difficulty_level: 'Beginner',
            estimated_hours: 45,
            topicsCount: 12,
            lessonsCount: 36,
            tags: [{ id: 4, name: 'Programming' }, { id: 5, name: 'Python' }],
            authors: [{ name: 'Sarah Williams' }, { name: 'David Chen' }],
            category: 'cs',
            enrollment: {
              completion_percentage: 25
            }
          },
          {
            id: 4,
            title: 'Data Structures & Algorithms',
            description: 'Master essential data structures and algorithms for efficient problem-solving.',
            difficulty_level: 'Advanced',
            estimated_hours: 80,
            topicsCount: 15,
            lessonsCount: 45,
            tags: [{ id: 4, name: 'Programming' }, { id: 6, name: 'Algorithms' }],
            authors: [{ name: 'Prof. Robert Lee' }],
            category: 'cs',
            enrollment: null
          },
          {
            id: 5,
            title: 'Classical Mechanics',
            description: 'Explore the fundamental principles of classical mechanics and Newtonian physics.',
            difficulty_level: 'Intermediate',
            estimated_hours: 55,
            topicsCount: 9,
            lessonsCount: 27,
            tags: [{ id: 7, name: 'Physics' }, { id: 8, name: 'Mechanics' }],
            authors: [{ name: 'Dr. Emily Rodriguez' }],
            category: 'physics',
            enrollment: null
          }
        ];
        
        setCategories(categoriesData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter courses based on active category
  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Courses</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-4">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                  <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div className={`h-48 bg-${getCourseColor(course.difficulty_level)}-600 flex items-center justify-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium text-${getCourseColor(course.difficulty_level)}-600`}>
                          {course.difficulty_level}
                        </span>
                        <span className="text-sm text-gray-500">
                          {course.estimated_hours ? `${course.estimated_hours} hours` : ''}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4">
                        {course.description}
                      </p>
                      
                      {/* Tags */}
                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.tags.map(tag => (
                            <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{course.topicsCount} Topics</span>
                          <span className="text-sm font-medium text-gray-700">{course.lessonsCount} Lessons</span>
                        </div>
                        <ProgressBar value={course.enrollment?.completion_percentage || 0} max={100} size="sm" />
                      </div>
                      
                      {/* Authors */}
                      {course.authors && course.authors.length > 0 && (
                        <div className="mb-4 text-sm text-gray-500">
                          By: {course.authors.map(author => author.name).join(', ')}
                        </div>
                      )}
                      
                      <Button className="w-full" asChild>
                        <Link href={`/courses/${course.id}`}>
                          {course.enrollment ? 'Continue Learning' : 'Start Learning'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {/* Coming Soon Placeholder */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 opacity-70">
                  <div className="h-48 bg-gray-400 flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded-full text-gray-700 font-bold">Coming Soon</div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Advanced</span>
                      <span className="text-sm text-gray-500">14 weeks</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">System Design</h3>
                    <p className="text-gray-600 mb-4">
                      Learn how to design scalable systems. Develop skills essential for software engineering interviews and real-world applications.
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">4 Topics</span>
                        <span className="text-sm font-medium text-gray-700">10 Lessons</span>
                      </div>
                      <ProgressBar value={0} max={100} size="sm" />
                    </div>
                    <Button className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Not sure where to start?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Take our diagnostic assessment to determine your current level and get personalized course recommendations.
        </p>
        <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
          Take Diagnostic Assessment
        </Button>
      </div>
    </div>
  );
}

// Helper function to get color based on difficulty level
function getCourseColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'blue';
    case 'intermediate':
      return 'green';
    case 'advanced':
      return 'purple';
    default:
      return 'blue';
  }
}
