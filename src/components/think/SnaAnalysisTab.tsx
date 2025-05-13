
import React, { useEffect, useRef, useState } from 'react';
import { Info, Network } from 'lucide-react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent } from '@/components/ui/card';
import { SNAData, SNAMetrics, Actor } from './types/sna-types';

// Mock data for the SNA analysis
const mockSNAData: SNAData = {
  nodes: [
    { 
      id: 'gov1', 
      type: 'government', 
      label: 'Central Government', 
      degree: 5, 
      betweenness: 0.42, 
      closeness: 0.78 
    },
    { 
      id: 'gov2', 
      type: 'government', 
      label: 'Local Authority', 
      degree: 4, 
      betweenness: 0.28, 
      closeness: 0.65 
    },
    { 
      id: 'corp1', 
      type: 'private', 
      label: 'Multinational Corp', 
      degree: 3, 
      betweenness: 0.15, 
      closeness: 0.52 
    },
    { 
      id: 'corp2', 
      type: 'private', 
      label: 'Local Business', 
      degree: 2, 
      betweenness: 0.08, 
      closeness: 0.44 
    },
    { 
      id: 'ngo1', 
      type: 'ngo', 
      label: 'International NGO', 
      degree: 3, 
      betweenness: 0.22, 
      closeness: 0.56 
    },
    { 
      id: 'ngo2', 
      type: 'ngo', 
      label: 'Community Group', 
      degree: 2, 
      betweenness: 0.06, 
      closeness: 0.42 
    },
    { 
      id: 'acad1', 
      type: 'academic', 
      label: 'University', 
      degree: 4, 
      betweenness: 0.18, 
      closeness: 0.62 
    },
  ],
  edges: [
    { source: 'gov1', target: 'corp1', weight: 0.8 },
    { source: 'gov1', target: 'ngo1', weight: 0.6 },
    { source: 'gov1', target: 'gov2', weight: 0.9 },
    { source: 'gov1', target: 'acad1', weight: 0.5 },
    { source: 'gov2', target: 'corp2', weight: 0.7 },
    { source: 'gov2', target: 'ngo2', weight: 0.8 },
    { source: 'corp1', target: 'ngo1', weight: 0.4 },
    { source: 'corp1', target: 'corp2', weight: 0.6 },
    { source: 'ngo1', target: 'ngo2', weight: 0.7 },
    { source: 'ngo1', target: 'acad1', weight: 0.5 },
    { source: 'acad1', target: 'corp2', weight: 0.4 },
    { source: 'acad1', target: 'gov2', weight: 0.6 }
  ],
  metrics: {
    density: 0.42,
    avgClustering: 0.31,
    avgPathLength: 2.4,
    centralization: 0.68
  }
};

