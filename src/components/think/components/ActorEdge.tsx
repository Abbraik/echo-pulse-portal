
import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

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
  // Calculate line thickness based on weight
  const thickness = 0.5 + weight * 2;
  
  // Create a straight line between source and target
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...sourcePos),
      new THREE.Vector3(...targetPos)
    ];
  }, [sourcePos, targetPos]);
  
  // Use mutable object for opacity animation
  const opacityRef = useMemo(() => ({ value: 0.2 }), []);
  
  // Animate pulse effect
  useFrame(({ clock }) => {
    if (isHighlighted) {
      opacityRef.value = 0.6 + Math.sin(clock.getElapsedTime() * 4) * 0.4;
    } else {
      opacityRef.value = 0.2;
    }
  });
  
  return (
    <Line
      points={points}
      color={isHighlighted ? '#94A3B8' : '#64748B'}
      lineWidth={thickness}
      transparent
      opacity={opacityRef.value}
    />
  );
};

export default ActorEdge;
