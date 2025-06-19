
import React from 'react';
import { Approval } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, FileText, Paperclip } from 'lucide-react';

interface ApprovalsPanelProps {
  data: Approval[];
  actions?: {
    approveItem: (id: string) => Promise<void>;
    reviseItem: (id: string, notes: string) => Promise<void>;
  };
}

const ApprovalsPanel: React.FC<ApprovalsPanelProps> = ({ data, actions }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bundle':
        return <FileText size={14} />;
      case 'policy':
        return <FileText size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'revised':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleApprove = async (id: string) => {
    if (actions?.approveItem) {
      await actions.approveItem(id);
    }
  };

  const handleRevise = async (id: string) => {
    if (actions?.reviseItem) {
      const notes = prompt('Enter revision notes:');
      if (notes) {
        await actions.reviseItem(id, notes);
      }
    }
  };

  return (
    <div className="space-y-4">
      {data.map((approval) => (
        <div key={approval.id} className="bg-white/5 rounded-lg p-3 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <div className="text-teal-400 mt-0.5">
                {getTypeIcon(approval.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="text-sm font-medium text-white">{approval.title}</h5>
                  {approval.priority && (
                    <Badge className={getPriorityColor(approval.priority)}>
                      {approval.priority}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{approval.createdBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>Due {approval.dueIn}</span>
                  </div>
                  {approval.attachments && (
                    <div className="flex items-center space-x-1">
                      <Paperclip size={12} />
                      <span>{approval.attachments}</span>
                    </div>
                  )}
                </div>
                {approval.description && (
                  <p className="text-xs text-gray-400 mt-1">{approval.description}</p>
                )}
              </div>
            </div>
            <Badge className={getStatusColor(approval.status)}>
              {approval.status}
            </Badge>
          </div>
          
          {approval.status === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleApprove(approval.id)}
              >
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
                onClick={() => handleRevise(approval.id)}
              >
                Revise
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApprovalsPanel;
