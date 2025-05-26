
import React from 'react';
import { Play, Settings, Zap, LoaderIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Zap size={20} className="text-purple-400" />
          {t('requestSimulationModel')}
        </h3>
        
        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-400 text-sm"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t('builtIn12s')}
          </motion.div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {t('requestSimulationDesc')}
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Scenario Fork Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('scenarioFork')}</label>
          <Select defaultValue="social-trust-revamp">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social-trust-revamp">{t('socialTrustRevamp')}</SelectItem>
              <SelectItem value="water-tax-adjust">{t('waterTaxAdjust')}</SelectItem>
              <SelectItem value="baseline">Baseline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Engine Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('selectEngine')}</label>
          <Select value={engineMode} onValueChange={setEngineMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system-dynamics">{t('systemDynamics')}</SelectItem>
              <SelectItem value="agent-based">{t('agentBased')}</SelectItem>
              <SelectItem value="econometric">{t('econometric')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Parameter Defaults */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{t('parameterDefaults')}</label>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            {t('autoPopulate')}
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            {t('fromBaseline')}
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            {t('manualUpload')}
          </Button>
        </div>
      </div>
      
      {/* Generate Button */}
      <div className="flex gap-2">
        <Button
          onClick={onGenerateSimulation}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <LoaderIcon size={16} className="mr-2 animate-spin" />
              {t('buildingSimulation')}
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              {t('generateSimulation')}
            </>
          )}
        </Button>
        
        <Button variant="outline" size="icon">
          <Settings size={16} />
        </Button>
        
        <Button variant="outline" className="gap-1">
          <span>+ {t('forkScenario')}</span>
        </Button>
      </div>
      
      {/* Status */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-purple-500/20 rounded-lg border border-purple-500/30"
        >
          <div className="flex items-center gap-2 text-sm text-purple-300">
            <LoaderIcon size={14} className="animate-spin" />
            {t('buildingSimulationStatus')}
          </div>
          <div className="mt-1 w-full bg-purple-900/30 rounded-full h-1.5">
            <motion.div
              className="bg-purple-500 h-1.5 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
