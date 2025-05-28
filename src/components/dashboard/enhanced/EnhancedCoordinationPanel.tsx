
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, ArrowRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface EnhancedCoordinationPanelProps {
  data?: any;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const EnhancedCoordinationPanel: React.FC<EnhancedCoordinationPanelProps> = ({ 
  data,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <GlassCard 
      className={`${isFullscreen ? 'h-full' : 'h-80'} p-4 relative overflow-hidden flex flex-col group`}
      style={{ 
        background: 'rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '2rem'
      }}
    >
      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <h3 className={`font-bold text-purple-400 ${isFullscreen ? 'text-2xl' : 'text-lg'}`}>Coordination & Triggers</h3>
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
          <Button size="sm" variant="ghost" className={`text-purple-400 h-7 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
            <RefreshCw size={12} className="mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-400 h-7"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-4 h-full`}>
          {/* Left Column */}
          <div className="space-y-3 overflow-auto pr-1">
            {/* Redesign Flags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold text-purple-400 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>Redesign Flags</h4>
                <Button size="sm" variant="ghost" className={`text-purple-400 h-6 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                  View All ▶
                </Button>
              </div>
              
              <div className="space-y-1">
                {(isExpanded ? displayData.redesignFlags : displayData.redesignFlags.slice(0, 2)).map((flag: any) => (
                  <motion.div
                    key={flag.id}
                    className={`rounded-lg hover:bg-white/10 transition-all group cursor-pointer ${isFullscreen ? 'p-4 bg-white/10' : 'p-2 bg-white/5'}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Badge className={`${getSeverityColor(flag.severity)} ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                          {flag.severity}
                        </Badge>
                        <div className="min-w-0">
                          <div className={`font-medium text-white truncate ${isFullscreen ? 'text-base' : 'text-sm'}`}>{flag.pattern}</div>
                          <div className={`text-gray-400 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>{flag.occurrences}x</div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className={`h-6 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                          Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Facilitator Escalations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold text-purple-400 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>Live Escalations</h4>
                <Button size="sm" variant="ghost" className={`text-purple-400 h-6 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                  View All ▶
                </Button>
              </div>
              
              <div className="space-y-1">
                {(isExpanded ? displayData.escalations : displayData.escalations.slice(0, 2)).map((escalation: any) => (
                  <motion.div
                    key={escalation.id}
                    className={`rounded-lg hover:bg-white/10 transition-all group cursor-pointer ${isFullscreen ? 'p-4 bg-white/10' : 'p-2 bg-white/5'}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className={isFullscreen ? 'text-sm' : 'text-xs'}>
                            {escalation.type}
                          </Badge>
                          <span className={`font-medium ${getZoneColor(escalation.zone)} ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                            {escalation.zone}
                          </span>
                        </div>
                        <div className={`text-white truncate ${isFullscreen ? 'text-base' : 'text-sm'}`}>{escalation.message}</div>
                        <div className={`text-gray-400 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>{escalation.time}</div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className={`h-6 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                          Reassign
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Zone Leads */}
          <div className="space-y-2 overflow-auto pr-1">
            <div className="flex items-center justify-between">
              <h4 className={`font-semibold text-purple-400 ${isFullscreen ? 'text-lg' : 'text-sm'}`}>Zone Leads</h4>
              <Button size="sm" variant="ghost" className={`text-purple-400 h-6 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                <Users size={10} className="mr-1" />
                Council ▶
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              {displayData.zoneLeads.map((lead: any) => (
                <motion.div
                  key={lead.zone}
                  className={`rounded-lg hover:bg-white/10 transition-all group cursor-pointer ${isFullscreen ? 'p-3 bg-white/10' : 'p-2 bg-white/5'}`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${getZoneColor(lead.zone)} ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                        {lead.zone}
                      </span>
                      <div className={`flex space-x-1 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>
                        <span className={getStatusColor(lead.status)}>
                          {lead.delivery}%
                        </span>
                        <span className="text-gray-400">E:{lead.entropy}</span>
                      </div>
                    </div>
                    <div className={`text-gray-400 ${isFullscreen ? 'text-sm' : 'text-xs'}`}>{lead.lastClosure}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default EnhancedCoordinationPanel;
