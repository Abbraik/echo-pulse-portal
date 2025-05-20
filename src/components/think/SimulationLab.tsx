
import React, { useState, useEffect } from 'react';
import { Plus, Play, RotateCcw, Save, Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/use-translation';
import SparklineChart from './components/SparklineChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

interface Scenario {
  id: number;
  name: string;
  date: string;
  probability: number;
  sparkline: number[];
}

interface SimulationLabProps {
  metrics: Metrics;
  scenarios: Scenario[];
  onSaveScenario: (scenario: Omit<Scenario, 'id' | 'date'>) => void;
  onSelectScenario: (scenarioId: number) => void;
}

const SimulationLab: React.FC<SimulationLabProps> = ({ 
  metrics, 
  scenarios, 
  onSaveScenario, 
  onSelectScenario 
}) => {
  const { t } = useTranslation();
  const [simulationValues, setSimulationValues] = useState<Record<string, number>>({});
  const [originalValues, setOriginalValues] = useState<Record<string, number>>({});
  const [isComputing, setIsComputing] = useState(false);
  const [impactEstimates, setImpactEstimates] = useState({
    deiChange: 0,
    timeToEquilibrium: 0,
    confidence: 85,
  });
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioProbability, setNewScenarioProbability] = useState(50);
  const [currentSparkline, setCurrentSparkline] = useState<number[]>([]);

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
    
    // Generate a baseline sparkline
    const overallValue = metrics.overall;
    setCurrentSparkline([
      overallValue - Math.floor(Math.random() * 5),
      overallValue - Math.floor(Math.random() * 3),
      overallValue,
      overallValue + Math.floor(Math.random() * 3)
    ]);
    
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
    
    // Update sparkline based on changes
    const baseValue = metrics.overall;
    setCurrentSparkline([
      baseValue - 5,
      baseValue - 2,
      baseValue,
      baseValue + Math.round(changePercent / 5)
    ]);
    
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
    
    // Reset sparkline
    const baseValue = metrics.overall;
    setCurrentSparkline([
      baseValue - Math.floor(Math.random() * 5),
      baseValue - Math.floor(Math.random() * 3),
      baseValue,
      baseValue + Math.floor(Math.random() * 3)
    ]);
  };
  
  const handleSaveScenario = () => {
    if (!newScenarioName.trim()) return;
    
    const scenarioToSave = {
      name: newScenarioName,
      probability: newScenarioProbability / 100,
      sparkline: currentSparkline
    };
    
    onSaveScenario(scenarioToSave);
    setIsSaveDialogOpen(false);
    setNewScenarioName('');
    setNewScenarioProbability(50);
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

  const renderSparkline = (data: number[], color: string = 'bg-teal-500') => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end h-6 space-x-0.5">
        {data.map((value, i) => (
          <div 
            key={i}
            className={`w-1 ${color}`}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '15%',
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t("simulationLab")}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={resetSimulation}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md text-sm font-medium transition"
          >
            <RotateCcw size={16} />
            <span>{t("reset")}</span>
          </button>
          <button 
            onClick={() => setIsSaveDialogOpen(true)}
            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md text-sm font-medium transition"
          >
            <Save size={16} />
            <span>{t("saveScenario")}</span>
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
      
      {/* Scenarios carousel */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-left">{t("scenarios")}</h3>
        <div className="flex overflow-x-auto pb-4 space-x-4 -mx-2 px-2">
          {scenarios.map((scenario) => (
            <div 
              key={scenario.id} 
              className="min-w-[200px] bg-navy-800/50 p-4 rounded-lg border border-white/10 transform hover:scale-[1.02] transition-transform cursor-pointer"
              onClick={() => onSelectScenario(scenario.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{scenario.name}</h4>
                  <p className="text-xs text-gray-400">{scenario.date}</p>
                </div>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">
                  {Math.round(scenario.probability * 100)}%
                </span>
              </div>
              <div className="mb-2">
                {renderSparkline(scenario.sparkline)}
              </div>
            </div>
          ))}
          
          {/* New Scenario Card */}
          <div 
            onClick={() => setIsSaveDialogOpen(true)}
            className="min-w-[200px] bg-gradient-to-br from-teal-800/30 to-blue-800/30 p-4 rounded-lg border border-teal-500/30 flex flex-col items-center justify-center transform hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <Plus size={24} className="mb-2 text-teal-400" />
            <span className="text-teal-400 font-medium">{t("newScenario")}</span>
          </div>
        </div>
      </div>
      
      {/* Main simulation area with pillars and sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.entries(metrics.pillars).map(([pillarKey, pillar]) => {
          const equilibriumBand = metrics.equilibriumBands[pillarKey as keyof typeof metrics.equilibriumBands];
          
          return (
            <div key={pillarKey} className="bg-navy-900/40 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-medium capitalize`}>{t(pillarKey as any)}</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getPillarColor(pillarKey)} bg-opacity-30`}>
                  {pillar.value}%
                </div>
              </div>
              
              {/* Equilibrium band indicator */}
              <div className="mb-3 px-1">
                <div className="text-xs text-gray-400 flex justify-between mb-1">
                  <span>{t("equilibriumBand")}</span>
                  <span>{equilibriumBand.min}% - {equilibriumBand.max}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full relative">
                  <div 
                    className="absolute h-1.5 bg-teal-500/40 rounded-full" 
                    style={{ 
                      left: `${equilibriumBand.min}%`, 
                      width: `${equilibriumBand.max - equilibriumBand.min}%` 
                    }}
                  ></div>
                  <div 
                    className="absolute h-3 w-3 bg-white rounded-full top-1/2 transform -translate-y-1/2"
                    style={{ left: `${pillar.value}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-6">
                {pillar.subIndicators.map((indicator) => {
                  const key = `${pillarKey}-${indicator.name}`;
                  const currentValue = simulationValues[key] || indicator.value;
                  const originalValue = originalValues[key] || indicator.value;
                  const diff = currentValue - originalValue;
                  const diffPercentage = originalValue ? (diff / originalValue) * 100 : 0;
                  
                  // Calculate min/max based on equilibrium bands
                  const bandMin = equilibriumBand.min / 100 * originalValue * 0.7;
                  const bandMax = equilibriumBand.max / 100 * originalValue * 1.3;
                  
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
                          {indicator.trend && (
                            <div className="w-[60px] h-[20px]">
                              {renderSparkline(indicator.trend)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        {/* Equilibrium band visualization */}
                        <div 
                          className="absolute h-2 bg-teal-500/20 rounded-full pointer-events-none" 
                          style={{ 
                            left: `${(bandMin / bandMax) * 100}%`, 
                            width: `${(equilibriumBand.max - equilibriumBand.min)}%`,
                            top: 0,
                            zIndex: 0
                          }}
                        ></div>
                        <Slider
                          defaultValue={[currentValue]}
                          min={Math.max(1, bandMin * 0.5)}
                          max={bandMax * 1.5}
                          step={originalValue < 10 ? 0.1 : 1}
                          value={[currentValue]}
                          onValueChange={(values) => handleSimulationValueChange(key, values[0])}
                          className="z-10"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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

      {/* Save Scenario Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("saveScenario")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("scenarioName")}</label>
              <Input
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder={t("enterScenarioName", { defaultValue: "Enter scenario name..." })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">{t("probability", { defaultValue: "Probability" })}</label>
                <span>{newScenarioProbability}%</span>
              </div>
              <Slider
                value={[newScenarioProbability]}
                min={1}
                max={100}
                step={1}
                onValueChange={([value]) => setNewScenarioProbability(value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("preview", { defaultValue: "Preview" })}</label>
              <div className="bg-navy-800 p-3 rounded-lg">
                <div className="h-8">
                  {renderSparkline(currentSparkline, "bg-blue-500")}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSaveDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleSaveScenario}
              disabled={!newScenarioName.trim()}
              className="bg-gradient-to-r from-teal-500 to-blue-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimulationLab;
