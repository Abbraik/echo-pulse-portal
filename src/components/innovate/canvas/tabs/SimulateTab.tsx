
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

export const SimulateTab: React.FC = () => {
  const { t } = useTranslation();
  const [engine, setEngine] = useState('system-dynamics');
  const [sensitivity, setSensitivity] = useState([10]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const engines = [
    { id: 'system-dynamics', name: 'System Dynamics' },
    { id: 'agent-based', name: 'Agent-Based' },
    { id: 'network-analysis', name: 'Network Analysis' },
    { id: 'monte-carlo', name: 'Monte Carlo' }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setElapsedTime(0);
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 100);
    }, 100);

    setTimeout(() => {
      setIsGenerating(false);
      clearInterval(interval);
    }, 8300);
  };

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <motion.div
          className="glass-panel p-8 rounded-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{t('requestSimulation')}</h2>
            <p className="text-muted-foreground">{t('configureSimulationParameters')}</p>
          </div>

          <div className="space-y-6">
            {/* Engine Selector */}
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

            {/* Sensitivity Slider */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                {t('sensitivity')} (±{sensitivity[0]}%)
              </label>
              <div className="px-2">
                <Slider
                  value={sensitivity}
                  onValueChange={setSensitivity}
                  max={25}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {Math.pow(2, sensitivity[0] / 5)} {t('sensitivityRuns')}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg shadow-teal-500/25 text-white font-medium py-3"
              size="lg"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw size={20} />
                  </motion.div>
                  <span>{t('generating')}...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play size={20} />
                  <span>{t('generateSimulation')}</span>
                </div>
              )}
            </Button>

            {/* Status */}
            {isGenerating && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  {t('elapsedTime')}: {(elapsedTime / 1000).toFixed(1)}s
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t('estimatedCompletion')}: 8.3s
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
