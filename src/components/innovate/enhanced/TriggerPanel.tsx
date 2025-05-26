
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, AlertTriangle, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface TriggerPanelProps {
  activeTrigger: 'learn' | 'monitor' | 'freeform' | null;
  onTriggerSelect: (trigger: 'learn' | 'monitor' | 'freeform') => void;
  learnPatterns: number;
  monitorAlerts: number;
}

export const TriggerPanel: React.FC<TriggerPanelProps> = ({
  activeTrigger,
  onTriggerSelect,
  learnPatterns,
  monitorAlerts
}) => {
  const { t } = useTranslation();

  const triggers = [
    {
      id: 'learn' as const,
      label: t('fromLearn'),
      icon: <BookOpen size={16} />,
      count: learnPatterns,
      pulse: learnPatterns > 0
    },
    {
      id: 'monitor' as const,
      label: t('fromMonitor'),
      icon: <AlertTriangle size={16} />,
      count: monitorAlerts,
      pulse: monitorAlerts > 0
    },
    {
      id: 'freeform' as const,
      label: t('freeform'),
      icon: <Zap size={16} />,
      count: 0,
      pulse: false
    }
  ];

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">{t('triggerSources')}</h3>
        <div className="flex gap-2">
          {triggers.map((trigger) => (
            <motion.div key={trigger.id} className="relative">
              <Button
                size="sm"
                variant={activeTrigger === trigger.id ? "default" : "outline"}
                onClick={() => onTriggerSelect(trigger.id)}
                className={`flex items-center gap-2 ${
                  activeTrigger === trigger.id 
                    ? 'bg-teal-500 hover:bg-teal-600' 
                    : 'glass-panel-deep hover:bg-white/10'
                } ${trigger.pulse ? 'animate-pulse' : ''}`}
              >
                {trigger.icon}
                <span className="hidden sm:inline">{trigger.label}</span>
                {trigger.count > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {trigger.count}
                  </Badge>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
