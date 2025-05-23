
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Search, Archive, Rocket, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface ScenarioLibraryProps {
  vertical?: boolean;
}

export const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({ vertical = false }) => {
  const { t } = useTranslation();
  
  // Mock scenario data
  const scenarios = [
    { id: 1, name: 'Economic Growth Stabilizer', type: 'evolutionary', origin: 'Lesson', date: '2025-03-12' },
    { id: 2, name: 'Resource Commons Model', type: 'revolutionary', origin: 'Moonshot', date: '2025-04-01' },
    { id: 3, name: 'Education Reform Alpha', type: 'evolutionary', origin: 'Lesson', date: '2025-02-28' },
    { id: 4, name: 'Zero Waste Economy', type: 'revolutionary', origin: 'Moonshot', date: '2025-03-22' },
    { id: 5, name: 'Incentive Redesign', type: 'freeform', origin: 'Sandbox', date: '2025-05-01' },
  ];
  
  // For vertical layout, we use a different structure
  if (vertical) {
    return (
      <div className="h-full flex flex-col p-3">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input 
              placeholder={t('searchScenarios')} 
              className="pl-9 h-8"
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Archive size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('archiveSelected')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Rocket size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('promoteSelected')}</TooltipContent>
          </Tooltip>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-2">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id} 
                className={`glass-panel p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover-lift
                  ${scenario.type === 'revolutionary' ? 'border-l-4 border-l-purple-400' : 
                    scenario.type === 'evolutionary' ? 'border-l-4 border-l-teal-400' : 
                    'border-l-4 border-l-blue-400'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium">{scenario.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {scenario.type === 'revolutionary' ? t('moonshot') : 
                     scenario.type === 'evolutionary' ? t('lesson') : 
                     t('freeform')}
                  </Badge>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                  <span>{scenario.origin}</span>
                  <span>{scenario.date}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700/30 flex justify-end gap-1">
                  <button className="text-gray-400 hover:text-teal-400 transition-colors p-1">
                    <Archive size={14} />
                  </button>
                  <button className="text-gray-400 hover:text-purple-400 transition-colors p-1">
                    <Rocket size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  // Default horizontal layout
  return (
    <GlassCard className="backdrop-blur-xl h-full overflow-hidden">
      <div className="flex justify-between items-center p-3">
        <h2 className="text-xl font-semibold">{t('scenarioLibrary')}</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder={t('searchScenarios')} 
              className="w-64 h-8 pl-9" 
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Archive size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('archiveSelected')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                <Rocket size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('promoteSelected')}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-3rem)]">
        <div className="grid grid-cols-4 gap-3 p-3 pt-0">
          {scenarios.map(scenario => (
            <div 
              key={scenario.id} 
              className={`glass-panel p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover-lift
                ${scenario.type === 'revolutionary' ? 'border-l-4 border-l-purple-400' : 
                  scenario.type === 'evolutionary' ? 'border-l-4 border-l-teal-400' : 
                  'border-l-4 border-l-blue-400'}`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium">{scenario.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {scenario.type === 'revolutionary' ? t('moonshot') : 
                   scenario.type === 'evolutionary' ? t('lesson') : 
                   t('freeform')}
                </Badge>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                <span>{scenario.origin}</span>
                <span>{scenario.date}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700/30 flex justify-end gap-1">
                <button className="text-gray-400 hover:text-teal-400 transition-colors">
                  <Archive size={14} />
                </button>
                <button className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Rocket size={14} />
                </button>
              </div>
            </div>
          ))}
          
          {/* Add new scenario card */}
          <div className="glass-panel p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover-lift flex flex-col items-center justify-center border border-dashed border-gray-700/50 min-h-[100px]">
            <Plus size={24} className="mb-2 text-gray-400" />
            <span className="text-sm text-gray-400">{t('newScenario')}</span>
          </div>
        </div>
      </ScrollArea>
    </GlassCard>
  );
};
