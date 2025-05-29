
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flag, Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassMasonryCard } from './GlassMasonryCard';

const mockCoordinationData = {
  flags: [
    { id: '1', title: 'Role Dropouts in ACT Zone', severity: 'high', zone: 'ACT' },
    { id: '2', title: 'Rework Loops Detected', severity: 'medium', zone: 'THINK' },
    { id: '3', title: 'Coordination Bottleneck', severity: 'low', zone: 'MONITOR' }
  ],
  escalations: [
    { id: '1', type: 'Resource Conflict', zone: 'INNOVATE', timestamp: '2 min ago' },
    { id: '2', type: 'Timeline Delay', zone: 'ACT', timestamp: '5 min ago' }
  ],
  zoneLeads: [
    { zone: 'THINK', lead: 'Dr. Sarah Chen', status: 'active' },
    { zone: 'ACT', lead: 'Marcus Rodriguez', status: 'escalated' }
  ]
};

export const LargeCoordinationCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="coordination-large" variant="large" type="coordination" {...props}>
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600" style={{ fontFamily: 'Noto Sans' }}>
          Redesign Flags
        </h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-purple-400 w-6 h-6 p-0">
            <ChevronLeft size={14} />
          </Button>
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-purple-400 w-6 h-6 p-0">
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <motion.div className="space-y-4">
          {mockCoordinationData.flags.map((flag) => (
            <motion.div
              key={flag.id}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Flag className="w-4 h-4 text-purple-400 mr-2" />
                  <h4 className="text-sm font-medium text-white">{flag.title}</h4>
                </div>
                <Badge 
                  className={`text-xs ${
                    flag.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                    flag.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {flag.severity}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{flag.zone} Zone</span>
                <Button size="sm" variant="ghost" className="text-purple-400 hover:bg-purple-400/10 h-6 px-2 text-xs">
                  Investigate
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </GlassMasonryCard>
);

export const MediumCoordinationCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="coordination-medium" variant="medium" type="coordination" {...props}>
    <div className="h-full">
      <h4 className="text-sm font-semibold text-purple-400 mb-4" style={{ fontFamily: 'Noto Sans' }}>
        Live Escalations
      </h4>
      
      <div className="space-y-3">
        {mockCoordinationData.escalations.map((escalation) => (
          <motion.div
            key={escalation.id}
            className="p-3 bg-white/5 rounded-lg border border-white/10"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white">{escalation.type}</span>
              <ArrowRight className="w-3 h-3 text-purple-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{escalation.zone}</span>
              <span className="text-xs text-gray-500">{escalation.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </GlassMasonryCard>
);

export const SmallCoordinationCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="coordination-small" variant="small" type="coordination" {...props}>
    <div className="h-full flex flex-col">
      <h4 className="text-sm font-semibold text-purple-400 mb-4" style={{ fontFamily: 'Noto Sans' }}>
        Zone Leads
      </h4>
      
      <div className="flex-1 space-y-3">
        {mockCoordinationData.zoneLeads.map((lead, index) => (
          <div key={index} className="p-3 bg-white/5 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="w-3 h-3 text-purple-400 mr-2" />
              <span className="text-xs font-medium text-white">{lead.zone}</span>
            </div>
            <div className="text-xs text-gray-400 mb-1">{lead.lead}</div>
            <Badge 
              className={`text-xs ${
                lead.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
              }`}
            >
              {lead.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  </GlassMasonryCard>
);
