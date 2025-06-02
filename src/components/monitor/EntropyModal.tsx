
import React from 'react';
import { X, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ZoneData {
  value: number;
  trend: 'up' | 'down' | 'stable';
}

interface EntropyData {
  [zone: string]: ZoneData;
}

interface EntropyModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EntropyData;
}

export const EntropyModal: React.FC<EntropyModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { t } = useTranslation();

  // Mock 3-year entropy data
  const historicalData = {
    Think: [0.15, 0.18, 0.22, 0.20, 0.24],
    Act: [0.25, 0.28, 0.35, 0.32, 0.30],
    Monitor: [0.20, 0.22, 0.25, 0.28, 0.27],
    Learn: [0.12, 0.14, 0.16, 0.17, 0.18],
    Innovate: [0.18, 0.20, 0.25, 0.23, 0.22]
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-red-400" />;
      case 'down': return <TrendingDown size={16} className="text-green-400" />;
      default: return <div className="w-4 h-0.5 bg-gray-400" />;
    }
  };

  const getEntropyColor = (value: number) => {
    if (value > 0.25) return 'text-red-400';
    if (value > 0.20) return 'text-amber-400';
    return 'text-green-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            <Activity size={20} className="inline mr-2" />
            System Entropy Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Entropy Overview */}
          <motion.div 
            className="grid grid-cols-5 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {Object.entries(data).map(([zone, zoneData], index) => (
              <div key={zone} className="glass-panel p-4 text-center">
                <h4 className="text-sm font-medium text-gray-300 mb-2">{zone}</h4>
                <div className={`text-2xl font-bold ${getEntropyColor(zoneData.value)}`}>
                  {zoneData.value.toFixed(2)}
                </div>
                <div className="flex items-center justify-center mt-2">
                  {getTrendIcon(zoneData.trend)}
                </div>
              </div>
            ))}
          </motion.div>

          {/* 3-Year Sparkline Chart */}
          <motion.div 
            className="glass-panel p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-200 mb-4">3-Year Entropy Trends</h3>
            <div className="h-64 relative">
              <svg width="100%" height="100%" className="overflow-visible">
                {/* Grid lines */}
                {[0.1, 0.2, 0.3, 0.4].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="100%"
                    y1={`${(1 - y/0.4) * 100}%`}
                    y2={`${(1 - y/0.4) * 100}%`}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Zone trend lines */}
                {Object.entries(historicalData).map(([zone, values], zoneIndex) => {
                  const colors = ['#14b8a6', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
                  return (
                    <path
                      key={zone}
                      d={`M 0 ${(1 - values[0]/0.4) * 100} ${values.map((val, i) => 
                        `L ${(i / (values.length - 1)) * 100} ${(1 - val/0.4) * 100}`
                      ).join(' ')}`}
                      stroke={colors[zoneIndex]}
                      strokeWidth="2"
                      fill="none"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>
              
              {/* Time labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-400">
                {['2022', '2022.5', '2023', '2023.5', '2024'].map((year, i) => (
                  <span key={i}>{year}</span>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {Object.keys(historicalData).map((zone, index) => {
                const colors = ['#14b8a6', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
                return (
                  <div key={zone} className="flex items-center">
                    <div 
                      className="w-3 h-0.5 mr-2"
                      style={{ backgroundColor: colors[index] }}
                    ></div>
                    <span className="text-sm text-gray-300">{zone}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Entropy Insights */}
          <motion.div 
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-medium text-gray-200 mb-3">Key Insights</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Highest Entropy:</span>
                <span className="text-red-400 ml-2">Act Zone (0.30)</span>
              </div>
              <div>
                <span className="text-gray-400">Lowest Entropy:</span>
                <span className="text-green-400 ml-2">Learn Zone (0.18)</span>
              </div>
              <div>
                <span className="text-gray-400">Most Stable:</span>
                <span className="text-blue-400 ml-2">Monitor Zone</span>
              </div>
              <div>
                <span className="text-gray-400">Trending Up:</span>
                <span className="text-amber-400 ml-2">Think & Learn</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            Investigate Loop Impact ▶
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
