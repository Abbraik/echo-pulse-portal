import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { 
  Play, 
  Settings, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';

const leveragePoints = [
  { id: 'governance', name: 'Governance Structure', impact: 'high', complexity: 'medium' },
  { id: 'policy', name: 'Policy Framework', impact: 'medium', complexity: 'low' },
  { id: 'resources', name: 'Resource Allocation', impact: 'high', complexity: 'high' },
  { id: 'stakeholder', name: 'Stakeholder Engagement', impact: 'medium', complexity: 'medium' },
];

const RgsThinkZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [sprintProgress] = useState(67);
  const [tensionSignal] = useState(78);
  const [srtValue, setSrtValue] = useState([15]);
  const [selectedLeverage, setSelectedLeverage] = useState<string>('');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="p-6 space-y-6"
    >
      {/* Sprint Progress Section */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Clock className="h-5 w-5 text-primary" />
            Sprint Progress
            <Badge variant="outline" className="ml-auto">Week 4/6</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">{sprintProgress}%</span>
            </div>
            <Progress value={sprintProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">12</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">5</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">2</div>
              <div className="text-xs text-muted-foreground">Blocked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tension Signal & SRT */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Tension Signal
            <Badge variant={tensionSignal > 70 ? "destructive" : "secondary"} className="ml-auto">
              {tensionSignal}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Responsiveness Threshold (SRT)</span>
              <span className="font-medium">±{srtValue[0]}%</span>
            </div>
            <Slider
              value={srtValue}
              onValueChange={setSrtValue}
              max={30}
              min={5}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>30%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <TrendingUp className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">Tension above normal range - consider intervention</span>
          </div>
        </CardContent>
      </Card>

      {/* Leverage Point Picker */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Target className="h-5 w-5 text-primary" />
            Leverage Point Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedLeverage} onValueChange={setSelectedLeverage}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary leverage point" />
            </SelectTrigger>
            <SelectContent>
              {leveragePoints.map((point) => (
                <SelectItem key={point.id} value={point.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{point.name}</span>
                    <div className="flex gap-1 ml-2">
                      <Badge variant={point.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                        {point.impact}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedLeverage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4 pt-2"
            >
              <div className="space-y-2">
                <div className="text-sm font-medium">Impact Potential</div>
                <Badge variant="default">High</Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Implementation Complexity</div>
                <Badge variant="secondary">Medium</Badge>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Primary CTA */}
      <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Button size="lg" className="w-full h-12 text-lg font-semibold">
              <Play className="mr-2 h-5 w-5" />
              Start Sprint
            </Button>
            <p className="text-sm text-muted-foreground">
              Launch intervention sprint with selected leverage points
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      {flags.newRgsAdvancedSettings && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced" className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Settings
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">DE-Band Configuration</label>
                  <Select defaultValue="adaptive">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adaptive">Adaptive</SelectItem>
                      <SelectItem value="fixed">Fixed Thresholds</SelectItem>
                      <SelectItem value="dynamic">Dynamic Scaling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loop Metadata Depth</label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Launch CLD Studio
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </motion.div>
  );
};

export default RgsThinkZone;