
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Play, Brain, Monitor, 
  BookOpen, Zap, Users, Download, FileText, Settings, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Bell, Eye, MessageSquare, CheckCircle, XCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Gauge from '@/components/ui/custom/Gauge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StrategicOverviewProps {
  data?: {
    deiScore: number;
    deiTarget: number;
    deiTrend: number[];
    populationStability: number;
    resourceEfficiency: number;
    socialCohesion: number;
    hasStrategicAlert: boolean;
    psiu: {
      producer: number;
      stabilizer: number;
      innovator: number;
      unifier: number;
    };
    entropyTrend: { cycle: number; monitor: number; think: number; act: number; learn: number; innovate: number }[];
    zones: {
      monitor: any;
      think: any;
      act: any;
      learn: any;
      innovate: any;
    };
    triggers: {
      redesignFlags: Array<{ id: string; title: string; severity: 'high' | 'medium' | 'low'; description: string }>;
      facilitatorEscalations: Array<{ id: string; type: string; message: string; timestamp: string; zone: string }>;
    };
    governance: {
      zoneLeads: Array<{ zone: string; deliveryQuality: number; entropy: number; loopClosures: number; comments: string }>;
      cabinetBundles: Array<{ id: string; title: string; status: 'pending' | 'approved' | 'review'; priority: 'high' | 'medium' | 'low' }>;
    };
  };
}

