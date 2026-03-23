import { useMemo } from 'react';
import { bfs, dfs, astar } from '@/lib/gameLogic';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function ComparisonChart() {
  const data = useMemo(() => {
    const bfsR = bfs();
    const dfsR = dfs();
    const astarR = astar();
    return { bfs: bfsR, dfs: dfsR, astar: astarR };
  }, []);

  const barData = [
    {
      metric: 'Path Length',
      BFS: data.bfs.moves.length,
      DFS: data.dfs.moves.length,
      'A*': data.astar.moves.length,
    },
    {
      metric: 'Nodes Expanded',
      BFS: data.bfs.nodesExpanded,
      DFS: data.dfs.nodesExpanded,
      'A*': data.astar.nodesExpanded,
    },
    {
      metric: 'Max Frontier',
      BFS: data.bfs.frontierMax,
      DFS: data.dfs.frontierMax,
      'A*': data.astar.frontierMax,
    },
  ];

  const maxVal = Math.max(
    data.bfs.moves.length, data.dfs.moves.length, data.astar.moves.length,
    data.bfs.nodesExpanded, data.dfs.nodesExpanded, data.astar.nodesExpanded,
    data.bfs.frontierMax, data.dfs.frontierMax, data.astar.frontierMax
  );

  const radarData = [
    { metric: 'Path Optimality', BFS: 1 - data.bfs.moves.length / (maxVal+1), DFS: 1 - data.dfs.moves.length / (maxVal+1), 'A*': 1 - data.astar.moves.length / (maxVal+1) },
    { metric: 'Efficiency', BFS: 1 - data.bfs.nodesExpanded / (maxVal+1), DFS: 1 - data.dfs.nodesExpanded / (maxVal+1), 'A*': 1 - data.astar.nodesExpanded / (maxVal+1) },
    { metric: 'Memory', BFS: 1 - data.bfs.frontierMax / (maxVal+1), DFS: 1 - data.dfs.frontierMax / (maxVal+1), 'A*': 1 - data.astar.frontierMax / (maxVal+1) },
  ];

  const comparisonTable = [
    { property: 'Complete?', bfs: '✅ Yes', dfs: '⚠️ With cycle detection', astar: '✅ Yes' },
    { property: 'Optimal?', bfs: '✅ Yes (uniform cost)', dfs: '❌ No', astar: '✅ Yes (admissible h)' },
    { property: 'Time Complexity', bfs: 'O(b^d)', dfs: 'O(b^m)', astar: 'O(b^d)' },
    { property: 'Space Complexity', bfs: 'O(b^d)', dfs: 'O(bm)', astar: 'O(b^d)' },
    { property: 'Uses Heuristic?', bfs: '❌ No', dfs: '❌ No', astar: '✅ Yes' },
    { property: 'Solution Length', bfs: `${data.bfs.moves.length} steps`, dfs: `${data.dfs.moves.length} steps`, astar: `${data.astar.moves.length} steps` },
    { property: 'Nodes Expanded', bfs: `${data.bfs.nodesExpanded}`, dfs: `${data.dfs.nodesExpanded}`, astar: `${data.astar.nodesExpanded}` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-display font-semibold">Algorithm Comparison</h3>
        <p className="text-sm text-muted-foreground">Performance metrics across BFS, DFS, and A*</p>
      </div>

      {/* Bar Chart */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">Metrics Comparison</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 18%)" />
            <XAxis dataKey="metric" tick={{ fill: 'hsl(210 12% 55%)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(210 12% 55%)', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: 'hsl(210 25% 10%)', border: '1px solid hsl(210 20% 18%)', borderRadius: '8px', color: 'hsl(200 20% 92%)' }}
            />
            <Legend />
            <Bar dataKey="BFS" fill="hsl(195, 80%, 50%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="DFS" fill="hsl(40, 90%, 55%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="A*" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">Performance Radar</h4>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(210 20% 18%)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(210 12% 55%)', fontSize: 11 }} />
            <PolarRadiusAxis tick={false} domain={[0, 1]} />
            <Radar name="BFS" dataKey="BFS" stroke="hsl(195, 80%, 50%)" fill="hsl(195, 80%, 50%)" fillOpacity={0.2} />
            <Radar name="DFS" dataKey="DFS" stroke="hsl(40, 90%, 55%)" fill="hsl(40, 90%, 55%)" fillOpacity={0.2} />
            <Radar name="A*" dataKey="A*" stroke="hsl(160, 60%, 45%)" fill="hsl(160, 60%, 45%)" fillOpacity={0.2} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-mono text-xs text-muted-foreground uppercase">Property</th>
              <th className="text-center p-3 font-mono text-xs text-primary uppercase">BFS</th>
              <th className="text-center p-3 font-mono text-xs text-warning uppercase">DFS</th>
              <th className="text-center p-3 font-mono text-xs text-success uppercase">A*</th>
            </tr>
          </thead>
          <tbody>
            {comparisonTable.map(row => (
              <tr key={row.property} className="border-b border-border/50">
                <td className="p-3 font-medium">{row.property}</td>
                <td className="p-3 text-center font-mono text-xs">{row.bfs}</td>
                <td className="p-3 text-center font-mono text-xs">{row.dfs}</td>
                <td className="p-3 text-center font-mono text-xs">{row.astar}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
