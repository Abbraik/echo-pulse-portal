

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Text, Html, Line } from '@react-three/drei';
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

  // Convert to screen coordinates (flat 2D for better Miro-like experience)
  const screenX = node.x / 100;
  const screenY = node.y / 100;

  return (
    <group position={[screenX, screenY, 0]}>
      {/* Node background */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[node.width / 100, node.height / 100]} />
        <meshBasicMaterial
          color={isSelected ? '#14b8a6' : node.color}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Node border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(node.width / 100, node.height / 100)]} />
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
          <ringGeometry args={[node.width / 150, node.width / 120, 32]} />
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

  // Convert to screen coordinates
  const fromX = fromNode.x / 100;
  const fromY = fromNode.y / 100;
  const toX = toNode.x / 100;
  const toY = toNode.y / 100;

  const points: [number, number, number][] = [
    [fromX, fromY, 0],
    [toX, toY, 0]
  ];

  return (
    <Line
      points={points}
      color={connector.polarity === 'positive' ? '#10b981' : '#ef4444'}
      transparent
      opacity={0.8}
      lineWidth={2}
    />
  );
};

// Grid component
const GridComponent: React.FC<{ size: number; divisions: number; zoom: number }> = ({ size, divisions, zoom }) => {
  const gridRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    gridRef.current.clear();
    
    const material = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: Math.min(0.3, zoom * 0.1)
    });

    const gridSize = size / zoom;
    const step = gridSize / divisions;

    // Create grid lines
    for (let i = -divisions; i <= divisions; i++) {
      // Horizontal lines
      const hPoints = [
        new THREE.Vector3(-gridSize, i * step, 0),
        new THREE.Vector3(gridSize, i * step, 0)
      ];
      const hGeometry = new THREE.BufferGeometry().setFromPoints(hPoints);
      const hLine = new THREE.Line(hGeometry, material);
      gridRef.current.add(hLine);

      // Vertical lines
      const vPoints = [
        new THREE.Vector3(i * step, -gridSize, 0),
        new THREE.Vector3(i * step, gridSize, 0)
      ];
      const vGeometry = new THREE.BufferGeometry().setFromPoints(vPoints);
      const vLine = new THREE.Line(vGeometry, material);
      gridRef.current.add(vLine);
    }
  }, [size, divisions, zoom]);

  return <group ref={gridRef} />;
};

// Camera controller component
const CameraController: React.FC<{
  viewportTransform: ViewportTransform;
}> = ({ viewportTransform }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      // Set up orthographic camera for Miro-like 2D view
      const aspect = size.width / size.height;
      const zoom = viewportTransform.zoom;
      const frustrumSize = 10;
      
      camera.left = -frustrumSize * aspect / zoom;
      camera.right = frustrumSize * aspect / zoom;
      camera.top = frustrumSize / zoom;
      camera.bottom = -frustrumSize / zoom;
      
      // Position camera for top-down view
      camera.position.set(
        viewportTransform.panOffset.x / 100,
        viewportTransform.panOffset.y / 100,
        10
      );
      camera.lookAt(
        viewportTransform.panOffset.x / 100,
        viewportTransform.panOffset.y / 100,
        0
      );
      
      camera.updateProjectionMatrix();
    }
  }, [camera, size, viewportTransform]);

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
      onCanvasClick(e.point.x * 100, e.point.y * 100);
    }
  }, [selectedTool, onCanvasClick]);

  return (
    <>
      {/* Camera controller */}
      <CameraController viewportTransform={viewportTransform} />
      
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 0, 10]} intensity={0.5} />

      {/* Grid */}
      {snapToGrid && <GridComponent size={20} divisions={20} zoom={viewportTransform.zoom} />}

      {/* Background plane for clicks */}
      <mesh onClick={handleCanvasClick} position={[0, 0, -0.1]}>
        <planeGeometry args={[100, 100]} />
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.1, Math.min(5, viewportTransform.zoom * (1 - e.deltaY * 0.001)));
    onViewportChange({
      ...viewportTransform,
      zoom: newZoom
    });
  }, [viewportTransform, onViewportChange]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (selectedTool === 'pan' || e.button === 1) { // Middle mouse button for pan
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [selectedTool]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = (e.clientX - lastPanPoint.x) * 2;
      const deltaY = -(e.clientY - lastPanPoint.y) * 2; // Invert Y axis
      
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
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex relative overflow-hidden"
      style={{ 
        minHeight: '600px',
        background: 'rgba(15, 23, 42, 0.8)',
        cursor: isPanning ? 'grabbing' : selectedTool === 'pan' ? 'grab' : selectedTool === 'add-node' ? 'crosshair' : 'default'
      }}
    >
      {/* Canvas fills the entire container */}
      <div className="flex-1 relative">
        <Canvas
          ref={canvasRef}
          camera={{
            left: -10,
            right: 10,
            top: 10,
            bottom: -10,
            near: 0.1,
            far: 1000,
            position: [0, 0, 10]
          }}
          orthographic
          style={{ width: '100%', height: '100%' }}
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
    </div>
  );
};

export default IsometricCLDCanvas;

