import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <header className={cn('w-full bg-white border-b border-gray-200', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">July24Academy</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Courses
              </Link>
              <Link 
                href="/pedagogy" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Pedagogy
              </Link>
              <Link 
                href="/faq" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                FAQ
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AuthenticatedNavigation({ className }: NavigationProps) {
  return (
    <header className={cn('w-full bg-white border-b border-gray-200', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/learn" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">July24Academy</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/learn" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Courses
              </Link>
              <Link 
                href="/progress" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Progress
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">1,250 XP</span>
            </div>
            <div className="ml-4 relative">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                JS
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
