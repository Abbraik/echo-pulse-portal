
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';

interface SubIndicator {
  name: string;
  value: number;
  trend?: number[];
}

interface PillarRadialChartProps {
  title: string;
  icon: string;
  value: number;
  minBand: number;
  maxBand: number;
  subIndicators: SubIndicator[];
  color: string;
}

const PillarRadialChart: React.FC<PillarRadialChartProps> = ({
  title,
  icon,
  value,
  minBand,
  maxBand,
  subIndicators,
  color
}) => {
  const { t, isRTL } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const isInEquilibrium = value >= minBand && value <= maxBand;
  
  // Handle tooltip positioning
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Render a mini sparkline chart
  const renderSparkline = (data: number[] = []) => {
    if (!data || data.length < 2) return null;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end h-3 space-x-0.5">
        {data.map((value, i) => (
          <div 
            key={i}
            className={`w-0.5 ${
              data[i] > (data[i-1] || data[i]) ? 'bg-teal-400' : 'bg-red-400'
            }`}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '15%',
            }}
          />
        ))}
      </div>
    );
  };
  
  // Calculate angle based on value (0-100 scale to 0-270 degrees)
  const angle = (value / 100) * 270;
  
  // Calculate gradient rotation
  const gradientRotation = `${angle - 135}deg`;
  
  return (
    <div className={`relative p-2 ${isRTL ? 'rtl' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{icon}</span>
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowTooltip(!showTooltip)}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label={t('showInfo')}
          >
            <Info size={16} />
          </button>
          
          {/* Tooltip for sub-indicators */}
          {showTooltip && (
            <motion.div
              ref={tooltipRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute z-10 right-0 top-full mt-1 p-3 w-48 glass-panel-deep"
            >
              <h5 className="font-medium text-xs mb-2">{t('keyIndicators')}</h5>
              <div className="space-y-2">
                {subIndicators.map((indicator, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{indicator.name}</span>
                    <div className="flex items-center gap-1">
                      <span>{typeof indicator.value === 'number' && indicator.value % 1 === 0 
                        ? indicator.value 
                        : indicator.value.toFixed(1)}
                      </span>
                      {indicator.trend && (
                        <div className="w-10">
                          {renderSparkline(indicator.trend)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        {/* Radial progress */}
        <div className="relative w-16 h-16">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={resolvedTheme === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(226, 232, 240, 0.6)'}
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-135 50 50)"
            />
            
            {/* Equilibrium band */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(20, 184, 166, 0.2)"
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * ((maxBand - minBand) / 100))}
              strokeLinecap="round"
              transform={`rotate(${(minBand / 100 * 270) - 135} 50 50)`}
            />
            
            {/* Progress arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={`url(#${title.replace(/\s+/g, '')}-gradient)`}
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * (Math.min(value, 100) / 100))}
              strokeLinecap="round"
              transform="rotate(-135 50 50)"
            />
            
            {/* Define gradient */}
            <defs>
              <linearGradient 
                id={`${title.replace(/\s+/g, '')}-gradient`} 
                gradientTransform={`rotate(${gradientRotation})`}
              >
                <stop offset="0%" stopColor={color.split(' ')[1]} />
                <stop offset="100%" stopColor={color.split(' ')[3]} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Value text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold">{value}</span>
          </div>
        </div>
        
        {/* Info section */}
        <div className="ml-4 flex-1">
          {/* Value vs Band */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t('value')}</span>
            <span className="text-sm font-medium">{value} / [{minBand}–{maxBand}]</span>
          </div>
          
          {/* Status */}
          <div className={`mt-2 text-xs px-2 py-0.5 rounded-full inline-block ${
            isInEquilibrium 
              ? 'bg-teal-500/20 text-teal-400' 
              : value < minBand
                ? 'bg-red-500/20 text-red-400'
                : 'bg-amber-500/20 text-amber-400'
          }`}>
            {isInEquilibrium 
              ? t('inBalance') 
              : `${value < minBand ? t('below') : t('above')} ${t('equilibrium')}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PillarRadialChart;
