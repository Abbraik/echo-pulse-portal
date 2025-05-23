
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CirclePlay, Check, Loader2, GitBranch, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface RequestSimulationPanelProps {
  engineMode: string;
  setEngineMode: (mode: string) => void;
  onGenerateSimulation: () => void;
  isGenerating: boolean;
  isGenerated: boolean;
}

export const RequestSimulationPanel: React.FC<RequestSimulationPanelProps> = ({
  engineMode,
  setEngineMode,
  onGenerateSimulation,
  isGenerating,
  isGenerated
}) => {
  const { t } = useTranslation();
  
  // Mock scenario forks for dropdown
  const scenarioForks = [
    { id: 'base', name: 'Base Scenario' },
    { id: 'fork1', name: 'Resource Rights Reform' },
    { id: 'fork2', name: 'Commons Governance' },
    { id: 'fork3', name: 'Circular Economy' },
  ];
  
  return (
    <div className="p-3 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">{t('experimentSimulation')}</h3>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <GitBranch size={14} />
          <span>{t('forkScenario')}</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-3 h-[calc(100%-2.75rem)]">
        {/* Scenario Fork Selection */}
        <div className="col-span-1 flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">{t('activeFork')}</Label>
          <Select defaultValue="base">
            <SelectTrigger className="bg-black/20 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scenarioForks.map(fork => (
                <SelectItem key={fork.id} value={fork.id}>
                  {fork.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex-grow"></div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-auto flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            {t('newFork')}
          </Button>
        </div>
        
        {/* Simulation Engine */}
        <div className="col-span-1 flex flex-col gap-2">
          <Label className="text-xs text-muted-foreground">{t('simulationEngine')}</Label>
          <Select 
            value={engineMode} 
            onValueChange={setEngineMode}
            disabled={isGenerating || isGenerated}
          >
            <SelectTrigger className="bg-black/20 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system-dynamics">{t('systemDynamics')}</SelectItem>
              <SelectItem value="agent-based">{t('agentBased')}</SelectItem>
              <SelectItem value="econometric">{t('econometric')}</SelectItem>
            </SelectContent>
          </Select>
          
          <RadioGroup defaultValue="auto" disabled={isGenerating || isGenerated} className="flex justify-center gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto">{t('autoDetect')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual">{t('manualEntry')}</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Generate Button */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          {!isGenerated ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={onGenerateSimulation} 
                disabled={isGenerating}
                className="w-full h-10 relative overflow-hidden group button-glow"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('buildingSimulation')}
                  </>
                ) : (
                  <>
                    <CirclePlay className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    {t('generateSimulation')}
                  </>
                )}
                <span className="absolute inset-0 rounded-md overflow-hidden">
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-teal-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </span>
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                variant="default" 
                className="bg-green-500 hover:bg-green-600 w-full"
                size="lg"
              >
                <Check className="mr-2 h-5 w-5" />
                {t('viewResults')}
              </Button>
            </motion.div>
          )}
          
          {/* Status line */}
          {isGenerating && (
            <div className="mt-2 flex items-center text-sm text-muted-foreground animate-pulse">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              {t('buildingSimulationStatus')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
