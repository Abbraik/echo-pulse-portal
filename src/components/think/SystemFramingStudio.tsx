
import React, { useState, useRef, useEffect } from 'react';
import { Layers, LayoutGrid, Save, RotateCcw, Plus, Info, X } from 'lucide-react';
import CytoScape from 'react-cytoscapejs';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { THREE } from './three-imports';

interface SubIndicator {
  name: string;
  value: number;
  unit?: string;
  history?: number[];
}

interface Node {
  id: string;
  label: string;
  type: 'stock' | 'subIndicator' | 'auxiliary';
  color: string;
  size?: number;
  position?: { x: number; y: number; z?: number };
  subIndicators?: SubIndicator[];
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'reinforcing' | 'balancing' | 'auxiliary';
  label?: string;
}

interface CLDData {
  nodes: Node[];
  edges: Edge[];
}

interface SNAData {
  nodes: Node[];
  edges: Edge[];
}

interface SystemFramingStudioProps {
  cldData: CLDData;
  snaData: SNAData;
}

// Mock data for demonstration purposes
const mockNodes: Node[] = [
  {
    id: 'population',
    label: 'Population Size & Characteristics',
    type: 'stock',
    color: '#14B8A6', // teal-500
    position: { x: 0, y: 0, z: 0 },
    subIndicators: [
      { name: 'Fertility Rate', value: 2.1, unit: 'births/woman', history: [2.3, 2.2, 2.15, 2.1, 2.05] },
      { name: 'Age-Dependency Ratio', value: 52, unit: '%', history: [58, 56, 54, 53, 52] },
      { name: 'Migration Volatility', value: 18, unit: '%', history: [22, 20, 19, 18.5, 18] },
      { name: 'Population Growth Stability', value: 76, unit: '%', history: [70, 72, 74, 75, 76] }
    ]
  },
  {
    id: 'resources',
    label: 'Resource-Market Efficiency',
    type: 'stock',
    color: '#60A5FA', // blue-400
    position: { x: 200, y: 0, z: 0 },
    subIndicators: [
      { name: 'Resource Market Supply/Demand Ratio', value: 0.89, unit: '', history: [0.82, 0.84, 0.86, 0.88, 0.89] },
      { name: 'Energy Per Capita', value: 4.2, unit: 'MWh', history: [4.5, 4.4, 4.3, 4.25, 4.2] },
      { name: 'Water Per Capita', value: 130, unit: 'm³/year', history: [140, 137, 135, 132, 130] }
    ]
  },
  {
    id: 'goods',
    label: 'Goods & Services Market Stability',
    type: 'stock',
    color: '#64748B', // slate-500
    position: { x: 200, y: 200, z: 0 },
    subIndicators: [
      { name: 'Supply/Demand Balance', value: 0.95, unit: '', history: [0.88, 0.90, 0.92, 0.94, 0.95] },
      { name: 'Global Market Integration', value: 68, unit: '%', history: [60, 62, 64, 66, 68] },
      { name: 'Service Delivery Index', value: 72, unit: '', history: [65, 67, 69, 71, 72] }
    ]
  },
  {
    id: 'social',
    label: 'Social Cohesion',
    type: 'stock',
    color: '#1E40AF', // blue-800
    position: { x: 0, y: 200, z: 0 },
    subIndicators: [
      { name: 'Education Attainment', value: 74, unit: '%', history: [68, 70, 71, 73, 74] },
      { name: 'Health Coverage', value: 82, unit: '%', history: [75, 77, 79, 81, 82] },
      { name: 'Social Trust Index', value: 68, unit: '', history: [60, 63, 65, 67, 68] }
    ]
  }
];

const mockEdges: Edge[] = [
  { id: 'r1', source: 'population', target: 'resources', type: 'reinforcing', label: 'R1' },
  { id: 'b1', source: 'resources', target: 'population', type: 'balancing', label: 'B1' },
  { id: 'r2', source: 'population', target: 'goods', type: 'reinforcing', label: 'R2' },
  { id: 'b2', source: 'goods', target: 'population', type: 'balancing', label: 'B2' },
  { id: 'r3', source: 'population', target: 'social', type: 'reinforcing', label: 'R3' },
  { id: 'r4', source: 'social', target: 'population', type: 'reinforcing', label: 'R4' },
  { id: 'r5', source: 'resources', target: 'goods', type: 'reinforcing', label: 'R5' },
  { id: 'b3', source: 'goods', target: 'resources', type: 'balancing', label: 'B3' },
  { id: 'r6', source: 'goods', target: 'social', type: 'reinforcing', label: 'R6' },
  { id: 'r7', source: 'social', target: 'goods', type: 'reinforcing', label: 'R7' },
  { id: 'b4', source: 'resources', target: 'social', type: 'balancing', label: 'B4' },
  { id: 'r8', source: 'social', target: 'resources', type: 'reinforcing', label: 'R8' }
];

