
import React from 'react';

interface Metric {
  diversity: number;
  equity: number;
  inclusion: number;
}

interface Scenario {
  id: number;
  name: string;
  probability: number;
}

interface DeiForesightTabProps {
  metrics: Metric;
  scenarios: Scenario[];
}

const DeiForesightTab: React.FC<DeiForesightTabProps> = ({ metrics, scenarios }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">DEI & Foresight</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2 text-left">Current Metrics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
            <div className="text-2xl font-bold">{metrics.diversity}%</div>
            <div className="text-xs text-gray-400">Diversity</div>
          </div>
          <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
            <div className="text-2xl font-bold">{metrics.equity}%</div>
            <div className="text-xs text-gray-400">Equity</div>
          </div>
          <div className="bg-navy-800/50 p-4 rounded-lg border border-white/10">
            <div className="text-2xl font-bold">{metrics.inclusion}%</div>
            <div className="text-xs text-gray-400">Inclusion</div>
          </div>
        </div>
      </div>
      
      <h3 className="text-md font-medium mb-2 text-left">Scenario Analysis</h3>
      <div className="bg-navy-800/50 rounded-lg border border-white/10 divide-y divide-white/10">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="p-3 flex justify-between items-center">
            <div>{scenario.name}</div>
            <div className="text-sm bg-white/10 px-2 py-1 rounded">
              {(scenario.probability * 100).toFixed(0)}% probability
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeiForesightTab;
