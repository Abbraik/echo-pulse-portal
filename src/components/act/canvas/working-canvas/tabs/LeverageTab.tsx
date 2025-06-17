
import React from 'react';
import { Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Bundle } from '../../../types/act-types';

interface LeverageTabProps {
  bundle: Bundle;
}

const LeverageTab: React.FC<LeverageTabProps> = ({ bundle }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-teal-300">Leverage Points</h3>
      {bundle.leveragePoints && bundle.leveragePoints.length > 0 ? (
        <div className="space-y-3">
          {bundle.leveragePoints.map((point, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-4 w-4 text-teal-400" />
                <span className="text-white font-medium">
                  {typeof point === 'object' ? point.name || `Leverage Point ${index + 1}` : point}
                </span>
              </div>
              {typeof point === 'object' && point.type && (
                <Badge variant="outline" className="text-xs">
                  {point.type}
                </Badge>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No leverage points identified</p>
        </div>
      )}
    </div>
  );
};

export default LeverageTab;
