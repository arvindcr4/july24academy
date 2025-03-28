import { AuthenticatedNavigation } from '@/components/ui/navigation';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedNavigation />
      
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
          <p className="text-gray-600">Continue your learning journey where you left off.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total XP</p>
                <p className="text-2xl font-bold text-gray-900">1,250</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Weekly Goal: 500 XP</span>
              <span className="text-blue-600 font-medium">+125 today</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lessons Completed</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Lessons: 29</span>
              <span className="text-green-600 font-medium">41% complete</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Daily Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Best Streak: 14 days</span>
              <span className="text-yellow-600 font-medium">Keep it up!</span>
            </div>
          </div>
        </div>
        
        {/* Continue Learning Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            <Link href="/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Courses
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Algebra Fundamentals</h3>
                    <p className="text-gray-600">Quadratic Equations: Lesson 2</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Course Progress</span>
                    <span className="text-sm font-medium text-gray-700">65%</span>
                  </div>
                  <ProgressBar value={65} max={100} color="blue" />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Estimated completion: June 15, 2025
                  </p>
                  <Button asChild>
                    <Link href="/learn/lessons/5">Continue Learning</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              <li className="p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">Completed "Introduction to Quadratic Equations"</p>
                      <p className="text-sm text-gray-500">Today</p>
                    </div>
                    <p className="text-sm text-gray-500">Algebra Fundamentals</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      +15 XP
                    </span>
                  </div>
                </div>
              </li>
              
              <li className="p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">Practiced "Solving Linear Equations"</p>
                      <p className="text-sm text-gray-500">Yesterday</p>
                    </div>
                    <p className="text-sm text-gray-500">Algebra Fundamentals</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      +10 XP
                    </span>
                  </div>
                </div>
              </li>
              
              <li className="p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">Started "Word Problems with Linear Equations"</p>
                      <p className="text-sm text-gray-500">2 days ago</p>
                    </div>
                    <p className="text-sm text-gray-500">Algebra Fundamentals</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      +5 XP
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Recommended Courses Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended For You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Calculus I</h3>
                    <p className="text-sm text-gray-600">Intermediate • 16 weeks</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Ready to advance? This course covers limits, derivatives, and integrals - the perfect next step after mastering algebra.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/courses/2">View Course</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Statistics Essentials</h3>
                    <p className="text-sm text-gray-600">Beginner • 10 weeks</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Learn to analyze data and make informed decisions with this introduction to probability and statistics.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/courses/3">View Course</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
