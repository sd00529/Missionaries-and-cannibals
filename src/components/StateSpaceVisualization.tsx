import { useMemo } from 'react';
import { INITIAL_STATE, getSuccessors, stateKey, isGoal, GameState } from '@/lib/gameLogic';

export default function StateSpaceVisualization() {
  const graph = useMemo(() => {
    const visited = new Set<string>();
    const nodes: { key: string; state: GameState; isGoal: boolean; isStart: boolean }[] = [];
    const edges: { from: string; to: string }[] = [];
    const queue: GameState[] = [INITIAL_STATE];
    visited.add(stateKey(INITIAL_STATE));

    while (queue.length > 0) {
      const current = queue.shift()!;
      const ck = stateKey(current);
      nodes.push({ key: ck, state: current, isGoal: isGoal(current), isStart: ck === stateKey(INITIAL_STATE) });

      for (const { state } of getSuccessors(current)) {
        const sk = stateKey(state);
        edges.push({ from: ck, to: sk });
        if (!visited.has(sk)) {
          visited.add(sk);
          queue.push(state);
        }
      }
    }

    return { nodes, edges };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold">State Space</h3>
        <p className="text-sm text-muted-foreground">All valid states and transitions ({graph.nodes.length} states, {graph.edges.length} transitions)</p>
      </div>

      <div className="glass rounded-xl p-4 overflow-x-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {graph.nodes.map(n => (
            <div
              key={n.key}
              className={`rounded-lg px-3 py-2 text-xs font-mono border transition-all ${
                n.isStart
                  ? 'bg-primary/20 border-primary text-primary glow-primary'
                  : n.isGoal
                  ? 'bg-success/20 border-success text-success glow-accent'
                  : 'bg-secondary border-border text-muted-foreground'
              }`}
            >
              <div className="font-bold">{n.state[0]}M,{n.state[1]}C</div>
              <div className="text-[9px] opacity-70">boat {n.state[2] ? 'L' : 'R'}</div>
              {n.isStart && <div className="text-[9px] mt-0.5">START</div>}
              {n.isGoal && <div className="text-[9px] mt-0.5">GOAL</div>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/20 border border-primary" /> Initial</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/20 border border-success" /> Goal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary border border-border" /> Valid State</span>
        </div>
      </div>
    </div>
  );
}
