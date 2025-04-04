"use client";

import { AuthenticatedNavigation } from '@/components/ui/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { StatsCard, StreakCard, XPProgressCard } from '@/components/ui/stats-cards';
import { LessonCard } from '@/components/ui/lesson-card';

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
          <XPProgressCard 
            totalXP={1250}
            weeklyXP={375}
            weeklyGoal={500}
            todayXP={125}
            level={5}
            nextLevelXP={500}
          />
          
          <StatsCard
            title="Lessons Completed"
            value="12"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
            color="green"
            subtitle="Total Lessons: 29"
            trend={{ value: "41% complete", positive: true }}
          />
          
          <StreakCard
            currentStreak={7}
            bestStreak={14}
            nextMilestone={10}
          />
        </div>
        
        {/* Continue Learning Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
            <Link href="/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All Courses
            </Link>
          </div>
          
          <LessonCard
            title="Algebra Fundamentals"
            subtitle="Quadratic Equations: Lesson 2"
            progress={65}
            status="in-progress"
            xpValue={15}
            estimatedTime="20 min"
            difficulty="intermediate"
            keyPoints={[
              "Solve quadratic equations using the quadratic formula",
              "Identify the number of solutions from the discriminant",
              "Apply completing the square method"
            ]}
            prerequisites={[
              { id: "4", title: "Introduction to Quadratic Equations" },
              { id: "3", title: "Factoring Polynomials" }
            ]}
            lessonId="5"
            lastActive="Today"
            estimatedCompletion="June 15, 2025"
          />
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
            <LessonCard
              title="Probability & Statistics"
              subtitle="Introduction to Probability"
              status="not-started"
              xpValue={10}
              estimatedTime="15 min"
              difficulty="beginner"
              keyPoints={[
                "Understand basic probability concepts",
                "Calculate simple probabilities",
                "Apply the law of total probability"
              ]}
              lessonId="12"
              estimatedCompletion="July 10, 2025"
            />
            
            <LessonCard
              title="Calculus Fundamentals"
              subtitle="Limits and Continuity"
              status="not-started"
              xpValue={15}
              estimatedTime="25 min"
              difficulty="advanced"
              keyPoints={[
                "Understand the concept of limits",
                "Evaluate limits algebraically",
                "Determine continuity of functions"
              ]}
              prerequisites={[
                { id: "8", title: "Functions and Graphs" },
                { id: "9", title: "Trigonometric Functions" }
              ]}
              lessonId="15"
              estimatedCompletion="August 5, 2025"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
