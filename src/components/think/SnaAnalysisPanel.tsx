
import React, { useState, useRef } from 'react';
import { Network, Users, GitCommit, Filter } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
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
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const cyRef = useRef<any>(null);

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
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Network visualization - takes 60% of the width on large screens */}
        <div className="lg:w-3/5 h-[500px]">
          <div className="bg-navy-800/30 rounded-xl overflow-hidden border border-white/10 h-full">
            <NetworkView 
              nodes={snaData.nodes}
              edges={snaData.edges}
              onNodeClick={handleNodeClick}
              highlightedActors={selectedNode ? [selectedNode] : []}
              cyRef={cyRef}
            />
          </div>
        </div>
        
        {/* Metrics section - takes 40% of the width on large screens */}
        <div className="lg:w-2/5 h-[500px]">
          <div className="bg-navy-800/30 rounded-xl overflow-hidden border border-white/10 h-full p-4">
            <SnaAnalysisTab metrics={snaData.metrics} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SnaAnalysisPanel;
