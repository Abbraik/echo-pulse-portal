import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { 
  Play, 
  Lightbulb, 
  Zap, 
  Download, 
  BookOpen, 
  Rocket,
  TrendingUp,
  Clock,
  Target,
  FileText,
  ExternalLink
} from 'lucide-react';

const insightFeed = [
  {
    id: 'insight-001',
    title: 'Healthcare Access Optimization',
    description: 'AI-identified pattern suggests 23% improvement through resource redistribution',
    type: 'optimization',
    confidence: 87,
    impact: 'high',
    timestamp: '2 hours ago'
  },
  {
    id: 'insight-002', 
    title: 'Education Quality Enhancement',
    description: 'Cross-loop analysis reveals correlation between teacher training and outcomes',
    type: 'correlation',
    confidence: 92,
    impact: 'medium',
    timestamp: '5 hours ago'
  },
  {
    id: 'insight-003',
    title: 'Transport Infrastructure Synergy',
    description: 'Economic development patterns suggest infrastructure investment timing',
    type: 'timing',
    confidence: 78,
    impact: 'high',
    timestamp: '1 day ago'
  }
];

const lastRunData = {
  scenario: 'Healthcare Reform 2024',
  duration: '6.2 hours',
  outcomes: 847,
  confidence: 89,
  completedAt: '2024-01-15 14:30',
  keyFindings: [
    'Resource allocation efficiency +34%',
    'Patient satisfaction improvement +28%',
    'System responsiveness increase +41%'
  ]
};

const RgsInnovateLearnZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [selectedInsight, setSelectedInsight] = useState<string>('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6"
    >
      {/* Insight Feed */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Insight Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insightFeed.map((insight) => (
            <motion.div
              key={insight.id}
              className="p-4 rounded-lg bg-background/50 border border-white/10 hover:bg-background/70 transition-all cursor-pointer"
              onClick={() => setSelectedInsight(insight.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{insight.title}</h3>
                <div className="flex gap-2">
                  <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                    {insight.impact}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {insight.timestamp}
                </span>
                <Button variant="outline" size="sm">
                  <Zap className="h-3 w-3 mr-1" />
                  Try Experiment
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Quick-Run Simulation Panel */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Rocket className="h-5 w-5 text-primary" />
            Quick-Run Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Scenario Type</label>
              <select className="w-full p-2 rounded-md bg-background/50 border border-white/20">
                <option>Policy Impact Assessment</option>
                <option>Resource Optimization</option>
                <option>Risk Mitigation</option>
                <option>Innovation Pathway</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Horizon</label>
              <select className="w-full p-2 rounded-md bg-background/50 border border-white/20">
                <option>6 months</option>
                <option>1 year</option>
                <option>2 years</option>
                <option>5 years</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <Play className="mr-2 h-4 w-4" />
              Run Simulation
            </Button>
            <Button variant="outline" className="whitespace-nowrap">
              <ExternalLink className="mr-2 h-4 w-4" />
              Run Shock-Rehearsal ▶
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Run Preview */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Last Run Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{lastRunData.scenario}</h3>
              <p className="text-sm text-muted-foreground">
                Completed {lastRunData.completedAt} • Duration: {lastRunData.duration}
              </p>
            </div>
            <Badge variant="default" className="bg-green-500/20 text-green-400">
              {lastRunData.confidence}% accuracy
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-lg font-bold text-primary">{lastRunData.outcomes}</div>
              <div className="text-xs text-muted-foreground">Outcomes Tested</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-lg font-bold text-green-400">+34%</div>
              <div className="text-xs text-muted-foreground">Efficiency Gain</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <div className="text-lg font-bold text-blue-400">+41%</div>
              <div className="text-xs text-muted-foreground">Responsiveness</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Findings:</h4>
            <ul className="space-y-1">
              {lastRunData.keyFindings.map((finding, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary" />
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Export Links */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export ORS Bundle</span>
              </div>
              <span className="text-xs text-muted-foreground">Operational Response Set</span>
            </Button>
            <Button variant="outline" className="h-12 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Lesson Export</span>
              </div>
              <span className="text-xs text-muted-foreground">Knowledge Capture</span>
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-center">
            <Button size="lg" className="w-full h-12 text-lg font-semibold">
              <Play className="mr-2 h-5 w-5" />
              Run Simulation
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Launch comprehensive scenario analysis with selected parameters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Simulation Options */}
      {flags.newRgsAdvancedSettings && (
        <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-5 w-5 text-primary" />
              Advanced Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Advanced Parameters
              </Button>
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Knowledge Graph
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Experiment Template Manager
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default RgsInnovateLearnZone;