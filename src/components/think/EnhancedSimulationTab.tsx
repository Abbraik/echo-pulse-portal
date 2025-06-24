
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  Play, 
  Save, 
  Settings,
  Target
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';

interface SubIndicator {
  name: string;
  value: number;
  target?: number;
  unit?: string;
  description: string;
  trend?: number[];
}

interface PillarData {
  name: string;
  value: number;
  subIndicators: SubIndicator[];
}

interface EnhancedPillars {
  [key: string]: PillarData;
}

interface Scenario {
  id: number;
  name: string;
  date: string;
  probability: number;
  sparkline: number[];
}

interface EnhancedSimulationTabProps {
  metrics: any;
  scenarios: Scenario[];
  pillars: EnhancedPillars;
  onSaveScenario: (scenario: any) => void;
  onSelectScenario: (id: number) => void;
}

interface SliderConfig {
  min: number;
  max: number;
  step: number;
  formatValue: (value: number) => string;
}

const EnhancedSimulationTab: React.FC<EnhancedSimulationTabProps> = ({
  metrics,
  scenarios,
  pillars,
  onSaveScenario,
  onSelectScenario
}) => {
  const { t, isRTL } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [openSections, setOpenSections] = useState<string[]>(['population']);
  const [sliderValues, setSliderValues] = useState<{[key: string]: number}>({});
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize slider values from selected scenario
  useEffect(() => {
    const initialValues: {[key: string]: number} = {};
    Object.entries(pillars).forEach(([pillarKey, pillar]) => {
      pillar.subIndicators.forEach((indicator) => {
        const key = `${pillarKey}_${indicator.name}`;
        initialValues[key] = indicator.value;
      });
    });
    setSliderValues(initialValues);
  }, [selectedScenario, pillars]);

  // Slider configurations for different indicator types
  const getSliderConfig = (indicator: SubIndicator): SliderConfig => {
    const { unit, value } = indicator;
    
    if (unit === '%') {
      return {
        min: 0,
        max: 100,
        step: 1,
        formatValue: (v) => `${v.toFixed(0)}%`
      };
    }
    
    if (unit === 'ratio') {
      return {
        min: 0,
        max: 2,
        step: 0.01,
        formatValue: (v) => v.toFixed(2)
      };
    }
    
    if (unit === 'AED') {
      const range = value * 0.5; // ±50% range
      return {
        min: Math.max(0, value - range),
        max: value + range,
        step: 50,
        formatValue: (v) => `${v.toLocaleString()} AED`
      };
    }
    
    if (unit === 'index') {
      return {
        min: 0,
        max: 100,
        step: 1,
        formatValue: (v) => v.toFixed(0)
      };
    }
    
    // Default configuration
    const range = Math.abs(value) || 10;
    return {
      min: -range,
      max: range,
      step: range / 100,
      formatValue: (v) => v.toFixed(2)
    };
  };

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === parseInt(scenarioId));
    if (scenario) {
      setSelectedScenario(scenario);
      onSelectScenario(scenario.id);
    }
  };

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(key => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleSliderChange = (pillarKey: string, indicatorName: string, value: number[]) => {
    const key = `${pillarKey}_${indicatorName}`;
    setSliderValues(prev => ({
      ...prev,
      [key]: value[0]
    }));
  };

  const resetSlider = (pillarKey: string, indicatorName: string) => {
    const indicator = pillars[pillarKey].subIndicators.find(i => i.name === indicatorName);
    if (indicator) {
      const key = `${pillarKey}_${indicatorName}`;
      setSliderValues(prev => ({
        ...prev,
        [key]: indicator.value
      }));
    }
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: t('simulationComplete'),
      description: t('resultsUpdated'),
      duration: 3000,
    });
    
    setIsSimulating(false);
  };

  const saveCurrentScenario = () => {
    const newScenario = {
      name: `Custom Scenario ${scenarios.length + 1}`,
      probability: 0.3,
      sparkline: [65, 68, 72, 78, 76], // Mock sparkline
      sliderValues: { ...sliderValues }
    };
    
    onSaveScenario(newScenario);
    
    toast({
      title: t('scenarioSaved'),
      description: t('scenarioSavedDesc'),
      duration: 3000,
    });
  };

  const getPillarColor = (pillarKey: string) => {
    const colors = {
      population: 'border-blue-500/30 bg-blue-500/10',
      resources: 'border-green-500/30 bg-green-500/10',
      goods: 'border-purple-500/30 bg-purple-500/10',
      social: 'border-orange-500/30 bg-orange-500/10'
    };
    return colors[pillarKey as keyof typeof colors] || 'border-teal-500/30 bg-teal-500/10';
  };

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <motion.div 
        className="glass-panel p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
              {t('currentScenario')}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{selectedScenario.name}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedScenario.id.toString()} onValueChange={handleScenarioChange}>
              <SelectTrigger className="w-[200px] bg-white/10 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{scenario.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(scenario.probability * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Pillar Sections */}
      <div className="space-y-4">
        {Object.entries(pillars).map(([pillarKey, pillar], index) => (
          <motion.div
            key={pillarKey}
            className={`glass-panel border-2 ${getPillarColor(pillarKey)} overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Collapsible
              open={openSections.includes(pillarKey)}
              onOpenChange={() => toggleSection(pillarKey)}
            >
              <CollapsibleTrigger asChild>
                <div className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {openSections.includes(pillarKey) ? (
                        <ChevronDown size={20} className="text-teal-400" />
                      ) : (
                        <ChevronRight size={20} className="text-teal-400" />
                      )}
                      <h4 className="text-lg font-bold text-white">{pillar.name}</h4>
                    </div>
                    <Badge variant="secondary" className="bg-teal-500/20 text-teal-400">
                      {pillar.subIndicators.length} {t('indicators')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-teal-400">
                      {pillar.value}%
                    </span>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <AnimatePresence>
                  <motion.div
                    className="px-4 pb-4 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {pillar.subIndicators.map((indicator, idx) => {
                      const sliderKey = `${pillarKey}_${indicator.name}`;
                      const currentValue = sliderValues[sliderKey] ?? indicator.value;
                      const config = getSliderConfig(indicator);
                      
                      return (
                        <motion.div
                          key={indicator.name}
                          className="glass-panel-deep p-4 space-y-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-white">{indicator.name}</h5>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => resetSlider(pillarKey, indicator.name)}
                                  className="h-6 w-6 p-0 hover:bg-white/10"
                                  aria-label={t('resetToOriginal')}
                                >
                                  <RotateCcw size={12} />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-400">{indicator.description}</p>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-mono text-sm text-teal-400">
                                {config.formatValue(currentValue)}
                              </div>
                              {indicator.target && (
                                <div className="text-xs text-gray-500">
                                  Target: {config.formatValue(indicator.target)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="px-2">
                            <Slider
                              value={[currentValue]}
                              min={config.min}
                              max={config.max}
                              step={config.step}
                              onValueChange={(value) => handleSliderChange(pillarKey, indicator.name, value)}
                              className="slider-teal"
                              aria-label={indicator.name}
                              aria-valuemin={config.min}
                              aria-valuemax={config.max}
                              aria-valuenow={currentValue}
                              aria-help={indicator.description}
                            />
                            
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{config.formatValue(config.min)}</span>
                              <span>{config.formatValue(config.max)}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          size="lg"
        >
          <Play size={20} className="mr-2" />
          {isSimulating ? t('running') : t('runSimulation')}
        </Button>
        
        <Button
          onClick={saveCurrentScenario}
          variant="outline"
          className="flex-1 border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
          size="lg"
        >
          <Save size={20} className="mr-2" />
          {t('saveScenario')}
        </Button>
      </motion.div>
    </div>
  );
};

export default EnhancedSimulationTab;
