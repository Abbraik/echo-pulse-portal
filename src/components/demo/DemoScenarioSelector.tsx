
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Users } from 'lucide-react';
import { useDemo } from '@/hooks/use-demo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';

export const DemoScenarioSelector: React.FC = () => {
  const { scenarios, startScenario } = useDemo();
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-demo="scenario-selector">
      {scenarios.map((scenario, index) => (
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="p-6 h-full flex flex-col hover:scale-[1.02] transition-transform cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                  {scenario.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {scenario.description}
                </p>
              </div>
              <div className="ml-4 p-2 rounded-xl bg-teal-500/20 text-teal-400 group-hover:bg-teal-500/30 transition-colors">
                <Play className="h-5 w-5" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{scenario.steps.length} steps</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Interactive</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {scenario.steps.slice(0, 3).map((step) => (
                <Badge 
                  key={step.id} 
                  variant="outline" 
                  className="text-xs text-gray-400 border-gray-600"
                >
                  {step.zone.toUpperCase()}
                </Badge>
              ))}
              {scenario.steps.length > 3 && (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  +{scenario.steps.length - 3} more
                </Badge>
              )}
            </div>
            
            <div className="mt-auto">
              <Button
                onClick={() => startScenario(scenario.id)}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                {t('startDemo')}
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};
