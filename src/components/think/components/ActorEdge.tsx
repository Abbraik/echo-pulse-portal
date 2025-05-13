
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

interface ActorEdgeProps {
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
  weight: number;
  isHighlighted: boolean;
}

const ActorEdge: React.FC<ActorEdgeProps> = ({
  sourcePos,
  targetPos,
  weight,
  isHighlighted,
}) => {
  // Reference to the line
  const lineRef = useRef<THREE.Line>(null);
  
  // Calculate line thickness based on weight
  const thickness = 0.5 + weight * 2;
  
  // Use useState for animation value
  const [opacity, setOpacity] = useState(0.2);
  
  // Animate pulse effect using useFrame
  useFrame(({ clock }) => {
    if (isHighlighted) {
      setOpacity(0.6 + Math.sin(clock.getElapsedTime() * 4) * 0.4);
    } else {
      setOpacity(0.2);
    }
  });

  // Create points for line
  const points = [
    sourcePos,
    targetPos
  ].map(p => new THREE.Vector3(p[0], p[1], p[2]));
  
  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color={isHighlighted ? '#94A3B8' : '#64748B'}
        linewidth={thickness}
        transparent
        opacity={opacity}
      />
    </line>
  );
};

export default ActorEdge;
