
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Search, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LearnSnapshotProps {
  data?: any;
}

const LearnSnapshot: React.FC<LearnSnapshotProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();

  const mockData = {
    topLessons: [
      { title: 'Migration Policy Optimization', successRate: 89, playbook: 'MP-2024-01' },
      { title: 'Resource Allocation Strategy', successRate: 76, playbook: 'RA-2024-03' },
      { title: 'Social Cohesion Enhancement', successRate: 82, playbook: 'SC-2024-02' }
    ],
    rootCauses: [
      'Marriage-rate loop underperforming due to social barriers',
      'Resource extraction exceeding sustainable thresholds'
    ],
    knowledgeGaps: [
      'Youth employment correlation with migration patterns',
      'Environmental impact on fertility rates'
    ]
  };

  const displayData = data || mockData;

  return (
    <GlassCard className="h-full p-6" variant="deep">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
          <BookOpen size={20} />
        </div>
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
          LEARN
        </h2>
      </div>

      <div className="space-y-4">
        {/* Top Lessons */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Top Lessons</h3>
          <div className="space-y-2">
            {displayData.topLessons.slice(0, 2).map((lesson: any, index: number) => (
              <motion.div
                key={index}
                className="p-2 rounded bg-white/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">{lesson.title}</p>
                    <p className="text-xs text-gray-400">{lesson.playbook}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                    {lesson.successRate}%
                  </Badge>
                </div>
                <Button size="sm" variant="ghost" className="text-orange-400 text-xs mt-1 p-0">
                  View Insight ▶
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Root Cause Summaries */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Root Causes</h3>
          <div className="space-y-2">
            {displayData.rootCauses.map((cause: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <Lightbulb size={12} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-300">{cause}</p>
                  <Button size="sm" variant="ghost" className="text-yellow-400 text-xs p-0 mt-1">
                    View Trace ▶
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Gaps */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Knowledge Gaps</h3>
          <div className="space-y-2">
            {displayData.knowledgeGaps.map((gap: string, index: number) => (
              <div key={index} className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <Search size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-300">{gap}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-blue-400 text-xs">
                  Commission ▶
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default LearnSnapshot;
