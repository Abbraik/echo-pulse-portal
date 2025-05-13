
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

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
  // Use state for scale animation
  const [scale, setScale] = useState(1 + (value - 50) / 100);
  
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
    if (isHovered) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.03;
      setScale((1 + (value - 50) / 100) * pulseScale);
    } else {
      // Smooth transition back to normal size
      const targetScale = 1 + (value - 50) / 100;
      setScale(prevScale => targetScale * 0.1 + prevScale * 0.9); // Simple lerp
    }
  });

  const nodeColor = getNodeColor();

  return (
    <group position={position}>
      <mesh
        castShadow
        receiveShadow
        onPointerOver={onHover}
        onPointerOut={onBlur}
        onClick={onClick}
        scale={scale}
      >
        <icosahedronGeometry args={[0.8, 1]} />
        <meshPhysicalMaterial
          color={nodeColor}
          transmission={0.3}
          thickness={1.5}
          roughness={0.3}
          metalness={0.2}
          emissive={nodeColor}
          emissiveIntensity={isHovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Node label */}
      <Html position={[0, -1.2, 0]}>
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
