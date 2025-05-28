
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, ArrowRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EnhancedCoordinationPanelProps {
  data?: any;
}

const EnhancedCoordinationPanel: React.FC<EnhancedCoordinationPanelProps> = ({ data }) => {
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
      className="h-full p-6 relative"
      style={{ 
        background: 'rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '2rem'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-purple-400">Coordination & Triggers</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Active</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" className="text-purple-400">
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-400"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Redesign Flags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-purple-400">Redesign Flags</h4>
              <Button size="sm" variant="ghost" className="text-xs text-purple-400">
                View All ▶
              </Button>
            </div>
            
            <div className="space-y-2">
              {(isExpanded ? displayData.redesignFlags : displayData.redesignFlags.slice(0, 2)).map((flag: any) => (
                <motion.div
                  key={flag.id}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(flag.severity)}>
                        {flag.severity}
                      </Badge>
                      <div>
                        <div className="font-medium text-white text-sm">{flag.pattern}</div>
                        <div className="text-xs text-gray-400">{flag.occurrences}x occurrences</div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="text-xs">
                        Details <ArrowRight size={12} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Facilitator Escalations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-purple-400">Live Escalations</h4>
              <Button size="sm" variant="ghost" className="text-xs text-purple-400">
                View All ▶
              </Button>
            </div>
            
            <div className="space-y-2">
              {(isExpanded ? displayData.escalations : displayData.escalations.slice(0, 2)).map((escalation: any) => (
                <motion.div
                  key={escalation.id}
                  className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {escalation.type}
                        </Badge>
                        <span className={`text-xs font-medium ${getZoneColor(escalation.zone)}`}>
                          {escalation.zone}
                        </span>
                      </div>
                      <div className="text-sm text-white">{escalation.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{escalation.time}</div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="text-xs">
                        Reassign ▶
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Zone Leads */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-purple-400">Zone Leads</h4>
            <Button size="sm" variant="ghost" className="text-xs text-purple-400">
              <Users size={12} className="mr-1" />
              Council ▶
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {displayData.zoneLeads.map((lead: any) => (
              <motion.div
                key={lead.zone}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium text-sm ${getZoneColor(lead.zone)}`}>
                      {lead.zone}
                    </span>
                    <div className="flex space-x-2 text-xs">
                      <span className={getStatusColor(lead.status)}>
                        {lead.delivery}%
                      </span>
                      <span className="text-gray-400">E:{lead.entropy}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{lead.lastClosure}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default EnhancedCoordinationPanel;
