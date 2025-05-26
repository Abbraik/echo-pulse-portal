
import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface KeyInsightCardProps {
  insights: Array<{
    type: 'opportunity' | 'risk' | 'pattern';
    title: string;
    description: string;
    confidence: number;
  }>;
}

export const KeyInsightCard: React.FC<KeyInsightCardProps> = ({ insights }) => {
  const { t } = useTranslation();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp size={16} className="text-green-400" />;
      case 'risk': return <AlertTriangle size={16} className="text-amber-400" />;
      case 'pattern': return <Lightbulb size={16} className="text-blue-400" />;
      default: return <Lightbulb size={16} />;
    }
  };

  const topInsights = insights.slice(0, 2);

  return (
    <motion.div
      className="glass-panel p-4 mb-4 border-l-4 border-teal-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-teal-400" />
        <h3 className="font-semibold">{t('keyInsights')}</h3>
      </div>

      <div className="space-y-3">
        {topInsights.map((insight, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {getInsightIcon(insight.type)}
            <div className="flex-1">
              <div className="font-medium text-sm">{insight.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {insight.description}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-teal-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.confidence}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {insight.confidence}% {t('confidence')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
