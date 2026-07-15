export type ExerciseType = 'MCQ' | 'CODE' | 'DEBUG' | 'PREDICT' | 'DRAG_DROP';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  points: number;
  romanHindiHint: string;
}

export interface MCQExercise extends BaseExercise {
  type: 'MCQ';
  options: string[];
  correctIndex: number;
}

export interface CodeExercise extends BaseExercise {
  type: 'CODE';
  initialCode: string;
  testCases: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
  solutionCode?: string;
}

export interface DebugExercise extends BaseExercise {
  type: 'DEBUG';
  buggyCode: string;
  correctCode: string;
  instructions: string;
}

export interface PredictExercise extends BaseExercise {
  type: 'PREDICT';
  code: string;
  options: string[];
  correctAnswer: string;
}

export interface DragDropExercise extends BaseExercise {
  type: 'DRAG_DROP';
  items: string[]; // Shuffled blocks
  correctOrder: string[]; // Correct sequence of code lines or concepts
}

export type Exercise = MCQExercise | CodeExercise | DebugExercise | PredictExercise | DragDropExercise;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  exercises: Exercise[];
}

export interface CapstoneProject {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  initialCode: string;
  testCode: string;
  guideSteps: string[];
}

export interface Module {
  id: string; // "m1", "m2", etc.
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
  capstone: CapstoneProject;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  freezeShieldCount: number;
  heartsLastRefilled: number; // timestamp
}

export interface DailyQuest {
  id: string;
  text: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
}

export interface UserProgress {
  completedLessons: string[]; // lessonIds
  completedProjects: string[]; // projectIds
  exerciseHistory: Record<string, { attempts: number; lastSolved: string }>;
  unlockedModules: string[];
}

export interface Settings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  reducedMotion: boolean;
  aiProvider?: 'gemini' | 'anthropic' | 'openrouter' | 'nvidia' | 'opencode_zen';
  geminiApiKey?: string;
  anthropicApiKey?: string;
  openrouterApiKey?: string;
  nvidiaApiKey?: string;
  opencode_zenApiKey?: string;
  geminiBaseUrl?: string;
  anthropicBaseUrl?: string;
  openrouterBaseUrl?: string;
  nvidiaBaseUrl?: string;
  opencode_zenBaseUrl?: string;
  selectedModel?: string;
}

export type SnakeState =
  | 'idle_breathe'
  | 'idle_look_around'
  | 'idle_flick_tongue'
  | 'sleep_zzz'
  | 'slither'
  | 'happy_pop'
  | 'celebrate_jump'
  | 'sparkle_eyes'
  | 'think_chin_tap'
  | 'lightbulb_moment'
  | 'read_code'
  | 'debug_detective'
  | 'sad_but_supportive'
  | 'thumbs_up'
  | 'streak_fire'
  | 'level_up';

export interface ExerciseHistory {
  [exerciseId: string]: { attempts: number; lastSolved: string };
}

// ===== NEW TYPES FOR ENHANCED FEATURES =====

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

export interface CodePattern {
  id: string;
  title: string;
  category: 'loops' | 'functions' | 'data_structures' | 'algorithms' | 'oop' | 'async' | 'testing' | 'patterns';
  description: string;
  code: string;
  explanation: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SpacedRepetitionCard {
  id: string; // lessonId or conceptId
  type: 'lesson' | 'concept' | 'exercise';
  question: string;
  answer: string;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
  nextReview: string; // ISO date
  lastReviewed: string | null;
}

export interface WeeklyChallenge {
  id: string;
  weekStart: string; // ISO date Monday
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  tests: { input: string; expectedOutput: string }[];
  xpReward: number;
  leaderboard: { userId: string; username: string; score: number; submittedAt: string }[];
}

export interface UserNotes {
  [conceptId: string]: {
    content: string; // Markdown
    updatedAt: string;
  };
}
