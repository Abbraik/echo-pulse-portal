
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, Users, Activity, AlertTriangle, FileText, ArrowRightLeft } from 'lucide-react';
import { ClaimsModal } from '../ClaimsModal';
import { HandoffDrawer } from '../HandoffDrawer';
import { EntropyModal } from '../EntropyModal';
import { AlertsRiskModal } from '../quadrant/AlertsRiskModal';

interface OuterOperationalPodsProps {
  onHover: (element: string | null) => void;
  onModalToggle: (isOpen: boolean) => void;
}

export const OuterOperationalPods: React.FC<OuterOperationalPodsProps> = ({ 
  onHover, 
  onModalToggle 
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const pods = [
    {
      id: 'claims',
      angle: 0,
      icon: <FileText size={16} style={{ color: '#00FFC3' }} />,
      title: 'Open Claims',
      value: '12',
      subtext: 'Oldest: 5d',
      tooltip: '12 open claims, oldest 5 d',
      action: () => {
        setActiveModal('claims');
        onModalToggle(true);
      }
    },
    {
      id: 'handoff',
      angle: 60,
      icon: <ArrowRightLeft size={16} style={{ color: '#1E90FF' }} />,
      title: 'Handoff Queue',
      value: 'Think→Act:4',
      subtext: 'Act→Monitor:3',
      tooltip: 'Think→Act:4 pending (avg 2 d), Act→Monitor:3 (avg 1 d)',
      action: () => {
        setShowDrawer(true);
        onModalToggle(true);
      }
    },
    {
      id: 'think-entropy',
      angle: 120,
      icon: <Activity size={16} style={{ color: '#FFC107' }} />,
      title: 'Think Entropy',
      value: '0.24',
      subtext: '+0.02 QoQ',
      tooltip: 'Think Entropy: 0.24 (+0.02 QoQ)',
      action: () => {
        setActiveModal('entropy');
        onModalToggle(true);
      }
    },
    {
      id: 'act-entropy',
      angle: 180,
      icon: <Activity size={16} style={{ color: '#FFC107' }} />,
      title: 'Act Entropy',
      value: '0.30',
      subtext: '-0.01 QoQ',
      tooltip: 'Act Entropy: 0.30 (-0.01 QoQ)',
      action: () => {
        setActiveModal('entropy');
        onModalToggle(true);
      }
    },
    {
      id: 'monitor-entropy',
      angle: 240,
      icon: <Activity size={16} style={{ color: '#FFC107' }} />,
      title: 'Monitor Entropy',
      value: '0.27',
      subtext: '→0.00 QoQ',
      tooltip: 'Monitor Entropy: 0.27 (→0.00 QoQ)',
      action: () => {
        setActiveModal('entropy');
        onModalToggle(true);
      }
    },
    {
      id: 'alerts-risk',
      angle: 300,
      icon: <AlertTriangle size={16} style={{ color: '#FF6E6E' }} />,
      title: 'Alerts & Risk',
      value: '3🔴5🟠10🟢',
      subtext: 'Risk Matrix',
      tooltip: '3 Critical, 5 Warning, 10 Info',
      action: () => {
        setActiveModal('alerts-risk');
        onModalToggle(true);
      }
    }
  ];

  const handleModalClose = () => {
    setActiveModal(null);
    setShowDrawer(false);
    onModalToggle(false);
  };

  return (
    <>
      {pods.map((pod, index) => (
        <motion.div
          key={pod.id}
          className="absolute pointer-events-auto"
          role="button"
          aria-label={`${pod.title}: ${pod.value} ${pod.subtext}`}
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${pod.angle}deg) translateY(-360px) rotate(-${pod.angle}deg)`,
            zIndex: 20
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2 + index * 0.1, duration: 0.4, type: "spring" }}
          onMouseEnter={() => onHover(pod.id)}
          onMouseLeave={() => onHover(null)}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="w-24 h-24 rounded-2xl backdrop-blur-[24px] border border-white/20 p-2 cursor-pointer flex flex-col items-center justify-center"
                style={{
                  background: 'rgba(10, 20, 40, 0.6)',
                  boxShadow: 'inset 0 0 15px rgba(0, 255, 195, 0.1), 0 6px 12px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 0 25px rgba(0, 255, 195, 0.4), inset 0 0 15px rgba(0, 255, 195, 0.2)'
                }}
                transition={{ duration: 0.2 }}
                onClick={pod.action}
              >
                <div className="mb-1">{pod.icon}</div>
                <div className="text-center">
                  <div 
                    className="text-xs font-medium mb-1"
                    style={{ color: '#E0E0E0' }}
                  >
                    {pod.title}
                  </div>
                  <div 
                    className="text-sm font-bold"
                    style={{ color: '#00FFC3' }}
                  >
                    {pod.value}
                  </div>
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

      <ClaimsModal
        isOpen={activeModal === 'claims'}
        onClose={handleModalClose}
        data={{ open: 12, oldest: 5 }}
      />

      <HandoffDrawer
        isOpen={showDrawer}
        onClose={handleModalClose}
        data={[{ from: 'Think', to: 'Act', count: 4, avgDays: 2 }]}
      />

      <EntropyModal
        isOpen={activeModal === 'entropy'}
        onClose={handleModalClose}
        data={{
          Think: { value: 0.24, trend: 'up' as const },
          Act: { value: 0.30, trend: 'down' as const },
          Monitor: { value: 0.27, trend: 'stable' as const },
          Learn: { value: 0.18, trend: 'up' as const },
          Innovate: { value: 0.22, trend: 'down' as const }
        }}
      />

      <AlertsRiskModal
        isOpen={activeModal === 'alerts-risk'}
        onClose={handleModalClose}
      />
    </>
  );
};
