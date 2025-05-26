
import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';

interface DelayVisualizerProps {
  flowId: string;
}

export const DelayVisualizer: React.FC<DelayVisualizerProps> = ({ flowId }) => {
  const { t } = useTranslation();

  // Mock delay data - would be dynamic based on flowId
  const delayPhases = [
    { name: t('planning'), duration: 2, color: '#ef4444' },
    { name: t('approval'), duration: 4, color: '#f97316' },
    { name: t('implementation'), duration: 6, color: '#eab308' },
    { name: t('impact'), duration: 3, color: '#22c55e' }
  ];

  const totalDuration = delayPhases.reduce((sum, phase) => sum + phase.duration, 0);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glass-panel-deep p-4 rounded-lg min-w-64 z-40"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-sm font-medium mb-3">{t('implementationDelay')}</div>
      
      <div className="space-y-2">
        {delayPhases.map((phase, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-xs text-muted-foreground">
              {phase.name}
            </div>
            <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: phase.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(phase.duration / totalDuration) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            </div>
            <div className="w-8 text-xs text-right">
              {phase.duration}m
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-white/10 text-xs text-muted-foreground">
        {t('totalDelay')}: {totalDuration} {t('months')}
      </div>
    </motion.div>
  );
};
