
import React, { useMemo, useState } from 'react';
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
  
  // Create a straight line between source and target
  const points = useMemo(() => {
    return [sourcePos, targetPos];
  }, [sourcePos, targetPos]);
  
  // Track animation state
  const [opacity, setOpacity] = useState(0.2);
  
  // Animate pulse effect
  useFrame(({ clock }) => {
    if (isHighlighted) {
      setOpacity(0.6 + Math.sin(clock.getElapsedTime() * 4) * 0.4);
    } else {
      setOpacity(0.2);
    }
  });
  
  return (
    <Line
      points={points}
      color={isHighlighted ? '#94A3B8' : '#64748B'}
      lineWidth={thickness}
      transparent
      opacity={opacity}
    />
  );
};

export default ActorEdge;
