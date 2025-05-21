import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { 
  SlidersHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  BarChart2, 
  Zap,
  Target,
  Plus,
  Calendar,
  InfoIcon,
  Lightbulb,
  PackagePlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ObjectivesList, { Objective } from './components/ObjectivesList';
import AddObjectiveModal from './components/AddObjectiveModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Tooltip } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LeveragePointPill from './components/LeveragePointPill';

// Type for simulation parameters
interface SimParameter {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  unit: string;
  minValue: number;
  maxValue: number;
  equilibriumMin: number;
  equilibriumMax: number;
  suggestedLeveragePoints: LeveragePoint[];
  impact: number;
  relatedObjectives: number[]; // Add objectiveIds this parameter relates to
}

// Type for leverage points based on Meadows' system leverage points
interface LeveragePoint {
  id: number;
  title: string;
  rationale: string;
  relevance: number; // 0-100
}

interface SensitivityParameter {
  parameter: string;
  delta: number;
  impact: number;
}

interface ExecutionImpact {
  bundlesAffected: number;
  budgetChange: number;
  timelineShift: number;
}

interface StrategyBuilderProps {
  sensitivityParameters: SensitivityParameter[];
  executionImpact: ExecutionImpact;
  onCompute: (approach: string, objectiveIds?: number[]) => void;
}

type Approach = 'conservative' | 'balanced' | 'aggressive';

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({
  sensitivityParameters,
  executionImpact,
  onCompute
}) => {
  const { t, isRTL } = useTranslation();
  const navigate = useNavigate();
  const [selectedApproach, setSelectedApproach] = useState<Approach>('balanced');
  const [isAddObjectiveOpen, setIsAddObjectiveOpen] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [objectives, setObjectives] = useState<Objective[]>([
    {
      id: 1,
      title: "Improve water resource management",
      description: "Implement advanced water recycling systems in urban areas to reduce consumption per capita by 15%",
      priority: "high",
      pillar: "resources",
      impact: 8,
      recommended: true
    },
    {
      id: 2,
      title: "Increase renewable energy adoption",
      description: "Expand solar infrastructure in desert regions to increase renewable energy contribution by 20%",
      priority: "medium",
      pillar: "resources",
      impact: 7,
      recommended: true
    },
    {
      id: 3,
      title: "Enhance birth rate stability",
      description: "Introduce family support programs to maintain population growth within equilibrium bands",
      priority: "medium",
      pillar: "population",
      impact: 6,
      recommended: true
    }
  ]);
  const [selectedObjectives, setSelectedObjectives] = useState<number[]>([1]);
  
  // Base parameters data with related objectives
  const baseParameters = [
    {
      id: 'migration-rate',
      name: t('migrationRate'),
      description: t('migrationRateDesc'),
      currentValue: 3.2,
      unit: '%',
      minValue: 0,
      maxValue: 10,
      equilibriumMin: 2.5,
      equilibriumMax: 4.0,
      impact: 34,
      relatedObjectives: [3],
      suggestedLeveragePoints: [
        { id: 6, title: t('informationFlows'), rationale: t('infoFlowsRationale'), relevance: 90 },
        { id: 3, title: t('systemStructure'), rationale: t('systemStructureRationale'), relevance: 75 },
        { id: 9, title: t('systemRules'), rationale: t('systemRulesRationale'), relevance: 60 }
      ]
    },
    {
      id: 'water-tariff',
      name: t('waterTariff'),
      description: t('waterTariffDesc'),
      currentValue: 4.5,
      unit: 'AED/m³',
      minValue: 1,
      maxValue: 10,
      equilibriumMin: 3.8,
      equilibriumMax: 5.2,
      impact: 28,
      relatedObjectives: [1],
      suggestedLeveragePoints: [
        { id: 5, title: t('feedbackLoops'), rationale: t('feedbackLoopsRationale'), relevance: 85 },
        { id: 2, title: t('systemGoals'), rationale: t('systemGoalsRationale'), relevance: 70 }
      ]
    },
    {
      id: 'education-investment',
      name: t('educationInvestment'),
      description: t('educationInvestmentDesc'),
      currentValue: 12,
      unit: 'B AED',
      minValue: 5,
      maxValue: 25,
      equilibriumMin: 10,
      equilibriumMax: 15,
      impact: 25,
      relatedObjectives: [3],
      suggestedLeveragePoints: [
        { id: 1, title: t('paradigms'), rationale: t('paradigmsRationale'), relevance: 95 },
        { id: 4, title: t('delays'), rationale: t('delaysRationale'), relevance: 65 }
      ]
    },
    {
      id: 'energy-subsidies',
      name: t('energySubsidies'),
      description: t('energySubsidiesDesc'),
      currentValue: 8.3,
      unit: 'B AED',
      minValue: 0,
      maxValue: 15,
      equilibriumMin: 7.0,
      equilibriumMax: 9.5,
      impact: 22,
      relatedObjectives: [2],
      suggestedLeveragePoints: [
        { id: 7, title: t('selfOrganization'), rationale: t('selfOrganizationRationale'), relevance: 80 },
        { id: 5, title: t('feedbackLoops'), rationale: t('feedbackLoopsRationale'), relevance: 72 }
      ]
    },
    {
      id: 'healthcare-access',
      name: t('healthcareAccess'),
      description: t('healthcareAccessDesc'),
      currentValue: 78,
      unit: '%',
      minValue: 50,
      maxValue: 100,
      equilibriumMin: 75,
      equilibriumMax: 95,
      impact: 20,
      relatedObjectives: [3],
      suggestedLeveragePoints: [
        { id: 3, title: t('systemStructure'), rationale: t('systemStructureRationale'), relevance: 88 },
        { id: 8, title: t('bufferStocks'), rationale: t('bufferStocksRationale'), relevance: 63 }
      ]
    },
    {
      id: 'employment-rate',
      name: t('employmentRate'),
      description: t('employmentRateDesc'),
      currentValue: 94.5,
      unit: '%',
      minValue: 85,
      maxValue: 100,
      equilibriumMin: 92,
      equilibriumMax: 97,
      impact: 18,
      relatedObjectives: [3],
      suggestedLeveragePoints: [
        { id: 2, title: t('systemGoals'), rationale: t('systemGoalsRationale'), relevance: 85 },
        { id: 6, title: t('informationFlows'), rationale: t('infoFlowsRationale'), relevance: 70 }
      ]
    },
    {
      id: 'tourism-policies',
      name: t('tourismPolicies'),
      description: t('tourismPoliciesDesc'),
      currentValue: 65,
      unit: '%',
      minValue: 0,
      maxValue: 100,
      equilibriumMin: 60,
      equilibriumMax: 80,
      impact: 15,
      relatedObjectives: [],
      suggestedLeveragePoints: [
        { id: 4, title: t('delays'), rationale: t('delaysRationale'), relevance: 75 },
        { id: 9, title: t('systemRules'), rationale: t('systemRulesRationale'), relevance: 68 }
      ]
    }
  ];
  
  // Parameters state
  const [parameters, setParameters] = useState<SimParameter[]>(baseParameters);
  
  // Parameter adjustments (% change from baseline)
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  
  // Selected leverage points
  const [selectedLeveragePoints, setSelectedLeveragePoints] = useState<Record<string, number[]>>({});
  
  const approachModifiers = {
    conservative: { 
      deltaMultiplier: 0.5, 
      confidenceInterval: 2, 
      timeToEquilibrium: 12,
      risk: 'low',
      icon: Shield,
      maxAdjustmentPercent: 10,
      defaultAdjustments: {
        'migration-rate': 2,
        'water-tariff': 5,
        'education-investment': 3,
        'energy-subsidies': -2,
        'healthcare-access': 4,
      }
    },
    balanced: { 
      deltaMultiplier: 1, 
      confidenceInterval: 5, 
      timeToEquilibrium: 8,
      risk: 'medium',
      icon: BarChart2,
      maxAdjustmentPercent: 15,
      defaultAdjustments: {
        'migration-rate': 5,
        'water-tariff': 8,
        'education-investment': 7,
        'energy-subsidies': -5,
        'healthcare-access': 6,
      }
    },
    aggressive: { 
      deltaMultiplier: 2, 
      confidenceInterval: 10, 
      timeToEquilibrium: 4,
      risk: 'high',
      icon: Zap,
      maxAdjustmentPercent: 20,
      defaultAdjustments: {
        'migration-rate': 10,
        'water-tariff': 15,
        'education-investment': 12,
        'energy-subsidies': -10,
        'healthcare-access': 9,
      }
    }
  };
  
  const selectedModifiers = approachModifiers[selectedApproach];
  
  // Get filtered parameters based on selected objectives
  const getFilteredParameters = () => {
    // Filter parameters related to selected objectives
    let filteredParams = parameters.filter(param => {
      // If no objectives are selected, show all parameters
      if (selectedObjectives.length === 0) return true;
      
      // Show parameters related to at least one selected objective
      // or parameters that don't have specific objective relations
      return param.relatedObjectives.some(id => selectedObjectives.includes(id)) ||
        param.relatedObjectives.length === 0;
    });
    
    // Sort by impact (highest impact first)
    filteredParams = filteredParams.sort((a, b) => b.impact - a.impact);
    
    // Show top 7 parameters for current approach
    return filteredParams.slice(0, 7);
  };
  
  // Calculate the total impact based on all adjustments
  const calculateTotalImpact = () => {
    let total = 0;
    
    getFilteredParameters().forEach(param => {
      const adjustmentPercent = adjustments[param.id] || 0;
      // Impact is weighted by the adjustment percentage and parameter's impact score
      const paramImpact = (param.impact * adjustmentPercent * selectedModifiers.deltaMultiplier) / 100;
      total += paramImpact;
    });
    
    return total.toFixed(1);
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const handleObjectiveToggle = (objectiveId: number) => {
    setSelectedObjectives(prev => {
      const updated = prev.includes(objectiveId)
        ? prev.filter(id => id !== objectiveId)
        : [...prev, objectiveId];
      
      // Notify parent about objective change
      onCompute(selectedApproach, updated);
      return updated;
    });
  };
  
  const handleAddObjective = (newObjective: Omit<Objective, 'id'>) => {
    const newId = objectives.length > 0 ? Math.max(...objectives.map(o => o.id)) + 1 : 1;
    const objectiveToAdd = {
      ...newObjective,
      id: newId
    };
    
    const updatedObjectives = [...objectives, objectiveToAdd];
    const updatedSelectedObjectives = [...selectedObjectives, newId];
    
    setObjectives(updatedObjectives);
    setSelectedObjectives(updatedSelectedObjectives);
    
    // Notify parent about new objective
    onCompute(selectedApproach, updatedSelectedObjectives);
  };
  
  const handleCreateBundle = () => {
    // In a real app, this would create a new bundle based on the current strategy
    toast({
      title: t("bundleCreated"),
      description: t("createdAsDraft"),
      duration: 3000,
    });
    
    navigate('/act');
  };
  
  // Handle parameter adjustment
  const handleAdjustParameter = (paramId: string, value: number[]) => {
    setAdjustments(prev => ({
      ...prev,
      [paramId]: value[0]
    }));
  };
  
  // Toggle a leverage point
  const handleToggleLeveragePoint = (paramId: string, leverageId: number) => {
    setSelectedLeveragePoints(prev => {
      const currentSelected = prev[paramId] || [];
      
      if (currentSelected.includes(leverageId)) {
        return {
          ...prev,
          [paramId]: currentSelected.filter(id => id !== leverageId)
        };
      } else {
        return {
          ...prev,
          [paramId]: [...currentSelected, leverageId]
        };
      }
    });
  };
  
  // Apply AI suggestions
  const handleApplySuggestions = () => {
    // Get relevant objectives for the suggestion
    const objectiveIds = selectedObjectives.length > 0 ? selectedObjectives : [1];
    
    // Dynamically generate suggestions based on selected objectives
    const optimizedAdjustments: Record<string, number> = {};
    const optimizedLeveragePoints: Record<string, number[]> = {};
    
    // Filter parameters relevant to selected objectives
    getFilteredParameters().forEach(param => {
      // Generate an appropriate adjustment value based on impact and approach
      const adjustmentBase = Math.round(param.impact / 3);
      optimizedAdjustments[param.id] = Math.min(
        param.id === 'energy-subsidies' ? -adjustmentBase : adjustmentBase,
        selectedModifiers.maxAdjustmentPercent
      );
      
      // Select the top 2 leverage points for each parameter
      optimizedLeveragePoints[param.id] = param.suggestedLeveragePoints
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 2)
        .map(lp => lp.id);
    });
    
    setAdjustments(optimizedAdjustments);
    setSelectedLeveragePoints(optimizedLeveragePoints);
    setIsSuggestModalOpen(false);
    
    toast({
      title: t("suggestionsApplied"),
      description: t("parameterAdjustmentsUpdated"),
      duration: 3000,
    });
    
    // Also notify about changes
    onCompute('optimized');
  };
  
  // Reset adjustments
  const handleResetAdjustments = () => {
    setAdjustments({});
    setSelectedLeveragePoints({});
    
    toast({
      title: t("adjustmentsReset"),
      description: t("parameterValuesReset"),
      duration: 2000,
    });
  };
  
  // Effect to apply default adjustments when approach changes or objectives change
  useEffect(() => {
    if (selectedApproach) {
      const defaultAdjustments = approachModifiers[selectedApproach].defaultAdjustments;
      
      // Filter adjustments to only include parameters related to selected objectives
      const filteredAdjustments: Record<string, number> = {};
      const filteredParams = getFilteredParameters();
      
      Object.keys(defaultAdjustments).forEach(paramId => {
        if (filteredParams.some(p => p.id === paramId)) {
          filteredAdjustments[paramId] = defaultAdjustments[paramId as keyof typeof defaultAdjustments];
        }
      });
      
      setAdjustments(filteredAdjustments);
      
      // Also set some default leverage points for the approach and selected objectives
      const newLeveragePoints: Record<string, number[]> = {};
      
      filteredParams.forEach(param => {
        if (selectedApproach === 'conservative') {
          // Conservative: select most relevant point only
          const topPoint = [...param.suggestedLeveragePoints].sort((a, b) => b.relevance - a.relevance)[0];
          if (topPoint) {
            newLeveragePoints[param.id] = [topPoint.id];
          }
        } else if (selectedApproach === 'balanced') {
          // Balanced: select top 2 most relevant points
          const topPoints = [...param.suggestedLeveragePoints]
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 2)
            .map(p => p.id);
          if (topPoints.length > 0) {
            newLeveragePoints[param.id] = topPoints;
          }
        } else {
          // Aggressive: select all highly relevant points
          const relevantPoints = param.suggestedLeveragePoints
            .filter(p => p.relevance > 65)
            .map(p => p.id);
          if (relevantPoints.length > 0) {
            newLeveragePoints[param.id] = relevantPoints;
          }
        }
      });
      
      setSelectedLeveragePoints(newLeveragePoints);
      
      // Notify the parent component about the approach change and currently selected objectives
      onCompute(selectedApproach, selectedObjectives);
    }
  }, [selectedApproach]);
  
  return (
    <div className="space-y-6">
      {/* Strategic Objectives Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium flex items-center">
            <Target className="mr-2" size={16} />
            {t("strategicObjectives")}
          </h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => setIsAddObjectiveOpen(true)}
          >
            <Plus className="mr-1" size={14} />
            {t("addObjective")}
          </Button>
        </div>
        
        <div className="bg-navy-900/40 rounded-xl p-4 border border-white/10">
          <ObjectivesList 
            objectives={objectives}
            selectedObjectives={selectedObjectives}
            onToggleSelect={handleObjectiveToggle}
          />
        </div>
      </div>
      
      {/* Approach Tabs */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-left">{t("selectApproach")}</h3>
        <Tabs 
          value={selectedApproach} 
          onValueChange={(value) => setSelectedApproach(value as Approach)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="conservative" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>{t("conservative")}</span>
            </TabsTrigger>
            <TabsTrigger value="balanced" className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>{t("balanced")}</span>
            </TabsTrigger>
            <TabsTrigger value="aggressive" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>{t("aggressive")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Parameter Adjustment and Impact Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Parameter Adjustment Panel (Left, 60%) */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-left flex items-center">
              <SlidersHorizontal className="mr-1" size={14} />
              {t("modelParameters")}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs"
              onClick={() => setIsSuggestModalOpen(true)}
            >
              <Lightbulb className="h-3 w-3" />
              <span>{t("autoSuggest")}</span>
            </Button>
          </div>
          
          <div className="glass-panel-dark p-2 rounded-lg max-h-[400px] overflow-y-auto">
            <div className="space-y-4 p-2">
              {getFilteredParameters().length > 0 ? (
                getFilteredParameters().map((param) => {
                  const currentAdjustment = adjustments[param.id] || 0;
                  const selectedLeverage = selectedLeveragePoints[param.id] || [];
                  
                  // Calculate adjusted value
                  const adjustedValue = param.currentValue * (1 + currentAdjustment / 100);
                  
                  return (
                    <div key={param.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{param.name}</h4>
                          <p className="text-xs text-gray-400">{param.description}</p>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {adjustedValue.toFixed(1)} {param.unit}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center justify-end mt-0.5">
                            <span>{t("current")}: {param.currentValue} {param.unit}</span>
                            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                              currentAdjustment > 0 
                                ? 'bg-green-500/20 text-green-400' 
                                : currentAdjustment < 0 
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {currentAdjustment > 0 ? '+' : ''}{currentAdjustment}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Equilibrium band indicator */}
                      <div className="relative h-1 w-full bg-white/10 rounded-full mb-3 mt-1">
                        <div 
                          className="absolute h-1 bg-teal-500/50 rounded-full" 
                          style={{ 
                            left: `${(param.equilibriumMin / param.maxValue) * 100}%`,
                            right: `${100 - (param.equilibriumMax / param.maxValue) * 100}%`
                          }}
                        />
                        <div 
                          className="absolute w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/4"
                          style={{
                            left: `${(adjustedValue / param.maxValue) * 100}%`
                          }}
                        />
                      </div>
                      
                      {/* Adjustment slider */}
                      <div className="mb-4">
                        <Slider
                          value={[currentAdjustment]}
                          min={-selectedModifiers.maxAdjustmentPercent}
                          max={selectedModifiers.maxAdjustmentPercent}
                          step={1}
                          onValueChange={(value) => handleAdjustParameter(param.id, value)}
                          className="my-4"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>-{selectedModifiers.maxAdjustmentPercent}%</span>
                          <span>0%</span>
                          <span>+{selectedModifiers.maxAdjustmentPercent}%</span>
                        </div>
                      </div>
                      
                      {/* Leverage points */}
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-xs text-gray-400">{t("leveragePoints")}</span>
                          <InfoIcon size={12} className="text-gray-500" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {param.suggestedLeveragePoints.map(leverage => (
                            <LeveragePointPill
                              key={`${param.id}-${leverage.id}`}
                              leveragePoint={leverage}
                              isSelected={selectedLeverage.includes(leverage.id)}
                              onClick={() => handleToggleLeveragePoint(param.id, leverage.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <SlidersHorizontal className="mx-auto mb-3 h-8 w-8 opacity-30" />
                  <p>{t("noParametersSelected")}</p>
                  <p className="text-sm mt-2">{t("selectObjectivesForParameters")}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 flex justify-between">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleResetAdjustments}
            >
              {t("resetParameters")}
            </Button>
            <div className="space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setIsSuggestModalOpen(true)}
              >
                {t("viewAllSuggestions")}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Impact & Timeline Preview (Right, 40%) */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium mb-3 text-left flex items-center">
            {parseFloat(calculateTotalImpact()) >= 0 
              ? <TrendingUp className="mr-1" size={14} /> 
              : <TrendingDown className="mr-1" size={14} />
            }
            {t("impactForecast")}
          </h3>
          
          <div className="glass-panel-dark p-5 rounded-lg border border-white/10">
            {/* DEI Impact */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{t("deiImpact")}</span>
                <span className={`text-2xl font-bold ${
                  parseFloat(calculateTotalImpact()) >= 0 
                    ? 'text-teal-400' 
                    : 'text-red-400'
                }`}>
                  {parseFloat(calculateTotalImpact()) >= 0 ? '+' : ''}{calculateTotalImpact()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full">
                <motion.div 
                  className={`h-1.5 rounded-full ${
                    parseFloat(calculateTotalImpact()) >= 0 
                      ? 'bg-gradient-to-r from-teal-500 to-green-500' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  initial={{ width: '50%' }}
                  animate={{ 
                    width: `${Math.min(Math.max(parseFloat(calculateTotalImpact()) * 5 + 50, 10), 90)}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            {/* Time to Equilibrium */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{t("timeToEquilibrium")}</span>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-gray-400" />
                  <span className="text-lg font-medium">
                    {selectedModifiers.timeToEquilibrium} {t("months")}
                  </span>
                </div>
              </div>
              <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden">
                {/* Timeline visualization */}
                <div className="absolute inset-0 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={`h-full w-0.5 bg-white/10 absolute`}
                      style={{ left: `${(i + 1) * 20}%` }}
                    />
                  ))}
                </div>
                <motion.div 
                  className="absolute top-1/2 h-2 w-2 bg-teal-500 rounded-full transform -translate-y-1/2"
                  initial={{ left: '10%' }}
                  animate={{ 
                    left: `${(selectedModifiers.timeToEquilibrium / 16) * 100}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
                <span>16</span>
              </div>
            </div>
            
            {/* Bundles Impact */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{t("bundlesAffected")}</span>
                <span className="font-medium">{Math.max(1, Math.ceil(Math.abs(parseFloat(calculateTotalImpact())) * 0.5))}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{t("budgetChange")}</span>
                <span className={`font-medium ${
                  parseFloat(calculateTotalImpact()) >= 0 ? 'text-teal-400' : 'text-red-400'
                }`}>
                  {formatCurrency(executionImpact.budgetChange * Math.abs(parseFloat(calculateTotalImpact())) / 2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{t("timelineShift")}</span>
                <span className="font-medium">
                  {Math.round(executionImpact.timelineShift * Math.abs(parseFloat(calculateTotalImpact())) / 3)} {t("weeks")}
                </span>
              </div>
            </div>
            
            {/* Mini Gantt Chart */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{t("implementationTimeline")}</span>
              </div>
              <div className="relative h-12 w-full bg-white/5 rounded-lg overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/4 bg-teal-500/20 border-r border-teal-500/50"></div>
                <div className="absolute inset-y-0 left-1/4 w-2/5 bg-blue-500/20 border-r border-blue-500/50"></div>
                <div className="absolute inset-y-0 left-[65%] w-[35%] bg-purple-500/20"></div>
                
                <div className="absolute top-0 left-0 w-full flex justify-between px-1 py-0.5">
                  <span className="text-xs text-teal-400">{t("phase")} 1</span>
                  <span className="text-xs text-blue-400">{t("phase")} 2</span>
                  <span className="text-xs text-purple-400">{t("phase")} 3</span>
                </div>
                
                <div className="absolute bottom-1 left-0 w-full px-2">
                  <div className="h-1 w-full bg-white/10 rounded-full">
                    <motion.div 
                      className="h-1 bg-yellow-500 rounded-full relative"
                      style={{ width: '10%' }}
                      animate={{ 
                        left: `${Math.min(90, Math.max(0, 35 + parseFloat(calculateTotalImpact()) * 4))}%`
                      }}
                    >
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500/20 rounded px-1 py-0.5">
                        <span className="text-[10px] text-yellow-400">{t("now")}</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              className="w-full bg-teal-600 hover:bg-teal-500 flex items-center justify-center"
              onClick={handleCreateBundle}
            >
              <PackagePlus className="mr-2 h-4 w-4" /> {t("newBundle")}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add Objective Modal */}
      <AddObjectiveModal
        open={isAddObjectiveOpen}
        onOpenChange={setIsAddObjectiveOpen}
        onSave={handleAddObjective}
      />
      
      {/* AI Suggestion Modal */}
      <Dialog open={isSuggestModalOpen} onOpenChange={setIsSuggestModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              {t("aiSuggestions")}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="text-sm font-medium mb-2">{t("suggestedParameters")}</h4>
            <div className="space-y-3 mb-4">
              {getFilteredParameters().slice(0, 3).map(param => (
                <div key={param.id} className="bg-white/5 rounded p-3 border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-sm">{param.name}</span>
                    <span className="text-sm text-teal-400">
                      {param.id === 'energy-subsidies' ? '-' : '+'}
                      {Math.round(param.impact / 3)}%
                    </span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {param.suggestedLeveragePoints
                      .sort((a, b) => b.relevance - a.relevance)
                      .slice(0, 2)
                      .map(lp => (
                        <span key={lp.id} className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px]">
                          #{lp.id} {lp.title}
                        </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {getFilteredParameters().length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <p>{t("noParametersForSuggestions")}</p>
                  <p className="text-sm mt-1">{t("selectObjectivesForParameters")}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">{t("projectedOutcome")}</h4>
              <div className="bg-white/5 rounded p-3 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("deiImpact")}</span>
                  <span className="text-lg font-bold text-teal-400">+{(getFilteredParameters().length * 0.9).toFixed(1)}</span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-400">{t("timeToEquilibrium")}</span>
                  <span className="text-sm">
                    {selectedObjectives.length > 0 ? 6 : 8} {t("months")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSuggestModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleApplySuggestions} disabled={getFilteredParameters().length === 0}>
              {t("applyAll")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategyBuilder;
