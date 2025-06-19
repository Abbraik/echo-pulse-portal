
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PanelHeader from '../shared/PanelHeader';

interface AdditionalInsightsPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isHovered: boolean;
}

const insights = [
  {
    id: '1',
    title: 'Cross-Zone Efficiency',
    value: '+15%',
    trend: 'up',
    description: 'Improved coordination between THINK and ACT zones'
  },
  {
    id: '2',
    title: 'Global Impact Score',
    value: '8.7/10',
    trend: 'stable',
    description: 'Sustainable development goals progress'
  },
  {
    id: '3',
    title: 'Innovation Pipeline',
    value: '23 Projects',
    trend: 'up',
    description: 'Active innovation initiatives across all zones'
  }
];

const AdditionalInsightsPanel: React.FC<AdditionalInsightsPanelProps> = ({
  isFullscreen,
  onToggleFullscreen,
  isHovered
}) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Strategic Insights"
        subtitle="Key Metrics Overview"
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div className="flex-1 p-4 space-y-3">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-200"
            whileHover={{ scale: 1.02, boxShadow: '0 0 8px rgba(20,184,166,0.3)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">{insight.title}</h4>
              <Badge className={`text-xs ${getTrendColor(insight.trend)} bg-transparent border-current`}>
                {insight.value} {getTrendIcon(insight.trend)}
              </Badge>
            </div>
            <p className="text-xs text-gray-400">{insight.description}</p>
          </motion.div>
        ))}

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/5 rounded p-2">
              <BarChart3 size={16} className="mx-auto text-teal-400 mb-1" />
              <div className="text-xs font-medium text-white">Analytics</div>
            </div>
            <div className="bg-white/5 rounded p-2">
              <Globe size={16} className="mx-auto text-blue-400 mb-1" />
              <div className="text-xs font-medium text-white">Global</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInsightsPanel;
