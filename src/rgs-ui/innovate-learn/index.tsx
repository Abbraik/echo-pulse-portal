import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { 
  Play, 
  Lightbulb, 
  Zap, 
  Download, 
  BookOpen, 
  Clock,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  Settings,
  FileText,
  GitBranch
} from 'lucide-react';

const insightFeed = [
  {
    id: 'insight-001',
    title: 'Healthcare system optimization reveals 23% efficiency gain potential',
    loopRef: 'SDG-3',
    timestamp: '2 hours ago'
  },
  {
    id: 'insight-002', 
    title: 'Education quality patterns correlate with teacher training investment cycles',
    loopRef: 'SDG-4',
    timestamp: '5 hours ago'
  },
  {
    id: 'insight-003',
    title: 'Transport infrastructure timing affects economic development trajectories',
    loopRef: 'SDG-9',
    timestamp: '1 day ago'
  }
];

const lastRunData = {
  scenario: 'Healthcare Reform 2024',
  keyMetric: 'Δ = +34%',
  chartThumbnail: true
};

const RgsInnovateLearnZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [selectedInsight, setSelectedInsight] = useState<string>('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-6"
    >
      {/* Main Glass Panel with Two-Column Layout */}
      <div className="p-6 bg-glass backdrop-blur-xl rounded-2xl shadow-lg border-white/10">
        <div className="grid grid-cols-5 gap-6">
          
          {/* Left Column (60%) - Insight Feed */}
          <div className="col-span-3 space-y-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Insight Feed
            </h2>
            
            {insightFeed.map((insight) => (
              <motion.div
                key={insight.id}
                className="mb-4 p-4 bg-white/10 rounded-lg transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-medium mb-2">{insight.title}</h3>
                <Button variant="link" className="text-accent underline p-0 h-auto">
                  Try Experiment ▶
                </Button>
                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {insight.timestamp} • Loop: {insight.loopRef}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column (40%) - Quick-Run & Last Run */}
          <div className="col-span-2 space-y-6">
            
            {/* Quick-Run Panel */}
            <div>
              <h2 className="text-lg mb-2">Run New Experiment</h2>
              
              <div className="space-y-2">
                <select className="w-full mb-2 p-2 rounded-md bg-background/50 border border-white/20 text-sm">
                  <option>Param X: Policy Impact</option>
                  <option>Param X: Resource Allocation</option>
                  <option>Param X: Timeline Optimization</option>
                </select>
                
                <select className="w-full mb-2 p-2 rounded-md bg-background/50 border border-white/20 text-sm">
                  <option>Param Y: Geographic Scope</option>
                  <option>Param Y: Stakeholder Groups</option>
                  <option>Param Y: Budget Constraints</option>
                </select>
              </div>

              <div className="flex gap-2 mt-4">
                <Button className="bg-primary text-white py-2 rounded-xl flex-1">
                  Run Simulation
                </Button>
                <Button variant="link" className="text-primary underline ml-2 text-sm">
                  Run Shock-Rehearsal ▶
                </Button>
              </div>
            </div>

            {/* Last Run Preview */}
            <Card className="p-3 bg-white/10 rounded-lg mt-4">
              <CardContent className="p-0">
                {/* Thumbnail Chart */}
                <div className="h-24 w-full mb-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                
                <div className="text-center">
                  <div className="font-medium text-lg">{lastRunData.keyMetric}</div>
                  <div className="text-sm text-muted-foreground">{lastRunData.scenario}</div>
                </div>
              </CardContent>
            </Card>

            {/* Export Links */}
            <div className="space-y-2 text-sm">
              <Button variant="link" className="p-0 h-auto text-accent underline">
                <Download className="h-3 w-3 mr-1" />
                Export ORS Bundle
              </Button>
              <br />
              <Button variant="link" className="p-0 h-auto text-accent underline">
                <FileText className="h-3 w-3 mr-1" />
                Download Lesson Summary
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Settings Accordion */}
        <Accordion type="single" collapsible className="mt-6">
          <AccordionItem value="advanced-settings" className="border-white/20">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Settings
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              
              {/* Simulation Parameter Sweeps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Simulation Parameter Sweeps</h4>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="range" 
                    className="w-full" 
                    placeholder="Min Value"
                  />
                  <input 
                    type="range" 
                    className="w-full" 
                    placeholder="Max Value"
                  />
                  <input 
                    type="number" 
                    className="w-full p-1 rounded bg-background/50 border border-white/20 text-xs" 
                    placeholder="Steps"
                  />
                </div>
              </div>

              {/* ORS Export Selectors */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">ORS Export File Selectors</h4>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" className="rounded" />
                    Policy Recommendations
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" className="rounded" />
                    Resource Allocation Matrix
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" className="rounded" />
                    Timeline & Milestones
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" className="rounded" />
                    Risk Assessment
                  </label>
                </div>
              </div>

              {/* Knowledge Graph Toggle */}
              <div className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  <span className="text-sm">Full Knowledge Graph</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-white/20 rounded-full flex items-center justify-start px-1">
                    <div className="w-4 h-4 bg-primary rounded-full transition-transform" />
                  </div>
                  <div className="w-8 h-6 bg-gradient-to-br from-primary/30 to-accent/30 rounded flex items-center justify-center">
                    <div className="text-xs">3D</div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
};

export default RgsInnovateLearnZone;