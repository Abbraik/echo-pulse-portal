
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  // Calculate line thickness based on weight
  const thickness = 0.5 + weight * 2;
  
  // Create a straight line between source and target
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...sourcePos),
      new THREE.Vector3(...targetPos)
    ];
  }, [sourcePos, targetPos]);
  
  // Create geometry
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);
  
  // Animate pulse effect
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Pulsate opacity
      if (isHighlighted) {
        materialRef.current.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 4) * 0.4;
        materialRef.current.color.set(new THREE.Color('#94A3B8')); // Highlight color
      } else {
        materialRef.current.opacity = 0.2;
        materialRef.current.color.set(new THREE.Color('#64748B')); // Default color
      }
    }
  });
  
  return (
    <primitive object={new THREE.Line(geometry, 
      <lineBasicMaterial
        attach="material" 
        ref={materialRef as any}
        color="#64748B"
        transparent
        opacity={0.2}
        linewidth={thickness}
      />
    )} />
  );
};

export default ActorEdge;
