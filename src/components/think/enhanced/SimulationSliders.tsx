import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, RotateCcw, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

interface SubIndicator {
  name: string;
  value: number;
  unit: string;
  description: string;
  min: number;
  max: number;
  equilibriumMin: number;
  equilibriumMax: number;
  pillar: string;
}

interface SimulationSlidersProps {
  indicators: SubIndicator[];
  onValueChange: (indicatorName: string, value: number) => void;
  onRealTimeUpdate: (updates: Record<string, number>) => void;
}

const SimulationSliders: React.FC<SimulationSlidersProps> = ({
  indicators,
  onValueChange,
  onRealTimeUpdate
}) => {
  const { t } = useTranslation();
  const [values, setValues] = useState<Record<string, number>>({});
  const [sparklineData, setSparklineData] = useState<Record<string, number[]>>({});

  // Initialize values
  useEffect(() => {
    const initialValues: Record<string, number> = {};
    const initialSparklines: Record<string, number[]> = {};
    
    indicators.forEach(indicator => {
      initialValues[indicator.name] = indicator.value;
      initialSparklines[indicator.name] = Array(10).fill(indicator.value);
    });
    
    setValues(initialValues);
    setSparklineData(initialSparklines);
  }, [indicators]);

  const handleSliderChange = (indicatorName: string, newValue: number[]) => {
    const value = newValue[0];
    
    setValues(prev => ({ ...prev, [indicatorName]: value }));
    
    // Update sparkline
    setSparklineData(prev => ({
      ...prev,
      [indicatorName]: [...prev[indicatorName].slice(1), value]
    }));
    
    // Real-time callback
    onValueChange(indicatorName, value);
    onRealTimeUpdate({ ...values, [indicatorName]: value });
  };

  const resetIndicator = (indicatorName: string, originalValue: number) => {
    handleSliderChange(indicatorName, [originalValue]);
  };

  const resetAll = () => {
    const resetValues: Record<string, number> = {};
    indicators.forEach(indicator => {
      resetValues[indicator.name] = indicator.value;
    });
    setValues(resetValues);
    onRealTimeUpdate(resetValues);
  };

  const isInEquilibrium = (indicator: SubIndicator, value: number) => {
    return value >= indicator.equilibriumMin && value <= indicator.equilibriumMax;
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'AED') return `${value.toLocaleString()} AED`;
    if (unit === 'ratio') return value.toFixed(2);
    return `${value.toFixed(1)} ${unit}`;
  };

  const getPillarColor = (pillar: string) => {
    const colors = {
      population: '#3b82f6',
      resources: '#10b981',
      goods: '#8b5cf6',
      social: '#f59e0b'
    };
    return colors[pillar as keyof typeof colors] || '#14b8a6';
  };

  const MiniSparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="ml-2">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <GlassCard className="p-6" variant="deep">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Sliders className="w-5 h-5 text-teal-400 mr-3" />
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            {t('simulationSliders')}
          </h3>
        </div>
        
        <Button
          onClick={resetAll}
          variant="outline"
          size="sm"
          className="border-white/20 text-gray-400 hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {t('resetAll')}
        </Button>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {indicators.map((indicator, index) => {
            const currentValue = values[indicator.name] || indicator.value;
            const inEquilibrium = isInEquilibrium(indicator, currentValue);
            const pillarColor = getPillarColor(indicator.pillar);
            
            return (
              <motion.div
                key={indicator.name}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <h4 className="font-medium text-white">{indicator.name}</h4>
                    <Badge 
                      variant="outline" 
                      className="ml-2 text-xs"
                      style={{ borderColor: pillarColor, color: pillarColor }}
                    >
                      {indicator.pillar}
                    </Badge>
                    {inEquilibrium && (
                      <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 text-xs">
                        Equilibrium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-mono text-teal-400 mr-2">
                      {formatValue(currentValue, indicator.unit)}
                    </span>
                    <Button
                      onClick={() => resetIndicator(indicator.name, indicator.value)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-white/10"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    {sparklineData[indicator.name] && (
                      <MiniSparkline 
                        data={sparklineData[indicator.name]} 
                        color={pillarColor} 
                      />
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mb-4">{indicator.description}</p>
                
                <div className="relative">
                  <Slider
                    value={[currentValue]}
                    min={indicator.min}
                    max={indicator.max}
                    step={0.1}
                    onValueChange={(value) => handleSliderChange(indicator.name, value)}
                    className="slider-teal"
                  />
                  
                  {/* Equilibrium band visualization */}
                  <div className="relative mt-2 h-2 bg-white/10 rounded-full">
                    <div
                      className="absolute h-full bg-green-500/30 rounded-full"
                      style={{
                        left: `${((indicator.equilibriumMin - indicator.min) / (indicator.max - indicator.min)) * 100}%`,
                        width: `${((indicator.equilibriumMax - indicator.equilibriumMin) / (indicator.max - indicator.min)) * 100}%`
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatValue(indicator.min, indicator.unit)}</span>
                    <span className="text-green-400">
                      {formatValue(indicator.equilibriumMin, indicator.unit)} - {formatValue(indicator.equilibriumMax, indicator.unit)}
                    </span>
                    <span>{formatValue(indicator.max, indicator.unit)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

export default SimulationSliders;