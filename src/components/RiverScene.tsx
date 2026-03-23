import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/lib/gameLogic';

interface RiverSceneProps {
  state: GameState;
  isAnimating?: boolean;
}

function PersonIcon({ type, index }: { type: 'missionary' | 'cannibal'; index: number }) {
  const isMissionary = type === 'missionary';
  return (
    <motion.div
      layout
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex flex-col items-center gap-0.5`}
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg font-bold ${
        isMissionary ? 'bg-missionary text-primary-foreground' : 'bg-cannibal text-destructive-foreground'
      }`}>
        {isMissionary ? '✝' : '🦴'}
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">
        {isMissionary ? 'M' : 'C'}
      </span>
    </motion.div>
  );
}

export default function RiverScene({ state, isAnimating }: RiverSceneProps) {
  const [ml, cl, boatLeft] = state;
  const mr = 3 - ml;
  const cr = 3 - cl;

  return (
    <div className="w-full rounded-xl overflow-hidden glass p-4">
      <div className="flex items-stretch gap-0 min-h-[180px] sm:min-h-[220px]">
        {/* Left Bank */}
        <div className="flex-1 rounded-l-lg bg-bank/30 border border-border/30 p-3 flex flex-col justify-between">
          <div className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">Left Bank</div>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: ml }, (_, i) => (
                <PersonIcon key={`ml-${i}`} type="missionary" index={i} />
              ))}
              {Array.from({ length: cl }, (_, i) => (
                <PersonIcon key={`cl-${i}`} type="cannibal" index={i} />
              ))}
            </AnimatePresence>
          </div>
          <div className="text-xs font-mono text-center text-muted-foreground mt-2">
            {ml}M {cl}C
          </div>
        </div>

        {/* River */}
        <div className="w-24 sm:w-32 river-animated relative flex items-center justify-center">
          <motion.div
            animate={{ x: boatLeft ? -20 : 20 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className={`animate-float ${isAnimating ? '' : ''}`}
          >
            <div className="bg-boat text-primary-foreground rounded-lg px-3 py-2 text-2xl shadow-lg">
              🚣
            </div>
          </motion.div>
          <div className="absolute bottom-1 text-[10px] font-mono text-foreground/60">
            ~ river ~
          </div>
        </div>

        {/* Right Bank */}
        <div className="flex-1 rounded-r-lg bg-bank/30 border border-border/30 p-3 flex flex-col justify-between">
          <div className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider text-right">Right Bank</div>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
            <AnimatePresence mode="popLayout">
              {Array.from({ length: mr }, (_, i) => (
                <PersonIcon key={`mr-${i}`} type="missionary" index={i} />
              ))}
              {Array.from({ length: cr }, (_, i) => (
                <PersonIcon key={`cr-${i}`} type="cannibal" index={i} />
              ))}
            </AnimatePresence>
          </div>
          <div className="text-xs font-mono text-center text-muted-foreground mt-2">
            {mr}M {cr}C
          </div>
        </div>
      </div>
    </div>
  );
}
