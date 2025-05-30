
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, RotateCcw, Download, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export const SimulationTab: React.FC = () => {
  const { t } = useTranslation();
  const [engine, setEngine] = useState('system-dynamics');
  const [sensitivity, setSensitivity] = useState([10]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<any[]>([]);

  const engines = [
    { id: 'system-dynamics', name: 'System Dynamics Model' },
    { id: 'agent-based', name: 'Agent-Based Simulation' },
    { id: 'network-analysis', name: 'Network Flow Analysis' }
  ];

  const mockTimeSeriesData = [
    { time: 0, baseline: 45, redesign: 45, target: 65 },
    { time: 3, baseline: 46, redesign: 52, target: 65 },
    { time: 6, baseline: 47, redesign: 58, target: 65 },
    { time: 9, baseline: 48, redesign: 63, target: 65 },
    { time: 12, baseline: 49, redesign: 67, target: 65 },
    { time: 15, baseline: 50, redesign: 71, target: 65 },
    { time: 18, baseline: 51, redesign: 74, target: 65 },
    { time: 21, baseline: 52, redesign: 76, target: 65 },
    { time: 24, baseline: 53, redesign: 78, target: 65 }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationData([]);
    
    setTimeout(() => {
      setSimulationData(mockTimeSeriesData);
      setIsSimulating(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      {/* Parameter Controls - Top Half */}
      <div className="flex-none">
        <motion.div
          className="glass-panel p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-noto-bold text-xl text-teal-300 mb-2">{t('modelTransformation')}</h3>
              <p className="text-sm text-gray-400">{t('convertCLDToSimulation')}</p>
            </div>
            <Button variant="outline" size="sm" className="text-teal-300 border-teal-400/30">
              <RefreshCw size={16} className="mr-2" />
              {t('syncFromThinkZone')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Engine Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">{t('simulationEngine')}</label>
              <Select value={engine} onValueChange={setEngine}>
                <SelectTrigger className="glass-panel-deep border-teal-400/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel-deep border-teal-400/20">
                  {engines.map((eng) => (
                    <SelectItem key={eng.id} value={eng.id}>
                      {eng.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">
                {t('youthEngagementFlow')} ({sensitivity[0]}%)
              </label>
              <Slider
                value={sensitivity}
                onValueChange={setSensitivity}
                max={50}
                min={5}
                step={5}
                className="slider-teal"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">
                {t('socialTrustStock')} (±15%)
              </label>
              <Slider
                value={[15]}
                max={30}
                min={5}
                step={5}
                className="slider-teal"
              />
            </div>
          </div>

          {/* Run Simulation */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg shadow-teal-500/25 text-white font-medium px-8 py-3"
              size="lg"
            >
              {isSimulating ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw size={20} />
                  </motion.div>
                  <span>{t('simulating')}...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play size={20} />
                  <span>{t('runSimulation')}</span>
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Results Chart - Bottom Half */}
      <div className="flex-1 min-h-0">
        <motion.div
          className="glass-panel p-6 rounded-xl h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-noto-bold text-lg text-teal-300">{t('simulationResults')}</h3>
            {simulationData.length > 0 && (
              <Button variant="outline" size="sm" className="text-gray-300 border-gray-500/30">
                <Download size={16} className="mr-2" />
                {t('exportResults')}
              </Button>
            )}
          </div>

          <div className="h-full">
            {simulationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.7)"
                    label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.7)"
                    label={{ value: 'Index Score', angle: -90, position: 'insideLeft' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="baseline" 
                    stroke="rgba(156, 163, 175, 0.8)" 
                    strokeWidth={2}
                    name="Baseline Scenario"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="redesign" 
                    stroke="rgba(20, 184, 166, 1)" 
                    strokeWidth={3}
                    name="Innovation Redesign"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="rgba(251, 191, 36, 0.8)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target Goal"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Play size={48} className="mx-auto mb-4 text-teal-400/50" />
                  <div className="font-noto-medium text-lg text-gray-400">{t('runSimulationToSeeResults')}</div>
                  <div className="text-sm text-gray-500 mt-2">{t('resultsPreviewed24Months')}</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
