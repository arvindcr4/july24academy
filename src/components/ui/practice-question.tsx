import React from 'react';
import { Badge } from './badge';
import { ProgressBar } from './progress-bar';

interface PracticeQuestionProps {
  questionNumber: number;
  questionText: string;
  options?: {
    id: string;
    label: string;
    value: string;
  }[];
  type: 'multiple_choice' | 'numeric' | 'text' | 'expression';
  difficulty: 'easy' | 'medium' | 'hard';
  xpValue: number;
  expectedTimeSeconds?: number;
  onSubmit: (answer: string) => void;
  isAnswered?: boolean;
  isCorrect?: boolean;
  explanation?: string;
  correctAnswer?: string;
  userAnswer?: string;
  timeSpent?: number;
}

export function PracticeQuestion({
  questionNumber,
  questionText,
  options = [],
  type = 'multiple_choice',
  difficulty = 'medium',
  xpValue = 5,
  expectedTimeSeconds = 60,
  onSubmit,
  isAnswered = false,
  isCorrect = false,
  explanation = '',
  correctAnswer = '',
  userAnswer = '',
  timeSpent = 0,
}: PracticeQuestionProps) {
  const [selectedOption, setSelectedOption] = React.useState<string>('');
  const [textAnswer, setTextAnswer] = React.useState<string>('');
  const [startTime, setStartTime] = React.useState<number>(Date.now());
  
  // Difficulty colors
  const difficultyColors = {
    'easy': 'green',
    'medium': 'blue',
    'hard': 'purple',
  };
  
  // Reset timer when question changes
  React.useEffect(() => {
    setStartTime(Date.now());
    setSelectedOption('');
    setTextAnswer('');
  }, [questionNumber]);
  
  const handleSubmit = () => {
    const answer = type === 'multiple_choice' ? selectedOption : textAnswer;
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    onSubmit(answer);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-6">
        {/* Question Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900 mr-3">Question {questionNumber}</span>
            <Badge variant="outline" className={`bg-${difficultyColors[difficulty]}-100 text-${difficultyColors[difficulty]}-800`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mr-2">
              {expectedTimeSeconds}s
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {xpValue} XP
            </Badge>
          </div>
        </div>
        
        {/* Question Text */}
        <div className="mb-6">
          <p className="text-lg text-gray-800">{questionText}</p>
        </div>
        
        {/* Answer Options */}
        {!isAnswered ? (
          <div className="mb-6">
            {type === 'multiple_choice' && (
              <div className="space-y-3">
                {options.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === option.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedOption(option.value)}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                        selectedOption === option.value 
                          ? 'border-blue-500 bg-blue-500 text-white' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option.value && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-800">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {(type === 'numeric' || type === 'text' || type === 'expression') && (
              <div>
                <input
                  type={type === 'numeric' ? 'number' : 'text'}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter your ${type === 'numeric' ? 'numeric' : type === 'expression' ? 'expression' : 'text'} answer...`}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                  {isCorrect ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p className="text-sm mt-1">
                    {isCorrect 
                      ? `You answered correctly in ${timeSpent} seconds.` 
                      : `Your answer: ${userAnswer}`
                    }
                  </p>
                  {!isCorrect && correctAnswer && (
                    <p className="text-sm mt-1 font-medium">Correct answer: {correctAnswer}</p>
                  )}
                </div>
              </div>
            </div>
            
            {explanation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                <p className="text-sm text-gray-800">{explanation}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Submit Button */}
        {!isAnswered && (
          <div className="flex justify-end">
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                (type === 'multiple_choice' && !selectedOption) || 
                ((type === 'numeric' || type === 'text' || type === 'expression') && !textAnswer)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={handleSubmit}
              disabled={(type === 'multiple_choice' && !selectedOption) || 
                ((type === 'numeric' || type === 'text' || type === 'expression') && !textAnswer)}
            >
              Submit
            </button>
          </div>
        )}
        
        {/* Timer Progress */}
        {!isAnswered && (
          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">Time remaining</span>
              <span className="text-xs text-gray-500">{expectedTimeSeconds}s</span>
            </div>
            <ProgressBar value={100} max={100} color="yellow" />
          </div>
        )}
      </div>
    </div>
  );
}
