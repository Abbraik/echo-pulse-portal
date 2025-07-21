import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { 
  Play, 
  Target, 
  Users, 
  Settings,
  ChevronDown,
  BarChart3,
  Zap,
  Globe,
  Building,
  TrendingUp
} from 'lucide-react';

const tensionSignals = [
  { id: 'healthcare-access', name: 'Healthcare Access Bottleneck', severity: 'high' },
  { id: 'education-quality', name: 'Education Quality Decline', severity: 'medium' },
  { id: 'housing-affordability', name: 'Housing Affordability Crisis', severity: 'high' },
  { id: 'transport-efficiency', name: 'Transport System Inefficiency', severity: 'medium' },
  { id: 'environmental-degradation', name: 'Environmental Degradation', severity: 'critical' },
];

const leveragePoints = [
  { 
    id: 'governance', 
    name: 'Governance Structure', 
    icon: Building, 
    description: 'Policy frameworks and institutional design'
  },
  { 
    id: 'resources', 
    name: 'Resource Allocation', 
    icon: TrendingUp, 
    description: 'Budget and resource distribution mechanisms'
  },
  { 
    id: 'stakeholder', 
    name: 'Stakeholder Networks', 
    icon: Users, 
    description: 'Community engagement and partnerships'
  },
  { 
    id: 'technology', 
    name: 'Technology Integration', 
    icon: Zap, 
    description: 'Digital transformation and automation'
  },
  { 
    id: 'geography', 
    name: 'Geographic Focus', 
    icon: Globe, 
    description: 'Spatial distribution and regional targeting'
  },
];

const RgsThinkZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [currentWeek] = useState(4);
  const [totalWeeks] = useState(6);
  const [selectedTension, setSelectedTension] = useState<string>('');
  const [srtHorizon, setSrtHorizon] = useState([12]);
  const [selectedLeverage, setSelectedLeverage] = useState<string>('');
  
  // Advanced settings state
  const [deBandUpper, setDeBandUpper] = useState(85);
  const [deBandLower, setDeBandLower] = useState(15);
  const [srtBreakdown, setSrtBreakdown] = useState('quarters');
  const [loopId, setLoopId] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // PulseBar summary data
  const pulseData = { critical: 2, warning: 3, upcoming: 5 };

  return (
    <TooltipProvider>
      <div className="min-h-screen p-6 flex items-center justify-center">
        {/* Central Glassmorphic Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-4xl"
          style={{ width: '60%' }}
        >
          <Card className="bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h1 className="text-xl font-semibold text-primary">
                Sprint Progress: Week {currentWeek} of {totalWeeks}
              </h1>
              
              {/* PulseBar Summary Chip */}
              <div className="flex items-center gap-2 bg-background/30 rounded-lg px-3 py-2">
                <span className="text-red-400">🔴{pulseData.critical}</span>
                <span className="text-yellow-400">🟡{pulseData.warning}</span>
                <span className="text-blue-400">📅{pulseData.upcoming}</span>
              </div>
            </div>

            <CardContent className="p-6 space-y-8">
              
              {/* Core Inputs */}
              <div className="space-y-6">
                
                {/* Tension Signal Selector */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    <Tooltip>
                      <TooltipTrigger className="border-b border-dotted border-muted-foreground cursor-help">
                        Tension Signal
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>System stress points requiring intervention</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Select value={selectedTension} onValueChange={setSelectedTension}>
                    <SelectTrigger className="w-2/3 h-12 bg-background/50 border-white/20">
                      <SelectValue placeholder="Select tension signal..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tensionSignals.map((signal) => (
                        <SelectItem key={signal.id} value={signal.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{signal.name}</span>
                            <Badge 
                              variant={signal.severity === 'critical' ? 'destructive' : signal.severity === 'high' ? 'default' : 'secondary'}
                              className="ml-2 text-xs"
                            >
                              {signal.severity}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* SRT Horizon Slider */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    <Tooltip>
                      <TooltipTrigger className="border-b border-dotted border-muted-foreground cursor-help">
                        SRT Horizon (months)
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>System Responsiveness Threshold timeline</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  
                  <div className="space-y-3">
                    <div className="px-3">
                      <Slider
                        value={srtHorizon}
                        onValueChange={setSrtHorizon}
                        max={24}
                        min={1}
                        step={1}
                        className="w-full [&_.slider-thumb]:hover:scale-110 [&_.slider-thumb]:transition-transform [&_.slider-thumb]:duration-150"
                      />
                    </div>
                    
                    {/* Tick marks */}
                    <div className="flex justify-between text-xs text-muted-foreground px-3">
                      <span>1mo</span>
                      <span>6mo</span>
                      <span>12mo</span>
                      <span>18mo</span>
                      <span>24mo</span>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-lg font-semibold text-primary">{srtHorizon[0]} months</span>
                    </div>
                  </div>
                </div>

                {/* Leverage Point Picker */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Leverage Point Selection</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {leveragePoints.map((point) => {
                      const IconComponent = point.icon;
                      return (
                        <motion.div
                          key={point.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Card 
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedLeverage === point.id 
                                ? 'border-primary bg-primary/10 shadow-md' 
                                : 'border-white/20 bg-background/30 hover:bg-background/50'
                            }`}
                            onClick={() => setSelectedLeverage(point.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                selectedLeverage === point.id ? 'bg-primary/20' : 'bg-white/10'
                              }`}>
                                <IconComponent className={`h-5 w-5 ${
                                  selectedLeverage === point.id ? 'text-primary' : 'text-muted-foreground'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-sm">{point.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{point.description}</p>
                              </div>
                              {selectedLeverage === point.id && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Primary Action */}
              <div className="flex justify-center pt-6">
                <Button 
                  size="lg" 
                  className="bg-primary text-white rounded-xl py-3 px-8 text-lg font-semibold hover:scale-105 transition-transform duration-150"
                  disabled={!selectedTension || !selectedLeverage}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Sprint
                </Button>
              </div>

              {/* Advanced Settings Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced-settings" className="border-white/10">
                  <AccordionTrigger className="flex justify-between items-center p-3 cursor-pointer hover:no-underline text-base">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Advanced Settings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    
                    {/* DE-Band Controls */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        <Tooltip>
                          <TooltipTrigger className="border-b border-dotted border-muted-foreground cursor-help">
                            DE-Band Bounds
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Dynamic Equilibrium Band thresholds</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <Label htmlFor="de-upper" className="text-xs text-muted-foreground">Upper Bound</Label>
                          <Input
                            id="de-upper"
                            type="number"
                            value={deBandUpper}
                            onChange={(e) => setDeBandUpper(Number(e.target.value))}
                            className="bg-background/50 border-white/20"
                            min={50}
                            max={100}
                          />
                        </div>
                        <div className="w-1/3">
                          <Label htmlFor="de-lower" className="text-xs text-muted-foreground">Lower Bound</Label>
                          <Input
                            id="de-lower"
                            type="number"
                            value={deBandLower}
                            onChange={(e) => setDeBandLower(Number(e.target.value))}
                            className="bg-background/50 border-white/20"
                            min={0}
                            max={50}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SRT Breakdown Toggle */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">SRT Breakdown</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={srtBreakdown === 'months'}
                            onCheckedChange={(checked) => setSrtBreakdown(checked ? 'months' : 'quarters')}
                          />
                          <Label className="text-sm">Monthly granularity</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={srtBreakdown === 'quarters'}
                            onCheckedChange={(checked) => setSrtBreakdown(checked ? 'quarters' : 'months')}
                          />
                          <Label className="text-sm">Quarterly summary</Label>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="loop-id" className="text-sm font-medium">Loop ID</Label>
                        <Input
                          id="loop-id"
                          value={loopId}
                          onChange={(e) => setLoopId(e.target.value)}
                          placeholder="e.g., HEALTH-001"
                          className="bg-background/50 border-white/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Tags</Label>
                        <Input
                          placeholder="policy, urgent, pilot"
                          className="bg-background/50 border-white/20"
                        />
                      </div>
                    </div>

                    {/* CLD Studio Launcher */}
                    <div className="pt-4 border-t border-white/10">
                      <Button variant="outline" className="w-full text-primary">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Open CLD Studio
                      </Button>
                    </div>

                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export default RgsThinkZone;