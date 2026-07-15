import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Star, Lock, CheckCircle, Zap, ShieldAlert, Award, Volume2, VolumeX, Flame, Network } from 'lucide-react';
import { Module, Lesson, SnakeState } from '../types';
import { SnakeMascot } from './SnakeMascot';
import { GraphPlayground } from './GraphPlayground';
import { motion, AnimatePresence } from 'motion/react';
import { playHaptic } from '../utils/haptics';

interface AppMapProps {
  modules: Module[];
  completedLessons: string[];
  onSelectLesson: (lesson: Lesson) => void;
  onSelectModule: (module: Module) => void;
  userXP: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
}

export const AppMap: React.FC<AppMapProps> = ({
  modules,
  completedLessons,
  onSelectLesson,
  onSelectModule,
  userXP,
}) => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [snakeMessage, setSnakeMessage] = useState<string | null>("Swagat hai dosto! 🐍 Roadmap dekh kar agla python lesson select karo!");
  const [mascotState, setMascotState] = useState<SnakeState>('idle_flick_tongue');
  const [showGraphPlayground, setShowGraphPlayground] = useState<boolean>(false);

  // Auto-select highest unlocked module by default so the user never sees an empty details panel!
  useEffect(() => {
    if (modules && modules.length > 0 && !selectedModule) {
      // Find highest unlocked module
      let highestUnlocked = modules[0];
      for (let i = 0; i < modules.length; i++) {
        const prevMod = i === 0 ? null : modules[i - 1];
        const prevCompleted = prevMod ? prevMod.lessons.filter(l => completedLessons.includes(l.id)).length : 999;
        const isUnlocked = i === 0 || prevCompleted >= prevMod!.lessons.length;
        if (isUnlocked) {
          highestUnlocked = modules[i];
        }
      }
      setSelectedModule(highestUnlocked);
    }
  }, [modules, completedLessons, selectedModule]);

  // Scroll to details panel on mobile/tablet when a module is selected
  useEffect(() => {
    if (selectedModule && typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024; // lg breakpoint in Tailwind is 1024px
      if (isMobile) {
        setTimeout(() => {
          const element = document.getElementById('selected-module-panel');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 120);
      }
    }
  }, [selectedModule]);

  // Clear startup message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSnakeMessage(null);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  // Web Audio API Haptic Sound Synthesizer
  const playHapticSound = (type: 'tick' | 'pop' | 'error' | 'success') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'tick') {
        // High-frequency subtle analog tick (haptic tap feel)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.03);
        
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
        
        if (navigator.vibrate) {
          navigator.vibrate(12);
        }
      } else if (type === 'pop') {
        // Juicy, squishy spring-loaded pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.07);
        
        gain.gain.setValueAtTime(0.14, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
        
        if (navigator.vibrate) {
          navigator.vibrate([15, 10]);
        }
      } else if (type === 'success') {
        // Gorgeous upward chime chord
        const now = ctx.currentTime;
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C major chord notes
        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.06, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
          
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.3);
        });
        
        if (navigator.vibrate) {
          navigator.vibrate([20, 15, 20]);
        }
      } else if (type === 'error') {
        // Bass drop thud & double vibration buzz for locks
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.16);
        
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
        
        if (navigator.vibrate) {
          navigator.vibrate([45, 30]);
        }
      }
    } catch (e) {
      // Audio context gestures block safety
    }
  };

  // Coordinates on our beautiful winding road (same coordinates as the spline curves)
  const pathCoordinates = [
    { x: 14, y: 18 },  // Module 1
    { x: 30, y: 14 },
    { x: 50, y: 22 },  // Module 2
    { x: 70, y: 14 },
    { x: 86, y: 24 },  // Module 3
    { x: 74, y: 44 },
    { x: 52, y: 38 },  // Module 4
    { x: 30, y: 46 },
    { x: 16, y: 64 },  // Module 5
    { x: 36, y: 72 },
    { x: 60, y: 62 },  // Module 6
    { x: 84, y: 74 },
    { x: 92, y: 92 },
  ];

  // Helper to determine module locked/unlocked state
  const moduleStatus = (mod: Module, index: number) => {
    if (index === 0) return 'unlocked';
    const prevMod = modules[index - 1];
    const prevLessonsCount = prevMod.lessons.length;
    const prevCompletedCount = prevMod.lessons.filter(l => completedLessons.includes(l.id)).length;
    return prevCompletedCount >= prevLessonsCount ? 'unlocked' : 'locked';
  };

  const getModuleCompletionRate = (mod: Module) => {
    const total = mod.lessons.length;
    const completed = mod.lessons.filter(l => completedLessons.includes(l.id)).length;
    return { completed, total, pct: Math.round((completed / total) * 100) };
  };

  // Sparkle burst handler
  const triggerSparklesAt = (x: number, y: number) => {
    const colors = ['#EAF89B', '#78D82A', '#38BDF8', '#F43F5E', '#FBBF24', '#A855F7'];
    const newParticles: Particle[] = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: (i * 360) / 14 + (Math.random() * 20 - 10),
      speed: 1.5 + Math.random() * 2,
    }));
    setParticles(newParticles);
    // Cleanup particles
    setTimeout(() => setParticles([]), 900);
  };

  const handleNodeClick = (mod: Module, index: number) => {
    const status = moduleStatus(mod, index);
    const coord = pathCoordinates[index * 2] || pathCoordinates[0];

    if (status === 'unlocked') {
      playHapticSound('success');
      setSelectedModule(mod);
      triggerSparklesAt(coord.x, coord.y);
      setMascotState('celebrate_jump');
      
      const congrats = [
        "Aha! Let's conquer this chapter together! 🚀🐍",
        "Arre badiya choice! Isko toh bilkul phod denge! ⚡🔥",
        "Slythe is so proud of your dedication! Let's study! 💖",
        "Badhte chalo! Agla Python milestone door nahi hai! 🏆",
      ];
      setSnakeMessage(congrats[index % congrats.length]);

      setTimeout(() => {
        setMascotState('idle_flick_tongue');
      }, 2000);
    } else {
      playHapticSound('error');
      setMascotState('sad_but_supportive');
      
      const lockWarnings = [
        "Ruko bhai! Pehle peeche wale lessons complete karo tabhi ye khulega! 🔒🐍",
        "Sabar karo dost! Purane modules ke test cases pass karo pehle! 🔑",
        "Arey locked hai ye! Slythe ko gussa mat dilao, rules follow karo! 😉",
      ];
      setSnakeMessage(lockWarnings[index % lockWarnings.length]);

      setTimeout(() => {
        setMascotState('idle_flick_tongue');
        setSnakeMessage(null);
      }, 3500);
    }
  };

  // Find user's active/highest unlocked point coordinates
  let activeIndex = 0;
  for (let i = 0; i < modules.length; i++) {
    if (moduleStatus(modules[i], i) === 'unlocked') {
      activeIndex = i;
    }
  }
  const activeCoord = pathCoordinates[activeIndex * 2] || pathCoordinates[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none relative overflow-hidden">
      
      {/* Background Twinkling Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-20 w-3.5 h-3.5 bg-sky-400 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
      </div>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b-2 border-slate-100 dark:border-slate-800 pb-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <h2 className="text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Slythe’s Interactive Roadmap <Sparkles className="w-6 h-6 text-[#78D82A] animate-spin" />
            </h2>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Winding tracks, physical 3D button clicks, real synthesized haptics. Phodo each milestone!
          </p>
        </div>

        {/* Tactile Control Panel */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> XP: <span className="text-emerald-500">{userXP}</span>
          </span>
          <div className="h-4 w-0.5 bg-slate-200 dark:bg-slate-800" />
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playHapticSound('tick');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              soundEnabled
                ? 'bg-emerald-500/10 text-[#59B113] border border-emerald-500/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" /> Haptics Active
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" /> Sound Disabled
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: GORGEOUS GAME ROADMAP MAP CANVAS */}
        <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 shadow-sm border-2 border-slate-200 dark:border-slate-800 relative overflow-hidden">
          
          {/* Floating Clouds gliding background */}
          <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden select-none z-0">
            <motion.div
              className="absolute text-slate-300/35 dark:text-slate-700/10 text-3xl font-bold"
              style={{ top: '8%', left: '-15%' }}
              animate={{ x: ['-20%', '120%'] }}
              transition={{ repeat: Infinity, duration: 34, ease: 'linear' }}
            >
              ☁️
            </motion.div>
            <motion.div
              className="absolute text-slate-300/25 dark:text-slate-700/8 text-4xl font-bold"
              style={{ top: '35%', left: '-15%' }}
              animate={{ x: ['120%', '-20%'] }}
              transition={{ repeat: Infinity, duration: 48, ease: 'linear' }}
            >
              ☁️
            </motion.div>
            <motion.div
              className="absolute text-slate-300/30 dark:text-slate-700/10 text-3xl font-bold"
              style={{ top: '65%', left: '-15%' }}
              animate={{ x: ['-20%', '120%'] }}
              transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
            >
              ☁️
            </motion.div>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-black text-[#59B113] uppercase tracking-widest font-mono shadow-xs z-10">
            <Award className="w-3.5 h-3.5 text-[#78D82A]" /> Tap Nodes for Haptic Pop
          </div>

          {/* Particle shower layer */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  backgroundColor: p.color,
                  filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.4))',
                }}
                initial={{ x: 0, y: 0, scale: 1.5, opacity: 1 }}
                animate={{
                  x: Math.cos((p.angle * Math.PI) / 180) * p.speed * 18,
                  y: Math.sin((p.angle * Math.PI) / 180) * p.speed * 18,
                  scale: 0.1,
                  opacity: 0,
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </div>

          {/* SVG Map Canvas with Lush Board Scenery */}
          <div className="relative w-full aspect-[4/3] bg-emerald-500/5 dark:bg-emerald-950/10 rounded-2xl border-2 border-emerald-100/20 dark:border-emerald-900/10 z-10">
            
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
              
              <defs>
                {/* 3D button radial shading gradients */}
                <radialGradient id="completedNode" cx="50%" cy="30%" r="50%" fx="30%" fy="30%">
                  <stop offset="0%" stopColor="#A6F065" />
                  <stop offset="70%" stopColor="#78D82A" />
                  <stop offset="100%" stopColor="#4FA010" />
                </radialGradient>
                <radialGradient id="activeNode" cx="50%" cy="30%" r="50%" fx="30%" fy="30%">
                  <stop offset="0%" stopColor="#67E8F9" />
                  <stop offset="70%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#0369A1" />
                </radialGradient>
                <radialGradient id="lockedNode" cx="50%" cy="30%" r="50%" fx="30%" fy="30%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="70%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </radialGradient>
                <linearGradient id="roadPattern" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F1F5F9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* LUSH SCENERY ART ELEMENTS */}
              {/* Forest tree clusters */}
              <g id="trees" className="opacity-60 pointer-events-none select-none">
                {/* Left Top forest */}
                <circle cx="15" cy="35" r="3.5" fill="#52A412" />
                <circle cx="12" cy="38" r="3" fill="#3D7D0B" />
                <circle cx="18" cy="39" r="2.5" fill="#69C01B" />
                <rect x="14" y="38" width="1.5" height="4" fill="#3E2723" />
                <rect x="11.5" y="40" width="1.2" height="3" fill="#3E2723" />

                {/* Right Middle mountains/forest */}
                <polygon points="85,35 91,48 79,48" fill="#4B6336" />
                <polygon points="90,38 95,48 85,48" fill="#3A4D2A" />
                
                {/* Water pond lake in the middle right */}
                <ellipse cx="78" cy="60" rx="9" ry="5" fill="#38BDF8" opacity="0.3" stroke="#0284C7" strokeWidth="0.5" />
                <circle cx="82" cy="58" r="1" fill="#7DD3FC" />
                
                {/* Little flowers & grass spots */}
                <circle cx="25" cy="58" r="0.6" fill="#FB7185" />
                <circle cx="27" cy="59" r="0.6" fill="#FBBF24" />
                <circle cx="48" cy="80" r="0.6" fill="#A78BFA" />
              </g>

              {/* 1. BROAD 3D DIRT ROAD BED (STREET SHELL) */}
              <path
                d="M 14 18 Q 30 14, 50 22 T 86 24 Q 74 44, 52 38 T 16 64 Q 36 72, 60 62 T 92 92"
                fill="none"
                stroke="#475569"
                strokeWidth="8.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.1"
              />
              <path
                d="M 14 18 Q 30 14, 50 22 T 86 24 Q 74 44, 52 38 T 16 64 Q 36 72, 60 62 T 92 92"
                fill="none"
                stroke="url(#roadPattern)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* WOODEN BRIDGE (rendered where the spline crosses over itself near 52, 38) */}
              <g id="bridge" className="opacity-90">
                <rect x="46" y="35" width="12" height="6" rx="1.5" fill="#78350F" transform="rotate(-15 52 38)" stroke="#451A03" strokeWidth="0.8" />
                {/* Horizontal planks */}
                <line x1="48" y1="35" x2="48" y2="41" stroke="#451A03" strokeWidth="0.5" />
                <line x1="51" y1="35" x2="51" y2="41" stroke="#451A03" strokeWidth="0.5" />
                <line x1="54" y1="35" x2="54" y2="41" stroke="#451A03" strokeWidth="0.5" />
                <line x1="57" y1="35" x2="57" y2="41" stroke="#451A03" strokeWidth="0.5" />
              </g>

              {/* 2. THE DYNAMIC MARCHING BYTE PATH (ENERGY WAVE) */}
              <path
                d="M 14 18 Q 30 14, 50 22 T 86 24 Q 74 44, 52 38 T 16 64 Q 36 72, 60 62 T 92 92"
                fill="none"
                stroke="#1E293B"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                className="opacity-20"
              />
              <motion.path
                d="M 14 18 Q 30 14, 50 22 T 86 24 Q 74 44, 52 38 T 16 64 Q 36 72, 60 62 T 92 92"
                fill="none"
                stroke="#78D82A"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 7"
                animate={{ strokeDashoffset: [0, -26] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              />

              {/* Checkered Finish Flag at the last node (92, 92) */}
              <g transform="translate(94, 88)" className="pointer-events-none select-none">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#475569" strokeWidth="0.8" />
                <rect x="0" y="0" width="4.5" height="3" fill="#1e293b" />
                <rect x="1" y="0" width="1.5" height="1.5" fill="#fff" />
                <rect x="2.5" y="1.5" width="1.5" height="1.5" fill="#fff" />
              </g>

              {/* RENDER DYNAMIC ROADMAP NODES WITH SPRING PHYSICS & HAPTICS */}
              {modules.map((mod, index) => {
                const coord = pathCoordinates[index * 2] || pathCoordinates[pathCoordinates.length - 1];
                const status = moduleStatus(mod, index);
                const isCurrent = status === 'unlocked' && (index === modules.length - 1 || moduleStatus(modules[index + 1], index + 1) === 'locked');
                const completion = getModuleCompletionRate(mod);

                let fillGradient = 'url(#lockedNode)';
                let badgeColor = 'bg-slate-400';
                if (status === 'unlocked') {
                  fillGradient = completion.pct === 100 ? 'url(#completedNode)' : 'url(#activeNode)';
                  badgeColor = completion.pct === 100 ? 'bg-[#78D82A]' : 'bg-[#0EA5E9]';
                }

                return (
                  <motion.g
                    key={mod.id}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleNodeClick(mod, index)}
                    onMouseEnter={() => {
                      if (status === 'unlocked') playHapticSound('tick');
                    }}
                    style={{ originX: `${coord.x}px`, originY: `${coord.y}px` }}
                  >
                    {/* Transparent touch/tap target expander for high-precision mobile touch targets */}
                    <circle cx={coord.x} cy={coord.y} r="12" fill="transparent" className="cursor-pointer" />

                    {/* Glowing pulsating outer halo for active module */}
                    {isCurrent && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r="8.5"
                        fill="rgba(14, 165, 233, 0.2)"
                        className="animate-ping"
                      />
                    )}
                    {isCurrent && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r="6.5"
                        fill="none"
                        stroke="#0EA5E9"
                        strokeWidth="0.6"
                        opacity="0.7"
                        className="animate-pulse"
                      />
                    )}

                    {/* 3D Bottom Height Shadow Offset */}
                    <circle
                      cx={coord.x}
                      cy={coord.y + 1.5}
                      r="5"
                      fill="rgba(15, 23, 42, 0.28)"
                    />

                    {/* Main Node Bubble (radial shaded 3D spheres) */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="5"
                      fill={fillGradient}
                      stroke="#1A3D02"
                      strokeWidth="0.8"
                    />

                    {/* Shiny glossy bubble highlight arch */}
                    <path
                      d={`M ${coord.x - 2.8} ${coord.y - 1.2} A 3.2 3.2 0 0 1 ${coord.x + 1.2} ${coord.y - 2.8}`}
                      fill="none"
                      stroke="#fff"
                      strokeWidth="0.6"
                      strokeLinecap="round"
                      opacity="0.6"
                    />

                    {/* Custom badges inside buttons */}
                    {status === 'locked' ? (
                      <g transform={`translate(${coord.x - 1.2}, ${coord.y - 1.2}) scale(0.18)`}>
                        <path d="M12 2C9.24 2 7 4.24 7 7V9H6C4.9 9 4 9.9 4 11V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V11C20 9.9 19.1 9 18 9H17V7C17 4.24 14.76 2 12 2M12 4C13.66 4 15 5.34 15 7V9H9V7C9 5.34 10.34 4 12 4M12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13Z" fill="#1e293b" />
                      </g>
                    ) : completion.pct === 100 ? (
                      <g transform={`translate(${coord.x - 1.3}, ${coord.y - 1.3}) scale(0.19)`}>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FFF" />
                      </g>
                    ) : (
                      /* Big, friendly bold step index number */
                      <text
                        x={coord.x}
                        y={coord.y + 0.8}
                        textAnchor="middle"
                        fontSize="2.8"
                        fill="#FFF"
                        fontWeight="black"
                        className="font-display select-none pointer-events-none drop-shadow-md"
                      >
                        {index + 1}
                      </text>
                    )}

                    {/* Label badge floating above */}
                    <text
                      x={coord.x}
                      y={coord.y - 6.5}
                      textAnchor="middle"
                      fontSize="2.2"
                      fill={status === 'unlocked' ? '#1E293B' : '#94A3B8'}
                      fontWeight="black"
                      className="dark:fill-slate-300 font-display select-none pointer-events-none tracking-wide"
                    >
                      {mod.id.toUpperCase()}
                    </text>
                  </motion.g>
                );
              })}
            </svg>

            {/* FLOATING SLYTHE MASCOT SITTING EXACTLY ABOVE THE CURRENT UNLOCKED NODE */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${activeCoord.x}%`,
                top: `${activeCoord.y}%`,
                transform: 'translate(-50%, -75%)',
                width: '74px',
                height: '74px',
                transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1), top 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 40,
              }}
            >
              <SnakeMascot
                state={mascotState}
                className="w-18 h-18 drop-shadow-lg"
                speakText={snakeMessage || undefined}
              />
            </div>

          </div>

          {/* Interactive footer note */}
          <div className="flex items-center gap-3 justify-center mt-5 bg-white dark:bg-slate-900/40 px-4 py-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
              💡 <span className="text-[#78D82A]">Slythe Kehna Bolta hai:</span> Click on a module node to open lessons and trigger haptic spring feedback!
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: MODULE DETAILS PANEL & LESSON CARD LINKS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {selectedModule ? (
              <motion.div
                key={selectedModule.id}
                id="selected-module-panel"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 20 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-md border-2 border-[#78D82A]/30 flex flex-col gap-5 relative overflow-hidden"
              >
                
                {/* Glowing border accent */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-[#78D82A] to-cyan-400" />

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-mono font-black text-[#59B113] dark:text-[#FFD43B] bg-[#78D82A]/10 dark:bg-yellow-400/10 px-3 py-1 rounded-xl uppercase tracking-wider">
                    {selectedModule.id.toUpperCase()} Checkpoints
                  </span>
                  <button
                    onClick={() => {
                      playHapticSound('tick');
                      setSelectedModule(null);
                    }}
                    className="text-xs font-bold font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    Clear ×
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-black font-display text-slate-950 dark:text-white leading-tight">
                    {selectedModule.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-semibold">
                    {selectedModule.description}
                  </p>
                </div>

                {/* Progress ring/rate indicator */}
                {(() => {
                  const stats = getModuleCompletionRate(selectedModule);
                  return (
                    <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-black text-slate-500 dark:text-slate-400 font-mono mb-2.5">
                        <span>MODULE COMPLETION PROGRESS</span>
                        <span className="text-[#59B113] font-bold">{stats.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="bg-gradient-to-r from-emerald-400 to-[#78D82A] h-full rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block mt-2">
                        {stats.completed} of {stats.total} Lessons Successfully Solved
                      </span>
                    </div>
                  );
                })()}

                {/* Dynamic Springy Lesson Cards */}
                <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {selectedModule.lessons.map((lesson, idx) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isUnlocked = isCompleted || idx === 0 || completedLessons.includes(selectedModule.lessons[idx - 1]?.id);

                    return (
                      <motion.button
                        key={lesson.id}
                        disabled={!isUnlocked}
                        whileHover={isUnlocked ? { scale: 1.02, x: 2 } : {}}
                        whileTap={isUnlocked ? { scale: 0.96 } : {}}
                        onClick={() => {
                          playHapticSound('pop');
                          onSelectLesson(lesson);
                          setMascotState('read_code');
                          setSnakeMessage(`Great! Launching Sandbox: "${lesson.title}"! 🚀`);
                          setTimeout(() => {
                            setMascotState('idle_flick_tongue');
                            setSnakeMessage(null);
                          }, 3000);
                        }}
                        onMouseEnter={() => {
                          if (isUnlocked) playHapticSound('tick');
                        }}
                        id={`lesson_link_${lesson.id}`}
                        className={`text-left p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500/5 dark:bg-emerald-500/5 border-[#78D82A]/30 text-slate-800 dark:text-slate-200 hover:border-[#78D82A]/50'
                            : isUnlocked
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 text-slate-800 dark:text-slate-100 shadow-xs'
                            : 'bg-slate-100/50 dark:bg-slate-900/10 border-slate-200/40 dark:border-slate-800/40 text-slate-400 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                            isCompleted
                              ? 'bg-[#78D82A] text-slate-950'
                              : isUnlocked
                              ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-4.5 h-4.5 stroke-[2.5]" />
                            ) : !isUnlocked ? (
                              <Lock className="w-4.5 h-4.5" />
                            ) : (
                              <Play className="w-4.5 h-4.5 fill-current stroke-none" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 block">Lesson {idx + 1}</span>
                            <h4 className="text-sm font-black font-display leading-tight">{lesson.title}</h4>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-amber-500 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/10">
                          +{lesson.xpReward} XP
                        </span>
                      </motion.button>
                    );
                  })}

                  {/* Module Capstone Project Badge */}
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      playHapticSound('success');
                      onSelectModule(selectedModule);
                      setMascotState('level_up');
                      setSnakeMessage("Wah re wah! Capstone shuru ho raha hai! Dil lagake likhna code! 🏆👑");
                      setTimeout(() => {
                        setMascotState('idle_flick_tongue');
                        setSnakeMessage(null);
                      }, 4000);
                    }}
                    onMouseEnter={() => playHapticSound('tick')}
                    className="mt-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-105 text-slate-950 p-4 rounded-2xl font-black text-sm flex items-center justify-between border-b-4 border-orange-600 transition-all active:translate-y-1 active:border-b-0 cursor-pointer shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-950/10 rounded-xl">
                        <Award className="w-5 h-5 shrink-0 text-slate-950" />
                      </div>
                      <div className="text-left">
                        <span className="text-[9px] uppercase font-bold text-slate-950/70 font-mono block leading-none">Capstone Project</span>
                        <span className="font-display font-extrabold text-xs">{selectedModule.capstone.title}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black bg-slate-950/15 px-2.5 py-0.5 rounded-lg">
                      +{selectedModule.capstone.xpReward} XP
                    </span>
                  </motion.button>

                  {/* SPECIAL GAME ADDITION: Graph Explainer & Dijkstra Game specifically for Module 2 */}
                  {selectedModule.id === 'm2' && (
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        playHapticSound('pop');
                        setShowGraphPlayground(true);
                      }}
                      onMouseEnter={() => playHapticSound('tick')}
                      className="mt-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 hover:brightness-105 text-white p-4 rounded-2xl font-black text-sm flex items-center justify-between border-b-4 border-indigo-850 transition-all active:translate-y-1 active:border-b-0 cursor-pointer shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-xl">
                          <Network className="w-5 h-5 shrink-0 text-white animate-pulse" />
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] uppercase font-bold text-sky-200 font-mono block leading-none">Practice Mini-Game</span>
                          <span className="font-display font-extrabold text-xs">Launch Dijkstra Graph Game</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black bg-white/15 px-2.5 py-0.5 rounded-lg">
                        Play & Learn
                      </span>
                    </motion.button>
                  )}

                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-50 dark:bg-slate-900/30 p-8 py-16 rounded-3xl text-center select-none border-2 border-dashed border-slate-200 dark:border-slate-800"
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                  <Star className="w-7 h-7 text-amber-500 animate-pulse" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white font-display text-lg">No Module Selected</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2.5 max-w-xs mx-auto leading-relaxed">
                  Apne active path par kisi bhi step key milestone (1-6) par click karein to load lesson exercises.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>

      {/* Global Modals container */}
      <AnimatePresence>
        {showGraphPlayground && (
          <GraphPlayground
            onClose={() => setShowGraphPlayground(false)}
            soundEnabled={soundEnabled}
            playHapticSound={playHapticSound}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
