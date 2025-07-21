// MONITOR Zone Implementation - System loops oversight
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useFeatureFlags } from '@/hooks/use-feature-flags';
import { format } from 'date-fns';
import {
  Eye,
  Filter,
  Settings,
  Download,
  Calendar as CalendarIcon,
  Bell,
  Mail,
  MessageSquare,
  Smartphone
} from 'lucide-react';

// Sparkline component for inline SVG
const Sparkline: React.FC<{ data: number[]; color?: string }> = ({ data, color = '#22c55e' }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="24" className="inline-block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

// DE-Band Badge component with emoji and tooltip
const DEBandBadge: React.FC<{ status: 'healthy' | 'warning' | 'critical'; tooltipText: string }> = ({ status, tooltipText }) => {
  const getEmoji = () => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-lg cursor-help">{getEmoji()}</span>
      </TooltipTrigger>
      <TooltipContent className="glass-panel-dark">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <p className="text-sm font-medium">DE-Band: {status}</p>
          <p className="text-xs text-muted-foreground">{tooltipText}</p>
        </motion.div>
      </TooltipContent>
    </Tooltip>
  );
};

const loopData = [
  {
    id: 'healthcare-001',
    name: 'Healthcare Access Loop',
    tri: 2.3,
    status: 'critical' as const,
    sparklineData: [65, 59, 80, 81, 56, 55, 40, 35, 42, 28],
    lastUpdate: '2 mins ago',
    tooltipText: 'System requires immediate intervention'
  },
  {
    id: 'education-002', 
    name: 'Education Quality Loop',
    tri: 6.7,
    status: 'warning' as const,
    sparklineData: [45, 52, 49, 58, 62, 65, 68, 70, 69, 72],
    lastUpdate: '5 mins ago',
    tooltipText: 'Monitor closely for degradation'
  },
  {
    id: 'transport-003',
    name: 'Transport Infrastructure',
    tri: 8.2,
    status: 'healthy' as const,
    sparklineData: [78, 82, 85, 87, 89, 91, 88, 90, 92, 95],
    lastUpdate: '1 min ago',
    tooltipText: 'Performing within acceptable range'
  },
  {
    id: 'housing-004',
    name: 'Housing Affordability',
    tri: 4.1,
    status: 'warning' as const,
    sparklineData: [42, 38, 45, 48, 52, 49, 46, 44, 41, 39],
    lastUpdate: '8 mins ago',
    tooltipText: 'Trending toward instability'
  },
  {
    id: 'environment-005',
    name: 'Environmental Sustainability',
    tri: 1.8,
    status: 'critical' as const,
    sparklineData: [25, 22, 28, 30, 27, 24, 21, 18, 15, 12],
    lastUpdate: '3 mins ago',
    tooltipText: 'Critical intervention required'
  }
];

const subIndicators = [
  'Resource Utilization',
  'Stakeholder Satisfaction',
  'Policy Compliance', 
  'Cost Efficiency',
  'Innovation Index',
  'Risk Mitigation'
];

const alertChannels = [
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'sms', name: 'SMS', icon: Smartphone },
  { id: 'slack', name: 'Slack', icon: MessageSquare },
  { id: 'dashboard', name: 'Dashboard', icon: Bell }
];

