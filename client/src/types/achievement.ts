export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: 'quiz_score' | 'games_played' | 'operation_mastery';
  threshold: number;
  operation?: string;
  grade?: number;
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  earnedAt: string;
  progress: number;
  achievement: Achievement;
}

export interface AchievementProgress {
  achievement: Achievement;
  progress: number;
  isEarned: boolean;
}
