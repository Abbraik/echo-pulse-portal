
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
      <div className="bg-black/70 backdrop-blur-lg text-white rounded-md p-3 shadow-lg border border-white/20 text-xs">
        <div className="font-semibold mb-1">{actor.label}</div>
        <div className="text-gray-300 capitalize mb-2">{actor.type}</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Degree:</span> 
            <span className="font-medium">{actor.degree}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Betweenness:</span> 
            <span className="font-medium">{actor.betweenness.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className="text-gray-400">Closeness:</span> 
            <span className="font-medium">{actor.closeness.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  } else {
    const connection = data as { source: string; target: string; weight: number };
    return (
      <div className="bg-black/70 backdrop-blur-lg text-white rounded-md p-3 shadow-lg border border-white/20 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Connection Strength:</span>
          <span className="font-medium">{connection.weight.toFixed(2)}</span>
        </div>
      </div>
    );
  }
};

export default NetworkTooltip;
