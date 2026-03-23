import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Search, Brain, Target } from 'lucide-react';

const sections = [
  {
    id: 'problem',
    icon: Target,
    title: 'Problem Formulation',
    content: `The Missionaries and Cannibals problem is a classic AI problem. Three missionaries and three cannibals must cross a river using a boat that can carry at most two people.

**Constraint:** On either bank, if missionaries are present, they must not be outnumbered by cannibals — otherwise the cannibals eat them!

**State representation:** (M_left, C_left, Boat_position) — e.g., (3,3,L) is the initial state. The goal is (0,0,R).

**State space:** All valid combinations of missionaries, cannibals, and boat position. Invalid states (where cannibals outnumber missionaries) are pruned from the search.`,
  },
  {
    id: 'search',
    icon: Search,
    title: 'State Space & Search',
    content: `The problem can be modeled as a **graph** where each node is a valid state and edges represent legal moves.

**State Space:** With 4 possible values each for M and C (0-3) and 2 for boat position, there are at most 32 states — but only ~16 are valid after constraint checking.

**Search** means systematically exploring this graph from the initial state to find a path to the goal state. The search tree may revisit states, so we track visited nodes to avoid cycles.`,
  },
  {
    id: 'algorithms',
    icon: BookOpen,
    title: 'BFS, DFS, and A*',
    content: `**Breadth-First Search (BFS):** Explores all states at depth d before depth d+1. Guarantees the shortest path. Uses a queue (FIFO). Space-intensive.

**Depth-First Search (DFS):** Explores as deep as possible before backtracking. Uses a stack (LIFO). Memory-efficient but may find longer paths. Not guaranteed optimal.

**A* Search:** Uses f(n) = g(n) + h(n), where g(n) is the cost so far and h(n) is a heuristic estimate to the goal. With an admissible heuristic (never overestimates), A* is both complete and optimal. Our heuristic: number of people remaining on the left bank.`,
  },
  {
    id: 'agents',
    icon: Brain,
    title: 'Intelligent Agents & Rationality',
    content: `An **intelligent agent** perceives its environment and takes actions to achieve goals. In our simulation, the agent:

- **Perceives:** Current state (people on each bank, boat position)
- **Acts:** Chooses a valid move to transport people
- **Reasons:** Uses a search algorithm to find the optimal path

A **rational agent** always acts to maximize its performance measure. Here, that means finding the shortest valid sequence of moves. The agent's decision-making is transparent — you can see why each move is chosen at every step.

**Performance measures:** Path length (fewer moves = better), nodes expanded (fewer = more efficient), and execution time.`,
  },
];

export default function EducationSection() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-display font-semibold">AI Concepts</h3>
        <p className="text-sm text-muted-foreground">Learn the theory behind the problem</p>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {sections.map(s => (
          <AccordionItem key={s.id} value={s.id} className="glass rounded-xl border-none px-4">
            <AccordionTrigger className="hover:no-underline gap-3">
              <div className="flex items-center gap-3">
                <s.icon className="w-5 h-5 text-primary" />
                <span className="font-display font-medium">{s.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {s.content.split('**').map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : <span key={i}>{part}</span>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
