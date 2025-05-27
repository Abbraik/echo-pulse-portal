
import React from 'react';
import { motion } from 'framer-motion';
import { Info, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SubIndicator {
  name: string;
  value: number;
  target?: number;
  unit?: string;
  description: string;
  trend?: number[];
}

interface PillarData {
  name: string;
  value: number;
  subIndicators: SubIndicator[];
}

interface EnhancedPillarCardProps {
  pillarKey: string;
  pillar: PillarData;
  onIndicatorClick: (pillar: string, indicator: SubIndicator) => void;
  hasTargets: boolean;
}

export const EnhancedPillarCard: React.FC<EnhancedPillarCardProps> = ({
  pillarKey,
  pillar,
  onIndicatorClick,
  hasTargets
}) => {
  const { t } = useTranslation();

  const getTrendDirection = (trend?: number[]) => {
    if (!trend || trend.length < 2) return 'stable';
    const lastValue = trend[trend.length - 1];
    const prevValue = trend[trend.length - 2];
    if (lastValue > prevValue) return 'up';
    if (lastValue < prevValue) return 'down';
    return 'stable';
  };

  const formatValue = (value: number, unit?: string) => {
    let formattedValue = value.toString();
    
    if (unit === '%' || unit === 'ratio') {
      formattedValue = value.toFixed(1);
    } else if (unit === 'AED') {
      formattedValue = value.toLocaleString();
    } else if (unit === 'index') {
      formattedValue = value.toFixed(1);
    } else {
      formattedValue = value.toFixed(2);
    }
    
    return unit ? `${formattedValue} ${unit}` : formattedValue;
  };

  const getPillarColor = (pillarKey: string) => {
    const colors = {
      population: 'from-blue-500 to-indigo-600',
      resources: 'from-green-500 to-emerald-600',
      goods: 'from-purple-500 to-violet-600',
      social: 'from-orange-500 to-amber-600'
    };
    return colors[pillarKey as keyof typeof colors] || 'from-teal-500 to-blue-600';
  };

  return (
    <motion.div
      className="glass-panel-deep p-6 hover:ring-1 hover:ring-teal-500/30 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${getPillarColor(pillarKey)}`}>
            {pillar.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-teal-400">
              {pillar.value}%
            </span>
            {hasTargets && (
              <Badge variant="secondary" className="bg-teal-500/20 text-teal-400">
                <Target size={12} className="mr-1" />
                {t('hasTargets')}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Sub-indicators */}
      <div className="space-y-3">
        {pillar.subIndicators.map((indicator, idx) => {
          const trend = getTrendDirection(indicator.trend);
          
          return (
            <motion.div
              key={idx}
              className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200"
              onClick={() => onIndicatorClick(pillarKey, indicator)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-300">
                    {indicator.name}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="text-gray-500 hover:text-teal-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{indicator.description}</p>
                    </TooltipContent>
                  </Tooltip>
                  {indicator.target && (
                    <Badge variant="outline" className="text-xs">
                      Target: {formatValue(indicator.target, indicator.unit)}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {formatValue(indicator.value, indicator.unit)}
                </span>
                
                {/* Trend indicator */}
                {trend === 'up' && <TrendingUp size={14} className="text-teal-400" />}
                {trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
                {trend === 'stable' && <Minus size={14} className="text-gray-500" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{t('clickToSetTargets')}</span>
          <span>{pillar.subIndicators.length} {t('indicators')}</span>
        </div>
      </div>
    </motion.div>
  );
};
