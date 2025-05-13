
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Node, Edge } from '../types/system-framing-types';
import Node3D from './Node3D';
import Edge3D from './Edge3D';

interface Scene3DProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onSelectNode: (node: Node) => void;
}

const Scene3D: React.FC<Scene3DProps> = ({ nodes, edges, selectedNode, onSelectNode }) => {
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

export default Scene3D;
