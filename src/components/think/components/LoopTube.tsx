
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

interface LoopTubeProps {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  type: 'reinforcing' | 'balancing';
  isHighlighted: boolean;
}

const LoopTube: React.FC<LoopTubeProps> = ({ fromPos, toPos, type, isHighlighted }) => {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Determine color based on loop type
  const color = type === 'reinforcing' ? '#14B8A6' : '#F97316'; // teal or orange
  
  // Create a curved path between the two points
  const curvePoints = useMemo(() => {
    // Calculate midpoint elevated for a curve
    const midX = (fromPos[0] + toPos[0]) / 2;
    const midY = (fromPos[1] + toPos[1]) / 2;
    const midZ = (fromPos[2] + toPos[2]) / 2;
    
    return [
      new THREE.Vector3(...fromPos),
      new THREE.Vector3(midX, midY + 1.5, midZ), // Elevated midpoint
      new THREE.Vector3(...toPos)
    ];
  }, [fromPos, toPos]);
  
  // Create animation state
  const [dashOffset, setDashOffset] = React.useState(0);
  
  // Animate flow direction
  useFrame(({ clock }) => {
    if (type === 'reinforcing') {
      // Flow in the direction of reinforcement
      setDashOffset(-clock.getElapsedTime() * 0.5);
    } else {
      // Flow in the opposite direction for balancing
      setDashOffset(clock.getElapsedTime() * 0.5);
    }
  });

  return (
    <Line
      points={curvePoints}
      color={color}
      lineWidth={5}
      dashed
      dashSize={0.1}
      dashOffset={dashOffset}
      dashScale={10}
      transparent
      opacity={isHighlighted ? 0.8 : 0.5}
      alphaWrite={false}
    />
  );
};

export default LoopTube;
