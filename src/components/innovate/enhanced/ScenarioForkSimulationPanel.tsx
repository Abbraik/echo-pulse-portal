
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Plus, Play, Settings, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface ScenarioForkSimulationPanelProps {
  onGenerateSimulation: () => void;
  isGenerating: boolean;
  elapsedTime: number;
}

export const ScenarioForkSimulationPanel: React.FC<ScenarioForkSimulationPanelProps> = ({
  onGenerateSimulation,
  isGenerating,
  elapsedTime
}) => {
  const { t } = useTranslation();
  const [selectedFork, setSelectedFork] = useState('base');
  const [engine, setEngine] = useState('system-dynamics');
  const [autoParams, setAutoParams] = useState(true);
  const [sensitivity, setSensitivity] = useState([5]);

  const forks = [
    { id: 'base', name: t('baseScenario') },
    { id: 'fork1', name: 'High Engagement Fork' },
    { id: 'fork2', name: 'Resource Constraint Fork' },
    { id: 'fork3', name: 'Policy Innovation Fork' }
  ];

  const engines = [
    { id: 'system-dynamics', name: 'System Dynamics' },
    { id: 'agent-based', name: 'Agent-Based' },
    { id: 'network-analysis', name: 'Network Analysis' },
    { id: 'monte-carlo', name: 'Monte Carlo' }
  ];

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('scenarioForkSimulation')}</h3>
        <div className="flex items-center gap-2">
          {isGenerating && (
            <div className="text-xs text-muted-foreground">
              {Math.floor(elapsedTime / 1000)}s
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* Fork Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('scenarioFork')}</label>
          <div className="flex gap-2">
            <Select value={selectedFork} onValueChange={setSelectedFork}>
              <SelectTrigger className="glass-panel-deep">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel-deep">
                {forks.map((fork) => (
                  <SelectItem key={fork.id} value={fork.id}>
                    {fork.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="px-2">
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Engine Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('simulationEngine')}</label>
          <Select value={engine} onValueChange={setEngine}>
            <SelectTrigger className="glass-panel-deep">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-panel-deep">
              {engines.map((eng) => (
                <SelectItem key={eng.id} value={eng.id}>
                  {eng.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Parameter Defaults */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('parameterDefaults')}</label>
          <div className="flex items-center gap-3">
            <Switch checked={autoParams} onCheckedChange={setAutoParams} />
            <span className="text-sm">{autoParams ? t('auto') : t('manual')}</span>
            {!autoParams && (
              <Button size="sm" variant="outline" className="px-2">
                <Settings size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Sensitivity Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('sensitivity')} (±{sensitivity[0]}%)
          </label>
          <div className="px-2">
            <Slider
              value={sensitivity}
              onValueChange={setSensitivity}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={onGenerateSimulation}
            disabled={isGenerating}
            className="bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-500/25"
          >
            {isGenerating ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw size={16} />
              </motion.div>
            ) : (
              <Play size={16} />
            )}
            <span className="ml-2">
              {isGenerating ? t('generating') : t('generateSimulation')}
            </span>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          {t('sensitivitySweep')}: {Math.pow(2, sensitivity[0])} {t('runs')}
        </div>
      </div>
    </div>
  );
};
