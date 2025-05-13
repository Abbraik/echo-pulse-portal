
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface NodeMeshProps {
  id: string;
  position: [number, number, number];
  value: number;
  isHovered: boolean;
  onHover: () => void;
  onBlur: () => void;
  onClick: () => void;
}

const NodeMesh: React.FC<NodeMeshProps> = ({
  id,
  position,
  value,
  isHovered,
  onHover,
  onBlur,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calculate size based on value (50-100 range maps to 1.0-1.5 size)
  const size = 1 + (value - 50) / 100;
  
  // Colors based on node types (derived from id)
  const getNodeColor = () => {
    switch (id) {
      case 'population':
        return '#14B8A6'; // teal-500
      case 'resources':
        return '#60A5FA'; // blue-400
      case 'goods':
        return '#64748B'; // slate-500
      case 'social':
        return '#1E40AF'; // blue-800
      default:
        return '#14B8A6'; // default teal
    }
  };

  // Pulse animation on hover
  useFrame((state) => {
    if (!meshRef.current) return;
    if (isHovered) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.03;
      meshRef.current.scale.setScalar(size * pulseScale);
    } else {
      // Smooth transition back to normal size
      meshRef.current.scale.lerp(
        new THREE.Vector3(size, size, size),
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
        receiveShadow
        onPointerOver={onHover}
        onPointerOut={onBlur}
        onClick={onClick}
      >
        <icosahedronGeometry args={[0.8, 1]} />
        <meshPhysicalMaterial
          color={getNodeColor()}
          transmission={0.3}
          thickness={1.5}
          roughness={0.3}
          metalness={0.2}
          emissive={getNodeColor()}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Node label */}
      <Html position={[position[0], position[1] - 1.2, position[2]]}>
        <div className="text-center pointer-events-none select-none">
          <span className="text-white text-xs font-medium px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </span>
        </div>
      </Html>
    </group>
  );
};

export default NodeMesh;
