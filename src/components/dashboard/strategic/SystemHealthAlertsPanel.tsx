
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Zap, X, Play, Pause, Eye, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SparklineChart from '@/components/think/components/SparklineChart';

interface SystemHealthAlertsPanelProps {
  data?: {
    deiScore: number;
    psiu: { producer: number; stabilizer: number; innovator: number; unifier: number };
    entropyTrend: Array<{ zone: string; current: number; trend: number }>;
    alerts: Array<{ id: string; type: 'health' | 'loop' | 'operational'; message: string; severity: 'high' | 'medium' | 'low' }>;
    risks: Array<{ id: string; name: string; likelihood: number; impact: number }>;
  };
  onAlertClick?: (alertType: string) => void;
}

interface KpiData {
  value: number;
  trend: number[];
  unit: string;
}

interface AlertData {
  id: string;
  type: 'health' | 'loop' | 'operational';
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  cause: string;
  metrics: number[];
  recommendations: string[];
}

interface RiskData {
  id: string;
  name: string;
  likelihood: number;
  impact: number;
  description: string;
  lastUpdate: string;
}

export const SystemHealthAlertsPanel: React.FC<SystemHealthAlertsPanelProps> = ({ data, onAlertClick }) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertData | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskData | null>(null);
  const [hoveredKpi, setHoveredKpi] = useState<string | null>(null);
  const [selectedPsiuSlice, setSelectedPsiuSlice] = useState<string | null>(null);
  const [deiTarget, setDeiTarget] = useState(83);

  // Enhanced mock data with proper types
  const mockData = {
    deiScore: 78.5,
    psiu: { producer: 82, stabilizer: 76, innovator: 68, unifier: 85 },
    kpis: {
      volatility: { value: 0.27, trend: [0.31, 0.29, 0.25, 0.27], unit: 'σ' } as KpiData,
      resourceRatio: { value: 0.92, trend: [0.89, 0.91, 0.93, 0.92], unit: '' } as KpiData,
      marketStability: { value: 68, trend: [65, 67, 69, 68], unit: '/100' } as KpiData,
      socialCohesion: { value: 71, trend: [69, 70, 72, 71], unit: '/100' } as KpiData
    },
    entropyTrend: [
      { zone: 'MONITOR', current: 0.27, trend: -0.02 },
      { zone: 'THINK', current: 0.24, trend: 0.03 },
      { zone: 'ACT', current: 0.31, trend: 0.01 },
      { zone: 'LEARN', current: 0.25, trend: -0.01 },
      { zone: 'INNOVATE', current: 0.29, trend: 0.02 }
    ],
    alerts: [
      { 
        id: '1', 
        type: 'health' as const, 
        message: 'Population volatility exceeding threshold', 
        severity: 'high' as const,
        timestamp: '2 minutes ago',
        cause: 'Urban migration surge in Zone 3',
        metrics: [78, 82, 85, 89, 92, 87],
        recommendations: [
          'Increase resource allocation to Zone 3',
          'Activate migration support protocols',
          'Deploy mobile service units'
        ]
      },
      { 
        id: '2', 
        type: 'loop' as const, 
        message: 'THINK loop closure delayed by 15%', 
        severity: 'medium' as const,
        timestamp: '8 minutes ago',
        cause: 'Processing bottleneck in analysis pipeline',
        metrics: [92, 89, 86, 83, 81, 85],
        recommendations: [
          'Scale analysis compute resources',
          'Redistribute processing load'
        ]
      },
      { 
        id: '3', 
        type: 'operational' as const, 
        message: 'Resource stock approaching minimum levels', 
        severity: 'low' as const,
        timestamp: '12 minutes ago',
        cause: 'Increased consumption in multiple sectors',
        metrics: [95, 93, 91, 89, 87, 92],
        recommendations: [
          'Initiate resource replenishment protocols'
        ]
      }
    ] as AlertData[],
    risks: [
      { 
        id: '1', 
        name: 'Population Surge', 
        likelihood: 0.7, 
        impact: 0.8, 
        description: 'Rapid urban migration exceeding infrastructure capacity',
        lastUpdate: '2 hours ago'
      },
      { 
        id: '2', 
        name: 'Extraction Over-Quota', 
        likelihood: 0.4, 
        impact: 0.9, 
        description: 'Resource extraction exceeding sustainable limits',
        lastUpdate: '4 hours ago'
      },
      { 
        id: '3', 
        name: 'Loop Drift', 
        likelihood: 0.6, 
        impact: 0.6, 
        description: 'Systematic deviation from optimal feedback patterns',
        lastUpdate: '1 hour ago'
      }
    ] as RiskData[]
  };

  const displayData = data || mockData;

  const psiuColors = {
    producer: '#14B8A6',
    stabilizer: '#10B981',
    innovator: '#8B5CF6',
    unifier: '#F97316'
  };

  const pieData = [
    { name: 'Producer', value: displayData.psiu.producer, color: psiuColors.producer },
    { name: 'Stabilizer', value: displayData.psiu.stabilizer, color: psiuColors.stabilizer },
    { name: 'Innovator', value: displayData.psiu.innovator, color: psiuColors.innovator },
    { name: 'Unifier', value: displayData.psiu.unifier, color: psiuColors.unifier }
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return '🔴';
      case 'medium': return '🟠';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getRiskMatrixPosition = (likelihood: number, impact: number) => {
    const x = likelihood * 100;
    const y = (1 - impact) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const getRiskMatrixColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 0.6) return 'bg-red-500';
    if (score >= 0.4) return 'bg-orange-500';
    if (score >= 0.2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handlePsiuSliceClick = (slice: string) => {
    setSelectedPsiuSlice(slice);
  };

  const handleAlertInvestigate = (alert: AlertData) => {
    setSelectedAlert(alert);
  };

  const handleRiskClick = (risk: RiskData) => {
    setSelectedRisk(risk);
  };

  return (
    <div className="h-full p-6 flex flex-col space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h3 className="text-lg font-semibold text-teal-400">System Health & Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(mockData.kpis).map(([key, kpi]) => (
          <motion.div
            key={key}
            className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }}
            onHoverStart={() => setHoveredKpi(key)}
            onHoverEnd={() => setHoveredKpi(null)}
            role="button"
            tabIndex={0}
            aria-label={`${key} metric: ${kpi.value}${kpi.unit}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className="w-12 h-6">
                <SparklineChart data={kpi.trend} color="#14B8A6" width={48} height={20} />
              </div>
            </div>
            <div className="text-lg font-bold text-teal-400">
              {kpi.value}{kpi.unit}
            </div>
            <AnimatePresence>
              {hoveredKpi === key && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-xs text-gray-300"
                >
                  6-month trend: {kpi.trend[0]} → {kpi.trend[kpi.trend.length - 1]}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Gauges */}
      <div className="grid grid-cols-2 gap-6">
        {/* DEI Gauge */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-teal-400">DEI Score</h4>
          <div className="relative h-32 w-32 mx-auto">
            <div className="absolute inset-0 rounded-full border-8 border-gray-700/30"></div>
            <motion.div 
              className="absolute inset-0 rounded-full border-8 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent"
              initial={{ rotate: 0 }}
              animate={{ rotate: (displayData.deiScore / 100) * 360 }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-teal-400">{displayData.deiScore}</span>
            </div>
            {/* Target slider */}
            <div className="absolute -bottom-8 left-0 right-0">
              <input
                type="range"
                min={displayData.deiScore - 5}
                max={displayData.deiScore + 5}
                value={deiTarget}
                onChange={(e) => setDeiTarget(Number(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                aria-label="DEI target adjustment"
              />
              <div className="text-xs text-center text-gray-400 mt-1">Target: {deiTarget}</div>
            </div>
          </div>
        </div>

        {/* PSIU Donut */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-teal-400">PSIU Balance</h4>
          <div className="relative h-32 w-32 mx-auto cursor-pointer">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  dataKey="value"
                  stroke="none"
                  onClick={(entry) => handlePsiuSliceClick(entry.name.toLowerCase())}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Live Sparklines */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-teal-400">Live Trends</h4>
        <div className="flex space-x-4 justify-between">
          {displayData.entropyTrend.map((zone) => (
            <div key={zone.zone} className="text-center p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10">
              <div className="text-xs text-gray-400 mb-1">{zone.zone}</div>
              <div className="w-16 h-8 mx-auto mb-1">
                <SparklineChart data={[0.2, 0.25, 0.23, zone.current]} color="#14B8A6" width={60} height={25} />
              </div>
              <div className={`flex items-center justify-center text-xs ${zone.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {zone.trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span className="ml-1">{zone.current}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Alerts Feed */}
      <div className="space-y-3 flex-1 min-h-0">
        <h4 className="text-sm font-medium text-teal-400">Critical Alerts</h4>
        <div className="space-y-2 overflow-y-auto max-h-48">
          {mockData.alerts.map((alert) => (
            <motion.div 
              key={alert.id} 
              className="p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.01, boxShadow: '0 0 15px rgba(20, 184, 166, 0.2)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{getSeverityIcon(alert.severity)}</span>
                  <span className="text-sm text-white font-medium">{alert.message}</span>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {alert.timestamp} • {alert.cause}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-teal-400 h-6 text-xs"
                    onClick={() => handleAlertInvestigate(alert)}
                  >
                    <Eye size={12} className="mr-1" />
                    Investigate
                  </Button>
                  <Button size="sm" variant="ghost" className="text-gray-400 h-6">
                    <Pause size={12} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Risk Matrix */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-teal-400">Risk Matrix</h4>
        <div className="relative h-32 bg-white/5 rounded border border-white/10">
          {/* Grid background */}
          <div className="absolute inset-2">
            <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-1">
              <div className="bg-green-500/20 rounded flex items-center justify-center text-xs text-green-400">Low Risk</div>
              <div className="bg-yellow-500/20 rounded flex items-center justify-center text-xs text-yellow-400">Medium Risk</div>
              <div className="bg-orange-500/20 rounded flex items-center justify-center text-xs text-orange-400">High Risk</div>
              <div className="bg-red-500/20 rounded flex items-center justify-center text-xs text-red-400">Critical Risk</div>
            </div>
          </div>
          
          {/* Risk pins */}
          {mockData.risks.map((risk) => {
            const position = getRiskMatrixPosition(risk.likelihood, risk.impact);
            return (
              <motion.div
                key={risk.id}
                className={`absolute w-3 h-3 rounded-full cursor-pointer ${getRiskMatrixColor(risk.likelihood, risk.impact)}`}
                style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.5 }}
                onClick={() => handleRiskClick(risk)}
                title={risk.name}
                role="button"
                tabIndex={0}
                aria-label={`Risk: ${risk.name}, likelihood ${Math.round(risk.likelihood * 100)}%, impact ${Math.round(risk.impact * 100)}%`}
              />
            );
          })}
          
          {/* Axis labels */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
            Likelihood →
          </div>
          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-400">
            Impact ↑
          </div>
        </div>
      </div>

      {/* Alert Investigation Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-teal-400/30">
          <DialogHeader>
            <DialogTitle className="text-teal-400">{selectedAlert?.message}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getSeverityColor(selectedAlert?.severity || '')}>
                {selectedAlert?.severity}
              </Badge>
              <span className="text-sm text-gray-400">{selectedAlert?.timestamp}</span>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="impact">Loop Impact</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="h-32">
                <ChartContainer config={chartConfig}>
                  <LineChart data={selectedAlert?.metrics?.map((value: number, index: number) => ({ month: index + 1, value }))}>
                    <Line type="monotone" dataKey="value" stroke="#14B8A6" strokeWidth={2} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="impact" className="space-y-4">
              <div className="space-y-2">
                {displayData.entropyTrend.slice(0, 3).map((zone) => (
                  <div key={zone.zone} className="flex justify-between p-2 bg-white/5 rounded">
                    <span className="text-sm text-gray-300">{zone.zone}</span>
                    <span className={`text-sm ${zone.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {zone.trend > 0 ? '+' : ''}{(zone.trend * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-2">
                {selectedAlert?.recommendations?.map((rec: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                    <span className="text-sm text-gray-300">{rec}</span>
                    <Button size="sm" variant="ghost" className="text-teal-400 h-6">
                      <Play size={12} className="mr-1" />
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex space-x-2 mt-4">
            <Button variant="outline" className="flex-1">Acknowledge</Button>
            <Button variant="default" className="flex-1" onClick={() => setSelectedAlert(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PSIU Drill-down Dialog */}
      <Dialog open={!!selectedPsiuSlice} onOpenChange={() => setSelectedPsiuSlice(null)}>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-teal-400/30">
          <DialogHeader>
            <DialogTitle className="text-teal-400 capitalize">{selectedPsiuSlice} Analysis</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="h-32">
              <ChartContainer config={chartConfig}>
                <LineChart data={[65, 68, 72, 74, 76, 78, 82].map((value, index) => ({ quarter: `Q${index + 1}`, value }))}>
                  <Line type="monotone" dataKey="value" stroke={psiuColors[selectedPsiuSlice as keyof typeof psiuColors]} strokeWidth={2} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-teal-400">Top 3 Drivers</h5>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Leadership Quality</span>
                  <span className="text-green-400">+12%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Resource Allocation</span>
                  <span className="text-green-400">+8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Team Coordination</span>
                  <span className="text-orange-400">-3%</span>
                </div>
              </div>
            </div>
            
            <Button variant="default" className="w-full">
              <Play size={16} className="mr-2" />
              Apply Leverage Suggestions
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Risk Investigation Dialog */}
      <Dialog open={!!selectedRisk} onOpenChange={() => setSelectedRisk(null)}>
        <DialogContent className="sm:max-w-lg bg-slate-900/95 border-teal-400/30">
          <DialogHeader>
            <DialogTitle className="text-teal-400">{selectedRisk?.name}</DialogTitle>
            <p className="text-sm text-gray-400">{selectedRisk?.description}</p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/5 rounded">
                <div className="text-lg font-bold text-orange-400">
                  {Math.round((selectedRisk?.likelihood || 0) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Likelihood</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded">
                <div className="text-lg font-bold text-red-400">
                  {Math.round((selectedRisk?.impact || 0) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Impact</div>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              Last updated: {selectedRisk?.lastUpdate}
            </div>
            
            <Button variant="default" className="w-full" onClick={() => setSelectedRisk(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
