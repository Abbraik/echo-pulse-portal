
import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface TrendComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrendComparisonModal: React.FC<TrendComparisonModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('dei');

  // Mock 12-month data
  const trendData = {
    dei: [76, 77, 78, 79, 81, 83, 82, 82, 84, 83, 82, 78],
    trust: [58, 59, 60, 62, 63, 64, 65, 63, 62, 64, 65, 64],
    migration: [14, 13, 12, 11, 10, 9, 10, 11, 12, 11, 10, 10]
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const renderChart = (data: number[], color: string, label: string) => (
    <div className="h-64 relative">
      <h4 className="text-sm font-medium text-gray-300 mb-4">{label} - 12 Month Trend</h4>
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
        
        {/* Trend line */}
        <path
          d={`M 0 ${100 - (data[0] / Math.max(...data)) * 80} ${data.map((val, i) => 
            `L ${(i / (data.length - 1)) * 100} ${100 - (val / Math.max(...data)) * 80}`
          ).join(' ')}`}
          stroke={color}
          strokeWidth="3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Data points */}
        {data.map((val, i) => (
          <motion.circle
            key={i}
            cx={`${(i / (data.length - 1)) * 100}%`}
            cy={`${100 - (val / Math.max(...data)) * 80}%`}
            r="4"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.05 }}
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            <TrendingUp size={20} className="inline mr-2" />
            System Health Trends
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dei">DEI</TabsTrigger>
            <TabsTrigger value="trust">Trust Index</TabsTrigger>
            <TabsTrigger value="migration">Migration Flow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dei" className="mt-6">
            <motion.div
              className="glass-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {renderChart(trendData.dei, '#14b8a6', 'DEI Stability')}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="trust" className="mt-6">
            <motion.div
              className="glass-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {renderChart(trendData.trust, '#3b82f6', 'Trust Index')}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="migration" className="mt-6">
            <motion.div
              className="glass-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {renderChart(trendData.migration, '#10b981', 'Migration Flow')}
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
