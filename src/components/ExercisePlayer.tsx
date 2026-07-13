import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Zap, HelpCircle, MessageSquare, Check, X, ShieldAlert, Sparkles, Send, BookOpen, ArrowRight, Code } from 'lucide-react';
import { Exercise, Lesson, SnakeState, Settings as SettingsType } from '../types';
import { SnakeMascot } from './SnakeMascot';
import { CodeSandbox } from './CodeSandbox';
import { motion, AnimatePresence } from 'motion/react';

interface ExercisePlayerProps {
  lesson: Lesson;
  settings: SettingsType;
  onBack: () => void;
  onLessonComplete: (xpEarned: number) => void;
  userHearts: number;
  onLoseHeart: () => void;
  onGainXP: (amount: number) => void;
}

interface ConceptDetail {
  conceptTitle: string;
  simpleExplanation: string;
  analogyTitle: string;
  analogyContent: string;
  pythonExampleCode: string;
  isAdvanceLevel: boolean;
}

const LESSON_CONCEPTS: Record<string, ConceptDetail> = {
  'm1-l1': {
    conceptTitle: 'Variables & Data Types (Computer ke storage dabbe!)',
    simpleExplanation: 'Bhai, variables aur kuch nahi balki computer memory me bane chote dabbe (boxes) hote hain jahan tum apna data store karte ho. Jaise kitchen me dabbe par "Namkeen" likha hota hai aur andar Sev hoti hai, waise hi programming me variables hote hain!',
    analogyTitle: 'Kitchen Dabba Analogy 🍱',
    analogyContent: 'Dabbe ka naam hai: x, aur andar rakha hai number 5. Python me isko simple x = 5 likhte hain. Tumhe C++ ya Java ki tarah "int x = 5" nahi likhna padta! Python intelligent hai, wo apne aap samajh jata hai!',
    pythonExampleCode: `# Simple assignment in Python
namkeen = "Sev" # String dabba
age = 18       # Integer dabba
height = 5.9   # Float dabba

print(namkeen) # Prints: Sev
print(age)     # Prints: 18`,
    isAdvanceLevel: false,
  },
  'm1-l2': {
    conceptTitle: 'If-Else & Loops (Decisions & Repeat!)',
    simpleExplanation: 'If-Else se hum decision lete hain, jaise: "Agar dhoop hai toh sunglasses pehno, nahi toh simple chashma". Aur Loops ka matlab hai ek hi kaam ko baar-baar repeat karna jab tak ki koi condition poori na ho jaye!',
    analogyTitle: 'Traffic Signal & Roti Belna 🚦',
    analogyContent: 'If-Else is like: Signal agar RED hai toh ruko, GREEN hai toh jao! Loop is like: Jab tak mummy ne 5 chapatis nahi banayi, tab tak roti belte raho! Python me loop for aur while se chalti hai.',
    pythonExampleCode: `# Decision Making (If-Else)
traffic_light = "GREEN"
if traffic_light == "RED":
    print("Ruko bhai!")
else:
    print("Chalo bhai! Green light hai!")

# Looping 5 times (For Loop)
for roti in range(1, 6):
    print(f"Roti number {roti} ban gayi!")`,
    isAdvanceLevel: false,
  },
  'm2-l1': {
    conceptTitle: 'Big-O Notation & Complexity (Speedometer!)',
    simpleExplanation: 'Big-O humein batata hai ki jaise-jaise tumhare input ka size (N) badhega, tumhara code kitna slow hoga ya kitni memory lega. Ye kisi algorithm ki efficiency napne ka global standard hai!',
    analogyTitle: 'Dost ko dhoondna 🔍',
    analogyContent: 'Agar tum 10 logo ki line me se kisi dost ko ek-ek karke dhoondo, toh maximum 10 baar check karna padega (Linear Time O(N)). Par agar 1 lakh log hon aur koi rule na ho, toh bahut der lagegi! Big-O is speed ko math formulas me likhta hai!',
    pythonExampleCode: `# O(1) Constant Time - Instant speed!
def get_first_item(lst):
    return lst[0] # Hamesha instant!

# O(N) Linear Time - Takes N steps
def search_item(lst, target):
    for item in lst:
        if item == target:
            return True
    return False`,
    isAdvanceLevel: true,
  },
  'm3-l1': {
    conceptTitle: 'Python Decorators (Gift Wrapping 🎁)',
    simpleExplanation: 'Decorators ek function ke behavior ko dynamically modify karne ke kaam aate hain bina uske original code ko touch kiye! Jaise tum ek chocolate box ko gift wrap karke extra premium bana dete ho!',
    analogyTitle: 'Gift Wrapper & Ribbon 🎀',
    analogyContent: 'Chocolate box ke upar shinny sheet lagayi, ribbon lagaya, ab wo normal chocolate se "Gift Box" ban gaya! Python me hum wraps use karte hain, jo \`@decorator_name\` likh ke lagaya jata hai!',
    pythonExampleCode: `# Simple Decorator function
def double_it(func):
    def wrapper():
        result = func()
        return result * 2
    return wrapper

@double_it
def get_number():
    return 10 # Returns 10

print(get_number()) # Prints: 20!`,
    isAdvanceLevel: true,
  },
  'm4-l1': {
    conceptTitle: 'NumPy Arrays & Linear Algebra (Egg Trays 🥚)',
    simpleExplanation: 'Python list thodi slow hoti hai kyunki wo memory me bikhri hoti hai. NumPy Arrays super-fast hote hain kyunki ye C language par base hain aur continuous block me data save karte hain!',
    analogyTitle: 'Individual boxes vs Egg Tray 🥚',
    analogyContent: 'Agar tum 30 ando ko alag-alag chote dabbo me rakho toh manage karna slow hoga. Par ek continuous egg tray me 30 ande ek sath rakh do toh ek baar me safely utha sakte ho! NumPy is that tray!',
    pythonExampleCode: `import numpy as np

# Creating an optimized vector array
arr = np.array([1, 2, 3])
print(arr * 2) # Prints: [2 4 6] - instantly!

# Matrix of zeroes
zero_grid = np.zeros((3, 3))
print(zero_grid)`,
    isAdvanceLevel: true,
  },
  'm5-l1': {
    conceptTitle: 'Supervised Learning & Regression (Line Draw 📈)',
    simpleExplanation: 'Supervised learning me hum machine ko input data aur uske answers pehle hi de dete hain (jaise teacher student ko sikhata hai). Regression iska ek part hai jo continuous values predict karta hai!',
    analogyTitle: 'Mithas vs Sugar spoon relation ☕',
    analogyContent: 'Mummy chai me jitne chammach cheeni dalengi, chai utni hi meethi hogi. Regression is continuous curve ko ek straight line equation y = m*x + c me convert karta hai jo automatic future prediction kar sake!',
    pythonExampleCode: `# Mathematical linear prediction equation
def predict_price(area_sqft):
    # Let's say: Price = 100 * Area + 50000
    weight = 100
    bias = 50000
    return weight * area_sqft + bias

print(predict_price(1200)) # Predicts Price!`,
    isAdvanceLevel: true,
  },
  'm6-l1': {
    conceptTitle: 'Deep Learning & Backpropagation (Mistake correction!)',
    simpleExplanation: 'Deep learning humare brain ke neurons ko simulate karta hai. Aur Backpropagation is brain ka learning system hai—galti karke seekhna aur apne aap ko har round me behtar banana!',
    analogyTitle: 'Darts target shooting 🎯',
    analogyContent: 'Tumne dart phenka par wo target ke right me laga. Tumhari aankhon ne dekha ki galti kahan hui, brain me weights adjust hue, aur agle round me tumne thoda left me phenka. Backpropagation is mathematically adjusting neural weights!',
    pythonExampleCode: `# Sigmoid activation function
import math

def sigmoid(x):
    # Maps any input to a value between 0 and 1
    return 1 / (1 + math.exp(-x))

print(sigmoid(0)) # Output: 0.5 (perfect center!)`,
    isAdvanceLevel: true,
  }
};

