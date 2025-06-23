
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { CLDNode, CLDConnector, ViewportTransform } from '../types/isometric-cld-types';

interface IsometricCLDCanvasProps {
  nodes: CLDNode[];
  connectors: CLDConnector[];
  selectedNodeId: string | null;
  selectedTool: 'select' | 'pan' | 'add-node' | 'add-connector';
  viewportTransform: ViewportTransform;
  snapToGrid: boolean;
  gridSize: number;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  onNodeSelect: (nodeId: string) => void;
  onCanvasClick: (x: number, y: number) => void;
  onViewportChange: (transform: ViewportTransform) => void;
}

// Individual node component
const CLDNodeMesh: React.FC<{
  node: CLDNode;
  isSelected: boolean;
  onMove: (x: number, y: number) => void;
  onSelect: () => void;
}> = ({ node, isSelected, onMove, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.point.x, y: e.point.y });
    onSelect();
  }, [onSelect]);

  const handlePointerMove = useCallback((e: any) => {
    if (isDragging) {
      const deltaX = e.point.x - dragStart.x;
      const deltaY = e.point.y - dragStart.y;
      onMove(node.x + deltaX, node.y + deltaY);
      setDragStart({ x: e.point.x, y: e.point.y });
    }
  }, [isDragging, dragStart, node.x, node.y, onMove]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Convert isometric coordinates
  const isoX = (node.x - node.y) * 0.866;
  const isoY = (node.x + node.y) * 0.5 - node.z;

  return (
    <group position={[isoX, isoY, 0]}>
      {/* Node background */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[node.width / 50, node.height / 50]} />
        <meshBasicMaterial
          color={isSelected ? '#14b8a6' : node.color}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Node border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(node.width / 50, node.height / 50)]} />
        <lineBasicMaterial
          color={isSelected ? '#14b8a6' : '#ffffff'}
          transparent
          opacity={isSelected ? 1 : 0.3}
        />
      </lineSegments>

      {/* Node label */}
      <Html
        position={[0, 0, 0.01]}
        center
        style={{
          pointerEvents: 'none',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'medium',
          textAlign: 'center',
          width: `${node.width}px`,
          height: `${node.height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '0 0 4px rgba(0,0,0,0.8)'
        }}
      >
        {node.label}
      </Html>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[node.width / 80, node.width / 70, 32]} />
          <meshBasicMaterial color="#14b8a6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

// Connector component
const CLDConnectorMesh: React.FC<{
  connector: CLDConnector;
  nodes: CLDNode[];
}> = ({ connector, nodes }) => {
  const fromNode = nodes.find(n => n.id === connector.from);
  const toNode = nodes.find(n => n.id === connector.to);

  if (!fromNode || !toNode) return null;

  // Convert to isometric coordinates
  const fromIsoX = (fromNode.x - fromNode.y) * 0.866;
  const fromIsoY = (fromNode.x + fromNode.y) * 0.5 - fromNode.z;
  const toIsoX = (toNode.x - toNode.y) * 0.866;
  const toIsoY = (toNode.x + toNode.y) * 0.5 - toNode.z;

  const points = [
    new THREE.Vector3(fromIsoX, fromIsoY, 0),
    new THREE.Vector3(toIsoX, toIsoY, 0)
  ];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
      color: connector.polarity === 'positive' ? '#10b981' : '#ef4444',
      transparent: true,
      opacity: 0.8
    }))} />
  );
};

// Grid component
const IsometricGrid: React.FC<{ size: number; divisions: number }> = ({ size, divisions }) => {
  const gridRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    gridRef.current.clear();
    
    const material = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.1
    });

    // Create isometric grid lines
    for (let i = -divisions; i <= divisions; i++) {
      // Horizontal lines
      const hPoints = [
        new THREE.Vector3(-size * 0.866, i * size * 0.5, 0),
        new THREE.Vector3(size * 0.866, i * size * 0.5, 0)
      ];
      const hGeometry = new THREE.BufferGeometry().setFromPoints(hPoints);
      const hLine = new THREE.Line(hGeometry, material);
      gridRef.current.add(hLine);

      // Vertical lines
      const vPoints = [
        new THREE.Vector3(i * size * 0.866, -size * 0.5, 0),
        new THREE.Vector3(i * size * 0.866, size * 0.5, 0)
      ];
      const vGeometry = new THREE.BufferGeometry().setFromPoints(vPoints);
      const vLine = new THREE.Line(vGeometry, material);
      gridRef.current.add(vLine);
    }
  }, [size, divisions]);

  return <group ref={gridRef} />;
};

// Camera controller component
const CameraController: React.FC<{
  viewportTransform: ViewportTransform;
}> = ({ viewportTransform }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      // Set isometric view angles
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
      camera.zoom = viewportTransform.zoom * 30;
      camera.updateProjectionMatrix();
    }
  }, [camera, viewportTransform.zoom]);

  return null;
};

// Main scene component
const CLDScene: React.FC<{
  nodes: CLDNode[];
  connectors: CLDConnector[];
  selectedNodeId: string | null;
  selectedTool: string;
  snapToGrid: boolean;
  gridSize: number;
  viewportTransform: ViewportTransform;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  onNodeSelect: (nodeId: string) => void;
  onCanvasClick: (x: number, y: number) => void;
}> = ({
  nodes,
  connectors,
  selectedNodeId,
  selectedTool,
  snapToGrid,
  gridSize,
  viewportTransform,
  onNodeMove,
  onNodeSelect,
  onCanvasClick
}) => {
  const handleCanvasClick = useCallback((e: any) => {
    if (selectedTool === 'add-node') {
      onCanvasClick(e.point.x, e.point.y);
    }
  }, [selectedTool, onCanvasClick]);

  return (
    <>
      {/* Camera controller */}
      <CameraController viewportTransform={viewportTransform} />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Grid */}
      {snapToGrid && <IsometricGrid size={4} divisions={20} />}

      {/* Background plane for clicks */}
      <mesh onClick={handleCanvasClick} position={[0, 0, -0.1]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render connectors first (behind nodes) */}
      {connectors.map(connector => (
        <CLDConnectorMesh
          key={connector.id}
          connector={connector}
          nodes={nodes}
        />
      ))}

      {/* Render nodes */}
      {nodes.map(node => (
        <CLDNodeMesh
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          onMove={(x, y) => {
            const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x;
            const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y;
            onNodeMove(node.id, snappedX, snappedY);
          }}
          onSelect={() => onNodeSelect(node.id)}
        />
      ))}
    </>
  );
};

const IsometricCLDCanvas: React.FC<IsometricCLDCanvasProps> = ({
  nodes,
  connectors,
  selectedNodeId,
  selectedTool,
  viewportTransform,
  snapToGrid,
  gridSize,
  onNodeMove,
  onNodeSelect,
  onCanvasClick,
  onViewportChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, viewportTransform.zoom * (1 - e.deltaY * 0.001)));
    onViewportChange({
      ...viewportTransform,
      zoom: newZoom
    });
  }, [viewportTransform, onViewportChange]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (selectedTool === 'pan') {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [selectedTool]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      onViewportChange({
        ...viewportTransform,
        panOffset: {
          x: viewportTransform.panOffset.x + deltaX,
          y: viewportTransform.panOffset.y + deltaY
        }
      });
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint, viewportTransform, onViewportChange]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel);
      canvas.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        canvas.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          cursor: selectedTool === 'pan' ? 'grab' : selectedTool === 'add-node' ? 'crosshair' : 'default'
        }}
        camera={{
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          top: window.innerHeight / 2,
          bottom: -window.innerHeight / 2,
          near: 0.1,
          far: 1000,
          zoom: 50
        }}
        orthographic
      >
        <CLDScene
          nodes={nodes}
          connectors={connectors}
          selectedNodeId={selectedNodeId}
          selectedTool={selectedTool}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
          viewportTransform={viewportTransform}
          onNodeMove={onNodeMove}
          onNodeSelect={onNodeSelect}
          onCanvasClick={onCanvasClick}
        />
      </Canvas>
    </div>
  );
};

export default IsometricCLDCanvas;