const RgsMonitorZone: React.FC = () => {
  const { flags } = useFeatureFlags();
  const [showLowTRI, setShowLowTRI] = useState(false);
  const [filteredLoops, setFilteredLoops] = useState(loopData);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['Resource Utilization', 'Policy Compliance']);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email', 'dashboard']);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // PulseBar data
  const pulseData = {
    healthy: loopData.filter(l => l.status === 'healthy').length,
    warning: loopData.filter(l => l.status === 'warning').length,
    critical: loopData.filter(l => l.status === 'critical').length,
    upcoming: 5,
    approvals: 7
  };

  React.useEffect(() => {
    let filtered = loopData;
    
    if (showLowTRI) {
      filtered = filtered.filter(loop => loop.tri <= 3);
    }
    
    if (activeFilter) {
      filtered = filtered.filter(loop => loop.status === activeFilter);
    }
    
    setFilteredLoops(filtered);
  }, [showLowTRI, activeFilter]);

  const handlePulseClick = (filterType: string) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen p-4">
        {/* Full-width Glass Panel */}
        <Card className="p-4 bg-glass backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 border-white/10">
          
          {/* PulseBar */}
          <div className="w-full mb-3">
            <div className="flex items-center gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePulseClick('healthy')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'healthy' 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-background/30 hover:bg-background/50 border border-white/20'
                }`}
              >
                <span className="text-lg">🟢</span>
                <span className="font-medium">{pulseData.healthy}</span>
                <span className="text-sm text-muted-foreground">Healthy</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePulseClick('warning')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'warning' 
                    ? 'bg-yellow-500/20 border border-yellow-500/30' 
                    : 'bg-background/30 hover:bg-background/50 border border-white/20'
                }`}
              >
                <span className="text-lg">🟡</span>
                <span className="font-medium">{pulseData.warning}</span>
                <span className="text-sm text-muted-foreground">Warning</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePulseClick('critical')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === 'critical' 
                    ? 'bg-red-500/20 border border-red-500/30' 
                    : 'bg-background/30 hover:bg-background/50 border border-white/20'
                }`}
              >
                <span className="text-lg">🔴</span>
                <span className="font-medium">{pulseData.critical}</span>
                <span className="text-sm text-muted-foreground">Critical</span>
              </motion.button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/30 border border-white/20">
                <span className="text-lg">📅</span>
                <span className="font-medium">{pulseData.upcoming}</span>
                <span className="text-sm text-muted-foreground">Upcoming</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/30 border border-white/20">
                <span className="text-lg">👥</span>
                <span className="font-medium">{pulseData.approvals}</span>
                <span className="text-sm text-muted-foreground">Approvals</span>
              </div>
            </div>
          </div>

          <CardContent className="space-y-4">
            
            {/* Primary Action and Filters */}
            <div className="flex items-center justify-between">
              <Button className="bg-primary text-white py-1 px-4 rounded-lg">
                <Eye className="mr-2 h-4 w-4" />
                Review TRI
              </Button>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowLowTRI(!showLowTRI)}
                  className={showLowTRI ? 'bg-primary/20 border-primary' : ''}
                >
                  Show TRI ≤ 3
                </Button>
              </div>
            </div>

            {/* Loop List Table */}
            <div className="rounded-lg border border-white/20 bg-background/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/20 hover:bg-transparent">
                    <TableHead className="text-left">Loop Name</TableHead>
                    <TableHead className="text-center">Sparkline</TableHead>
                    <TableHead className="text-center">DE-Band Badge</TableHead>
                    <TableHead className="text-right">Last TRI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoops.map((loop) => (
                    <motion.tr
                      key={loop.id}
                      className="border-b border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <span>{loop.name}</span>
                          <Sparkline 
                            data={loop.sparklineData} 
                            color={loop.tri <= 3 ? '#ef4444' : loop.tri <= 5 ? '#f59e0b' : '#22c55e'}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Sparkline 
                          data={loop.sparklineData.slice(-7)} 
                          color={loop.status === 'critical' ? '#ef4444' : loop.status === 'warning' ? '#f59e0b' : '#22c55e'}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <DEBandBadge status={loop.status} tooltipText={loop.tooltipText} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className={`font-mono text-lg ${
                            loop.tri <= 3 ? 'text-red-400' : 
                            loop.tri <= 5 ? 'text-yellow-400' : 
                            'text-green-400'
                          }`}>
                            {loop.tri}
                          </span>
                          <span className="text-xs text-muted-foreground">{loop.lastUpdate}</span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
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
                  
                  {/* Policy-coherence Heatmap */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Policy-Coherence Heatmap</Label>
                    <div className="grid grid-cols-6 gap-1 p-3 bg-background/20 rounded-lg">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-sm ${
                            Math.random() > 0.7 ? 'bg-red-400' :
                            Math.random() > 0.4 ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          title={`Policy ${i + 1}: ${Math.random() > 0.5 ? 'Aligned' : 'Misaligned'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Sub-indicator Toggles */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Sub-Indicator Selection</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {subIndicators.map((indicator) => (
                        <div key={indicator} className="flex items-center space-x-2">
                          <Checkbox
                            id={indicator}
                            checked={selectedIndicators.includes(indicator)}
                            onCheckedChange={() => handleIndicatorToggle(indicator)}
                          />
                          <Label htmlFor={indicator} className="text-sm">{indicator}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Historical Data Export */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Historical Data Export</Label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Custom Alert Rules */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Custom Alert Rules</Label>
                    
                    <div className="space-y-3">
                      <Label className="text-xs text-muted-foreground">Notification Channels</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {alertChannels.map((channel) => {
                          const IconComponent = channel.icon;
                          return (
                            <div key={channel.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={channel.id}
                                checked={selectedChannels.includes(channel.id)}
                                onCheckedChange={() => handleChannelToggle(channel.id)}
                              />
                              <IconComponent className="h-4 w-4" />
                              <Label htmlFor={channel.id} className="text-sm">{channel.name}</Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default RgsMonitorZone;