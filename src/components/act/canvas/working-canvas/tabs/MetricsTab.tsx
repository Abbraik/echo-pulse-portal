
import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Bundle } from '../../../types/act-types';

interface MetricsTabProps {
  bundle: Bundle;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ bundle }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-teal-300">Key Performance Indicators</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Coherence Score</span>
            <BarChart3 className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{bundle.coherence}%</div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${bundle.coherence}%` }}
            />
          </div>
        </div>
        
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">NDI Impact</span>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{bundle.ndiImpact}</div>
          <div className="text-sm text-gray-400">Impact Score</div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-md font-medium text-blue-300">Pillar Coverage</h4>
        {bundle.pillars && bundle.pillars.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {bundle.pillars.map((pillar, index) => (
              <div key={index} className="p-2 bg-white/5 rounded border border-white/10 text-center">
                <span className="text-xs text-gray-300 capitalize">{pillar}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No pillars assigned</p>
        )}
      </div>
    </div>
  );
};

export default MetricsTab;
