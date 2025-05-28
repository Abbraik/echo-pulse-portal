
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis } from 'recharts';

interface EnhancedSystemHealthPanelProps {
  data?: any;
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  currentMode: string;
}

const EnhancedSystemHealthPanel: React.FC<EnhancedSystemHealthPanelProps> = ({ 
  data, 
  onViewModeChange,
  currentMode 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data
  const mockData = {
    deiScore: 78.5,
    psiu: { producer: 82, stabilizer: 76, innovator: 68, unifier: 85 },
    alerts: [
      { id: '1', type: 'DEI', message: 'Population volatility increase', severity: 'high', time: '2 min ago' },
      { id: '2', type: 'PSIU', message: 'Innovator imbalance detected', severity: 'medium', time: '5 min ago' },
      { id: '3', type: 'Loop', message: 'THINK loop closure delayed', severity: 'medium', time: '8 min ago' },
    ],
    entropy: [
      { zone: 'MONITOR', value: 0.27, trend: -0.02, risk: 'low' },
      { zone: 'THINK', value: 0.24, trend: 0.03, risk: 'medium' },
      { zone: 'ACT', value: 0.31, trend: 0.01, risk: 'high' },
      { zone: 'LEARN', value: 0.25, trend: -0.01, risk: 'low' },
      { zone: 'INNOVATE', value: 0.29, trend: 0.02, risk: 'medium' }
    ],
    topRisks: [
      { name: 'Policy Drift', level: 'high' },
      { name: 'Resource Shortage', level: 'medium' },
      { name: 'Stakeholder Gap', level: 'low' }
    ]
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return '🟥';
      case 'medium': return '🟧';
      case 'low': return '🟩';
      default: return '⚪';
    }
  };

  return (
    <GlassCard 
      className="h-full p-6 relative"
      style={{ 
        background: 'rgba(20, 184, 166, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        borderRadius: '2rem'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-teal-400">System Health & Alerts</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Real-time</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={currentMode === 'health' ? 'default' : 'outline'}
            onClick={() => onViewModeChange(currentMode === 'health' ? 'full' : 'health')}
            className="text-teal-400"
          >
            <Eye size={14} className="mr-1" />
            Focus Mode
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-teal-400"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Composite DEI + PSIU Gauge */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-teal-400 mb-2">DEI Composite</h4>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(100, 116, 139, 0.3)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#healthGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${displayData.deiScore * 3.51} 351`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{displayData.deiScore}%</span>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 mt-2">In Target Band</Badge>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-teal-400">PSIU Balance</h4>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Critical Alerts Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-teal-400">Critical Alerts</h4>
            <Button size="sm" variant="ghost" className="text-xs text-teal-400">
              View All ({displayData.alerts.length}) ▶
            </Button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {(isExpanded ? displayData.alerts : displayData.alerts.slice(0, 2)).map((alert: any) => (
              <motion.div
                key={alert.id}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-teal-500/20 text-teal-400 text-xs">
                      {alert.type}
                    </Badge>
                    <span className="text-sm text-white">{alert.message}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-gray-400">{alert.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Entropy Sparklines + Risk Bullets */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-teal-400">Zone Entropy & Risk Profile</h4>
        
        <div className="grid grid-cols-5 gap-3">
          {displayData.entropy.map((zone: any) => (
            <div key={zone.zone} className="p-3 bg-white/5 rounded-xl text-center">
              <div className="font-medium text-white text-sm mb-1">{zone.zone}</div>
              <div className={`flex items-center justify-center mb-1 ${zone.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {zone.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="ml-1 text-sm font-bold">{zone.value}</span>
              </div>
              <div className="text-xs text-gray-400">
                {zone.trend > 0 ? '+' : ''}{zone.trend}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <span>Top 3 Risks:</span>
          </div>
          <div className="flex items-center space-x-2">
            {displayData.topRisks.map((risk: any, index: number) => (
              <div key={index} className="flex items-center space-x-1">
                <span>{getRiskIcon(risk.level)}</span>
                <span className="text-xs text-white">{risk.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default EnhancedSystemHealthPanel;
