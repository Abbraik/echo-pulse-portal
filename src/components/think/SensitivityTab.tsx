
import React from 'react';

interface Parameter {
  parameter: string;
  delta: number;
  impact: number;
}

interface SensitivityTabProps {
  parameters: Parameter[];
}

const SensitivityTab: React.FC<SensitivityTabProps> = ({ parameters }) => {
  const sortedParameters = [...parameters].sort((a, b) => b.impact - a.impact);

  const handleParameterClick = (param: Parameter) => {
    console.log(`Highlighting parameter ${param.parameter} in the System Framing Studio`);
    // In a real app, this would highlight the corresponding node in the System Framing Studio
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">Sensitivity Analysis</h2>
      
      <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10 mb-4">
        <h3 className="text-md font-medium mb-3 text-left">Parameter Impact</h3>
        <div className="space-y-4">
          {sortedParameters.map((param, index) => (
            <div 
              key={index} 
              className="space-y-1 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              onClick={() => handleParameterClick(param)}
            >
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <span>{param.parameter}</span>
                  <span className={`
                    ml-2 px-1.5 py-0.5 text-xs rounded
                    ${param.delta > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                  `}>
                    {param.delta > 0 ? `+${param.delta}` : param.delta}Δ
                  </span>
                </div>
                <span>{param.impact}% impact</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-teal-500/70 to-teal-400/70 rounded-full transition-all group-hover:from-teal-400 group-hover:to-teal-300" 
                  style={{ width: `${param.impact * 2}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
        <h3 className="text-md font-medium mb-3 text-left">Top Leverage Points</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>1. Parameters (Constants)</span>
            <span className="text-teal-400">34% potential</span>
          </div>
          <div className="flex justify-between">
            <span>2. Feedback Loops</span>
            <span className="text-teal-400">28% potential</span>
          </div>
          <div className="flex justify-between">
            <span>3. Information Flows</span>
            <span className="text-teal-400">22% potential</span>
          </div>
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
