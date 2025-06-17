
import React from 'react';
import { Target } from 'lucide-react';
import { Bundle } from '../../../types/act-types';

interface ObjectivesTabProps {
  bundle: Bundle;
}

const ObjectivesTab: React.FC<ObjectivesTabProps> = ({ bundle }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-teal-300">Bundle Objectives</h3>
      {bundle.objectives && bundle.objectives.length > 0 ? (
        <div className="space-y-3">
          {bundle.objectives.map((objective, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-300 flex-1">{objective}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No objectives defined for this bundle</p>
        </div>
      )}
    </div>
  );
};

export default ObjectivesTab;
