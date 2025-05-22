
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CirclePlay, Check, Loader2 } from 'lucide-react';

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
  
  return (
    <GlassCard className="p-6 flex flex-col items-center justify-center h-full relative overflow-hidden backdrop-blur-xl shadow-[inset_0_0_15px_rgba(20,184,166,0.15)]">
      {/* If we're showing results, add a subtle glow effect */}
      {isGenerated && (
        <div className="absolute -inset-[5px] bg-teal-500/20 blur-xl rounded-full animate-pulse-subtle"></div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{t('requestSimulationModel')}</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-md text-center">
        {t('requestSimulationDesc')}
      </p>
      
      <div className="grid grid-cols-2 gap-6 items-center mb-6 w-full max-w-2xl">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t('selectEngine')}</label>
          <Select 
            value={engineMode} 
            onValueChange={setEngineMode}
            disabled={isGenerating || isGenerated}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectEngine')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system-dynamics">{t('systemDynamics')}</SelectItem>
              <SelectItem value="agent-based">{t('agentBased')}</SelectItem>
              <SelectItem value="econometric">{t('econometric')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-1">
          <Label className="text-sm font-medium">{t('parameterDefaults')}</Label>
          <RadioGroup defaultValue="auto" disabled={isGenerating || isGenerated} className="flex gap-4">
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
      </div>
      
      <div>
        {!isGenerated ? (
          <Button 
            onClick={onGenerateSimulation} 
            disabled={isGenerating}
            className="px-8 py-6 text-lg relative overflow-hidden group button-glow"
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
        ) : (
          <Button 
            variant="default" 
            className="bg-green-500 hover:bg-green-600 px-6 py-5 text-lg"
          >
            <Check className="mr-2 h-5 w-5" />
            {t('viewResults')}
          </Button>
        )}
      </div>
      
      {/* Status line */}
      {isGenerating && (
        <div className="mt-4 flex items-center text-sm text-muted-foreground animate-pulse">
          <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
          {t('buildingSimulationStatus')}
        </div>
      )}
    </GlassCard>
  );
};
