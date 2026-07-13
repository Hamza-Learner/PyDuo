import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AppMap } from './components/AppMap';
import { ExercisePlayer } from './components/ExercisePlayer';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { SnakeMascot } from './components/SnakeMascot';
import { CuteSnakeLogo } from './components/CuteSnakeLogo';
import { CodeSandbox } from './components/CodeSandbox';
import { BhaiGameZone } from './components/BhaiGameZone';
import { CodeDarbar } from './components/CodeDarbar';
import { modules } from './curriculum';
import { UserStats, DailyQuest, UserProgress, Settings, Lesson, Module } from './types';
import { Flame, Heart, Zap, Award, Star, Settings as SettingsIcon, LogOut, ArrowLeft, Terminal, ShieldCheck, Sparkles, Trophy, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { App as CapacitorApp } from '@capacitor/app';

// Default initial state declarations
const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 1,
  hearts: 5,
  lastActiveDate: null,
  freezeShieldCount: 1,
  heartsLastRefilled: Date.now(),
};

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  completedProjects: [],
  exerciseHistory: {},
  unlockedModules: ['m1'],
};

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  soundEnabled: true,
  reducedMotion: false,
};

const INITIAL_QUESTS = [
  { id: 'q1', text: 'Earn 50 XP in code challenges', target: 50, current: 0, xpReward: 20, completed: false },
  { id: 'q2', text: 'Complete any lesson successfully', target: 1, current: 0, xpReward: 30, completed: false },
  { id: 'q3', text: 'Solve a custom coding exercise', target: 1, current: 0, xpReward: 40, completed: false },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'map' | 'exercise' | 'profile' | 'settings' | 'capstone' | 'sandbox'>('landing');
  const [userStats, setUserStats] = useState<UserStats>(DEFAULT_STATS);
  const [userProgress, setUserProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);

  // Active workspace states
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  // Overlays / Congratulations triggers
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);
  const [showLessonCompletedOverlay, setShowLessonCompletedOverlay] = useState(false);
  const [lessonRewardXP, setLessonRewardXP] = useState(0);

  // Bhai's Game Zone toggle & Daily Practice time states
  const [showBhaiGameZone, setShowBhaiGameZone] = useState<boolean>(false);
  const [practiceTimeSpent, setPracticeTimeSpent] = useState<number>(0);

  // Unified function to navigate with browser history states for back gesture handling
  const navigateTo = (screen: 'landing' | 'map' | 'exercise' | 'profile' | 'settings' | 'capstone' | 'sandbox') => {
    setCurrentScreen(screen);
    // Push the new screen state if not already there to prevent page exits on back gestures
    if (!window.history.state || window.history.state.screen !== screen) {
      window.history.pushState({ screen }, '');
    }
  };

  // Sync initial browser history state
  useEffect(() => {
    window.history.replaceState({ screen: 'landing' }, '');
  }, []);

  // Listen for back gesture / popstate events
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
        if (event.state.screen !== 'exercise') {
          setActiveLesson(null);
        }
        if (event.state.screen !== 'capstone') {
          setActiveModule(null);
        }
      } else {
        setCurrentScreen('landing');
        setActiveLesson(null);
        setActiveModule(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Capacitor Android hardware back button handler
  useEffect(() => {
    const handleBackButton = (event: { canGoBack: boolean }) => {
      // Prevent default back behavior (app exit)
      event.canGoBack = true;
      
      // Handle navigation based on current screen
      if (currentScreen === 'exercise') {
        setActiveLesson(null);
        navigateTo('map');
      } else if (currentScreen === 'capstone') {
        setActiveModule(null);
        navigateTo('map');
      } else if (currentScreen === 'profile' || currentScreen === 'settings' || currentScreen === 'sandbox') {
        navigateTo('map');
      } else if (currentScreen === 'map') {
        navigateTo('landing');
      } else if (currentScreen === 'landing') {
        // On landing, allow app to exit (or minimize)
        event.canGoBack = false;
      }
    };
    
    CapacitorApp.addListener('backButton', handleBackButton);
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [currentScreen, navigateTo]);

  // Scroll to top on navigation/state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen, activeLesson, activeModule]);

  // 1. Initial State Hydration from local storage
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem('pyduo_user_stats');
      const storedProgress = localStorage.getItem('pyduo_user_progress');
      const storedSettings = localStorage.getItem('pyduo_user_settings');
      const storedQuests = localStorage.getItem('pyduo_daily_quests');
      const storedTime = localStorage.getItem('pyduo_practice_time');

      if (storedStats) setUserStats(JSON.parse(storedStats));
      if (storedProgress) setUserProgress(JSON.parse(storedProgress));
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setSettings(parsedSettings);
        // Apply theme to HTML body
        if (parsedSettings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      if (storedQuests) setDailyQuests(JSON.parse(storedQuests));
      if (storedTime) setPracticeTimeSpent(parseInt(storedTime) || 0);
    } catch (e) {
      console.warn("Storage hydration failed. Initializing empty profiles.", e);
    }
  }, []);

  // Active daily practice timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPracticeTimeSpent((prev) => {
        const newVal = prev + 1;
        localStorage.setItem('pyduo_practice_time', String(newVal));
        
        // Heart bonus check: Every 120 seconds of practice time today,
        // they get a reward of +1 Extra Heart up to 10 max capacity!
        if (newVal > 0 && newVal % 120 === 0) {
          setUserStats((currentStats) => {
            const currentHearts = currentStats.hearts;
            const updatedHearts = Math.min(10, currentHearts + 1); // allow storing up to 10 hearts if they work hard daily!
            return {
              ...currentStats,
              hearts: updatedHearts,
            };
          });
          // Log feedback in console or dispatch a silent notice
          console.log("+1 Extra Heart gained from active study time!");
        }
        return newVal;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Persist state changes dynamically
  useEffect(() => {
    localStorage.setItem('pyduo_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('pyduo_user_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('pyduo_user_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pyduo_daily_quests', JSON.stringify(dailyQuests));
  }, [dailyQuests]);

  // 3. Heart regeneration & daily streak logic checks on mount
  useEffect(() => {
    const checkDailyCalculations = () => {
      const now = Date.now();
      const hoursSinceRefill = (now - userStats.heartsLastRefilled) / (1000 * 60 * 60);

      // Regenerate 1 heart every 5 hours (capped at 5 hearts)
      if (hoursSinceRefill >= 5 && userStats.hearts < 5) {
        const heartsToGain = Math.floor(hoursSinceRefill / 5);
        const newHearts = Math.min(5, userStats.hearts + heartsToGain);
        setUserStats(prev => ({
          ...prev,
          hearts: newHearts,
          heartsLastRefilled: now,
        }));
      }

      // Check daily streak tracking
      const todayString = new Date().toISOString().split('T')[0];
      if (userStats.lastActiveDate && userStats.lastActiveDate !== todayString) {
        const lastActive = new Date(userStats.lastActiveDate);
        const today = new Date(todayString);
        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Increment streak
          setUserStats(prev => ({ ...prev, streak: prev.streak + 1, lastActiveDate: todayString }));
        } else if (diffDays > 1) {
          // Streak broken! Unless they have a freeze shield
          if (userStats.freezeShieldCount > 0) {
            setUserStats(prev => ({
              ...prev,
              freezeShieldCount: prev.freezeShieldCount - 1,
              lastActiveDate: todayString,
            }));
          } else {
            setUserStats(prev => ({ ...prev, streak: 1, lastActiveDate: todayString }));
          }
        }
      } else if (!userStats.lastActiveDate) {
        setUserStats(prev => ({ ...prev, lastActiveDate: todayString }));
      }
    };

    checkDailyCalculations();
  }, [userStats.hearts, userStats.heartsLastRefilled, userStats.lastActiveDate, userStats.freezeShieldCount]);

  const playHapticSound = (type: 'tick' | 'pop' | 'error' | 'success') => {
    if (!settings.soundEnabled) return;
    try {
      const frequencies: Record<string, number> = {
        tick: 800,
        pop: 600,
        error: 200,
        success: 1000
      };
      const duration: Record<string, number> = {
        tick: 0.05,
        pop: 0.1,
        error: 0.3,
        success: 0.2
      };
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type === 'error' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(frequencies[type] || 440, ctx.currentTime);
      
      if (type === 'success') {
        osc.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.15);
      } else if (type === 'error') {
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.25);
      }
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration[type]);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration[type]);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Refill hearts using XP points (100 XP = Full refill)
  const buyHeartsWithXP = () => {
    if (userStats.xp >= 100 && userStats.hearts < 5) {
      setUserStats(prev => ({
        ...prev,
        xp: prev.xp - 100,
        hearts: 5,
        heartsLastRefilled: Date.now(),
      }));
    }
  };

  const decreaseHeart = () => {
    if (userStats.hearts > 0) {
      setUserStats(prev => ({
        ...prev,
        hearts: prev.hearts - 1,
        heartsLastRefilled: Date.now(),
      }));
    }
  };

  // Quest tracking & score increments
  const awardXP = (amount: number) => {
    setUserStats(prev => {
      const nextXP = prev.xp + amount;
      // Exponential curve: XP = 100 * level^1.5
      const xpNextLevel = Math.round(100 * Math.pow(prev.level + 1, 1.5));
      
      let leveledUp = false;
      let nextLevel = prev.level;

      if (nextXP >= xpNextLevel) {
        nextLevel = prev.level + 1;
        leveledUp = true;
      }

      if (leveledUp) {
        setShowLevelUpOverlay(true);
      }

      return {
        ...prev,
        xp: nextXP,
        level: nextLevel,
      };
    });

    // Update daily quests
    setDailyQuests(prev =>
      prev.map(q => {
        if (q.id === 'q1') {
          const nextVal = Math.min(q.target, q.current + amount);
          return { ...q, current: nextVal };
        }
        return q;
      })
    );
  };

  const handleLessonCompleted = (xpEarned: number) => {
    if (activeLesson) {
      setUserProgress(prev => {
        const nextCompleted = prev.completedLessons.includes(activeLesson.id)
          ? prev.completedLessons
          : [...prev.completedLessons, activeLesson.id];
        return {
          ...prev,
          completedLessons: nextCompleted,
        };
      });

      // Daily Quest check
      setDailyQuests(prev =>
        prev.map(q => {
          if (q.id === 'q2') {
            const nextVal = Math.min(q.target, q.current + 1);
            return { ...q, current: nextVal };
          }
          return q;
        })
      );

      setLessonRewardXP(xpEarned);
      setShowLessonCompletedOverlay(true);
      setActiveLesson(null);
      navigateTo('map');
    }
  };

  const handleClaimQuest = (questId: string) => {
    const q = dailyQuests.find(quest => quest.id === questId);
    if (q && !q.completed) {
      awardXP(q.xpReward);
      setDailyQuests(prev =>
        prev.map(quest => (quest.id === questId ? { ...quest, completed: true } : quest))
      );
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    // If user is out of hearts, they must refill first or wait!
    if (userStats.hearts <= 0) {
      alert("Bhai, hearts zero ho gaye hain! XP spend karke refill karo ya thoda wait karo.");
      return;
    }
    setActiveLesson(lesson);
    navigateTo('exercise');
  };

  const handleSelectModule = (module: Module) => {
    setActiveModule(module);
    navigateTo('capstone');
  };

  // Capstone Project solver action
  const handleCapstoneSubmit = (success: boolean) => {
    if (success && activeModule) {
      setUserProgress(prev => {
        const nextCompleted = prev.completedProjects.includes(activeModule.capstone.id)
          ? prev.completedProjects
          : [...prev.completedProjects, activeModule.capstone.id];
        return {
          ...prev,
          completedProjects: nextCompleted,
        };
      });

      // Update quests for custom coding solving
      setDailyQuests(prev =>
        prev.map(q => {
          if (q.id === 'q3') {
            const nextVal = Math.min(q.target, q.current + 1);
            return { ...q, current: nextVal };
          }
          return q;
        })
      );

      awardXP(activeModule.capstone.xpReward);
      alert(`Badhaai ho bhai! Capstone Project successfully compiled! You earned +${activeModule.capstone.xpReward} XP!`);
      setActiveModule(null);
      navigateTo('map');
    } else {
      alert("Bhai, output specifications check karo. Project execution me errors hain.");
    }
  };

  // Settings exports
  const exportProgressJSON = () => {
    const backupObj = {
      userStats,
      userProgress,
      dailyQuests,
      timestamp: Date.now(),
    };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pyduo_progress_backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importProgressJSON = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.userStats && parsed.userProgress) {
        setUserStats(parsed.userStats);
        setUserProgress(parsed.userProgress);
        if (parsed.dailyQuests) setDailyQuests(parsed.dailyQuests);
        alert("Progress backup loaded successfully! Slythe is ready.");
      } else {
        alert("Invalid backup package structure.");
      }
    } catch (e) {
      alert("Failed to parse backup package file.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* 1. Standard Landing Mode */}
      {currentScreen === 'landing' ? (
        <LandingPage
          onStartLearning={() => navigateTo('map')}
          onGoToProfile={() => navigateTo('profile')}
          onGoToSettings={() => navigateTo('settings')}
        />
      ) : (
        /* 2. Unified Learning Dashboard Shell */
        <div className="flex-1 flex flex-col">
          {/* Dashboard Header Bar */}
          <header className="border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 sticky top-0 z-40 select-none">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Logo / Back home trigger */}
              <div
                onClick={() => navigateTo('landing')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <CuteSnakeLogo size={32} />
                <span className="font-black text-xl font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  PyDuo <span className="text-[10px] bg-brand-blue/10 text-[#306998] dark:text-[#FFD43B] border border-brand-blue/20 px-2 py-0.5 rounded-full font-mono font-bold">WASM</span>
                </span>
              </div>

              {/* Central Navigation Tabs */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border-2 border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => navigateTo('map')}
                  className={`px-4 py-2 rounded-xl text-xs font-black font-display transition-all cursor-pointer ${
                    currentScreen === 'map' || currentScreen === 'exercise'
                      ? 'bg-[#306998] text-white shadow-md border-b-2 border-[#204c70]'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  🗺️ Map Path
                </button>
                <button
                  onClick={() => navigateTo('profile')}
                  className={`px-4 py-2 rounded-xl text-xs font-black font-display transition-all cursor-pointer ${
                    currentScreen === 'profile'
                      ? 'bg-[#306998] text-white shadow-md border-b-2 border-[#204c70]'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  🏆 Stats & Quests
                </button>
                <button
                  onClick={() => navigateTo('sandbox')}
                  className={`px-4 py-2 rounded-xl text-xs font-black font-display transition-all cursor-pointer ${
                    currentScreen === 'sandbox'
                      ? 'bg-[#306998] text-white shadow-md border-b-2 border-[#204c70]'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  💻 Code Darbar
                </button>
                <button
                  onClick={() => navigateTo('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-black font-display transition-all cursor-pointer ${
                    currentScreen === 'settings'
                      ? 'bg-[#306998] text-white shadow-md border-b-2 border-[#204c70]'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  ⚙️ Settings
                </button>
                <button
                  onClick={() => {
                    playHapticSound('pop');
                    setShowBhaiGameZone(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-black font-display transition-all cursor-pointer flex items-center gap-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-2 border-dashed border-amber-500/30"
                >
                  🎮 Bhai's Game Zone
                </button>
              </div>

              {/* Stats telemetry gauges */}
              <div className="flex items-center gap-3.5 text-sm font-bold font-mono">
                <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border-2 border-emerald-500/20 shadow-xs" title="Study Time Today (Every 2m gives +1 Heart!)">
                  ⏱️ {Math.floor(practiceTimeSpent / 60)}m {practiceTimeSpent % 60}s
                </span>
                <span className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border-2 border-amber-500/20 shadow-xs" title="Accumulated XP">
                  <Zap className="w-4.5 h-4.5 fill-current" /> {userStats.xp} XP
                </span>
                <span className="flex items-center gap-1.5 text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-xl border-2 border-rose-500/20 shadow-xs" title="Hearts Remaining">
                  <Heart className="w-4.5 h-4.5 fill-current" /> {userStats.hearts}
                  {userStats.hearts < 5 && (
                    <button
                      onClick={buyHeartsWithXP}
                      className="ml-1 text-[10px] bg-[#FFD43B] text-slate-900 px-2.5 py-1 rounded-lg font-sans font-black hover:brightness-110 active:scale-95 transition-transform cursor-pointer border-b-2 border-[#cfa415]"
                      title="Spend 100 XP to refill hearts"
                    >
                      + Refill (100 XP)
                    </button>
                  )}
                </span>
                <span className="flex items-center gap-1.5 text-[#FF6B35] bg-[#FF6B35]/10 px-3 py-1.5 rounded-xl border-2 border-[#FF6B35]/20 shadow-xs" title="Streak Days">
                  <Flame className="w-4.5 h-4.5 fill-current animate-pulse" /> {userStats.streak} d
                </span>
              </div>

            </div>
          </header>

          {/* Active Router Screens */}
          <main className="flex-1">
            {currentScreen === 'map' && (
              <AppMap
                modules={modules}
                completedLessons={userProgress.completedLessons}
                onSelectLesson={handleSelectLesson}
                onSelectModule={handleSelectModule}
                userXP={userStats.xp}
              />
            )}

            {currentScreen === 'exercise' && activeLesson && (
              <ExercisePlayer
                lesson={activeLesson}
                settings={settings}
                onBack={() => {
                  setActiveLesson(null);
                  navigateTo('map');
                }}
                onLessonComplete={handleLessonCompleted}
                userHearts={userStats.hearts}
                onLoseHeart={decreaseHeart}
                onGainXP={awardXP}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfilePage
                stats={userStats}
                quests={dailyQuests}
                progress={userProgress}
                onClaimQuestReward={handleClaimQuest}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsPage
                settings={settings}
                onUpdateSettings={setSettings}
                onExportData={exportProgressJSON}
                onImportData={importProgressJSON}
              />
            )}

            {currentScreen === 'sandbox' && (
              <CodeDarbar
                settings={settings}
                onBack={() => navigateTo('map')}
                onGainXP={awardXP}
              />
            )}

            {currentScreen === 'capstone' && activeModule && (
              <div className="max-w-6xl mx-auto px-4 py-8">
                
                {/* Back Link */}
                <button
                  onClick={() => {
                    setActiveModule(null);
                    navigateTo('map');
                  }}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold text-sm mb-6 select-none cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Cancel Project
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left panel: Steps and guide */}
                  <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850 flex flex-col gap-6 select-text">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider select-none w-max">
                      <Star className="w-3.5 h-3.5 fill-current" /> Module Capstone Project
                    </div>

                    <div>
                      <h2 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                        {activeModule.capstone.title}
                      </h2>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        {activeModule.capstone.description}
                      </p>
                    </div>

                    <div className="bg-emerald-500/5 border-l-4 border-emerald-500 p-4.5 rounded-r-2xl select-none">
                      <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 font-mono block mb-1">Coach Slythe's Tips</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
                        "Bhai, complete standard implementation targets step by step. Test compilation is automated inside the sandbox on run!"
                      </p>
                    </div>

                    {/* Milestone check list */}
                    <div className="flex flex-col gap-2.5">
                      <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider select-none">Guide Instructions</span>
                      {activeModule.capstone.guideSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 select-none mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-slate-600 dark:text-slate-300 font-medium">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right panel: Active workspace playground code editor */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <CodeSandbox
                      initialCode={activeModule.capstone.initialCode}
                      onRunComplete={(output, success) => handleCapstoneSubmit(success)}
                      testCases={[
                        {
                          expectedOutput: 'successfully',
                          description: 'Verify standard return signatures compile successfully.',
                        },
                      ]}
                    />
                  </div>

                </div>

              </div>
            )}
          </main>
        </div>
      )}

      {/* Fullscreen Overlay 1: LEVEL UP CELEBRATION */}
      <AnimatePresence>
        {showLevelUpOverlay && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 select-none">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="text-center max-w-sm flex flex-col items-center gap-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400 rounded-full filter blur-xl opacity-20 animate-pulse" />
                <SnakeMascot state="level_up" className="w-52 h-52 relative" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase block mb-1">Congratulations, Bhai!</span>
                <h2 className="text-4xl font-black font-display tracking-tight text-white leading-none">
                  LEVEL UP!
                </h2>
                <span className="text-xl font-bold text-amber-400 mt-2 block">
                  You reached Level {userStats.level}!
                </span>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                Bhai khush hua! Tumhari machine learning coding speed bohot fast ho rahi hai. Seekhte raho aur level-up karte raho!
              </p>

              <button
                onClick={() => setShowLevelUpOverlay(false)}
                id="close_level_up_button"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Dhanyavaad, Bhai!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Overlay 2: LESSON CLEARED OVERLAY */}
      <AnimatePresence>
        {showLessonCompletedOverlay && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-center max-w-sm flex flex-col items-center gap-6 border border-slate-100 dark:border-slate-800 shadow-2xl"
            >
              <SnakeMascot state="celebrate_jump" className="w-40 h-40" />

              <div>
                <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-wider block mb-1">Lesson Cleared</span>
                <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white leading-tight">
                  Slayed It, Bhai!
                </h3>
                <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold font-mono mt-2">
                  <Zap className="w-5 h-5 fill-current" /> +{lessonRewardXP} XP Claimed!
                </div>
              </div>

              <button
                onClick={() => setShowLessonCompletedOverlay(false)}
                id="close_lesson_completed_button"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-extrabold py-3.5 rounded-2xl shadow transition-transform hover:scale-102 active:scale-98 cursor-pointer text-sm"
              >
                Agle Lesson Pe Chalo!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Overlay 3: BHAI'S GAME ZONE OVERLAY */}
      <AnimatePresence>
        {showBhaiGameZone && (
          <BhaiGameZone
            onClose={() => setShowBhaiGameZone(false)}
            playHapticSound={playHapticSound}
            onGainXP={awardXP}
            soundEnabled={settings.soundEnabled}
            practiceTimeSpent={practiceTimeSpent}
            userHearts={userStats.hearts}
            onLoseHeart={decreaseHeart}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
