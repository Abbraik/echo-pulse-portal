
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Node, Edge } from '../types/system-framing-types';
import Node3D from './Node3D';
import Edge3D from './Edge3D';
import * as THREE from 'three';

interface Scene3DProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  onSelectNode: (node: Node) => void;
}

const Scene3D: React.FC<Scene3DProps> = ({ nodes, edges, selectedNode, onSelectNode }) => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      className="w-full aspect-video bg-navy-800/50 rounded-lg"
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#080e1a']} />
        
        <PerspectiveCamera makeDefault position={[15, 15, 15]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#14B8A6" />
        
        {/* Controls */}
        <OrbitControls
          enableRotate
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 3}
          enableZoom
          enablePan
        />
        
        {/* Grid and environment */}
        <gridHelper args={[100, 100, '#172033', '#111827']} position={[0, -0.01, 0]} />
        
        {/* Render edges first so they appear behind nodes */}
        {edges.map(edge => (
          <Edge3D key={edge.id} edge={edge} nodes={nodes} />
        ))}
        
        {/* Render nodes */}
        {nodes.map(node => (
          <Node3D 
            key={node.id} 
            node={node} 
            selectedNode={selectedNode}
            onSelect={onSelectNode} 
          />
        ))}
        
        {/* Simple environment for better lighting */}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};

export default Scene3D;
