
import React from 'react';
import { Html } from '@react-three/drei';
import { THREE } from '../three-imports';
import { Edge, Node } from '../types/system-framing-types';

interface Edge3DProps {
  edge: Edge;
  nodes: Node[];
}

const Edge3D: React.FC<Edge3DProps> = ({ edge, nodes }) => {
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

export default Edge3D;
