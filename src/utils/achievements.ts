import { AchievementBadge, UserAchievements, UserProgress, UserStats, ExerciseHistory } from '../types';

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    color: 'bg-emerald-500',
    condition: 'lessons',
    target: 1,
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'lesson_10',
    title: 'Getting Started',
    description: 'Complete 10 lessons',
    icon: '📚',
    color: 'bg-sky-500',
    condition: 'lessons',
    target: 10,
    xpReward: 200,
    rarity: 'common',
  },
  {
    id: 'lesson_25',
    title: 'Dedicated Learner',
    description: 'Complete 25 lessons',
    icon: '🎓',
    color: 'bg-indigo-500',
    condition: 'lessons',
    target: 25,
    xpReward: 500,
    rarity: 'rare',
  },
  {
    id: 'lesson_50',
    title: 'Half Century',
    description: 'Complete 50 lessons',
    icon: '🏆',
    color: 'bg-purple-500',
    condition: 'lessons',
    target: 50,
    xpReward: 1000,
    rarity: 'epic',
  },
  {
    id: 'lesson_100',
    title: 'Centurion',
    description: 'Complete 100 lessons',
    icon: '💯',
    color: 'bg-amber-500',
    condition: 'lessons',
    target: 100,
    xpReward: 2500,
    rarity: 'legendary',
  },
  {
    id: 'xp_1000',
    title: 'Thousand Club',
    description: 'Earn 1,000 XP',
    icon: '⚡',
    color: 'bg-yellow-500',
    condition: 'xp',
    target: 1000,
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'xp_5000',
    title: 'High Voltage',
    description: 'Earn 5,000 XP',
    icon: '🔥',
    color: 'bg-orange-500',
    condition: 'xp',
    target: 5000,
    xpReward: 500,
    rarity: 'rare',
  },
  {
    id: 'xp_25000',
    title: 'Power Plant',
    description: 'Earn 25,000 XP',
    icon: '⚡',
    color: 'bg-red-500',
    condition: 'xp',
    target: 25000,
    xpReward: 2000,
    rarity: 'epic',
  },
  {
    id: 'streak_3',
    title: 'Threepeat',
    description: '3-day streak',
    icon: '🔥',
    color: 'bg-orange-400',
    condition: 'streak',
    target: 3,
    xpReward: 50,
    rarity: 'common',
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: '7-day streak',
    icon: '🗓️',
    color: 'bg-orange-500',
    condition: 'streak',
    target: 7,
    xpReward: 200,
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: '30-day streak',
    icon: '📅',
    color: 'bg-rose-500',
    condition: 'streak',
    target: 30,
    xpReward: 1000,
    rarity: 'epic',
  },
  {
    id: 'streak_100',
    title: 'Century Streak',
    description: '100-day streak',
    icon: '💯',
    color: 'bg-amber-400',
    condition: 'streak',
    target: 100,
    xpReward: 5000,
    rarity: 'legendary',
  },
  {
    id: 'hearts_full',
    title: 'Heart Collector',
    description: 'Have 5 hearts at once',
    icon: '❤️',
    color: 'bg-rose-500',
    condition: 'hearts',
    target: 5,
    xpReward: 100,
    rarity: 'common',
  },
  {
    id: 'perfect_5',
    title: 'Perfectionist',
    description: 'Get 5 perfect lessons (1 attempt)',
    icon: '💎',
    color: 'bg-cyan-500',
    condition: 'perfect',
    target: 5,
    xpReward: 200,
    rarity: 'common',
  },
  {
    id: 'perfect_25',
    title: 'Flawless',
    description: 'Get 25 perfect lessons',
    icon: '💠',
    color: 'bg-blue-500',
    condition: 'perfect',
    target: 25,
    xpReward: 500,
    rarity: 'rare',
  },
  {
    id: 'code_darbar_10',
    title: 'Playground Explorer',
    description: 'Run code in Code Darbar 10 times',
    icon: '💻',
    color: 'bg-violet-500',
    condition: 'code_darbar',
    target: 10,
    xpReward: 150,
    rarity: 'common',
  },
  {
    id: 'code_darbar_50',
    title: 'Code Architect',
    description: 'Run code in Code Darbar 50 times',
    icon: '🏗️',
    color: 'bg-purple-600',
    condition: 'code_darbar',
    target: 50,
    xpReward: 500,
    rarity: 'rare',
  },
  {
    id: 'capstone_1',
    title: 'Capstone Conqueror',
    description: 'Complete your first capstone project',
    icon: '🏰',
    color: 'bg-amber-500',
    condition: 'capstone',
    target: 1,
    xpReward: 300,
    rarity: 'rare',
  },
  {
    id: 'capstone_3',
    title: 'Triple Crown',
    description: 'Complete 3 capstone projects',
    icon: '👑',
    color: 'bg-gold-500',
    condition: 'capstone',
    target: 3,
    xpReward: 1000,
    rarity: 'epic',
  },
  {
    id: 'capstone_6',
    title: 'Grandmaster',
    description: 'Complete all 6 capstone projects',
    icon: '🏆',
    color: 'bg-gradient-to-r from-amber-400 to-orange-500',
    condition: 'capstone',
    target: 6,
    xpReward: 5000,
    rarity: 'legendary',
  },
  {
    id: 'all_modules',
    title: 'Polyglot',
    description: 'Make progress in all 6 modules',
    icon: '🌐',
    color: 'bg-emerald-500',
    condition: 'all_modules',
    target: 6,
    xpReward: 1000,
    rarity: 'epic',
  },
];

