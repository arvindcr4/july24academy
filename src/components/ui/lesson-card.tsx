import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { ProgressBar } from './progress-bar';
import { Badge } from './badge';

interface LessonCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  progress?: number;
  status?: 'not-started' | 'in-progress' | 'completed';
  xpValue?: number;
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  keyPoints?: string[];
  prerequisites?: { id: string; title: string }[];
  lessonId: string;
  lastActive?: string;
  estimatedCompletion?: string;
}

export function LessonCard({
  title,
  subtitle,
  description,
  progress = 0,
  status = 'not-started',
  xpValue = 10,
  estimatedTime,
  difficulty = 'beginner',
  keyPoints,
  prerequisites,
  lessonId,
  lastActive,
  estimatedCompletion,
}: LessonCardProps) {
  // Status colors
  const statusColors = {
    'not-started': 'gray',
    'in-progress': 'blue',
    'completed': 'green',
  };
  
  // Difficulty colors
  const difficultyColors = {
    'beginner': 'green',
    'intermediate': 'blue',
    'advanced': 'purple',
  };
  
  // Status text
  const statusText = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Left side - Icon and basic info */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className={`w-16 h-16 bg-${difficultyColors[difficulty]}-600 rounded-lg flex items-center justify-center text-white`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            
            {/* XP Value */}
            <div className="mt-2 text-center">
              <Badge variant="outline" className={`bg-${statusColors[status]}-50 text-${statusColors[status]}-800 border-${statusColors[status]}-200`}>
                {xpValue} XP
              </Badge>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="text-gray-600">{subtitle}</p>}
              </div>
              
              <div className="mt-2 md:mt-0 md:ml-4 flex flex-wrap gap-2">
                <Badge variant="outline" className={`bg-${statusColors[status]}-100 text-${statusColors[status]}-800`}>
                  {statusText[status]}
                </Badge>
                
                <Badge variant="outline" className={`bg-${difficultyColors[difficulty]}-100 text-${difficultyColors[difficulty]}-800`}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Badge>
                
                {estimatedTime && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {estimatedTime}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Description */}
            {description && (
              <p className="text-sm text-gray-600 mb-4">{description}</p>
            )}
            
            {/* Key Points */}
            {keyPoints && keyPoints.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Points:</h4>
                <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                  {keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Prerequisites */}
            {prerequisites && prerequisites.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h4>
                <div className="flex flex-wrap gap-2">
                  {prerequisites.map((prereq) => (
                    <Link 
                      key={prereq.id} 
                      href={`/learn/lessons/${prereq.id}`}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                    >
                      {prereq.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Progress Bar */}
            {status !== 'not-started' && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-700">{progress}%</span>
                </div>
                <ProgressBar 
                  value={progress} 
                  max={100} 
                  color={statusColors[status]} 
                />
              </div>
            )}
            
            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                {lastActive && <p>Last active: {lastActive}</p>}
                {estimatedCompletion && <p>Est. completion: {estimatedCompletion}</p>}
              </div>
              
              <Button asChild>
                <Link href={`/learn/lessons/${lessonId}`}>
                  {status === 'completed' ? 'Review Lesson' : status === 'in-progress' ? 'Continue' : 'Start Learning'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
