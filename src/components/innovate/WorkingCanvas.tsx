
import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Archive, Rocket } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TriggerPanel } from './enhanced/TriggerPanel';
import { StepBar } from './enhanced/StepBar';
import { UnifiedCanvas } from './enhanced/UnifiedCanvas';
import { ScenarioForkSimulationPanel } from './enhanced/ScenarioForkSimulationPanel';
import { KeyInsightCard } from './enhanced/KeyInsightCard';
import { ResultsInnovationTools } from './revolutionary/ResultsInnovationTools';

interface ConceptBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  type: string;
}

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

interface WorkingCanvasProps {
  selectedItem: ConceptBlock | ScenarioForkData | null;
  onClose: () => void;
}

export const WorkingCanvas: React.FC<WorkingCanvasProps> = ({ selectedItem, onClose }) => {
  const { t, isRTL } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1); // Start at sketch
  const [activeTrigger, setActiveTrigger] = useState<'learn' | 'monitor' | 'freeform' | null>('freeform');
  const [canvasViewMode, setCanvasViewMode] = useState<'cld' | 'sna'>('cld');
  const [overlayMode, setOverlayMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [activeResultsTab, setActiveResultsTab] = useState('impact');

  // Mock data for trigger notifications
  const [learnPatterns] = useState(2);
  const [monitorAlerts] = useState(1);

  // Timer for simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerateSimulation = () => {
    setIsGenerating(true);
    setElapsedTime(0);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setCurrentStep(3); // Jump to results
    }, 3000);
  };

  const getItemName = (item: ConceptBlock | ScenarioForkData | null): string => {
    if (!item) return 'System Redesign';
    return item.name;
  };

  const mockInsights = [
    {
      type: 'opportunity' as const,
      title: 'Leverage Point Detected',
      description: 'Self-organizing feedback loop identified in youth engagement',
      confidence: 87
    },
    {
      type: 'risk' as const,
      title: 'System Delay Warning',
      description: 'Policy implementation lag may reduce intervention effectiveness',
      confidence: 73
    }
  ];

  const enhancedTabs = [
    { id: 'impact', label: t('impact') },
    { id: 'blueprint', label: t('blueprint') },
    { id: 'compare', label: t('compare') },
    { id: 'co-create', label: t('coCreate') },
    { id: 'ensemble', label: t('ensemble') },
    { id: 'breakpoints', label: t('breakpoints') },
    { id: 'pathways', label: t('pathways') }
  ];

  return (
    <motion.div
      className="h-full w-full glass-panel overflow-hidden flex flex-col relative"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Step Bar */}
      <StepBar currentStep={currentStep} onStepChange={setCurrentStep} />

      {/* Header */}
      <div className="flex-none p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{getItemName(selectedItem)}</h2>
            <span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-300">
              {t('systemRedesign')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Feed-Forward Controls */}
            <Button 
              size="sm" 
              variant="outline"
              disabled={!isGenerated}
              className={`flex items-center gap-2 ${
                isGenerated ? 'hover:bg-purple-500/20' : 'opacity-50'
              }`}
            >
              <Rocket size={16} />
              <span className="hidden sm:inline">{t('promoteToStrategy')}</span>
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Archive size={16} />
              <span className="hidden sm:inline">{t('archiveToLearn')}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Trigger Panel */}
      <div className="flex-none px-4">
        <TriggerPanel
          activeTrigger={activeTrigger}
          onTriggerSelect={setActiveTrigger}
          learnPatterns={learnPatterns}
          monitorAlerts={monitorAlerts}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 p-4 gap-4">
        {/* Unified Canvas - Top ¾ */}
        <div className="h-3/4">
          <UnifiedCanvas
            viewMode={canvasViewMode}
            onViewModeChange={setCanvasViewMode}
            overlayMode={overlayMode}
            onOverlayToggle={() => setOverlayMode(!overlayMode)}
          />
        </div>

        {/* Bottom Section - ¼ */}
        <div className="h-1/4 flex flex-col gap-4">
          {/* Scenario Fork + Simulation Panel */}
          <ScenarioForkSimulationPanel
            onGenerateSimulation={handleGenerateSimulation}
            isGenerating={isGenerating}
            elapsedTime={elapsedTime}
          />

          {/* Results Section */}
          {isGenerated && (
            <div className="glass-panel">
              {/* Key Insight Card */}
              <KeyInsightCard insights={mockInsights} />

              {/* Enhanced Results Tabs */}
              <Tabs value={activeResultsTab} onValueChange={setActiveResultsTab}>
                <TabsList className="grid grid-cols-7 glass-panel-deep m-4 mb-0">
                  {enhancedTabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="text-xs data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="p-4 h-64 overflow-hidden">
                  {enhancedTabs.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="h-full m-0">
                      {tab.id === 'ensemble' ? (
                        <EnsembleContent />
                      ) : tab.id === 'breakpoints' ? (
                        <BreakpointsContent />
                      ) : tab.id === 'pathways' ? (
                        <PathwaysContent />
                      ) : (
                        <ResultsInnovationTools
                          showResults={isGenerated}
                          engine="system-dynamics"
                          activeTab={tab.id}
                          selectedBlock={selectedItem && 'type' in selectedItem ? selectedItem : undefined}
                          selectedFork={selectedItem && 'active' in selectedItem ? selectedItem : undefined}
                        />
                      )}
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// New tab components for enhanced functionality
const EnsembleContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">{t('monteCarloEnsemble')}</div>
        <div className="text-sm text-muted-foreground">
          Histogram of 1000 simulation outcomes
        </div>
      </div>
    </div>
  );
};

const BreakpointsContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-full p-4">
      <div className="text-sm font-medium mb-3">{t('systemBreakpoints')}</div>
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
          <span className="text-sm">Trust threshold</span>
          <span className="text-sm text-amber-400">72%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
          <span className="text-sm">Engagement saturation</span>
          <span className="text-sm text-red-400">85%</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
          <span className="text-sm">Resource constraint</span>
          <span className="text-sm text-orange-400">$2.3M</span>
        </div>
      </div>
    </div>
  );
};

const PathwaysContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-full p-4">
      <div className="text-sm font-medium mb-3">{t('executionPathways')}</div>
      <div className="space-y-3">
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="font-medium text-sm text-green-400">Path 1: Community-First</div>
          <div className="text-xs text-muted-foreground mt-1">
            Start with grassroots → Build trust → Scale programs
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="font-medium text-sm text-blue-400">Path 2: Policy-Led</div>
          <div className="text-xs text-muted-foreground mt-1">
            Establish framework → Deploy resources → Monitor outcomes
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="font-medium text-sm text-purple-400">Path 3: Hybrid Approach</div>
          <div className="text-xs text-muted-foreground mt-1">
            Parallel tracks → Convergence point → Amplified impact
          </div>
        </div>
      </div>
    </div>
  );
};
