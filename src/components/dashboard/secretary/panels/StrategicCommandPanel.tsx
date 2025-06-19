
import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PanelHeader from '../shared/PanelHeader';

interface StrategicCommandPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isHovered: boolean;
}

const StrategicCommandPanel: React.FC<StrategicCommandPanelProps> = ({
  isFullscreen,
  onToggleFullscreen,
  isHovered
}) => {
  const deiScore = 78.5;
  const trustScore = 82.3;
  const psiuData = {
    producer: 82,
    stabilizer: 76,
    innovator: 68,
    unifier: 85
  };

  const entropyTrends = [
    { zone: 'THINK', value: 0.24, change: -2.1 },
    { zone: 'ACT', value: 0.31, change: 1.5 },
    { zone: 'MONITOR', value: 0.27, change: -0.8 },
    { zone: 'LEARN', value: 0.25, change: 0.3 }
  ];

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Strategic Command"
        subtitle="Global Equity & System Balance"
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Global Equity Gauge */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h4 className="text-sm font-medium text-teal-400 mb-2">DEI Score</h4>
            <div className="relative h-20 w-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent transition-transform duration-1000"
                style={{ transform: `rotate(${(deiScore / 100) * 360}deg)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-teal-400">{deiScore}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Trust Index</h4>
            <div className="relative h-20 w-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-r-transparent border-b-transparent border-l-transparent transition-transform duration-1000"
                style={{ transform: `rotate(${(trustScore / 100) * 360}deg)` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-blue-400">{trustScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PSIU Matrix */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">PSIU Balance Matrix</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-teal-500/20 rounded-lg p-3 text-center border border-teal-500/30">
              <div className="font-bold text-teal-400 text-lg">{psiuData.producer}</div>
              <div className="text-xs text-gray-400">Producer</div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-3 text-center border border-green-500/30">
              <div className="font-bold text-green-400 text-lg">{psiuData.stabilizer}</div>
              <div className="text-xs text-gray-400">Stabilizer</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-3 text-center border border-purple-500/30">
              <div className="font-bold text-purple-400 text-lg">{psiuData.innovator}</div>
              <div className="text-xs text-gray-400">Innovator</div>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-3 text-center border border-orange-500/30">
              <div className="font-bold text-orange-400 text-lg">{psiuData.unifier}</div>
              <div className="text-xs text-gray-400">Unifier</div>
            </div>
          </div>
        </div>

        {/* Entropy Trends */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Zone Entropy Trends</h4>
          <div className="space-y-2">
            {entropyTrends.map((trend) => (
              <div key={trend.zone} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                <span className="text-sm font-medium text-white">{trend.zone}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">{trend.value}</span>
                  <div className={`flex items-center ${trend.change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {trend.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span className="text-xs">{Math.abs(trend.change)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Alert CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg shadow-lg">
            <AlertTriangle size={16} className="mr-2" />
            Review Strategic Alert
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default StrategicCommandPanel;
