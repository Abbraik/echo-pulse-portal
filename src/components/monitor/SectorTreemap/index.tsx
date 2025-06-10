
import React from 'react';
import { Sector } from './types';

interface SectorTreemapProps {
  sectors: Sector[];
}

const SectorTreemap: React.FC<SectorTreemapProps> = ({ sectors }) => {
  return (
    <div 
      className="sector-treemap-card h-full w-full p-4"
      style={{ 
        background: 'rgba(10, 20, 40, 0.3)', 
        borderRadius: '1rem' 
      }}
    >
      <div className="text-white">
        <h3 className="text-xl font-semibold mb-4">Sector Treemap</h3>
        <div className="space-y-2">
          {sectors.map((sector) => (
            <div key={sector.name} className="text-sm">
              <span className="font-medium">{sector.name}</span>
              <span className="ml-2 text-gray-300">
                ({sector.indicators.length} indicators)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorTreemap;
