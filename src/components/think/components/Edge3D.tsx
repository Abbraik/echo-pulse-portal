
import React, { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import { Edge, Node } from '../types/system-framing-types';
import { Vector3 } from 'three';

interface Edge3DProps {
  edge: Edge;
  nodes: Node[];
}

const Edge3D: React.FC<Edge3DProps> = ({ edge, nodes }) => {
  const sourceNode = nodes.find(node => node.id === edge.source);
  const targetNode = nodes.find(node => node.id === edge.target);
  
  if (!sourceNode || !targetNode || !sourceNode.position || !targetNode.position) return null;
  
  // Pre-compute all the necessary values
  const { points, midPoint, color } = useMemo(() => {
    // Create points for the line - explicitly defining as Vector3 array for type safety
    const sourcePoint = new Vector3(sourceNode.position?.x || 0, 0, sourceNode.position?.y || 0);
    const targetPoint = new Vector3(targetNode.position?.x || 0, 0, targetNode.position?.y || 0);
    
    // Calculate midpoint for label positioning
    const mid = {
      x: (sourcePoint.x + targetPoint.x) / 2,
      y: 1.5, // Fixed height for midpoint
      z: (sourcePoint.z + targetPoint.z) / 2
    };
    
    // Determine edge color
    let edgeColor;
    switch (edge.type) {
      case 'reinforcing':
        edgeColor = '#14B8A6'; // teal for reinforcing
        break;
      case 'balancing':
        edgeColor = '#F97316'; // orange for balancing
        break;
      default:
        edgeColor = '#94A3B8'; // gray for auxiliary
    }
    
    return {
      points: [sourcePoint, targetPoint], // Using Vector3 objects which are compatible with the Line component
      midPoint: mid,
      color: edgeColor
    };
  }, [sourceNode.position, targetNode.position, edge.type]);
  
  return (
    <group>
      {/* Use @react-three/drei Line component */}
      <Line
        points={points}
        color={color}
        lineWidth={1}
      />
      
      {/* Label for the edge */}
      {edge.label && (
        <Html position={[midPoint.x, midPoint.y + 0.5, midPoint.z]} center>
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
