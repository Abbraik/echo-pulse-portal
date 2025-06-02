
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SparklineChart from '@/components/think/components/SparklineChart';

interface DEIStabilityWidgetProps {
  onFullscreen: () => void;
  isFullscreen: boolean;
  onClose: () => void;
}

const DEIStabilityWidget: React.FC<DEIStabilityWidgetProps> = ({
  onFullscreen,
  isFullscreen,
  onClose
}) => {
  const deiValue = 78;
  const inBandValue = 82;
  const sparklineData = [78, 79, 81, 83, 82, 82];

  const radius = isFullscreen ? 180 : 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (deiValue / 100) * circumference;

  if (isFullscreen) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">DEI Stability Analysis</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close full-screen"
          >
            <X size={20} />
          </Button>
        </div>
        
        <div className="flex-1 grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <div className="relative inline-block">
                <svg width={radius * 2 + 40} height={radius * 2 + 40}>
                  <circle
                    cx={radius + 20}
                    cy={radius + 20}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx={radius + 20}
                    cy={radius + 20}
                    r={radius}
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${radius + 20} ${radius + 20})`}
                    style={{ filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.5))' }}
                  />
                  <text
                    x={radius + 20}
                    y={radius + 10}
                    textAnchor="middle"
                    className="text-4xl font-bold fill-current text-teal-400"
                  >
                    {deiValue}%
                  </text>
                  <text
                    x={radius + 20}
                    y={radius + 35}
                    textAnchor="middle"
                    className="text-lg fill-current text-gray-300"
                  >
                    DEI Score
                  </text>
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg text-gray-300">{inBandValue}% in-band</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">12-Month Trend</h3>
            <div className="bg-black/20 rounded-lg p-4">
              <SparklineChart 
                data={[...sparklineData, ...Array(6).fill(0).map(() => Math.random() * 10 + 75)]} 
                height={200} 
                width={400}
                color="#14b8a6"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="text-teal-400" />
                <span className="text-sm text-gray-300">Show Trust Index</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="text-teal-400" />
                <span className="text-sm text-gray-300">Show Migration Flow</span>
              </label>
            </div>
            
            <Button className="w-full bg-teal-600 hover:bg-teal-700">
              Apply Changes ▶
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">DEI Stability</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFullscreen}
          className="text-gray-400 hover:text-white"
          aria-label="Full-screen DEI Stability"
        >
          <Maximize2 size={16} />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <svg width={radius * 2 + 20} height={radius * 2 + 20}>
            <circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="6"
            />
            <circle
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${radius + 10} ${radius + 10})`}
              style={{ filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.5))' }}
            />
            <text
              x={radius + 10}
              y={radius + 5}
              textAnchor="middle"
              className="text-2xl font-bold fill-current text-teal-400"
            >
              {deiValue}%
            </text>
            <text
              x={radius + 10}
              y={radius + 25}
              textAnchor="middle"
              className="text-sm fill-current text-gray-300"
            >
              DEI
            </text>
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-300">{inBandValue}% in-band</p>
        </div>
        
        <div className="w-full">
          <SparklineChart data={sparklineData} height={30} width={200} color="#14b8a6" />
        </div>
      </div>
    </div>
  );
};

export default DEIStabilityWidget;
