
import React, { useState } from 'react';
import { Network, Users, GitCommit, Filter } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/glass-card';
import NetworkView from '@/components/think/components/NetworkView';
import { SNAData } from '@/components/think/types/sna-types';
import SnaAnalysisTab from '@/components/think/SnaAnalysisTab';

interface SnaAnalysisPanelProps {
  snaData: SNAData;
  onHighlightActors: (actorIds: string[]) => void;
}

const SnaAnalysisPanel: React.FC<SnaAnalysisPanelProps> = ({ snaData, onHighlightActors }) => {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<'network' | 'metrics'>('network');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onHighlightActors([nodeId]);
  };

  const handleFilterChange = (type: string | null) => {
    setFilterType(type);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 mr-3">
            <Network size={20} />
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            {t("snaAnalysis").toUpperCase()}
          </h2>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-full p-1">
          <Tabs 
            value={activeView} 
            onValueChange={(v) => setActiveView(v as 'network' | 'metrics')}
            className="w-full"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="network" 
                className={`rounded-full px-4 py-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
              >
                <Network className="mr-2 h-4 w-4" />
                {t("networkView").toUpperCase()}
              </TabsTrigger>
              <TabsTrigger 
                value="metrics" 
                className={`rounded-full px-4 py-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
              >
                <GitCommit className="mr-2 h-4 w-4" />
                {t("metrics").toUpperCase()}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {activeView === 'network' ? (
        <NetworkView 
          nodes={snaData.nodes}
          edges={snaData.edges}
          onNodeClick={handleNodeClick}
          highlightedActors={selectedNode ? [selectedNode] : []}
        />
      ) : (
        <SnaAnalysisTab metrics={snaData.metrics} />
      )}
    </GlassCard>
  );
};

export default SnaAnalysisPanel;
