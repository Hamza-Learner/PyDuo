export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: 'lessons' | 'xp' | 'streak' | 'hearts' | 'perfect' | 'speed' | 'code_darbar' | 'capstone' | 'all_modules';
  target: number;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievements {
  earned: Record<string, { earnedAt: string; xpClaimed: boolean }>;
  progress: Record<string, number>;
}

export { ACHIEVEMENT_BADGES, calculateAchievements, getAchievementProgress, getAchievementRarity, getAchievementById } from './utils/achievements';