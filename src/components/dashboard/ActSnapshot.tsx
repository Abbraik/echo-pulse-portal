
import React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Clock, Users, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActSnapshotProps {
  data?: any;
}

const ActSnapshot: React.FC<ActSnapshotProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();

  const mockData = {
    pendingApprovals: [
      {
        id: 1,
        title: 'Migration Enhancement Bundle',
        owner: 'Policy Team A',
        dueDate: '2024-01-15',
        riskRating: 'medium'
      },
      {
        id: 2,
        title: 'Resource Optimization Strategy',
        owner: 'Economic Team',
        dueDate: '2024-01-12',
        riskRating: 'low'
      }
    ],
    performance: {
      successRate: 82,
      timeToDeployAvg: 45,
      underperformers: 2
    },
    escalations: [
      'Missed milestone: Social Cohesion Initiative',
      'ROI shortfall: Green Tech Investment'
    ]
  };

  const displayData = data || mockData;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-teal-500/20 text-teal-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <GlassCard className="h-full p-6" variant="deep">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
          <Play size={20} />
        </div>
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          ACT SNAPSHOT
        </h2>
      </div>

      <div className="space-y-6">
        {/* Pending Strategy Approvals */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-white">Pending Approvals</h3>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
              {displayData.pendingApprovals.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {displayData.pendingApprovals.map((bundle: any, index: number) => (
              <motion.div
                key={bundle.id}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{bundle.title}</h4>
                    <p className="text-xs text-gray-400">{bundle.owner}</p>
                  </div>
                  <Badge variant="secondary" className={getRiskColor(bundle.riskRating)}>
                    {bundle.riskRating}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Due: {bundle.dueDate}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs px-2 py-1">
                      Approve ▶
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-400 text-xs px-2 py-1">
                      Revise ▶
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Performance Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-400">
                {displayData.performance.successRate}%
              </div>
              <div className="text-xs text-gray-400">Bundle Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {displayData.performance.timeToDeployAvg}d
              </div>
              <div className="text-xs text-gray-400">Avg Time-to-Deploy</div>
            </div>
          </div>
          {displayData.performance.underperformers > 0 && (
            <div className="mt-3 p-2 rounded bg-red-500/10 border border-red-500/30">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-sm text-red-400">
                  {displayData.performance.underperformers} underperforming bundles
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Escalation Triggers */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Escalations</h3>
          <div className="space-y-2">
            {displayData.escalations.map((escalation: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <XCircle size={12} className="text-orange-400 flex-shrink-0" />
                <span className="text-gray-300">{escalation}</span>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-3 border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
          >
            <Users size={14} className="mr-2" />
            Open Teams Workspace
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ActSnapshot;
