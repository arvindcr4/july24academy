import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lessonId = parseInt(params.id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID' },
        { status: 400 }
      );
    }
    
    // Get practice problems for this lesson
    const practiceProblems = await db.getPracticeProblemsByLessonId(lessonId);
    
    if (!practiceProblems || practiceProblems.length === 0) {
      return NextResponse.json(
        { error: 'No practice problems found for this lesson' },
        { status: 404 }
      );
    }
    
    // Get user progress if authenticated
    const token = cookies().get('auth_token')?.value;
    let userProgress = null;
    
    if (token) {
      // Extract user ID from token (simplified)
      const tokenParts = token.split('_');
      if (tokenParts.length >= 2) {
        const userId = parseInt(tokenParts[1]);
        userProgress = await db.getUserPracticeProgress(userId, lessonId);
      }
    }
    
    return NextResponse.json({
      practiceProblems,
      userProgress
    });
  } catch (error) {
    console.error('Practice problems error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve practice problems' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lessonId = parseInt(params.id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID' },
        { status: 400 }
      );
    }
    
    // Get auth token from cookies
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Extract user ID from token (simplified)
    const tokenParts = token.split('_');
    if (tokenParts.length < 2 || !tokenParts[1]) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = parseInt(tokenParts[1]);
    
    // Get submission data
    const { problemId, answer } = await request.json();
    
    if (!problemId || answer === undefined) {
      return NextResponse.json(
        { error: 'Problem ID and answer are required' },
        { status: 400 }
      );
    }
    
    // Get problem details
    const problem = await db.getPracticeProblemById(problemId);
    
    if (!problem) {
      return NextResponse.json(
        { error: 'Practice problem not found' },
        { status: 404 }
      );
    }
    
    // Check if answer is correct
    const isCorrect = checkAnswer(problem, answer);
    
    // Record attempt
    await db.recordPracticeAttempt(userId, problemId, answer, isCorrect);
    
    // Award XP if correct
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = problem.xp_value || 5; // Default XP value if not specified
      await db.addXpToUser(userId, xpEarned, `Solved practice problem: ${problem.id}`);
    }
    
    // Get updated user stats
    const xpHistory = await db.getUserXPHistory(userId);
    const totalXP = xpHistory.reduce((sum, entry) => sum + entry.amount, 0);
    
    return NextResponse.json({
      success: true,
      isCorrect,
      xpEarned,
      correctAnswer: isCorrect ? null : problem.correct_answer, // Only send correct answer if wrong
      explanation: problem.explanation,
      totalXP
    });
  } catch (error) {
    console.error('Practice submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process practice submission' },
      { status: 500 }
    );
  }
}

// Helper function to check if answer is correct
function checkAnswer(problem: any, userAnswer: any): boolean {
  // Handle different problem types
  switch (problem.type) {
    case 'multiple_choice':
      return userAnswer === problem.correct_answer;
      
    case 'numeric':
      // Allow for small differences in floating point answers
      const numericAnswer = parseFloat(userAnswer);
      const correctAnswer = parseFloat(problem.correct_answer);
      const tolerance = problem.tolerance || 0.001;
      return Math.abs(numericAnswer - correctAnswer) <= tolerance;
      
    case 'text':
      // Case insensitive text comparison
      return userAnswer.toLowerCase().trim() === problem.correct_answer.toLowerCase().trim();
      
    case 'expression':
      // For math expressions, we would need a more sophisticated comparison
      // This is simplified for demo purposes
      return userAnswer.replace(/\s+/g, '') === problem.correct_answer.replace(/\s+/g, '');
      
    default:
      return userAnswer === problem.correct_answer;
  }
}
