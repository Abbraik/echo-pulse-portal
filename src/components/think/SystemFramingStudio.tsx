
import React, { useState, useRef } from 'react';
import { Save, RotateCcw, Plus, Network } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState('cld');
  const cyRef = useRef<any>(null);
  const snaRef = useRef<any>(null);
  const [isInfoOpen, setIsInfoOpen] = useState({
    density: false,
    clustering: false,
    pathLength: false,
    centralization: false,
  });
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
    <motion.div 
      className="flex flex-col"
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
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button 
            onClick={handleAddNode}
            className="px-4 py-2 text-sm backdrop-blur-[20px] border border-teal-500/30 bg-teal-500/20 text-teal-300 rounded-xl hover:bg-teal-500/30 transition-all duration-300 flex items-center shadow-lg"
          >
            <Plus size={16} className="mr-2" />
            Add Node
          </button>
        </motion.div>
      </div>

      {/* Enhanced Main visualization area */}
      <motion.div 
        className="aspect-video rounded-2xl flex items-center justify-center border border-white/20 mb-6 overflow-hidden relative"
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)'
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
              className="w-full h-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CytoscapeView 
                nodes={mockNodes} 
                edges={mockEdges} 
                onNodeClick={handleCyNodeClick}
                cyRef={cyRef}
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
                cyRef={snaRef}
                highlightedActors={highlightedActors}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Bottom section */}
      <AnimatePresence mode="wait">
        {activeTab === 'cld' ? (
          <motion.div
            key="cld-controls"
            className="flex justify-end space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleReset}
              className="px-4 py-2 text-sm backdrop-blur-[20px] border border-white/20 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={16} className="mr-2" />
              Reset Values
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="px-4 py-2 text-sm backdrop-blur-[20px] border border-teal-500/30 bg-gradient-to-br from-teal-500/60 to-blue-500/60 text-white rounded-xl hover:from-teal-500/70 hover:to-blue-500/70 transition-all duration-300 flex items-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={16} className="mr-2" />
              Save
            </motion.button>
          </motion.div>
        ) : (
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

      {/* Enhanced Node Popup Dialog */}
      <Dialog open={isPopupOpen && !!selectedNode} onOpenChange={setIsPopupOpen}>
        <DialogContent 
          className="backdrop-blur-[24px] border border-white/20 animate-scale-in shadow-2xl"
          style={{
            background: 'rgba(20, 30, 50, 0.8)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-medium bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">
              {selectedNode?.label}
            </DialogTitle>
          </DialogHeader>
          <motion.div 
            className="space-y-3 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {selectedNode?.subIndicators?.map((indicator, index) => (
              <motion.div 
                key={indicator.name} 
                className="flex items-center justify-between p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-gray-300">{indicator.name}: </span>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-2">
                    {indicator.value} {indicator.unit || ''}
                  </span>
                  {indicator.history && <SparklineChart data={indicator.history} />}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </DialogContent>
      </Dialog>

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
