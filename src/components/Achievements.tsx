import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Check, Star } from 'lucide-react';
import { ACHIEVEMENT_BADGES } from '../achievements';
import { calculateAchievements, getAchievementProgress, getAchievementRarity } from '../utils/achievements';
import { AchievementBadge, UserAchievements, UserProgress, ExerciseHistory } from '../types';
import { playHaptic } from '../utils/haptics';

interface AchievementsPanelProps {
  stats: { xp: number; streak: number; hearts: number };
  userProgress: UserProgress;
  exerciseHistory: ExerciseHistory;
  codeDarbarRuns: number;
  userAchievements: UserAchievements | null;
  onClaimXP?: (badgeId: string) => void;
  onClose: () => void;
}

const rarityColorMap = {
  common: { border: 'border-slate-300 dark:border-slate-700', bg: 'bg-white dark:bg-slate-900', progress: 'bg-slate-500', text: 'text-slate-700 dark:text-slate-300', badge: 'bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300' },
  rare: { border: 'border-sky-300 dark:border-sky-700', bg: 'bg-sky-50/50 dark:bg-sky-950/20', progress: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-300', badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300' },
  epic: { border: 'border-purple-300 dark:border-purple-700', bg: 'bg-purple-50/50 dark:bg-purple-950/20', progress: 'bg-purple-500', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' },
  legendary: { border: 'border-amber-300 dark:border-amber-700', bg: 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20', progress: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'text-amber-700 dark:text-amber-300', badge: 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 text-amber-700 dark:text-amber-300' },
};

const rarityGlowMap = {
  common: '',
  rare: 'shadow-sky-500/20',
  epic: 'shadow-purple-500/20',
  legendary: 'shadow-amber-500/30 animate-pulse',
};

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  stats,
  userProgress,
  exerciseHistory,
  codeDarbarRuns,
  userAchievements,
  onClaimXP,
  onClose,
}) => {
  const computed = useMemo(
    () => userAchievements || calculateAchievements(stats, userProgress, exerciseHistory, codeDarbarRuns),
    [userAchievements, stats, userProgress, exerciseHistory, codeDarbarRuns]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-slate-950 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white">Achievements</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {Object.keys(computed.earned).length} / {ACHIEVEMENT_BADGES.length} unlocked
              </p>
            </div>
          </div>
          <button
            onClick={() => { playHaptic('tick'); onClose(); }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
          {['all', 'common', 'rare', 'epic', 'legendary'].map(rarity => (
            <button
              key={rarity}
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all whitespace-nowrap ${
                rarity === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-1">
          {ACHIEVEMENT_BADGES.map(badge => {
            const currentProgress = getAchievementProgress(
              badge,
              stats,
              userProgress,
              exerciseHistory,
              codeDarbarRuns
            );
            const earned = computed.earned[badge.id];
            const rarity = getAchievementRarity(badge);
            const colors = rarityColorMap[rarity];
            const glow = rarityGlowMap[rarity];
            const isEarned = !!earned;
            const progressPercent = Math.min((currentProgress / badge.target) * 100, 100);

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative p-4 rounded-2xl border-2 ${colors.border} ${colors.bg} ${glow} overflow-hidden flex flex-col gap-3 ${isEarned ? 'opacity-100' : 'opacity-70'}`}
              >
                {/* Rarity indicator */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rarity === 'legendary' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
                    : `${colors.badge}`}`}>
                    {rarity.toUpperCase()}
                  </span>
                  {isEarned && earned?.xpClaimed === false && onClaimXP && (
                    <motion.button
                      onClick={() => { playHaptic('pop'); onClaimXP?.(badge.id); }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs font-bold px-2 py-1 bg-emerald-500 text-white rounded-full shadow-md"
                    >
                      Claim +{badge.xpReward} XP
                    </motion.button>
                  )}
                </div>

                {/* Badge Icon */}
                <div className="flex items-center justify-center">
                  <span className="text-5xl filter drop-shadow-lg" style={{ transform: isEarned ? 'scale(1)' : 'scale(0.9) grayscale(1)' }}>
                    {badge.icon}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="text-center">
                  <h4 className="font-black text-lg text-slate-900 dark:text-white">{badge.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{badge.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full transition-colors ${rarity === 'legendary' ? colors.progress : colors.progress}`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  <span>{currentProgress} / {badge.target}</span>
                  <span className="text-emerald-500">+{badge.xpReward} XP</span>
                </div>

                {/* Lock overlay if not earned */}
                {!isEarned && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl z-10">
                    <Lock className="w-8 h-8 text-white/70" />
                  </div>
                )}

                {isEarned && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-emerald-500 drop-shadow-lg" />
                  </div>
                )}

                {rarity === 'legendary' && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-amber-300/20 to-orange-300/20 pointer-events-none"
                    />
                  </AnimatePresence>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { ACHIEVEMENT_BADGES, calculateAchievements, getAchievementProgress, getAchievementRarity } from '../achievements';