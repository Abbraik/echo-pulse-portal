
import React from 'react';

interface Parameter {
  parameter: string;
  sensitivity: number;
}

interface SensitivityTabProps {
  parameters: Parameter[];
}

const SensitivityTab: React.FC<SensitivityTabProps> = ({ parameters }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">Sensitivity Analysis</h2>
      
      <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
        <h3 className="text-md font-medium mb-3 text-left">Parameter Impact</h3>
        <div className="space-y-4">
          {parameters.map((param, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{param.parameter}</span>
                <span>{(param.sensitivity * 100).toFixed(0)}% impact</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div 
                  className="h-2 bg-teal-500/70 rounded-full" 
                  style={{ width: `${param.sensitivity * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <button className="w-full px-3 py-2 text-sm bg-teal-500/70 text-white rounded-lg hover:bg-teal-500/90 transition-colors">
          Run Monte Carlo Simulation
        </button>
      </div>
    </div>
  );
};

export default SensitivityTab;
