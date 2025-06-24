
import React from 'react';

// Mock component since it's not in the allowed files but is imported
const EnhancedSimulationTab: React.FC<{
  metrics: any;
  scenarios: any[];
  pillars: any;
  onSaveScenario: (scenario: any) => void;
  onSelectScenario: (id: string) => void;
}> = ({ metrics, scenarios, pillars, onSaveScenario, onSelectScenario }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Enhanced Simulation</h3>
      <p className="text-gray-600">Simulation controls and parameters will be displayed here.</p>
    </div>
  );
};

export default EnhancedSimulationTab;
