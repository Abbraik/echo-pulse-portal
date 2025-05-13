
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
  
  // Create points array directly with position arrays
  const points = [sourcePos, targetPos];
  
  // Use ref for animation
  const opacityRef = useRef(0.2);
  
  // Animate pulse effect
  useFrame(({ clock }) => {
    if (isHighlighted) {
      opacityRef.current = 0.6 + Math.sin(clock.getElapsedTime() * 4) * 0.4;
    } else {
      opacityRef.current = 0.2;
    }
  });
  
  return (
    <Line
      points={points}
      color={isHighlighted ? '#94A3B8' : '#64748B'}
      lineWidth={thickness}
      transparent
      opacity={opacityRef.current}
    />
  );
};

export default ActorEdge;