const StrategicOverview: React.FC<StrategicOverviewProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  // Mock data if not provided
  const mockData = {
    deiScore: 78.5,
    deiTarget: 85,
    deiTrend: [72, 74, 76, 78, 78.5],
    populationStability: -2.1,
    resourceEfficiency: 12.3,
    socialCohesion: 82.7,
    hasStrategicAlert: true,
    psiu: {
      producer: 82,
      stabilizer: 76,
      innovator: 68,
      unifier: 85
    },
    entropyTrend: [
      { cycle: 1, monitor: 0.3, think: 0.25, act: 0.28, learn: 0.22, innovate: 0.35 },
      { cycle: 2, monitor: 0.28, think: 0.27, act: 0.32, learn: 0.24, innovate: 0.31 },
      { cycle: 3, monitor: 0.32, think: 0.23, act: 0.29, learn: 0.26, innovate: 0.33 },
      { cycle: 4, monitor: 0.29, think: 0.31, act: 0.27, learn: 0.23, innovate: 0.29 },
      { cycle: 5, monitor: 0.31, think: 0.28, act: 0.31, learn: 0.25, innovate: 0.27 },
      { cycle: 6, monitor: 0.27, think: 0.24, act: 0.26, learn: 0.27, innovate: 0.31 }
    ],
    zones: {
      monitor: { alerts: 3, criticalSystems: 2, uptime: 99.7 },
      think: { targetAlignment: 78, loopDrifts: [{ name: 'Population & Development', drift: -5.2 }, { name: 'Resource Allocation', drift: 3.8 }] },
      act: { pendingApprovals: 5, successRate: 82, riskFlags: 2 },
      learn: { topLessons: 12, patternFlags: 3, insights: 8 },
      innovate: { activePrototypes: 7, redesignFlags: 4, readyForPromotion: 2 }
    },
    triggers: {
      redesignFlags: [
        { id: '1', title: 'Role Dropouts >3', severity: 'high' as const, description: 'Persistent role abandonment in ACT zone' },
        { id: '2', title: 'Rework Loops', severity: 'medium' as const, description: 'Increasing rework cycles in THINK processes' },
        { id: '3', title: 'Pattern Drift', severity: 'low' as const, description: 'Minor drift detected in LEARN patterns' }
      ],
      facilitatorEscalations: [
        { id: '1', type: 'Role Assignment', message: 'Unclaimed facilitator role in INNOVATE', timestamp: '2 min ago', zone: 'innovate' },
        { id: '2', type: 'Sprint Blocker', message: 'Resource constraint blocking ACT sprint', timestamp: '5 min ago', zone: 'act' },
        { id: '3', type: 'Portal Alert', message: 'Communication breakdown in THINK portal', timestamp: '8 min ago', zone: 'think' }
      ]
    },
    governance: {
      zoneLeads: [
        { zone: 'MONITOR', deliveryQuality: 92, entropy: 0.27, loopClosures: 15, comments: '' },
        { zone: 'THINK', deliveryQuality: 85, entropy: 0.24, loopClosures: 12, comments: 'Need resource allocation review' },
        { zone: 'ACT', deliveryQuality: 78, entropy: 0.31, loopClosures: 18, comments: '' },
        { zone: 'LEARN', deliveryQuality: 88, entropy: 0.25, loopClosures: 14, comments: 'Pattern analysis complete' },
        { zone: 'INNOVATE', deliveryQuality: 91, entropy: 0.29, loopClosures: 11, comments: 'Prototype ready for review' }
      ],
      cabinetBundles: [
        { id: '1', title: 'Infrastructure Development Package', status: 'pending' as const, priority: 'high' as const },
        { id: '2', title: 'Education Reform Bundle', status: 'review' as const, priority: 'medium' as const },
        { id: '3', title: 'Healthcare Optimization', status: 'approved' as const, priority: 'high' as const }
      ]
    }
  };

  // Ensure we have proper data structure with fallbacks
  const displayData = {
    deiScore: data?.deiScore ?? mockData.deiScore,
    deiTarget: data?.deiTarget ?? mockData.deiTarget,
    deiTrend: data?.deiTrend ?? mockData.deiTrend,
    populationStability: data?.populationStability ?? mockData.populationStability,
    resourceEfficiency: data?.resourceEfficiency ?? mockData.resourceEfficiency,
    socialCohesion: data?.socialCohesion ?? mockData.socialCohesion,
    hasStrategicAlert: data?.hasStrategicAlert ?? mockData.hasStrategicAlert,
    psiu: data?.psiu ?? mockData.psiu,
    entropyTrend: data?.entropyTrend ?? mockData.entropyTrend,
    zones: data?.zones ?? mockData.zones,
    triggers: data?.triggers ?? mockData.triggers,
    governance: data?.governance ?? mockData.governance
  };

  const renderPSIURadialGauge = () => {
    const psiuData = displayData.psiu;
    const psiuColors = {
      producer: '#14B8A6', // teal
      stabilizer: '#10B981', // green
      innovator: '#8B5CF6', // purple
      unifier: '#F97316'     // orange
    };

    const pieData = [
      { name: 'Producer', value: psiuData.producer, color: psiuColors.producer },
      { name: 'Stabilizer', value: psiuData.stabilizer, color: psiuColors.stabilizer },
      { name: 'Innovator', value: psiuData.innovator, color: psiuColors.innovator },
      { name: 'Unifier', value: psiuData.unifier, color: psiuColors.unifier }
    ];

    const hasAlert = Object.values(psiuData).some(score => score < 70 || score > 90);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">PSIU Balance Monitor</h4>
          {hasAlert && (
            <Badge variant="destructive" className="animate-pulse">
              <AlertTriangle size={12} className="mr-1" />
              Drift Alert
            </Badge>
          )}
        </div>
        <div className="relative h-48 w-48 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-900/90 backdrop-blur border border-white/20 rounded-lg p-2 text-white">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm">{data.value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">PSIU</div>
              <div className="text-sm text-gray-300">Balance</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(psiuData).map(([key, value]) => (
            <div key={key} className="text-center p-2 rounded bg-white/5">
              <div className={`font-bold text-lg ${
                key === 'producer' ? 'text-teal-400' :
                key === 'stabilizer' ? 'text-green-400' :
                key === 'innovator' ? 'text-purple-400' : 'text-orange-400'
              }`}>
                {value}%
              </div>
              <div className="text-gray-300 capitalize">{key}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEntropyTrendChart = () => {
    const chartConfig = {
      monitor: { label: 'Monitor', color: '#8B5CF6' },
      think: { label: 'Think', color: '#14B8A6' },
      act: { label: 'Act', color: '#3B82F6' },
      learn: { label: 'Learn', color: '#F97316' },
      innovate: { label: 'Innovate', color: '#10B981' }
    };

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Entropy Trend Monitor</h4>
        <div className="h-32">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={displayData.entropyTrend}>
                <XAxis 
                  dataKey="cycle" 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 0.5]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="monitor" stroke={chartConfig.monitor.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="think" stroke={chartConfig.think.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="act" stroke={chartConfig.act.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="learn" stroke={chartConfig.learn.color} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="innovate" stroke={chartConfig.innovate.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-300">Last 6 Cycles</span>
          <div className="flex items-center space-x-1">
            <TrendingUp size={12} className="text-orange-400" />
            <span className="text-orange-400">+0.05 avg</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRedesignFlags = () => {
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'high': return 'text-red-400 bg-red-500/20';
        case 'medium': return 'text-orange-400 bg-orange-500/20';
        case 'low': return 'text-yellow-400 bg-yellow-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
      }
    };

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Redesign Flags</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {displayData.triggers.redesignFlags.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-2">
                <Badge className={getSeverityColor(flag.severity)}>
                  {flag.severity}
                </Badge>
                <div>
                  <div className="text-sm font-medium text-white">{flag.title}</div>
                  <div className="text-xs text-gray-400">{flag.description}</div>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                Review ▶
              </Button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
            <CheckCircle size={14} className="mr-1" />
            Authorize Redesign
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-red-500/50 text-red-400">
            <XCircle size={14} className="mr-1" />
            Veto
          </Button>
        </div>
      </div>
    );
  };

  const renderFacilitatorEscalations = () => {
    const getZoneColor = (zone: string) => {
      switch (zone) {
        case 'monitor': return 'text-purple-400';
        case 'think': return 'text-teal-400';
        case 'act': return 'text-blue-400';
        case 'learn': return 'text-orange-400';
        case 'innovate': return 'text-green-400';
        default: return 'text-gray-400';
      }
    };

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Live Escalations</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {displayData.triggers.facilitatorEscalations.map((escalation) => (
            <div key={escalation.id} className="flex items-center justify-between p-2 rounded bg-white/5">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {escalation.type}
                  </Badge>
                  <span className={`text-xs font-medium ${getZoneColor(escalation.zone)}`}>
                    {escalation.zone.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-white mt-1">{escalation.message}</div>
                <div className="text-xs text-gray-400">{escalation.timestamp}</div>
              </div>
              <Button size="sm" variant="ghost" className="text-xs">
                Reassign ▶
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderZoneLeadsCouncil = () => {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Zone Leads Council</h4>
        <div className="space-y-2">
          {displayData.governance.zoneLeads.map((lead) => (
            <div key={lead.zone} className="p-3 rounded bg-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{lead.zone}</span>
                <div className="flex space-x-2 text-xs">
                  <span className="text-green-400">Q: {lead.deliveryQuality}%</span>
                  <span className="text-orange-400">E: {lead.entropy}</span>
                  <span className="text-blue-400">L: {lead.loopClosures}</span>
                </div>
              </div>
              {lead.comments && (
                <div className="text-xs text-gray-300 bg-white/5 p-2 rounded">
                  {lead.comments}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" className="w-full border-blue-500/50 text-blue-400">
          <Users size={14} className="mr-1" />
          Open Council Workspace ▶
        </Button>
      </div>
    );
  };

  const renderCabinetBundles = () => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending': return 'text-yellow-400 bg-yellow-500/20';
        case 'approved': return 'text-green-400 bg-green-500/20';
        case 'review': return 'text-orange-400 bg-orange-500/20';
        default: return 'text-gray-400 bg-gray-500/20';
      }
    };

    const getPriorityIcon = (priority: string) => {
      return priority === 'high' ? <ArrowUp size={12} className="text-red-400" /> : 
             priority === 'medium' ? <ArrowUp size={12} className="text-orange-400" /> : 
             <ArrowDown size={12} className="text-gray-400" />;
    };

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-white">Cabinet Bundles</h4>
        <div className="space-y-2">
          {displayData.governance.cabinetBundles.map((bundle) => (
            <div key={bundle.id} className="flex items-center justify-between p-2 rounded bg-white/5">
              <div className="flex items-center space-x-2">
                {getPriorityIcon(bundle.priority)}
                <div>
                  <div className="text-sm font-medium text-white">{bundle.title}</div>
                  <Badge className={`text-xs ${getStatusColor(bundle.status)}`}>
                    {bundle.status}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" className="text-xs text-green-400">
                  Sign-off
                </Button>
                <Button size="sm" variant="ghost" className="text-xs">
                  Comment
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`transition-all duration-500 ${isExpanded ? 'fixed inset-0 z-50 bg-black/50' : 'h-[40vh] min-h-[400px]'}`}>
      <GlassCard 
        className={`h-full ${isExpanded ? 'mx-4 my-4' : ''}`} 
        variant="deep" 
        style={{ 
          background: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '2rem',
          boxShadow: 'inset 0 1px 0 0 rgba(56, 178, 172, 0.1), 0 0 30px rgba(56, 178, 172, 0.15)'
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              STRATEGIC OVERVIEW
            </h2>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                className={`${displayData.hasStrategicAlert ? 'animate-pulse bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                <AlertTriangle size={14} className="mr-2" />
                Review Strategic Alert ▶
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-500/50 text-gray-400"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-hidden">
            {/* Left Column: System Health & PSIU Balance (60%) */}
            <div className="lg:col-span-3 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="glass-panel p-4 rounded-xl border border-white/20">
                  {renderPSIURadialGauge()}
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/20">
                  {renderEntropyTrendChart()}
                </div>
              </div>
            </div>

            {/* Right Column: Triggers & Governance (40%) */}
            <div className="lg:col-span-2 space-y-4 overflow-y-auto">
              <div className="glass-panel p-4 rounded-xl border border-white/20">
                {renderRedesignFlags()}
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/20">
                {renderFacilitatorEscalations()}
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/20">
                {renderZoneLeadsCouncil()}
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/20">
                {renderCabinetBundles()}
              </div>
            </div>
          </div>

          {/* Footer with Executive Controls */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Sync Active</span>
              </div>
              <div>Last Update: {new Date().toLocaleTimeString()}</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                <Download size={12} className="mr-1" />
                Daily Digest ▶
              </Button>
              <Button size="sm" variant="ghost" className="text-xs text-gray-400 hover:text-white">
                <FileText size={12} className="mr-1" />
                Export Brief ▶
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default StrategicOverview;
