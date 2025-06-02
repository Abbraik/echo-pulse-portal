
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { BundleDetailModal } from '../BundleDetailModal';

interface InnerSpokeProps {
  type: string;
  index: number;
}

export const InnerSpoke: React.FC<InnerSpokeProps> = ({ type, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  // Mock data for different spoke types
  const spokeData = {
    bundle: {
      name: 'Infrastructure Dev',
      success: 72,
      roi: 15,
      time: 8,
      status: 'on-track'
    },
    resource: {
      metrics: [
        { name: 'Stock vs Target', value: 0.92, status: 'good' },
        { name: 'Renewal vs Consumption', value: 0.85, status: 'warning' },
        { name: 'Extraction Pressure', value: 0.60, status: 'good' },
        { name: 'Smoothed Price', value: 1.05, status: 'warning' }
      ]
    },
    scenario: {
      actual: [0.12, 0.11, 0.14, 0.10, 0.09, 0.11],
      scenario: [0.10, 0.09, 0.08, 0.07, 0.06, 0.05]
    },
    trust: {
      value: 64,
      trend: [60, 62, 63, 64],
      change: '+2'
    }
  };

  const handleClick = () => {
    setSelectedData(spokeData[type as keyof typeof spokeData]);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500/30';
      case 'warning': return 'bg-amber-500/30';
      case 'critical': return 'bg-red-500/30';
      default: return 'bg-gray-500/30';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'bundle':
        return (
          <div className="text-center">
            <div className="text-sm font-bold text-white mb-1">Infrastructure Dev</div>
            <div className="text-lg font-bold text-teal-400 mb-2">72%</div>
            <Progress value={72} className="h-2 mb-1" />
            <div className="text-xs text-gray-400">Success Rate</div>
          </div>
        );
      
      case 'resource':
        return (
          <div className="grid grid-cols-2 gap-1 h-full">
            {spokeData.resource.metrics.map((metric, i) => (
              <div key={i} className={`rounded ${getStatusColor(metric.status)} p-1 flex items-center justify-center`}>
                <div className="text-xs text-white font-medium">{metric.value}</div>
              </div>
            ))}
          </div>
        );
      
      case 'scenario':
        return (
          <div className="relative h-full flex items-center justify-center">
            <svg width="80" height="80" className="absolute">
              <path
                d={`M 10 40 ${spokeData.scenario.actual.map((val, i) => 
                  `L ${10 + (i * 12)} ${40 - (val * 200)}`
                ).join(' ')}`}
                stroke="rgba(20, 184, 166, 1)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d={`M 10 40 ${spokeData.scenario.scenario.map((val, i) => 
                  `L ${10 + (i * 12)} ${40 - (val * 200)}`
                ).join(' ')}`}
                stroke="rgba(59, 130, 246, 1)"
                strokeWidth="2"
                strokeDasharray="4,4"
                fill="none"
              />
            </svg>
            <div className="text-xs text-gray-400 mt-8">Scenario vs Actual</div>
          </div>
        );
      
      case 'trust':
        return (
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg width="64" height="64" className="transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="24"
                  fill="none"
                  stroke="rgba(20, 184, 166, 0.3)"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="24"
                  fill="none"
                  stroke="rgba(20, 184, 166, 1)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - 64 / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-teal-400">64</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">Trust Index</div>
          </div>
        );
      
      default:
        return <div className="text-center text-white">Unknown</div>;
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="w-28 h-28 rounded-2xl backdrop-blur-[24px] border border-white/20 p-3 cursor-pointer"
            style={{
              background: 'rgba(10, 20, 40, 0.6)',
              boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1), 0 8px 16px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.2, duration: 0.5, type: "spring" }}
            whileHover={{ 
              y: -4, 
              boxShadow: '0 0 30px rgba(20, 184, 166, 0.4), inset 0 0 20px rgba(20, 184, 166, 0.2)'
            }}
            onClick={handleClick}
          >
            {renderContent()}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{type === 'bundle' ? 'Bundle Success: 72%' : 
             type === 'resource' ? 'Resource Metrics' : 
             type === 'scenario' ? 'Scenario Comparison' : 
             'Trust Index: 64'}</p>
        </TooltipContent>
      </Tooltip>

      {type === 'bundle' && (
        <BundleDetailModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          bundle={selectedData}
        />
      )}
    </>
  );
};
