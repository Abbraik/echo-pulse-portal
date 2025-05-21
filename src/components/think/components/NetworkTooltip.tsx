
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
      <div className="bg-black/80 backdrop-blur-xl text-white rounded-lg p-3 shadow-xl border border-white/20 text-xs max-w-[200px]">
        <div className="font-semibold text-sm mb-1">{actor.label}</div>
        <div className="text-gray-300 capitalize mb-2 text-xs">{actor.type}</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Degree:</span> 
            <span className="font-medium">{actor.degree}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Betweenness:</span> 
            <span className="font-medium">{actor.betweenness.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Closeness:</span> 
            <span className="font-medium">{actor.closeness.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  } else {
    const connection = data as { source: string; target: string; weight: number };
    return (
      <div className="bg-black/80 backdrop-blur-xl text-white rounded-lg p-3 shadow-xl border border-white/20 text-xs max-w-[200px]">
        <div className="text-sm font-semibold mb-1">Connection</div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-400">Strength:</span>
          <span className="font-medium">{connection.weight.toFixed(2)}</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Higher values indicate stronger connections between actors
        </div>
      </div>
    );
  }
};

export default NetworkTooltip;
