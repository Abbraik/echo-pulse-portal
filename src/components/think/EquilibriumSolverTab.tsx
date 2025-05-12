
import React from 'react';

interface Band {
  name: string;
  min: number;
  max: number;
}

interface EquilibriumSolverTabProps {
  initialBands: Band[];
}

const EquilibriumSolverTab: React.FC<EquilibriumSolverTabProps> = ({ initialBands }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">Equilibrium Solver</h2>
      
      <div className="mb-4 bg-navy-800/50 p-4 rounded-lg border border-white/10">
        <h3 className="text-md font-medium mb-2 text-left">Balance Bands</h3>
        <div className="space-y-3">
          {initialBands.map((band, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="w-24">{band.name}</div>
              <div className="flex-1 px-4">
                <div className="h-2 bg-white/10 rounded-full relative">
                  <div 
                    className="absolute h-2 bg-teal-500/70 rounded-full" 
                    style={{ 
                      left: `${band.min}%`, 
                      width: `${band.max - band.min}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-xs w-24 text-right">
                {band.min}% - {band.max}%
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1.5 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
          Reset
        </button>
        <button className="px-3 py-1.5 text-sm bg-teal-500/70 text-white rounded-lg hover:bg-teal-500/90 transition-colors">
          Calculate Equilibrium
        </button>
      </div>
    </div>
  );
};

export default EquilibriumSolverTab;
