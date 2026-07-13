import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Terminal, AlertTriangle, Cpu } from 'lucide-react';

interface CodeSandboxProps {
  initialCode: string;
  testCases?: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
  onRunComplete?: (output: string, success: boolean) => void;
  solutionCode?: string;
}

export const CodeSandbox: React.FC<CodeSandboxProps> = ({
  initialCode,
  testCases = [],
  onRunComplete,
  solutionCode,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [isLoadingPyodide, setIsLoadingPyodide] = useState<boolean>(true);
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ desc: string; passed: boolean; actual: string }[]>([]);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  useEffect(() => {
    setCode(initialCode);
    setTestResults([]);
    setOutput('');
  }, [initialCode]);

  // Dynamically load Pyodide CDN with elegant script inclusion
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

  // Fast offline Python execution fallback for basic tasks
  const runFallbackSimulation = (sourceCode: string): { stdout: string; error?: string } => {
    let logBuffer: string[] = [];
    const simulatedPrint = (...args: any[]) => {
      logBuffer.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    };

    try {
      // Basic translation and execution of simple variables/prints
      // First, sanitize the lines
      const lines = sourceCode.split('\n');
      const variables: Record<string, any> = {};
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        // Pattern matching simple variables: name = 42 or first_place = "Gold"
        if (line.includes('=')) {
          const parts = line.split('=');
          const varName = parts[0].trim();
          let varValStr = parts[1].trim();

          // simple safety validation for variable name
          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
            // parse string or numbers or expressions
            if ((varValStr.startsWith('"') && varValStr.endsWith('"')) || (varValStr.startsWith("'") && varValStr.endsWith("'"))) {
              variables[varName] = varValStr.slice(1, -1);
            } else {
              try {
                // simple math calculation
                // replace variables in the string
                let evaluatedStr = varValStr;
                Object.keys(variables).forEach(vKey => {
                  const r = new RegExp(`\\b${vKey}\\b`, 'g');
                  evaluatedStr = evaluatedStr.replace(r, variables[vKey]);
                });
                // safe arithmetic evaluation
                const cleanStr = evaluatedStr.replace(/[^0-9+\-*/().\s]/g, '');
                variables[varName] = Function(`return (${cleanStr})`)();
              } catch {
                variables[varName] = varValStr;
              }
            }
          }
        }

        // Pattern matching standard print(variable) or print("string")
        if (line.startsWith('print(') && line.endsWith(')')) {
          const printArgStr = line.slice(6, -1).trim();
          if ((printArgStr.startsWith('"') && printArgStr.endsWith('"')) || (printArgStr.startsWith("'") && printArgStr.endsWith("'"))) {
            simulatedPrint(printArgStr.slice(1, -1));
          } else if (variables[printArgStr] !== undefined) {
            simulatedPrint(variables[printArgStr]);
          } else {
            // evaluate expression inside print
            let evaluatedStr = printArgStr;
            Object.keys(variables).forEach(vKey => {
              const r = new RegExp(`\\b${vKey}\\b`, 'g');
              evaluatedStr = evaluatedStr.replace(r, variables[vKey]);
            });
            try {
              if (evaluatedStr.includes('+') && (evaluatedStr.includes('"') || evaluatedStr.includes("'"))) {
                // handle simple string concatenation like "Py" + "Duo"
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
              // default print fallback
              simulatedPrint(variables[printArgStr] ?? printArgStr);
            }
          }
        }

        // basic loop simulation: for i in range(1, 6): print(i)
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

            // check the next line for indentation loop body
            let loopBodyLine = '';
            if (i + 1 < lines.length && (lines[i + 1].startsWith('    ') || lines[i + 1].startsWith('\t'))) {
              loopBodyLine = lines[i + 1].trim();
              i++; // skip next line in general processing
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
    setIsEvaluating(true);
    setOutput('');
    setTestResults([]);

    try {
      let finalStdout = '';
      let isSuccess = true;

      if (usingFallback || !pyodideInstance) {
        // Execute offline fallback simulation
        const res = runFallbackSimulation(code);
        finalStdout = res.stdout;
        if (res.error) {
          finalStdout += `\nError: ${res.error}`;
          isSuccess = false;
        }
      } else {
        // Real WASM Pyodide Execution
        // Redirect stdout safely in pyodide
        pyodideInstance.runPython(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

        // Run user's script
        await pyodideInstance.runPythonAsync(code);

        // Retrieve printed stdout and errors
        const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
        const stderr = pyodideInstance.runPython("sys.stderr.getvalue()");

        finalStdout = stdout;
        if (stderr) {
          finalStdout += '\n' + stderr;
          isSuccess = false;
        }
      }

      setOutput(finalStdout.trim() || 'Code executed successfully with no output.');

      // Check test cases
      if (testCases && testCases.length > 0) {
        const results = testCases.map(tc => {
          const sanitizedActual = finalStdout.trim().replace(/\r/g, '');
          const sanitizedExpected = tc.expectedOutput.trim().replace(/\r/g, '');
          const passed = sanitizedActual === sanitizedExpected || sanitizedActual.includes(sanitizedExpected);
          return {
            desc: tc.description,
            passed,
            actual: sanitizedActual,
          };
        });
        setTestResults(results);
        const allPassed = results.every(r => r.passed);
        if (onRunComplete) {
          onRunComplete(finalStdout, allPassed && isSuccess);
        }
      } else {
        if (onRunComplete) {
          onRunComplete(finalStdout, isSuccess);
        }
      }
    } catch (err: any) {
      const errorMessage = err?.message || String(err);
      setOutput(`Traceback (most recent call last):\n  File "<string>", line 1, in <module>\nRuntimeError: ${errorMessage}`);
      if (onRunComplete) {
        onRunComplete(errorMessage, false);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setTestResults([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 high-density-card overflow-hidden shadow-md">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
          </span>
          <span className="text-slate-400 font-mono text-xs ml-2 select-none">sandbox.py</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          {isLoadingPyodide ? (
            <span className="flex items-center gap-1 text-[10px] bg-amber-950/50 text-amber-400 border border-amber-900/50 px-2 py-0.5 rounded-full font-mono animate-pulse">
              <Cpu className="w-3 h-3 animate-spin" /> Engine Loading...
            </span>
          ) : usingFallback ? (
            <span className="flex items-center gap-1 text-[10px] bg-blue-950/50 text-blue-400 border border-blue-900/50 px-2 py-0.5 rounded-full font-mono">
              ⚡ Local Simulator
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded-full font-mono">
              🐍 Python WASM ready
            </span>
          )}

          <button
            onClick={resetCode}
            id="reset_code_button"
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors rounded hover:bg-slate-800/60"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative flex-1 flex flex-col min-h-[160px] md:min-h-[200px]">
        {/* Editor text-area with custom padding */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full flex-1 p-4 bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed outline-none resize-none focus:ring-0 placeholder-slate-600 border-none"
          placeholder="# Type your Python code here..."
        />
      </div>

      {/* Control Panel / Actions */}
      <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={executePython}
            disabled={isEvaluating}
            id="run_code_button"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm cursor-pointer ${
              isEvaluating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-2 border-slate-700'
                : 'bouncy-btn-green'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isEvaluating ? 'animate-pulse' : ''}`} />
            {isEvaluating ? 'Running...' : 'Run Code'}
          </button>
        </div>

        {solutionCode && (
          <button
            onClick={() => setCode(solutionCode)}
            id="show_solution_button"
            className="text-xs text-sky-400 hover:text-sky-300 hover:underline font-mono"
          >
            Reveal Solution
          </button>
        )}
      </div>

      {/* Output Console / Terminal */}
      <div className="border-t border-slate-800 bg-slate-950 flex-1 flex flex-col min-h-[140px] max-h-[220px]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-900/60 text-slate-400 font-mono text-xs bg-slate-950/80">
          <span className="flex items-center gap-1.5 select-none font-bold">
            <Terminal className="w-3.5 h-3.5" /> Output Console
          </span>
          {isEvaluating && <span className="animate-pulse text-emerald-400 select-none">Executing...</span>}
        </div>

        <div className="p-4 overflow-y-auto font-mono text-xs leading-relaxed text-slate-200 flex-1 h-[100px] select-text selection:bg-slate-800">
          {output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <span className="text-slate-600 italic">No output. Press "Run Code" to execute.</span>
          )}
        </div>

        {/* Test Case Checklist */}
        {testResults.length > 0 && (
          <div className="bg-slate-900/40 border-t border-slate-900 px-4 py-3 text-xs flex flex-col gap-1.5 font-mono select-none">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Test Cases</span>
            {testResults.map((tr, index) => (
              <div key={index} className="flex items-center gap-2">
                {tr.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className={tr.passed ? 'text-slate-300' : 'text-slate-400'}>
                  {tr.desc}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
