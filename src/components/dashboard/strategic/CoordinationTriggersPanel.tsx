
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertCircle, ArrowRight, Filter, RefreshCw, Clock, ChevronDown, User, Eye, Send, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CoordinationTriggersPanelProps {
  data?: {
    redesignFlags: Array<{
      id: string;
      pattern: string;
      severity: 'high' | 'medium' | 'low';
      description: string;
      occurrences: number;
    }>;
    facilitatorEscalations: Array<{
      id: string;
      type: 'role' | 'blocker' | 'integrity';
      message: string;
      zone: string;
      timestamp: string;
    }>;
    zoneLeads: Array<{
      zone: string;
      deliveryQuality: number;
      entropy: number;
      lastLoopClosure: string;
      status: 'active' | 'attention' | 'critical';
    }>;
  };
  onRedesignFlag?: (flagType: string) => void;
  onEscalationAction?: (action: string, zone: string) => void;
  onZoneLeadClick?: (zone: string) => void;
}

interface RedesignFlag {
  id: string;
  pattern: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  firstSeen: string;
  duration: string;
  description: string;
  occurrences: number;
  rootCause: string;
  interventions: Array<{ action: string; effect: string; date: string }>;
}

interface Escalation {
  id: string;
  type: 'role' | 'blocker' | 'integrity';
  title: string;
  context: string;
  raisedBy: string;
  timestamp: string;
  zone: string;
  description: string;
}

interface ZoneLead {
  zone: string;
  leadName: string;
  deliveryQuality: number;
  entropy: number;
  lastLoopClosure: string;
  status: 'active' | 'attention' | 'critical';
  availability: number;
  sparklineData: number[];
}