const getFallbackConcept = (lesson: Lesson): ConceptDetail => {
  return {
    conceptTitle: `${lesson.title} (Core Learning Concept)`,
    simpleExplanation: `Bhai, aaj hum seekhne ja rahe hain "${lesson.title}". Ye concept hamari coding toolkit ko ek naya superpower dega. Chalo pehle dhyan se iske theory aur logic ko samjhein!`,
    analogyTitle: `Real-life Connect 💡`,
    analogyContent: `Is concept ko real world me use karke complex code flow ko bahut hi small aur dynamic banaya jata hai. Chalo is lesson ko deep study karke pro bante hain!`,
    pythonExampleCode: `# Core python syntax structure
# Let's master this concept step-by-step!

print("Let's start learning!")`,
    isAdvanceLevel: false,
  };
};

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
    setSelectedOption(idx);
    setMascotState('think_chin_tap');
    setMascotBubble('Hmm, lagta hai tumhein iska jawab pata hai?');
  };

  const handlePredictSelect = (option: string) => {
    if (hasChecked) return;
    setPredictValue(option);
    setMascotState('think_chin_tap');
    setMascotBubble('Ye output aayega kya? Socho.');
  };

  const toggleDragItem = (item: string) => {
    if (hasChecked) return;
    if (dragSelections.includes(item)) {
      setDragSelections(dragSelections.filter(x => x !== item));
    } else {
      setDragSelections([...dragSelections, item]);
    }
    setMascotState('think_chin_tap');
  };

  const checkAnswer = () => {
    if (hasChecked) return;
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
    if (currentExerciseIndex + 1 < lesson.exercises.length) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      onLessonComplete(lesson.xpReward);
    }
  };

  const askBhaiAI = async () => {
    if (!bhaiQuestion.trim()) return;
    setIsBhaiLoading(true);
    setBhaiResponse('');

    try {
      const provider = settings?.aiProvider || 'gemini';
      const keyField = `${provider}ApiKey`;
      const urlField = `${provider}BaseUrl`;
      const userApiKey = (settings as any)?.[keyField] || '';
      const userBaseUrl = (settings as any)?.[urlField] || '';

      const response = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: bhaiQuestion,
          exerciseContext: {
            type: exercise.type,
            question: exercise.question,
            hint: exercise.romanHindiHint,
            code: (exercise as any).code || (exercise as any).buggyCode || ''
          },
          providerConfig: {
            aiProvider: provider,
            apiKey: userApiKey,
            baseUrl: userBaseUrl,
            selectedModel: settings?.selectedModel
          }
        }),
      });

      const data = await response.json();
      setBhaiResponse(data.reply || 'Arre bhai, network slow hai ya server thoda busy hai. Tab tak meri local hint dekh lo!');
    } catch (e) {
      setBhaiResponse('Arre bhai! Tera Gemini API Key configure nahi hai, ya server response slow hai! Setting menu me Secrets check kar. Tab tak dhyan se check karo local hint ko, tum kar loge!');
    } finally {
      setIsBhaiLoading(false);
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
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-100 max-h-[180px] overflow-y-auto">
                      <div className="font-bold text-xs text-emerald-500 mb-1">BHAI AI ({settings?.aiProvider?.toUpperCase() || 'GEMINI'}):</div>
                      <p className="whitespace-pre-wrap">{bhaiResponse}</p>
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
