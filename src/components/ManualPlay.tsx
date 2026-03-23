import { useState, useCallback } from 'react';
import { GameState, Move, INITIAL_STATE, POSSIBLE_MOVES, isValid, isGoal, getMoveDescription } from '@/lib/gameLogic';
import RiverScene from './RiverScene';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, AlertTriangle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function ManualPlay() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [history, setHistory] = useState<{ state: GameState; move: Move }[]>([]);
  const [won, setWon] = useState(false);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setHistory([]);
    setWon(false);
  }, []);

  const applyMove = (move: Move) => {
    if (won) return;
    const [m, c] = move;
    const [ml, cl, boatLeft] = state;

    // Check if enough people on current side
    if (boatLeft) {
      if (m > ml || c > cl) {
        toast.error('Not enough people on the left bank for this move!');
        return;
      }
    } else {
      if (m > 3 - ml || c > 3 - cl) {
        toast.error('Not enough people on the right bank for this move!');
        return;
      }
    }

    const newState: GameState = boatLeft
      ? [ml - m, cl - c, false]
      : [ml + m, cl + c, true];

    if (!isValid(newState)) {
      toast.error('Invalid move! Cannibals would outnumber missionaries.', {
        icon: <AlertTriangle className="w-4 h-4" />,
        description: 'Missionaries must never be outnumbered by cannibals on either bank.',
      });
      return;
    }

    setState(newState);
    setHistory(prev => [...prev, { state: newState, move }]);

    if (isGoal(newState)) {
      setWon(true);
      toast.success('🎉 You solved it!', { description: `Completed in ${history.length + 1} moves.` });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold">Manual Mode</h3>
          <p className="text-sm text-muted-foreground">
            Move all missionaries and cannibals to the right bank. 
            Boat carries 1-2 people.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
      </div>

      <RiverScene state={state} />

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4 text-center glow-accent"
          >
            <Trophy className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="font-display font-semibold text-success">Puzzle Solved!</p>
            <p className="text-sm text-muted-foreground">Completed in {history.length} moves</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!won && (
        <div className="glass rounded-xl p-4">
          <div className="text-xs font-mono text-muted-foreground mb-3 uppercase tracking-wider">
            Choose a move ({state[2] ? 'Left → Right' : 'Right → Left'})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POSSIBLE_MOVES.map((move, i) => (
              <Button
                key={i}
                variant="secondary"
                className="justify-start font-mono text-sm"
                onClick={() => applyMove(move)}
              >
                {getMoveDescription(move, state[2])}
              </Button>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="glass rounded-xl p-4">
          <div className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
            Move History ({history.length} moves)
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="text-xs font-mono text-muted-foreground">
                {i + 1}. {getMoveDescription(h.move, i % 2 === 0)} → [{h.state[0]}M, {h.state[1]}C, boat {h.state[2] ? 'left' : 'right'}]
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
