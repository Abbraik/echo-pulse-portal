
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Target, TrendingUp, Users, Settings, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface LeveragePointSidebarProps {
  onClose: () => void;
  viewMode: 'cld' | 'sna';
}

export const LeveragePointSidebar: React.FC<LeveragePointSidebarProps> = ({
  onClose,
  viewMode
}) => {
  const { t } = useTranslation();

  const leveragePoints = [
    {
      id: 1,
      name: 'Constants, numbers, subsidies',
      level: 'Least Effective',
      icon: <Settings size={16} />,
      color: 'text-gray-400',
      detected: true
    },
    {
      id: 2,
      name: 'Material stocks and flows',
      level: 'Low',
      icon: <TrendingUp size={16} />,
      color: 'text-blue-400',
      detected: false
    },
    {
      id: 3,
      name: 'Regulating negative feedback loops',
      level: 'Medium',
      icon: <Target size={16} />,
      color: 'text-yellow-400',
      detected: true
    },
    {
      id: 4,
      name: 'Self-organizing',
      level: 'High',
      icon: <Users size={16} />,
      color: 'text-green-400',
      detected: false
    },
    {
      id: 5,
      name: 'Goals, purpose, paradigms',
      level: 'Highest',
      icon: <Zap size={16} />,
      color: 'text-purple-400',
      detected: true
    }
  ];

  return (
    <motion.div
      className="absolute right-0 top-0 h-full w-80 glass-panel-deep border-l border-white/10 z-30"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="font-semibold">{t('leveragePoints')}</h3>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4 space-y-3">
          {leveragePoints.map((point) => (
            <motion.div
              key={point.id}
              className={`p-3 rounded-lg border ${
                point.detected 
                  ? 'bg-white/5 border-teal-500/30' 
                  : 'bg-white/[0.02] border-white/10'
              } cursor-pointer hover:bg-white/10 transition-colors`}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              whileDrag={{ scale: 1.05, zIndex: 1000 }}
            >
              <div className="flex items-start gap-3">
                <div className={point.color}>
                  {point.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{point.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {point.level}
                  </div>
                  {point.detected && (
                    <div className="text-xs text-teal-400 mt-1">
                      ✓ {t('detectedInSystem')}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};
