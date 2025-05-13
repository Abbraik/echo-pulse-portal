
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LoopTubeProps {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  type: 'reinforcing' | 'balancing';
  isHighlighted: boolean;
}

const LoopTube: React.FC<LoopTubeProps> = ({ fromPos, toPos, type, isHighlighted }) => {
  // Create reference for the line
  const lineRef = useRef<THREE.Line>(null);
  
  // Determine color based on loop type
  const color = type === 'reinforcing' ? '#14B8A6' : '#F97316'; // teal or orange
  
  // Calculate middle point for curve
  const midPoint: [number, number, number] = [
    (fromPos[0] + toPos[0]) / 2,
    (fromPos[1] + toPos[1]) / 2 + 1.5,
    (fromPos[2] + toPos[2]) / 2
  ];
  
  // Animation state
  const [dashOffset, setDashOffset] = useState(0);
  
  // Create curve points
  const points = [
    new THREE.Vector3(fromPos[0], fromPos[1], fromPos[2]),
    new THREE.Vector3(midPoint[0], midPoint[1], midPoint[2]),
    new THREE.Vector3(toPos[0], toPos[1], toPos[2])
  ];
  
  // Create curve
  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(50);
  
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

  const opacity = isHighlighted ? 0.8 : 0.5;

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={curvePoints.length}
          array={new Float32Array(curvePoints.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineDashedMaterial
        color={color}
        dashSize={0.1}
        gapSize={0.1}
        opacity={opacity}
        transparent
        linewidth={1}
        dashOffset={dashOffset}
      />
    </line>
  );
};

export default LoopTube;
