import React from 'react';
import { Award, Star, Flame, Heart, Zap, Calendar, Trophy, CheckSquare, Sparkles, TrendingUp } from 'lucide-react';
import { UserStats, DailyQuest, UserProgress } from '../types';
import { motion } from 'motion/react';

interface ProfilePageProps {
  stats: UserStats;
  quests: DailyQuest[];
  progress: UserProgress;
  onClaimQuestReward: (questId: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  stats,
  quests,
  progress,
  onClaimQuestReward,
}) => {
  // Level progression curve: XP = 100 * Level^1.5
  const getXPForLevel = (lvl: number) => Math.round(100 * Math.pow(lvl, 1.5));
  const xpCurrentLevelBase = getXPForLevel(stats.level);
  const xpNextLevelBase = getXPForLevel(stats.level + 1);
  const xpNeededForNext = xpNextLevelBase - xpCurrentLevelBase;
  const currentXPProgressInLevel = stats.xp - xpCurrentLevelBase;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentXPProgressInLevel / xpNeededForNext) * 100))
  );

  // Gamified Badges Earned depending on completed lessons counts
  const badgeMilestones = [
    { title: 'Python Novice', desc: 'Unlock Module 1 Foundations', lessonsReq: 1, icon: '🐍' },
    { title: 'Graph Wrangler', desc: 'Complete 5 network tasks', lessonsReq: 5, icon: '🕸️' },
    { title: 'Decorators Sensei', desc: 'Complete 10 advanced toolkits', lessonsReq: 10, icon: '🎩' },
    { title: 'WASM Practitioner', desc: 'Compile 15 local sandboxes', lessonsReq: 15, icon: '💻' },
    { title: 'Neural Architect', desc: 'Complete Module 6 Deep Learning', lessonsReq: 25, icon: '🧠' },
    { title: 'AGI Pathfinder', desc: 'Slay the ultimate capstone', lessonsReq: 40, icon: '🚀' },
  ];

  const earnedCount = progress.completedLessons.length;

  // Custom Github-style Heatmap Generator
  const generateHeatmapDays = () => {
    // Generate 52 columns of 7 days (or simplified grid of 7x24 grid tiles)
    const days = [];
    const seed = stats.xp % 7;
    for (let i = 0; i < 112; i++) {
      // Create interesting pattern of varying training intensities
      let level = 0;
      if (i % 7 === 0 && i % 3 === 0) level = 3;
      else if (i % 5 === 0) level = 1;
      else if (i % 11 === 0) level = 2;
      else if (i === 110 || i === 111) level = 4; // Recent activity!
      days.push(level);
    }
    return days;
  };

  const heatmapColors = [
    'bg-slate-100 dark:bg-slate-900', // level 0 (none)
    'bg-emerald-200 dark:bg-emerald-950/40', // level 1 (low)
    'bg-emerald-400 dark:bg-emerald-800/60', // level 2 (med)
    'bg-emerald-500 dark:bg-emerald-600',    // level 3 (high)
    'bg-emerald-600 dark:bg-emerald-400',    // level 4 (extreme)
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 border-b-6 border-slate-300 dark:border-slate-800 dark:border-b-6 dark:border-slate-950 shadow-md mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-3xl font-bold font-display shadow-lg border-2 border-white/20">
              {stats.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-display tracking-tight">Active Pythonist</h2>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-mono">Rank: swarms explorer</span>
              </div>
              <p className="text-slate-400 text-xs mt-1 font-mono">Level {stats.level} • {stats.xp} Accumulated XP</p>
            </div>
          </div>

          {/* Quick stats parameters */}
          <div className="flex gap-6">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Streak</span>
              <span className="text-2xl font-black font-mono text-amber-400 flex items-center justify-center gap-1.5 mt-0.5">
                <Flame className="w-6 h-6 fill-current animate-pulse" /> {stats.streak}
              </span>
            </div>
            <div className="w-px h-10 bg-slate-800 m-auto" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Hearts</span>
              <span className="text-2xl font-black font-mono text-rose-500 flex items-center justify-center gap-1.5 mt-0.5">
                <Heart className="w-6 h-6 fill-current" /> {stats.hearts}
              </span>
            </div>
            <div className="w-px h-10 bg-slate-800 m-auto" />
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">Shields</span>
              <span className="text-2xl font-black font-mono text-sky-400 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-5.5 h-5.5 fill-current" /> {stats.freezeShieldCount}
              </span>
            </div>
          </div>
        </div>

        {/* Level Progress Gauge */}
        <div className="mt-8 pt-6 border-t border-slate-800/65">
          <div className="flex items-center justify-between text-xs font-bold font-mono text-slate-400 mb-2">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{currentXPProgressInLevel} / {xpNeededForNext} XP</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-800/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Daily Quests & Heatmap Grid */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Daily Quests Block */}
          <div className="bg-white dark:bg-slate-950 p-6 high-density-card shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-extrabold font-display text-slate-950 dark:text-white">Daily Learning Quests</h3>
            </div>

            <div className="flex flex-col gap-3">
              {quests.map((q) => {
                const pct = Math.min(100, Math.round((q.current / q.target) * 100));
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col gap-2 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-extrabold font-display leading-tight">{q.text}</h4>
                        <span className="text-[10px] font-mono font-medium text-slate-400 mt-0.5 block">
                          Progress: {q.current} / {q.target} ({pct}%)
                        </span>
                      </div>

                      {q.completed ? (
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 select-none">
                          <Star className="w-3 h-3 fill-current" /> Claimed
                        </span>
                      ) : q.current >= q.target ? (
                        <button
                          onClick={() => onClaimQuestReward(q.id)}
                          id={`claim_quest_${q.id}`}
                          className="text-xs bouncy-btn-yellow font-black px-4.5 py-2 rounded-xl cursor-pointer"
                        >
                          Claim +{q.xpReward} XP
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                          +{q.xpReward} XP Reward
                        </span>
                      )}
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Heatmap Graph */}
          <div className="bg-white dark:bg-slate-950 p-6 high-density-card shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-extrabold font-display text-slate-950 dark:text-white">Training Commit Heatmap</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">16 Weeks Active Track</span>
            </div>

            {/* Grid Container */}
            <div className="overflow-x-auto pr-1">
              <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[340px] aspect-[4/1]">
                {generateHeatmapDays().map((lvl, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-xs ${heatmapColors[lvl]} transition-colors hover:scale-110`}
                    title={`Day index ${index}: Level ${lvl}`}
                  />
                ))}
              </div>
            </div>

            {/* Scale Legend */}
            <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 font-mono select-none">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-900" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-200 dark:bg-emerald-950" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-400 dark:bg-emerald-800" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500 dark:bg-emerald-600" />
              <div className="w-2.5 h-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-400" />
              <span>More</span>
            </div>
          </div>

        </div>

        {/* Right Column: Gamified Badges Portfolio */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-6 high-density-card shadow-xs">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-extrabold font-display text-slate-950 dark:text-white">Earned Badges ({badgeMilestones.filter(b => earnedCount >= b.lessonsReq).length})</h3>
          </div>

          <div className="flex flex-col gap-3">
            {badgeMilestones.map((badge, idx) => {
              const isEarned = earnedCount >= badge.lessonsReq;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    isEarned
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs'
                      : 'border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 ${isEarned ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-500' : 'bg-slate-200 dark:bg-slate-900 text-slate-400'}`}>
                    {isEarned ? badge.icon : '🔒'}
                  </div>
                  <div>
                    <h4 className={`text-sm font-extrabold font-display ${isEarned ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                      {badge.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{badge.desc}</p>
                    {!isEarned && (
                      <span className="text-[9px] font-mono font-bold text-sky-500 uppercase mt-1 block">
                        Requires {badge.lessonsReq} Lessons completed ({earnedCount}/{badge.lessonsReq})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
