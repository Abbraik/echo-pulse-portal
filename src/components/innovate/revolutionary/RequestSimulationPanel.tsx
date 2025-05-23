
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CirclePlay, Check, Loader2 } from 'lucide-react';
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
  
  return (
    <div className="p-6 rounded-xl flex flex-col items-center justify-center h-full relative overflow-hidden backdrop-blur-xl shadow-[inset_0_0_15px_rgba(20,184,166,0.15)] max-w-3xl mx-auto">
      {/* If we're showing results, add a subtle glow effect */}
      {isGenerated && (
        <motion.div
          className="absolute -inset-[5px] bg-teal-500/20 blur-xl rounded-full"
          animate={{ 
            opacity: [0.2, 0.5, 0.2], 
            scale: [0.95, 1.05, 0.95] 
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        ></motion.div>
      )}
      
      <div className="flex flex-col w-full items-center gap-6 z-10">
        <h3 className="text-2xl font-bold text-center mb-2">{t('requestSimulationTitle')}</h3>
        
        <div className="flex flex-col w-full gap-4 max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t('selectEngine')}</label>
            <Select 
              value={engineMode} 
              onValueChange={setEngineMode}
              disabled={isGenerating || isGenerated}
            >
              <SelectTrigger className="w-full bg-black/20 border-white/10">
                <SelectValue placeholder={t('selectEngine')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system-dynamics">{t('systemDynamics')}</SelectItem>
                <SelectItem value="agent-based">{t('agentBased')}</SelectItem>
                <SelectItem value="econometric">{t('econometric')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
          
          <div className="mt-4 flex justify-center">
            {!isGenerated ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={onGenerateSimulation} 
                  disabled={isGenerating}
                  className="px-8 py-6 relative overflow-hidden group button-glow"
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
                  className="bg-green-500 hover:bg-green-600 px-8 py-6"
                  size="lg"
                >
                  <Check className="mr-2 h-5 w-5" />
                  {t('viewResults')}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Status line */}
        {isGenerating && (
          <div className="mt-2 flex items-center text-sm text-muted-foreground animate-pulse">
            <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
            {t('buildingSimulationStatus')}
          </div>
        )}
      </div>
    </div>
  );
};
