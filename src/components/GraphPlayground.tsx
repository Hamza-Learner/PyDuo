import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Zap, Award, Play, RotateCcw, HelpCircle, Star, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

interface GraphPlaygroundProps {
  onClose: () => void;
  soundEnabled: boolean;
  playHapticSound: (type: 'tick' | 'pop' | 'error' | 'success') => void;
}

// Fixed beautiful network graph representation
const INITIAL_NODES: GraphNode[] = [
  { id: 'A', label: 'Slythe Head (A)', x: 15, y: 35 },
  { id: 'B', label: 'Node B', x: 35, y: 15 },
  { id: 'C', label: 'Node C', x: 35, y: 55 },
  { id: 'D', label: 'Node D', x: 65, y: 15 },
  { id: 'E', label: 'Node E', x: 65, y: 55 },
  { id: 'F', label: 'Finish (F)', x: 85, y: 35 },
];

const INITIAL_EDGES: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 5 },
  { from: 'B', to: 'D', weight: 10 },
  { from: 'C', to: 'E', weight: 3 },
  { from: 'C', to: 'D', weight: 4 },
  { from: 'D', to: 'E', weight: 1 },
  { from: 'D', to: 'F', weight: 6 },
  { from: 'E', to: 'F', weight: 8 },
];

export const GraphPlayground: React.FC<GraphPlaygroundProps> = ({
  onClose,
  soundEnabled,
  playHapticSound,
}) => {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'game'>('sandbox');
  
  // Sandbox State
  const [startNode, setStartNode] = useState<string>('A');
  const [targetNode, setTargetNode] = useState<string>('F');
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeEdge, setActiveEdge] = useState<string | null>(null);
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [animating, setAnimating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<'dijkstra' | 'bfs' | 'dfs'>('dijkstra');

  // Shortest Path Game State
  const [gameStart, setGameStart] = useState<string>('A');
  const [gameTarget, setGameTarget] = useState<string>('F');
  const [gamePath, setGamePath] = useState<string[]>(['A']);
  const [gameScore, setGameScore] = useState<number>(0);
  const [gameMessage, setGameMessage] = useState<string>('Find the absolute shortest path from A to F! Click next nodes carefully.');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Play Dijkstra simulation step-by-step
  const runAlgorithmSimulation = async () => {
    if (animating) return;
    setAnimating(true);
    setVisitedNodes([]);
    setShortestPath([]);
    setActiveEdge(null);
    setSimulationLog([]);

    const log = (msg: string) => {
      setSimulationLog(prev => [...prev, msg]);
    };

    log(`Initializing ${selectedAlgo.toUpperCase()} from ${startNode} to ${targetNode}...`);
    playHapticSound('tick');

    if (selectedAlgo === 'bfs') {
      // Breadth First Search simulation
      const queue: string[] = [startNode];
      const visited: string[] = [];
      const parentMap: { [key: string]: string } = {};

      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (visited.includes(curr)) continue;
        visited.push(curr);
        setVisitedNodes([...visited]);
        log(`Visiting Node: ${curr} (Exploring breadth queue)`);
        playHapticSound('pop');
        await new Promise(r => setTimeout(r, 650));

        if (curr === targetNode) {
          log(`Target Node ${targetNode} found via BFS breadth exploration!`);
          break;
        }

        // Find neighbors
        const neighbors = INITIAL_EDGES.filter(e => e.from === curr || e.to === curr)
          .map(e => e.from === curr ? e.to : e.from);

        for (const n of neighbors) {
          if (!visited.includes(n) && !queue.includes(n)) {
            parentMap[n] = curr;
            queue.push(n);
          }
        }
      }

      // Reconstruct path
      const path: string[] = [];
      let curr = targetNode;
      while (curr) {
        path.unshift(curr);
        curr = parentMap[curr];
        if (curr === startNode) {
          path.unshift(startNode);
          break;
        }
      }
      setShortestPath(path);
      playHapticSound('success');

    } else if (selectedAlgo === 'dfs') {
      // Depth First Search simulation
      const stack: string[] = [startNode];
      const visited: string[] = [];
      const parentMap: { [key: string]: string } = {};

      while (stack.length > 0) {
        const curr = stack.pop()!;
        if (visited.includes(curr)) continue;
        visited.push(curr);
        setVisitedNodes([...visited]);
        log(`Visiting Node: ${curr} (Diving deeper down stack)`);
        playHapticSound('pop');
        await new Promise(r => setTimeout(r, 650));

        if (curr === targetNode) {
          log(`Target Node ${targetNode} found via DFS deep traversal!`);
          break;
        }

        const neighbors = INITIAL_EDGES.filter(e => e.from === curr || e.to === curr)
          .map(e => e.from === curr ? e.to : e.from);

        for (const n of neighbors) {
          if (!visited.includes(n)) {
            parentMap[n] = curr;
            stack.push(n);
          }
        }
      }

      // Reconstruct path
      const path: string[] = [];
      let curr = targetNode;
      while (curr) {
        path.unshift(curr);
        curr = parentMap[curr];
        if (curr === startNode) {
          path.unshift(startNode);
          break;
        }
      }
      setShortestPath(path);
      playHapticSound('success');

    } else {
      // Dijkstra's Shortest Path Algorithm
      const distances: { [key: string]: number } = {};
      const previous: { [key: string]: string | null } = {};
      const nodes = new Set<string>();

      INITIAL_NODES.forEach(n => {
        distances[n.id] = n.id === startNode ? 0 : Infinity;
        previous[n.id] = null;
        nodes.add(n.id);
      });

      log(`Set initial distances: ${JSON.stringify(distances)}`);

      while (nodes.size > 0) {
        // Find node with minimum distance
        let closestNode: string | null = null;
        nodes.forEach(n => {
          if (closestNode === null || distances[n] < distances[closestNode]) {
            closestNode = n;
          }
        });

        if (closestNode === null || distances[closestNode] === Infinity) {
          break;
        }

        const curr = closestNode;
        nodes.delete(curr);
        setVisitedNodes(prev => [...prev, curr]);
        log(`Exploring Node ${curr} with current min distance = ${distances[curr]}`);
        playHapticSound('pop');
        await new Promise(r => setTimeout(r, 650));

        if (curr === targetNode) {
          log(`Destination ${targetNode} reached! Shortest distance is ${distances[targetNode]}.`);
          break;
        }

        // Relax neighbors
        const incidentEdges = INITIAL_EDGES.filter(e => e.from === curr || e.to === curr);
        for (const edge of incidentEdges) {
          const neighbor = edge.from === curr ? edge.to : edge.from;
          if (!nodes.has(neighbor)) continue;

          const alt = distances[curr] + edge.weight;
          setActiveEdge(`${edge.from}-${edge.to}`);
          log(`Evaluating Edge ${edge.from} -> ${edge.to} (Weight: ${edge.weight})`);
          playHapticSound('tick');
          await new Promise(r => setTimeout(r, 500));

          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = curr;
            log(`  Updated distance for Node ${neighbor} to ${alt}!`);
          }
        }
      }

      // Reconstruct path
      const path: string[] = [];
      let u: string | null = targetNode;
      while (u !== null) {
        path.unshift(u);
        u = previous[u];
      }
      if (path[0] === startNode) {
        setShortestPath(path);
        playHapticSound('success');
        log(`Pradeep/Dijkstra computed path: ${path.join(' → ')}`);
      } else {
        log(`No path found between ${startNode} and ${targetNode}!`);
        playHapticSound('error');
      }
    }

    setAnimating(false);
  };

  // Game Click logic
  const handleGameNodeClick = (nodeId: string) => {
    if (isGameOver) return;
    const currentLoc = gamePath[gamePath.length - 1];

    if (nodeId === currentLoc) return;

    // Check if there is an edge between currentLoc and clicked nodeId
    const edge = INITIAL_EDGES.find(
      e => (e.from === currentLoc && e.to === nodeId) || (e.to === currentLoc && e.from === nodeId)
    );

    if (!edge) {
      playHapticSound('error');
      setGameMessage(`Arre Bhai! "${currentLoc}" se "${nodeId}" ka koi rasta nahi hai! Connected nodes par hi tap karo.`);
      return;
    }

    // Node is connected! Add to path
    const nextPath = [...gamePath, nodeId];
    setGamePath(nextPath);
    playHapticSound('pop');

    if (nodeId === gameTarget) {
      // Calculate total weight of user's path
      let userWeight = 0;
      for (let i = 0; i < nextPath.length - 1; i++) {
        const fromNode = nextPath[i];
        const toNode = nextPath[i + 1];
        const e = INITIAL_EDGES.find(
          edge => (edge.from === fromNode && edge.to === toNode) || (edge.to === fromNode && edge.from === toNode)
        );
        if (e) userWeight += e.weight;
      }

      // The true shortest path from A to F is A -> C (2) -> E (3) -> D (1) -> F (6)?
      // Let's compute:
      // Path 1: A -> B (4) -> D (10) -> F (6) = 20
      // Path 2: A -> C (2) -> E (3) -> F (8) = 13
      // Path 3: A -> C (2) -> D (4) -> F (6) = 12
      // Path 4: A -> C (2) -> E (3) -> D (1) -> F (6) = 12
      // Let's double check Dijkstra:
      // A to C = 2
      // C to E = 3 (A-C-E = 5)
      // E to D = 1 (A-C-E-D = 6)
      // D to F = 6 (A-C-E-D-F = 12)
      // Or A-C-D-F = 2 + 4 + 6 = 12. Both are optimal with cost 12.
      const OPTIMAL_COST = 12;

      setIsGameOver(true);
      if (userWeight === OPTIMAL_COST) {
        playHapticSound('success');
        setGameScore(prev => prev + 150);
        setGameMessage(`🎉 Balle Balle! Tumne absolute optimal path khoj liya! Cost is exactly ${userWeight}. Excellent algorithm calculation, Bhai!`);
      } else {
        playHapticSound('error');
        setGameMessage(`Rasta sahi hai, par sabse chota nahi hai! Your Cost: ${userWeight}. Best Cost is ${OPTIMAL_COST}. Dubara koshish karo!`);
      }
    } else {
      setGameMessage(`Acha ja rahe ho! Now choose node from "${nodeId}" to advance closer to Finish (F).`);
    }
  };

  const resetGame = () => {
    setGamePath(['A']);
    setIsGameOver(false);
    setGameMessage('Find the absolute shortest path from A to F! Click next connected nodes carefully.');
    playHapticSound('tick');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 overflow-y-auto px-4 py-8 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#78D82A]/30 flex flex-col"
      >
        
        {/* Header Section */}
        <div className="bg-slate-900 text-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#78D82A]/10 text-[#78D82A] rounded-xl border border-[#78D82A]/20">
              <Network className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight flex items-center gap-1.5">
                Slythe's Graph Explainer & Dijkstra Game <Sparkles className="w-4.5 h-4.5 text-[#78D82A]" />
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Learn BFS, DFS, and Dijkstra’s Pathfinding with tactile click haptic nodes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Tab switchers */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  setActiveTab('sandbox');
                  playHapticSound('tick');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  activeTab === 'sandbox' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                🔍 Algo Sandbox
              </button>
              <button
                onClick={() => {
                  setActiveTab('game');
                  playHapticSound('tick');
                  resetGame();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  activeTab === 'game' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                🎮 Dijkstra Game
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors font-black text-sm px-3.5 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/30 cursor-pointer"
            >
              Exit ×
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* LEFT: INTERACTIVE DYNAMIC NETWORK SVG CANVAS */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 relative aspect-[4/3] flex items-center justify-center overflow-hidden">
              
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,216,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,216,42,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* Network Graph SVG render */}
              <svg viewBox="0 0 100 70" className="w-full h-full">
                {/* Edges layer */}
                {INITIAL_EDGES.map((edge, idx) => {
                  const fromNode = INITIAL_NODES.find(n => n.id === edge.from)!;
                  const toNode = INITIAL_NODES.find(n => n.id === edge.to)!;
                  
                  // Check state highlights
                  const isShortestPathEdge = 
                    shortestPath.includes(edge.from) && 
                    shortestPath.includes(edge.to) &&
                    Math.abs(shortestPath.indexOf(edge.from) - shortestPath.indexOf(edge.to)) === 1;

                  const isGamePathEdge = 
                    activeTab === 'game' &&
                    gamePath.includes(edge.from) &&
                    gamePath.includes(edge.to) &&
                    Math.abs(gamePath.indexOf(edge.from) - gamePath.indexOf(edge.to)) === 1;

                  const isActive = activeEdge === `${edge.from}-${edge.to}` || activeEdge === `${edge.to}-${edge.from}`;

                  let strokeColor = '#94a3b8'; // Slate 400
                  let strokeWidth = 1.0;
                  let strokeDash = undefined;

                  if (isShortestPathEdge) {
                    strokeColor = '#10B981'; // Emerald 500
                    strokeWidth = 2.4;
                  } else if (isGamePathEdge) {
                    strokeColor = '#0EA5E9'; // Sky 500
                    strokeWidth = 2.4;
                  } else if (isActive) {
                    strokeColor = '#FBBF24'; // Amber 400
                    strokeWidth = 2.2;
                  }

                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        className="transition-all duration-300"
                      />
                      {/* Edge weight badge in the middle */}
                      <g transform={`translate(${(fromNode.x + toNode.x) / 2}, ${(fromNode.y + toNode.y) / 2})`}>
                        <rect x="-3" y="-3" width="6" height="6" rx="1.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5" />
                        <text y="1.2" textAnchor="middle" fontSize="3" fontWeight="bold" fill="#f8fafc" className="font-mono">
                          {edge.weight}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Nodes layer */}
                {INITIAL_NODES.map((node) => {
                  const isVisited = visitedNodes.includes(node.id);
                  const isStart = activeTab === 'sandbox' ? node.id === startNode : node.id === gameStart;
                  const isTarget = activeTab === 'sandbox' ? node.id === targetNode : node.id === gameTarget;
                  const isSelectedInGame = activeTab === 'game' && gamePath.includes(node.id);
                  const isCurrentGameTip = activeTab === 'game' && gamePath[gamePath.length - 1] === node.id;

                  // Determine colors
                  let fillGradient = '#f1f5f9'; // Slate 100
                  let strokeColor = '#475569';
                  let strokeWidth = '0.8';

                  if (isStart) {
                    fillGradient = '#FBBF24'; // Yellow
                    strokeColor = '#D97706';
                    strokeWidth = '1.2';
                  } else if (isTarget) {
                    fillGradient = '#10B981'; // Emerald
                    strokeColor = '#047857';
                    strokeWidth = '1.2';
                  } else if (isCurrentGameTip) {
                    fillGradient = '#0EA5E9'; // Glowing Sky
                    strokeColor = '#0369A1';
                    strokeWidth = '1.5';
                  } else if (isSelectedInGame) {
                    fillGradient = '#E0F2FE'; // Light Sky
                    strokeColor = '#0284C7';
                  } else if (isVisited) {
                    fillGradient = '#D1FAE5'; // Light Green
                    strokeColor = '#059669';
                  }

                  return (
                    <motion.g
                      key={node.id}
                      className="cursor-pointer"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        if (activeTab === 'game') {
                          handleGameNodeClick(node.id);
                        } else {
                          playHapticSound('tick');
                          // set start/target toggle
                          if (startNode === node.id) {
                            // already start
                          } else {
                            setTargetNode(node.id);
                          }
                        }
                      }}
                    >
                      {/* Transparent expander overlay */}
                      <circle cx={node.x} cy={node.y} r="8" fill="transparent" />

                      {/* Main Node */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="4"
                        fill={fillGradient}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        className="transition-all duration-300"
                      />

                      <text
                        x={node.x}
                        y={node.y + 1}
                        textAnchor="middle"
                        fontSize="3"
                        fontWeight="black"
                        fill="#0f172a"
                        className="font-mono"
                      >
                        {node.id}
                      </text>

                      {/* Floating tag label above */}
                      <text
                        x={node.x}
                        y={node.y - 5.5}
                        textAnchor="middle"
                        fontSize="2"
                        fontWeight="extrabold"
                        fill="#64748b"
                        className="font-display"
                      >
                        {node.id === 'A' ? 'Start (A)' : node.id === 'F' ? 'Finish (F)' : ''}
                      </text>
                    </motion.g>
                  );
                })}
              </svg>

              {/* Overlay HUD indicators */}
              <div className="absolute top-3 left-3 bg-slate-950/80 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono select-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Dijkstra Simulator Map
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white px-3 py-1.5 rounded-lg border border-slate-800 text-[9px] font-mono select-none">
                Optimal cost: A → C → E → D → F = 12
              </div>
            </div>

            {/* Instruction Banner depending on Tab */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-850 flex items-start gap-3">
              <span className="text-xl shrink-0">💡</span>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white font-mono block">COACH SLYTHE'S LESSON TIPS</span>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {activeTab === 'sandbox' 
                    ? 'Bhai, Algorithm select karo aur "Run Pathfinder" par click karke trace live animation dekho! Glowing weights and nodes show how Dijkstra explores the minimum distance frontier first.'
                    : 'Game mode me starting node "A" se connected letters par click karke "F" tak pahuncho. Sabse shortest cost (12) dhundne wale ko hi pure stars milenge!'}
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: TACTILE PANEL CONTROLS & CODE INSIGHTS */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {activeTab === 'sandbox' ? (
              /* ALGO SANDBOX CONSOLE panel */
              <div className="flex flex-col gap-4">
                
                {/* Mode controls card */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-850 flex flex-col gap-4">
                  <h3 className="text-sm font-black font-display text-slate-950 dark:text-white uppercase tracking-wider">
                    Pathfinder Algorithm Settings
                  </h3>

                  {/* Algo Selector */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'dijkstra', name: 'Dijkstra', desc: 'Weighted' },
                      { id: 'bfs', name: 'BFS', desc: 'Breadth' },
                      { id: 'dfs', name: 'DFS', desc: 'Depth' },
                    ].map(algo => (
                      <button
                        key={algo.id}
                        onClick={() => {
                          setSelectedAlgo(algo.id as any);
                          playHapticSound('tick');
                        }}
                        className={`p-3.5 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                          selectedAlgo === algo.id
                            ? 'border-[#78D82A] bg-emerald-50/10 dark:bg-emerald-950/10 text-emerald-600 dark:text-[#78D82A]'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-500'
                        }`}
                      >
                        <span className="font-mono font-bold text-xs">{algo.name}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">{algo.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Start/Target Picker dropdowns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">Start Node</label>
                      <select
                        value={startNode}
                        onChange={(e) => {
                          setStartNode(e.target.value);
                          playHapticSound('tick');
                        }}
                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        {INITIAL_NODES.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">Target Node</label>
                      <select
                        value={targetNode}
                        onChange={(e) => {
                          setTargetNode(e.target.value);
                          playHapticSound('tick');
                        }}
                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        {INITIAL_NODES.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Trigger button */}
                  <button
                    onClick={runAlgorithmSimulation}
                    disabled={animating}
                    className={`w-full font-black text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      animating
                        ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black border-b-4 border-emerald-600 active:translate-y-0.5 shadow-md'
                    }`}
                  >
                    <Play className="w-4.5 h-4.5 fill-current" /> {animating ? 'Tracing Paths...' : 'Run Pathfinder Simulation'}
                  </button>
                </div>

                {/* Console Log Panel */}
                <div className="bg-slate-950 text-slate-100 p-4.5 rounded-2xl shadow-inner flex flex-col gap-3 min-h-[190px] max-h-[220px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" /> Trace_Telemetry.log
                    </span>
                    <button
                      onClick={() => setSimulationLog([])}
                      className="text-[9px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 font-mono text-[10px] leading-relaxed text-emerald-400 overflow-y-auto max-h-[150px]">
                    {simulationLog.length === 0 ? (
                      <span className="text-slate-600 italic">Click "Run Pathfinder Simulation" above to trace node graph relaxation cycles...</span>
                    ) : (
                      simulationLog.map((logMsg, i) => (
                        <div key={i} className="flex gap-1">
                          <span className="text-slate-600">[{i+1}]</span>
                          <span>{logMsg}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            ) : (
              /* DIJKSTRA INTERACTIVE GAME panel */
              <div className="flex flex-col gap-4">
                
                {/* Score & HUD panel */}
                <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-850 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono block">Current Score</span>
                      <span className="text-2xl font-black font-mono text-amber-500 flex items-center gap-1">
                        <Award className="w-6 h-6 animate-pulse" /> {gameScore} XP
                      </span>
                    </div>
                    <button
                      onClick={resetGame}
                      className="p-2 bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white rounded-xl transition-all cursor-pointer"
                      title="Reset Game Paths"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Active Path Box */}
                  <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-3.5 rounded-xl flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Your Selected Route</span>
                    <div className="flex flex-wrap items-center gap-1">
                      {gamePath.map((node, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-sky-500/10 text-sky-600 dark:text-[#78D82A] font-black font-mono px-2.5 py-1 rounded-lg border border-sky-500/20 text-xs">
                            {node}
                          </span>
                          {i < gamePath.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Message prompt box */}
                  <div className="bg-sky-500/5 p-4 rounded-xl border border-sky-500/20 text-xs text-sky-600 dark:text-sky-300 font-medium leading-relaxed">
                    {gameMessage}
                  </div>

                  {/* Re-enable buttons if game is finished */}
                  {isGameOver && (
                    <button
                      onClick={resetGame}
                      className="w-full bouncy-btn-green py-3 rounded-xl font-bold text-xs"
                    >
                      Play Again
                    </button>
                  )}
                </div>

                {/* Weighted costs checklist matrix panel */}
                <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl flex flex-col gap-2.5 font-mono text-[10px] overflow-y-auto max-h-[220px]">
                  <span className="text-xs font-black text-slate-400 border-b border-slate-800 pb-2 block mb-1">GRAPH CONFIGURATION MATRIX</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-400">
                    <div>Nodes Set V: <span className="text-amber-400">[A, B, C, D, E, F]</span></div>
                    <div>Weights Set E: <span className="text-amber-400">9 Edges</span></div>
                  </div>
                  <div className="h-px bg-slate-900" />
                  <div className="flex flex-col gap-1 text-slate-500">
                    <div>• Degree Centrality(C): E has max incoming links</div>
                    <div>• PageRank(A): Initial uniform weights = 0.16</div>
                    <div>• Edge(C, E) Weight = 3 | Edge(E, D) Weight = 1</div>
                  </div>
                </div>

              </div>
            )}

            {/* Quick telemetry diagnostic */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl text-[10px] text-slate-400 font-mono flex justify-between items-center select-none">
              <span>WASM Graph Core Engine</span>
              <span>Online: 100% Client-Side</span>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};
