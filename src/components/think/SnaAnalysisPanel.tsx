
import React, { useState, useRef } from 'react';
import { Network, Users, GitCommit, Filter, AlertTriangle, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import NetworkView from '@/components/think/components/NetworkView';
import { SNAData, Actor } from '@/components/think/types/sna-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import NetworkTooltip from '@/components/think/components/NetworkTooltip';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SnaAnalysisPanelProps {
  snaData: SNAData;
  onHighlightActors: (actorIds: string[]) => void;
}

const SnaAnalysisPanel: React.FC<SnaAnalysisPanelProps> = ({ snaData, onHighlightActors }) => {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showPathways, setShowPathways] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{ x: number; y: number; data: any; type: 'node' | 'edge' } | null>(null);
  const cyRef = useRef<any>(null);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onHighlightActors([nodeId]);
  };

  // Sort actors by centrality metrics for the panel displays
  const actorsByDegree = [...snaData.nodes].sort((a, b) => b.degree - a.degree).slice(0, 5);
  const actorsByBetweenness = [...snaData.nodes].sort((a, b) => b.betweenness - a.betweenness).slice(0, 5);
  
  // Check for bottlenecks (actors with high centrality)
  const bottlenecks = snaData.nodes.filter(node => node.betweenness > 0.3 || node.degree > 6);
  
  // Mock execution pathways for the preview
  const executionPathways = [
    {
      id: "path1",
      name: "Policy Reform Chain",
      actors: ["MOF", "MOE", "EAD"],
      timeEstimate: 4
    },
    {
      id: "path2",
      name: "Implementation Chain",
      actors: ["ADNOC", "EDB", "UAEU"],
      timeEstimate: 6
    },
    {
      id: "path3",
      name: "Monitoring Chain",
      actors: ["EAD", "DMT", "RTA"],
      timeEstimate: 3
    }
  ];

  // Handle hover events for tooltips
  const handleNodeHover = (event: any) => {
    const node = event.target;
    const position = node.renderedPosition();
    const nodeData = snaData.nodes.find(n => n.id === node.id());
    
    if (nodeData) {
      setTooltipContent({
        x: position.x,
        y: position.y,
        data: nodeData,
        type: 'node'
      });
    }
  };
  
  const handleEdgeHover = (event: any) => {
    const edge = event.target;
    const position = {
      x: (edge.sourceEndpoint().x + edge.targetEndpoint().x) / 2,
      y: (edge.sourceEndpoint().y + edge.targetEndpoint().y) / 2
    };
    
    const sourceId = edge.data('source');
    const targetId = edge.data('target');
    const edgeData = snaData.edges.find(e => 
      e.source === sourceId && e.target === targetId
    );
    
    if (edgeData) {
      setTooltipContent({
        x: position.x,
        y: position.y,
        data: edgeData,
        type: 'edge'
      });
    }
  };
  
  const handleMouseOut = () => {
    setTooltipContent(null);
  };
  
  const handleAdoptPathway = (pathwayId: string) => {
    // In a real application, this would trigger the creation of a delivery bundle
    console.log(`Adopting pathway: ${pathwayId}`);
    
    // Find the pathway's actors and highlight them
    const pathway = executionPathways.find(p => p.id === pathwayId);
    if (pathway) {
      onHighlightActors(pathway.actors);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 mr-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Network size={24} />
          </motion.div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-500">
            {t("snaAnalysis").toUpperCase()}
          </h2>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-sm text-gray-400">Show Execution Pathways</span>
          <Switch
            checked={showPathways}
            onCheckedChange={setShowPathways}
            className="data-[state=checked]:bg-purple-500"
          />
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Enhanced Interactive Network Map */}
        <motion.div 
          className="lg:w-3/5 h-[500px] relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div 
            className="rounded-2xl overflow-hidden border border-white/20 h-full relative"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl"></div>
            <NetworkView 
              nodes={snaData.nodes}
              edges={snaData.edges}
              onNodeClick={handleNodeClick}
              highlightedActors={selectedNode ? [selectedNode] : []}
              cyRef={cyRef}
              onNodeHover={handleNodeHover}
              onEdgeHover={handleEdgeHover}
              onMouseOut={handleMouseOut}
            />
          </div>
          
          {/* Enhanced floating tooltip */}
          <AnimatePresence>
            {tooltipContent && (
              <motion.div 
                className="absolute pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
                style={{ 
                  left: tooltipContent.x, 
                  top: tooltipContent.y - 10
                }}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <NetworkTooltip data={tooltipContent.data} type={tooltipContent.type} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Enhanced Metrics summary panel */}
        <motion.div 
          className="lg:w-2/5 h-[500px] overflow-y-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Enhanced Top Actors by Degree Card */}
            <motion.div 
              className="backdrop-blur-[20px] border border-white/20 rounded-2xl p-6"
              style={{
                background: 'rgba(139, 69, 199, 0.1)',
                boxShadow: 'inset 0 0 20px rgba(139, 69, 199, 0.1)'
              }}
              whileHover={{ scale: 1.02, boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 
                className="text-lg font-semibold text-white mb-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Users size={18} className="mr-3 text-purple-400" />
                Top Actors by Influence (Degree)
              </motion.h3>
              <div className="space-y-3">
                {actorsByDegree.map((actor, index) => (
                  <motion.div 
                    key={actor.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => handleNodeClick(actor.id)}
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-gray-400 font-semibold">{index + 1}.</span>
                      <span className="font-medium">{actor.label}</span>
                      <Badge variant="outline" className="ml-3 text-xs capitalize border-purple-500/30">{actor.type}</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-white/10 h-2 rounded-full mr-3 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(actor.degree / 10) * 100}%` }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                        ></motion.div>
                      </div>
                      <span className="text-sm font-semibold">{actor.degree}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Enhanced Top Actors by Betweenness Card */}
            <motion.div 
              className="backdrop-blur-[20px] border border-white/20 rounded-2xl p-6"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.1)'
              }}
              whileHover={{ scale: 1.02, boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 
                className="text-lg font-semibold text-white mb-4 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <GitCommit size={18} className="mr-3 text-blue-400" />
                Top Brokers (Betweenness)
              </motion.h3>
              <div className="space-y-3">
                {actorsByBetweenness.map((actor, index) => (
                  <motion.div 
                    key={actor.id} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => handleNodeClick(actor.id)}
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-gray-400 font-semibold">{index + 1}.</span>
                      <span className="font-medium">{actor.label}</span>
                      <Badge variant="outline" className="ml-3 text-xs capitalize border-blue-500/30">{actor.type}</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-white/10 h-2 rounded-full mr-3 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                          initial={{ width: 0 }}
                          animate={{ width: `${actor.betweenness * 100}%` }}
                          transition={{ delay: 1.0 + index * 0.1, duration: 0.8 }}
                        ></motion.div>
                      </div>
                      <span className="text-sm font-semibold">{actor.betweenness.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Enhanced Network Metrics Card */}
            <motion.div 
              className="backdrop-blur-[20px] border border-white/20 rounded-2xl p-6"
              style={{
                background: 'rgba(20, 184, 166, 0.1)',
                boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
              }}
              whileHover={{ scale: 1.02, boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15)' }}
              transition={{ duration: 0.3 }}
            >
              <motion.h3 
                className="text-lg font-semibold text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Network Summary
              </motion.h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(snaData.metrics).map(([key, value], index) => (
                  <motion.div 
                    key={key}
                    className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-sm text-gray-400 capitalize">
                      {key === 'avgClustering' ? 'Avg. Clustering' : 
                       key === 'avgPathLength' ? 'Avg. Path Length' : 
                       key === 'centralization' ? 'Centralization' : 'Density'}
                    </div>
                    <motion.div 
                      className="text-xl font-semibold text-teal-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                    >
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Enhanced Bottleneck Alert Card */}
            <AnimatePresence>
              {bottlenecks.length > 0 && (
                <motion.div 
                  className="backdrop-blur-[20px] border border-red-500/50 rounded-2xl p-6"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.1)'
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.h3 
                    className="text-lg font-semibold text-red-400 mb-3 flex items-center"
                    animate={{ x: [0, 2, -2, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertTriangle size={18} className="mr-3" />
                    Bottleneck Detected
                  </motion.h3>
                  <p className="text-sm text-gray-300 mb-4">
                    {bottlenecks.length} actor{bottlenecks.length > 1 ? 's' : ''} with high centrality may create process bottlenecks.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bottlenecks.slice(0, 3).map((actor, index) => (
                      <motion.div
                        key={actor.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge variant="outline" className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                          {actor.label}
                        </Badge>
                      </motion.div>
                    ))}
                    {bottlenecks.length > 3 && (
                      <Badge variant="outline" className="border-red-500/30 bg-red-500/10">
                        +{bottlenecks.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-400 border-red-500/30 hover:bg-red-500/10 w-full"
                      onClick={() => onHighlightActors(bottlenecks.map(b => b.id))}
                    >
                      Investigate <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Enhanced Execution Pathways Preview */}
            <AnimatePresence>
              {showPathways && (
                <motion.div 
                  className="backdrop-blur-[20px] border border-white/20 rounded-2xl p-6"
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    boxShadow: 'inset 0 0 20px rgba(34, 197, 94, 0.1)'
                  }}
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Execution Pathways</h3>
                  <div className="space-y-4">
                    {executionPathways.map((pathway, index) => (
                      <motion.div 
                        key={pathway.id} 
                        className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="font-medium mb-2">{pathway.name}</div>
                        <div className="text-sm text-gray-400 mb-3">
                          {pathway.actors.join(" → ")}
                          <span className="ml-2 text-xs">({pathway.timeEstimate} weeks)</span>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-400 border-green-500/30 hover:bg-green-500/10 w-full"
                            onClick={() => handleAdoptPathway(pathway.id)}
                          >
                            Adopt Pathway <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SnaAnalysisPanel;
