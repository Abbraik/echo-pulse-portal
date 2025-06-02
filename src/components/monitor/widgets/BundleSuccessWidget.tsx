
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BundleSuccessWidgetProps {
  bundleName: string;
  success: number;
  roi: number;
  time: string;
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const BundleSuccessWidget: React.FC<BundleSuccessWidgetProps> = ({
  bundleName,
  success,
  roi,
  time,
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">{bundleName} Bundle Detail</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Loop Coverage</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Think Loop</span>
                  <span className="text-green-400">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Act Loop</span>
                  <span className="text-green-400">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Monitor Loop</span>
                  <span className="text-yellow-400">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Learn Loop</span>
                  <span className="text-green-400">78%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Promote to Learn ▶
              </Button>
              <Button variant="outline" className="w-full">
                Refine Strategy
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-black/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Impact Chart</h3>
              <div className="h-48 flex items-end justify-around space-x-2">
                {[65, 72, 78, 85, 82, 88].map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-teal-500 rounded-t"
                      style={{ height: `${(value / 100) * 150}px` }}
                    />
                    <span className="text-xs text-gray-400 mt-1">M{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{success}%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">+{roi}%</div>
                <div className="text-sm text-gray-400">ROI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white truncate">{bundleName}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white flex-shrink-0"
        >
          <Maximize2 size={14} />
        </Button>
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Success</span>
            <span className="text-green-400">{success}%</span>
          </div>
          <Progress value={success} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-300">ROI</span>
          <span className="text-xs text-green-400">+{roi}%</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-300">Time</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default BundleSuccessWidget;
