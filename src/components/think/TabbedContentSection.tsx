
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Network, GitBranch } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DeiAndForesightHub from './DeiAndForesightHub';
import SnaAnalysisPanel from './SnaAnalysisPanel';
import StrategyBuilder from './StrategyBuilder';
import ExecutionPathwayPanel from './ExecutionPathwayPanel';
import { SNAData, ExecutionPathway } from './types/sna-types';

interface TabbedContentSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentMetrics: any;
  scenarios: any[];
  onSaveScenario: (scenario: any) => void;
  onSelectScenario: (id: number) => void;
  mockSnaData: SNAData;
  onHighlightActors: (actorIds: string[]) => void;
  mockSensitivity: any[];
  mockExecutionImpact: any;
  onStrategyBuilderCompute: (approach: string, objectiveIds?: number[]) => void;
  pathways: ExecutionPathway[];
  onAdoptPathway: (pathway: ExecutionPathway) => void;
}

const TabbedContentSection: React.FC<TabbedContentSectionProps> = ({
  activeTab,
  setActiveTab,
  currentMetrics,
  scenarios,
  onSaveScenario,
  onSelectScenario,
  mockSnaData,
  onHighlightActors,
  mockSensitivity,
  mockExecutionImpact,
  onStrategyBuilderCompute,
  pathways,
  onAdoptPathway
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <TabsList className="w-full backdrop-blur-[24px] rounded-2xl p-2 mb-8 flex justify-center border border-white/20"
            style={{
              background: 'rgba(20, 30, 50, 0.4)',
              boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
            }}
          >
            <TabsTrigger 
              value="dei" 
              className="rounded-xl px-6 py-3 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 transition-all duration-300 hover:bg-teal-500/10"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              {t("deiAndForesight").toUpperCase()}
            </TabsTrigger>
            <TabsTrigger 
              value="sna" 
              className="rounded-xl px-6 py-3 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 transition-all duration-300 hover:bg-purple-500/10"
            >
              <Network className="mr-2 h-5 w-5" />
              {t("snaAnalysis").toUpperCase()}
            </TabsTrigger>
            <TabsTrigger 
              value="strategy" 
              className="rounded-xl px-6 py-3 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 transition-all duration-300 hover:bg-blue-500/10"
            >
              <GitBranch className="mr-2 h-5 w-5" />
              {t("strategyBuilder").toUpperCase()}
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* DEI & Foresight Hub */}
        <TabsContent value="dei" className="mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <DeiAndForesightHub 
              metrics={currentMetrics}
              scenarios={scenarios}
              onSaveScenario={onSaveScenario}
              onSelectScenario={onSelectScenario}
            />
          </motion.div>
        </TabsContent>
        
        {/* SNA Analysis Panel */}
        <TabsContent value="sna" className="mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <SnaAnalysisPanel 
              snaData={mockSnaData}
              onHighlightActors={onHighlightActors}
            />
          </motion.div>
        </TabsContent>
        
        {/* Strategy Builder */}
        <TabsContent value="strategy" className="mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden p-8"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <motion.h2 
              className="text-2xl font-bold mb-6 text-left flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GitBranch className="mr-3 text-blue-400" size={24} />
              {t("strategyBuilder").toUpperCase()}
            </motion.h2>
            <StrategyBuilder 
              sensitivityParameters={mockSensitivity} 
              executionImpact={mockExecutionImpact}
              onCompute={onStrategyBuilderCompute}
            />
            
            {/* SNA-Driven Execution Pathways */}
            <ExecutionPathwayPanel 
              pathways={pathways} 
              onHighlightPathway={onHighlightActors}
              onAdoptPathway={onAdoptPathway}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TabbedContentSection;