export const calculateAchievements = (
  stats: { xp: number; streak: number; hearts: number },
  progress: UserProgress,
  exerciseHistory: ExerciseHistory,
  codeDarbarRuns: number
): UserAchievements => {
  const earned: Record<string, { earnedAt: string; xpClaimed: boolean }> = {};
  const progressMap: Record<string, number> = {};

  const lessonsCompleted = progress.completedLessons.length;
  const perfectLessons = progress.completedLessons.filter(lessonId => {
    const exercises = Object.keys(exerciseHistory).filter(e => e.startsWith(lessonId));
    return exercises.length > 0 && exercises.every(e => exerciseHistory[e].attempts === 1);
  }).length;

  const speedLessons = Object.values(exerciseHistory).filter(e => e.attempts === 1).length;

  ACHIEVEMENT_BADGES.forEach(badge => {
    let current = 0;
    let target = badge.target;

    switch (badge.condition) {
      case 'lessons':
        current = lessonsCompleted;
        break;
      case 'xp':
        current = stats.xp;
        break;
      case 'streak':
        current = stats.streak;
        break;
      case 'hearts':
        current = stats.hearts;
        break;
      case 'perfect':
        current = perfectLessons;
        break;
      case 'speed':
        current = speedLessons;
        break;
      case 'code_darbar':
        current = codeDarbarRuns;
        break;
      case 'capstone':
        current = progress.completedProjects.length;
        break;
      case 'all_modules':
        current = 0;
        break;
    }

    progressMap[badge.id] = current;

    if (current >= target && !earned[badge.id]) {
      earned[badge.id] = {
        earnedAt: new Date().toISOString(),
        xpClaimed: false,
      };
    }
  });

  return { earned, progress: progressMap };
};

export const getAchievementProgress = (
  badge: AchievementBadge,
  stats: { xp: number; streak: number; hearts: number },
  progress: UserProgress,
  exerciseHistory: ExerciseHistory,
  codeDarbarRuns: number
): number => {
  let current = 0;

  switch (badge.condition) {
    case 'lessons':
      current = progress.completedLessons.length;
      break;
    case 'xp':
      current = stats.xp;
      break;
    case 'streak':
      current = stats.streak;
      break;
    case 'hearts':
      current = stats.hearts;
      break;
    case 'perfect': {
      const perfectLessons = progress.completedLessons.filter(lessonId => {
        const exercises = Object.keys(exerciseHistory).filter(e => e.startsWith(lessonId));
        return exercises.length > 0 && exercises.every(e => exerciseHistory[e].attempts === 1);
      }).length;
      current = perfectLessons;
      break;
    }
    case 'speed': {
      const speedLessons = Object.values(exerciseHistory).filter(e => e.attempts === 1).length;
      current = speedLessons;
      break;
    }
    case 'code_darbar':
      current = codeDarbarRuns;
      break;
    case 'capstone':
      current = progress.completedProjects.length;
      break;
    case 'all_modules':
      current = 0;
      break;
  }

  return Math.min(current, badge.target);
};

export const getAchievementRarity = (badge: AchievementBadge): 'common' | 'rare' | 'epic' | 'legendary' => {
  if (badge.target >= 100 || badge.xpReward >= 1000) return 'legendary';
  if (badge.target >= 30 || badge.xpReward >= 500) return 'epic';
  if (badge.target >= 10 || badge.xpReward >= 200) return 'rare';
  return 'common';
};

export const getAchievementById = (id: string): AchievementBadge | undefined => {
  return ACHIEVEMENT_BADGES.find(b => b.id === id);
};