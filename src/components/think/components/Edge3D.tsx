
import React, { useMemo } from 'react';
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
  
  // Pre-compute all the necessary values to avoid unnecessary re-renders
  const { sourcePos, targetPos, midPoint, color, lineGeometry } = useMemo(() => {
    // Create points using THREE.Vector3 objects
    const source = new THREE.Vector3(sourceNode.position.x || 0, 0, sourceNode.position.y || 0);
    const target = new THREE.Vector3(targetNode.position.x || 0, 0, targetNode.position.y || 0);
    
    // Calculate midpoint for label positioning
    const mid = {
      x: (source.x + target.x) / 2,
      y: 1.5, // Fixed height for midpoint
      z: (source.z + target.z) / 2
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
    
    // Create geometry for the line
    const points = [source, target];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    
    return {
      sourcePos: source,
      targetPos: target,
      midPoint: mid,
      color: edgeColor,
      lineGeometry: geo
    };
  }, [sourceNode.position, targetNode.position, edge.type]);
  
  return (
    <group>
      {/* Use mesh with line geometry instead of Line component */}
      <lineSegments>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial color={color} attach="material" />
      </lineSegments>
      
      {/* Label for the edge - using drei's Html component which should be compatible */}
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
