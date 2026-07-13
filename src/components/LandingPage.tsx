import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, Brain, Code, Network, Terminal, Shield, ArrowRight, Star, GraduationCap, Flame, Cpu, Settings as SettingsIcon } from 'lucide-react';
import { SnakeMascot } from './SnakeMascot';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onStartLearning: () => void;
  onGoToProfile?: () => void;
  onGoToSettings?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartLearning,
  onGoToProfile,
  onGoToSettings
}) => {
  const [selectedTimelineYear, setSelectedTimelineYear] = useState<number>(2026);
  const [activeProjectHover, setActiveProjectHover] = useState<number | null>(null);

  // Future AI/ML predictions timeline data
  const timelineData = [
    {
      year: 2024,
      title: 'LLM Foundations & RAG',
      desc: 'Retrieval Augmented Generation becomes the enterprise standard. Python programmers orchestrate basic database links.',
      prediction: 'Models scale to 1M+ context size. Prompt engineering starts shifting into code orchestration layers.',
      mascotState: 'read_code' as const,
      bubble: 'Bhai, API keys lagao aur context fetch karo!'
    },
    {
      year: 2026,
      title: 'Multimodal Edge & Real-time Live API',
      desc: 'AI models process real-time PCM audio, video, and text simultaneously at sub-100ms latency. Models run offline inside web workers.',
      prediction: 'Local WASM model inference dominates client devices. Developers orchestrate native speech translations.',
      mascotState: 'lightbulb_moment' as const,
      bubble: 'Local Pyodide WASM runtime is real! Offline compilation ready.'
    },
    {
      year: 2028,
      title: 'Autonomous Multi-Agent Swarms',
      desc: 'Hierarchical planning agents self-correct, write and run their own sandboxed Python unit tests, and deploy microservices.',
      prediction: 'Software engineering transforms into managing agent fleets. Graph routing algorithms become standard APM metrics.',
      mascotState: 'debug_detective' as const,
      bubble: 'Swarms are self-debugging! Let them run network analysis.'
    },
    {
      year: 2030,
      title: 'AGI Co-Piloting & Custom Synapse Layers',
      desc: 'Direct text-to-hardware compilers. Quantum neural arrays are simulated using Python micrograd modules.',
      prediction: 'Every user has a personalized localized fine-tuned model swarm running on 1W ambient silicon.',
      mascotState: 'level_up' as const,
      bubble: 'Bhai, we reached level AGI! Let\'s build the future.'
    },
  ];

  const capstoneProjects = [
    {
      id: 1,
      title: 'CLI Text Adventure',
      module: 'Module 1',
      icon: Terminal,
      desc: 'A pure Python game loop leveraging State Machines, OOP hierarchy and local JSON storage.',
      hoverMockup: '>>> hero.hp = 100\n>>> hero.attack()\n"Hero deals 15 damage! Goblins defeated."'
    },
    {
      id: 2,
      title: 'Social Graph Path Analyzer',
      module: 'Module 2',
      icon: Network,
      desc: 'Model paths and connectivity indexes across a massive 100k+ node NetworkX simulated graph dataset.',
      hoverMockup: 'Generating Graph nodes...\nRunning PageRank...\nNode 42 weight: 0.0825 (Most Influential)'
    },
    {
      id: 3,
      title: 'FastAPI Microservice Container',
      module: 'Module 3',
      icon: Cpu,
      desc: 'A robust production async FastAPI microservice container with custom Docker layers and Pytest suites.',
      hoverMockup: 'INFO:     Uvicorn running on http://0.0.0.0:3000\nGET /api/health  200 OK  [0.85ms]'
    },
    {
      id: 4,
      title: 'Analytical Plotly Dashboard',
      module: 'Module 4',
      icon: BookOpen,
      desc: 'Interactive Pandas parsing with cache tags and real-time streaming charts using WebSockets.',
      hoverMockup: 'Pandas Dataframe: 10,000 rows\nPlotting correlation matrix...\nRendering Plotly React element...'
    },
    {
      id: 5,
      title: 'MLOps Predictive Pipeline',
      module: 'Module 5',
      icon: Brain,
      desc: 'XGBoost training loops with MLflow parameters tracking, served on FastAPI with drift checking.',
      hoverMockup: 'Model: XGBoostRegressor\nMSE: 0.0234\nWARNING: Feature "Age" is drifting by 15.4%!'
    },
    {
      id: 6,
      title: 'Custom RAG Hybrid AI Assistant',
      module: 'Module 6',
      icon: Sparkles,
      desc: 'Custom attention layers with PyTorch micrograd from scratch, LoRA adaptation weights and vector hybrid search.',
      hoverMockup: 'Embedding prompt...\nCosine similarity match: 0.982\nGuardrail: Safe content confirmed.'
    }
  ];

  const selectedYearObj = timelineData.find(t => t.year === selectedTimelineYear) || timelineData[1];

  return (
    <div className="bg-[#fcfdfd] dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans selection:bg-emerald-500/20">
      
      {/* Navigation Header */}
      <header className="border-b-2 border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-pulse">🐍</span>
            <span className="font-extrabold font-display text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              PyDuo <span className="text-xs bg-brand-blue/10 text-[#306998] dark:text-[#FFD43B] border border-brand-blue/20 px-2 py-0.5 rounded-full font-mono font-bold">AI/ML</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {onGoToProfile && (
              <button
                onClick={onGoToProfile}
                id="header_profile_button"
                className="text-slate-600 hover:text-[#306998] dark:text-slate-400 dark:hover:text-[#FFD43B] font-extrabold text-sm transition-colors cursor-pointer"
              >
                My Profile
              </button>
            )}
            {onGoToSettings && (
              <button
                onClick={onGoToSettings}
                id="header_settings_button"
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                title="Settings"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onStartLearning}
              id="header_learn_button"
              className="bouncy-btn-green font-black text-sm px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-28 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Callout */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-[#306998] dark:text-[#FFD43B] border-2 border-[#306998]/20 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase font-mono">
              <Star className="w-3.5 h-3.5 fill-current" /> offline-first learning platform
            </div>

            <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-none">
              Learn Python to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#306998] via-indigo-600 to-[#58CC02]">
                Deep Learning & AI
              </span> <br />
              Like a Game!
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
              An interactive, gamified journey crafted for AI/ML engineers. Works 100% offline inside your browser using Pyodide WASM. Code, compile, earn XP, maintain daily streaks, and learn with your custom Roman Hindi AI guide!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={onStartLearning}
                id="hero_start_button"
                className="flex items-center justify-center gap-2 bouncy-btn-green font-black text-base px-8 py-4 rounded-2xl cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" /> Start Learning Now
              </button>
              <a
                href="#roadmap"
                className="flex items-center justify-center gap-1.5 bouncy-btn-slate font-black text-base px-8 py-4 rounded-2xl cursor-pointer"
              >
                Explore Syllabus <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap gap-6 items-center border-t border-slate-100 dark:border-slate-900 pt-8 mt-4 w-full">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl font-mono text-slate-900 dark:text-white">66</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Lessons</span>
              </div>
              <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl font-mono text-slate-900 dark:text-white">6</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Capstone Projects</span>
              </div>
              <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl font-mono text-slate-900 dark:text-white">100%</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">In-Browser Compilation</span>
              </div>
            </div>
          </div>

          {/* Hero Right Interactive Mascot Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative high-density-card bg-slate-50 dark:bg-slate-900/40 p-8 w-full max-w-sm flex flex-col items-center shadow-md group">
              <div className="absolute top-4 right-4 bg-emerald-500/15 text-[#58CC02] dark:text-[#FFD43B] text-[10px] font-extrabold px-3 py-1 rounded-full font-mono border border-emerald-500/20">
                ACTIVE COACH
              </div>
              <SnakeMascot state="idle_flick_tongue" speakText="Bhai, coding seekhni hai toh bina darre shuru karo!" className="w-56 h-56" />
              <div className="mt-4 text-center">
                <span className="font-black text-sm text-slate-900 dark:text-white font-display block">Slythe the Python</span>
                <span className="text-xs text-slate-400 font-medium block mt-0.5">He reacts to your answers & errors!</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ROADMAP SECTION */}
      <section id="roadmap" className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-100 dark:border-slate-900/60 select-none">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
              The 6-Step AI Engineer Path
            </h2>
            <p className="text-slate-500 mt-2">
              From declaring your first variable, to writing transformer attention heads and multi-agent system tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Python Core',
                subtitle: '12 lessons → CLI Text Adventure',
                desc: 'Variables, loops, arrays, OOP paradigm, file serialization, exceptions, and unit testing.',
                tag: 'Beginner',
                color: 'from-blue-500/10 to-indigo-500/10'
              },
              {
                step: '02',
                title: 'Data Structures & Algorithms',
                subtitle: '10 lessons → Graph Analyzer',
                desc: 'BST recursively, stacks, O(N) complexity evaluation, networks modeling and PageRank mapping.',
                tag: 'Intermediate',
                color: 'from-indigo-500/10 to-violet-500/10'
              },
              {
                step: '03',
                title: 'Python Pro Toolkit',
                subtitle: '10 lessons → FastAPI Microservice',
                desc: 'Concurrency with asyncio, decorators wrapping, static type checking, context managers and Docker bundling.',
                tag: 'Pro',
                color: 'from-violet-500/10 to-fuchsia-500/10'
              },
              {
                step: '04',
                title: 'Data Science & Visualizations',
                subtitle: '10 lessons → Real-time Dashboard',
                desc: 'Pandas dataframes indices, NumPy math grids, Seaborn plots, Streamlit interfaces, memory caches.',
                tag: 'Analyst',
                color: 'from-fuchsia-500/10 to-pink-500/10'
              },
              {
                step: '05',
                title: 'ML Fundamentals & MLOps',
                subtitle: '12 lessons → End-to-End MLOps Pipeline',
                desc: 'Supervised loss scales, XGBoost boosting models, hyper-tracking MLflow, drift telemetry monitoring.',
                tag: 'Scientist',
                color: 'from-pink-500/10 to-rose-500/10'
              },
              {
                step: '06',
                title: 'Deep Learning & Gen AI',
                subtitle: '12 lessons → Custom AI Assistant',
                desc: 'Micrograd backwards calculus, transformers matrix weights, LoRA fine-tuning, RAG hybrid routing.',
                tag: 'AI Architect',
                color: 'from-rose-500/10 to-emerald-500/10'
              }
            ].map((m, idx) => (
              <div
                key={idx}
                onClick={onStartLearning}
                id={`landing_module_card_${idx}`}
                className="bg-white dark:bg-slate-900/60 p-6 high-density-card flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-emerald-500/40 border-2 border-slate-200/50 dark:border-slate-800/80 transition-all relative overflow-hidden group hover:-translate-y-1 cursor-pointer select-none"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${m.color} rounded-bl-full opacity-40 group-hover:scale-110 transition-transform`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-extrabold text-slate-300 dark:text-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      MODULE {m.step}
                    </span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold font-display text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                    {m.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono font-medium mt-1 block">
                    {m.subtitle}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FUTURE TIMELINE (2024-2030) */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 select-none">
          <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Time-Travel Engine
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
            AI Predictions Future Deck
          </h2>
          <p className="text-slate-500 mt-2">
            Slide through predicted years to see how Python orchestrations will rule future AGI swarm environments.
          </p>
        </div>

        {/* Timeline Slider selector */}
        <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Year selector controls */}
          <div className="lg:col-span-4 flex flex-col gap-3 select-none">
            {timelineData.map((t) => (
              <button
                key={t.year}
                onClick={() => setSelectedTimelineYear(t.year)}
                id={`timeline_year_${t.year}`}
                className={`text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  selectedTimelineYear === t.year
                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-md scale-102 font-extrabold text-slate-900 dark:text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white font-medium'
                }`}
              >
                <span className="font-mono text-lg">{t.year} Predictions</span>
                {selectedTimelineYear === t.year && <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>}
              </button>
            ))}
          </div>

          {/* Interactive display */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Predictions Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTimelineYear}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4 select-text"
              >
                <span className="text-emerald-500 font-mono text-xs font-bold tracking-widest uppercase">
                  {selectedYearObj.title}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight font-display">
                  Where Python Meets {selectedTimelineYear}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {selectedYearObj.desc}
                </p>
                <div className="bg-emerald-500/5 border-l-4 border-emerald-500 p-4.5 rounded-r-2xl">
                  <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 font-mono block mb-1">Key Prediction</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
                    "{selectedYearObj.prediction}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Simulated Mascot with costume based on Year */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-900 flex justify-center shadow-inner relative h-64 select-none">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTimelineYear}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full flex justify-center"
                >
                  <SnakeMascot
                    state={selectedYearObj.mascotState}
                    speakText={selectedYearObj.bubble}
                    className="w-48 h-48 m-auto"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 4. PROJECT SHOWCASE */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-100 dark:border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 select-none">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">
              6 Real-world Capstone Projects
            </h2>
            <p className="text-slate-500 mt-2">
              No toy tutorials. Every module culminates in a production-ready repository you build entirely in-browser.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* List of projects */}
            <div className="lg:col-span-6 flex flex-col gap-3 select-none">
              {capstoneProjects.map((p, idx) => {
                const isHovered = activeProjectHover === idx;
                const IconComp = p.icon;
                return (
                  <div
                    key={p.id}
                    onMouseEnter={() => setActiveProjectHover(idx)}
                    onMouseLeave={() => setActiveProjectHover(null)}
                    className={`p-4.5 high-density-card transition-all flex items-start gap-4 cursor-pointer ${
                      isHovered
                        ? 'border-[#58CC02] dark:border-[#FFD43B] bg-white dark:bg-slate-900 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white/40 hover:bg-white dark:bg-slate-950/40 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${isHovered ? 'bg-[#58CC02] text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{p.module}</span>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                        <span className="text-xs font-bold text-emerald-500">Capstone</span>
                      </div>
                      <h4 className="font-extrabold font-display text-slate-900 dark:text-white mt-0.5">{p.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Terminal preview panel */}
            <div className="lg:col-span-6 flex flex-col justify-center select-text">
              <div className="bg-slate-950 text-slate-100 p-6 high-density-card shadow-2xl h-full flex flex-col justify-between min-h-[300px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
                    <span className="text-slate-500 font-mono text-[10px] ml-1.5">capstone_mockup.log</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/20">WASM RUNNER</span>
                </div>

                <div className="font-mono text-xs leading-relaxed flex-1 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProjectHover ?? 'default'}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="whitespace-pre-wrap text-emerald-400"
                    >
                      {activeProjectHover !== null ? (
                        capstoneProjects[activeProjectHover].hoverMockup
                      ) : (
                        <span className="text-slate-500 italic">
                          Hover over any capstone project card to compile and preview telemetry console logs in real time...
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="text-[10px] text-slate-600 font-mono border-t border-slate-900/60 pt-3 mt-4 select-none flex items-center justify-between">
                  <span>System: WASM Web Sandbox Core</span>
                  <span>Port: 3000 (Local Dev)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION & XP COUNTER */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center select-none">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center gap-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
          
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase">
            <Flame className="w-4 h-4 animate-pulse fill-current" /> free, open source & forever self-contained
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight max-w-2xl">
            Ready to become a certified AI/ML Engineer?
          </h2>

          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            Join Slythe today! Complete 66 byte-sized lessons, run and compile real Python in-browser, build 6 extensive capstone systems and dominate leaderboards.
          </p>

          <button
            onClick={onStartLearning}
            id="cta_enroll_button"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base px-10 py-4.5 rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer mt-2"
          >
            Launch Free Sandbox
          </button>

          {/* User Trust Banner */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium pt-6 border-t border-slate-800 mt-4 w-full">
            <span>✓ Works completely offline</span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
            <span>✓ 100% Client-side sandbox</span>
            <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
            <span>✓ Custom Roman Hindi hints</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900 py-8 text-center text-xs text-slate-400 select-none">
        <p>© {new Date().getFullYear()} PyDuo Learning Platform. All rights reserved. Made for future AI Pioneers.</p>
      </footer>

    </div>
  );
};
