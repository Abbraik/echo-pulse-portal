
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface EnhancedSystemHealthPanelProps {
  data?: any;
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  currentMode: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isExpanded?: boolean;
  isContracted?: boolean;
}

const EnhancedSystemHealthPanel: React.FC<EnhancedSystemHealthPanelProps> = ({ 
  data, 
  onViewModeChange,
  currentMode,
  isFullscreen = false,
  onToggleFullscreen,
  isExpanded = false,
  isContracted = false
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

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
  const psiuData = displayData.psiu || mockData.psiu;

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

  // Dynamic sizing classes
  const getTextSize = () => {
    if (isContracted) return { heading: 'text-sm', body: 'text-xs', icon: 'h-3 w-3' };
    if (isExpanded) return { heading: 'text-lg', body: 'text-sm', icon: 'h-4 w-4' };
    return { heading: 'text-base', body: 'text-sm', icon: 'h-4 w-4' };
  };

  const textSizes = getTextSize();

  const getGridLayout = () => {
    if (isContracted) return 'grid-cols-1';
    if (isExpanded) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  if (isContracted) {
    return (
      <div className="p-3 h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h3 className={`font-bold text-teal-400 ${textSizes.heading}`}>System Health</h3>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {/* Compact Gauges */}
        <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
          <div className="text-center">
            <div className="relative h-12 w-12 mx-auto mb-1">
              <div className="absolute inset-0 rounded-full border-2 border-gray-700/30"></div>
              <div 
                className="absolute inset-0 rounded-full border-2 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent transition-transform duration-1000"
                style={{ transform: `rotate(${(displayData.deiScore / 100) * 360}deg)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-teal-400 text-xs">{displayData.deiScore}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">DEI</div>
          </div>
          <div className="text-center">
            <div className="grid grid-cols-2 gap-1 text-xs mb-1">
              <div className="bg-teal-500/20 rounded p-1">
                <div className="font-bold text-teal-400 text-xs">{psiuData.producer}</div>
                <div className="text-gray-400 text-xs">P</div>
              </div>
              <div className="bg-green-500/20 rounded p-1">
                <div className="font-bold text-green-400 text-xs">{psiuData.stabilizer}</div>
                <div className="text-gray-400 text-xs">S</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">PSIU</div>
          </div>
        </div>

        {/* Top 2 Alerts */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="space-y-1 h-full">
            {(displayData.alerts || []).slice(0, 2).map((alert: any) => (
              <div key={alert.id} className="p-2 bg-white/5 rounded text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 flex-1 min-w-0">
                    <AlertTriangle size={10} className="text-orange-400 flex-shrink-0" />
                    <span className="text-white truncate text-xs">{alert.message}</span>
                  </div>
                  <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
                    {alert.severity}
                  </Badge>
                </div>
              </div>
            ))}
            <Button size="sm" variant="ghost" className="w-full text-teal-400 text-xs mt-2">
              View More ▶
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full p-4 relative overflow-hidden flex flex-col`}>
      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <h3 className={`font-bold text-teal-400 ${textSizes.heading}`}>System Health & Alerts</h3>
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
            className={`text-teal-400 text-xs h-7 ${isExpanded ? 'text-sm h-8' : ''}`}
          >
            <Eye size={textSizes.icon === 'h-3 w-3' ? 10 : 12} className="mr-1" />
            Focus
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className={`text-teal-400 h-7 ${isExpanded ? 'h-8' : ''}`}
          >
            {isDetailsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Composite Gauges - Fixed */}
      <div className={`grid gap-4 mb-4 flex-shrink-0 ${getGridLayout()}`}>
        <div className="text-center">
          <h4 className={`font-medium text-teal-400 mb-2 ${textSizes.body}`}>DEI Score</h4>
          <div className={`relative mx-auto ${isExpanded ? 'h-24 w-24' : 'h-20 w-20'}`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent transition-transform duration-1000"
              style={{ transform: `rotate(${(displayData.deiScore / 100) * 360}deg)` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-bold text-teal-400 ${isExpanded ? 'text-lg' : 'text-base'}`}>{displayData.deiScore}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h4 className={`font-medium text-teal-400 mb-2 ${textSizes.body}`}>PSIU Balance</h4>
          <div className={`grid grid-cols-2 gap-1 ${textSizes.body}`}>
            <div className={`bg-teal-500/20 rounded text-center ${isExpanded ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-teal-400 ${isExpanded ? 'text-base' : 'text-sm'}`}>{psiuData.producer}</div>
              <div className="text-gray-400 text-xs">P</div>
            </div>
            <div className={`bg-green-500/20 rounded text-center ${isExpanded ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-green-400 ${isExpanded ? 'text-base' : 'text-sm'}`}>{psiuData.stabilizer}</div>
              <div className="text-gray-400 text-xs">S</div>
            </div>
            <div className={`bg-purple-500/20 rounded text-center ${isExpanded ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-purple-400 ${isExpanded ? 'text-base' : 'text-sm'}`}>{psiuData.innovator}</div>
              <div className="text-gray-400 text-xs">I</div>
            </div>
            <div className={`bg-orange-500/20 rounded text-center ${isExpanded ? 'p-2' : 'p-1'}`}>
              <div className={`font-bold text-orange-400 ${isExpanded ? 'text-base' : 'text-sm'}`}>{psiuData.unifier}</div>
              <div className="text-gray-400 text-xs">U</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 pr-2">
            {/* Critical Alerts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium text-teal-400 ${textSizes.body}`}>Critical Alerts</h4>
                <Button size="sm" variant="ghost" className={`text-teal-400 h-6 ${textSizes.body}`}>
                  View All ▶
                </Button>
              </div>
              <div className="space-y-1">
                <AnimatePresence>
                  {(isDetailsExpanded ? (displayData.alerts || []) : (displayData.alerts || []).slice(0, 3)).map((alert: any) => (
                    <motion.div
                      key={alert.id}
                      className={`flex items-center justify-between rounded-lg ${isExpanded ? 'p-3 bg-white/10' : 'p-2 bg-white/5'}`}
                      layout
                      transition={{ duration: 0.2 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <AlertTriangle size={isExpanded ? 16 : 12} className="text-orange-400 flex-shrink-0" />
                        <span className={`text-white truncate ${textSizes.body}`}>{alert.message}</span>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge className={`${getSeverityColor(alert.severity)} text-xs`}>
                          {alert.severity}
                        </Badge>
                        <span className={`${getZoneColor(alert.zone)} text-xs`}>
                          {alert.zone}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Entropy Trends */}
            <div className="space-y-2">
              <h4 className={`font-medium text-teal-400 ${textSizes.body}`}>Entropy Trends</h4>
              <div className="grid grid-cols-1 gap-1">
                {(displayData.entropy || []).map((zone: any) => (
                  <motion.div
                    key={zone.zone}
                    className={`flex items-center justify-between rounded ${isExpanded ? 'p-2 bg-white/10' : 'p-1 bg-white/5'}`}
                    layout
                    transition={{ duration: 0.2 }}
                  >
                    <span className={`font-medium ${getZoneColor(zone.zone)} ${textSizes.body}`}>{zone.zone}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`text-white ${textSizes.body}`}>{zone.current}</span>
                      <div className={`flex items-center ${zone.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {zone.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EnhancedSystemHealthPanel;
