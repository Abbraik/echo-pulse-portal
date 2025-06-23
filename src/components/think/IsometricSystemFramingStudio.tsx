
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IsometricCLDCanvas } from './components/IsometricCLDCanvas';
import { LayerManager } from './components/LayerManager';
import { CLDToolbar } from './components/CLDToolbar';
import { 
  CLDNode, 
  CLDConnector, 
  CLDLayer, 
  IsometricViewport, 
  ToolType, 
  CLDWorkspace 
} from './types/isometric-cld-types';

interface IsometricSystemFramingStudioProps {
  className?: string;
}

// Mock data for demonstration
const mockLayers: CLDLayer[] = [
  { id: 'base', name: 'Base Loop', visible: true, locked: false, color: '#14b8a6', order: 0 },
  { id: 'data', name: 'Data Flows', visible: true, locked: false, color: '#3b82f6', order: 1 },
  { id: 'annotations', name: 'Annotations', visible: false, locked: false, color: '#a855f7', order: 2 }
];

const mockNodes: CLDNode[] = [
  {
    id: 'population',
    x: -3,
    y: -3,
    layer: 'base',
    label: 'Population Growth',
    width: 120,
    height: 80,
    color: '#14b8a6',
    type: 'stock'
  },
  {
    id: 'resources',
    x: 3,
    y: -3,
    layer: 'base',
    label: 'Resource Availability',
    width: 140,
    height: 80,
    color: '#3b82f6',
    type: 'stock'
  },
  {
    id: 'consumption',
    x: 0,
    y: 3,
    layer: 'base',
    label: 'Resource Consumption',
    width: 130,
    height: 80,
    color: '#ef4444',
    type: 'flow'
  }
];

const mockConnectors: CLDConnector[] = [
  {
    id: 'pop-to-consumption',
    from: 'population',
    to: 'consumption',
    bends: [],
    layer: 'base',
    style: 'solid',
    type: 'reinforcing',
    arrowType: 'single'
  },
  {
    id: 'consumption-to-resources',
    from: 'consumption',
    to: 'resources',
    bends: [{ x: 1, y: 1, id: 'bend-1' }],
    layer: 'base',
    style: 'solid',
    type: 'balancing',
    arrowType: 'single'
  },
  {
    id: 'resources-to-pop',
    from: 'resources',
    to: 'population',
    bends: [],
    layer: 'base',
    style: 'dashed',
    type: 'reinforcing',
    arrowType: 'single'
  }
];

export const IsometricSystemFramingStudio: React.FC<IsometricSystemFramingStudioProps> = ({
  className = ''
}) => {
  const [workspace, setWorkspace] = useState<CLDWorkspace>({
    nodes: mockNodes,
    connectors: mockConnectors,
    layers: mockLayers,
    viewport: { x: 0, y: 0, zoom: 1, rotation: { x: -35, y: 45 } },
    snapToGrid: true,
    gridSize: 1
  });

  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [history, setHistory] = useState<CLDWorkspace[]>([workspace]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Save state to history
  const saveToHistory = useCallback((newWorkspace: CLDWorkspace) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newWorkspace);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    const newWorkspace = {
      ...workspace,
      nodes: workspace.nodes.map(node =>
        node.id === nodeId 
          ? { 
              ...node, 
              x: workspace.snapToGrid ? Math.round(x / workspace.gridSize) * workspace.gridSize : x,
              y: workspace.snapToGrid ? Math.round(y / workspace.gridSize) * workspace.gridSize : y
            }
          : node
      )
    };
    setWorkspace(newWorkspace);
  }, [workspace]);

  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleViewportChange = useCallback((viewport: IsometricViewport) => {
    setWorkspace(prev => ({ ...prev, viewport }));
  }, []);

  const handleLayersChange = useCallback((layers: CLDLayer[]) => {
    const newWorkspace = { ...workspace, layers };
    setWorkspace(newWorkspace);
    saveToHistory(newWorkspace);
  }, [workspace, saveToHistory]);

  const handleAddLayer = useCallback(() => {
    const newLayer: CLDLayer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${workspace.layers.length + 1}`,
      visible: true,
      locked: false,
      color: '#64748b',
      order: workspace.layers.length
    };
    
    const newWorkspace = {
      ...workspace,
      layers: [...workspace.layers, newLayer]
    };
    setWorkspace(newWorkspace);
    saveToHistory(newWorkspace);
  }, [workspace, saveToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setWorkspace(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setWorkspace(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
        }
      }

      switch (e.key) {
        case 'v':
          setActiveTool('select');
          break;
        case 'h':
          setActiveTool('pan');
          break;
        case 'z':
          if (!e.ctrlKey && !e.metaKey) setActiveTool('zoom');
          break;
        case 'n':
          setActiveTool('add-node');
          break;
        case 'c':
          setActiveTool('add-connector');
          break;
        case 'l':
          setShowLayers(!showLayers);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, showLayers]);

  // Filter visible nodes and connectors
  const visibleNodes = workspace.nodes.filter(node => {
    const layer = workspace.layers.find(l => l.id === node.layer);
    return layer?.visible !== false;
  });

  const visibleConnectors = workspace.connectors.filter(connector => {
    const layer = workspace.layers.find(l => l.id === connector.layer);
    return layer?.visible !== false;
  });

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10">
        <CLDToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onToggleLayers={() => setShowLayers(!showLayers)}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
      </div>

      {/* Layer Manager */}
      <AnimatePresence>
        {showLayers && (
          <motion.div
            className="absolute top-4 right-4 z-10"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <LayerManager
              layers={workspace.layers}
              onLayersChange={handleLayersChange}
              onAddLayer={handleAddLayer}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Canvas */}
      <IsometricCLDCanvas
        nodes={visibleNodes}
        connectors={visibleConnectors}
        viewport={workspace.viewport}
        activeTool={activeTool}
        onNodeSelect={handleNodeSelect}
        onNodeDrag={handleNodeDrag}
        onViewportChange={handleViewportChange}
        selectedNodeId={selectedNodeId}
        className="w-full h-full"
      />

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="glass-panel px-3 py-2 rounded-lg text-xs text-gray-300">
          <span>Tool: {activeTool}</span>
          <span className="mx-2">•</span>
          <span>Zoom: {Math.round(workspace.viewport.zoom * 100)}%</span>
          <span className="mx-2">•</span>
          <span>Nodes: {visibleNodes.length}</span>
        </div>
      </div>
    </div>
  );
};
