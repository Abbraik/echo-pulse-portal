
import React from 'react';

interface Objective {
  id: number;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface StrategyGeneratorTabProps {
  objectives: Objective[];
}

const StrategyGeneratorTab: React.FC<StrategyGeneratorTabProps> = ({ objectives }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-left">Initial Strategy</h2>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2 text-left">Objectives</h3>
        <div className="bg-navy-800/50 rounded-lg border border-white/10">
          {objectives.map((objective) => (
            <div 
              key={objective.id} 
              className="p-3 flex justify-between items-center border-b border-white/10 last:border-b-0"
            >
              <div>{objective.name}</div>
              <div className={`text-xs px-2 py-1 rounded ${
                objective.priority === 'High' ? 'bg-teal-500/30 text-teal-300' :
                objective.priority === 'Medium' ? 'bg-blue-500/30 text-blue-300' :
                'bg-gray-500/30 text-gray-300'
              }`}>
                {objective.priority} Priority
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2 text-left">Approach</h3>
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
            Conservative
          </button>
          <button className="flex-1 px-3 py-2 text-sm bg-teal-500/70 text-white rounded-lg hover:bg-teal-500/90 transition-colors">
            Balanced
          </button>
          <button className="flex-1 px-3 py-2 text-sm bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors">
            Aggressive
          </button>
        </div>
      </div>
      
      <button className="w-full px-3 py-2 text-sm bg-blue-500/70 text-white rounded-lg hover:bg-blue-500/90 transition-colors">
        Generate Strategic Roadmap
      </button>
    </div>
  );
};

export default StrategyGeneratorTab;