export const CoordinationTriggersPanel: React.FC<CoordinationTriggersPanelProps> = ({ 
  data, 
  onRedesignFlag, 
  onEscalationAction, 
  onZoneLeadClick 
}) => {
  const [flagSeverityFilter, setFlagSeverityFilter] = useState<string>('all');
  const [escalationTypeFilter, setEscalationTypeFilter] = useState<string>('all');
  const [selectedFlag, setSelectedFlag] = useState<RedesignFlag | null>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [selectedZoneLead, setSelectedZoneLead] = useState<ZoneLead | null>(null);
  const [timelineRange, setTimelineRange] = useState([0, 30]);
  const [isReassignDrawerOpen, setIsReassignDrawerOpen] = useState(false);
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false);
  const [directiveText, setDirectiveText] = useState('');
  const [targetLead, setTargetLead] = useState('');
  const [autoRefreshActive, setAutoRefreshActive] = useState(true);

  // Enhanced mock data
  const mockRedesignFlags: RedesignFlag[] = [
    {
      id: '1',
      pattern: 'Role Dropouts',
      severity: 'critical',
      firstSeen: '3 days ago',
      duration: '72h',
      description: 'Persistent role abandonment in ACT zone',
      occurrences: 5,
      rootCause: 'Workload imbalance in delivery chains',
      interventions: [
        { action: 'Redistributed tasks', effect: '+8% loop coverage', date: '2h ago' },
        { action: 'Added backup facilitators', effect: '+12% reliability', date: '1d ago' }
      ]
    },
    {
      id: '2',
      pattern: 'Loop Rework Backlog',
      severity: 'high',
      firstSeen: '1 week ago',
      duration: '168h',
      description: 'Increasing rework cycles in THINK processes',
      occurrences: 8,
      rootCause: 'Insufficient initial analysis depth',
      interventions: [
        { action: 'Enhanced review protocols', effect: '+15% first-pass success', date: '12h ago' }
      ]
    },
    {
      id: '3',
      pattern: 'Data Integrity Alerts',
      severity: 'medium',
      firstSeen: '2 days ago',
      duration: '48h',
      description: 'Minor data synchronization delays',
      occurrences: 3,
      rootCause: 'Network latency spikes',
      interventions: []
    }
  ];

  const mockEscalations: Escalation[] = [
    {
      id: '1',
      type: 'role',
      title: 'Unclaimed Facilitator Role',
      context: 'INNOVATE zone blueprint session needs facilitation',
      raisedBy: 'Alex Chen',
      timestamp: '2 min ago',
      zone: 'INNOVATE',
      description: 'Critical design review session scheduled in 30 minutes requires immediate facilitator assignment'
    },
    {
      id: '2',
      type: 'blocker',
      title: 'Resource Constraint',
      context: 'ACT sprint blocked by compute resource shortage',
      raisedBy: 'Maria Santos',
      timestamp: '5 min ago',
      zone: 'ACT',
      description: 'Sprint 23 delivery chain requires additional compute resources to meet deadline'
    },
    {
      id: '3',
      type: 'integrity',
      title: 'Communication Breakdown',
      context: 'THINK portal sync issues affecting collaboration',
      raisedBy: 'David Kim',
      timestamp: '8 min ago',
      zone: 'THINK',
      description: 'Portal synchronization failures causing delayed feedback loops'
    }
  ];

  const mockZoneLeads: ZoneLead[] = [
    {
      zone: 'MONITOR',
      leadName: 'Sarah Johnson',
      deliveryQuality: 92,
      entropy: 0.27,
      lastLoopClosure: '2h ago',
      status: 'active',
      availability: 85,
      sparklineData: [88, 90, 89, 92, 91, 92]
    },
    {
      zone: 'THINK',
      leadName: 'Michael Chang',
      deliveryQuality: 85,
      entropy: 0.24,
      lastLoopClosure: '4h ago',
      status: 'attention',
      availability: 60,
      sparklineData: [82, 84, 83, 85, 84, 85]
    },
    {
      zone: 'ACT',
      leadName: 'Elena Rodriguez',
      deliveryQuality: 78,
      entropy: 0.31,
      lastLoopClosure: '1h ago',
      status: 'critical',
      availability: 40,
      sparklineData: [75, 77, 76, 78, 77, 78]
    },
    {
      zone: 'LEARN',
      leadName: 'James Wilson',
      deliveryQuality: 88,
      entropy: 0.25,
      lastLoopClosure: '3h ago',
      status: 'active',
      availability: 75,
      sparklineData: [85, 87, 86, 88, 87, 88]
    },
    {
      zone: 'INNOVATE',
      leadName: 'Priya Patel',
      deliveryQuality: 91,
      entropy: 0.29,
      lastLoopClosure: '6h ago',
      status: 'active',
      availability: 90,
      sparklineData: [88, 90, 89, 91, 90, 91]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'attention': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getZoneColor = (zone: string) => {
    const colors: Record<string, string> = {
      'MONITOR': 'text-purple-400',
      'THINK': 'text-teal-400',
      'ACT': 'text-blue-400',
      'LEARN': 'text-orange-400',
      'INNOVATE': 'text-green-400'
    };
    return colors[zone] || 'text-gray-400';
  };

  const filteredFlags = mockRedesignFlags.filter(flag => 
    flagSeverityFilter === 'all' || flag.severity === flagSeverityFilter
  );

  const filteredEscalations = mockEscalations.filter(escalation =>
    escalationTypeFilter === 'all' || escalation.type === escalationTypeFilter
  );

  const handleSendDirective = () => {
    console.log(`Sending directive "${directiveText}" to ${targetLead}`);
    setDirectiveText('');
    setTargetLead('');
    setIsDirectiveModalOpen(false);
  };

  const chartConfig = {
    delivery: {
      label: "Delivery Quality",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="h-full p-6 flex flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <h3 className="text-lg font-semibold text-purple-400">Coordination & Triggers</h3>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ scale: autoRefreshActive ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 2, repeat: autoRefreshActive ? Infinity : 0 }}
              className={`w-2 h-2 rounded-full ${autoRefreshActive ? 'bg-green-400' : 'bg-gray-400'}`}
            />
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-purple-400"
              onClick={() => setAutoRefreshActive(!autoRefreshActive)}
            >
              <RefreshCw size={14} className="mr-1" />
              {autoRefreshActive ? 'Live' : 'Paused'}
            </Button>
          </div>
        </div>

        {/* 1. Redesign Flags Council */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-purple-400">Redesign Flags Council</h4>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-1">
            {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
              <Button
                key={severity}
                size="sm"
                variant={flagSeverityFilter === severity ? 'default' : 'ghost'}
                className="text-xs h-6 capitalize"
                onClick={() => setFlagSeverityFilter(severity)}
              >
                {severity}
              </Button>
            ))}
          </div>

          {/* Flags List */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <AnimatePresence>
              {filteredFlags.map((flag) => (
                <motion.div
                  key={flag.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-400/20"
                  onClick={() => setSelectedFlag(flag)}
                >
                  <div className="flex items-center space-x-3">
                    <Badge className={getSeverityColor(flag.severity)}>
                      {flag.severity}
                    </Badge>
                    <div>
                      <div className="text-sm font-medium text-white">{flag.pattern}</div>
                      <div className="text-xs text-gray-400">
                        First seen: {flag.firstSeen} • Duration: {flag.duration}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Details <ArrowRight size={12} className="ml-1" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Timeline Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Timeline</span>
              <span>{timelineRange[0]}d - {timelineRange[1]}d</span>
            </div>
            <Slider
              value={timelineRange}
              onValueChange={setTimelineRange}
              max={90}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* 2. Facilitator Escalations Feed */}
        <div className="space-y-3 flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-purple-400">Live Escalations</h4>
            {autoRefreshActive && (
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Auto-refresh</span>
              </div>
            )}
          </div>
          
          {/* Category Tabs */}
          <div className="flex space-x-1">
            {['all', 'role', 'blocker', 'integrity'].map((type) => (
              <Button
                key={type}
                size="sm"
                variant={escalationTypeFilter === type ? 'default' : 'ghost'}
                className="text-xs h-6 capitalize"
                onClick={() => setEscalationTypeFilter(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* Escalation Cards */}
          <div className="space-y-2 flex-1 overflow-y-auto min-h-[120px]">
            <AnimatePresence>
              {filteredEscalations.map((escalation) => (
                <motion.div
                  key={escalation.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-400/20"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {escalation.type}
                      </Badge>
                      <span className={`text-xs font-medium ${getZoneColor(escalation.zone)}`}>
                        {escalation.zone}
                      </span>
                    </div>
                    <div className="text-sm text-white font-medium">{escalation.title}</div>
                    <div className="text-xs text-gray-300">{escalation.context}</div>
                    <div className="text-xs text-gray-400">
                      By {escalation.raisedBy} • {escalation.timestamp}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Drawer open={isReassignDrawerOpen} onOpenChange={setIsReassignDrawerOpen}>
                      <DrawerTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-xs">
                          <User size={12} className="mr-1" />
                          Reassign
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Reassign Escalation</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Available Zone Leads</label>
                            {mockZoneLeads.map((lead) => (
                              <div key={lead.zone} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                <div>
                                  <span className={`font-medium ${getZoneColor(lead.zone)}`}>
                                    {lead.leadName}
                                  </span>
                                  <span className="text-sm text-gray-400 ml-2">({lead.zone})</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-green-400 transition-all"
                                      style={{ width: `${lead.availability}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-400">{lead.availability}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs"
                      onClick={() => setSelectedEscalation(escalation)}
                    >
                      <Eye size={12} className="mr-1" />
                      Context
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. Zone Leads Council */}
        <div className="space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-purple-400">Zone Leads Council</h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs text-purple-400"
              onClick={() => setIsDirectiveModalOpen(true)}
            >
              <Send size={12} className="mr-1" />
              Send Directive
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {mockZoneLeads.map((lead) => (
              <motion.div
                key={lead.zone}
                className="flex items-center justify-between p-3 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-400/20"
                onClick={() => setSelectedZoneLead(lead)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle
                        cx="16" cy="16" r="14"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="2"
                      />
                      <circle
                        cx="16" cy="16" r="14"
                        fill="none"
                        stroke={getStatusColor(lead.status).includes('green') ? '#10B981' : 
                               getStatusColor(lead.status).includes('orange') ? '#F97316' : '#EF4444'}
                        strokeWidth="2"
                        strokeDasharray={`${(lead.deliveryQuality / 100) * 88} 88`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {lead.deliveryQuality}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`font-medium text-sm ${getZoneColor(lead.zone)}`}>
                      {lead.zone}
                    </span>
                    <div className="text-xs text-gray-400">
                      {lead.leadName} • E:{lead.entropy}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-6">
                    <ChartContainer config={chartConfig}>
                      <LineChart data={lead.sparklineData.map((value, index) => ({ value, index }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#14B8A6" 
                          strokeWidth={1}
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                  <div className="text-xs text-gray-400">{lead.lastLoopClosure}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Flag Details Modal */}
      <Dialog open={!!selectedFlag} onOpenChange={() => setSelectedFlag(null)}>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-purple-400/30">
          <DialogHeader>
            <DialogTitle className="text-purple-400">{selectedFlag?.pattern}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rootcause">Root Cause</TabsTrigger>
              <TabsTrigger value="interventions">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded">
                  <div className="text-lg font-bold text-orange-400">{selectedFlag?.occurrences}</div>
                  <div className="text-xs text-gray-400">Occurrences</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded">
                  <div className="text-lg font-bold text-red-400">{selectedFlag?.duration}</div>
                  <div className="text-xs text-gray-400">Duration</div>
                </div>
              </div>
              <p className="text-sm text-gray-300">{selectedFlag?.description}</p>
            </TabsContent>
            
            <TabsContent value="rootcause" className="space-y-4">
              <div className="p-4 bg-white/5 rounded">
                <h5 className="text-sm font-medium text-purple-400 mb-2">Root Cause Analysis</h5>
                <p className="text-sm text-gray-300">{selectedFlag?.rootCause}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="interventions" className="space-y-4">
              <div className="space-y-2">
                {selectedFlag?.interventions?.map((intervention, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <div>
                      <div className="text-sm text-gray-300">{intervention.action}</div>
                      <div className="text-xs text-gray-400">{intervention.date}</div>
                    </div>
                    <span className="text-sm text-green-400">{intervention.effect}</span>
                  </div>
                ))}
              </div>
              <Button variant="default" className="w-full">
                <Zap size={16} className="mr-2" />
                Promote to Innovate
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Escalation Context Modal */}
      <Dialog open={!!selectedEscalation} onOpenChange={() => setSelectedEscalation(null)}>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-purple-400/30">
          <DialogHeader>
            <DialogTitle className="text-purple-400">{selectedEscalation?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded">
              <h5 className="text-sm font-medium text-purple-400 mb-2">Context</h5>
              <p className="text-sm text-gray-300">{selectedEscalation?.description}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">Raised by: {selectedEscalation?.raisedBy}</div>
                <div className="text-xs text-gray-400">{selectedEscalation?.timestamp}</div>
              </div>
              <Badge className={`${getZoneColor(selectedEscalation?.zone || '')} bg-white/10`}>
                {selectedEscalation?.zone}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Zone Lead Details Modal */}
      <Dialog open={!!selectedZoneLead} onOpenChange={() => setSelectedZoneLead(null)}>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-purple-400/30">
          <DialogHeader>
            <DialogTitle className="text-purple-400">{selectedZoneLead?.zone} Zone Lead</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 rounded">
                <div className="text-lg font-bold text-green-400">
                  {selectedZoneLead?.deliveryQuality}%
                </div>
                <div className="text-xs text-gray-400">Delivery Quality</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded">
                <div className="text-lg font-bold text-orange-400">
                  {selectedZoneLead?.entropy}
                </div>
                <div className="text-xs text-gray-400">Entropy</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              Lead: {selectedZoneLead?.leadName}
            </div>
            <div className="text-sm text-gray-400">
              Last Loop Closure: {selectedZoneLead?.lastLoopClosure}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Directive Modal */}
      <Dialog open={isDirectiveModalOpen} onOpenChange={setIsDirectiveModalOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-purple-400/30">
          <DialogHeader>
            <DialogTitle className="text-purple-400">Send Directive</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Target Lead</label>
              <select 
                value={targetLead}
                onChange={(e) => setTargetLead(e.target.value)}
                className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white"
              >
                <option value="">Select a zone lead...</option>
                {mockZoneLeads.map((lead) => (
                  <option key={lead.zone} value={lead.leadName}>
                    {lead.leadName} ({lead.zone})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300">Directive</label>
              <input
                type="text"
                value={directiveText}
                onChange={(e) => setDirectiveText(e.target.value)}
                placeholder="Enter command..."
                className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
              />
            </div>
            
            <Button 
              variant="default" 
              className="w-full"
              onClick={handleSendDirective}
              disabled={!directiveText || !targetLead}
            >
              <Send size={16} className="mr-2" />
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
