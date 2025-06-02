
import React from 'react';
import { X, BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface ScenarioValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioValidationModal: React.FC<ScenarioValidationModalProps> = ({
  isOpen,
  onClose
}) => {
  // Mock data
  const scenarioData = [0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.00, -0.01];
  const actualData = [0.12, 0.11, 0.14, 0.10, 0.09, 0.11, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-coral-500">
            <BarChart3 size={20} className="inline mr-2" />
            Population Deviation: Scenario vs Actual
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-64 relative mb-6">
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
                d={`M 0 ${100 - ((scenarioData[0] + 0.15) / 0.3) * 80} ${scenarioData.map((val, i) => 
                  `L ${(i / (scenarioData.length - 1)) * 100} ${100 - ((val + 0.15) / 0.3) * 80}`
                ).join(' ')}`}
                stroke="#14b8a6"
                strokeWidth="3"
                strokeDasharray="8,4"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Actual line (solid) */}
              <path
                d={`M 0 ${100 - ((actualData[0] + 0.15) / 0.3) * 80} ${actualData.map((val, i) => 
                  `L ${(i / (actualData.length - 1)) * 100} ${100 - ((val + 0.15) / 0.3) * 80}`
                ).join(' ')}`}
                stroke="#ff6e6e"
                strokeWidth="3"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              
              {/* Data points */}
              {scenarioData.map((val, i) => (
                <motion.circle
                  key={`scenario-${i}`}
                  cx={`${(i / (scenarioData.length - 1)) * 100}%`}
                  cy={`${100 - ((val + 0.15) / 0.3) * 80}%`}
                  r="4"
                  fill="#14b8a6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
              ))}
              
              {actualData.map((val, i) => (
                <motion.circle
                  key={`actual-${i}`}
                  cx={`${(i / (actualData.length - 1)) * 100}%`}
                  cy={`${100 - ((val + 0.15) / 0.3) * 80}%`}
                  r="4"
                  fill="#ff6e6e"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 + 0.2 }}
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

          {/* Legend */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-teal-400" style={{ borderTop: '3px dashed' }}></div>
              <span className="text-sm text-gray-300">Scenario</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-coral-400"></div>
              <span className="text-sm text-gray-300">Actual</span>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-panel p-4 mb-4">
            <h4 className="text-lg font-medium text-white mb-2">Summary</h4>
            <p className="text-gray-300 mb-3">
              Actual population deviation is within ±0.05% of scenario target for 9/12 months.
            </p>
            <div className="flex gap-2">
              <Badge className="bg-green-500/20 text-green-400">
                75% In-Range
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-400">
                Q1-Q2 Divergence
              </Badge>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              DEI Validation
            </Button>
            <Button variant="outline" size="sm">
              Resource Validation
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
