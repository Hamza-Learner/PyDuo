import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Terminal, 
  Sparkles, 
  Cpu, 
  FileCode, 
  Eraser, 
  Send, 
  HelpCircle, 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  AlertTriangle,
  BookOpen,
  ChevronRight,
  BrainCircuit,
  MessageSquare,
  Wand2,
  X
} from 'lucide-react';
import { Settings } from '../types';
import { fetchHint, type ProviderConfig } from '../utils/api';

// Duolingo-style haptic feedback
const playHaptic = (type: 'tick' | 'pop' | 'success' | 'error') => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'tick') {
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'pop') {
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'success') {
      [261.63, 329.63, 392, 523.25].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.08, now + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);
        o.start(now + i * 0.05);
        o.stop(now + i * 0.05 + 0.2);
      });
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.14);
    }
    if (navigator.vibrate) {
      const patterns = { tick: [5], pop: [10, 5, 10], success: [15, 10, 15], error: [30, 20] };
      navigator.vibrate(patterns[type]);
    }
  } catch (e) {}
};

interface CodeDarbarProps {
  settings: Settings;
  onBack?: () => void;
  onGainXP?: (amount: number) => void;
}

const TEMPLATES = [
  {
    id: 'hello_world',
    name: 'Hello World',
    desc: 'The classic programmer welcome!',
    code: `# Bhai's Hello World Welcome!
print("Pranam, World!")

user_name = "Duolingo Python Student"
print("Aaja seekh python with Slythe Bhai,", user_name)
`
  },
  {
    id: 'loops',
    name: 'Looping Patterns',
    desc: 'Print multiplication tables and sequences',
    code: `# Print a beautiful multiplication table for 5!
print("=== table of 5 ===")
for i in range(1, 11):
    result = i * 5
    print(f"5 x {i} = {result}")

print("\\nSuccess! Loops are so easy.")
`
  },
  {
    id: 'lists',
    name: 'List Operations',
    desc: 'Filtering, mapping and slicing lists',
    code: `# Filter odd and even numbers from list
numbers = [12, 45, 2, 89, 34, 11, 7, 50, 99]
evens = []
odds = []

for num in numbers:
    if num % 2 == 0:
        evens.append(num)
    else:
        odds.append(num)

print("Original Numbers:", numbers)
print("Even numbers:", evens)
print("Odd numbers:", odds)
`
  },
  {
    id: 'functions',
    name: 'Function Definitions',
    desc: 'Define helper functions and invoke them',
    code: `def calculate_bhai_power(code_lines, speed):
    """
    Calculate programmer efficiency power level!
    """
    power = code_lines * speed
    return power

# Test our custom function
my_power = calculate_bhai_power(45, 10)
print(f"Programmer power level is: {my_power} XP!")

if my_power > 300:
    print("Shabash! Tum toh champion ban gaye!")
else:
    print("Keep practicing to increase power!")
`
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence',
    desc: 'Generate Fibonacci numbers recursively or with loops',
    code: `def fibonacci_sequence(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

# Print first 10 Fibonacci values
terms = 10
fibs = fibonacci_sequence(terms)
print(f"First {terms} Fibonacci numbers are:")
print(fibs)
`
  }
];

