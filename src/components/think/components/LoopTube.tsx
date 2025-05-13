
import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomLine } from '@react-three/drei';
import * as THREE from 'three';

interface LoopTubeProps {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  type: 'reinforcing' | 'balancing';
  isHighlighted: boolean;
}

const LoopTube: React.FC<LoopTubeProps> = ({ fromPos, toPos, type, isHighlighted }) => {
  // Determine color based on loop type
  const color = type === 'reinforcing' ? '#14B8A6' : '#F97316'; // teal or orange
  
  // Create a curved path between the two points
  const curvePoints = useMemo(() => {
    // Calculate midpoint elevated for a curve
    const midX = (fromPos[0] + toPos[0]) / 2;
    const midY = (fromPos[1] + toPos[1]) / 2 + 1.5; // Elevated midpoint
    const midZ = (fromPos[2] + toPos[2]) / 2;
    
    // Return points for the curved line
    return [
      new THREE.Vector3(...fromPos),
      new THREE.Vector3(midX, midY, midZ),
      new THREE.Vector3(...toPos)
    ];
  }, [fromPos, toPos]);

  // Animation values
  const dashOffset = useMemo(() => ({ value: 0 }), []);
  
  // Animate flow direction
  useFrame((state) => {
    if (type === 'reinforcing') {
      // Flow in the direction of reinforcement
      dashOffset.value = -state.clock.getElapsedTime() * 0.5;
    } else {
      // Flow in the opposite direction for balancing
      dashOffset.value = state.clock.getElapsedTime() * 0.5;
    }
  });

  // Use more compatible approach with CatmullRomLine
  return (
    <CatmullRomLine
      points={curvePoints}
      color={color}
      lineWidth={5}
      dashed
      dashSize={0.1}
      dashOffset={dashOffset.value}
      dashScale={10}
      opacity={isHighlighted ? 0.8 : 0.5}
      transparent
    />
  );
};

export default LoopTube;
