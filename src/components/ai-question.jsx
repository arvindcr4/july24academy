"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useDynamicQuestion } from '@/lib/claude-ai';

export default function AIQuestion({ 
  courseTitle, 
  topicTitle, 
  difficulty = 'beginner',
  previousContent = '',
  onAnswerSubmit,
  onNext,
  showNext = false
}) {
  const { question, loading, error } = useDynamicQuestion({
    courseTitle,
    topicTitle,
    difficulty,
    previousContent
  });
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  }, [question]);
  
  const handleOptionSelect = (optionIndex) => {
    if (isCorrect !== null) return; // Prevent changing answer after submission
    
    setSelectedOption(optionIndex);
  };
  
  const handleSubmit = () => {
    if (selectedOption === null || isCorrect !== null) return;
    
    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (onAnswerSubmit) {
      onAnswerSubmit(correct);
    }
  };
  
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };
  
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-gray-500">Generating AI question...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border border-red-300">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error generating question</h3>
        <p className="text-gray-700">{error}</p>
        <Button 
          className="mt-4" 
          variant="outline"
          onClick={handleNext}
        >
          Skip to Next Section
        </Button>
      </div>
    );
  }
  
  if (!question) {
    return null;
  }
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div 
            key={index}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedOption === index 
                ? isCorrect === null
                  ? 'border-blue-500 bg-blue-50'
                  : isCorrect && index === question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : !isCorrect && index === question.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : !isCorrect && index === selectedOption
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                : 'border-gray-300 hover:border-blue-300'
            }`}
            onClick={() => handleOptionSelect(index)}
          >
            {option}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex flex-col space-y-4">
        {isCorrect === null ? (
          <Button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Submit Answer
          </Button>
        ) : (
          <div className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            {showExplanation && (
              <div className="mt-2 text-gray-700">
                <p className="font-medium">Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            )}
            {(showNext || isCorrect !== null) && (
              <Button 
                className="mt-4" 
                onClick={handleNext}
                variant={isCorrect ? "default" : "outline"}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
