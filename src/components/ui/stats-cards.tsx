import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  subtitle?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
  onClick
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      trend: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      trend: 'text-green-600',
      border: 'border-green-200'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      trend: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      trend: 'text-purple-600',
      border: 'border-purple-200'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      trend: 'text-red-600',
      border: 'border-red-200'
    }
  };

  return (
    <Card 
      className={`border ${colorClasses[color].border} hover:shadow-md transition-shadow duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 ${colorClasses[color].bg} rounded-full flex items-center justify-center mr-4`}>
            <div className={colorClasses[color].text}>
              {icon}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
          {trend && (
            <span className={trend.positive ? colorClasses[color].trend : 'text-red-600'}>
              {trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StreakCardProps {
  currentStreak: number;
  bestStreak: number;
  lastActive?: string;
  nextMilestone?: number;
  onClick?: () => void;
}

export function StreakCard({
  currentStreak,
  bestStreak,
  lastActive,
  nextMilestone,
  onClick
}: StreakCardProps) {
  // Calculate days to display (max 7)
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  
  // Create array of past 7 days with active status
  const weekDays = days.map((day, index) => {
    const isToday = index === today;
    const isPast = index < today;
    const isActive = isPast || isToday; // Assume all past days and today are active
    
    return { day, isToday, isActive };
  });

  return (
    <Card 
      className="border border-yellow-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Daily Streak</p>
            <p className="text-2xl font-bold text-gray-900">{currentStreak} days</p>
          </div>
        </div>
        
        {/* Weekly calendar view */}
        <div className="flex justify-between mb-4">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1">{day.day}</span>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  day.isToday 
                    ? 'bg-yellow-500 text-white' 
                    : day.isActive 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {day.isActive && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Best Streak: {bestStreak} days</span>
          {nextMilestone && (
            <span className="text-yellow-600 font-medium">
              {nextMilestone - currentStreak} days to {nextMilestone} day milestone!
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface XPProgressCardProps {
  totalXP: number;
  weeklyXP: number;
  weeklyGoal: number;
  todayXP: number;
  level?: number;
  nextLevelXP?: number;
  onClick?: () => void;
}

export function XPProgressCard({
  totalXP,
  weeklyXP,
  weeklyGoal,
  todayXP,
  level,
  nextLevelXP,
  onClick
}: XPProgressCardProps) {
  // Calculate weekly progress percentage
  const weeklyProgress = Math.min(100, Math.round((weeklyXP / weeklyGoal) * 100));
  
  // Calculate level progress if provided
  const levelProgress = level && nextLevelXP 
    ? Math.min(100, Math.round((totalXP % nextLevelXP) / nextLevelXP * 100))
    : null;

  return (
    <Card 
      className="border border-blue-200 hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total XP</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-900">{totalXP.toLocaleString()}</p>
              {level && (
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  Level {level}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Weekly progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Weekly Goal: {weeklyGoal} XP</span>
            <span className="text-sm text-gray-600">{weeklyXP} / {weeklyGoal} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${weeklyProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Level progress if available */}
        {levelProgress !== null && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">Next Level</span>
              <span className="text-sm text-gray-600">{levelProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Daily XP: {todayXP}</span>
          <span className="text-blue-600 font-medium">
            {weeklyGoal - weeklyXP > 0 ? `${weeklyGoal - weeklyXP} XP to go!` : 'Weekly goal reached!'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
