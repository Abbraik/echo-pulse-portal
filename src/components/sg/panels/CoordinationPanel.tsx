
import React from 'react';
import { CoordinationHub } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Users, Shield, Zap, Eye } from 'lucide-react';

interface CoordinationPanelProps {
  data: CoordinationHub;
  actions?: {
    acknowledgeEscalation: (id: string) => Promise<void>;
  };
}

const CoordinationPanel: React.FC<CoordinationPanelProps> = ({ data, actions }) => {
  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'Think':
        return <Eye size={14} className="text-blue-400" />;
      case 'Act':
        return <Zap size={14} className="text-orange-400" />;
      case 'Monitor':
        return <Shield size={14} className="text-green-400" />;
      case 'Learn':
        return <Users size={14} className="text-purple-400" />;
      case 'Innovate':
        return <AlertTriangle size={14} className="text-pink-400" />;
      default:
        return <Clock size={14} className="text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle size={14} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={14} className="text-amber-400" />;
      case 'critical':
        return <AlertTriangle size={14} className="text-red-400" />;
      default:
        return <Clock size={14} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleAcknowledge = async (id: string) => {
    if (actions?.acknowledgeEscalation) {
      await actions.acknowledgeEscalation(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone Leads */}
      <div className="glass-panel-cinematic p-4">
        <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
          <Users size={14} className="mr-2" />
          Zone Leadership Status
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {data.zoneLeads.map((lead) => (
            <div key={lead.zone} className="glass-panel p-3 hover:neon-border transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                    {getZoneIcon(lead.zone)}
                  </div>
                  <div>
                    <span className="text-sm text-white font-medium font-noto">{lead.zone}</span>
                    {lead.leadName && (
                      <div className="text-xs text-gray-400 font-noto">{lead.leadName}</div>
                    )}
                  </div>
                </div>
                <Badge className={`${getStatusColor(lead.status)} text-xs font-mono border flex items-center gap-1`}>
                  {getStatusIcon(lead.status)}
                  {lead.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono">
                  Last update: {new Date(lead.lastUpdate).toLocaleTimeString()}
                </span>
                {lead.activeItems && (
                  <span className="font-mono font-medium">
                    {lead.activeItems} active items
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalations */}
      <div className="glass-panel-cinematic p-4">
        <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
          <AlertTriangle size={14} className="mr-2" />
          Active Escalations
        </h4>
        <div className="space-y-3">
          {data.escalations.map((escalation) => (
            <div key={escalation.id} className="glass-panel p-4 space-y-3 hover:neon-border transition-all duration-300 group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-white font-noto-medium group-hover:text-teal-200 transition-colors">
                      {escalation.issue}
                    </h5>
                    <Badge className={`${getSeverityColor(escalation.severity)} text-xs font-mono border flex items-center gap-1 ml-2`}>
                      <AlertTriangle size={10} />
                      {escalation.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span className="font-mono">{escalation.openedAt}</span>
                    </div>
                    {escalation.assignedTo && (
                      <div className="flex items-center space-x-1">
                        <Users size={12} />
                        <span className="font-noto">Assigned: {escalation.assignedTo}</span>
                      </div>
                    )}
                  </div>
                  
                  {escalation.affectedZones && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {escalation.affectedZones.map((zone) => (
                        <span key={zone} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 font-mono">
                          {zone}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <Button 
                  size="sm" 
                  className="bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 border border-teal-500/30 hover:border-teal-400/50 backdrop-blur-sm transition-all duration-200"
                  onClick={() => handleAcknowledge(escalation.id)}
                >
                  <Shield size={14} className="mr-1" />
                  Acknowledge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinationPanel;
