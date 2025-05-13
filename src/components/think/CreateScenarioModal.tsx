
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ScenarioLineChart } from './components/ScenarioLineChart';

interface Parameter {
  id: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  pillar: 'population' | 'resources' | 'goods' | 'social';
}

interface CreateScenarioModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateScenarioModal: React.FC<CreateScenarioModalProps> = ({ open, onClose }) => {
  const [scenarioName, setScenarioName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [parameters, setParameters] = useState<Parameter[]>([
    // Population Dynamics
    { id: 'fertilityRate', name: 'Fertility Rate', value: 2.1, min: 1.5, max: 3.0, step: 0.05, unit: 'births/woman', pillar: 'population' },
    { id: 'migrationVolatility', name: 'Migration Volatility', value: 5, min: 0, max: 20, step: 1, unit: '%', pillar: 'population' },
    
    // Resource Efficiency
    { id: 'waterConsumption', name: 'Water Consumption per Capita', value: 100, min: 50, max: 150, step: 1, unit: 'L/day', pillar: 'resources' },
    { id: 'energyUse', name: 'Energy Use per GDP', value: 0.3, min: 0.1, max: 0.5, step: 0.01, unit: 'kWh/USD', pillar: 'resources' },
    
    // Goods & Services Stability
    { id: 'supplyChainRobustness', name: 'Supply-Chain Robustness', value: 75, min: 0, max: 100, step: 1, unit: 'index', pillar: 'goods' },
    { id: 'marketIntegration', name: 'Global Market Integration', value: 0.7, min: 0, max: 1, step: 0.01, unit: 'index', pillar: 'goods' },
    
    // Social Cohesion
    { id: 'educationRate', name: 'Education Attainment Rate', value: 75, min: 50, max: 100, step: 1, unit: '%', pillar: 'social' },
    { id: 'healthCoverage', name: 'Health Coverage Index', value: 80, min: 60, max: 100, step: 1, unit: 'index', pillar: 'social' },
  ]);

  // Setup keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  // Handle parameter change
  const handleParameterChange = (id: string, newValue: number) => {
    setParameters(prev => 
      prev.map(param => param.id === id ? { ...param, value: newValue } : param)
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!scenarioName.trim()) {
      setNameError('Scenario name is required');
      return;
    }
    
    // Clear any previous errors
    setNameError('');
    
    // Mock API call
    const parameterValues = parameters.reduce((acc, param) => {
      acc[param.id] = param.value;
      return acc;
    }, {} as Record<string, number>);
    
    // Mock POST request
    setTimeout(() => {
      toast({
        title: "Scenario created & running",
        description: `${scenarioName} scenario is now processing`,
      });
      onClose();
      resetForm();
    }, 500);
  };
  
  const resetForm = () => {
    setScenarioName('');
    setDescription('');
    setParameters(parameters.map(param => ({ ...param })));
    setNameError('');
  };
  
  const getParametersByPillar = (pillar: 'population' | 'resources' | 'goods' | 'social') => {
    return parameters.filter(param => param.pillar === pillar);
  };

  // Generate chart data based on current parameters
  const chartData = [
    { time: 0, baseline: 70, scenario: 70 },
    { time: 1, baseline: 72, scenario: parameters[0].value * 30 + parameters[1].value * 0.5 + 50 },
    { time: 2, baseline: 74, scenario: parameters[0].value * 32 + parameters[1].value * 0.7 + 48 },
    { time: 3, baseline: 73, scenario: parameters[0].value * 33 + parameters[1].value * 0.9 + 46 },
    { time: 4, baseline: 75, scenario: parameters[0].value * 35 + parameters[1].value * 1.1 + 45 },
  ];
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-navy-900/50 backdrop-blur-sm" />
      <DialogContent className="max-w-[600px] p-0 bg-white/15 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-teal-400">Create New Scenario</h2>
              <p className="text-gray-200">Define parameter adjustments and preview impacts.</p>
            </div>
            <button 
              onClick={onClose} 
              className="rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/10 hover:ring-2 ring-teal-300/70 transition-all"
            >
              <X size={20} />
              <span className="sr-only">Close</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Scenario Details */}
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Input
                    id="scenarioName"
                    value={scenarioName}
                    onChange={(e) => {
                      setScenarioName(e.target.value);
                      if (e.target.value.trim()) setNameError('');
                    }}
                    placeholder="Scenario Name"
                    className={`bg-white/10 border ${nameError ? 'border-red-400' : 'border-white/20'} text-white focus:ring-teal-400`}
                  />
                  {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
                </div>
              </div>
              
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the scenario's context and purpose"
                className="bg-white/10 border border-white/20 text-white focus:ring-teal-400 min-h-[80px]"
              />
            </div>
            
            {/* Parameters Grid */}
            <div className="space-y-6">
              {/* Population Dynamics */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <h3 className="text-teal-300 font-semibold mb-3">Population Dynamics</h3>
                <div className="space-y-4">
                  {getParametersByPillar('population').map((param) => (
                    <ParameterSlider 
                      key={param.id}
                      parameter={param}
                      onChange={handleParameterChange}
                    />
                  ))}
                </div>
              </div>
              
              {/* Resource Efficiency */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <h3 className="text-teal-300 font-semibold mb-3">Resource Efficiency</h3>
                <div className="space-y-4">
                  {getParametersByPillar('resources').map((param) => (
                    <ParameterSlider 
                      key={param.id}
                      parameter={param}
                      onChange={handleParameterChange}
                    />
                  ))}
                </div>
              </div>
              
              {/* Goods & Services Stability */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <h3 className="text-teal-300 font-semibold mb-3">Goods & Services Stability</h3>
                <div className="space-y-4">
                  {getParametersByPillar('goods').map((param) => (
                    <ParameterSlider 
                      key={param.id}
                      parameter={param}
                      onChange={handleParameterChange}
                    />
                  ))}
                </div>
              </div>
              
              {/* Social Cohesion */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                <h3 className="text-teal-300 font-semibold mb-3">Social Cohesion</h3>
                <div className="space-y-4">
                  {getParametersByPillar('social').map((param) => (
                    <ParameterSlider 
                      key={param.id}
                      parameter={param}
                      onChange={handleParameterChange}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Live Preview Chart */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
              <h3 className="text-teal-300 font-semibold mb-3">Impact Preview</h3>
              <div className="h-[180px]">
                <ScenarioLineChart data={chartData} />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-navy-800/80 backdrop-blur-lg -mx-8 -mb-8 p-4 flex justify-end space-x-3 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-white border-white/20 hover:bg-white/10 hover:ring-2 ring-teal-300/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!scenarioName.trim()}
                className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-400 hover:to-teal-600 text-white font-medium"
              >
                Run Scenario
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Parameter Slider component
interface ParameterSliderProps {
  parameter: Parameter;
  onChange: (id: string, value: number) => void;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({ parameter, onChange }) => {
  const { id, name, value, min, max, step, unit } = parameter;
  
  const handleSliderChange = (newValue: number[]) => {
    onChange(id, newValue[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(id, newValue);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="sm:w-1/3">
        <label htmlFor={id} className="text-sm text-gray-300">{name}</label>
      </div>
      <div className="flex-1 flex items-center gap-3">
        <div className="flex-1">
          <Slider 
            id={id}
            value={[value]}
            min={min}
            max={max}
            step={step}
            onValueChange={handleSliderChange}
            className="h-2"
          />
        </div>
        <div className="w-24 flex items-center">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-16 h-8 bg-white/10 border border-white/20 rounded px-2 text-white text-right text-sm"
          />
          <span className="ml-1 text-xs text-gray-400">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default CreateScenarioModal;
