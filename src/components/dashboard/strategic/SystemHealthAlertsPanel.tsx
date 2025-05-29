import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Zap, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface SystemHealthAlertsPanelProps {
  data?: {
    deiScore: number;
    psiu: { producer: number; stabilizer: number; innovator: number; unifier: number };
    entropyTrend: Array<{ zone: string; current: number; trend: number }>;
    alerts: Array<{ id: string; type: 'health' | 'loop' | 'operational'; message: string; severity: 'high' | 'medium' | 'low' }>;
    risks: Array<{ id: string; name: string; likelihood: number; impact: number }>;
  };
  onAlertClick?: (alertType: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const SystemHealthAlertsPanel: React.FC<SystemHealthAlertsPanelProps> = ({ 
  data, 
  onAlertClick,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  // Mock data if not provided
  const mockData = {
    deiScore: 78.5,
    psiu: { producer: 82, stabilizer: 76, innovator: 68, unifier: 85 },
    entropyTrend: [
      { zone: 'MONITOR', current: 0.27, trend: -0.02 },
      { zone: 'THINK', current: 0.24, trend: 0.03 },
      { zone: 'ACT', current: 0.31, trend: 0.01 },
      { zone: 'LEARN', current: 0.25, trend: -0.01 },
      { zone: 'INNOVATE', current: 0.29, trend: 0.02 }
    ],
    alerts: [
      { id: '1', type: 'health' as const, message: 'DEI score trending down', severity: 'medium' as const },
      { id: '2', type: 'loop' as const, message: 'THINK loop closure delayed', severity: 'high' as const },
      { id: '3', type: 'operational' as const, message: 'Resource allocation variance', severity: 'low' as const }
    ],
    risks: [
      { id: '1', name: 'Policy Drift', likelihood: 0.7, impact: 0.8 },
      { id: '2', name: 'Resource Shortage', likelihood: 0.4, impact: 0.9 },
      { id: '3', name: 'Stakeholder Disengagement', likelihood: 0.6, impact: 0.6 }
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

  return (
    <div className={`${
      isFullscreen ? 'fixed inset-0 z-50 bg-black/60' : 'h-full'
    }`}>
      {isFullscreen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onToggleFullscreen} />
      )}
      
      <div className={`${
        isFullscreen 
          ? 'absolute inset-4 md:inset-8 bg-background/95 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden'
          : 'h-full'
      } glass-panel-deep p-6 flex flex-col`}>
        
        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-teal-400">System Health & Alerts</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Live</span>
              </div>
              {onToggleFullscreen && (
                <FullscreenButton
                  isFullscreen={isFullscreen}
                  onToggle={onToggleFullscreen}
                />
              )}
              {isFullscreen && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onToggleFullscreen}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close full-screen view"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>

          {/* Composite Gauge */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-teal-400">DEI Score</h4>
              <div className="relative h-24 w-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-8 border-gray-700/30"></div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent"
                  style={{ transform: `rotate(${(displayData.deiScore / 100) * 360}deg)` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-teal-400">{displayData.deiScore}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-teal-400">PSIU Balance</h4>
              <div className="relative h-24 w-24 mx-auto">
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

          {/* Entropy Sparklines */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-teal-400">Entropy Trends</h4>
            <div className="grid grid-cols-5 gap-1 text-xs">
              {displayData.entropyTrend.map((zone) => (
                <div key={zone.zone} className="text-center p-1 bg-white/5 rounded">
                  <div className="font-medium text-white">{zone.zone}</div>
                  <div className={`flex items-center justify-center ${zone.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {zone.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span className="ml-1">{zone.current}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alert Ticker */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-teal-400">Active Alerts</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {displayData.alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="flex items-center justify-between p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => onAlertClick?.(alert.type)}
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle size={14} className="text-orange-400" />
                    <span className="text-sm text-white">{alert.message}</span>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Overview */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-teal-400">Risk Matrix</h4>
            <div className="grid grid-cols-3 gap-1 text-xs">
              {displayData.risks.map((risk) => (
                <div key={risk.id} className="p-2 bg-white/5 rounded text-center">
                  <div className="font-medium text-white truncate">{risk.name}</div>
                  <div className="text-gray-400">L:{Math.round(risk.likelihood*10)} I:{Math.round(risk.impact*10)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
