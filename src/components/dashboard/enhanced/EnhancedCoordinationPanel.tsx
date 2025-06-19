
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertCircle, ArrowRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface EnhancedCoordinationPanelProps {
  data?: any;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isExpanded?: boolean;
  isContracted?: boolean;
}

const EnhancedCoordinationPanel: React.FC<EnhancedCoordinationPanelProps> = ({ 
  data,
  isFullscreen = false,
  onToggleFullscreen,
  isExpanded = false,
  isContracted = false
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Mock data
  const mockData = {
    redesignFlags: [
      { id: '1', pattern: 'Role Dropouts', severity: 'high', occurrences: 5, description: 'Persistent role abandonment in ACT zone' },
      { id: '2', pattern: 'Rework Loops', severity: 'medium', occurrences: 3, description: 'Increasing rework cycles in THINK processes' },
      { id: '3', pattern: 'Communication Gaps', severity: 'low', occurrences: 2, description: 'Minor coordination delays' }
    ],
    escalations: [
      { id: '1', type: 'role', message: 'Unclaimed facilitator role in INNOVATE', zone: 'INNOVATE', time: '2 min ago' },
      { id: '2', type: 'blocker', message: 'Resource constraint blocking ACT sprint', zone: 'ACT', time: '5 min ago' },
      { id: '3', type: 'integrity', message: 'Communication breakdown in THINK portal', zone: 'THINK', time: '8 min ago' }
    ],
    zoneLeads: [
      { zone: 'MONITOR', delivery: 92, entropy: 0.27, lastClosure: '2h ago', status: 'active' },
      { zone: 'THINK', delivery: 85, entropy: 0.24, lastClosure: '4h ago', status: 'attention' },
      { zone: 'ACT', delivery: 78, entropy: 0.31, lastClosure: '1h ago', status: 'critical' },
      { zone: 'LEARN', delivery: 88, entropy: 0.25, lastClosure: '3h ago', status: 'active' },
      { zone: 'INNOVATE', delivery: 91, entropy: 0.29, lastClosure: '6h ago', status: 'active' }
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

  // Dynamic sizing classes
  const getTextSize = () => {
    if (isContracted) return { heading: 'text-sm', body: 'text-xs', icon: 'h-3 w-3' };
    if (isExpanded) return { heading: 'text-lg', body: 'text-sm', icon: 'h-4 w-4' };
    return { heading: 'text-base', body: 'text-sm', icon: 'h-4 w-4' };
  };

  const textSizes = getTextSize();

  const getGridLayout = () => {
    if (isContracted) return 'grid-cols-1';
    if (isExpanded) return 'lg:grid-cols-2';
    return 'lg:grid-cols-2';
  };

  if (isContracted) {
    return (
      <div className="p-3 h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h3 className={`font-bold text-purple-400 ${textSizes.heading}`}>Coordination</h3>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
        </div>

        {/* Top 2 Flags */}
        <div className="space-y-1 mb-3 flex-shrink-0">
          {(displayData.redesignFlags || []).slice(0, 2).map((flag: any) => (
            <div key={flag.id} className="p-2 bg-white/5 rounded text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Badge className={`${getSeverityColor(flag.severity)} text-xs`}>
                    {flag.severity}
                  </Badge>
                  <span className="font-medium text-white text-xs truncate">{flag.pattern}</span>
                </div>
                <span className="text-xs text-gray-400">{flag.occurrences}x</span>
              </div>
            </div>
          ))}
        </div>

        {/* Zone Status */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="space-y-1">
            {(displayData.zoneLeads || []).slice(0, 3).map((lead: any) => (
              <div key={lead.zone} className="flex items-center justify-between p-1 bg-white/5 rounded text-xs">
                <span className={`font-medium ${getZoneColor(lead.zone)} text-xs`}>
                  {lead.zone}
                </span>
                <span className={`${getStatusColor(lead.status)} text-xs`}>
                  {lead.delivery}%
                </span>
              </div>
            ))}
            <Button size="sm" variant="ghost" className="w-full text-purple-400 text-xs mt-2">
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
          <h3 className={`font-bold text-purple-400 ${textSizes.heading}`}>Coordination & Triggers</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onToggleFullscreen && (
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={onToggleFullscreen}
            />
          )}
          <Button size="sm" variant="ghost" className={`text-purple-400 h-7 ${textSizes.body}`}>
            <RefreshCw size={12} className="mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className={`text-purple-400 h-7 ${isExpanded ? 'h-8' : ''}`}
          >
            {isDetailsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className={`grid grid-cols-1 ${getGridLayout()} gap-4 h-full`}>
          {/* Left Column */}
          <div className="space-y-3 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-1">
                {/* Redesign Flags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold text-purple-400 ${textSizes.body}`}>Redesign Flags</h4>
                    <Button size="sm" variant="ghost" className={`text-purple-400 h-6 ${textSizes.body}`}>
                      View All ▶
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <AnimatePresence>
                      {(isDetailsExpanded ? (displayData.redesignFlags || []) : (displayData.redesignFlags || []).slice(0, 2)).map((flag: any) => (
                        <motion.div
                          key={flag.id}
                          className={`rounded-lg hover:bg-white/10 transition-all group cursor-pointer ${isExpanded ? 'p-3 bg-white/10' : 'p-2 bg-white/5'}`}
                          whileHover={{ scale: 1.01 }}
                          layout
                          transition={{ duration: 0.2 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              <Badge className={`${getSeverityColor(flag.severity)} text-xs`}>
                                {flag.severity}
                              </Badge>
                              <div className="min-w-0">
                                <div className={`font-medium text-white truncate ${textSizes.body}`}>{flag.pattern}</div>
                                <div className={`text-gray-400 text-xs`}>{flag.occurrences}x</div>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="ghost" className={`h-6 text-xs`}>
                                Details
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Facilitator Escalations */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold text-purple-400 ${textSizes.body}`}>Live Escalations</h4>
                    <Button size="sm" variant="ghost" className={`text-purple-400 h-6 ${textSizes.body}`}>
                      View All ▶
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <AnimatePresence>
                      {(isDetailsExpanded ? (displayData.escalations || []) : (displayData.escalations || []).slice(0, 2)).map((escalation: any) => (
                        <motion.div
                          key={escalation.id}
                          className={`rounded-lg hover:bg-white/10 transition-all group cursor-pointer ${isExpanded ? 'p-3 bg-white/10' : 'p-2 bg-white/5'}`}
                          whileHover={{ scale: 1.01 }}
                          layout
                          transition={{ duration: 0.2 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {escalation.type}
                                </Badge>
                                <span className={`font-medium ${getZoneColor(escalation.zone)} text-xs`}>
                                  {escalation.zone}
                                </span>
                              </div>
                              <div className={`text-white truncate ${textSizes.body}`}>{escalation.message}</div>
                              <div className={`text-gray-400 text-xs`}>{escalation.time}</div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="ghost" className={`h-6 text-xs`}>
                                Reassign
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - Zone Leads (only show in expanded/normal state) */}
          {!isContracted && (
            <div className="space-y-2 min-h-0">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold text-purple-400 ${textSizes.body}`}>Zone Leads</h4>
                <Button size="sm" variant="ghost" className={`text-purple-400 h-6 ${textSizes.body}`}>
                  <Users size={10} className="mr-1" />
                  Council ▶
                </Button>
              </div>
              
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 gap-1 pr-1">
                  {(displayData.zoneLeads || []).map((lead: any) => (
                    <motion.div
                      key={lead.zone}
                      className={`rounded-lg hover:bg-white/10 transition-all group cursor-pointer ${isExpanded ? 'p-2 bg-white/10' : 'p-1 bg-white/5'}`}
                      whileHover={{ scale: 1.01 }}
                      layout
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${getZoneColor(lead.zone)} ${textSizes.body}`}>
                            {lead.zone}
                          </span>
                          <div className={`flex space-x-1 text-xs`}>
                            <span className={getStatusColor(lead.status)}>
                              {lead.delivery}%
                            </span>
                            <span className="text-gray-400">E:{lead.entropy}</span>
                          </div>
                        </div>
                        <div className={`text-gray-400 text-xs`}>{lead.lastClosure}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedCoordinationPanel;
