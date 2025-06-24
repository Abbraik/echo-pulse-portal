
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { SNAMetrics, Actor } from './types/sna-types';

interface SnaAnalysisTabProps {
  metrics: SNAMetrics;
}

const SnaAnalysisTab: React.FC<SnaAnalysisTabProps> = ({ metrics }) => {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState({
    density: false,
    clustering: false,
    pathLength: false,
    centralization: false,
  });

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2">Network Metrics</h3>
        
        {/* Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Density card */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{metrics.density.toFixed(2)}</h3>
                <p className="text-sm text-gray-300">Network Density</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setIsInfoOpen(prev => ({ ...prev, density: !prev.density }))}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <Info size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Proportion of possible connections that actually exist</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
            <Collapsible open={isInfoOpen.density} className="px-4 pb-2">
              <CollapsibleContent>
                <p className="text-xs text-gray-300">
                  Density shows how interconnected your network is. Values closer to 1 mean most actors are connected directly.
                  Low density (under 0.3) may indicate siloed communication.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Clustering Coefficient card */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{metrics.avgClustering.toFixed(2)}</h3>
                <p className="text-sm text-gray-300">Avg. Clustering Coefficient</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setIsInfoOpen(prev => ({ ...prev, clustering: !prev.clustering }))}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <Info size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Tendency of nodes to cluster together</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
            <Collapsible open={isInfoOpen.clustering} className="px-4 pb-2">
              <CollapsibleContent>
                <p className="text-xs text-gray-300">
                  Measures how interconnected neighboring nodes are. Higher values indicate tight collaboration clusters.
                  Too high (&gt; 0.8) may signal echo chambers; too low (&lt; 0.2) suggests weak community formation.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Path Length card */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{metrics.avgPathLength.toFixed(1)}</h3>
                <p className="text-sm text-gray-300">Avg. Path Length</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setIsInfoOpen(prev => ({ ...prev, pathLength: !prev.pathLength }))}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <Info size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">Average steps needed to reach any node from any other node</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
            <Collapsible open={isInfoOpen.pathLength} className="px-4 pb-2">
              <CollapsibleContent>
                <p className="text-xs text-gray-300">
                  Indicates how quickly information can spread through the network. Lower values mean faster information flow.
                  In governance networks, 2-3 steps is typically optimal for efficient coordination.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Centralization card */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{metrics.centralization.toFixed(2)}</h3>
                <p className="text-sm text-gray-300">Network Centralization</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => setIsInfoOpen(prev => ({ ...prev, centralization: !prev.centralization }))}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <Info size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">How dominated the network is by central nodes</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
            <Collapsible open={isInfoOpen.centralization} className="px-4 pb-2">
              <CollapsibleContent>
                <p className="text-xs text-gray-300">
                  Measures how hierarchical your network is. Value of 1 means a perfect star network with one central actor.
                  Values above 0.7 suggest over-dependence on key actors, creating bottlenecks and single points of failure.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>
        
        {/* Selected actor info */}
        {selectedActor && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-left mt-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{selectedActor.label}</h3>
                <p className="text-sm text-gray-300 capitalize">{selectedActor.type}</p>
              </div>
              <div className="flex gap-2 text-xs text-white">
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="font-semibold">Degree:</p>
                  <p>{selectedActor.degree}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="font-semibold">Betweenness:</p>
                  <p>{selectedActor.betweenness.toFixed(2)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2">
                  <p className="font-semibold">Closeness:</p>
                  <p>{selectedActor.closeness.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SnaAnalysisTab;
