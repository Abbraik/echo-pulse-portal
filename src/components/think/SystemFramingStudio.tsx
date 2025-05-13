
import React, { useState, useRef } from 'react';
import { LayoutGrid, Save, RotateCcw, Plus, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Import types and mock data
import { SystemFramingStudioProps, Node, mockNodes, mockEdges } from './types/system-framing-types';
import { mockCLDData, mockSNAData } from './mocks/three-dimensional-data';

// Import components
import CytoscapeView from './components/CytoscapeView';
import SparklineChart from './components/SparklineChart';
import IsometricMap from './components/IsometricMap';

const SystemFramingStudio: React.FC<SystemFramingStudioProps> = ({ cldData, snaData }) => {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const cyRef = useRef<any>(null);

  const handleSave = () => {
    console.log('Saving system frame...');
    // In a real app, this would call the API endpoint /think/cld/save
  };

  const handleReset = () => {
    console.log('Resetting system frame...');
    // In a real app, this would call the API endpoint /think/cld/reset
    if (cyRef.current) {
      cyRef.current.layout({ name: 'concentric' }).run();
    }
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

  // Handler for 3D node selection
  const handle3DNodeSelect = (nodeId: string) => {
    const node = mockNodes.find(n => n.id === nodeId);
    if (node) {
      handleNodeClick(node);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Mode toggle and toolbar */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
              viewMode === '2d' 
                ? 'bg-teal-500/70 text-white' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <LayoutGrid size={16} className="mr-1.5" />
            2D View
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
              viewMode === '3d' 
                ? 'bg-teal-500/70 text-white' 
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Layers size={16} className="mr-1.5" />
            3D View
          </button>
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
      <div className="aspect-video bg-navy-800/50 rounded-lg flex items-center justify-center border border-white/10 mb-4">
        {viewMode === '2d' ? (
          <CytoscapeView 
            nodes={mockNodes} 
            edges={mockEdges} 
            onNodeClick={handleCyNodeClick} 
            cyRef={cyRef} 
          />
        ) : (
          <IsometricMap 
            cldData={mockCLDData} 
            snaData={mockSNAData} 
            onSelect={handle3DNodeSelect}
          />
        )}
      </div>

      {/* Bottom actions bar */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors flex items-center"
        >
          <RotateCcw size={16} className="mr-1.5" />
          Reset
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-teal-500/70 text-white rounded-lg hover:bg-teal-500/90 transition-colors flex items-center"
        >
          <Save size={16} className="mr-1.5" />
          Save
        </button>
      </div>

      {/* Node Popup Dialog */}
      <Dialog open={isPopupOpen && !!selectedNode} onOpenChange={setIsPopupOpen}>
        <DialogContent className="bg-black/40 backdrop-blur-lg border-white/20">
          <DialogHeader>
            <DialogTitle className="text-xl" style={{ color: selectedNode?.color }}>
              {selectedNode?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {selectedNode?.subIndicators?.map((indicator) => (
              <div key={indicator.name} className="flex items-center justify-between">
                <span className="text-gray-300">{indicator.name}: </span>
                <div className="flex items-center">
                  <span className="text-white font-medium">
                    {indicator.value} {indicator.unit || ''}
                  </span>
                  {indicator.history && <SparklineChart data={indicator.history} />}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemFramingStudio;
