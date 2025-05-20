
import React, { useState, useEffect } from 'react';
import { Plus, Play, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/use-translation';
import SparklineChart from './components/SparklineChart';

interface SubIndicator {
  name: string;
  value: number;
  trend?: number[];
}

interface Pillar {
  value: number;
  subIndicators: SubIndicator[];
}

interface Metrics {
  overall: number;
  pillars: {
    population: Pillar;
    resources: Pillar;
    goods: Pillar;
    social: Pillar;
  };
  equilibriumBands: {
    overall: { min: number; max: number };
    population: { min: number; max: number };
    resources: { min: number; max: number };
    goods: { min: number; max: number };
    social: { min: number; max: number };
  };
}

interface SimulationLabProps {
  metrics: Metrics;
}

const SimulationLab: React.FC<SimulationLabProps> = ({ metrics }) => {
  const { t } = useTranslation();
  const [simulationValues, setSimulationValues] = useState<Record<string, number>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, number>>({});
  const [isComputing, setIsComputing] = useState(false);
  const [impactEstimates, setImpactEstimates] = useState({
    deiChange: 0,
    timeToEquilibrium: 0,
    confidence: 85,
  });

  // Initialize simulationValues with current values from metrics
  useEffect(() => {
    const initialValues: Record<string, number> = {};
    const originalVals: Record<string, number> = {};
    
    Object.entries(metrics.pillars).forEach(([pillarKey, pillar]) => {
      pillar.subIndicators.forEach(subInd => {
        const key = `${pillarKey}-${subInd.name}`;
        initialValues[key] = subInd.value;
        originalVals[key] = subInd.value;
      });
    });
    
    setSimulationValues(initialValues);
    setOriginalValues(originalVals);
  }, [metrics]);

  const handleSimulationValueChange = (key: string, newValue: number) => {
    // Calculate the change percentage
    const originalValue = originalValues[key];
    const changePercent = ((newValue - originalValue) / originalValue) * 100;
    
    // Update the impact estimates based on the changes
    setImpactEstimates(prev => {
      const magnitude = Math.abs(changePercent);
      return {
        deiChange: magnitude > 10 ? Math.round(magnitude / 3) : Math.round(magnitude / 5),
        timeToEquilibrium: magnitude > 15 ? Math.round(magnitude / 2) : Math.round(magnitude / 4),
        confidence: Math.max(60, 95 - magnitude),
      };
    });
    
    setSimulationValues(prev => ({
      ...prev,
      [key]: newValue
    }));
  };
  
  const runSimulation = () => {
    setIsComputing(true);
    // Simulate an API call with some delay
    setTimeout(() => {
      setIsComputing(false);
      // In a real app, this would update the DEI metrics based on the simulation results
    }, 2000);
  };
  
  const resetSimulation = () => {
    setSimulationValues(originalValues);
    setImpactEstimates({
      deiChange: 0,
      timeToEquilibrium: 0,
      confidence: 85,
    });
  };
  
  const getPillarColor = (pillar: string) => {
    switch(pillar) {
      case 'population': return 'from-blue-500 to-blue-700';
      case 'resources': return 'from-teal-500 to-teal-700';
      case 'goods': return 'from-emerald-500 to-emerald-700';
      case 'social': return 'from-cyan-500 to-cyan-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t("simulationLab")}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={resetSimulation}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md text-sm transition"
          >
            <RotateCcw size={16} />
            <span>{t("reset")}</span>
          </button>
          <button 
            onClick={runSimulation}
            disabled={isComputing}
            className={`
              flex items-center space-x-1 bg-gradient-to-r from-teal-500 to-blue-600 
              hover:from-teal-400 hover:to-blue-500 text-white px-4 py-2 rounded-md 
              text-sm transition ${isComputing ? 'opacity-50' : ''}
            `}
          >
            {isComputing ? (
              <>
                <span className="animate-spin">◌</span>
                <span>{t("computing")}</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>{t("runSimulation")}</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Main simulation area with pillars and sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.entries(metrics.pillars).map(([pillarKey, pillar]) => (
          <div key={pillarKey} className="bg-navy-900/40 rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-medium capitalize`}>{t(pillarKey)}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getPillarColor(pillarKey)} bg-opacity-30`}>
                {pillar.value}%
              </div>
            </div>
            
            <div className="space-y-6">
              {pillar.subIndicators.map((indicator) => {
                const key = `${pillarKey}-${indicator.name}`;
                const currentValue = simulationValues[key] || indicator.value;
                const originalValue = originalValues[key] || indicator.value;
                const diff = currentValue - originalValue;
                const diffPercentage = originalValue ? (diff / originalValue) * 100 : 0;
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{indicator.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <span className="text-sm font-medium">{Number.isInteger(currentValue) ? currentValue : currentValue.toFixed(1)}</span>
                          {diff !== 0 && (
                            <span className={`ml-1 text-xs ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ({diff > 0 ? '+' : ''}{diffPercentage.toFixed(1)}%)
                            </span>
                          )}
                        </div>
                        {indicator.trend && <SparklineChart data={indicator.trend} height={20} width={60} />}
                      </div>
                    </div>
                    <Slider
                      defaultValue={[currentValue]}
                      min={originalValue * 0.5}
                      max={originalValue * 1.5}
                      step={originalValue < 10 ? 0.1 : 1}
                      value={[currentValue]}
                      onValueChange={(values) => handleSimulationValueChange(key, values[0])}
                      className="z-0"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Impact estimates panel */}
      <div className="bg-navy-900/40 rounded-xl p-4 border border-white/10">
        <h3 className="text-lg font-medium mb-4">{t("simulationImpact")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-gray-400">{t("deiChange")}</div>
            <div className={`text-2xl font-bold ${impactEstimates.deiChange > 0 ? 'text-green-400' : impactEstimates.deiChange < 0 ? 'text-red-400' : 'text-white'}`}>
              {impactEstimates.deiChange > 0 ? '+' : ''}{impactEstimates.deiChange}%
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-gray-400">{t("timeToEquilibrium")}</div>
            <div className="text-2xl font-bold">
              {impactEstimates.timeToEquilibrium} {t("months")}
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-gray-400">{t("confidence")}</div>
            <div className="text-2xl font-bold">
              {impactEstimates.confidence}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationLab;
