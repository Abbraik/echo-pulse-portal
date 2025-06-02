
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BundleDetailModal } from '../BundleDetailModal';
import { TrendComparisonModal } from './TrendComparisonModal';
import { ScenarioValidationModal } from './ScenarioValidationModal';

interface InnerStrategicPodsProps {
  onPodHover: (podId: string | null) => void;
}

export const InnerStrategicPods: React.FC<InnerStrategicPodsProps> = ({ onPodHover }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const pods = [
    {
      id: 'bundle-success',
      angle: 30,
      title: 'Bundle Success & ROI',
      mainValue: '72%',
      subtext: 'Avg ROI +15%',
      tooltip: 'Infrastructure Dev: 72% KPIs achieved; ROI +15%; Time-to-Deploy 8 mo',
      modal: 'bundle'
    },
    {
      id: 'trend-charts',
      angle: 150,
      title: 'System Health Trends',
      mainValue: '📊',
      subtext: 'Last 6 Months',
      tooltip: 'View 6-month trends for DEI, Trust, Migration',
      modal: 'trends'
    },
    {
      id: 'scenario-validation',
      angle: 270,
      title: 'Scenario Validation',
      mainValue: '📈',
      subtext: 'Population Deviation',
      tooltip: 'Optimized Scenario vs Actual Pop Deviation',
      modal: 'scenario'
    }
  ];

  const handlePodClick = (modalType: string) => {
    setActiveModal(modalType);
  };

  return (
    <>
      {pods.map((pod, index) => (
        <motion.div
          key={pod.id}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${pod.angle}deg) translateY(-250px) rotate(-${pod.angle}deg)`,
            zIndex: 15
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.2, duration: 0.5, type: "spring" }}
          onMouseEnter={() => onPodHover(pod.id)}
          onMouseLeave={() => onPodHover(null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="w-32 h-32 rounded-2xl backdrop-blur-[24px] border border-white/20 p-4 cursor-pointer"
                style={{
                  background: 'rgba(10, 20, 40, 0.6)',
                  boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1), 0 8px 16px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 0 30px rgba(20, 184, 166, 0.4), inset 0 0 20px rgba(20, 184, 166, 0.2)'
                }}
                onClick={() => handlePodClick(pod.modal)}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-sm font-bold text-white mb-2">{pod.title}</div>
                  <div className="text-lg font-bold text-teal-400 mb-1">{pod.mainValue}</div>
                  {pod.id === 'bundle-success' && (
                    <div className="w-16 h-16 mx-auto mb-2">
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
                          strokeDashoffset={`${2 * Math.PI * 24 * (1 - 72 / 100)}`}
                        />
                      </svg>
                    </div>
                  )}
                  <div className="text-xs text-gray-400">{pod.subtext}</div>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{pod.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      ))}

      <BundleDetailModal
        isOpen={activeModal === 'bundle'}
        onClose={() => setActiveModal(null)}
        bundle={{
          name: 'Infrastructure Dev',
          success: 72,
          roi: 15,
          time: 8,
          status: 'on-track'
        }}
      />

      <TrendComparisonModal
        isOpen={activeModal === 'trends'}
        onClose={() => setActiveModal(null)}
      />

      <ScenarioValidationModal
        isOpen={activeModal === 'scenario'}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
};
