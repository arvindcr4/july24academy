// Progress tracking implementation for "Cracking the Coding Interview" course
// This file contains functionality for tracking user progress, XP, streaks, and achievements

const fs = require('fs');
const path = require('path');

// Base directory for course content and user data
const COURSE_DIR = path.join(__dirname, 'course_content');
const USER_DATA_DIR = path.join(__dirname, 'user_data');

// Ensure user data directory exists
if (!fs.existsSync(USER_DATA_DIR)) {
  fs.mkdirSync(USER_DATA_DIR, { recursive: true });
}

// User progress tracking class
class UserProgressTracker {
  constructor(userId) {
    this.userId = userId;
    this.userDataPath = path.join(USER_DATA_DIR, `user_${userId}`);
    this.progressPath = path.join(this.userDataPath, 'progress.json');
    this.xpPath = path.join(this.userDataPath, 'xp.json');
    this.achievementsPath = path.join(this.userDataPath, 'achievements.json');
    this.streakPath = path.join(this.userDataPath, 'streak.json');
    
    // Create user directory if it doesn't exist
    if (!fs.existsSync(this.userDataPath)) {
      fs.mkdirSync(this.userDataPath, { recursive: true });
    }
    
    // Initialize user data if it doesn't exist
    this.initializeUserData();
  }
  
