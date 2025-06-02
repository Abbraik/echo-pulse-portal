
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface OperationalIndicator {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  description: string;
  lastUpdated: string;
}

interface OperationalIndicatorsPanelProps {
  className?: string;
}

const OperationalIndicatorsPanel: React.FC<OperationalIndicatorsPanelProps> = ({ className }) => {
  const { t } = useTranslation();
  const [selectedIndicator, setSelectedIndicator] = useState<OperationalIndicator | null>(null);

  const operationalIndicators: OperationalIndicator[] = [
    {
      id: 'facilitator-claims',
      name: 'Open Facilitator Claims',
      value: 12,
      target: 0,
      unit: 'claims',
      status: 'warning',
      description: 'Active facilitator claims requiring attention',
      lastUpdated: '2 min ago'
    },
    {
      id: 'think-act-queue',
      name: 'Think→Act Queue',
      value: 4,
      target: 0,
      unit: 'items',
      status: 'warning',
      description: 'Items pending transition from Think to Act phase',
      lastUpdated: '5 min ago'
    },
    {
      id: 'act-monitor-queue',
      name: 'Act→Monitor Queue',
      value: 3,
      target: 0,
      unit: 'items',
      status: 'optimal',
      description: 'Items pending transition from Act to Monitor phase',
      lastUpdated: '1 min ago'
    },
    {
      id: 'system-errors',
      name: 'System Error Count',
      value: 5,
      target: 0,
      unit: 'errors',
      status: 'warning',
      description: 'Active system errors requiring resolution',
      lastUpdated: '30 sec ago'
    }
  ];

  const getStatusColor = (status: OperationalIndicator['status']) => {
    switch (status) {
      case 'optimal': return '#00FFC3';
      case 'warning': return '#FFC107';
      case 'critical': return '#FF6E6E';
      default: return '#00FFC3';
    }
  };

  const getStatusText = (status: OperationalIndicator['status']) => {
    switch (status) {
      case 'optimal': return 'Optimal';
      case 'warning': return 'Attention';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  const handleIndicatorClick = (indicator: OperationalIndicator) => {
    setSelectedIndicator(indicator);
    console.log(`Opening detailed view for: ${indicator.name}`);
  };

  const renderProgressBar = (value: number, target: number, status: OperationalIndicator['status']) => {
    // For operational metrics, lower is better (target is usually 0)
    const maxDisplay = Math.max(value, 10);
    const percentage = (value / maxDisplay) * 100;
    
    return (
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: getStatusColor(status)
          }}
        />
      </div>
    );
  };

  return (
    <motion.div 
      className={cn('h-full flex flex-col', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Header Bar */}
      <div 
        className="h-10 flex items-center px-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)'
        }}
      >
        <div className="flex items-center gap-2">
          <Settings size={16} className="text-white" />
          <h3 className="text-base font-bold text-white font-['Noto_Sans']" style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
            fontSize: '16px'
          }}>
            Operational Indicators
          </h3>
        </div>
      </div>

      {/* Indicators List */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-4">
          {operationalIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              className="cursor-pointer transition-all duration-200 h-[100px] rounded-xl border p-4 flex items-center justify-between"
              style={{
                background: 'rgba(20,30,50,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,255,195,0.10)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
              }}
              whileHover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 0 12px rgba(0,255,195,0.4)'
              }}
              onClick={() => handleIndicatorClick(indicator)}
            >
              <div className="flex-1">
                <h4 className="font-semibold text-[#00FFC3] font-['Noto_Sans'] mb-1" style={{
                  fontSize: '14px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}>
                  {indicator.name}
                </h4>
                <p className="text-[#E0E0E0] font-['Noto_Sans'] mb-2" style={{ fontSize: '12px' }}>
                  {indicator.value} {indicator.unit} 
                  {indicator.value > 0 && ` (Oldest: ${Math.floor(Math.random() * 7) + 1}d)`}
                </p>
                
                <div className="flex items-center gap-3">
                  <div 
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: getStatusColor(indicator.status),
                      color: '#081226',
                      fontSize: '10px'
                    }}
                  >
                    {getStatusText(indicator.status)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#E0E0E0]">
                    <Clock size={10} />
                    {indicator.lastUpdated}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-16">
                  {renderProgressBar(indicator.value, indicator.target, indicator.status)}
                </div>
                <AlertCircle 
                  size={16} 
                  className="text-[#00FFC3]"
                  style={{ opacity: indicator.status === 'optimal' ? 0.5 : 1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-white/10">
          <motion.button
            className="text-[#00B8FF] hover:text-white font-['Noto_Sans'] transition-all duration-200"
            style={{ fontSize: '14px' }}
            whileHover={{
              textDecoration: 'underline',
              textDecorationColor: '#00FFC3',
              textDecorationThickness: '2px'
            }}
          >
            View All Operational Metrics ▶
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OperationalIndicatorsPanel;
