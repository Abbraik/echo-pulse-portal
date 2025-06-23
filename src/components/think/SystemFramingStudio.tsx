
import React, { useState, useRef } from 'react';
import { Save, RotateCcw, Plus, Network } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

// Import new isometric CLD components
import { CLDNode, CLDConnector, CLDLayer, IsometricCLDState } from './types/isometric-cld-types';
import LayerManager from './components/LayerManager';
import CLDToolbar from './components/CLDToolbar';
import IsometricCLDCanvas from './components/IsometricCLDCanvas';

// Import types and mock data
import { SystemFramingStudioProps, Node, mockNodes, mockEdges } from './types/system-framing-types';
import { Actor, Connection, SNAMetrics } from './types/sna-types';

// Import components for SNA tab
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

// Initial CLD data
const initialCLDState: IsometricCLDState = {
  nodes: [
    {
      id: 'node1',
      x: 0,
      y: 0,
      z: 0,
      layer: 'base',
      label: 'Economic Growth',
      width: 120,
      height: 60,
      color: '#3b82f6',
      type: 'variable'
    },
    {
      id: 'node2',
      x: 200,
      y: 100,
      z: 0,
      layer: 'base',
      label: 'Environmental Impact',
      width: 140,
      height: 60,
      color: '#10b981',
      type: 'variable'
    },
    {
      id: 'node3',
      x: -150,
      y: 200,
      z: 0,
      layer: 'base',
      label: 'Social Welfare',
      width: 120,
      height: 60,
      color: '#f59e0b',
      type: 'variable'
    }
  ],
  connectors: [
    {
      id: 'conn1',
      from: 'node1',
      to: 'node2',
      bends: [],
      layer: 'base',
      style: 'solid',
      polarity: 'negative'
    },
    {
      id: 'conn2',
      from: 'node1',
      to: 'node3',
      bends: [],
      layer: 'base',
      style: 'solid',
      polarity: 'positive'
    }
  ],
  layers: [
    {
      id: 'base',
      name: 'Base Loop',
      visible: true,
      locked: false,
      color: '#14b8a6',
      order: 0
    },
    {
      id: 'data',
      name: 'Data Flows',
      visible: true,
      locked: false,
      color: '#3b82f6',
      order: 1
    },
    {
      id: 'annotations',
      name: 'Annotations',
      visible: true,
      locked: false,
      color: '#f59e0b',
      order: 2
    }
  ],
  selectedTool: 'select',
  selectedNodeId: null,
  selectedConnectorId: null,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  snapToGrid: true,
  gridSize: 50
};