  // Initialize user data files if they don't exist
  initializeUserData() {
    // Initialize progress data
    if (!fs.existsSync(this.progressPath)) {
      const initialProgress = {
        completedLessons: [],
        completedProblems: [],
        completedAssessments: [],
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.progressPath, JSON.stringify(initialProgress, null, 2));
    }
    
    // Initialize XP data
    if (!fs.existsSync(this.xpPath)) {
      const initialXP = {
        totalXP: 0,
        level: 1,
        xpHistory: [],
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.xpPath, JSON.stringify(initialXP, null, 2));
    }
    
    // Initialize achievements data
    if (!fs.existsSync(this.achievementsPath)) {
      const initialAchievements = {
        earned: [],
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.achievementsPath, JSON.stringify(initialAchievements, null, 2));
    }
    
    // Initialize streak data
    if (!fs.existsSync(this.streakPath)) {
      const initialStreak = {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(this.streakPath, JSON.stringify(initialStreak, null, 2));
    }
  }
  
  // Load user progress data
  loadProgress() {
    try {
      const data = fs.readFileSync(this.progressPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading progress data:', error);
      return null;
    }
  }
  
  // Save user progress data
  saveProgress(progressData) {
    try {
      progressData.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.progressPath, JSON.stringify(progressData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving progress data:', error);
      return false;
    }
  }
  
  // Load user XP data
  loadXP() {
    try {
      const data = fs.readFileSync(this.xpPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading XP data:', error);
      return null;
    }
  }
  
  // Save user XP data
  saveXP(xpData) {
    try {
      xpData.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.xpPath, JSON.stringify(xpData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving XP data:', error);
      return false;
    }
  }
  
  // Load user achievements data
  loadAchievements() {
    try {
      const data = fs.readFileSync(this.achievementsPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading achievements data:', error);
      return null;
    }
  }
  
  // Save user achievements data
  saveAchievements(achievementsData) {
    try {
      achievementsData.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.achievementsPath, JSON.stringify(achievementsData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving achievements data:', error);
      return false;
    }
  }
  
  // Load user streak data
  loadStreak() {
    try {
      const data = fs.readFileSync(this.streakPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading streak data:', error);
      return null;
    }
  }
  
  // Save user streak data
  saveStreak(streakData) {
    try {
      streakData.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.streakPath, JSON.stringify(streakData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving streak data:', error);
      return false;
    }
  }
  
  // Mark a lesson as completed
  completeLesson(lessonId, timeSpentSeconds) {
    const progress = this.loadProgress();
    const xpData = this.loadXP();
    
    if (!progress || !xpData) {
      return false;
    }
    
    // Check if lesson is already completed
    const existingCompletion = progress.completedLessons.find(l => l.lessonId === lessonId);
    if (existingCompletion) {
      return true; // Already completed
    }
    
    // Get lesson data to determine XP reward
    const lessonData = this.getLessonData(lessonId);
    if (!lessonData) {
      return false;
    }
    
    const xpReward = lessonData.xp_reward || 10; // Default to 10 XP if not specified
    
    // Add lesson to completed lessons
    progress.completedLessons.push({
      lessonId,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      xpEarned: xpReward
    });
    
    // Update XP
    xpData.totalXP += xpReward;
    xpData.xpHistory.push({
      amount: xpReward,
      source: 'lesson',
      sourceId: lessonId,
      earnedAt: new Date().toISOString(),
      description: `Completed lesson: ${lessonData.title}`
    });
    
    // Update level based on XP
    xpData.level = this.calculateLevel(xpData.totalXP);
    
    // Update streak
    this.updateStreak();
    
    // Check for achievements
    this.checkAchievements();
    
    // Save updated data
    this.saveProgress(progress);
    this.saveXP(xpData);
    
    return true;
  }
  
  // Mark a problem as completed
  completeProblem(problemId, isCorrect, timeSpentSeconds, codeSubmitted) {
    const progress = this.loadProgress();
    const xpData = this.loadXP();
    
    if (!progress || !xpData) {
      return false;
    }
    
    // Get problem data to determine XP reward
    const problemData = this.getProblemData(problemId);
    if (!problemData) {
      return false;
    }
    
    // Calculate XP reward based on difficulty and correctness
    let xpReward = 0;
    if (isCorrect) {
      switch (problemData.difficulty) {
        case 'easy':
          xpReward = problemData.xp_reward || 10;
          break;
        case 'medium':
          xpReward = problemData.xp_reward || 15;
          break;
        case 'hard':
          xpReward = problemData.xp_reward || 25;
          break;
        default:
          xpReward = 10;
      }
      
      // Bonus XP for fast solutions (under expected time)
      if (timeSpentSeconds < problemData.estimated_minutes * 60 * 0.75) {
        xpReward = Math.floor(xpReward * 1.25); // 25% bonus for fast solutions
      }
    } else {
      // Small XP reward for attempting, even if incorrect
      xpReward = Math.floor((problemData.xp_reward || 10) * 0.2);
    }
    
    // Add problem attempt to completed problems
    progress.completedProblems.push({
      problemId,
      isCorrect,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      xpEarned: xpReward,
      codeSubmitted
    });
    
    // Update XP
    xpData.totalXP += xpReward;
    xpData.xpHistory.push({
      amount: xpReward,
      source: 'problem',
      sourceId: problemId,
      earnedAt: new Date().toISOString(),
      description: `${isCorrect ? 'Solved' : 'Attempted'} problem: ${problemData.title}`
    });
    
    // Update level based on XP
    xpData.level = this.calculateLevel(xpData.totalXP);
    
    // Update streak
    this.updateStreak();
    
    // Check for achievements
    this.checkAchievements();
    
    // Save updated data
    this.saveProgress(progress);
    this.saveXP(xpData);
    
    return true;
  }
  
  // Mark an assessment as completed
  completeAssessment(assessmentId, score, timeSpentSeconds, responses) {
    const progress = this.loadProgress();
    const xpData = this.loadXP();
    
    if (!progress || !xpData) {
      return false;
    }
    
    // Get assessment data
    const assessmentData = this.getAssessmentData(assessmentId);
    if (!assessmentData) {
      return false;
    }
    
    // Calculate if passed based on passing score
    const passingScore = assessmentData.passing_score || 70;
    const passed = score >= passingScore;
    
    // Calculate XP reward based on score and passing
    let xpReward = 0;
    if (passed) {
      xpReward = assessmentData.xp_reward || 50;
      
      // Bonus XP for high scores
      if (score >= 90) {
        xpReward = Math.floor(xpReward * 1.2); // 20% bonus for excellent scores
      }
    } else {
      // Small XP reward for attempting, even if failed
      xpReward = Math.floor((assessmentData.xp_reward || 50) * 0.3);
    }
    
    // Add assessment to completed assessments
    progress.completedAssessments.push({
      assessmentId,
      score,
      passed,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      xpEarned: xpReward,
      responses
    });
    
    // Update XP
    xpData.totalXP += xpReward;
    xpData.xpHistory.push({
      amount: xpReward,
      source: 'assessment',
      sourceId: assessmentId,
      earnedAt: new Date().toISOString(),
      description: `Completed assessment: ${assessmentData.title} with score ${score}%`
    });
    
    // Update level based on XP
    xpData.level = this.calculateLevel(xpData.totalXP);
    
    // Update streak
    this.updateStreak();
    
    // Check for achievements
    this.checkAchievements();
    
    // Save updated data
    this.saveProgress(progress);
    this.saveXP(xpData);
    
    return true;
  }
  
  // Update user streak
  updateStreak() {
    const streakData = this.loadStreak();
    if (!streakData) {
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const todayStr = today.toISOString().split('T')[0];
    
    // If this is the first activity, initialize streak
    if (!streakData.lastActivityDate) {
      streakData.lastActivityDate = todayStr;
      streakData.currentStreak = 1;
      streakData.longestStreak = 1;
      this.saveStreak(streakData);
      return true;
    }
    
    // Parse last activity date
    const lastActivity = new Date(streakData.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0); // Normalize to start of day
    
    // Calculate days difference
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    // If already logged in today, no streak update needed
    if (daysDiff === 0) {
      return true;
    }
    
    // If logged in yesterday, increment streak
    if (daysDiff === 1) {
      streakData.currentStreak += 1;
      
      // Update longest streak if current streak is longer
      if (streakData.currentStreak > streakData.longestStreak) {
        streakData.longestStreak = streakData.currentStreak;
      }
    } else {
      // Streak broken
      streakData.currentStreak = 1;
    }
    
    // Update last activity date
    streakData.lastActivityDate = todayStr;
    
    // Award streak XP if applicable
    if (daysDiff === 1) {
      const streakXP = Math.min(streakData.currentStreak * 5, 25); // Cap at 25 XP
      const xpData = this.loadXP();
      if (xpData) {
        xpData.totalXP += streakXP;
        xpData.xpHistory.push({
          amount: streakXP,
          source: 'streak',
          sourceId: null,
          earnedAt: new Date().toISOString(),
          description: `${streakData.currentStreak}-day streak bonus`
        });
        
        // Update level based on XP
        xpData.level = this.calculateLevel(xpData.totalXP);
        
        this.saveXP(xpData);
      }
    }
    
    this.saveStreak(streakData);
    return true;
  }
  
  // Check for achievements
  checkAchievements() {
    const progress = this.loadProgress();
    const xpData = this.loadXP();
    const streakData = this.loadStreak();
    const achievementsData = this.loadAchievements();
    
    if (!progress || !xpData || !streakData || !achievementsData) {
      return false;
    }
    
    // Get all available achievements
    const allAchievements = this.getAllAchievements();
    
    // Check each achievement
    allAchievements.forEach(achievement => {
      // Skip if already earned
      if (achievementsData.earned.some(a => a.achievementId === achievement.id)) {
        return;
      }
      
      let earned = false;
      
      // Check achievement criteria
      switch (achievement.achievement_type) {
        case 'streak':
          if (achievement.criteria.startsWith('streak_days:')) {
            const requiredDays = parseInt(achievement.criteria.split(':')[1]);
            earned = streakData.currentStreak >= requiredDays;
          }
          break;
          
        case 'mastery':
          if (achievement.criteria.startsWith('complete_topic:')) {
            const topicId = parseInt(achievement.criteria.split(':')[1]);
            const topicLessons = this.getTopicLessons(topicId);
            const topicProblems = this.getTopicProblems(topicId);
            
            // Check if all lessons in the topic are completed
            const allLessonsCompleted = topicLessons.every(lesson => 
              progress.completedLessons.some(l => l.lessonId === lesson.id)
            );
            
            // Check if all problems in the topic are completed correctly
            const allProblemsCompleted = topicProblems.every(problem => 
              progress.completedProblems.some(p => p.problemId === problem.id && p.isCorrect)
            );
            
            earned = allLessonsCompleted && allProblemsCompleted;
          }
          break;
          
        case 'challenge':
          if (achievement.criteria.startsWith('solve_hard_problems:')) {
            const requiredCount = parseInt(achievement.criteria.split(':')[1]);
            const hardProblemsCompleted = progress.completedProblems.filter(p => {
              const problem = this.getProblemData(p.problemId);
              return p.isCorrect && problem && problem.difficulty === 'hard';
            }).length;
            
            earned = hardProblemsCompleted >= requiredCount;
          } else if (achievement.criteria.startsWith('fast_solution:')) {
            // Check for problems solved in less than 50% of estimated time
            const fastSolutions = progress.completedProblems.filter(p => {
              const problem = this.getProblemData(p.problemId);
              return p.isCorrect && problem && 
                     p.timeSpentSeconds < problem.estimated_minutes * 60 * 0.5;
            }).length;
            
            const requiredCount = parseInt(achievement.criteria.split(':')[1]);
            earned = fastSolutions >= requiredCount;
          }
          break;
          
        case 'level':
          if (achievement.criteria.startsWith('reach_level:')) {
            const requiredLevel = parseInt(achievement.criteria.split(':')[1]);
            earned = xpData.level >= requiredLevel;
          }
          break;
      }
      
      // If achievement earned, add it and award XP
      if (earned) {
        achievementsData.earned.push({
          achievementId: achievement.id,
          earnedAt: new Date().toISOString()
        });
        
        // Award XP for achievement
        const achievementXP = achievement.xp_reward || 50;
        xpData.totalXP += achievementXP;
        xpData.xpHistory.push({
          amount: achievementXP,
          source: 'achievement',
          sourceId: achievement.id,
          earnedAt: new Date().toISOString(),
          description: `Earned achievement: ${achievement.title}`
        });
        
        // Update level based on XP
        xpData.level = this.calculateLevel(xpData.totalXP);
      }
    });
    
    // Save updated data
    this.saveAchievements(achievementsData);
    this.saveXP(xpData);
    
    return true;
  }
  
  // Calculate level based on total XP
  calculateLevel(totalXP) {
    if (totalXP < 100) return 1;
    if (totalXP < 250) return 2;
    if (totalXP < 500) return 3;
    if (totalXP < 1000) return 4;
    return 5;
  }
  
  // Get user progress summary
  getProgressSummary() {
    const progress = this.loadProgress();
    const xpData = this.loadXP();
    const streakData = this.loadStreak();
    const achievementsData = this.loadAchievements();
    
    if (!progress || !xpData || !streakData || !achievementsData) {
      return null;
    }
    
    // Calculate completion percentages
    const allLessons = this.getAllLessons();
    const allProblems = this.getAllProblems();
    const allAssessments = this.getAllAssessments();
    
    const lessonsCompleted = progress.completedLessons.length;
    const problemsCompleted = progress.completedProblems.filter(p => p.isCorrect).length;
    const assessmentsCompleted = progress.completedAssessments.filter(a => a.passed).length;
    
    const lessonCompletionPercentage = allLessons.length > 0 
      ? Math.round((lessonsCompleted / allLessons.length) * 100) 
      : 0;
      
    const problemCompletionPercentage = allProblems.length > 0 
      ? Math.round((problemsCompleted / allProblems.length) * 100) 
      : 0;
      
    const assessmentCompletionPercentage = allAssessments.length > 0 
      ? Math.round((assessmentsCompleted / allAssessments.length) * 100) 
      : 0;
      
    const overallCompletionPercentage = Math.round(
      (lessonCompletionPercentage + problemCompletionPercentage + assessmentCompletionPercentage) / 3
    );
    
    // Calculate time spent
    const totalTimeSpentSeconds = 
      progress.completedLessons.reduce((sum, l) => sum + (l.timeSpentSeconds || 0), 0) +
      progress.completedProblems.reduce((sum, p) => sum + (p.timeSpentSeconds || 0), 0) +
      progress.completedAssessments.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);
    
    // Format time spent
    const totalHours = Math.floor(totalTimeSpentSeconds / 3600);
    const totalMinutes = Math.floor((totalTimeSpentSeconds % 3600) / 60);
    
    // Calculate estimated completion date
    let estimatedCompletionDate = null;
    if (overallCompletionPercentage > 0 && overallCompletionPercentage < 100) {
      const firstActivityDate = new Date(Math.min(
        ...progress.completedLessons.map(l => new Date(l.completedAt).getTime()),
        ...progress.completedProblems.map(p => new Date(p.completedAt).getTime()),
        ...progress.completedAssessments.map(a => new Date(a.completedAt).getTime())
      ));
      
      const now = new Date();
      const daysSinceStart = Math.max(1, Math.floor((now - firstActivityDate) / (1000 * 60 * 60 * 24)));
      const progressPerDay = overallCompletionPercentage / daysSinceStart;
      const daysRemaining = Math.ceil((100 - overallCompletionPercentage) / progressPerDay);
      
      estimatedCompletionDate = new Date();
      estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + daysRemaining);
    }
    
    return {
      userId: this.userId,
      progress: {
        lessonsCompleted,
        problemsCompleted,
        assessmentsCompleted,
        lessonCompletionPercentage,
        problemCompletionPercentage,
        assessmentCompletionPercentage,
        overallCompletionPercentage
      },
      xp: {
        totalXP: xpData.totalXP,
        level: xpData.level,
        xpToNextLevel: this.getXPToNextLevel(xpData.totalXP, xpData.level)
      },
      streak: {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastActivityDate: streakData.lastActivityDate
      },
      achievements: {
        earned: achievementsData.earned.length,
        total: this.getAllAchievements().length
      },
      timeSpent: {
        totalSeconds: totalTimeSpentSeconds,
        formattedTime: `${totalHours}h ${totalMinutes}m`
      },
      estimatedCompletionDate: estimatedCompletionDate ? estimatedCompletionDate.toISOString().split('T')[0] : null
    };
  }
  
  // Get XP needed for next level
  getXPToNextLevel(totalXP, currentLevel) {
    switch (currentLevel) {
      case 1: return 100 - totalXP;
      case 2: return 250 - totalXP;
      case 3: return 500 - totalXP;
      case 4: return 1000 - totalXP;
      default: return 0; // Max level
    }
  }
  
  // Get topic progress
  getTopicProgress(topicId) {
    const progress = this.loadProgress();
    if (!progress) {
      return null;
    }
    
    const topicLessons = this.getTopicLessons(topicId);
    const topicProblems = this.getTopicProblems(topicId);
    
    const completedLessons = topicLessons.filter(lesson => 
      progress.completedLessons.some(l => l.lessonId === lesson.id)
    );
    
    const completedProblems = topicProblems.filter(problem => 
      progress.completedProblems.some(p => p.problemId === problem.id && p.isCorrect)
    );
    
    const lessonCompletionPercentage = topicLessons.length > 0 
      ? Math.round((completedLessons.length / topicLessons.length) * 100) 
      : 0;
      
    const problemCompletionPercentage = topicProblems.length > 0 
      ? Math.round((completedProblems.length / topicProblems.length) * 100) 
      : 0;
      
    const overallCompletionPercentage = Math.round(
      (lessonCompletionPercentage + problemCompletionPercentage) / 2
    );
    
    return {
      topicId,
      completedLessons: completedLessons.length,
      totalLessons: topicLessons.length,
      completedProblems: completedProblems.length,
      totalProblems: topicProblems.length,
      lessonCompletionPercentage,
      problemCompletionPercentage,
      overallCompletionPercentage
    };
  }
  
  // Get track progress
  getTrackProgress(trackId) {
    const progress = this.loadProgress();
    if (!progress) {
      return null;
    }
    
    const trackTopics = this.getTrackTopics(trackId);
    const topicProgressList = trackTopics.map(topic => this.getTopicProgress(topic.id));
    
    const overallCompletionPercentage = topicProgressList.length > 0
      ? Math.round(
          topicProgressList.reduce((sum, tp) => sum + tp.overallCompletionPercentage, 0) / 
          topicProgressList.length
        )
      : 0;
    
    return {
      trackId,
      topics: topicProgressList,
      overallCompletionPercentage
    };
  }
  
  // Helper methods to get course data
  getLessonData(lessonId) {
    // In a real implementation, this would fetch from a database
    // For this example, we'll load from JSON files
    try {
      const allLessonsPath = path.join(COURSE_DIR, 'lessons', 'arrays_and_strings_lessons.json');
      const lessonsData = JSON.parse(fs.readFileSync(allLessonsPath, 'utf8'));
      return lessonsData.find(lesson => lesson.id === lessonId);
    } catch (error) {
      console.error('Error loading lesson data:', error);
      return null;
    }
  }
  
  getProblemData(problemId) {
    try {
      const allProblemsPath = path.join(COURSE_DIR, 'problems', 'all_problems.json');
      const problemsData = JSON.parse(fs.readFileSync(allProblemsPath, 'utf8'));
      return problemsData.find(problem => problem.id === problemId);
    } catch (error) {
      console.error('Error loading problem data:', error);
      return null;
    }
  }
  
  getAssessmentData(assessmentId) {
    // Mock assessment data for this example
    const assessments = [
      {
        id: 1,
        title: "Arrays and Strings Assessment",
        topic_id: 1,
        passing_score: 70,
        xp_reward: 50
      },
      {
        id: 2,
        title: "Linked Lists Assessment",
        topic_id: 2,
        passing_score: 70,
        xp_reward: 50
      }
    ];
    
    return assessments.find(assessment => assessment.id === assessmentId);
  }
  
  getAllLessons() {
    try {
      const allLessonsPath = path.join(COURSE_DIR, 'lessons', 'arrays_and_strings_lessons.json');
      return JSON.parse(fs.readFileSync(allLessonsPath, 'utf8'));
    } catch (error) {
      console.error('Error loading all lessons:', error);
      return [];
    }
  }
  
  getAllProblems() {
    try {
      const allProblemsPath = path.join(COURSE_DIR, 'problems', 'all_problems.json');
      return JSON.parse(fs.readFileSync(allProblemsPath, 'utf8'));
    } catch (error) {
      console.error('Error loading all problems:', error);
      return [];
    }
  }
  
  getAllAssessments() {
    // Mock assessment data for this example
    return [
      {
        id: 1,
        title: "Arrays and Strings Assessment",
        topic_id: 1,
        passing_score: 70,
        xp_reward: 50
      },
      {
        id: 2,
        title: "Linked Lists Assessment",
        topic_id: 2,
        passing_score: 70,
        xp_reward: 50
      }
    ];
  }
  
  getAllAchievements() {
    // Mock achievement data for this example
    return [
      {
        id: 1,
        title: "Consistent Coder",
        description: "Maintain a 7-day learning streak",
        xp_reward: 50,
        achievement_type: "streak",
        criteria: "streak_days:7"
      },
      {
        id: 2,
        title: "Dedicated Developer",
        description: "Maintain a 30-day learning streak",
        xp_reward: 100,
        achievement_type: "streak",
        criteria: "streak_days:30"
      },
      {
        id: 3,
        title: "Array Master",
        description: "Complete all lessons and solve all problems in the Arrays and Strings topic",
        xp_reward: 100,
        achievement_type: "mastery",
        criteria: "complete_topic:1"
      },
      {
        id: 4,
        title: "Linked List Guru",
        description: "Complete all lessons and solve all problems in the Linked Lists topic",
        xp_reward: 100,
        achievement_type: "mastery",
        criteria: "complete_topic:2"
      },
      {
        id: 5,
        title: "Speed Solver",
        description: "Solve 5 problems in less than half the estimated time",
        xp_reward: 75,
        achievement_type: "challenge",
        criteria: "fast_solution:5"
      },
      {
        id: 6,
        title: "Hard Problem Hero",
        description: "Solve 3 hard difficulty problems",
        xp_reward: 100,
        achievement_type: "challenge",
        criteria: "solve_hard_problems:3"
      },
      {
        id: 7,
        title: "Coding Apprentice",
        description: "Reach level 2",
        xp_reward: 50,
        achievement_type: "level",
        criteria: "reach_level:2"
      },
      {
        id: 8,
        title: "Coding Expert",
        description: "Reach level 4",
        xp_reward: 100,
        achievement_type: "level",
        criteria: "reach_level:4"
      }
    ];
  }
  
  getTopicLessons(topicId) {
    const allLessons = this.getAllLessons();
    return allLessons.filter(lesson => lesson.topic_id === topicId);
  }
  
  getTopicProblems(topicId) {
    const allProblems = this.getAllProblems();
    return allProblems.filter(problem => problem.topic_id === topicId);
  }
  
  getTrackTopics(trackId) {
    try {
      const topicsPath = path.join(COURSE_DIR, 'topics', 'data_structures_topics.json');
      const topicsData = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
      return topicsData.filter(topic => topic.track_id === trackId);
    } catch (error) {
      console.error('Error loading track topics:', error);
      return [];
    }
  }
}

// Example usage of the UserProgressTracker
function demonstrateProgressTracking() {
  console.log('Demonstrating progress tracking functionality...');
  
  // Create a tracker for user 1
  const tracker = new UserProgressTracker(1);
  
  // Complete a lesson
  console.log('Completing lesson 1...');
  tracker.completeLesson(1, 1200); // 20 minutes
  
  // Complete a problem
  console.log('Completing problem 1...');
  tracker.completeProblem(1, true, 900, 'public int[] twoSum(int[] nums, int target) { /* solution code */ }');
  
  // Complete an assessment
  console.log('Completing assessment 1...');
  tracker.completeAssessment(1, 85, 1800, [
    { questionId: 1, answerId: 2, isCorrect: true },
    { questionId: 2, answerId: 1, isCorrect: true },
    { questionId: 3, answerId: 3, isCorrect: false }
  ]);
  
  // Get progress summary
  const summary = tracker.getProgressSummary();
  console.log('Progress Summary:');
  console.log(JSON.stringify(summary, null, 2));
  
  // Get topic progress
  const topicProgress = tracker.getTopicProgress(1);
  console.log('Topic Progress:');
  console.log(JSON.stringify(topicProgress, null, 2));
  
  console.log('Progress tracking demonstration complete!');
}

// Export the UserProgressTracker class
module.exports = {
  UserProgressTracker,
  demonstrateProgressTracking
};

// If this file is run directly, demonstrate the functionality
if (require.main === module) {
  demonstrateProgressTracking();
}
