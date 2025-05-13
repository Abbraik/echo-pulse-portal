
import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Node } from '../types/system-framing-types';
import NodePopup from './NodePopup';

interface Node3DProps {
  node: Node;
  selectedNode: Node | null;
  onSelect: (node: Node) => void;
}

const Node3D: React.FC<Node3DProps> = ({ node, selectedNode, onSelect }) => {
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

export default Node3D;
