import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gamepad2, Bot, BarChart3, BookOpen, Map } from 'lucide-react';
import ManualPlay from '@/components/ManualPlay';
import AlgorithmSolver from '@/components/AlgorithmSolver';
import ComparisonChart from '@/components/ComparisonChart';
import EducationSection from '@/components/EducationSection';
import StateSpaceVisualization from '@/components/StateSpaceVisualization';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container max-w-5xl mx-auto px-4 py-12 sm:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="text-4xl sm:text-6xl font-display font-bold tracking-tight">
              <span className="text-gradient">Missionaries</span>
              <span className="text-muted-foreground"> & </span>
              <span className="text-gradient">Cannibals</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              An interactive AI visualization exploring problem formulation, search algorithms, 
              and intelligent agents through the classic river-crossing puzzle.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-muted-foreground">
              <span className="px-2 py-1 rounded bg-secondary">BFS</span>
              <span className="px-2 py-1 rounded bg-secondary">DFS</span>
              <span className="px-2 py-1 rounded bg-secondary">A*</span>
              <span className="px-2 py-1 rounded bg-secondary">Intelligent Agent</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="play" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/50 p-1">
            <TabsTrigger value="play" className="gap-1 text-xs sm:text-sm font-mono">
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Play</span>
            </TabsTrigger>
            <TabsTrigger value="solve" className="gap-1 text-xs sm:text-sm font-mono">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Solve</span>
            </TabsTrigger>
            <TabsTrigger value="states" className="gap-1 text-xs sm:text-sm font-mono">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">States</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-1 text-xs sm:text-sm font-mono">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="gap-1 text-xs sm:text-sm font-mono">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="play"><ManualPlay /></TabsContent>
          <TabsContent value="solve"><AlgorithmSolver /></TabsContent>
          <TabsContent value="states"><StateSpaceVisualization /></TabsContent>
          <TabsContent value="compare"><ComparisonChart /></TabsContent>
          <TabsContent value="learn"><EducationSection /></TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground font-mono">
        Missionaries & Cannibals — AI Problem Solving Visualization
      </footer>
    </div>
  );
}
