
import React, { useState } from 'react';

interface Band {
  name: string;
  min: number;
  max: number;
}

interface EquilibriumSolverTabProps {
  initialBands: Band[];
}

const EquilibriumSolverTab: React.FC<EquilibriumSolverTabProps> = ({ initialBands }) => {
  const [bands, setBands] = useState<Band[]>(initialBands);
  const [computing, setComputing] = useState(false);
  const [computed, setComputed] = useState(false);

  const handleBandChange = (index: number, key: 'min' | 'max', value: number) => {
    const newBands = [...bands];
    newBands[index][key] = value;
    setBands(newBands);
  };

  const handleCompute = () => {
    setComputing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock result - in a real app, this would be from /think/bands
      const result = {
        bands: {
          population: [78, 82],
          resources: [70, 75],
          goods: [68, 73],
          social: [80, 85]
        }
      };
      
      setComputed(true);
      setComputing(false);
      
      // Update bands with "computed" optimal values
      setBands([
        { name: "Population", min: result.bands.population[0], max: result.bands.population[1] },
        { name: "Resources", min: result.bands.resources[0], max: result.bands.resources[1] },
        { name: "Goods & Services", min: result.bands.goods[0], max: result.bands.goods[1] },
        { name: "Social Outcomes", min: result.bands.social[0], max: result.bands.social[1] },
      ]);
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">Equilibrium Solver</h2>
      
      <div className="mb-6 bg-navy-800/50 p-4 rounded-lg border border-white/10">
        <h3 className="text-md font-medium mb-4 text-left">Balance Bands</h3>
        <div className="space-y-6">
          {bands.map((band, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-32">{band.name}</div>
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
                <div className="text-sm w-36 flex justify-between">
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    className="w-14 px-1 py-1 bg-navy-900/70 border border-white/10 rounded text-center" 
                    value={band.min}
                    onChange={(e) => handleBandChange(index, 'min', parseInt(e.target.value))}
                  />
                  <span className="px-2">-</span>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    className="w-14 px-1 py-1 bg-navy-900/70 border border-white/10 rounded text-center" 
                    value={band.max}
                    onChange={(e) => handleBandChange(index, 'max', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleCompute}
          disabled={computing}
          className={`
            px-6 py-3 text-white rounded-full font-medium flex items-center justify-center
            ${computing ? 'bg-gray-500/70' : 'bg-gradient-to-r from-teal-500 to-blue-500 button-glow'}
            transform transition-transform hover:scale-[1.03] hover:shadow-lg hover:shadow-teal-500/20
          `}
        >
          {computing ? (
            <>
              <span className="mr-2">Computing</span>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </>
          ) : 'Calculate Equilibrium'}
        </button>
      </div>
      
      {computed && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {bands.map((band, index) => (
            <div key={index} className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 p-3 rounded-lg border border-teal-500/20 text-center animate-fade-in">
              <div className="text-xs text-gray-400">{band.name}</div>
              <div className="text-lg font-bold text-teal-300">[{band.min} - {band.max}]</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EquilibriumSolverTab;
