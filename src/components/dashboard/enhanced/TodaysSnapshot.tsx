
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TodaysSnapshotProps {
  data?: {
    criticalAlert?: string;
    volatility?: number;
    activeItems?: number;
    completionRate?: number;
  };
}

export const TodaysSnapshot: React.FC<TodaysSnapshotProps> = ({ data }) => {
  // Mock data if not provided
  const mockData = {
    criticalAlert: 'DEI Volatility',
    volatility: 15,
    activeItems: 8,
    completionRate: 87
  };

  const displayData = data || mockData;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-6"
      style={{ 
        background: 'rgba(20, 30, 50, 0.6)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.1), 0 8px 16px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-2xl"></div>
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertTriangle className="text-orange-400" size={24} />
            </motion.div>
            <div>
              <motion.h3 
                className="text-lg font-semibold text-orange-400"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {displayData.criticalAlert} ↑{displayData.volatility}%
              </motion.h3>
              <p className="text-sm text-gray-300">Requires immediate attention</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-gray-600"></div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-xl font-bold text-teal-400">{displayData.activeItems}</div>
              <div className="text-xs text-gray-400">Active Items</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{displayData.completionRate}%</div>
              <div className="text-xs text-gray-400">Completion Rate</div>
            </div>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            ></motion.div>
            <span className="relative">Review Alert</span>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
