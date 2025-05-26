
import React, { useState } from 'react';
import { X, Pencil, Play, BarChart3, BookOpen, Radar, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CLDSketchCanvas } from './revolutionary/CLDSketchCanvas';
import { RequestSimulationPanel } from './revolutionary/RequestSimulationPanel';
import { ResultsInnovationTools } from './revolutionary/ResultsInnovationTools';
import { ComparativeInnovationDashboard } from './revolutionary/ComparativeInnovationDashboard';
import { CoCreationForum } from './revolutionary/CoCreationForum';

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
  const [activeTab, setActiveTab] = useState('sketch');
  const [engineMode, setEngineMode] = useState('system-dynamics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGenerateSimulation = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setShowResults(true);
    }, 2000);
  };

  const itemTitle = selectedItem ? 
    ('name' in selectedItem ? selectedItem.name : selectedItem.name) : 
    'System Redesign';

  const itemType = selectedItem ? 
    ('type' in selectedItem ? selectedItem.type : 'Scenario') : 
    '';

  const tabs = [
    { id: 'sketch', label: t('sketch'), icon: <Pencil size={16} /> },
    { id: 'simulate', label: t('simulate'), icon: <Play size={16} /> },
    { id: 'results', label: t('results'), icon: <BarChart3 size={16} /> },
    { id: 'blueprint', label: t('blueprint'), icon: <BookOpen size={16} /> },
    { id: 'compare', label: t('compare'), icon: <Radar size={16} /> },
    { id: 'co-create', label: t('coCreate'), icon: <Users size={16} /> }
  ];

  return (
    <motion.div
      className="h-full w-full glass-panel overflow-hidden flex flex-col"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex-none p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{itemTitle}</h2>
            {itemType && (
              <span className="text-xs px-2 py-1 rounded bg-teal-500/20 text-teal-300">
                {itemType}
              </span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <span>Home</span>
          <span>›</span>
          <span>System Redesign</span>
          <span>›</span>
          <span>{itemTitle}</span>
          <span>›</span>
          <span className="capitalize">{tabs.find(tab => tab.id === activeTab)?.label}</span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 glass-panel m-0 rounded-none border-b border-white/10">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <div className="flex-1 min-h-0 h-[calc(100vh-12rem)]">
            <TabsContent value="sketch" className="h-full m-0">
              <CLDSketchCanvas 
                mode="moonshot" 
                selectedBlock={'type' in selectedItem ? selectedItem : undefined}
                selectedFork={'active' in selectedItem ? selectedItem : undefined}
              />
            </TabsContent>

            <TabsContent value="simulate" className="h-full m-0 p-4">
              <RequestSimulationPanel
                engineMode={engineMode}
                setEngineMode={setEngineMode}
                onGenerateSimulation={handleGenerateSimulation}
                isGenerating={isGenerating}
                isGenerated={isGenerated}
              />
            </TabsContent>

            <TabsContent value="results" className="h-full m-0">
              <ResultsInnovationTools
                showResults={showResults}
                engine={engineMode}
                activeTab="impact"
                selectedBlock={'type' in selectedItem ? selectedItem : undefined}
                selectedFork={'active' in selectedItem ? selectedItem : undefined}
              />
            </TabsContent>

            <TabsContent value="blueprint" className="h-full m-0">
              <ResultsInnovationTools
                showResults={showResults}
                engine={engineMode}
                activeTab="blueprint"
                selectedBlock={'type' in selectedItem ? selectedItem : undefined}
                selectedFork={'active' in selectedItem ? selectedItem : undefined}
              />
            </TabsContent>

            <TabsContent value="compare" className="h-full m-0 p-4">
              <ComparativeInnovationDashboard />
            </TabsContent>

            <TabsContent value="co-create" className="h-full m-0 p-4">
              <CoCreationForum />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};
