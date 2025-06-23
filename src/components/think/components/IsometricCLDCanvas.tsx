
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

// Convert 2D coordinates to isometric 3D coordinates
const toIsometric = (x: number, y: number, z: number = 0) => {
  const isoX = (x - y) * Math.cos(Math.PI / 6);
  const isoY = (x + y) * Math.sin(Math.PI / 6) - z;
  return [isoX / 100, isoY / 100, 0];
};

// Convert isometric coordinates back to 2D
const fromIsometric = (isoX: number, isoY: number) => {
  const x = (isoX / Math.cos(Math.PI / 6) + isoY / Math.sin(Math.PI / 6)) / 2;
  const y = (isoY / Math.sin(Math.PI / 6) - isoX / Math.cos(Math.PI / 6)) / 2;
  return [x * 100, y * 100];
};

// Individual node component with isometric rendering
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
    const [x, y] = fromIsometric(e.point.x, e.point.y);
    setDragStart({ x, y });
    onSelect();
  }, [onSelect]);

  const handlePointerMove = useCallback((e: any) => {
    if (isDragging) {
      const [x, y] = fromIsometric(e.point.x, e.point.y);
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      onMove(node.x + deltaX, node.y + deltaY);
      setDragStart({ x, y });
    }
  }, [isDragging, dragStart, node.x, node.y, onMove]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Convert to isometric coordinates
  const [isoX, isoY, isoZ] = toIsometric(node.x, node.y, node.z);

  // Create isometric box geometry
  const nodeWidth = node.width / 100;
  const nodeHeight = node.height / 100;
  const nodeDepth = 0.2; // Add depth for 3D effect

  return (
    <group position={[isoX, isoY, isoZ]}>
      {/* Main node body (isometric box) */}
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        position={[0, 0, nodeDepth / 2]}
      >
        <boxGeometry args={[nodeWidth, nodeHeight, nodeDepth]} />
        <meshPhongMaterial
          color={isSelected ? '#14b8a6' : node.color}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Top face highlight */}
      <mesh position={[0, 0, nodeDepth]}>
        <planeGeometry args={[nodeWidth, nodeHeight]} />
        <meshPhongMaterial
          color={isSelected ? '#0d9488' : node.color}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Node edges for wireframe effect */}
      <lineSegments position={[0, 0, nodeDepth / 2]}>
        <edgesGeometry args={[new THREE.BoxGeometry(nodeWidth, nodeHeight, nodeDepth)]} />
        <lineBasicMaterial
          color={isSelected ? '#0f766e' : '#ffffff'}
          transparent
          opacity={isSelected ? 1 : 0.4}
          linewidth={2}
        />
      </lineSegments>

      {/* Node label */}
      <Html
        position={[0, 0, nodeDepth + 0.01]}
        center
        style={{
          pointerEvents: 'none',
          color: 'white',
          fontSize: '11px',
          fontWeight: '600',
          textAlign: 'center',
          width: `${node.width}px`,
          height: `${node.height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '0 0 8px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '4px',
          padding: '4px'
        }}
      >
        {node.label}
      </Html>

      {/* Selection indicator - isometric ring */}
      {isSelected && (
        <group position={[0, 0, nodeDepth + 0.05]}>
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[nodeWidth * 0.7, nodeWidth * 0.8, 32]} />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
            <ringGeometry args={[nodeWidth * 0.7, nodeWidth * 0.8, 32]} />
            <meshBasicMaterial color="#14b8a6" transparent opacity={0.3} />
          </mesh>
        </group>
      )}

      {/* Drop shadow */}
      <mesh position={[0.05, -0.05, -0.01]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[nodeWidth * 1.1, nodeHeight * 1.1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// Connector component with isometric rendering
const CLDConnectorMesh: React.FC<{
  connector: CLDConnector;
  nodes: CLDNode[];
}> = ({ connector, nodes }) => {
  const fromNode = nodes.find(n => n.id === connector.from);
  const toNode = nodes.find(n => n.id === connector.to);

  if (!fromNode || !toNode) return null;

  // Convert to isometric coordinates
  const [fromIsoX, fromIsoY, fromIsoZ] = toIsometric(fromNode.x, fromNode.y, fromNode.z + 0.1);
  const [toIsoX, toIsoY, toIsoZ] = toIsometric(toNode.x, toNode.y, toNode.z + 0.1);

  const points: [number, number, number][] = [
    [fromIsoX, fromIsoY, fromIsoZ],
    [toIsoX, toIsoY, toIsoZ]
  ];

  const connectionColor = connector.polarity === 'positive' ? '#10b981' : '#ef4444';

  return (
    <group>
      {/* Main connection line */}
      <Line
        points={points}
        color={connectionColor}
        transparent
        opacity={0.8}
        lineWidth={3}
      />
      
      {/* Arrow head */}
      <mesh position={[toIsoX, toIsoY, toIsoZ]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshBasicMaterial color={connectionColor} />
      </mesh>

      {/* Connection shadow */}
      <Line
        points={[
          [fromIsoX + 0.02, fromIsoY - 0.02, fromIsoZ - 0.05],
          [toIsoX + 0.02, toIsoY - 0.02, toIsoZ - 0.05]
        ]}
        color="#000000"
        transparent
        opacity={0.2}
        lineWidth={2}
      />
    </group>
  );
};

// Isometric grid component
const IsometricGrid: React.FC<{ size: number; divisions: number; zoom: number }> = ({ size, divisions, zoom }) => {
  const gridRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    gridRef.current.clear();
    
    const material = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: Math.min(0.25, zoom * 0.08)
    });

    const gridSize = size / zoom;
    const step = gridSize / divisions;

    // Create isometric grid lines
    for (let i = -divisions; i <= divisions; i++) {
      // Horizontal lines (X direction in isometric view)
      const hPoints1 = [
        new THREE.Vector3(...toIsometric(-gridSize, i * step)),
        new THREE.Vector3(...toIsometric(gridSize, i * step))
      ];
      const hGeometry1 = new THREE.BufferGeometry().setFromPoints(hPoints1);
      const hLine1 = new THREE.Line(hGeometry1, material);
      gridRef.current.add(hLine1);

      // Vertical lines (Y direction in isometric view)
      const vPoints1 = [
        new THREE.Vector3(...toIsometric(i * step, -gridSize)),
        new THREE.Vector3(...toIsometric(i * step, gridSize))
      ];
      const vGeometry1 = new THREE.BufferGeometry().setFromPoints(vPoints1);
      const vLine1 = new THREE.Line(vGeometry1, material);
      gridRef.current.add(vLine1);
    }
  }, [size, divisions, zoom]);

  return <group ref={gridRef} />;
};

// Camera controller component for isometric view
const IsometricCameraController: React.FC<{
  viewportTransform: ViewportTransform;
}> = ({ viewportTransform }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      // Set up isometric orthographic camera
      const aspect = size.width / size.height;
      const zoom = viewportTransform.zoom;
      const frustrumSize = 8;
      
      camera.left = -frustrumSize * aspect / zoom;
      camera.right = frustrumSize * aspect / zoom;
      camera.top = frustrumSize / zoom;
      camera.bottom = -frustrumSize / zoom;
      
      // Position camera for isometric view (30° angle)
      const [panX, panY] = toIsometric(viewportTransform.panOffset.x, viewportTransform.panOffset.y);
      camera.position.set(
        panX / 100,
        panY / 100 + 8,
        8
      );
      camera.lookAt(panX / 100, panY / 100, 0);
      
      camera.updateProjectionMatrix();
    }
  }, [camera, size, viewportTransform]);

  return null;
};

// Main scene component
const IsometricCLDScene: React.FC<{
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
      const [x, y] = fromIsometric(e.point.x, e.point.y);
      onCanvasClick(x, y);
    }
  }, [selectedTool, onCanvasClick]);

  return (
    <>
      {/* Camera controller */}
      <IsometricCameraController viewportTransform={viewportTransform} />
      
      {/* Isometric lighting setup */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, 5]} intensity={0.4} />

      {/* Isometric grid */}
      {snapToGrid && <IsometricGrid size={20} divisions={20} zoom={viewportTransform.zoom} />}

      {/* Background plane for clicks */}
      <mesh onClick={handleCanvasClick} position={[0, 0, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
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

      {/* Render nodes with proper Z-ordering */}
      {nodes
        .sort((a, b) => (b.y + b.z) - (a.y + a.z)) // Sort by depth for proper rendering order
        .map(node => (
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
    const newZoom = Math.max(0.2, Math.min(4, viewportTransform.zoom * (1 - e.deltaY * 0.001)));
    onViewportChange({
      ...viewportTransform,
      zoom: newZoom
    });
  }, [viewportTransform, onViewportChange]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (selectedTool === 'pan' || e.button === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [selectedTool]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = (e.clientX - lastPanPoint.x) * 2;
      const deltaY = -(e.clientY - lastPanPoint.y) * 2;
      
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
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
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
            position: [0, 8, 8]
          }}
          orthographic
          style={{ width: '100%', height: '100%' }}
          shadows
        >
          <IsometricCLDScene
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
