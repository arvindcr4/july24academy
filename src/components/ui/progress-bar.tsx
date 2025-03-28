import { cn } from '@/lib/utils';
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export function ProgressBar({
  value,
  max,
  className,
  showPercentage = false,
  size = 'md',
  color = 'blue'
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };
  
  const colorStyles = {
    blue: 'bg-blue-600',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeStyles[size])}>
        <div
          className={cn('rounded-full transition-all duration-300 ease-in-out', colorStyles[color], sizeStyles[size])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
