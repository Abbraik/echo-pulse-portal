
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { GlassMasonryCard } from './GlassMasonryCard';

const mockApprovals = [
  { id: '1', title: 'Infrastructure Development Package', priority: 'high', status: 'pending', deadline: '2 hours' },
  { id: '2', title: 'Budget Allocation Q2', priority: 'medium', status: 'review', deadline: '1 day' },
  { id: '3', title: 'THINK Zone Restructure', priority: 'high', status: 'pending', deadline: '4 hours' },
  { id: '4', title: 'Policy Amendment 2024-A', priority: 'low', status: 'approved', deadline: 'completed' }
];

export const LargeApprovalCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="approval-large" variant="large" type="approvals" {...props}>
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-electric-blue-500 mb-6" style={{ fontFamily: 'Noto Sans' }}>
        Pending Approvals
      </h3>
      
      <div className="flex-1 space-y-4 overflow-hidden">
        {mockApprovals.slice(0, 4).map((approval) => (
          <motion.div
            key={approval.id}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white text-sm truncate" style={{ fontFamily: 'Noto Sans' }}>
                {approval.title}
              </h4>
              <Badge 
                className={`text-xs ${
                  approval.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  approval.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}
              >
                {approval.priority}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center">
                <Clock size={12} className="mr-1" />
                {approval.deadline}
              </span>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-400/10 h-6 px-2 text-xs">
                  Approve
                </Button>
                <Button size="sm" variant="ghost" className="text-orange-400 hover:bg-orange-400/10 h-6 px-2 text-xs">
                  Revise
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </GlassMasonryCard>
);

export const MediumApprovalCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="approval-medium" variant="medium" type="approvals" {...props}>
    <div className="h-full">
      <h4 className="text-sm font-semibold text-blue-400 mb-4" style={{ fontFamily: 'Noto Sans' }}>
        Filters & Queue
      </h4>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className="bg-blue-500/20 text-blue-400 text-xs">High Priority</Badge>
        <Badge className="bg-white/10 text-gray-400 text-xs">This Week</Badge>
      </div>
      
      <div className="space-y-3">
        {mockApprovals.slice(4, 6).map((approval) => (
          <div key={approval.id} className="p-3 bg-white/5 rounded-lg">
            <h5 className="text-xs font-medium text-white truncate mb-1">{approval.title}</h5>
            <span className="text-xs text-gray-400">{approval.deadline}</span>
          </div>
        ))}
      </div>
    </div>
  </GlassMasonryCard>
);

export const SmallApprovalCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="approval-small" variant="small" type="approvals" {...props}>
    <div className="h-full flex flex-col">
      <h4 className="text-sm font-semibold text-blue-400 mb-4" style={{ fontFamily: 'Noto Sans' }}>
        Pinned Items
      </h4>
      
      <div className="flex-1 space-y-2">
        <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle size={12} className="text-yellow-400 mr-2" />
            <span className="text-xs text-yellow-400">Budget Override</span>
          </div>
        </div>
        
        <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center">
            <CheckCircle size={12} className="text-green-400 mr-2" />
            <span className="text-xs text-green-400">Policy Approved</span>
          </div>
        </div>
      </div>
    </div>
  </GlassMasonryCard>
);
