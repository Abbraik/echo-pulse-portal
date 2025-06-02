
import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PillarData {
  name: string;
  description: string;
  indicators: Array<{
    name: string;
    current: number;
    target: number;
    status: 'good' | 'warning' | 'critical';
  }>;
}

interface PillarOverviewDrawerProps {
  pillar: PillarData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PillarOverviewDrawer: React.FC<PillarOverviewDrawerProps> = ({
  pillar,
  isOpen,
  onClose
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-amber-500/20 text-amber-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && pillar && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 glass-panel-deep rounded-t-2xl border-0 p-6 max-h-[70vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                {pillar.name}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            <p className="text-gray-300 mb-6">{pillar.description}</p>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-200">Top 3 Pillar Indicators</h3>
              
              <div className="space-y-3">
                {pillar.indicators.map((indicator, index) => (
                  <motion.div
                    key={indicator.name}
                    className="glass-panel p-4 flex items-center justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <div className="font-medium text-white">{indicator.name}</div>
                      <div className="text-sm text-gray-400">
                        Current: {indicator.current} | Target: {indicator.target}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(indicator.status)}>
                        {indicator.status}
                      </Badge>
                      <div className="text-sm text-gray-300">
                        Δ {(indicator.current - indicator.target).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <Button 
                  className="bg-gradient-to-r from-teal-500 to-blue-500"
                >
                  View Loop Analysis ▶
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
