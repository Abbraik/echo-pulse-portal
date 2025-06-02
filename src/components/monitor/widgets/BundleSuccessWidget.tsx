
import React from 'react';
import { Package, TrendingUp } from 'lucide-react';

interface BundleSuccessWidgetProps {
  bundleName: string;
  success: number;
  roi: number;
  timeToComplete: string;
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const BundleSuccessWidget: React.FC<BundleSuccessWidgetProps> = ({
  bundleName,
  success,
  roi,
  timeToComplete,
  isFullscreen,
  isHovered
}) => {
  return (
    <div className="h-full w-full p-3">
      <div className="flex items-center mb-2">
        <Package className="h-4 w-4 text-teal-400 mr-2" />
        <h4 className="text-sm font-medium text-white">{bundleName}</h4>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Success</span>
          <span className="text-sm font-semibold text-white">{success}%</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${success}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">ROI</span>
          <span className="text-sm font-semibold text-green-400 flex items-center">
            +{roi}%
            <TrendingUp className="h-3 w-3 ml-1" />
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Time</span>
          <span className="text-xs text-white">{timeToComplete}</span>
        </div>
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">Bundle Detail: {bundleName}</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300 mb-4">
              Full bundle interface with loop coverage table and impact chart would appear here.
            </p>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                Promote to Learn
              </button>
              <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded border border-purple-500/30">
                Refine Strategy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleSuccessWidget;
