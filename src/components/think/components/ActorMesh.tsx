
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ActorMeshProps {
  id: string;
  type: 'government' | 'private' | 'ngo';
  weight: number;
  position: [number, number, number];
  isHovered: boolean;
  onHover: () => void;
  onBlur: () => void;
  onClick: () => void;
}

const ActorMesh: React.FC<ActorMeshProps> = ({
  id,
  type,
  weight,
  position,
  isHovered,
  onHover,
  onBlur,
  onClick,
}) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  // Calculate size based on actor weight
  const size = 0.4 + weight * 0.4;

  // Determine color based on actor type
  const getActorColor = () => {
    switch (type) {
      case 'government':
        return '#10B981'; // emerald-500
      case 'private':
        return '#64748B'; // slate-500
      case 'ngo':
        return '#8B5CF6'; // violet-500
      default:
        return '#64748B'; // default slate
    }
  };

  // Animate hover effect
  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (isHovered) {
      // Float up and down
      const floatY = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.position.y = floatY;
      
      // Slowly rotate
      meshRef.current.rotation.y += 0.01;
    } else {
      // Smoothly return to original position
      meshRef.current.position.lerp(
        new THREE.Vector3(position[0], position[1], position[2]),
        0.1
      );
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        castShadow
        onPointerOver={onHover}
        onPointerOut={onBlur}
        onClick={onClick}
      >
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={getActorColor()}
          roughness={0.4}
          metalness={0.6}
          emissive={getActorColor()}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Actor label */}
      <Html position={[position[0], position[1] + 0.7, position[2]]}>
        <div className="text-center pointer-events-none select-none">
          <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm">
            {id}
          </span>
        </div>
      </Html>
    </group>
  );
};

export default ActorMesh;
