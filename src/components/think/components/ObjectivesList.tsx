
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Target, Check, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

export interface Objective {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  pillar: 'population' | 'resources' | 'goods' | 'social';
  impact: number;  // 1-10 scale
  recommended?: boolean;
}

interface ObjectivesListProps {
  objectives: Objective[];
  onToggleSelect?: (objectiveId: number) => void;
  selectedObjectives?: number[];
}

const ObjectivesList: React.FC<ObjectivesListProps> = ({
  objectives,
  onToggleSelect,
  selectedObjectives = []
}) => {
  const { t } = useTranslation();
  
  if (objectives.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('noObjectivesYet')}
      </div>
    );
  }
  
  const getPillarColor = (pillar: string) => {
    switch(pillar) {
      case 'population': return 'from-blue-500 to-blue-700';
      case 'resources': return 'from-teal-500 to-teal-700';
      case 'goods': return 'from-emerald-500 to-emerald-700';
      case 'social': return 'from-cyan-500 to-cyan-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };
  
  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <ArrowUp className="text-amber-400" size={16} />;
      case 'medium': return <ArrowRight className="text-blue-400" size={16} />;
      case 'low': return <ArrowDown className="text-green-400" size={16} />;
      default: return <ArrowRight className="text-gray-400" size={16} />;
    }
  };
  
  return (
    <div className="space-y-3">
      {objectives.map((objective) => {
        const isSelected = selectedObjectives.includes(objective.id);
        
        return (
          <motion.div
            key={objective.id}
            className={`p-3 rounded-lg border ${
              isSelected 
                ? 'border-teal-500 bg-navy-800/80' 
                : 'border-white/10 bg-navy-900/40 hover:bg-navy-800/60'
            } transition-colors cursor-pointer`}
            onClick={() => onToggleSelect && onToggleSelect(objective.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3 items-start flex-1">
                <div className={`mt-1 flex-shrink-0 p-1.5 rounded-md bg-gradient-to-br ${getPillarColor(objective.pillar)}`}>
                  {isSelected ? (
                    <Check size={14} />
                  ) : (
                    <Target size={14} />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{objective.title}</h4>
                    {objective.recommended && (
                      <span className="inline-flex items-center text-xs px-1.5 py-0.5 bg-teal-500/20 text-teal-400 rounded">
                        <Check size={10} className="mr-0.5" />
                        {t('recommended')}
                      </span>
                    )}
                    {isSelected && (
                      <span className="inline-flex items-center text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                        {t('selected')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{objective.description}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end ml-4">
                <div className="flex items-center gap-1">
                  {getPriorityIcon(objective.priority)}
                  <span className="text-xs capitalize">{t(objective.priority as any)}</span>
                </div>
                
                <div className="mt-2 flex items-center">
                  <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${
                        isSelected 
                          ? 'from-teal-500 to-blue-500 animate-pulse' 
                          : 'from-blue-500/60 to-teal-500/60'
                      }`}
                      style={{ width: `${objective.impact * 10}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs">{objective.impact}/10</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ObjectivesList;