export const CodeDarbar: React.FC<CodeDarbarProps> = ({
  settings,
  onBack,
  onGainXP
}) => {
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [output, setOutput] = useState<string>('');
  const [isLoadingPyodide, setIsLoadingPyodide] = useState<boolean>(true);
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  
  // Custom templates dropdown
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);

  // Slythe Bhai AI Tutor panel states
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorInput, setTutorInput] = useState<string>('');
  const [tutorMessages, setTutorMessages] = useState<{ sender: 'user' | 'tutor'; text: string }[]>([
    { 
      sender: 'tutor', 
      text: "Pranam coder! Main hoon tumhara Python tutor Slythe Bhai! 🐍\n\nYahan Code Darbar me tum apna koi bhi free code likho aur use live execute karo. Agar code me koi bug aaye, ya samajh na aaye ki function kaise likhein, toh mujhse pooch lo! Main har step pe guide karunga!" 
    }
  ]);
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);

  // Ref to chat container bottom to autoscroll
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial Load of Pyodide engine
  useEffect(() => {
    let isMounted = true;
    const loadPyodideEngine = async () => {
      try {
        if ((window as any).loadPyodide) {
          initializePyodide();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.async = true;
        script.onload = () => {
          if (isMounted) initializePyodide();
        };
        script.onerror = () => {
          if (isMounted) {
            console.log("Offline or CDN error. Initializing lightweight local Python runner fallback.");
            setUsingFallback(true);
            setIsLoadingPyodide(false);
          }
        };
        document.body.appendChild(script);
      } catch (err) {
        if (isMounted) {
          setUsingFallback(true);
          setIsLoadingPyodide(false);
        }
      }
    };

    const initializePyodide = async () => {
      try {
        const pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
        });
        if (isMounted) {
          setPyodideInstance(pyodide);
          setIsLoadingPyodide(false);
        }
      } catch (e) {
        console.error("Pyodide initialize failed, switching to fallback", e);
        if (isMounted) {
          setUsingFallback(true);
          setIsLoadingPyodide(false);
        }
      }
    };

    loadPyodideEngine();
    return () => {
      isMounted = false;
    };
  }, []);

  // Autoscroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorMessages, isTutorLoading]);

  // Code Simulation Fallback if Pyodide offline
  const runFallbackSimulation = (sourceCode: string): { stdout: string; error?: string } => {
    let logBuffer: string[] = [];
    const simulatedPrint = (...args: any[]) => {
      logBuffer.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    };

    try {
      const lines = sourceCode.split('\n');
      const variables: Record<string, any> = {};
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        if (line.includes('=')) {
          const parts = line.split('=');
          const varName = parts[0].trim();
          let varValStr = parts[1].trim();

          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
            if ((varValStr.startsWith('"') && varValStr.endsWith('"')) || (varValStr.startsWith("'") && varValStr.endsWith("'"))) {
              variables[varName] = varValStr.slice(1, -1);
            } else {
              try {
                let evaluatedStr = varValStr;
                Object.keys(variables).forEach(vKey => {
                  const r = new RegExp(`\\b${vKey}\\b`, 'g');
                  evaluatedStr = evaluatedStr.replace(r, variables[vKey]);
                });
                const cleanStr = evaluatedStr.replace(/[^0-9+\-*/().\s]/g, '');
                variables[varName] = Function(`return (${cleanStr})`)();
              } catch {
                variables[varName] = varValStr;
              }
            }
          }
        }

        if (line.startsWith('print(') && line.endsWith(')')) {
          const printArgStr = line.slice(6, -1).trim();
          if ((printArgStr.startsWith('"') && printArgStr.endsWith('"')) || (printArgStr.startsWith("'") && printArgStr.endsWith("'"))) {
            simulatedPrint(printArgStr.slice(1, -1));
          } else if (variables[printArgStr] !== undefined) {
            simulatedPrint(variables[printArgStr]);
          } else {
            let evaluatedStr = printArgStr;
            Object.keys(variables).forEach(vKey => {
              const r = new RegExp(`\\b${vKey}\\b`, 'g');
              evaluatedStr = evaluatedStr.replace(r, variables[vKey]);
            });
            try {
              if (evaluatedStr.includes('+') && (evaluatedStr.includes('"') || evaluatedStr.includes("'"))) {
                const result = evaluatedStr.split('+').map(p => {
                  const s = p.trim();
                  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
                  if (variables[s] !== undefined) return variables[s];
                  return '';
                }).join('');
                simulatedPrint(result);
              } else {
                const cleanStr = evaluatedStr.replace(/[^0-9+\-*/().\s]/g, '');
                simulatedPrint(Function(`return (${cleanStr})`)());
              }
            } catch {
              simulatedPrint(variables[printArgStr] ?? printArgStr);
            }
          }
        }

        if (line.startsWith('for ') && line.includes(' in range(')) {
          const varMatch = line.match(/for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+range\(([^)]+)\):/);
          if (varMatch) {
            const loopVar = varMatch[1];
            const rangeArgs = varMatch[2].split(',').map(s => s.trim());
            let start = 0;
            let end = 0;
            if (rangeArgs.length === 1) {
              end = parseInt(rangeArgs[0]);
            } else if (rangeArgs.length === 2) {
              start = parseInt(rangeArgs[0]);
              end = parseInt(rangeArgs[1]);
            }

            let loopBodyLine = '';
            if (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t'))) {
              loopBodyLine = lines[i + 1].trim();
              i++;
            }

            if (loopBodyLine.startsWith('print(') && loopBodyLine.endsWith(')')) {
              const bodyArg = loopBodyLine.slice(6, -1).trim();
              for (let v = start; v < end; v++) {
                variables[loopVar] = v;
                if (bodyArg === loopVar) {
                  simulatedPrint(v);
                } else {
                  simulatedPrint(bodyArg);
                }
              }
            }
          }
        }
      }

      return { stdout: logBuffer.join('\n') };
    } catch (e: any) {
      return { stdout: logBuffer.join('\n'), error: e?.message || 'SyntaxError: Invalid code construct' };
    }
  };

  const executePython = async () => {
    playHaptic('pop');
    setIsEvaluating(true);
    setOutput('');

    try {
      let finalStdout = '';
      let isSuccess = true;

      if (usingFallback || !pyodideInstance) {
        const res = runFallbackSimulation(code);
        finalStdout = res.stdout;
        if (res.error) {
          finalStdout += `\nError: ${res.error}`;
          isSuccess = false;
        }
      } else {
        // Run safely in WASM Pyodide
        pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

        await pyodideInstance.runPythonAsync(code);

        const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
        const stderr = pyodideInstance.runPython("sys.stderr.getvalue()");

        finalStdout = stdout;
        if (stderr) {
          finalStdout += '\n' + stderr;
          isSuccess = false;
        }
      }

      setOutput(finalStdout.trim() || 'Code compiled successfully with no printed output.');
      
      // Reward user with 5 XP for running custom experiments (cooldown: once per block change or run)
      if (onGainXP) {
        onGainXP(5);
      }
    } catch (err: any) {
      const errorMessage = err?.message || String(err);
      setOutput(`Traceback (most recent call last):\n  File "<string>", line 1, in <module>\nRuntimeError: ${errorMessage}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const loadTemplate = (id: string) => {
    const template = TEMPLATES.find(t => t.id === id);
    if (template) {
      setCode(template.code);
      setSelectedTemplateId(id);
      setOutput('');
    }
  };

  const handleClearConsole = () => {
    playHaptic('tick');
    setOutput('');
  };

  const handleResetEditor = () => {
    playHaptic('tick');
    setCode(TEMPLATES.find(t => t.id === selectedTemplateId)?.code || TEMPLATES[0].code);
    setOutput('');
  };

  // Submit tutor query to API gateway with context
  const askSlytheBhaiTutor = async (customPrompt?: string) => {
    playHaptic('pop');
    const queryText = customPrompt || tutorInput;
    if (!queryText.trim()) return;

    // Append user message
    setTutorMessages(prev => [...prev, { sender: 'user', text: queryText }]);
    setTutorInput('');
    setIsTutorLoading(true);

    try {
      const provider = settings?.aiProvider || 'gemini';
      const keyField = `${provider}ApiKey`;
      const urlField = `${provider}BaseUrl`;
      const userApiKey = (settings as any)?.[keyField] || '';
      const userBaseUrl = (settings as any)?.[urlField] || '';

      const exerciseContext = {
        question: queryText,
        hint: output || '[No output or code has not been run yet]',
        code: code
      };

      const providerConfig: ProviderConfig = {
        aiProvider: provider,
        apiKey: userApiKey,
        baseUrl: userBaseUrl,
        selectedModel: settings?.selectedModel
      };

      const answer = await fetchHint(queryText, exerciseContext, providerConfig);
      
      setTutorMessages(prev => [...prev, { sender: 'tutor', text: answer }]);
    } catch (error) {
      setTutorMessages(prev => [...prev, { 
        sender: 'tutor', 
        text: "Arre yaara! Kuch error aa gaya. Apna API Key settings page par check karo!" 
      }]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    playHaptic('tick');
    setIsTutorOpen(true);
    askSlytheBhaiTutor(question);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 select-none flex flex-col min-h-[500px]">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 select-none">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors font-semibold text-xs mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return Map
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">💻</span>
            <h1 className="text-2xl font-black font-display tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Code Darbar <span className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">Free Playground</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Write any Python code freely, compile using the WASM compiler, and ask Slythe Bhai for dynamic mentor help!
          </p>
        </div>

        {/* Engine Status / Select Boilerplate Preset */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 pl-2 font-mono uppercase">Template:</span>
            <select
              value={selectedTemplateId}
              onChange={(e) => loadTemplate(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {isLoadingPyodide ? (
              <span className="flex items-center gap-1 text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/40 px-2.5 py-1.5 rounded-xl font-mono animate-pulse">
                <Cpu className="w-3 h-3 animate-spin" /> Load WASM...
              </span>
            ) : usingFallback ? (
              <span className="flex items-center gap-1 text-[10px] bg-blue-950/40 text-blue-400 border border-blue-900/40 px-2.5 py-1.5 rounded-xl font-mono">
                ⚡ Offline Sim
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2.5 py-1.5 rounded-xl font-mono">
                🐍 Python WASM Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:min-h-0">
        
        {/* Code Editor and Console Panel */}
        <div className="lg:col-span-8 flex flex-col min-h-[400px] lg:min-h-0 bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850 overflow-hidden shadow-xl">
          
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="flex gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
              </span>
              <span className="text-slate-400 font-mono text-[11px] ml-2 font-bold flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-sky-400" /> code_darbar_sandbox.py
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetEditor}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Reset editor code"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor Component Container */}
          <div className="flex-1 relative bg-slate-950 min-h-[220px]">
            <Editor
              height="100%"
              defaultLanguage="python"
              language="python"
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                cursorBlinking: 'blink',
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                suggestOnTriggerCharacters: true,
                tabSize: 4,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
              }}
              loading={
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-400 font-mono text-xs gap-2">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  Initializing VS-Style Editor...
                </div>
              }
            />
          </div>

          {/* Code Controls Footer Row */}
          <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={executePython}
              disabled={isEvaluating}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm cursor-pointer transition-transform duration-200 active:scale-95 ${
                isEvaluating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-2 border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40'
              }`}
            >
              <Play className={`w-4 h-4 fill-current ${isEvaluating ? 'animate-pulse' : ''}`} />
              {isEvaluating ? 'Executing...' : 'Run Code (5 XP)'}
            </button>

            <button
              onClick={() => setIsTutorOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black font-display bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-2 border-dashed border-amber-500/30 rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400 fill-current animate-bounce" /> Ask Slythe Bhai
            </button>
          </div>

          {/* Console Output Console */}
          <div className="border-t border-slate-800 bg-slate-950 flex flex-col h-[180px] min-h-[140px] max-h-[220px]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900 text-slate-400 font-mono text-[11px] bg-slate-900/60 font-bold">
              <span className="flex items-center gap-1.5 select-none">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Output Terminal
              </span>
              
              <div className="flex items-center gap-2">
                {isEvaluating && <span className="animate-pulse text-emerald-400 text-[10px] select-none font-mono">Running...</span>}
                <button
                  onClick={handleClearConsole}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-300 font-mono text-[10px] py-0.5 px-1.5 hover:bg-slate-900 rounded transition-colors cursor-pointer"
                >
                  <Eraser className="w-3 h-3" /> Clear Console
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs leading-relaxed text-slate-200 flex-1 h-[100px] select-text selection:bg-slate-800">
              {output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-slate-600 italic">No output printed. Press "Run Code" to compile python script.</span>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar / Quick Actions & Tutor Pane */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Quick Suggestions list */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-850 flex flex-col gap-3 select-none">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-amber-500" /> Quick Ask presets
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleQuickQuestion("Bhai! Mere is Python code ko simple words me explain kardo na please.")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:bg-slate-50 dark:hover:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>🔍 Explain my code</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={() => handleQuickQuestion("Bhai check karo mere code me kya koi bugs, syntax errors ya edge-cases hain?")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:bg-slate-50 dark:hover:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>🐛 Check code for bugs</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={() => handleQuickQuestion("Bhai is code ko optimize kaise karu? Performance and styling improve kardo.")}
                className="w-full text-left p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:bg-slate-50 dark:hover:bg-slate-950 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center justify-between cursor-pointer"
              >
                <span>🚀 Optimize code efficiency</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Dynamic Slythe Bhai AI Tutor Chat Module - flexible auto-height */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-850 overflow-hidden flex flex-col shadow-md lg:min-h-0 lg:flex-auto">
            
            {/* Tutor Header */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-150 dark:border-slate-850 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐍</span>
                <div>
                  <span className="text-xs font-black text-slate-900 dark:text-white block font-display leading-none">Slythe Bhai AI Mentor</span>
                  <span className="text-[10px] text-emerald-500 font-mono font-bold leading-none mt-0.5 block flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" /> Active Darbar
                  </span>
                </div>
              </div>

              {isTutorOpen && (
                <button
                  onClick={() => setIsTutorOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Chat message frame - flexible auto-resize based on content */}
            <div className="overflow-y-auto p-4 flex flex-col gap-3 min-h-[180px] lg:min-h-0 lg:flex-auto select-text max-h-[60vh] lg:max-h-none">
              {tutorMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap break-words ${
                    msg.sender === 'user' 
                      ? 'bg-[#306998] text-white self-end rounded-tr-none font-medium' 
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 self-start rounded-tl-none border border-slate-150 dark:border-slate-800 font-sans'
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {isTutorLoading && (
                <div className="bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 self-start rounded-2xl rounded-tl-none px-3 py-2 text-xs font-mono flex items-center gap-1.5 border border-slate-150 dark:border-slate-800">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" />
                  </div>
                  Slythe Bhai is thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Action Form */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-150 dark:border-slate-850">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  askSlytheBhaiTutor();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  placeholder="Bhai is loop me syntax check karo..."
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={isTutorLoading || !tutorInput.trim()}
                  className="p-2 bg-[#306998] hover:bg-[#204c70] disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
