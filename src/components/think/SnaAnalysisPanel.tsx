
import React, { useRef, useState } from 'react';
import { Network, Filter, GitBranch, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard, GlassCardTitle } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NetworkView from './components/NetworkView';
import { SNAData, Actor, ExecutionPathway } from './types/sna-types';
import SensitivityTab from './SensitivityTab';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Tooltip } from '@/components/ui/tooltip';

interface SnaAnalysisPanelProps {
  snaData: SNAData;
  onHighlightActors?: (actorIds: string[]) => void;
}

const SnaAnalysisPanel: React.FC<SnaAnalysisPanelProps> = ({ snaData, onHighlightActors }) => {
  const { t, isRTL } = useTranslation();
  const [selectedActorType, setSelectedActorType] = useState<string>('all');
  const [selectedBottleneck, setSelectedBottleneck] = useState<string | null>(null);
  const cyRef = useRef<any>(null);
  
  // Prepare filtered data based on actor type selection
  const filteredNodes = selectedActorType === 'all'
    ? snaData.nodes
    : snaData.nodes.filter(node => node.type === selectedActorType);
  
  // Filter edges to only include connections between filtered nodes
  const filteredEdges = snaData.edges.filter(edge => {
    const sourceInFilter = filteredNodes.some(node => node.id === edge.source);
    const targetInFilter = filteredNodes.some(node => node.id === edge.target);
    return sourceInFilter && targetInFilter;
  });
  
  // Calculate top actors by degree centrality (influence)
  const topActors = [...snaData.nodes]
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 5);
  
  // Calculate bottlenecks (high betweenness centrality)
  const bottlenecks = [...snaData.nodes]
    .sort((a, b) => b.betweenness - a.betweenness)
    .slice(0, 3);
  
  const handleNodeClick = (nodeId: string) => {
    // Find the clicked node
    const node = snaData.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Find all connected nodes (direct connections)
    const connectedEdges = snaData.edges.filter(
      edge => edge.source === nodeId || edge.target === nodeId
    );
    
    const connectedNodeIds = new Set<string>();
    connectedEdges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });
    
    // Highlight the network
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.elements().removeClass('highlighted faded');
      
      // Fade all nodes and edges
      cy.elements().addClass('faded');
      
      // Highlight connected nodes and edges
      connectedNodeIds.forEach(id => {
        cy.$id(id).removeClass('faded').addClass('highlighted');
      });
      
      connectedEdges.forEach((edge, i) => {
        cy.$id(`e${i}`).removeClass('faded').addClass('highlighted');
      });
    }
    
    toast({
      title: `${t('actor')}: ${node.label}`,
      description: `${t('degree')}: ${node.degree}, ${t('betweenness')}: ${Math.round(node.betweenness * 100) / 100}`,
      duration: 3000,
    });
  };
  
  const handleViewBottleneck = (actorId: string) => {
    setSelectedBottleneck(actorId);
    
    // Find all paths going through this bottleneck
    const pathsThroughBottleneck = snaData.edges.filter(
      edge => edge.source === actorId || edge.target === actorId
    );
    
    // Highlight the network
    if (cyRef.current) {
      const cy = cyRef.current;
      cy.elements().removeClass('highlighted faded');
      
      // Fade all nodes and edges
      cy.elements().addClass('faded');
      
      // Highlight the bottleneck node
      cy.$id(actorId).removeClass('faded').addClass('highlighted');
      
      // Highlight connected nodes and edges
      pathsThroughBottleneck.forEach((edge, i) => {
        cy.$id(edge.source).removeClass('faded').addClass('highlighted');
        cy.$id(edge.target).removeClass('faded').addClass('highlighted');
        cy.$id(`e${i}`).removeClass('faded').addClass('highlighted');
      });
      
      // Center on the bottleneck
      cy.center(cy.$id(actorId));
      cy.zoom({
        level: 1.5,
        position: cy.$id(actorId).position()
      });
    }
    
    // If onHighlightActors callback is provided, call it
    if (onHighlightActors) {
      const connectedIds = new Set<string>();
      connectedIds.add(actorId);
      
      pathsThroughBottleneck.forEach(edge => {
        connectedIds.add(edge.source);
        connectedIds.add(edge.target);
      });
      
      onHighlightActors(Array.from(connectedIds));
    }
  };
  
  return (
    <GlassCard className="p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 mr-3">
            <Network size={20} />
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-500">
            {t("snaAnalysisTitle")}
          </h2>
        </div>
        
        <div className="flex space-x-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-full p-1">
            <Tabs 
              value={selectedActorType} 
              onValueChange={setSelectedActorType}
              className="w-full"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger 
                  value="all" 
                  className={`rounded-full px-3 py-1 text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400`}
                >
                  {t("all")}
                </TabsTrigger>
                <TabsTrigger 
                  value="government" 
                  className={`rounded-full px-3 py-1 text-xs data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
                >
                  {t("government")}
                </TabsTrigger>
                <TabsTrigger 
                  value="private" 
                  className={`rounded-full px-3 py-1 text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400`}
                >
                  {t("private")}
                </TabsTrigger>
                <TabsTrigger 
                  value="ngo" 
                  className={`rounded-full px-3 py-1 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400`}
                >
                  {t("ngo")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center">
            <GitBranch className="mr-1 h-4 w-4" />
            {t("highlightPathways")}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network visualization - 2/3 width */}
        <div className="lg:col-span-2 glass-panel-dark rounded-xl overflow-hidden border border-white/10 min-h-[350px] flex items-center justify-center">
          {snaData.nodes.length > 0 ? (
            <div className="w-full h-80">
              <NetworkView
                nodes={filteredNodes}
                edges={filteredEdges}
                onNodeClick={handleNodeClick}
                cyRef={cyRef}
              />
            </div>
          ) : (
            <div className="text-center text-gray-400 p-12">
              <Network size={48} className="mx-auto mb-4 opacity-30" />
              <h3 className="font-medium mb-2">{t("noSnaData")}</h3>
              <p className="text-sm">{t("snaDataDescription")}</p>
            </div>
          )}
        </div>
        
        {/* Metrics and analysis - 1/3 width */}
        <div className="lg:col-span-1 space-y-4">
          {/* Top influencers */}
          <div className="glass-panel-dark rounded-xl p-4 border border-white/10">
            <h3 className="font-medium mb-3 text-purple-300">{t("topInfluencers")}</h3>
            <div className="space-y-2">
              {topActors.map((actor, index) => (
                <div key={actor.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-xs bg-white/10 rounded-full w-5 h-5 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    <span>{actor.label}</span>
                  </div>
                  <Badge variant="outline" className={`
                    ${actor.type === 'government' ? 'border-teal-500/50 text-teal-400' : ''}
                    ${actor.type === 'private' ? 'border-blue-500/50 text-blue-400' : ''}
                    ${actor.type === 'ngo' ? 'border-amber-500/50 text-amber-400' : ''}
                    ${actor.type === 'academic' ? 'border-purple-500/50 text-purple-400' : ''}
                  `}>
                    {t(actor.type)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          {/* Network metrics */}
          <div className="glass-panel-dark rounded-xl p-4 border border-white/10">
            <h3 className="font-medium mb-3 text-blue-300">{t("networkMetrics")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400">{t("density")}</p>
                <p className="text-lg font-medium">
                  {(snaData.metrics?.density || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t("clustering")}</p>
                <p className="text-lg font-medium">
                  {(snaData.metrics?.avgClustering || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t("avgPathLength")}</p>
                <p className="text-lg font-medium">
                  {(snaData.metrics?.avgPathLength || 0).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">{t("centralization")}</p>
                <p className="text-lg font-medium">
                  {(snaData.metrics?.centralization || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Bottlenecks */}
          <div className="glass-panel-dark rounded-xl p-4 border border-white/10">
            <h3 className="font-medium mb-3 text-amber-300">{t("bottlenecks")}</h3>
            <div className="space-y-2">
              {bottlenecks.map((actor) => (
                <div key={actor.id} 
                  className={`flex justify-between items-center p-2 rounded-lg ${
                    selectedBottleneck === actor.id ? 'bg-white/10' : ''
                  }`}
                >
                  <div>
                    <p className="font-medium">{actor.label}</p>
                    <p className="text-xs text-gray-400">
                      {t("betweenness")}: {actor.betweenness.toFixed(2)}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs"
                    onClick={() => handleViewBottleneck(actor.id)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {t("viewInMap")}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SnaAnalysisPanel;
