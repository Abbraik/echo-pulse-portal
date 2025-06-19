
import React from 'react';
import { Approval } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, FileText } from 'lucide-react';

interface ApprovalsPanelProps {
  data: Approval[];
}

const ApprovalsPanel: React.FC<ApprovalsPanelProps> = ({ data }) => {
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

  return (
    <div className="space-y-4">
      {data.map((approval) => (
        <div key={approval.id} className="bg-white/5 rounded-lg p-3 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-teal-400">
                {getTypeIcon(approval.type)}
              </div>
              <div>
                <h5 className="text-sm font-medium text-white">{approval.title}</h5>
                <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                  <User size={12} />
                  <span>{approval.createdBy}</span>
                  <Clock size={12} />
                  <span>Due {approval.dueIn}</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(approval.status)}>
              {approval.status}
            </Badge>
          </div>
          
          {approval.status === 'pending' && (
            <div className="flex space-x-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Approve
              </Button>
              <Button size="sm" variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/10">
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
