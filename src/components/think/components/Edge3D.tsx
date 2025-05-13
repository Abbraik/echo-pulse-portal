
import React, { useMemo } from 'react';
import { Line } from '@react-three/drei/core/Line';
import { Html } from '@react-three/drei/core/Html';
import { Edge, Node } from '../types/system-framing-types';
import { THREE } from '../three-imports';

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
    // Create points for the line using array format which is compatible with Line component
    const sourcePoint = [sourceNode.position?.x || 0, 0, sourceNode.position?.y || 0];
    const targetPoint = [targetNode.position?.x || 0, 0, targetNode.position?.y || 0];
    
    // Calculate midpoint for label positioning
    const mid = {
      x: (sourcePoint[0] + targetPoint[0]) / 2,
      y: 1.5, // Fixed height for midpoint
      z: (sourcePoint[2] + targetPoint[2]) / 2
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
      points: [sourcePoint, targetPoint], // Using array format that Line accepts
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
