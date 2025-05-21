
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
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">Show Execution Pathways</span>
          <Switch
            checked={showPathways}
            onCheckedChange={setShowPathways}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Interactive Network Map - takes 60% of the width on large screens */}
        <div className="lg:w-3/5 h-[500px] relative">
          <div className="bg-navy-800/30 rounded-xl overflow-hidden border border-white/10 h-full">
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
          
          {/* Floating tooltip that follows cursor */}
          {tooltipContent && (
            <div 
              className="absolute pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
              style={{ 
                left: tooltipContent.x, 
                top: tooltipContent.y - 10
              }}
            >
              <NetworkTooltip data={tooltipContent.data} type={tooltipContent.type} />
            </div>
          )}
        </div>
        
        {/* Metrics summary panel - takes 40% of the width on large screens */}
        <div className="lg:w-2/5 h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {/* Top Actors by Degree Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Users size={16} className="mr-2 text-teal-400" />
                Top Actors by Influence (Degree)
              </h3>
              <div className="space-y-2">
                {actorsByDegree.map((actor, index) => (
                  <div key={actor.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-5 text-gray-400">{index + 1}.</span>
                      <span className="font-medium">{actor.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs capitalize">{actor.type}</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-white/10 h-2 rounded-full mr-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-blue-500" 
                          style={{ width: `${(actor.degree / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{actor.degree}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Actors by Betweenness Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <GitCommit size={16} className="mr-2 text-blue-400" />
                Top Brokers (Betweenness)
              </h3>
              <div className="space-y-2">
                {actorsByBetweenness.map((actor, index) => (
                  <div key={actor.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-5 text-gray-400">{index + 1}.</span>
                      <span className="font-medium">{actor.label}</span>
                      <Badge variant="outline" className="ml-2 text-xs capitalize">{actor.type}</Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 bg-white/10 h-2 rounded-full mr-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                          style={{ width: `${actor.betweenness * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{actor.betweenness.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Network Metrics Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Network Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="text-sm text-gray-400">Density</div>
                  <div className="text-xl font-semibold">{snaData.metrics.density.toFixed(2)}</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="text-sm text-gray-400">Avg. Clustering</div>
                  <div className="text-xl font-semibold">{snaData.metrics.avgClustering.toFixed(2)}</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="text-sm text-gray-400">Avg. Path Length</div>
                  <div className="text-xl font-semibold">{snaData.metrics.avgPathLength.toFixed(1)}</div>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <div className="text-sm text-gray-400">Centralization</div>
                  <div className="text-xl font-semibold">{snaData.metrics.centralization.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            {/* Bottleneck Alert Card (conditional) */}
            {bottlenecks.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg border border-red-500/50 rounded-xl p-4 animate-pulse-subtle">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center text-red-400">
                  <AlertTriangle size={16} className="mr-2" />
                  Bottleneck Detected
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {bottlenecks.length} actor{bottlenecks.length > 1 ? 's' : ''} with high centrality may create process bottlenecks.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {bottlenecks.slice(0, 3).map(actor => (
                    <Badge key={actor.id} variant="outline" className="border-red-500/30 bg-red-500/10">
                      {actor.label}
                    </Badge>
                  ))}
                  {bottlenecks.length > 3 && (
                    <Badge variant="outline" className="border-red-500/30 bg-red-500/10">
                      +{bottlenecks.length - 3} more
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-400 border-red-500/30 hover:bg-red-500/10 w-full"
                  onClick={() => onHighlightActors(bottlenecks.map(b => b.id))}
                >
                  Investigate <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            )}
            
            {/* Execution Pathways Preview (conditional based on toggle) */}
            {showPathways && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Execution Pathways</h3>
                <div className="space-y-3">
                  {executionPathways.map(pathway => (
                    <div key={pathway.id} className="bg-white/5 p-3 rounded-lg">
                      <div className="font-medium mb-1">{pathway.name}</div>
                      <div className="text-sm text-gray-400 mb-2">
                        {pathway.actors.join(" → ")}
                        <span className="ml-2 text-xs">({pathway.timeEstimate} weeks)</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-teal-400 border-teal-500/30 hover:bg-teal-500/10 w-full"
                        onClick={() => handleAdoptPathway(pathway.id)}
                      >
                        Adopt Pathway <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default SnaAnalysisPanel;
