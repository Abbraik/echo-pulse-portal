
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Octahedron } from '@react-three/drei';
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
  // Use state instead of ref for position animation
  const [floatY, setFloatY] = useState(position[1]);
  const [rotation, setRotation] = useState(0);
  
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
    if (isHovered) {
      // Float up and down
      setFloatY(position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      
      // Slowly rotate
      setRotation(prev => prev + 0.01);
    } else {
      // Smoothly return to original position
      setFloatY(prev => THREE.MathUtils.lerp(prev, position[1], 0.1));
    }
  });

  const actorColor = getActorColor();
  const meshPosition: [number, number, number] = [position[0], floatY, position[2]];

  return (
    <group position={meshPosition} rotation={[0, rotation, 0]}>
      <mesh
        castShadow
        onPointerOver={onHover}
        onPointerOut={onBlur}
        onClick={onClick}
      >
        <Octahedron args={[size, 0]}>
          <meshStandardMaterial
            color={actorColor}
            roughness={0.4}
            metalness={0.6}
            emissive={actorColor}
            emissiveIntensity={isHovered ? 0.8 : 0.3}
          />
        </Octahedron>
      </mesh>
      
      {/* Actor label */}
      <Html position={[0, 0.7, 0]}>
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
