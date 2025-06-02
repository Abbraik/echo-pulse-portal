
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface StrategicIndicator {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: number[];
  description: string;
}

interface StrategicIndicatorsPanelProps {
  className?: string;
}

const StrategicIndicatorsPanel: React.FC<StrategicIndicatorsPanelProps> = ({ className }) => {
  const { t } = useTranslation();
  const [selectedIndicator, setSelectedIndicator] = useState<StrategicIndicator | null>(null);

  const strategicIndicators: StrategicIndicator[] = [
    {
      id: 'dei-composite',
      name: 'DEI Composite',
      value: 78,
      target: 80,
      trend: [72, 74, 76, 78, 78],
      description: 'Diversity, Equity & Inclusion composite score across all system dimensions'
    },
    {
      id: 'network-dev',
      name: 'Network Dev Index',
      value: 64,
      target: 100,
      trend: [58, 60, 62, 63, 64],
      description: 'Network development and connectivity strength indicators'
    },
    {
      id: 'trust-recovery',
      name: 'Trust Recovery Index',
      value: 89,
      target: 100,
      trend: [82, 85, 87, 88, 89],
      description: 'Social trust rebuilding and community cohesion metrics'
    },
    {
      id: 'bundle-coherence',
      name: 'Avg Bundle Coherence',
      value: 72,
      target: 100,
      trend: [68, 69, 70, 71, 72],
      description: 'Average coherence score across all active solution bundles'
    }
  ];

  const getPerformanceColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 1.0) return '#00FFC3';
    if (ratio >= 0.9) return '#FFC107';
    return '#FF6E6E';
  };

  const getPerformanceRatio = (value: number, target: number) => {
    return Math.round((value / target) * 100);
  };

  const handleIndicatorClick = (indicator: StrategicIndicator) => {
    setSelectedIndicator(indicator);
    console.log(`Opening detailed view for: ${indicator.name}`);
  };

  const renderSparkline = (trend: number[]) => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 40;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="40" height="20" className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke="#00FFC3"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 2px rgba(0,255,195,0.5))' }}
        />
      </svg>
    );
  };

  return (
    <motion.div 
      className={cn('h-full flex flex-col', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header Bar */}
      <div 
        className="h-10 flex items-center px-6 flex-shrink-0"
        style={{ 
          background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)'
        }}
      >
        <div className="flex items-center gap-2">
          <Target size={16} className="text-white" />
          <h3 className="text-base font-bold text-white font-['Noto_Sans']" style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
            fontSize: '16px'
          }}>
            Strategic Indicators
          </h3>
        </div>
      </div>

      {/* Indicators List */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-4">
          {strategicIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.id}
              initial={{ opacity: 0, x: -10 }}
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
                <p className="text-[#E0E0E0] font-['Noto_Sans']" style={{ fontSize: '12px' }}>
                  {indicator.value}/{indicator.target} ({getPerformanceRatio(indicator.value, indicator.target)}%)
                </p>
                <div className="mt-2">
                  <div 
                    className="text-xs font-semibold px-2 py-1 rounded-full inline-block"
                    style={{
                      background: getPerformanceColor(indicator.value, indicator.target),
                      color: '#081226',
                      fontSize: '10px'
                    }}
                  >
                    {getPerformanceRatio(indicator.value, indicator.target) >= 100 ? 'On Target' : 
                     getPerformanceRatio(indicator.value, indicator.target) >= 90 ? 'Close' : 'Below Target'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-[#E0E0E0] mb-1">Trend</div>
                  {renderSparkline(indicator.trend)}
                </div>
                <TrendingUp size={16} className="text-[#00FFC3]" />
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
            View All Strategic Metrics ▶
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategicIndicatorsPanel;
