
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

interface ParameterControlsProps {
  engine: string;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({ engine }) => {
  const { t } = useTranslation();
  
  // Sample parameters based on the engine type
  const getParameters = () => {
    switch (engine) {
      case 'systemDynamics':
        return [
          { id: 'p1', name: 'Resource Rights', value: 50, min: 0, max: 100, baseline: 30, unit: '%' },
          { id: 'p2', name: 'Commons Access', value: 70, min: 0, max: 100, baseline: 40, unit: '%' },
          { id: 'p3', name: 'Governance Model', value: 3, min: 1, max: 5, baseline: 2, unit: 'level' },
        ];
      case 'agentBased':
        return [
          { id: 'a1', name: 'Agent Count', value: 100, min: 10, max: 1000, baseline: 100, unit: '' },
          { id: 'a2', name: 'Cooperation Weight', value: 0.7, min: 0, max: 1, baseline: 0.5, unit: '' },
          { id: 'a3', name: 'Learning Rate', value: 0.05, min: 0.01, max: 0.2, baseline: 0.05, unit: '' },
        ];
      case 'econometric':
        return [
          { id: 'e1', name: 'Growth Rate', value: 2.5, min: -5, max: 10, baseline: 3, unit: '%' },
          { id: 'e2', name: 'Inequality Index', value: 0.4, min: 0.1, max: 0.9, baseline: 0.5, unit: 'Gini' },
          { id: 'e3', name: 'Public Investment', value: 20, min: 5, max: 50, baseline: 15, unit: '%' },
        ];
      default:
        return [];
    }
  };
  
  const parameters = getParameters();
  
  return (
    <div className="space-y-6">
      <div className="bg-purple-900/20 border border-purple-500/20 p-3 rounded-lg">
        <h3 className="text-sm font-medium mb-2">{t('forkSummary')}</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/40">
            Resource Rights Reform
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-gray-300 border-white/20">
            +20% Commons Access
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-gray-300 border-white/20">
            Level 3 Governance
          </Badge>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">{t('modelParameters')}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              {t('setBaseline')}
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              {t('compare')}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {parameters.map((param) => {
            const delta = param.value - param.baseline;
            const deltaPercent = (delta / param.baseline) * 100;
            
            return (
              <div key={param.id} className="bg-white/5 border border-white/10 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{param.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm">
                      {param.value}{param.unit}
                    </span>
                    {delta !== 0 && (
                      <span className={`text-xs ml-2 ${delta > 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                        {delta > 0 ? '+' : ''}{deltaPercent.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <input 
                  type="range" 
                  className="w-full" 
                  min={param.min} 
                  max={param.max} 
                  defaultValue={param.value} 
                  step={(param.max - param.min) / 100}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{param.min}{param.unit}</span>
                  <span>{param.max}{param.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
