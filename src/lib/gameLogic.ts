// State: [missionariesLeft, cannibalsLeft, boatOnLeft]
export type GameState = [number, number, boolean];
export type Move = [number, number]; // [missionaries, cannibals] to move

export const INITIAL_STATE: GameState = [3, 3, true];
export const GOAL_STATE: GameState = [0, 0, false];

export const POSSIBLE_MOVES: Move[] = [
  [1, 0], [2, 0], [0, 1], [0, 2], [1, 1],
];

export function stateKey(s: GameState): string {
  return `${s[0]},${s[1]},${s[2] ? 1 : 0}`;
}

export function isValid(s: GameState): boolean {
  const [ml, cl, _] = s;
  const mr = 3 - ml;
  const cr = 3 - cl;
  if (ml < 0 || cl < 0 || mr < 0 || cr < 0) return false;
  if (ml > 3 || cl > 3 || mr > 3 || cr > 3) return false;
  // Missionaries can't be outnumbered where they exist
  if (ml > 0 && cl > ml) return false;
  if (mr > 0 && cr > mr) return false;
  return true;
}

export function isGoal(s: GameState): boolean {
  return s[0] === 0 && s[1] === 0 && !s[2];
}

export function getSuccessors(s: GameState): { state: GameState; move: Move }[] {
  const [ml, cl, boatLeft] = s;
  const results: { state: GameState; move: Move }[] = [];

  for (const [m, c] of POSSIBLE_MOVES) {
    if (m + c < 1 || m + c > 2) continue;
    let newState: GameState;
    if (boatLeft) {
      newState = [ml - m, cl - c, false];
    } else {
      newState = [ml + m, cl + c, true];
    }
    if (isValid(newState)) {
      results.push({ state: newState, move: [m, c] });
    }
  }
  return results;
}

export function getMoveDescription(move: Move, fromLeft: boolean): string {
  const [m, c] = move;
  const people: string[] = [];
  if (m > 0) people.push(`${m} missionary${m > 1 ? 's' : ''}`);
  if (c > 0) people.push(`${c} cannibal${c > 1 ? 's' : ''}`);
  const dir = fromLeft ? '→ right' : '← left';
  return `Move ${people.join(' and ')} ${dir}`;
}

export interface SearchResult {
  path: GameState[];
  moves: Move[];
  nodesExpanded: number;
  frontierMax: number;
  executionTime: number;
  exploredStates: Set<string>;
  algorithm: string;
}

// BFS
export function bfs(): SearchResult {
  const start = performance.now();
  const queue: { state: GameState; path: GameState[]; moves: Move[] }[] = [
    { state: INITIAL_STATE, path: [INITIAL_STATE], moves: [] },
  ];
  const visited = new Set<string>([stateKey(INITIAL_STATE)]);
  let nodesExpanded = 0;
  let frontierMax = 1;

  while (queue.length > 0) {
    frontierMax = Math.max(frontierMax, queue.length);
    const current = queue.shift()!;
    nodesExpanded++;

    if (isGoal(current.state)) {
      return {
        path: current.path,
        moves: current.moves,
        nodesExpanded,
        frontierMax,
        executionTime: performance.now() - start,
        exploredStates: visited,
        algorithm: 'BFS',
      };
    }

    for (const { state, move } of getSuccessors(current.state)) {
      const key = stateKey(state);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          state,
          path: [...current.path, state],
          moves: [...current.moves, move],
        });
      }
    }
  }

  return { path: [], moves: [], nodesExpanded, frontierMax, executionTime: performance.now() - start, exploredStates: visited, algorithm: 'BFS' };
}

// DFS
export function dfs(): SearchResult {
  const start = performance.now();
  const stack: { state: GameState; path: GameState[]; moves: Move[] }[] = [
    { state: INITIAL_STATE, path: [INITIAL_STATE], moves: [] },
  ];
  const visited = new Set<string>([stateKey(INITIAL_STATE)]);
  let nodesExpanded = 0;
  let frontierMax = 1;

  while (stack.length > 0) {
    frontierMax = Math.max(frontierMax, stack.length);
    const current = stack.pop()!;
    nodesExpanded++;

    if (isGoal(current.state)) {
      return {
        path: current.path,
        moves: current.moves,
        nodesExpanded,
        frontierMax,
        executionTime: performance.now() - start,
        exploredStates: visited,
        algorithm: 'DFS',
      };
    }

    for (const { state, move } of getSuccessors(current.state)) {
      const key = stateKey(state);
      if (!visited.has(key)) {
        visited.add(key);
        stack.push({
          state,
          path: [...current.path, state],
          moves: [...current.moves, move],
        });
      }
    }
  }

  return { path: [], moves: [], nodesExpanded, frontierMax, executionTime: performance.now() - start, exploredStates: visited, algorithm: 'DFS' };
}

// A* with heuristic: people remaining on left side
function heuristic(s: GameState): number {
  return s[0] + s[1]; // people left to move
}

export function astar(): SearchResult {
  const start = performance.now();
  const open: { state: GameState; path: GameState[]; moves: Move[]; g: number; f: number }[] = [
    { state: INITIAL_STATE, path: [INITIAL_STATE], moves: [], g: 0, f: heuristic(INITIAL_STATE) },
  ];
  const visited = new Set<string>();
  let nodesExpanded = 0;
  let frontierMax = 1;

  while (open.length > 0) {
    frontierMax = Math.max(frontierMax, open.length);
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const key = stateKey(current.state);

    if (visited.has(key)) continue;
    visited.add(key);
    nodesExpanded++;

    if (isGoal(current.state)) {
      return {
        path: current.path,
        moves: current.moves,
        nodesExpanded,
        frontierMax,
        executionTime: performance.now() - start,
        exploredStates: visited,
        algorithm: 'A*',
      };
    }

    for (const { state, move } of getSuccessors(current.state)) {
      const sk = stateKey(state);
      if (!visited.has(sk)) {
        const g = current.g + 1;
        open.push({
          state,
          path: [...current.path, state],
          moves: [...current.moves, move],
          g,
          f: g + heuristic(state),
        });
      }
    }
  }

  return { path: [], moves: [], nodesExpanded, frontierMax, executionTime: performance.now() - start, exploredStates: visited, algorithm: 'A*' };
}

export function getAgentReasoning(state: GameState, move: Move): string {
  const [m, c] = move;
  const fromLeft = state[2];
  const ml = state[0], cl = state[1];
  
  const reasons: string[] = [];
  
  if (fromLeft) {
    if (m === 0 && c > 0) {
      reasons.push('Moving only cannibals reduces risk of outnumbering missionaries on the left bank.');
    }
    if (m > 0 && c > 0) {
      reasons.push('Moving equal numbers maintains balance on both sides.');
    }
    if (m > 0 && c === 0) {
      reasons.push('Moving missionaries toward the goal while keeping them safe.');
    }
    reasons.push(`After this move: Left bank will have ${ml - m}M, ${cl - c}C. Right bank will have ${3 - ml + m}M, ${3 - cl + c}C.`);
  } else {
    reasons.push('Boat must return to fetch remaining people.');
    if (m === 0 && c > 0) {
      reasons.push('Sending back cannibals is safe — they can\'t outnumber missionaries if none are present.');
    }
    if (m > 0) {
      reasons.push('Returning a missionary to escort more people safely.');
    }
  }
  
  return reasons.join(' ');
}
