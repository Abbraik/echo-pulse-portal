
import React from 'react';
import { Actor } from '../types/sna-types';

interface NetworkTooltipProps {
  data: Actor | { source: string; target: string; weight: number };
  type: 'node' | 'edge';
}

const NetworkTooltip: React.FC<NetworkTooltipProps> = ({ data, type }) => {
  if (type === 'node') {
    const actor = data as Actor;
    return (
      <div className="bg-black/80 backdrop-blur-lg text-white rounded-md p-2 shadow-lg border border-white/10 text-xs">
        <div className="font-semibold">{actor.label}</div>
        <div className="text-gray-300">{actor.type}</div>
        <div className="grid grid-cols-2 gap-x-4 mt-1">
          <div>Degree: {actor.degree}</div>
          <div>Betweenness: {actor.betweenness.toFixed(2)}</div>
        </div>
      </div>
    );
  } else {
    const connection = data as { source: string; target: string; weight: number };
    return (
      <div className="bg-black/80 backdrop-blur-lg text-white rounded-md p-2 shadow-lg border border-white/10 text-xs">
        <div>Connection Strength: {connection.weight.toFixed(2)}</div>
      </div>
    );
  }
};

export default NetworkTooltip;
