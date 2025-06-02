
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { BundleDetailModal } from '../BundleDetailModal';
import { TrendComparisonModal } from '../quadrant/TrendComparisonModal';
import { ScenarioValidationModal } from '../quadrant/ScenarioValidationModal';

interface InnerStrategicPodsProps {
  onHover: (element: string | null) => void;
  onModalToggle: (isOpen: boolean) => void;
}

export const InnerStrategicPods: React.FC<InnerStrategicPodsProps> = ({ 
  onHover, 
  onModalToggle 
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const pods = [
    {
      id: 'bundle-success',
      angle: 30,
      title: 'Bundle Success & ROI',
      mainValue: '72%',
      subtext: 'Avg ROI +15%',
      tooltip: 'Infra Dev: 72% KPIs, ROI +15%, Time to Deploy 8 mo',
      modal: 'bundle',
      hasProgressArc: true
    },
    {
      id: 'trend-charts',
      angle: 150,
      title: 'System Health Trends',
      mainValue: <TrendingUp size={24} className="text-teal-400" />,
      subtext: 'Last 6 Months',
      tooltip: 'View 6-month trends for DEI, Trust, Migration',
      modal: 'trends',
      hasProgressArc: false
    },
    {
      id: 'scenario-validation',
      angle: 270,
      title: 'Scenario Validation',
      mainValue: <BarChart3 size={24} className="text-teal-400" />,
      subtext: 'Population Deviation',
      tooltip: 'Scenario vs Actual Pop Deviation',
      modal: 'scenario',
      hasProgressArc: false
    }
  ];

  const handlePodClick = (modalType: string) => {
    setActiveModal(modalType);
    onModalToggle(true);
  };

  const handleModalClose = () => {
    setActiveModal(null);
    onModalToggle(false);
  };

  return (
    <>
      {pods.map((pod, index) => (
        <motion.div
          key={pod.id}
          className="absolute pointer-events-auto"
          role="button"
          aria-label={`${pod.title}: ${typeof pod.mainValue === 'string' ? pod.mainValue : ''} ${pod.subtext}`}
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${pod.angle}deg) translateY(-280px) rotate(-${pod.angle}deg)`,
            zIndex: 25
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 + index * 0.2, duration: 0.5, type: "spring" }}
          onMouseEnter={() => onHover(pod.id)}
          onMouseLeave={() => onHover(null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="w-32 h-32 rounded-2xl backdrop-blur-[24px] border border-white/20 p-4 cursor-pointer"
                style={{
                  background: 'rgba(10, 20, 40, 0.6)',
                  boxShadow: 'inset 0 0 20px rgba(0, 255, 195, 0.1), 0 8px 16px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 0 30px rgba(0, 255, 195, 0.4), inset 0 0 20px rgba(0, 255, 195, 0.2)'
                }}
                transition={{ duration: 0.2 }}
                onClick={() => handlePodClick(pod.modal)}
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div 
                    className="text-sm font-bold mb-2"
                    style={{ color: '#00FFC3' }}
                  >
                    {pod.title}
                  </div>
                  
                  {pod.hasProgressArc && (
                    <div className="w-16 h-16 mx-auto mb-2 relative">
                      <svg width="64" height="64" className="transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="24"
                          fill="none"
                          stroke="rgba(0, 255, 195, 0.3)"
                          strokeWidth="6"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="24"
                          fill="none"
                          stroke="#00FFC3"
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 24}`}
                          strokeDashoffset={`${2 * Math.PI * 24 * (1 - 72 / 100)}`}
                        />
                      </svg>
                      <div 
                        className="absolute inset-0 flex items-center justify-center text-lg font-bold transform rotate-90"
                        style={{ color: '#00FFC3' }}
                      >
                        {pod.mainValue}
                      </div>
                    </div>
                  )}
                  
                  {!pod.hasProgressArc && (
                    <div className="mb-2">
                      {pod.mainValue}
                    </div>
                  )}
                  
                  <div 
                    className="text-xs"
                    style={{ color: '#E0E0E0' }}
                  >
                    {pod.subtext}
                  </div>
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
        onClose={handleModalClose}
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
        onClose={handleModalClose}
      />

      <ScenarioValidationModal
        isOpen={activeModal === 'scenario'}
        onClose={handleModalClose}
      />
    </>
  );
};