const SystemFramingStudio: React.FC<SystemFramingStudioProps> = ({ cldData, snaData }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cld');
  const [highlightedActors, setHighlightedActors] = useState<string[]>([]);
  
  // CLD State
  const [cldState, setCldState] = useState<IsometricCLDState>(initialCLDState);
  const [history, setHistory] = useState<IsometricCLDState[]>([initialCLDState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // CLD Event Handlers
  const handleNodeMove = (nodeId: string, x: number, y: number) => {
    setCldState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, x, y } : node
      )
    }));
  };

  const handleNodeSelect = (nodeId: string) => {
    setCldState(prev => ({
      ...prev,
      selectedNodeId: nodeId
    }));
  };

  const handleCanvasClick = (x: number, y: number) => {
    if (cldState.selectedTool === 'add-node') {
      const newNode: CLDNode = {
        id: `node_${Date.now()}`,
        x,
        y,
        z: 0,
        layer: 'base',
        label: 'New Variable',
        width: 120,
        height: 60,
        color: '#6366f1',
        type: 'variable'
      };

      setCldState(prev => ({
        ...prev,
        nodes: [...prev.nodes, newNode]
      }));
    }
  };

  const handleViewportChange = (transform: { zoom: number; panOffset: { x: number; y: number } }) => {
    setCldState(prev => ({
      ...prev,
      zoom: transform.zoom,
      panOffset: transform.panOffset
    }));
  };

  const handleToolChange = (tool: 'select' | 'pan' | 'add-node' | 'add-connector') => {
    setCldState(prev => ({
      ...prev,
      selectedTool: tool
    }));
  };

  const handleToggleGrid = () => {
    setCldState(prev => ({
      ...prev,
      snapToGrid: !prev.snapToGrid
    }));
  };

  const handleLayerToggle = (layerId: string) => {
    setCldState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    }));
  };

  const handleLayerLockToggle = (layerId: string) => {
    setCldState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    }));
  };

  const handleAddLayer = (name: string) => {
    const newLayer: CLDLayer = {
      id: `layer_${Date.now()}`,
      name,
      visible: true,
      locked: false,
      color: '#6366f1',
      order: cldState.layers.length
    };

    setCldState(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer]
    }));
  };

  const handleLayerReorder = (layers: CLDLayer[]) => {
    setCldState(prev => ({
      ...prev,
      layers
    }));
  };

  const handleLayerRename = (layerId: string, newName: string) => {
    setCldState(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId ? { ...layer, name: newName } : layer
      )
    }));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCldState(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCldState(history[newIndex]);
    }
  };

  const handleSave = () => {
    console.log('Saving CLD state...', cldState);
    // In a real app, this would call the API endpoint
  };

  const handleReset = () => {
    setCldState(initialCLDState);
    setHistory([initialCLDState]);
    setHistoryIndex(0);
  };

  // SNA Event Handlers
  const handleSnaNodeClick = (nodeId: string) => {
    const actor = mockSNAData.nodes.find(n => n.id === nodeId);
    if (actor) {
      setSelectedActor(actor);
      setHighlightedActors([nodeId]);
    }
  };

  // Filter visible nodes and connectors based on layers
  const visibleNodes = cldState.nodes.filter(node => 
    cldState.layers.find(layer => layer.id === node.layer)?.visible
  );
  
  const visibleConnectors = cldState.connectors.filter(connector => 
    cldState.layers.find(layer => layer.id === connector.layer)?.visible
  );

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Toolbar */}
      <div className="flex justify-between mb-6">
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList 
              className="mb-4 backdrop-blur-[20px] border border-white/20 rounded-xl p-1"
              style={{
                background: 'rgba(20, 30, 50, 0.4)',
                boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
              }}
            >
              <TabsTrigger 
                value="cld"
                className="rounded-lg px-4 py-2 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 transition-all duration-300"
              >
                Causal Loop Diagram
              </TabsTrigger>
              <TabsTrigger 
                value="sna" 
                className="flex items-center gap-2 rounded-lg px-4 py-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 transition-all duration-300"
              >
                <Network size={16} />
                <span>Social Network Analysis</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </div>

      {/* Enhanced Main visualization area */}
      <motion.div 
        className="flex-1 rounded-2xl flex items-center justify-center border border-white/20 mb-6 overflow-hidden relative"
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)',
          minHeight: '600px'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5 rounded-2xl"></div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'cld' ? (
            <motion.div
              key="cld"
              className="w-full h-full relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* CLD Toolbar */}
              <CLDToolbar
                selectedTool={cldState.selectedTool}
                onToolChange={handleToolChange}
                snapToGrid={cldState.snapToGrid}
                onToggleGrid={handleToggleGrid}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onSave={handleSave}
                onReset={handleReset}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
              />

              {/* Layer Manager */}
              <LayerManager
                layers={cldState.layers}
                onToggleLayer={handleLayerToggle}
                onToggleLock={handleLayerLockToggle}
                onAddLayer={handleAddLayer}
                onReorderLayers={handleLayerReorder}
                onRenameLayer={handleLayerRename}
              />

              {/* Isometric CLD Canvas */}
              <IsometricCLDCanvas
                nodes={visibleNodes}
                connectors={visibleConnectors}
                selectedNodeId={cldState.selectedNodeId}
                selectedTool={cldState.selectedTool}
                viewportTransform={{
                  zoom: cldState.zoom,
                  panOffset: cldState.panOffset
                }}
                snapToGrid={cldState.snapToGrid}
                gridSize={cldState.gridSize}
                onNodeMove={handleNodeMove}
                onNodeSelect={handleNodeSelect}
                onCanvasClick={handleCanvasClick}
                onViewportChange={handleViewportChange}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sna"
              className="w-full h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NetworkView
                nodes={mockSNAData.nodes}
                edges={mockSNAData.edges}
                onNodeClick={handleSnaNodeClick}
                cyRef={useRef()}
                highlightedActors={highlightedActors}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Bottom section */}
      <AnimatePresence mode="wait">
        {activeTab === 'sna' && (
          <motion.div
            key="sna-metrics"
            className="grid grid-cols-2 gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {Object.entries(mockSNAData.metrics).map(([key, value], index) => (
              <motion.div 
                key={key} 
                className="backdrop-blur-[20px] border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
                style={{
                  background: 'rgba(139, 69, 199, 0.1)',
                  boxShadow: 'inset 0 0 20px rgba(139, 69, 199, 0.1)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.15)' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <motion.h3 
                      className="text-lg font-semibold text-white"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {value.toFixed(2)}
                    </motion.h3>
                    <p className="text-sm text-gray-300 capitalize">
                      {key === 'avgClustering' ? 'Avg. Clustering' : 
                       key === 'avgPathLength' ? 'Avg. Path Length' : 
                       key === 'centralization' ? 'Centralization' : 'Density'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced selected actor info for SNA */}
      <AnimatePresence>
        {activeTab === 'sna' && selectedActor && (
          <motion.div 
            className="backdrop-blur-[24px] border border-white/20 rounded-2xl p-6 text-left mt-6 shadow-lg"
            style={{
              background: 'rgba(139, 69, 199, 0.2)',
              boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.15), 0 8px 24px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex justify-between items-start">
              <div>
                <motion.h3 
                  className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedActor.label}
                </motion.h3>
                <p className="text-sm text-gray-300 capitalize">{selectedActor.type}</p>
              </div>
              <div className="flex gap-3 text-xs text-white">
                {[
                  { label: 'Degree', value: selectedActor.degree },
                  { label: 'Betweenness', value: selectedActor.betweenness.toFixed(2) },
                  { label: 'Closeness', value: selectedActor.closeness.toFixed(2) }
                ].map((metric, index) => (
                  <motion.div 
                    key={metric.label}
                    className="backdrop-blur-[20px] border border-white/10 rounded-lg p-3"
                    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="font-semibold text-gray-400">{metric.label}</p>
                    <p className="font-medium">{metric.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SystemFramingStudio;
