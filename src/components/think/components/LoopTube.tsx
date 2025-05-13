
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomLine } from '@react-three/drei';

interface LoopTubeProps {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  type: 'reinforcing' | 'balancing';
  isHighlighted: boolean;
}

const LoopTube: React.FC<LoopTubeProps> = ({ fromPos, toPos, type, isHighlighted }) => {
  // Determine color based on loop type
  const color = type === 'reinforcing' ? '#14B8A6' : '#F97316'; // teal or orange
  
  // Calculate middle point
  const midPoint: [number, number, number] = [
    (fromPos[0] + toPos[0]) / 2,
    (fromPos[1] + toPos[1]) / 2 + 1.5,
    (fromPos[2] + toPos[2]) / 2
  ];
  
  // Create curve points
  const curvePoints = [fromPos, midPoint, toPos];
  
  // Use state for animation instead of ref
  const [dashOffset, setDashOffset] = useState(0);
  
  // Animate flow direction
  useFrame((state) => {
    if (type === 'reinforcing') {
      // Flow in the direction of reinforcement
      setDashOffset(-state.clock.getElapsedTime() * 0.5);
    } else {
      // Flow in the opposite direction for balancing
      setDashOffset(state.clock.getElapsedTime() * 0.5);
    }
  });

  return (
    <CatmullRomLine
      points={curvePoints}
      color={color}
      lineWidth={5}
      dashed
      dashSize={0.1}
      dashOffset={dashOffset}
      dashScale={10}
      opacity={isHighlighted ? 0.8 : 0.5}
      transparent
    />
  );
};

export default LoopTube;
