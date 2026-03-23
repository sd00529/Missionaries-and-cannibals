import { useState, useCallback, useEffect, useRef } from 'react';
import { bfs, dfs, astar, SearchResult, getMoveDescription, getAgentReasoning } from '@/lib/gameLogic';
import RiverScene from './RiverScene';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Brain, Zap, Clock, Layers } from 'lucide-react';

const ALGORITHMS = [
  { key: 'bfs', label: 'BFS', fn: bfs, color: 'text-primary' },
  { key: 'dfs', label: 'DFS', fn: dfs, color: 'text-warning' },
  { key: 'astar', label: 'A*', fn: astar, color: 'text-success' },
] as const;

export default function AlgorithmSolver() {
  const [selectedAlgo, setSelectedAlgo] = useState<'bfs' | 'dfs' | 'astar'>('bfs');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const algo = ALGORITHMS.find(a => a.key === selectedAlgo)!;

  const solve = useCallback(() => {
    setPlaying(false);
    setCurrentStep(0);
    const r = algo.fn();
    setResult(r);
  }, [algo]);

  const reset = useCallback(() => {
    setPlaying(false);
    setCurrentStep(0);
    setResult(null);
  }, []);

  useEffect(() => {
    if (playing && result && currentStep < result.path.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= result.path.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, result, currentStep]);

  useEffect(() => {
    if (result && currentStep >= result.path.length - 1) {
      setPlaying(false);
    }
  }, [currentStep, result]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold">AI Solver</h3>
        <p className="text-sm text-muted-foreground">
          Watch an intelligent agent solve the problem using search algorithms.
        </p>
      </div>

      {/* Algorithm Picker */}
      <div className="flex gap-2 flex-wrap">
        {ALGORITHMS.map(a => (
          <Button
            key={a.key}
            variant={selectedAlgo === a.key ? 'default' : 'secondary'}
            size="sm"
            onClick={() => { setSelectedAlgo(a.key); reset(); }}
            className="font-mono"
          >
            {a.label}
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={solve} className="font-mono">
          <Zap className="w-4 h-4 mr-1" /> Solve
        </Button>
        {result && (
          <>
            <Button variant="secondary" onClick={() => setPlaying(!playing)}>
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="secondary" onClick={() => setCurrentStep(s => Math.min(s + 1, result.path.length - 1))}>
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Scene */}
      {result && (
        <>
          <RiverScene state={result.path[currentStep]} isAnimating={playing} />

          {/* Step indicator */}
          <div className="flex gap-1 flex-wrap">
            {result.path.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setCurrentStep(i); }}
                className={`w-6 h-6 rounded text-[10px] font-mono transition-all ${
                  i === currentStep
                    ? 'bg-primary text-primary-foreground scale-110'
                    : i < currentStep
                    ? 'bg-accent/30 text-accent'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {i}
              </button>
            ))}
          </div>

          {/* Agent Reasoning */}
          {currentStep > 0 && currentStep < result.path.length && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Agent Decision — Step {currentStep}</span>
                </div>
                <p className="text-sm font-semibold mb-1">
                  {getMoveDescription(result.moves[currentStep - 1], result.path[currentStep - 1][2])}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getAgentReasoning(result.path[currentStep - 1], result.moves[currentStep - 1])}
                </p>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Layers, label: 'Steps', value: result.moves.length },
              { icon: Zap, label: 'Nodes Expanded', value: result.nodesExpanded },
              { icon: Layers, label: 'Max Frontier', value: result.frontierMax },
              { icon: Clock, label: 'Time', value: `${result.executionTime.toFixed(2)}ms` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass rounded-lg p-3 text-center">
                <Icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-lg font-mono font-bold">{value}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