const SnaAnalysisTab: React.FC = () => {
  const cyRef = useRef<any>(null);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState({
    density: false,
    clustering: false,
    pathLength: false,
    centralization: false,
  });

  // Setup Cytoscape configuration
  const cytoConfig = {
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'data(color)',
          'label': 'data(label)',
          'width': 'data(size)',
          'height': 'data(size)',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'text-margin-y': '6px',
          'font-size': '10px',
          'color': '#fff',
          'text-outline-color': '#000',
          'text-outline-width': '1px',
          'text-background-opacity': 0.7,
          'text-background-color': '#333',
          'text-background-padding': '2px',
          'text-background-shape': 'roundrectangle'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 'data(width)',
          'line-color': 'rgba(203, 213, 225, 0.7)', // slate-300 with opacity
          'curve-style': 'bezier',
          'target-arrow-shape': 'none'
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-width': '2px',
          'border-color': '#fff',
          'border-opacity': 1,
          'text-outline-color': '#14b8a6', // teal-500
          'text-outline-width': '2px',
        }
      }
    ],
    layout: {
      name: 'concentric',
      fit: true,
      padding: 30,
      concentric: function(node: any) {
        return node.data('degree');
      },
      levelWidth: function() { return 2; }
    }
  };

  // Process data for Cytoscape
  const elements = React.useMemo(() => {
    const nodes = mockSNAData.nodes.map(node => {
      // Determine color based on actor type
      let color;
      switch (node.type) {
        case 'government':
          color = '#14b8a6'; // teal-500
          break;
        case 'private':
          color = '#3b82f6'; // blue-500
          break;
        case 'ngo':
          color = '#a855f7'; // purple-500
          break;
        case 'academic':
          color = '#f59e0b'; // amber-500
          break;
        default:
          color = '#64748b'; // slate-500
      }
      
      // Size based on degree centrality (normalized)
      const size = 20 + (node.degree * 5);
      
      return {
        data: {
          ...node,
          size,
          color,
        }
      };
    });

    const edges = mockSNAData.edges.map(edge => ({
      data: {
        ...edge,
        id: `${edge.source}-${edge.target}`,
        width: edge.weight * 3, // Scale edge width based on weight
      }
    }));

    return [...nodes, ...edges];
  }, []);

  // Handle node click
  const handleNodeClick = (event: any) => {
    const node = event.target;
    const nodeId = node.id();
    const actorData = mockSNAData.nodes.find(n => n.id === nodeId);
    if (actorData) {
      setSelectedActor(actorData);
    }
  };

  // Initialize Cytoscape with event handlers
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      
      // Register event handlers
      cy.on('tap', 'node', handleNodeClick);
      
      cy.on('mouseover', 'node', function(e: any) {
        e.target.style({
          'border-width': '2px',
          'border-color': '#fff',
        });
      });
      
      cy.on('mouseout', 'node', function(e: any) {
        if (!e.target.selected()) {
          e.target.style({
            'border-width': '0px',
          });
        }
      });

      return () => {
        cy.removeListener('tap');
        cy.removeListener('mouseover');
        cy.removeListener('mouseout');
      };
    }
  }, []);

  // Render the component
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Network visualization */}
      <div className="flex-1 bg-navy-800/30 rounded-xl overflow-hidden border border-white/10 h-[60%] min-h-[300px]">
        <CytoscapeComponent
          elements={elements}
          style={{ width: '100%', height: '100%' }}
          cy={(cy) => { cyRef.current = cy; }}
          {...cytoConfig}
        />
      </div>
      
      {/* Metrics section */}
      <div className="h-[40%]">
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Density card */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{mockSNAData.metrics.density.toFixed(2)}</h3>
                <p className="text-sm text-gray-300">Network Density</p>
              </div>
              <TooltipProvider>
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
              </TooltipProvider>
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
                <h3 className="text-xl font-bold">{mockSNAData.metrics.avgClustering.toFixed(2)}</h3>
                <p className="text-sm text-gray-300">Avg. Clustering Coefficient</p>
              </div>
              <TooltipProvider>
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
              </TooltipProvider>
            </CardContent>
            <Collapsible open={isInfoOpen.clustering} className="px-4 pb-2">
              <CollapsibleContent>
                <p className="text-xs text-gray-300">
                  Measures how interconnected neighboring nodes are. Higher values indicate tight collaboration clusters.
                  Too high (>0.8) may signal echo chambers; too low (<0.2) suggests weak community formation.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Path Length card */}
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{mockSNAData.metrics.avgPathLength.toFixed(1)}</h3>
                <p className="text-sm text-gray-300">Avg. Path Length</p>
              </div>
              <TooltipProvider>
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
              </TooltipProvider>
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
                <h3 className="text-xl font-bold">{mockSNAData.metrics.centralization.toFixed(2)}</h3>
                <p className="text-sm text-gray-300">Network Centralization</p>
              </div>
              <TooltipProvider>
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
              </TooltipProvider>
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
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-left">
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
    </div>
  );
};

export default SnaAnalysisTab;
