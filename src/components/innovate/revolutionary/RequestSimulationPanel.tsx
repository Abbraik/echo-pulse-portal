
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <GlassCard className="p-6 flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* If we're showing results, add a subtle glow effect */}
      {isGenerated && (
        <div className="absolute -inset-[5px] bg-teal-500/20 blur-xl rounded-full animate-pulse-subtle" />
      )}
      
      <h3 className="text-xl font-bold mb-2">{t('requestSimulationModel')}</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-md text-center">
        {t('requestSimulationDesc')}
      </p>
      
      <div className="flex gap-6 items-center mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t('selectEngine')}</label>
          <Select 
            value={engineMode} 
            onValueChange={setEngineMode}
            disabled={isGenerating || isGenerated}
          >
            <SelectTrigger className="w-[200px]">
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
          <label className="text-sm font-medium">{t('parameterDefaults')}</label>
          <Select defaultValue="auto" disabled={isGenerating || isGenerated}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('parameterDefaults')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{t('autoPopulate')}</SelectItem>
              <SelectItem value="manual">{t('manualUpload')}</SelectItem>
              <SelectItem value="baseline">{t('fromBaseline')}</SelectItem>
            </SelectContent>
          </Select>
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
    </GlassCard>
  );
};
