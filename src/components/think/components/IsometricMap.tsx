
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, SoftShadows } from '@react-three/drei';
import NodeMesh from './NodeMesh';
import LoopTube from './LoopTube';
import ActorMesh from './ActorMesh';
import ActorEdge from './ActorEdge';
import NodeInfoPopup from './NodeInfoPopup';

interface CLDData {
  stocks: {
    id: string;
    position: [number, number, number];
    value: number;
  }[];
  loops: {
    from: string;
    to: string;
    type: 'reinforcing' | 'balancing';
  }[];
}

interface SNAData {
  actors: {
    id: string;
    type: 'government' | 'private' | 'ngo';
    weight: number;
    links: string[];
    position: [number, number, number];
  }[];
}

interface IsometricMapProps {
  cldData: CLDData;
  snaData: SNAData;
  onSelect: (nodeId: string) => void;
}

const IsometricMap: React.FC<IsometricMapProps> = ({ cldData, snaData, onSelect }) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredActorId, setHoveredActorId] = useState<string | null>(null);

  // Create a position lookup for quick access
  const positionLookup = cldData.stocks.reduce((acc, stock) => {
    acc[stock.id] = stock.position;
    return acc;
  }, {} as Record<string, [number, number, number]>);

  return (
    <div className="w-full h-full">
      <Canvas shadows orthographic camera={{ position: [10, 10, 10], zoom: 30 }}>
        {/* Background gradient */}
        <color attach="background" args={['#1E293B']} />

        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#14B8A6" />

        {/* Soft shadows effect */}
        <SoftShadows size={10} focus={0.5} samples={16} />

        {/* Stock nodes */}
        {cldData.stocks.map((stock) => (
          <NodeMesh
            key={stock.id}
            id={stock.id}
            position={stock.position}
            value={stock.value}
            isHovered={hoveredNodeId === stock.id}
            onHover={() => setHoveredNodeId(stock.id)}
            onBlur={() => setHoveredNodeId(null)}
            onClick={() => onSelect(stock.id)}
          />
        ))}

        {/* Loop connections */}
        {cldData.loops.map((loop, index) => {
          const fromPos = positionLookup[loop.from];
          const toPos = positionLookup[loop.to];
          return (
            <LoopTube
              key={`${loop.from}-${loop.to}`}
              fromPos={fromPos}
              toPos={toPos}
              type={loop.type}
              isHighlighted={
                hoveredNodeId === loop.from || hoveredNodeId === loop.to
              }
            />
          );
        })}

        {/* Actor nodes */}
        {snaData.actors.map((actor) => (
          <ActorMesh
            key={actor.id}
            id={actor.id}
            type={actor.type}
            weight={actor.weight}
            position={actor.position}
            isHovered={hoveredActorId === actor.id}
            onHover={() => setHoveredActorId(actor.id)}
            onBlur={() => setHoveredActorId(null)}
            onClick={() => console.log('Actor clicked:', actor.id)}
          />
        ))}

        {/* Actor edges to related stocks */}
        {snaData.actors.map((actor) =>
          actor.links.map((linkId) => (
            <ActorEdge
              key={`${actor.id}-${linkId}`}
              sourcePos={actor.position}
              targetPos={positionLookup[linkId]}
              weight={actor.weight}
              isHighlighted={hoveredActorId === actor.id}
            />
          ))
        )}

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minZoom={15}
          maxZoom={60}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={Math.PI / 4}
        />

        {/* Grid helper */}
        <gridHelper args={[20, 20, '#475569', '#334155']} position={[0, -0.01, 0]} />
      </Canvas>
    </div>
  );
};

export default IsometricMap;
