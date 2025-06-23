
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CLDNode, CLDConnector, IsometricViewport, ToolType } from '../types/isometric-cld-types';
import { motion } from 'framer-motion';

interface IsometricNodeProps {
  node: CLDNode;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
  onDrag: (nodeId: string, x: number, y: number) => void;
  isHovered: boolean;
  onHover: (nodeId: string | null) => void;
}

const IsometricNode: React.FC<IsometricNodeProps> = ({
  node,
  isSelected,
  onSelect,
  onDrag,
  isHovered,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    onSelect(node.id);
  }, [node.id, onSelect]);

  const handlePointerMove = useCallback((e: any) => {
    if (isDragging) {
      const newX = e.point.x;
      const newY = e.point.z; // In isometric view, Z is the "depth" axis
      onDrag(node.id, newX, newY);
    }
  }, [isDragging, node.id, onDrag]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <group position={[node.x, 0, node.y]}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={() => onHover(node.id)}
        onPointerLeave={() => onHover(null)}
      >
        <boxGeometry args={[node.width / 10, 0.2, node.height / 10]} />
        <meshPhongMaterial
          color={node.color}
          transparent
          opacity={0.8}
          emissive={isHovered ? '#14b8a6' : '#000000'}
          emissiveIntensity={isHovered ? 0.3 : 0}
        />
      </mesh>
      
      <Html position={[0, 0.15, 0]} center>
        <motion.div
          className={`glass-panel p-3 rounded-xl min-w-32 text-center cursor-pointer ${
            isSelected ? 'ring-2 ring-teal-400' : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'rgba(20, 30, 50, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isHovered 
              ? '0 0 20px rgba(20, 184, 166, 0.5), inset 0 0 20px rgba(20, 184, 166, 0.1)'
              : '0 8px 24px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="text-sm font-medium text-white">{node.label}</div>
          <div className="text-xs text-gray-300 mt-1">{node.type}</div>
        </motion.div>
      </Html>
    </group>
  );
};

interface IsometricConnectorProps {
  connector: CLDConnector;
  fromNode: CLDNode;
  toNode: CLDNode;
}

const IsometricConnector: React.FC<IsometricConnectorProps> = ({
  connector,
  fromNode,
  toNode
}) => {
  const points = [
    new THREE.Vector3(fromNode.x, 0.1, fromNode.y),
    ...connector.bends.map(bend => new THREE.Vector3(bend.x, 0.1, bend.y)),
    new THREE.Vector3(toNode.x, 0.1, toNode.y)
  ];

  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(50);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={curvePoints.length}
          array={new Float32Array(curvePoints.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={connector.type === 'reinforcing' ? '#14b8a6' : '#ef4444'}
        linewidth={2}
        linecap="round"
        linejoin="round"
      />
    </line>
  );
};

interface IsometricCLDCanvasProps {
  nodes: CLDNode[];
  connectors: CLDConnector[];
  viewport: IsometricViewport;
  activeTool: ToolType;
  onNodeSelect: (nodeId: string) => void;
  onNodeDrag: (nodeId: string, x: number, y: number) => void;
  onViewportChange: (viewport: IsometricViewport) => void;
  selectedNodeId: string | null;
  className?: string;
}

const CameraController: React.FC<{ viewport: IsometricViewport; onViewportChange: (viewport: IsometricViewport) => void }> = ({
  viewport,
  onViewportChange
}) => {
  const { camera, gl } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.position.set(viewport.x, 10, viewport.y + 10);
      camera.lookAt(viewport.x, 0, viewport.y);
      camera.zoom = viewport.zoom;
      camera.updateProjectionMatrix();
    }
  }, [camera, viewport]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * -0.001;
      const newZoom = Math.max(0.5, Math.min(3, viewport.zoom + zoomDelta));
      onViewportChange({ ...viewport, zoom: newZoom });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.buttons === 1) { // Left mouse button
        const deltaX = e.movementX * 0.01;
        const deltaY = e.movementY * 0.01;
        onViewportChange({
          ...viewport,
          x: viewport.x - deltaX,
          y: viewport.y - deltaY
        });
      }
    };

    gl.domElement.addEventListener('wheel', handleWheel);
    gl.domElement.addEventListener('pointermove', handlePointerMove);

    return () => {
      gl.domElement.removeEventListener('wheel', handleWheel);
      gl.domElement.removeEventListener('pointermove', handlePointerMove);
    };
  }, [gl, viewport, onViewportChange]);

  return null;
};

export const IsometricCLDCanvas: React.FC<IsometricCLDCanvasProps> = ({
  nodes,
  connectors,
  viewport,
  activeTool,
  onNodeSelect,
  onNodeDrag,
  onViewportChange,
  selectedNodeId,
  className = ''
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <OrthographicCamera
          makeDefault
          zoom={viewport.zoom}
          position={[viewport.x, 10, viewport.y + 10]}
          rotation={[Math.PI * -0.3, Math.PI * 0.25, 0]}
        />
        
        <CameraController viewport={viewport} onViewportChange={onViewportChange} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        {/* Grid */}
        <gridHelper args={[20, 20, '#333333', '#333333']} rotation={[0, 0, 0]} />

        {/* Render connectors first (behind nodes) */}
        {connectors.map(connector => {
          const fromNode = nodes.find(n => n.id === connector.from);
          const toNode = nodes.find(n => n.id === connector.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <IsometricConnector
              key={connector.id}
              connector={connector}
              fromNode={fromNode}
              toNode={toNode}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map(node => (
          <IsometricNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={onNodeSelect}
            onDrag={onNodeDrag}
            isHovered={hoveredNodeId === node.id}
            onHover={setHoveredNodeId}
          />
        ))}
      </Canvas>
    </div>
  );
};
