import React, { useState } from 'react';
import { Layout, Network, BarChart3, ArrowRight, Target, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import OverallDeiIndicator from '@/components/think/OverallDeiIndicator';
import PillarBreakouts from '@/components/think/PillarBreakouts';
import DeiForesightTab from '@/components/think/DeiForesightTab';
import SimulationLab from '@/components/think/SimulationLab';
import EnhancedSimulationTab from '@/components/think/EnhancedSimulationTab';
import { EnhancedPillarCard } from '@/components/think/components/EnhancedPillarCard';
import { TargetSettingModal } from '@/components/think/components/TargetSettingModal';
import LoopAnalysisTab from '@/components/think/LoopAnalysisTab';

interface SubIndicator {
  name: string;
  value: number;
  target?: number;
  unit?: string;
  description: string;
  trend?: number[];
}

interface DeiMetrics {
  overall: number;
  pillars: any;
  equilibriumBands: any;
}

interface DeiAndForesightHubProps {
  metrics: DeiMetrics;
  scenarios: any[];
  onSaveScenario: (scenario: any) => void;
  onSelectScenario: (id: number) => void;
}

const DeiAndForesightHub: React.FC<DeiAndForesightHubProps> = ({
  metrics,
  scenarios = [],
  onSaveScenario,
  onSelectScenario
}) => {
  const { t, isRTL } = useTranslation();
  const [activeView, setActiveView] = useState<'overview' | 'simulation' | 'loopAnalysis'>('overview');
  const [selectedIndicator, setSelectedIndicator] = useState<{
    pillar: string;
    indicator: SubIndicator;
  } | null>(null);
  const [hasTargets, setHasTargets] = useState(false);
  const [pillarsWithTargets, setPillarsWithTargets] = useState<string[]>([]);

  // Add null checking and default values for metrics
  const safeMetrics = metrics || {
    overall: 0,
    pillars: {
      population: { value: 0 },
      resources: { value: 0 },
      goods: { value: 0 },
      social: { value: 0 }
    },
    equilibriumBands: {
      overall: { min: 0, max: 100 },
      population: { min: 0, max: 100 },
      resources: { min: 0, max: 100 },
      goods: { min: 0, max: 100 },
      social: { min: 0, max: 100 }
    }
  };

  // Enhanced sub-indicators for each pillar
  const enhancedPillars = {
    population: {
      name: t('populationDynamics'),
      value: safeMetrics.pillars?.population?.value || 0,
      subIndicators: [
        {
          name: 'Population Deviation',
          value: -2.5,
          target: undefined,
          unit: '%',
          description: 'Gap between current and target population',
          trend: [-3.2, -2.8, -2.5, -2.3, -2.5]
        },
        {
          name: 'Structure Deviation',
          value: 15.2,
          target: undefined,
          unit: 'index',
          description: 'Composite age/gender/nationality deviation',
          trend: [16.1, 15.8, 15.5, 15.2, 15.2]
        },
        {
          name: 'Natural Growth Balance',
          value: 1.2,
          target: undefined,
          unit: 'ratio',
          description: 'Births to deaths ratio (0-2 scale)',
          trend: [1.1, 1.15, 1.18, 1.2, 1.2]
        },
        {
          name: 'Growth Volatility',
          value: 0.8,
          target: undefined,
          unit: 'SD',
          description: 'Standard deviation of population change over 12 months',
          trend: [1.2, 1.0, 0.9, 0.8, 0.8]
        }
      ]
    },
    resources: {
      name: t('resourceMarket'),
      value: safeMetrics.pillars?.resources?.value || 0,
      subIndicators: [
        {
          name: 'Stock vs Target',
          value: 0.85,
          target: undefined,
          unit: 'ratio',
          description: 'Current resource stock divided by target stock',
          trend: [0.82, 0.83, 0.84, 0.85, 0.85]
        },
        {
          name: 'Renewal vs Consumption',
          value: 1.1,
          target: undefined,
          unit: 'ratio',
          description: 'Renewal rate divided by consumption rate',
          trend: [1.05, 1.07, 1.08, 1.1, 1.1]
        },
        {
          name: 'Extraction Pressure',
          value: 0.25,
          target: undefined,
          unit: 'ratio',
          description: 'Extraction flow divided by total resource stock',
          trend: [0.28, 0.27, 0.26, 0.25, 0.25]
        },
        {
          name: 'Smoothed Price',
          value: 245.6,
          target: undefined,
          unit: 'AED',
          description: '12-month moving average of unit price',
          trend: [250.2, 248.1, 246.8, 245.6, 245.6]
        }
      ]
    },
    goods: {
      name: t('productsServicesMarket'),
      value: safeMetrics.pillars?.goods?.value || 0,
      subIndicators: [
        {
          name: 'Supply-Demand Gap',
          value: 0.05,
          target: undefined,
          unit: 'normalized',
          description: 'Normalized gap between supply and demand',
          trend: [0.08, 0.07, 0.06, 0.05, 0.05]
        },
        {
          name: 'Price Deviation',
          value: -0.03,
          target: undefined,
          unit: '%',
          description: 'Deviation from target price as percentage',
          trend: [-0.05, -0.04, -0.03, -0.03, -0.03]
        },
        {
          name: 'Capacity Utilization',
          value: 0.78,
          target: undefined,
          unit: 'ratio',
          description: 'Weighted average of output to maximum capacity',
          trend: [0.75, 0.76, 0.77, 0.78, 0.78]
        }
      ]
    },
    social: {
      name: t('socialOutcomes'),
      value: safeMetrics.pillars?.social?.value || 0,
      subIndicators: [
        {
          name: 'Employment Rate',
          value: 74.2,
          target: undefined,
          unit: '%',
          description: 'Percentage of working-age population employed',
          trend: [72.8, 73.2, 73.8, 74.2, 74.2]
        },
        {
          name: 'Education Completion',
          value: 88.5,
          target: undefined,
          unit: '%',
          description: 'Percentage completing secondary education',
          trend: [87.1, 87.8, 88.2, 88.5, 88.5]
        },
        {
          name: 'Health Index',
          value: 82.1,
          target: undefined,
          unit: 'index',
          description: 'Composite health status indicator',
          trend: [80.5, 81.2, 81.8, 82.1, 82.1]
        },
        {
          name: 'Living Conditions',
          value: 76.3,
          target: undefined,
          unit: 'index',
          description: 'Household consumption and living standards',
          trend: [74.8, 75.5, 76.0, 76.3, 76.3]
        },
        {
          name: 'Household Revenue',
          value: 12450,
          target: undefined,
          unit: 'AED',
          description: 'Average monthly household income',
          trend: [12100, 12250, 12350, 12450, 12450]
        },
        {
          name: 'Environmental Quality',
          value: 68.7,
          target: undefined,
          unit: 'index',
          description: 'Environmental quality index',
          trend: [67.2, 67.8, 68.3, 68.7, 68.7]
        }
      ]
    }
  };

  const handleIndicatorClick = (pillar: string, indicator: SubIndicator) => {
    setSelectedIndicator({ pillar, indicator });
  };

  const handleTargetSave = (target: number) => {
    if (selectedIndicator) {
      // Update the indicator with the new target
      const pillarKey = selectedIndicator.pillar as keyof typeof enhancedPillars;
      const indicator = enhancedPillars[pillarKey].subIndicators.find(
        ind => ind.name === selectedIndicator.indicator.name
      );
      
      if (indicator) {
        indicator.target = target;
        
        // Track pillars with targets
        if (!pillarsWithTargets.includes(selectedIndicator.pillar)) {
          setPillarsWithTargets([...pillarsWithTargets, selectedIndicator.pillar]);
        }
        
        setHasTargets(true);
        
        toast({
          title: t('targetSet'),
          description: `${t('newTargetFor')} ${indicator.name}: ${target}`,
          duration: 3000,
        });
      }
    }
    setSelectedIndicator(null);
  };

  const handleApplyTargets = () => {
    // In a real app, this would recalculate the DEI metrics
    toast({
      title: t('targetsApplied'),
      description: t('deiMetricsRecalculated'),
      duration: 3000,
    });
    
    // Simulate triggering loop analysis
    toast({
      title: t('loopAnalysisTriggered'),
      description: t('checkLoopAnalysisTab'),
      duration: 5000,
    });
  };

  const handlePromoteToAct = (objectives: string[]) => {
    toast({
      title: t('objectivesPromoted'),
      description: t('checkStrategyBuilder'),
      duration: 3000,
    });
  };

  const handleAdjustLever = (lever: string) => {
    // Switch to simulation tab and highlight the relevant slider
    setActiveView('simulation');
    toast({
      title: t('navigatingToSimulation'),
      description: `${t('adjusting')} ${lever}`,
      duration: 2000,
    });
  };

  return (
    <GlassCard className="p-6 dei-foresight-hub" data-demo="foresight-panel">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 mr-3">
            <BarChart3 size={20} />
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            {t("deiAndForesightHub").toUpperCase()}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {hasTargets && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-teal-500/20 text-teal-400">
                {pillarsWithTargets.length} {t('targetsSet')}
              </Badge>
              <Button
                onClick={handleApplyTargets}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                size="sm"
                data-demo="strategy-builder"
              >
                <Target size={16} className="mr-1" />
                {t('applyTargets')}
              </Button>
            </div>
          )}
          
          <div className="bg-white/5 backdrop-blur-sm rounded-full p-1">
            <Tabs 
              value={activeView} 
              onValueChange={(v) => setActiveView(v as 'overview' | 'simulation' | 'loopAnalysis')}
              className="w-full"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger 
                  value="overview" 
                  className={`rounded-full px-4 py-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
                >
                  <Layout className="mr-2 h-4 w-4" />
                  {t("overview").toUpperCase()}
                </TabsTrigger>
                <TabsTrigger 
                  value="simulation" 
                  className={`rounded-full px-4 py-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {t("simulation").toUpperCase()}
                </TabsTrigger>
                <TabsTrigger 
                  value="loopAnalysis" 
                  className={`rounded-full px-4 py-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
                  data-demo="sna-tab"
                  data-value="loopAnalysis"
                >
                  <Network className="mr-2 h-4 w-4" data-demo="sna-tab" />
                  {t("loopAnalysis").toUpperCase()}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      {activeView === 'overview' ? (
        <div>
          {/* Overall DEI Indicator */}
          <div className="flex justify-center mb-8">
            <OverallDeiIndicator 
              value={safeMetrics.overall} 
              minBand={safeMetrics.equilibriumBands?.overall?.min || 0} 
              maxBand={safeMetrics.equilibriumBands?.overall?.max || 100}
              pillars={safeMetrics.pillars}
              equilibriumBands={safeMetrics.equilibriumBands}
            />
          </div>
          
          {/* Enhanced Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.entries(enhancedPillars).map(([key, pillar]) => (
              <EnhancedPillarCard
                key={key}
                pillarKey={key}
                pillar={pillar}
                onIndicatorClick={handleIndicatorClick}
                hasTargets={pillarsWithTargets.includes(key)}
              />
            ))}
          </div>
          
          {/* DEI Foresight Tab */}
          <DeiForesightTab metrics={safeMetrics} scenarios={scenarios} />
        </div>
      ) : activeView === 'simulation' ? (
        <EnhancedSimulationTab 
          metrics={safeMetrics} 
          scenarios={scenarios}
          pillars={enhancedPillars}
          onSaveScenario={onSaveScenario}
          onSelectScenario={onSelectScenario}
        />
      ) : (
        <div data-demo="loop-analysis">
          <LoopAnalysisTab 
            hasTargets={hasTargets}
            onPromoteToAct={handlePromoteToAct}
            onAdjustLever={handleAdjustLever}
          />
        </div>
      )}
      
      {/* Target Setting Modal */}
      {selectedIndicator && (
        <TargetSettingModal
          open={!!selectedIndicator}
          onOpenChange={() => setSelectedIndicator(null)}
          indicator={selectedIndicator.indicator}
          pillarName={selectedIndicator.pillar}
          onSave={handleTargetSave}
        />
      )}
    </GlassCard>
  );
};

export default DeiAndForesightHub;
