"use client";

import Link from 'next/link';
import React from 'react';

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <header className={cn('w-full bg-white border-b border-gray-200 sticky top-0 z-50', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">July24Academy</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/courses" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Courses
              </Link>
              <Link 
                href="/pedagogy" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pedagogy
              </Link>
              <Link 
                href="/faq" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                FAQ
              </Link>
              <Link 
                href="/about" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link 
              href="/login" 
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors"
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
    <header className={cn('w-full bg-white border-b border-gray-200 sticky top-0 z-50', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/learn" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">July24Academy</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/learn" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/courses" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Courses
              </Link>
              <Link 
                href="/progress" 
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                My Progress
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-secondary px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">1,250 XP</span>
            </div>
            <div className="ml-4 relative">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                JS
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
