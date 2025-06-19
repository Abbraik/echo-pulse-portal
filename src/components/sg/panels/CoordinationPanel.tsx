
import React from 'react';
import { CoordinationHub } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface CoordinationPanelProps {
  data: CoordinationHub;
}

const CoordinationPanel: React.FC<CoordinationPanelProps> = ({ data }) => {
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

  return (
    <div className="space-y-6">
      {/* Zone Leads */}
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Zone Status</h4>
        <div className="grid grid-cols-2 gap-2">
          {data.zoneLeads.map((lead) => (
            <div key={lead.zone} className="bg-white/5 rounded-lg p-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(lead.status)}
                <span className="text-xs text-white">{lead.zone}</span>
              </div>
              <Badge className={getStatusColor(lead.status)} size="sm">
                {lead.status}
              </Badge>
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
                <div>
                  <h5 className="text-sm font-medium text-white">{escalation.issue}</h5>
                  <span className="text-xs text-gray-400">{escalation.openedAt}</span>
                </div>
                <Badge className={getSeverityColor(escalation.severity)}>
                  {escalation.severity}
                </Badge>
              </div>
              <Button size="sm" variant="outline" className="border-teal-500 text-teal-400 hover:bg-teal-500/10">
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
