"use client";

import { useState, useEffect } from 'react';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Generate a dynamic question based on course content using Claude AI
 * @param {string} courseTitle - The title of the course
 * @param {string} topicTitle - The title of the topic
 * @param {string} difficulty - The difficulty level (beginner, intermediate, advanced)
 * @param {string} previousContent - Optional previous content to build upon
 * @returns {Promise<Object>} - The generated question object
 */
export async function generateDynamicQuestion(courseTitle, topicTitle, difficulty = 'beginner', previousContent = '') {
  try {
    const apiKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.error('Claude API key is not set in environment variables');
      throw new Error('API key not configured');
    }
    
    const prompt = `
      Generate a multiple-choice question for a ${difficulty} level course on ${courseTitle}, 
      specifically about ${topicTitle}.
      
      ${previousContent ? `This question should build upon the following previous content: ${previousContent}` : ''}
      
      Format your response as a JSON object with the following structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0, // Index of the correct answer (0-based)
        "explanation": "Detailed explanation of why the correct answer is correct"
      }
      
      Make sure the question is challenging but appropriate for the ${difficulty} level.
      Include a thorough explanation that helps the student understand the concept.
    `;

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Claude response');
    }
    
    const questionData = JSON.parse(jsonMatch[0]);
    return questionData;
  } catch (error) {
    console.error('Error generating dynamic question:', error);
    return {
      question: `What is a key concept in ${topicTitle}?`,
      options: [
        'Option A',
        'Option B',
        'Option C',
        'Option D'
      ],
      correctAnswer: 0,
      explanation: 'This is a fallback question because the AI-generated question service is currently unavailable.'
    };
  }
}

/**
 * React hook for generating dynamic questions
 * @param {Object} params - Parameters for question generation
 * @returns {Object} - The generated question and loading state
 */
export function useDynamicQuestion({ courseTitle, topicTitle, difficulty, previousContent, enabled = true }) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    
    async function fetchQuestion() {
      setLoading(true);
      setError(null);
      try {
        const questionData = await generateDynamicQuestion(
          courseTitle,
          topicTitle,
          difficulty,
          previousContent
        );
        setQuestion(questionData);
      } catch (err) {
        setError(err.message);
        console.error('Error in useDynamicQuestion:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [courseTitle, topicTitle, difficulty, previousContent, enabled]);

  return { question, loading, error };
}
