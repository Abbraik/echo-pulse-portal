
import React from 'react';
import type { LeveragePointChipData } from '../types/leverage-types';

interface LeveragePointDescriptionsProps {
  selectedPoints: LeveragePointChipData[];
  leveragePoints: any[];
}

const LeveragePointDescriptions: React.FC<LeveragePointDescriptionsProps> = ({
  selectedPoints,
  leveragePoints
}) => {
  if (selectedPoints.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 backdrop-blur-sm bg-white/20 rounded-2xl p-4 border border-white/20">
      <h4 className="text-sm font-medium text-gray-300 mb-4">
        Selected Point Details
      </h4>
      <div className="space-y-3">
        {selectedPoints.map((selectedPoint) => {
          const fullPoint = leveragePoints.find(p => p.id === selectedPoint.id);
          return (
            <div key={selectedPoint.id} className="point-description">
              <h4 className="font-bold text-white text-sm mb-1">
                {selectedPoint.name}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed">
                {fullPoint?.description || 'System leverage intervention point'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeveragePointDescriptions;
