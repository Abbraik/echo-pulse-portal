
import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

interface ScenarioValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioValidationModal: React.FC<ScenarioValidationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedMetric, setSelectedMetric] = useState('population');

  // Mock 12-month data
  const scenarioData = {
    population: {
      scenario: [0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.00, 0.00],
      actual: [0.12, 0.11, 0.14, 0.10, 0.09, 0.11, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04]
    },
    dei: {
      scenario: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 85],
      actual: [76, 77, 78, 79, 81, 83, 82, 82, 84, 83, 82, 78]
    },
    resource: {
      scenario: [0.90, 0.91, 0.92, 0.93, 0.94, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95],
      actual: [0.88, 0.89, 0.91, 0.92, 0.92, 0.93, 0.92, 0.91, 0.90, 0.92, 0.93, 0.92]
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'population': return 'Population Deviation';
      case 'dei': return 'DEI Validation';
      case 'resource': return 'Resource Validation';
      default: return 'Unknown';
    }
  };

  const renderChart = () => {
    const data = scenarioData[selectedMetric as keyof typeof scenarioData];
    const maxValue = Math.max(...data.scenario, ...data.actual);
    const minValue = Math.min(...data.scenario, ...data.actual);
    const range = maxValue - minValue;

    return (
      <div className="h-64 relative">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((y) => (
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
            d={`M 0 ${100 - ((data.scenario[0] - minValue) / range) * 80} ${data.scenario.map((val, i) => 
              `L ${(i / (data.scenario.length - 1)) * 100} ${100 - ((val - minValue) / range) * 80}`
            ).join(' ')}`}
            stroke="#14b8a6"
            strokeWidth="3"
            strokeDasharray="8,4"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Actual line (solid) */}
          <path
            d={`M 0 ${100 - ((data.actual[0] - minValue) / range) * 80} ${data.actual.map((val, i) => 
              `L ${(i / (data.actual.length - 1)) * 100} ${100 - ((val - minValue) / range) * 80}`
            ).join(' ')}`}
            stroke="#ff6e6e"
            strokeWidth="3"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Data points */}
          {data.scenario.map((val, i) => (
            <motion.circle
              key={`scenario-${i}`}
              cx={`${(i / (data.scenario.length - 1)) * 100}%`}
              cy={`${100 - ((val - minValue) / range) * 80}%`}
              r="3"
              fill="#14b8a6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
          
          {data.actual.map((val, i) => (
            <motion.circle
              key={`actual-${i}`}
              cx={`${(i / (data.actual.length - 1)) * 100}%`}
              cy={`${100 - ((val - minValue) / range) * 80}%`}
              r="3"
              fill="#ff6e6e"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 + 0.3 }}
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
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            <Target size={20} className="inline mr-2" />
            {getMetricLabel(selectedMetric)}: Scenario vs Actual
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metric Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-300">Select Metric:</label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="population">Population Deviation</SelectItem>
                <SelectItem value="dei">DEI Validation</SelectItem>
                <SelectItem value="resource">Resource Validation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chart */}
          <motion.div 
            className="glass-panel p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {renderChart()}
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center">
                <div className="w-6 h-0.5 bg-teal-400 mr-2" style={{ background: 'repeating-linear-gradient(to right, #14b8a6 0, #14b8a6 8px, transparent 8px, transparent 12px)' }}></div>
                <span className="text-sm text-gray-300">Scenario</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-0.5 bg-red-400 mr-2"></div>
                <span className="text-sm text-gray-300">Actual</span>
              </div>
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div 
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-200 mb-2">Summary</h3>
            <p className="text-sm text-gray-300">
              Actual is within ±0.05% of scenario target for 9/12 months.
            </p>
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
