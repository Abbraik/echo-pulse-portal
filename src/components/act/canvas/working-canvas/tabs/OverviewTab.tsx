
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bundle } from '../../../types/act-types';

interface OverviewTabProps {
  bundle: Bundle;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ bundle }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Bundle Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge variant="outline" className="capitalize">
                  {bundle.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="text-white">{new Date(bundle.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-white">{new Date(bundle.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Approved:</span>
                <Badge variant={bundle.isApproved ? "default" : "secondary"}>
                  {bundle.isApproved ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Performance Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Coherence:</span>
                <span className="text-white">{bundle.coherence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">NDI Impact:</span>
                <span className="text-white">{bundle.ndiImpact}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Summary</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {bundle.summary || 'No summary available for this bundle.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {bundle.tags && bundle.tags.length > 0 ? (
                bundle.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No tags assigned</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
