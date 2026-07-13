import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Zap, HelpCircle, MessageSquare, Check, X, ShieldAlert, Sparkles, Send, BookOpen, ArrowRight, Code, BrainCircuit } from 'lucide-react';
import { Exercise, Lesson, SnakeState, Settings as SettingsType } from '../types';
import { fetchHint, type ProviderConfig } from '../utils/api';
import { SnakeMascot } from './SnakeMascot';
import { CodeSandbox } from './CodeSandbox';
import { motion, AnimatePresence } from 'motion/react';
import { LESSON_CONCEPTS, getFallbackConcept, type ConceptDetail } from '../concepts';

interface ExercisePlayerProps {
  lesson: Lesson;
  settings: SettingsType;
  onBack: () => void;
  onLessonComplete: (xpEarned: number) => void;
  userHearts: number;
  onLoseHeart: () => void;
  onGainXP: (amount: number) => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  lesson,
  settings,
  onBack,
  onLessonComplete,
  userHearts,
  onLoseHeart,
  onGainXP,
}) => {
  const [showConceptExplanation, setShowConceptExplanation] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [predictValue, setPredictValue] = useState<string>('');
  const [debugCode, setDebugCode] = useState<string>('');
  const [dragItems, setDragItems] = useState<string[]>([]);
  const [dragSelections, setDragSelections] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotState, setMascotState] = useState<SnakeState>('idle_breathe');
  const [mascotBubble, setMascotBubble] = useState<string>('');

  // AI Hint Modal State
  const [showBhaiModal, setShowBhaiModal] = useState(false);
  const [bhaiQuestion, setBhaiQuestion] = useState('');
  const [bhaiResponse, setBhaiResponse] = useState('');
  const [isBhaiLoading, setIsBhaiLoading] = useState(false);

  // Ask Tutor deep concept learning state
  const [showTutorPanel, setShowTutorPanel] = useState(false);
  const [tutorQuestion, setTutorQuestion] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Duolingo-style haptic feedback
  const playHaptic = (type: 'tick' | 'pop' | 'success' | 'error') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'tick') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'pop') {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
          g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.2);
          o.start(ctx.currentTime + i * 0.05);
          o.stop(ctx.currentTime + i * 0.05 + 0.25);
        });
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      }
      
      if (navigator.vibrate) {
        if (type === 'tick') navigator.vibrate(8);
        else if (type === 'pop') navigator.vibrate([10, 5]);
        else if (type === 'success') navigator.vibrate([15, 10, 15]);
        else if (type === 'error') navigator.vibrate([30, 20]);
      }
    } catch (e) {}
  };

  const exercise = lesson.exercises[currentExerciseIndex];

  // Initialize and load exercise state
  useEffect(() => {
    if (!exercise) return;
    setHasChecked(false);
    setIsCorrect(null);
    setSelectedOption(null);
    setPredictValue('');
    setMascotBubble('');

    setMascotState('read_code');
    const introPhrases = [
      'Chalo bhai, isko milke solve karte hain!',
      'Dekhein tumhari coding skills?',
      'Careful read karna code ko!',
      'Bhai, dhyan se padho is sawal ko.'
    ];
    setMascotBubble(introPhrases[Math.floor(Math.random() * introPhrases.length)]);

    if (exercise.type === 'DEBUG') {
      setDebugCode((exercise as any).buggyCode || '');
    } else if (exercise.type === 'DRAG_DROP') {
      const shuffled = [...(exercise as any).items].sort(() => Math.random() - 0.5);
      setDragItems(shuffled);
      setDragSelections([]);
    }
  }, [currentExerciseIndex, lesson, exercise]);

  // Concept Explanation Hook
  useEffect(() => {
    // Reset back to explanation view whenever lesson changes
    setShowConceptExplanation(true);
  }, [lesson]);

  if (showConceptExplanation) {
    const concept = LESSON_CONCEPTS[lesson.id] || getFallbackConcept(lesson);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 select-none">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Map
          </button>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Step 1: Concept Deep Dive 💡
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Mascot Guidance */}
          <div className="lg:col-span-4 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Your Python Mentor</h4>
            <SnakeMascot state="sparkle_eyes" speakText="Ruko bhai! Pehle dhyan se concept samjho, phir test denge!" className="w-40 h-40" />
            <div className="text-xs text-center text-slate-400 font-medium px-2 py-1 leading-relaxed">
              Coding direct nahi sikhi jaati, pehle logic clear hona zaroori hai!
            </div>
          </div>

          {/* Deep Concept Card Content */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-900 shadow-xl flex flex-col gap-6">
            <div>
              <span className="text-xs font-bold text-emerald-500 uppercase font-mono tracking-widest block mb-1">
                TOPIC CONCEPT
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold font-display text-slate-800 dark:text-white leading-tight">
                {concept.conceptTitle}
              </h2>
            </div>

            {/* Easy Explanation Block */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
              <span className="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-wider block mb-1">
                Aasaan Hinglish Explanation 🗣️
              </span>
              <p className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                {concept.simpleExplanation}
              </p>
            </div>

            {/* Analogy Box */}
            <div className="bg-amber-50/20 dark:bg-amber-950/5 border border-dashed border-amber-500/35 p-5 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-500 font-mono uppercase tracking-wider block mb-1">
                {concept.analogyTitle}
              </span>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {concept.analogyContent}
              </p>
            </div>

            {/* If advance level, display extra help card */}
            {concept.isAdvanceLevel && (
              <div className="bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-500/25 p-4 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed font-medium">
                🚀 <strong>Bhai's Pro Advice:</strong> Jaise-jaise advanced topics aate hain, unhe ratne ki koshish mat karo. Concept ke peeche ka math aur real-world connection dhyan me rakho!
              </div>
            )}

            {/* Code Box Preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
                <Code className="w-4 h-4 text-emerald-500" /> Python Code Example:
              </span>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs md:text-sm shadow-inner overflow-x-auto border border-slate-800 leading-relaxed">
                <code>{concept.pythonExampleCode}</code>
              </pre>
            </div>

            {/* Ask Tutor deep concept button */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => askTutorAI("Bhai is concept ko aur detail me samjhao, aur kya-kya use cases hain iske?")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" /> Aur Deep Samjhao
                </button>
                <button
                  onClick={() => askTutorAI("Bhai is concept ke real-world me kaha-kaha use hota hai? Examples do.")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" /> Real-World Uses
                </button>
                <button
                  onClick={() => askTutorAI("Bhai is concept me common mistakes kya hain jo log karte hain?")}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" /> Common Mistakes
                </button>
                <button
                  onClick={() => {
                    setShowTutorPanel(true);
                    setTutorQuestion('');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Apna Sawaal Pucho
                </button>
              </div>

              {/* Expandable Deep Tutor Panel - flexible height */}
              <AnimatePresence>
                {showTutorPanel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3">
                      {tutorResponse && (
                        <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-100 whitespace-pre-wrap">
                          <div className="font-bold text-xs text-purple-500 mb-2 flex items-center gap-1">
                            <BrainCircuit className="w-3.5 h-3.5" /> SLYTHE BHAI AI TUTOR:
                          </div>
                          {tutorResponse}
                        </div>
                      )}
                      {isTutorLoading && (
                        <div className="flex items-center gap-2 text-xs font-mono text-purple-500 animate-pulse px-2">
                          <Sparkles className="w-4 h-4 animate-spin" /> Bhai soch raha hai... deep explanation taiyaar kar raha hai...
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tutorQuestion}
                          onChange={(e) => setTutorQuestion(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && askTutorAI()}
                          placeholder="Pucho: Bhai ye concept aur kaise samjhu?"
                          className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-slate-800 dark:text-slate-100"
                        />
                        <button
                          onClick={() => askTutorAI()}
                          disabled={isTutorLoading || !tutorQuestion.trim()}
                          className="p-2.5 bg-purple-500 hover:bg-purple-400 text-white rounded-xl transition-all active:scale-95 disabled:bg-slate-300 disabled:text-slate-400 dark:disabled:bg-slate-800 cursor-pointer shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setShowTutorPanel(false); setTutorResponse(''); }}
                          className="p-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl transition-all hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm & Continue button */}
            <button
              onClick={() => {
                setShowConceptExplanation(false);
              }}
              className="mt-2 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-base"
            >
              Bhai, Concept chamak gaya! Ab Test Shuru Karo! <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-3xl shadow-xl mt-10 border border-slate-100 dark:border-slate-880">
        <SnakeMascot state="happy_pop" className="w-40 h-40 mx-auto" />
        <h2 className="text-3xl font-extrabold font-display text-slate-800 dark:text-slate-100 mt-6">Introductory Lesson Cleared!</h2>
        <p className="text-slate-500 mt-2 mb-6">You have gained the structural foundations for this topic.</p>
        <button
          onClick={() => {
            onGainXP(lesson.xpReward);
            onLessonComplete(lesson.xpReward);
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Claim +{lesson.xpReward} XP!
        </button>
      </div>
    );
  }

  const handleOptionSelect = (idx: number) => {
    if (hasChecked) return;
    playHaptic('tick');
    setSelectedOption(idx);
    setMascotState('think_chin_tap');
    setMascotBubble('Hmm, lagta hai tumhein iska jawab pata hai?');
  };

  const handlePredictSelect = (option: string) => {
    if (hasChecked) return;
    playHaptic('tick');
    setPredictValue(option);
    setMascotState('think_chin_tap');
    setMascotBubble('Ye output aayega kya? Socho.');
  };

  const toggleDragItem = (item: string) => {
    if (hasChecked) return;
    playHaptic('tick');
    if (dragSelections.includes(item)) {
      setDragSelections(dragSelections.filter(x => x !== item));
    } else {
      setDragSelections([...dragSelections, item]);
    }
    setMascotState('think_chin_tap');
  };

  const checkAnswer = () => {
    if (hasChecked) return;
    playHaptic('pop');
    let correct = false;

    if (exercise.type === 'MCQ') {
      correct = selectedOption === exercise.correctIndex;
    } else if (exercise.type === 'PREDICT') {
      correct = predictValue === exercise.correctAnswer;
    } else if (exercise.type === 'DRAG_DROP') {
      correct = JSON.stringify(dragSelections) === JSON.stringify(exercise.correctOrder);
    } else if (exercise.type === 'DEBUG') {
      const cleanUser = debugCode.replace(/\s+/g, '');
      const cleanTarget = exercise.correctCode.replace(/\s+/g, '');
      correct = cleanUser === cleanTarget;
    }

    evaluateCheckResult(correct);
  };

  const evaluateCheckResult = (correct: boolean) => {
    setHasChecked(true);
    setIsCorrect(correct);

    if (correct) {
      setMascotState('celebrate_jump');
      const correctPhrases = [
        'Kya baat hai bhai! Shabaash!',
        'Ekdum sahi! Tum toh pro ban rahe ho.',
        'Sahi jawab! Agle pe chalo!',
        'Perfect strike! Bhai khush hua!'
      ];
      setMascotBubble(correctPhrases[Math.floor(Math.random() * correctPhrases.length)]);
      onGainXP(exercise.points);
    } else {
      setMascotState('sad_but_supportive');
      const failPhrases = [
        'Arre yaar, galat ho gaya. Koi baat nahi, seekho!',
        'Bhai, thodi si galti ho gayi. Hint dekh lo!',
        'Phas gaye na? Chinta mat karo!',
        'Bhai, dhyan se check karo loop variables!'
      ];
      setMascotBubble(failPhrases[Math.floor(Math.random() * failPhrases.length)]);
      onLoseHeart();
    }
  };

  const handleCodeRunComplete = (output: string, success: boolean) => {
    if (hasChecked) return;
    evaluateCheckResult(success);
  };

  const advanceExercise = () => {
    playHaptic('success');
    if (currentExerciseIndex + 1 < lesson.exercises.length) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      onLessonComplete(lesson.xpReward);
    }
  };

  const askBhaiAI = async () => {
    playHaptic('pop');
    if (!bhaiQuestion.trim()) return;
    setIsBhaiLoading(true);
    setBhaiResponse('');

    const provider = settings?.aiProvider || 'gemini';
    const keyField = `${provider}ApiKey`;
    const urlField = `${provider}BaseUrl`;
    const userApiKey = (settings as any)?.[keyField] || '';
    const userBaseUrl = (settings as any)?.[urlField] || '';
    const selectedModel = settings?.selectedModel;

    if (!userApiKey && provider !== 'gemini') {
      setBhaiResponse("Arre bhai! Settings mein API Key toh daal pehle! Bina key ke main kaise help karunga?");
      setIsBhaiLoading(false);
      return;
    }

    try {
      const providerConfig: ProviderConfig = {
        aiProvider: provider,
        apiKey: userApiKey,
        baseUrl: userBaseUrl,
        selectedModel,
      };

      const exerciseContext = {
        question: exercise.question,
        hint: exercise.romanHindiHint,
        code: (exercise as any).code || (exercise as any).buggyCode || ''
      };

      const answer = await fetchHint(bhaiQuestion, exerciseContext, providerConfig);
      setBhaiResponse(answer);
    } catch (err: any) {
      setBhaiResponse(err.message || 'Arre bhai! Tera API Key configure nahi hai, ya network slow hai! Setting menu me Secrets check kar. Tab tak dhyan se check karo local hint ko, tum kar loge!');
    } finally {
      setIsBhaiLoading(false);
    }
  };

  const askTutorAI = async (customPrompt?: string) => {
    const queryText = customPrompt || tutorQuestion;
    if (!queryText.trim()) return;
    setShowTutorPanel(true);
    setIsTutorLoading(true);
    if (!customPrompt) setTutorQuestion('');

    const provider = settings?.aiProvider || 'gemini';
    const keyField = `${provider}ApiKey`;
    const urlField = `${provider}BaseUrl`;
    const userApiKey = (settings as any)?.[keyField] || '';
    const userBaseUrl = (settings as any)?.[urlField] || '';
    const selectedModel = settings?.selectedModel;

    if (!userApiKey) {
      setTutorResponse("Arre bhai! Settings mein API Key toh daal pehle! Bina key ke main kaise deep concept sikhaunga?");
      setIsTutorLoading(false);
      return;
    }

    const concept = LESSON_CONCEPTS[lesson.id] || getFallbackConcept(lesson);
    const deepTutorPrompt = `
You are Slythe Bhai, an expert Python & AI/ML tutor for PyDuo platform.
The student is currently studying the concept: "${lesson.title}".
Concept Title: "${concept.conceptTitle}"
Concept Explanation: "${concept.simpleExplanation}"
Analogy: "${concept.analogyTitle}" - "${concept.analogyContent}"

Student's question: "${queryText}"

CRITICAL INSTRUCTIONS:
1. Speak EXCLUSIVELY in friendly Roman Hindi (Hindi in Latin script).
2. Explain deeply but in simple terms. Use real-world analogies.
3. Be encouraging - use phrases like "Arre bhai!", "Dekho", "Samjho".
4. If the student asks for more depth, provide step-by-step breakdown.
5. Keep response thorough but under 200 words. Use code examples if helpful.
`;

    try {
      const providerConfig: ProviderConfig = {
        aiProvider: provider,
        apiKey: userApiKey,
        baseUrl: userBaseUrl,
        selectedModel,
      };

      const exerciseContext = {
        question: lesson.title,
        hint: concept.simpleExplanation,
        code: concept.pythonExampleCode,
      };

      const answer = await fetchHint(queryText, exerciseContext, providerConfig);
      setTutorResponse(answer);
    } catch (err: any) {
      setTutorResponse(err.message || 'Arre bhai! API Key ya network me issue hai. Setting check karo!');
    } finally {
      setIsTutorLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Exercise Player Header */}
      <div className="flex items-center justify-between mb-6 select-none">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>

        {/* Lesson Progress Bar */}
        <div className="flex-1 max-w-md mx-6 bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentExerciseIndex) / lesson.exercises.length) * 100}%` }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-bold text-amber-500 font-mono">
            <Zap className="w-4 h-4 fill-current animate-pulse" /> {exercise.points} XP
          </span>
          <span className="flex items-center gap-1 font-extrabold text-rose-500 font-mono">
            <Heart className="w-4.5 h-4.5 fill-current" /> {userHearts}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Mascot Interactivity */}
        <div className="lg:col-span-3 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-850">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Your Python Coach</h4>
          <SnakeMascot state={mascotState} speakText={mascotBubble} className="w-40 h-40" />
          <button
            onClick={() => {
              setShowBhaiModal(true);
              setBhaiResponse('');
              setBhaiQuestion('');
            }}
            className="flex items-center gap-2 bouncy-btn-yellow font-black px-4 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" /> Ask Bhai (AI Tutor)
          </button>
        </div>

        {/* Right Column: Exercise Core Gameplay */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-900 shadow-sm flex flex-col min-h-[460px]">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest mb-1 block">
            Exercise {currentExerciseIndex + 1} of {lesson.exercises.length} — {exercise.type}
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold font-display text-slate-800 dark:text-slate-100 mb-6 leading-snug">
            {exercise.question}
          </h3>

          {/* Render gameplay based on type */}
          <div className="flex-1 mb-8">
            {exercise.type === 'MCQ' && (
              <div className="flex flex-col gap-3">
                {exercise.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={hasChecked}
                      whileTap={{ scale: 0.98 }}
                      id={`option_button_${idx}`}
                      className={`text-left p-4.5 rounded-2xl border-2 border-b-4 font-bold text-base transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#58CC02] bg-emerald-50/10 dark:bg-emerald-950/20 text-[#58CC02]'
                          : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {exercise.type === 'PREDICT' && (
              <div className="flex flex-col gap-6">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-sm shadow-inner overflow-x-auto border border-slate-800">
                  <code>{exercise.code}</code>
                </pre>
                <div className="flex flex-col gap-3">
                  {exercise.options.map((opt, idx) => {
                    const isSelected = predictValue === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePredictSelect(opt)}
                        disabled={hasChecked}
                        id={`predict_button_${idx}`}
                        className={`text-left p-4.5 rounded-2xl border-2 border-b-4 font-bold text-base transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#58CC02] bg-emerald-50/10 dark:bg-emerald-950/20 text-[#58CC02]'
                            : 'border-slate-200 dark:border-slate-800 border-b-slate-300 dark:border-b-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-slate-950" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {exercise.type === 'DEBUG' && (
              <div className="flex flex-col gap-4">
                <span className="text-xs text-slate-400 font-mono">Instructions: {exercise.instructions}</span>
                <textarea
                  value={debugCode}
                  onChange={(e) => setDebugCode(e.target.value)}
                  disabled={hasChecked}
                  className="w-full h-40 p-4 bg-slate-900 text-emerald-400 font-mono text-sm rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/30 border border-slate-800"
                  spellCheck={false}
                />
              </div>
            )}

            {exercise.type === 'DRAG_DROP' && (
              <div className="flex flex-col gap-6 select-none">
                <span className="text-xs text-slate-400 font-mono">Click code blocks below to arrange them in order:</span>

                {/* Destination area */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl min-h-[100px] flex flex-col gap-2">
                  {dragSelections.length === 0 ? (
                    <span className="text-slate-400 text-sm italic m-auto">Arrange code block flow here...</span>
                  ) : (
                    dragSelections.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleDragItem(item)}
                        className="bg-slate-900 text-slate-100 p-3.5 rounded-xl border border-slate-800 font-mono text-xs shadow-sm flex items-center justify-between cursor-pointer hover:bg-rose-950/20 hover:border-rose-900/30 transition-all group"
                      >
                        <span>{item}</span>
                        <X className="w-3.5 h-3.5 text-rose-500 group-hover:block hidden" />
                      </div>
                    ))
                  )}
                </div>

                {/* Available items bucket */}
                <div className="flex flex-wrap gap-2">
                  {dragItems.map((item, idx) => {
                    const isSelected = dragSelections.includes(item);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleDragItem(item)}
                        disabled={isSelected || hasChecked}
                        id={`drag_item_${idx}`}
                        className={`p-3.5 rounded-xl font-mono text-xs border transition-all ${
                          isSelected
                            ? 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-dashed border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-50'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm cursor-pointer'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {exercise.type === 'CODE' && (
              <CodeSandbox
                initialCode={exercise.initialCode}
                testCases={exercise.testCases}
                onRunComplete={handleCodeRunComplete}
                solutionCode={exercise.solutionCode}
              />
            )}
          </div>

          {/* Action Footer Drawer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-900/60 pt-6">
            <div>
              {hasChecked && isCorrect !== null && (
                <div className="flex items-center gap-2 font-display select-none">
                  {isCorrect ? (
                    <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-lg">
                      <Check className="w-5 h-5 font-bold animate-bounce" /> Correct answer!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-rose-500 font-bold text-lg">
                      <X className="w-5 h-5 font-bold animate-shake" /> Incorrect response
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              {!hasChecked && exercise.type !== 'CODE' && (
                <button
                  onClick={checkAnswer}
                  disabled={
                    (exercise.type === 'MCQ' && selectedOption === null) ||
                    (exercise.type === 'PREDICT' && !predictValue) ||
                    (exercise.type === 'DRAG_DROP' && dragSelections.length === 0)
                  }
                  id="check_answer_button"
                  className={`w-full sm:w-auto font-black text-sm px-8 py-3.5 rounded-2xl cursor-pointer ${
                    (exercise.type === 'MCQ' && selectedOption === null) ||
                    (exercise.type === 'PREDICT' && !predictValue) ||
                    (exercise.type === 'DRAG_DROP' && dragSelections.length === 0)
                      ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 border-2 border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-60'
                      : 'bouncy-btn-green'
                  }`}
                >
                  Check Answer
                </button>
              )}

              {hasChecked && (
                <button
                  onClick={advanceExercise}
                  id="next_exercise_button"
                  className="w-full sm:w-auto bouncy-btn-green font-black text-sm px-8 py-3.5 rounded-2xl cursor-pointer"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Bhai Hint Modal Popup Drawer */}
      <AnimatePresence>
        {showBhaiModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-880 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-amber-400 text-amber-950 px-6 py-4 flex items-center justify-between border-b border-amber-500/20 select-none">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐍</span>
                  <span className="font-extrabold font-display tracking-tight">Ask Bhai (AI Coding Mentor)</span>
                </div>
                <button
                  onClick={() => setShowBhaiModal(false)}
                  className="p-1 hover:bg-amber-500 rounded-lg transition-colors text-amber-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5 select-text">
                {/* Standard Hint Block */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono uppercase block mb-1">Local Hint (Roman Hindi)</span>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200 leading-relaxed">
                    "{exercise.romanHindiHint}"
                  </p>
                </div>

                {/* AI Explanation Sandbox */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
                    <MessageSquare className="w-4 h-4 text-emerald-500" /> Live AI Ask Session
                  </div>

                  {bhaiResponse ? (
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-100 max-h-[400px] overflow-y-auto">
                      <div className="font-bold text-xs text-emerald-500 mb-1">BHAI AI ({settings?.aiProvider?.toUpperCase() || 'GEMINI'}):</div>
                      <p className="whitespace-pre-wrap break-words">{bhaiResponse}</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs italic py-6 select-none">
                      Kuch samajh nahi aaya? Bhai se Roman Hindi me pucho! e.g. "Loop kab use karte hain?"
                    </div>
                  )}

                  {isBhaiLoading && (
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 animate-pulse select-none">
                      <Sparkles className="w-4 h-4 animate-spin" /> Bhai soch raha hai... "Chinta mat kar..."
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Form Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2">
                <input
                  type="text"
                  value={bhaiQuestion}
                  onChange={(e) => setBhaiQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askBhaiAI()}
                  placeholder='Pucho: "Bhai variable kya hota hai?"'
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={askBhaiAI}
                  disabled={isBhaiLoading || !bhaiQuestion.trim()}
                  id="send_bhai_question_button"
                  className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl shadow transition-transform active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
