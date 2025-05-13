
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
  
  // Create points using THREE.Vector3 objects
  const sourcePos = new THREE.Vector3(sourceNode.position.x || 0, 0, sourceNode.position.y || 0);
  const targetPos = new THREE.Vector3(targetNode.position.x || 0, 0, targetNode.position.y || 0);
  
  // Calculate midpoint for label positioning
  const midX = (sourcePos.x + targetPos.x) / 2;
  const midY = 1.5; // Fixed height for midpoint
  const midZ = (sourcePos.z + targetPos.z) / 2;
  
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
  
  // Create points array for line
  const points = [sourcePos, targetPos];
  
  // Create geometry and material manually
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: color });
  
  return (
    <group>
      {/* Use primitive instead of Line component */}
      <primitive object={new THREE.Line(geometry, material)} />
      
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
