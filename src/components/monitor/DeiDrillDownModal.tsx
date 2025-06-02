
import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

interface DeiDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    current: number;
    target: { min: number; max: number };
    trend: number[];
  };
}

export const DeiDrillDownModal: React.FC<DeiDrillDownModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { t } = useTranslation();
  const [targetRange, setTargetRange] = useState([data.target.min, data.target.max]);
  
  // Mock 12-month data
  const monthlyData = [76, 77, 78, 79, 81, 83, 82, 82, 84, 83, 82, 82];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            DEI Stability Band Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 12-Month Chart */}
          <div className="glass-panel p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">12-Month DEI Trend</h3>
            <div className="h-48 relative">
              <svg width="100%" height="100%" className="overflow-visible">
                {/* Target band background */}
                <rect
                  x="0"
                  y={`${100 - (targetRange[1] / 100) * 100}%`}
                  width="100%"
                  height={`${((targetRange[1] - targetRange[0]) / 100) * 100}%`}
                  fill="rgba(20, 184, 166, 0.1)"
                />
                
                {/* DEI trend line */}
                <path
                  d={`M 0 ${100 - (monthlyData[0] / 100) * 100} ${monthlyData.map((val, i) => 
                    `L ${(i / (monthlyData.length - 1)) * 100} ${100 - (val / 100) * 100}`
                  ).join(' ')}`}
                  stroke="rgba(20, 184, 166, 1)"
                  strokeWidth="3"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* Data points */}
                {monthlyData.map((val, i) => (
                  <motion.circle
                    key={i}
                    cx={`${(i / (monthlyData.length - 1)) * 100}%`}
                    cy={`${100 - (val / 100) * 100}%`}
                    r="4"
                    fill="rgba(20, 184, 166, 1)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </svg>
              
              {/* Month labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400">
                {months.map((month, i) => (
                  <span key={i}>{month}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Target Adjustment */}
          <div className="glass-panel p-4">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Adjust Target Band</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Target Range: {targetRange[0]}% - {targetRange[1]}%</label>
                <Slider
                  value={targetRange}
                  onValueChange={setTargetRange}
                  min={70}
                  max={95}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-400">Current DEI: </span>
                  <span className={`font-medium ${
                    data.current >= targetRange[0] && data.current <= targetRange[1] 
                      ? 'text-green-400' 
                      : 'text-amber-400'
                  }`}>
                    {data.current}%
                  </span>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-teal-500 to-blue-500"
                >
                  <Target size={14} className="mr-2" />
                  Apply Target
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
