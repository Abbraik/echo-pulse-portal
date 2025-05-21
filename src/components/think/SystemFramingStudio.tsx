import React, { useState, useRef } from 'react';
import { Save, RotateCcw, Plus, Network } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import types and mock data
import { SystemFramingStudioProps, Node, mockNodes, mockEdges } from './types/system-framing-types';
import { Actor, Connection, SNAMetrics } from './types/sna-types';

// Import components
import CytoscapeView from './components/CytoscapeView';
import SparklineChart from './components/SparklineChart';
import NetworkView from './components/NetworkView';

// Mock data for the SNA analysis
const mockSNAData = {
  nodes: [
    { 
      id: 'gov1', 
      type: 'government' as const, 
      label: 'Central Government', 
      degree: 5, 
      betweenness: 0.42, 
      closeness: 0.78,
      color: '#14b8a6'
    },
    { 
      id: 'gov2', 
      type: 'government' as const, 
      label: 'Local Authority', 
      degree: 4, 
      betweenness: 0.28, 
      closeness: 0.65,
      color: '#14b8a6'
    },
    { 
      id: 'corp1', 
      type: 'private' as const, 
      label: 'Multinational Corp', 
      degree: 3, 
      betweenness: 0.15, 
      closeness: 0.52,
      color: '#3b82f6'
    },
    { 
      id: 'corp2', 
      type: 'private' as const, 
      label: 'Local Business', 
      degree: 2, 
      betweenness: 0.08, 
      closeness: 0.44,
      color: '#3b82f6'
    },
    { 
      id: 'ngo1', 
      type: 'ngo' as const, 
      label: 'International NGO', 
      degree: 3, 
      betweenness: 0.22, 
      closeness: 0.56,
      color: '#a855f7'
    },
    { 
      id: 'ngo2', 
      type: 'ngo' as const, 
      label: 'Community Group', 
      degree: 2, 
      betweenness: 0.06, 
      closeness: 0.42,
      color: '#a855f7'
    },
    { 
      id: 'acad1', 
      type: 'academic' as const, 
      label: 'University', 
      degree: 4, 
      betweenness: 0.18, 
      closeness: 0.62,
      color: '#f59e0b'
    },
  ] as Actor[],
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

const SystemFramingStudio: React.FC<SystemFramingStudioProps> = ({ cldData, snaData }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cld'); // 'cld' or 'sna'
  const cyRef = useRef<any>(null);
  const snaRef = useRef<any>(null);
  const [isInfoOpen, setIsInfoOpen] = useState({
    density: false,
    clustering: false,
    pathLength: false,
    centralization: false,
  });
  // Add highlightedActors state for network visualization
  const [highlightedActors, setHighlightedActors] = useState<string[]>([]);

  const handleSave = () => {
    console.log('Saving system frame...');
    // In a real app, this would call the API endpoint /think/cld/save
  };

  const handleReset = () => {
    console.log('Resetting system frame...');
    // No longer reset layout when Reset button is clicked
    // Instead, we could implement a function to reset node values but keep positions
  };

  const handleAddNode = () => {
    console.log('Adding new node...');
    // In a real app, this would open a node creation dialog
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setIsPopupOpen(true);
  };

  // Handler for cytoscape node click
  const handleCyNodeClick = (nodeId: string) => {
    const node = mockNodes.find(n => n.id === nodeId);
    if (node) {
      handleNodeClick(node);
    }
  };

  // Handler for SNA node click
  const handleSnaNodeClick = (nodeId: string) => {
    const actor = mockSNAData.nodes.find(n => n.id === nodeId);
    if (actor) {
      setSelectedActor(actor);
      // When selecting an actor, highlight it in the network
      setHighlightedActors([nodeId]);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="cld">Causal Loop Diagram</TabsTrigger>
              <TabsTrigger value="sna" className="flex items-center gap-2">
                <Network size={16} />
                <span>Social Network Analysis</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <button 
          onClick={handleAddNode}
          className="px-3 py-1.5 text-sm bg-teal-500/30 text-teal-300 rounded-lg hover:bg-teal-500/40 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-1.5" />
          Add Node
        </button>
      </div>

      {/* Main visualization area */}
      <div className="aspect-video bg-navy-800/50 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 mb-4 shadow-lg">
        {activeTab === 'cld' ? (
          <CytoscapeView 
            nodes={mockNodes} 
            edges={mockEdges} 
            onNodeClick={handleCyNodeClick}
            cyRef={cyRef}
          />
        ) : (
          <NetworkView
            nodes={mockSNAData.nodes}
            edges={mockSNAData.edges}
            onNodeClick={handleSnaNodeClick}
            cyRef={snaRef}
            highlightedActors={highlightedActors}
          />
        )}
      </div>

      {/* Bottom section - conditional based on active tab */}
      {activeTab === 'cld' ? (
        /* Bottom actions bar for CLD */
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors flex items-center"
          >
            <RotateCcw size={16} className="mr-1.5" />
            Reset Values
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm bg-gradient-to-br from-teal-500/80 to-blue-500/80 text-white rounded-lg hover:from-teal-500/90 hover:to-blue-500/90 transition-colors flex items-center shadow-md backdrop-blur-sm"
          >
            <Save size={16} className="mr-1.5" />
            Save
          </button>
        </div>
      ) : (
        /* Network metrics section for SNA */
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(mockSNAData.metrics).map(([key, value]) => (
            <div key={key} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 transition-all hover:bg-white/15">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{value.toFixed(2)}</h3>
                  <p className="text-sm text-gray-300 capitalize">
                    {key === 'avgClustering' ? 'Avg. Clustering' : 
                     key === 'avgPathLength' ? 'Avg. Path Length' : 
                     key === 'centralization' ? 'Centralization' : 'Density'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Node Popup Dialog */}
      <Dialog open={isPopupOpen && !!selectedNode} onOpenChange={setIsPopupOpen}>
        <DialogContent className="bg-black/60 backdrop-blur-xl border-white/20 animate-scale-in shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
              {selectedNode?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedNode?.subIndicators?.map((indicator) => (
              <div key={indicator.name} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <span className="text-gray-300">{indicator.name}: </span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">
                    {indicator.value} {indicator.unit || ''}
                  </span>
                  {indicator.history && <SparklineChart data={indicator.history} />}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Selected actor info for SNA */}
      {activeTab === 'sna' && selectedActor && (
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-left mt-4 shadow-lg animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">{selectedActor.label}</h3>
              <p className="text-sm text-gray-300 capitalize">{selectedActor.type}</p>
            </div>
            <div className="flex gap-2 text-xs text-white">
              <div className="bg-white/10 rounded-lg p-2 border border-white/10">
                <p className="font-semibold text-gray-400">Degree</p>
                <p className="font-medium">{selectedActor.degree}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2 border border-white/10">
                <p className="font-semibold text-gray-400">Betweenness</p>
                <p className="font-medium">{selectedActor.betweenness.toFixed(2)}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2 border border-white/10">
                <p className="font-semibold text-gray-400">Closeness</p>
                <p className="font-medium">{selectedActor.closeness.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemFramingStudio;
