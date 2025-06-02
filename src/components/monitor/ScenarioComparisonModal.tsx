
import React, { useState } from 'react';
import { X, BarChart3 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

interface ScenarioComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    actual: number[];
    scenario: number[];
  };
}

export const ScenarioComparisonModal: React.FC<ScenarioComparisonModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { t } = useTranslation();
  const [timeHorizon, setTimeHorizon] = useState([12]);
  const [selectedMetric, setSelectedMetric] = useState('population-deviation');

  const metrics = [
    { value: 'population-deviation', label: 'Population Deviation' },
    { value: 'resource-stock', label: 'Resource Stock Ratio' },
    { value: 'social-cohesion', label: 'Social Cohesion Index' },
    { value: 'trust-index', label: 'Trust Index' }
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Scenario vs Actual Comparison
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controls */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Time Horizon: {timeHorizon[0]} months</label>
              <Slider
                value={timeHorizon}
                onValueChange={setTimeHorizon}
                min={6}
                max={24}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="flex-1">
              <label className="text-sm text-gray-400 mb-2 block">Metric Selection</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map((metric) => (
                    <SelectItem key={metric.value} value={metric.value}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Full-Screen Chart */}
          <motion.div 
            className="glass-panel p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-96 relative">
              <svg width="100%" height="100%" className="overflow-visible">
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="100%"
                    y1={`${y * 100}%`}
                    y2={`${y * 100}%`}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Scenario line (dashed) */}
                <path
                  d={`M 0 ${100 - (data.scenario[0] * 1000)} ${data.scenario.map((val, i) => 
                    `L ${(i / (data.scenario.length - 1)) * 100} ${100 - (val * 1000)}`
                  ).join(' ')}`}
                  stroke="rgba(59, 130, 246, 1)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* Actual line (solid) */}
                <path
                  d={`M 0 ${100 - (data.actual[0] * 1000)} ${data.actual.map((val, i) => 
                    `L ${(i / (data.actual.length - 1)) * 100} ${100 - (val * 1000)}`
                  ).join(' ')}`}
                  stroke="rgba(20, 184, 166, 1)"
                  strokeWidth="3"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* Data points */}
                {data.actual.map((val, i) => (
                  <motion.circle
                    key={`actual-${i}`}
                    cx={`${(i / (data.actual.length - 1)) * 100}%`}
                    cy={`${100 - (val * 1000)}%`}
                    r="4"
                    fill="rgba(20, 184, 166, 1)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  />
                ))}
                
                {data.scenario.map((val, i) => (
                  <motion.circle
                    key={`scenario-${i}`}
                    cx={`${(i / (data.scenario.length - 1)) * 100}%`}
                    cy={`${100 - (val * 1000)}%`}
                    r="4"
                    fill="rgba(59, 130, 246, 1)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  />
                ))}
              </svg>
              
              {/* Month labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-400">
                {months.map((month, i) => (
                  <span key={i}>{month}</span>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-teal-400 mr-2"></div>
                <span className="text-sm text-gray-300">Actual Performance</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-blue-400 border-dashed border-t mr-2"></div>
                <span className="text-sm text-gray-300">Optimized Scenario</span>
              </div>
            </div>
          </motion.div>

          {/* Key Insights */}
          <motion.div 
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-medium text-gray-300 mb-3">Key Insights</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Average Deviation:</span>
                <span className="text-teal-400 ml-2">
                  {(data.actual.reduce((a, b) => a + b, 0) / data.actual.length).toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Scenario Target:</span>
                <span className="text-blue-400 ml-2">
                  {(data.scenario.reduce((a, b) => a + b, 0) / data.scenario.length).toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Performance Gap:</span>
                <span className="text-amber-400 ml-2">
                  {((data.actual.reduce((a, b) => a + b, 0) / data.actual.length) - 
                    (data.scenario.reduce((a, b) => a + b, 0) / data.scenario.length)).toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Trend Direction:</span>
                <span className="text-green-400 ml-2">Improving</span>
              </div>
            </div>
          </motion.div>
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
