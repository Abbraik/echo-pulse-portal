
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';

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
  
  // Instead of creating Vector3 objects, use arrays directly
  // This avoids the type mismatch between different THREE.Vector3 implementations
  const points = [
    sourcePos,
    targetPos
  ];
  
  // Use ref for animation
  const opacityRef = useRef({ value: 0.2 });
  
  // Animate pulse effect
  useFrame(({ clock }) => {
    if (isHighlighted) {
      opacityRef.current.value = 0.6 + Math.sin(clock.getElapsedTime() * 4) * 0.4;
    } else {
      opacityRef.current.value = 0.2;
    }
  });
  
  return (
    <Line
      points={points}
      color={isHighlighted ? '#94A3B8' : '#64748B'}
      lineWidth={thickness}
      transparent
      opacity={opacityRef.current.value}
    />
  );
};

export default ActorEdge;
