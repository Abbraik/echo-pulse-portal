
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ThinkSnapshotProps {
  data?: any;
}

const ThinkSnapshot: React.FC<ThinkSnapshotProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();

  const mockData = {
    targetAlignment: 78,
    topLoops: [
      { name: 'Population & Development', coverage: 75, status: 'attention' },
      { name: 'Economic Migration', coverage: 89, status: 'good' },
      { name: 'Environmental Quality', coverage: 61, status: 'critical' }
    ],
    scenarios: [
      { name: 'Baseline', value: 78.5, color: 'gray' },
      { name: 'Enhanced Migration', value: 82.3, color: 'teal' },
      { name: 'Green Tech Focus', value: 79.1, color: 'blue' }
    ]
  };

  const displayData = data || mockData;

  return (
    <GlassCard className="h-full p-6" variant="deep">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
          <Brain size={20} />
        </div>
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          THINK SNAPSHOT
        </h2>
      </div>

      <div className="space-y-6">
        {/* Target Alignment Widget */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-white">Target Alignment</h3>
            <Badge variant="secondary" className="bg-teal-500/20 text-teal-400">
              Auto-Synced
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Scenario vs Simulation</span>
              <span className="text-white">{displayData.targetAlignment}%</span>
            </div>
            <Progress value={displayData.targetAlignment} className="h-2" />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-3 border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
          >
            <Target size={14} className="mr-2" />
            Adjust Targets
          </Button>
        </div>

        {/* Loop Consistency Highlights */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Loop Consistency Highlights</h3>
          <div className="space-y-3">
            {displayData.topLoops.map((loop: any, index: number) => (
              <motion.div
                key={loop.name}
                className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    loop.status === 'critical' ? 'bg-red-400' :
                    loop.status === 'attention' ? 'bg-orange-400' : 'bg-teal-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-white">{loop.name}</p>
                    <p className="text-xs text-gray-400">{loop.coverage}% coverage</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-teal-400 hover:bg-teal-500/10">
                  <ArrowRight size={12} />
                </Button>
              </motion.div>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-full mt-3 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
          >
            Explore Loop Impact ▶
          </Button>
        </div>

        {/* Scenario Comparator Mini-Chart */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Scenario Comparison</h3>
          <div className="space-y-3">
            {displayData.scenarios.map((scenario: any, index: number) => (
              <div key={scenario.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{scenario.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${
                        scenario.color === 'teal' ? 'from-teal-500 to-teal-400' :
                        scenario.color === 'blue' ? 'from-blue-500 to-blue-400' :
                        'from-gray-500 to-gray-400'
                      }`}
                      style={{ width: `${scenario.value}%` }}
                    />
                  </div>
                  <span className="text-sm text-white">{scenario.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ThinkSnapshot;
