
import React from 'react';
import { CoordinationHub } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';

interface CoordinationPanelProps {
  data: CoordinationHub;
  actions?: {
    acknowledgeEscalation: (id: string) => Promise<void>;
  };
}

const CoordinationPanel: React.FC<CoordinationPanelProps> = ({ data, actions }) => {
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
        return 'bg-green-500/20 text-green-400';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400';
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-400';
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
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
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Zone Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {data.zoneLeads.map((lead) => (
            <div key={lead.zone} className="bg-white/5 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(lead.status)}
                  <span className="text-xs text-white font-medium">{lead.zone}</span>
                </div>
                <Badge className={getStatusColor(lead.status)}>
                  {lead.status}
                </Badge>
              </div>
              {lead.leadName && (
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Users size={10} />
                  <span>{lead.leadName}</span>
                </div>
              )}
              {lead.activeItems && (
                <div className="text-xs text-gray-400 mt-1">
                  {lead.activeItems} active items
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Escalations */}
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Active Escalations</h4>
        <div className="space-y-2">
          {data.escalations.map((escalation) => (
            <div key={escalation.id} className="bg-white/5 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-white">{escalation.issue}</h5>
                  <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                    <span>{escalation.openedAt}</span>
                    {escalation.assignedTo && (
                      <span>Assigned: {escalation.assignedTo}</span>
                    )}
                  </div>
                  {escalation.affectedZones && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {escalation.affectedZones.map((zone) => (
                        <span key={zone} className="text-xs bg-blue-500/20 text-blue-400 px-1 rounded">
                          {zone}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Badge className={getSeverityColor(escalation.severity)}>
                  {escalation.severity}
                </Badge>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-teal-500 text-teal-400 hover:bg-teal-500/10"
                onClick={() => handleAcknowledge(escalation.id)}
              >
                Acknowledge
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoordinationPanel;
