
import React from 'react';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus, Trash2, Pen, Merge, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

interface ScenarioForkProps {
  onForkSelect?: (fork: ScenarioForkData) => void;
  selectedForkId?: string;
}

export const ScenarioFork: React.FC<ScenarioForkProps> = ({ 
  onForkSelect,
  selectedForkId 
}) => {
  const { t } = useTranslation();
  
  // Sample data for scenario forks
  const forks = [
    { id: 'fork1', name: 'Base Scenario', active: true },
    { id: 'fork2', name: 'Resource Rights Reform', active: false },
    { id: 'fork3', name: 'Commons Governance', active: false },
    { id: 'fork4', name: 'Circular Economy', active: false },
  ];

  const handleForkClick = (fork: ScenarioForkData) => {
    onForkSelect?.(fork);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{t('scenarioVariants')}</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus size={16} />
        </Button>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {forks.map((fork) => {
          const isSelected = selectedForkId === fork.id;
          return (
            <div 
              key={fork.id}
              className={`p-3 rounded-lg flex items-start justify-between cursor-pointer hover:bg-white/5 transition-colors ${
                isSelected ? 'bg-purple-900/30 border border-purple-400/50' : 
                fork.active ? 'bg-purple-900/20 border border-purple-500/30' : 
                'bg-white/5 border border-white/10'
              }`}
              onClick={() => handleForkClick(fork)}
            >
              <div className="flex items-center">
                <GitBranch size={16} className={
                  isSelected ? 'text-purple-300' :
                  fork.active ? 'text-purple-400' : 'text-gray-400'
                } />
                <span className="ml-2 text-sm">{fork.name}</span>
                {isSelected && (
                  <span className="ml-2 text-xs bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded">
                    Selected
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Pen size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400">
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
        <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
          <Merge size={14} />
          {t('mergeForks')}
        </Button>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
          <ArrowRight size={14} />
          {t('loadSelected')}
        </Button>
      </div>
    </div>
  );
};
