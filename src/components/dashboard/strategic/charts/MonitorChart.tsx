
import React from 'react';
import Gauge from '@/components/ui/custom/Gauge';

export const MonitorChart: React.FC = () => {
  return (
    <div className="h-32 w-full flex justify-around items-center">
      <div className="flex flex-col items-center">
        <Gauge value={78} max={100} size="sm" color="teal" />
        <span className="text-xs text-gray-300 mt-1">DEI Score</span>
      </div>
      <div className="flex flex-col items-center">
        <Gauge value={82} max={100} size="sm" color="blue" />
        <span className="text-xs text-gray-300 mt-1">Trust Index</span>
      </div>
      <div className="flex flex-col items-center">
        <Gauge value={23} min={-50} max={50} size="sm" color="emerald" />
        <span className="text-xs text-gray-300 mt-1">Migration</span>
      </div>
    </div>
  );
};
