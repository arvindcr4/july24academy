"use client";

import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export default function Courses() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch courses
        const coursesResponse = await fetch('/api/courses');
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter courses by category
  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(course => course.category_id === parseInt(activeTab));

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our comprehensive curriculum designed to build a strong foundation and develop advanced skills through adaptive learning.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap justify-center">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id.toString()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
