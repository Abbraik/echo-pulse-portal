
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import PanelHeader from '../shared/PanelHeader';

interface CoordinationHubPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isHovered: boolean;
}

const zoneLeads = [
  { zone: 'THINK', status: 'good', lastUpdated: '2h ago', lead: 'Dr. Smith' },
  { zone: 'ACT', status: 'at-risk', lastUpdated: '1h ago', lead: 'Ms. Johnson' },
  { zone: 'MONITOR', status: 'critical', lastUpdated: '30m ago', lead: 'Mr. Brown' },
  { zone: 'LEARN', status: 'good', lastUpdated: '3h ago', lead: 'Prof. Davis' },
  { zone: 'INNOVATE', status: 'good', lastUpdated: '1h ago', lead: 'Dr. Wilson' }
];

const escalations = [
  { id: '1', message: 'Resource allocation conflict in ACT zone', severity: 'high', time: '15m ago' },
  { id: '2', message: 'Communication breakdown between teams', severity: 'medium', time: '1h ago' },
  { id: '3', message: 'Delayed milestone in THINK project', severity: 'low', time: '2h ago' }
];

const CoordinationHubPanel: React.FC<CoordinationHubPanelProps> = ({
  isFullscreen,
  onToggleFullscreen,
  isHovered
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'at-risk': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Coordination Hub"
        subtitle="Zone Leadership & Escalations"
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div className="flex-1 p-4 space-y-4">
        {/* Zone Leads Overview */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <Users size={14} className="mr-2" />
            Zone Leads
          </h4>
          <div className="space-y-2">
            {zoneLeads.map((lead) => (
              <motion.div
                key={lead.zone}
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all duration-200 group"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">{lead.zone}</span>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{lead.lastUpdated}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MessageCircle size={12} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Escalations Feed */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <AlertTriangle size={14} className="mr-2" />
            Live Escalations
          </h4>
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {escalations.map((escalation) => (
                <motion.div
                  key={escalation.id}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 group"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-white flex-1">{escalation.message}</p>
                    <Badge className={`text-xs ${getSeverityColor(escalation.severity)}`}>
                      {escalation.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{escalation.time}</span>
                    <Button 
                      size="sm" 
                      className="bg-teal-600 hover:bg-teal-700 text-xs h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CheckCircle size={12} className="mr-1" />
                      Acknowledge
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Quick Directive */}
        <div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg">
            Issue Quick Directive
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoordinationHubPanel;
