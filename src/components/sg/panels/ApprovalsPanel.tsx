
import React from 'react';
import { Approval } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, FileText, Paperclip, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

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
        return <FileText size={14} className="text-teal-400" />;
      case 'policy':
        return <FileText size={14} className="text-blue-400" />;
      case 'directive':
        return <AlertCircle size={14} className="text-orange-400" />;
      case 'mandate':
        return <FileText size={14} className="text-purple-400" />;
      default:
        return <FileText size={14} className="text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={12} className="text-amber-400" />;
      case 'approved':
        return <CheckCircle2 size={12} className="text-green-400" />;
      case 'revised':
        return <RotateCcw size={12} className="text-blue-400" />;
      default:
        return <Clock size={12} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'revised':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDueInColor = (dueIn: string) => {
    if (dueIn.includes('day') && parseInt(dueIn) <= 2) {
      return 'text-red-400';
    } else if (dueIn.includes('day') && parseInt(dueIn) <= 5) {
      return 'text-orange-400';
    }
    return 'text-gray-400';
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
        <div key={approval.id} className="glass-panel-cinematic p-4 space-y-3 hover:neon-border transition-all duration-300 group">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                {getTypeIcon(approval.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="text-sm font-medium text-white font-noto-medium group-hover:text-teal-200 transition-colors">
                      {approval.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      {approval.priority && (
                        <Badge className={`${getPriorityColor(approval.priority)} text-xs font-mono border`}>
                          {approval.priority.toUpperCase()}
                        </Badge>
                      )}
                      <Badge className={`${getStatusColor(approval.status)} text-xs font-mono border flex items-center gap-1`}>
                        {getStatusIcon(approval.status)}
                        {approval.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span className="font-noto">{approval.createdBy}</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${getDueInColor(approval.dueIn)}`}>
                    <Clock size={12} />
                    <span className="font-mono font-medium">Due {approval.dueIn}</span>
                  </div>
                  {approval.attachments && (
                    <div className="flex items-center space-x-1">
                      <Paperclip size={12} />
                      <span className="font-mono">{approval.attachments} files</span>
                    </div>
                  )}
                </div>
                
                {approval.description && (
                  <p className="text-xs text-gray-400 font-noto line-clamp-2">{approval.description}</p>
                )}
              </div>
            </div>
          </div>
          
          {approval.status === 'pending' && (
            <div className="flex space-x-2 pt-2 border-t border-white/10">
              <Button 
                size="sm" 
                className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 hover:border-green-400/50 backdrop-blur-sm transition-all duration-200"
                onClick={() => handleApprove(approval.id)}
              >
                <CheckCircle2 size={14} className="mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400/50 backdrop-blur-sm transition-all duration-200"
                onClick={() => handleRevise(approval.id)}
              >
                <RotateCcw size={14} className="mr-1" />
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
