
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface SubIndicator {
  name: string;
  value: number;
  trend?: number[];
  pillar: string;
}

interface SubIndicatorTableProps {
  subIndicators: SubIndicator[];
}

const SubIndicatorTable: React.FC<SubIndicatorTableProps> = ({
  subIndicators
}) => {
  const { t, isRTL } = useTranslation();
  
  // Generate mock band and delta values for each sub-indicator
  const enrichedIndicators = subIndicators.map(indicator => {
    const bandMin = Math.round(indicator.value * 0.9);
    const bandMax = Math.round(indicator.value * 1.1);
    
    // Use trend data if available, otherwise generate random delta
    let deltaValue = 0;
    if (indicator.trend && indicator.trend.length >= 2) {
      deltaValue = indicator.trend[indicator.trend.length - 1] - indicator.trend[indicator.trend.length - 2];
    } else {
      deltaValue = Math.round((Math.random() * 6 - 3) * 10) / 10;
    }
    
    return {
      ...indicator,
      band: `${bandMin}–${bandMax}`,
      delta: deltaValue
    };
  });
  
  return (
    <div className={`w-full overflow-x-auto ${isRTL ? 'rtl' : ''}`}>
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-2 px-4 text-left text-sm font-medium">{t('subIndicator')}</th>
            <th className="py-2 px-4 text-left text-sm font-medium">{t('pillar')}</th>
            <th className="py-2 px-4 text-right text-sm font-medium">{t('current')}</th>
            <th className="py-2 px-4 text-right text-sm font-medium">{t('band')}</th>
            <th className="py-2 px-4 text-right text-sm font-medium">{t('vsLastMonth')}</th>
          </tr>
        </thead>
        <tbody>
          {enrichedIndicators.map((indicator, index) => (
            <motion.tr
              key={`${indicator.pillar}-${indicator.name}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-white/5 transition-colors"
            >
              <td className="py-2 px-4 text-left text-sm">{indicator.name}</td>
              <td className="py-2 px-4 text-left text-sm text-muted-foreground">{indicator.pillar}</td>
              <td className="py-2 px-4 text-right text-sm font-mono">
                {typeof indicator.value === 'number' && indicator.value % 1 === 0 
                  ? indicator.value 
                  : indicator.value.toFixed(1)}
              </td>
              <td className="py-2 px-4 text-right text-sm text-muted-foreground">{indicator.band}</td>
              <td className={`py-2 px-4 text-right text-sm font-mono ${
                indicator.delta > 0 
                  ? 'text-teal-400' 
                  : indicator.delta < 0 
                    ? 'text-red-400' 
                    : 'text-muted-foreground'
              }`}>
                {indicator.delta > 0 ? '+' : ''}{indicator.delta.toFixed(1)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubIndicatorTable;
