
import React from 'react';
import { Users } from 'lucide-react';

const StakeholdersTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-teal-300">Stakeholder Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-blue-300">Primary Stakeholders</h4>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Government Entities</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">Private Sector</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-md font-medium text-purple-300">Secondary Stakeholders</h4>
          <div className="space-y-2">
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">Civil Society</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">International Organizations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholdersTab;
