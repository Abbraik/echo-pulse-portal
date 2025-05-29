
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertTriangle, User, Calendar, FileText, Filter, Pin, Search, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface ApprovalsDecisionsPanelProps {
  data?: {
    pending: number;
    overdue: number;
    decisions: Array<{
      id: string;
      title: string;
      type: 'approval' | 'decision' | 'review';
      priority: 'high' | 'medium' | 'low';
      requestor: string;
      dueDate: string;
      description: string;
      status: 'pending' | 'approved' | 'rejected' | 'under_review';
    }>;
  };
  onFocusMode?: () => void;
  onContextualAction?: (action: string, itemTitle: string) => void;
  onFullscreen?: () => void;
}

export const ApprovalsDecisionsPanel: React.FC<ApprovalsDecisionsPanelProps> = ({ 
  data, 
  onFocusMode, 
  onContextualAction,
  onFullscreen 
}) => {
  // Mock data if not provided
  const mockData = {
    pending: 12,
    overdue: 3,
    decisions: [
      { id: '1', title: 'Infrastructure Development Package', type: 'approval' as const, priority: 'high' as const, requestor: 'Ministry of Development', dueDate: '2024-12-01', description: 'Comprehensive infrastructure expansion plan requiring strategic approval', status: 'pending' as const },
      { id: '2', title: 'Budget Reallocation Request', type: 'decision' as const, priority: 'medium' as const, requestor: 'Finance Committee', dueDate: '2024-11-28', description: 'Request to reallocate Q4 budget across departments', status: 'under_review' as const },
      { id: '3', title: 'THINK Zone Restructure', type: 'review' as const, priority: 'high' as const, requestor: 'Zone Operations', dueDate: '2024-11-25', description: 'Proposed changes to THINK zone operational structure', status: 'pending' as const },
      { id: '4', title: 'Policy Framework Update', type: 'approval' as const, priority: 'low' as const, requestor: 'Policy Team', dueDate: '2024-12-05', description: 'Updates to existing policy framework documentation', status: 'approved' as const }
    ]
  };

  const displayData = data || mockData;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'under_review': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle size={14} />;
      case 'decision': return <AlertTriangle size={14} />;
      case 'review': return <FileText size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className="h-full p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-400">Approvals & Decisions</h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onFullscreen}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-white/10 hover:bg-white/20"
            >
              <Maximize2 size={14} />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{displayData.pending}</div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{displayData.overdue}</div>
            <div className="text-xs text-gray-400">Overdue</div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost" className="text-xs h-6">
            <Filter size={12} className="mr-1" />
            All
          </Button>
          <Button size="sm" variant="ghost" className="text-xs h-6">
            High
          </Button>
          <Button size="sm" variant="ghost" className="text-xs h-6">
            Overdue
          </Button>
        </div>

        {/* Decisions List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {displayData.decisions.map((decision) => (
            <div key={decision.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(decision.type)}
                  <Badge className={getPriorityColor(decision.priority)}>
                    {decision.priority}
                  </Badge>
                </div>
                <span className={`text-xs ${getStatusColor(decision.status)}`}>
                  {decision.status}
                </span>
              </div>
              
              <h4 className="font-medium text-white mb-1">{decision.title}</h4>
              <p className="text-sm text-gray-400 mb-2">{decision.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <User size={12} />
                  <span>{decision.requestor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={12} />
                  <span>{decision.dueDate}</span>
                </div>
              </div>
              
              {decision.status === 'pending' && (
                <div className="flex space-x-2 mt-2">
                  <Button 
                    size="sm" 
                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 text-xs h-6"
                    onClick={() => onContextualAction?.('approve', decision.title)}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-red-400 hover:bg-red-500/20 text-xs h-6"
                    onClick={() => onContextualAction?.('reject', decision.title)}
                  >
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-gray-400 hover:bg-white/10 text-xs h-6"
                  >
                    Details
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-white/10">
          <Button 
            size="sm" 
            className="w-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            onClick={onFocusMode}
          >
            View All Approvals
          </Button>
        </div>
      </div>
    </div>
  );
};