// Mini sparkline chart component
const SparklineChart: React.FC<{ data: number[] }> = ({ data }) => {
  const width = 80;
  const height = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  // Calculate points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="ml-2">
      <polyline
        points={points}
        fill="none"
        stroke="#14B8A6"
        strokeWidth="2"
      />
    </svg>
  );
};

// Node popup component for both 2D and 3D views
const NodePopup: React.FC<{ node: Node | null, onClose: () => void }> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg border border-white/20 p-4 w-[300px] text-left">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium" style={{ color: node.color }}>{node.label}</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
          <X size={16} />
        </button>
      </div>
      <div className="space-y-2">
        {node.subIndicators?.map((indicator) => (
          <div key={indicator.name} className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-300">{indicator.name}: </span>
              <span className="text-white font-medium">
                {indicator.value} {indicator.unit || ''}
              </span>
            </div>
            {indicator.history && <SparklineChart data={indicator.history} />}
          </div>
        ))}
      </div>
    </div>
  );
};

// 3D components
const Node3D: React.FC<{ 
  node: Node, 
  selectedNode: Node | null,
  onSelect: (node: Node) => void 
}> = ({ node, selectedNode, onSelect }) => {
  const isSelected = selectedNode?.id === node.id;
  const [hovered, setHovered] = useState(false);
  const size = node.size || 1.2;
  
  return (
    <group position={[node.position?.x || 0, 0, node.position?.y || 0]}>
      <mesh
        onClick={() => onSelect(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered || isSelected ? 1.1 : 1}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhysicalMaterial 
          color={node.color} 
          transmission={0.8}
          roughness={0.1}
          metalness={0.5}
          emissive={hovered || isSelected ? node.color : '#000000'}
          emissiveIntensity={hovered || isSelected ? 0.5 : 0}
        />
      </mesh>
      
      {node.label && (
        <Html position={[0, size + 0.5, 0]} center>
          <div className="text-sm font-medium px-2 py-1 rounded-md bg-black/50 text-white whitespace-nowrap">
            {node.label}
          </div>
        </Html>
      )}
      
      {isSelected && (
        <Html position={[0, size + 2, 0]} center>
          <NodePopup node={node} onClose={() => onSelect(node)} />
        </Html>
      )}
    </group>
  );
};

// Simplified Edge3D component that avoids using problematic drei components
const Edge3D: React.FC<{ edge: Edge, nodes: Node[] }> = ({ edge, nodes }) => {
  const sourceNode = nodes.find(node => node.id === edge.source);
  const targetNode = nodes.find(node => node.id === edge.target);
  
  if (!sourceNode || !targetNode || !sourceNode.position || !targetNode.position) return null;
  
  // Use primitive array values instead of Vector3 objects to avoid type issues
  const sourcePos = [sourceNode.position.x || 0, 0, sourceNode.position.y || 0];
  const targetPos = [targetNode.position.x || 0, 0, targetNode.position.y || 0];
  
  // Calculate midpoint for label positioning
  const midX = (sourcePos[0] + targetPos[0]) / 2;
  const midY = 1.5; // Fixed height for midpoint
  const midZ = (sourcePos[2] + targetPos[2]) / 2;
  
  // Determine edge color
  let color;
  switch (edge.type) {
    case 'reinforcing':
      color = '#14B8A6'; // teal for reinforcing
      break;
    case 'balancing':
      color = '#F97316'; // orange for balancing
      break;
    default:
      color = '#94A3B8'; // gray for auxiliary
  }
  
  // Create a simple line using primitive THREE.js objects
  return (
    <group>
      {/* Basic line segment using buffer geometry */}
      <primitive object={new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(sourcePos[0], sourcePos[1], sourcePos[2]),
          new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2])
        ]),
        new THREE.LineBasicMaterial({ color: color, linewidth: 2 })
      )} />
      
      {/* Label for the edge */}
      {edge.label && (
        <Html position={[midX, midY + 0.5, midZ]} center>
          <div className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
            edge.type === 'reinforcing' ? 'bg-teal-500/80' : 'bg-orange-500/80'
          } text-white`}>
            {edge.label}
          </div>
        </Html>
      )}
    </group>
  );
};

const Scene3D: React.FC<{ 
  nodes: Node[], 
  edges: Edge[],
  selectedNode: Node | null,
  onSelectNode: (node: Node) => void
}> = ({ nodes, edges, selectedNode, onSelectNode }) => {
  return (
    <Canvas
      orthographic
      camera={{ position: [15, 15, 15], zoom: 40, near: 0.1, far: 1000 }}
      className="w-full aspect-video bg-navy-800/50 rounded-lg"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#14B8A6" />
      
      <OrbitControls
        enableRotate
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 6} // Limit vertical rotation
        maxPolarAngle={Math.PI / 3}
        enableZoom
        enablePan
      />
      
      {nodes.map(node => (
        <Node3D 
          key={node.id} 
          node={node} 
          selectedNode={selectedNode}
          onSelect={onSelectNode} 
        />
      ))}
      
      {edges.map(edge => (
        <Edge3D key={edge.id} edge={edge} nodes={nodes} />
      ))}
    </Canvas>
  );
};

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

  // Cytoscape configuration
  const cytoElements = [
    ...mockNodes.map(node => ({
      data: {
        id: node.id,
        label: node.label,
        type: node.type,
        color: node.color,
        subIndicators: node.subIndicators
      },
      position: {
        x: node.position?.x || 0,
        y: node.position?.y || 0
      }
    })),
    ...mockEdges.map(edge => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        label: edge.label
      }
    }))
  ];

  const cytoStyle = [
    {
      selector: 'node',
      style: {
        'width': 80,
        'height': 80,
        'background-color': 'data(color)',
        'label': 'data(label)',
        'color': '#ffffff',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '70px',
        'font-size': '10px',
        'text-outline-color': '#000000',
        'text-outline-width': '1px',
        'border-width': '2px',
        'border-color': '#ffffff',
        'border-opacity': 0.5
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': ele => ele.data('type') === 'reinforcing' ? '#14B8A6' : 
                           ele.data('type') === 'balancing' ? '#F97316' : '#94A3B8',
        'target-arrow-color': ele => ele.data('type') === 'reinforcing' ? '#14B8A6' : 
                               ele.data('type') === 'balancing' ? '#F97316' : '#94A3B8',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'control-point-step-size': 40,
        'label': 'data(label)',
        'font-size': '12px',
        'color': '#ffffff',
        'text-outline-color': ele => ele.data('type') === 'reinforcing' ? '#14B8A6' : 
                               ele.data('type') === 'balancing' ? '#F97316' : '#94A3B8',
        'text-outline-width': '2px',
        'text-outline-opacity': 0.8,
        'text-background-opacity': 1,
        'text-background-shape': 'round-rectangle',
        'text-background-padding': '2px'
      }
    },
    {
      selector: 'node:hover',
      style: {
        'border-width': '3px',
        'border-color': '#14B8A6',
        'box-shadow': '0 0 15px #14B8A6'
      }
    }
  ];

  const handleCyNodeClick = (e: any) => {
    const nodeData = e.target.data();
    const node = mockNodes.find(n => n.id === nodeData.id);
    if (node) {
      handleNodeClick(node);
    }
  };

  const cytoOptions = {
    layout: {
      name: 'concentric',
      concentric: function(node: any) {
        return node.data('type') === 'stock' ? 2 : 1;
      },
      levelWidth: function() { return 1; }
    },
    style: cytoStyle
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
          <div className="w-full h-full">
            <CytoScape
              elements={cytoElements}
              style={{ width: '100%', height: '100%' }}
              stylesheet={cytoStyle}
              cy={(cy) => {
                cyRef.current = cy;
                cy.on('tap', 'node', handleCyNodeClick);
                cy.layout(cytoOptions.layout).run();
              }}
            />
          </div>
        ) : (
          <Scene3D 
            nodes={mockNodes} 
            edges={mockEdges} 
            selectedNode={selectedNode}
            onSelectNode={handleNodeClick}
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
