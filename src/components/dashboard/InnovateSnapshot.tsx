import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Beaker, Rocket, Archive, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InnovateSnapshotProps {
  data?: any;
}

const InnovateSnapshot: React.FC<InnovateSnapshotProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();

  const mockData = {
    prototypes: [
      { name: 'AI-Driven Migration Forecasting', phase: 'Testing', impact: '+5.2% DEI' },
      { name: 'Dynamic Resource Allocation', phase: 'Development', impact: '+3.8% Efficiency' }
    ],
    decisionPoints: [
      { name: 'Blockchain Governance Model', type: 'promote', readiness: 'ready' },
      { name: 'Quantum Social Modeling', type: 'archive', readiness: 'incomplete' }
    ],
    resourceRequests: [
      'Additional data scientists for ML models',
      'Extended cloud computing resources'
    ]
  };

  const displayData = data || mockData;

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'testing': return 'bg-blue-500/20 text-blue-400';
      case 'development': return 'bg-orange-500/20 text-orange-400';
      case 'ready': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <GlassCard className="h-full p-6" variant="deep">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
          <Zap size={20} />
        </div>
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
          INNOVATE
        </h2>
      </div>

      <div className="space-y-4">
        {/* Prototype Status */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Active Prototypes</h3>
          <div className="space-y-2">
            {displayData.prototypes.map((prototype: any, index: number) => (
              <motion.div
                key={index}
                className="p-2 rounded bg-white/5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-medium text-white">{prototype.name}</p>
                  <Badge variant="secondary" className={getPhaseColor(prototype.phase)}>
                    {prototype.phase}
                  </Badge>
                </div>
                <p className="text-xs text-teal-400">{prototype.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decision Points */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Decision Points</h3>
          <div className="space-y-2">
            {displayData.decisionPoints.map((decision: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-white/5">
                <div className="flex items-center space-x-2">
                  <Beaker size={12} className="text-green-400" />
                  <span className="text-xs text-white">{decision.name}</span>
                </div>
                <div className="flex space-x-1">
                  {decision.type === 'promote' ? (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1">
                      <Rocket size={10} className="mr-1" />
                      Promote ▶
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="border-gray-500/50 text-gray-400 text-xs px-2 py-1">
                      <Archive size={10} className="mr-1" />
                      Archive ▶
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Requests */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Resource Requests</h3>
          <div className="space-y-2">
            {displayData.resourceRequests.map((request: string, index: number) => (
              <div key={index} className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <Users size={12} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-300">{request}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-purple-400 text-xs">
                  Allocate ▶
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default InnovateSnapshot;
