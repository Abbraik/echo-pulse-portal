
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface EnhancedSystemHealthPanelProps {
  data?: any;
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  currentMode: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const EnhancedSystemHealthPanel: React.FC<EnhancedSystemHealthPanelProps> = ({ 
  data, 
  onViewModeChange,
  currentMode,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data
  const mockData = {
    deiScore: 78.5,
    psiu: { producer: 82, stabilizer: 76, innovator: 68, unifier: 85 },
    alerts: [
      { id: '1', type: 'health', message: 'DEI score trending down', severity: 'medium', zone: 'SYSTEM' },
      { id: '2', type: 'loop', message: 'THINK loop closure delayed', severity: 'high', zone: 'THINK' },
      { id: '3', type: 'operational', message: 'Resource allocation variance', severity: 'low', zone: 'ACT' },
    ],
    entropy: [
      { zone: 'MONITOR', current: 0.27, trend: -0.02 },
      { zone: 'THINK', current: 0.24, trend: 0.03 },
      { zone: 'ACT', current: 0.31, trend: 0.01 },
      { zone: 'LEARN', current: 0.25, trend: -0.01 },
      { zone: 'INNOVATE', current: 0.29, trend: 0.02 }
    ]
  };

  const displayData = data || mockData;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getZoneColor = (zone: string) => {
    const colors: Record<string, string> = {
      'MONITOR': 'text-purple-400',
      'THINK': 'text-teal-400',
      'ACT': 'text-blue-400',
      'LEARN': 'text-orange-400',
      'INNOVATE': 'text-green-400',
      'SYSTEM': 'text-gray-400'
    };
    return colors[zone] || 'text-gray-400';
  };

  return (
    <GlassCard 
      className={`${isFullscreen ? 'h-full' : 'h-80'} p-4 relative overflow-hidden flex flex-col group`}
      style={{ 
        background: 'rgba(20, 184, 166, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        borderRadius: '2rem'
      }}
    >
      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <h3 className={`font-bold text-teal-400 ${isFullscreen ? 'text-2xl' : 'text-lg'}`}>System Health & Alerts</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onToggleFullscreen && (
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={onToggleFullscreen}
            />
          )}
          <Button
            size="sm"
            variant={currentMode === 'health' ? 'default' : 'outline'}
            onClick={() => onViewModeChange(currentMode === 'health' ? 'full' : 'health')}
            className="text-teal-400 text-xs h-7"
          >
            <Eye size={12} className="mr-1" />
            Focus
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-teal-400 h-7"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Composite Gauges - Fixed */}
      <div className={`grid grid-cols-2 gap-4 mb-4 flex-shrink-0 ${isFullscreen ? 'gap-8' : ''}`}>
        <div className="text-center">
          <h4 className={`font-medium text-teal-400 mb-2 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>DEI Score</h4>
          <div className={`relative mx-auto ${isFullscreen ? 'h-24 w-24' : 'h-16 w-16'}`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent transition-transform duration-1000"
              style={{ transform: `rotate(${(displayData.deiScore / 100) * 360}deg)` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-bold text-teal-400 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>{displayData.deiScore}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h4 className={`font-medium text-teal-400 mb-2 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>PSIU Balance</h4>
          <div className={`grid grid-cols-2 gap-1 ${isFullscreen ? 'gap-2 text-sm' : 'text-xs'}`}>
            <div className={`bg-teal-500/20 rounded text-center ${isFullscreen ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-teal-400 ${isFullscreen ? 'text-lg' : ''}`}>{displayData.psiu.producer}</div>
              <div className="text-gray-400">P</div>
            </div>
            <div className={`bg-green-500/20 rounded text-center ${isFullscreen ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-green-400 ${isFullscreen ? 'text-lg' : ''}`}>{displayData.psiu.stabilizer}</div>
              <div className="text-gray-400">S</div>
            </div>
            <div className={`bg-purple-500/20 rounded text-center ${isFullscreen ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-purple-400 ${isFullscreen ? 'text-lg' : ''}`}>{displayData.psiu.innovator}</div>
              <div className="text-gray-400">I</div>
            </div>
            <div className={`bg-orange-500/20 rounded text-center ${isFullscreen ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-orange-400 ${isFullscreen ? 'text-lg' : ''}`}>{displayData.psiu.unifier}</div>
              <div className="text-gray-400">U</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto space-y-3 pr-2">
          {/* Critical Alerts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className={`font-medium text-teal-400 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>Critical Alerts</h4>
              <Button size="sm" variant="ghost" className={`text-teal-400 h-6 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                View All ▶
              </Button>
            </div>
            <div className="space-y-1">
              {(isExpanded ? displayData.alerts : displayData.alerts.slice(0, 2)).map((alert: any) => (
                <div key={alert.id} className={`flex items-center justify-between rounded-lg ${isFullscreen ? 'p-4 bg-white/10' : 'p-2 bg-white/5'}`}>
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <AlertTriangle size={isFullscreen ? 16 : 12} className="text-orange-400 flex-shrink-0" />
                    <span className={`text-white truncate ${isFullscreen ? 'text-base' : 'text-sm'}`}>{alert.message}</span>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Badge className={`${getSeverityColor(alert.severity)} ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                      {alert.severity}
                    </Badge>
                    <span className={`${getZoneColor(alert.zone)} ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                      {alert.zone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entropy Trends */}
          <div className="space-y-2">
            <h4 className={`font-medium text-teal-400 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>Entropy Trends</h4>
            <div className="grid grid-cols-1 gap-1">
              {displayData.entropy.map((zone: any) => (
                <div key={zone.zone} className={`flex items-center justify-between rounded ${isFullscreen ? 'p-3 bg-white/10 text-sm' : 'p-2 bg-white/5 text-xs'}`}>
                  <span className={`font-medium ${getZoneColor(zone.zone)}`}>{zone.zone}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">{zone.current}</span>
                    <div className={`flex items-center ${zone.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {zone.trend > 0 ? <TrendingUp size={isFullscreen ? 12 : 10} /> : <TrendingDown size={isFullscreen ? 12 : 10} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default EnhancedSystemHealthPanel;
