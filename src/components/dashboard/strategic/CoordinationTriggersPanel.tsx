
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, ArrowRight, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';

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
}

export const CoordinationTriggersPanel: React.FC<CoordinationTriggersPanelProps> = ({ data }) => {
  const [escalationFilter, setEscalationFilter] = useState('all');

  // Mock data if not provided
  const mockData = {
    redesignFlags: [
      { id: '1', pattern: 'Role Dropouts', severity: 'high' as const, description: 'Persistent role abandonment in ACT zone', occurrences: 5 },
      { id: '2', pattern: 'Rework Loops', severity: 'medium' as const, description: 'Increasing rework cycles in THINK processes', occurrences: 3 },
      { id: '3', pattern: 'Communication Gaps', severity: 'low' as const, description: 'Minor coordination delays', occurrences: 2 }
    ],
    facilitatorEscalations: [
      { id: '1', type: 'role' as const, message: 'Unclaimed facilitator role in INNOVATE', zone: 'INNOVATE', timestamp: '2 min ago' },
      { id: '2', type: 'blocker' as const, message: 'Resource constraint blocking ACT sprint', zone: 'ACT', timestamp: '5 min ago' },
      { id: '3', type: 'integrity' as const, message: 'Communication breakdown in THINK portal', zone: 'THINK', timestamp: '8 min ago' }
    ],
    zoneLeads: [
      { zone: 'MONITOR', deliveryQuality: 92, entropy: 0.27, lastLoopClosure: '2h ago', status: 'active' as const },
      { zone: 'THINK', deliveryQuality: 85, entropy: 0.24, lastLoopClosure: '4h ago', status: 'attention' as const },
      { zone: 'ACT', deliveryQuality: 78, entropy: 0.31, lastLoopClosure: '1h ago', status: 'critical' as const },
      { zone: 'LEARN', deliveryQuality: 88, entropy: 0.25, lastLoopClosure: '3h ago', status: 'active' as const },
      { zone: 'INNOVATE', deliveryQuality: 91, entropy: 0.29, lastLoopClosure: '6h ago', status: 'active' as const }
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
    switch (zone) {
      case 'MONITOR': return 'text-purple-400';
      case 'THINK': return 'text-teal-400';
      case 'ACT': return 'text-blue-400';
      case 'LEARN': return 'text-orange-400';
      case 'INNOVATE': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <GlassCard className="h-full p-4 bg-purple-500/10 border-purple-500/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-purple-400">Coordination & Triggers</h3>
          <Button size="sm" variant="ghost" className="text-purple-400">
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
        </div>

        {/* Redesign Flags Council */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-purple-400">Redesign Flags</h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {displayData.redesignFlags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(flag.severity)}>
                    {flag.severity}
                  </Badge>
                  <div>
                    <div className="text-sm font-medium text-white">{flag.pattern}</div>
                    <div className="text-xs text-gray-400">{flag.occurrences}x occurrences</div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs">
                  Details <ArrowRight size={12} className="ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Facilitator Escalations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-purple-400">Live Escalations</h4>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant={escalationFilter === 'all' ? 'default' : 'ghost'}
                className="text-xs h-6"
                onClick={() => setEscalationFilter('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={escalationFilter === 'role' ? 'default' : 'ghost'}
                className="text-xs h-6"
                onClick={() => setEscalationFilter('role')}
              >
                Role
              </Button>
              <Button
                size="sm"
                variant={escalationFilter === 'blocker' ? 'default' : 'ghost'}
                className="text-xs h-6"
                onClick={() => setEscalationFilter('blocker')}
              >
                Blocker
              </Button>
            </div>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {displayData.facilitatorEscalations
              .filter(esc => escalationFilter === 'all' || esc.type === escalationFilter)
              .map((escalation) => (
              <div key={escalation.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {escalation.type}
                    </Badge>
                    <span className={`text-xs font-medium ${getZoneColor(escalation.zone)}`}>
                      {escalation.zone}
                    </span>
                  </div>
                  <div className="text-sm text-white mt-1">{escalation.message}</div>
                  <div className="text-xs text-gray-400">{escalation.timestamp}</div>
                </div>
                <Button size="sm" variant="ghost" className="text-xs">
                  Reassign
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Leads Snapshot */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-purple-400">Zone Leads</h4>
            <Button size="sm" variant="ghost" className="text-xs text-purple-400">
              <Users size={12} className="mr-1" />
              Council
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
            {displayData.zoneLeads.map((lead) => (
              <div key={lead.zone} className="flex items-center justify-between p-2 bg-white/5 rounded">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm ${getZoneColor(lead.zone)}`}>
                    {lead.zone}
                  </span>
                  <div className="flex space-x-1 text-xs">
                    <span className={getStatusColor(lead.status)}>
                      {lead.deliveryQuality}%
                    </span>
                    <span className="text-gray-400">E:{lead.entropy}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{lead.lastLoopClosure}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
