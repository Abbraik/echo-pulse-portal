
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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
  const tubeGeometry = useMemo(() => {
    // Calculate midpoint elevated for a curve
    const midX = (fromPos[0] + toPos[0]) / 2;
    const midY = (fromPos[1] + toPos[1]) / 2;
    const midZ = (fromPos[2] + toPos[2]) / 2;
    
    // Create a curve with elevation in the middle
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...fromPos),
      new THREE.Vector3(midX, midY + 1.5, midZ), // Elevated midpoint
      new THREE.Vector3(...toPos)
    ]);
    
    return new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
  }, [fromPos, toPos]);
  
  // Animate dash pattern for the tube
  useFrame(({ clock }) => {
    if (materialRef.current) {
      if (type === 'reinforcing') {
        // Flow in the direction of reinforcement
        materialRef.current.dashOffset = -clock.getElapsedTime() * 0.5;
      } else {
        // Flow in the opposite direction for balancing
        materialRef.current.dashOffset = clock.getElapsedTime() * 0.5;
      }
      
      // Highlight the tube if related nodes are hovered
      materialRef.current.emissiveIntensity = isHighlighted ? 0.6 : 0.2;
    }
  });
  
  return (
    <mesh geometry={tubeGeometry} castShadow>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.8}
        dashSize={0.1}
        gapSize={0.1}
        dashOffset={0}
        defines={{ USE_DASH: "" }} // Enable dashed lines
      />
    </mesh>
  );
};

export default LoopTube;
