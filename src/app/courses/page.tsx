import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import Link from 'next/link';

export default function Courses() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Math Courses</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our comprehensive math curriculum designed to build a strong foundation and develop advanced skills through adaptive learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Algebra Fundamentals */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="h-48 bg-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-600">Beginner</span>
              <span className="text-sm text-gray-500">12 weeks</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Algebra Fundamentals</h3>
            <p className="text-gray-600 mb-4">
              Master the basics of algebra including equations, inequalities, and functions. Build a solid foundation for more advanced math topics.
            </p>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">3 Topics</span>
                <span className="text-sm font-medium text-gray-700">9 Lessons</span>
              </div>
              <ProgressBar value={0} max={100} size="sm" />
            </div>
            <Button className="w-full" asChild>
              <Link href="/courses/1">Start Learning</Link>
            </Button>
          </div>
        </div>

        {/* Calculus I */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="h-48 bg-green-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-green-600">Intermediate</span>
              <span className="text-sm text-gray-500">16 weeks</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Calculus I</h3>
            <p className="text-gray-600 mb-4">
              Introduction to limits, derivatives, and integrals. Learn the fundamental concepts of calculus and their applications.
            </p>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">4 Topics</span>
                <span className="text-sm font-medium text-gray-700">12 Lessons</span>
              </div>
              <ProgressBar value={0} max={100} size="sm" />
            </div>
            <Button className="w-full" asChild>
              <Link href="/courses/2">Start Learning</Link>
            </Button>
          </div>
        </div>

        {/* Statistics Essentials */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="h-48 bg-purple-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-purple-600">Beginner</span>
              <span className="text-sm text-gray-500">10 weeks</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Statistics Essentials</h3>
            <p className="text-gray-600 mb-4">
              Learn probability, distributions, and hypothesis testing. Develop skills to analyze data and make informed decisions.
            </p>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">3 Topics</span>
                <span className="text-sm font-medium text-gray-700">8 Lessons</span>
              </div>
              <ProgressBar value={0} max={100} size="sm" />
            </div>
            <Button className="w-full" asChild>
              <Link href="/courses/3">Start Learning</Link>
            </Button>
          </div>
        </div>

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
            <h3 className="text-xl font-bold text-gray-900 mb-2">Linear Algebra</h3>
            <p className="text-gray-600 mb-4">
              Explore vectors, matrices, and linear transformations. Develop skills essential for advanced mathematics and computer science.
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

      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Not sure where to start?</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
          Take our diagnostic assessment to determine your current math level and get personalized course recommendations.
        </p>
        <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
          Take Diagnostic Assessment
        </Button>
      </div>
    </div>
  );
}
