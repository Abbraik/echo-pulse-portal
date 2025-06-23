
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface StrategyControlsProps {
  selectedObjectives: number[];
  activeApproach: string;
  onObjectiveToggle: (id: number) => void;
  onApproachChange: (approach: string) => void;
  className?: string;
}

const StrategyControls: React.FC<StrategyControlsProps> = ({
  selectedObjectives,
  activeApproach,
  onObjectiveToggle,
  onApproachChange,
  className
}) => {
  const { t } = useTranslation();

  const objectives = [
    { 
      id: 1, 
      name: t('environmentalSustainability', { defaultValue: 'Environmental Sustainability' }), 
      icon: <Target size={16} /> 
    },
    { 
      id: 2, 
      name: t('economicDevelopment', { defaultValue: 'Economic Development' }), 
      icon: <Zap size={16} /> 
    },
    { 
      id: 3, 
      name: t('socialCohesion', { defaultValue: 'Social Cohesion' }), 
      icon: <Users size={16} /> 
    },
  ];

  const approaches = [
    { id: 'balanced', name: t('balanced', { defaultValue: 'Balanced' }) },
    { id: 'aggressive', name: t('aggressive', { defaultValue: 'Aggressive' }) },
    { id: 'conservative', name: t('conservative', { defaultValue: 'Conservative' }) },
  ];

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Strategic Objectives */}
        <div>
          <h3 className="text-lg font-medium mb-3">
            {t('strategicObjectives', { defaultValue: 'Strategic Objectives' })}
          </h3>
          <div className="flex flex-wrap gap-2">
            {objectives.map((objective) => (
              <motion.div key={objective.id} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedObjectives.includes(objective.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onObjectiveToggle(objective.id)}
                  className="gap-2"
                >
                  {objective.icon}
                  {objective.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Strategy Approach */}
        <div>
          <h3 className="text-lg font-medium mb-3">
            {t('strategyApproach', { defaultValue: 'Strategy Approach' })}
          </h3>
          <div className="flex gap-2">
            {approaches.map((approach) => (
              <Badge
                key={approach.id}
                variant={activeApproach === approach.id ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => onApproachChange(approach.id)}
              >
                {approach.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyControls;
