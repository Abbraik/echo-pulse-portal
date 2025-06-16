
import React from 'react';

interface EnhancedDashboardGridProps {
  strategicData?: any;
}

export const EnhancedDashboardGrid: React.FC<EnhancedDashboardGridProps> = ({ 
  strategicData 
}) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Enhanced Dashboard</h2>
        <p className="text-gray-400">
          Enhanced dashboard grid will be implemented in the next phase.
        </p>
        <div className="mt-6 text-sm text-gray-500">
          <p>Strategic Data Available:</p>
          <ul className="mt-2 space-y-1">
            <li>• {strategicData?.approvals?.pendingCount || 0} pending approvals</li>
            <li>• {strategicData?.coordination?.activeBundles || 0} active bundles</li>
            <li>• {strategicData?.coordination?.openClaims || 0} open claims</li>
            <li>• DEI Score: {strategicData?.systemHealth?.deiScore || 'N/A'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
