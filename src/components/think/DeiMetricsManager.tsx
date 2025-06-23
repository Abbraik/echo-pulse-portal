
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import OverallDeiIndicator from './OverallDeiIndicator';

interface DeiMetricsManagerProps {
  className?: string;
}

const DeiMetricsManager: React.FC<DeiMetricsManagerProps> = ({ className }) => {
  const { t } = useTranslation();

  // Mock DEI data - in a real app, this would come from props or a hook
  const deiMetrics = {
    overall: {
      value: 76,
      minBand: 72,
      maxBand: 82,
    },
    pillars: {
      population: { value: 78, subIndicators: [] },
      resources: { value: 65, subIndicators: [] },
      goods: { value: 82, subIndicators: [] },
      social: { value: 79, subIndicators: [] }
    },
    equilibriumBands: {
      overall: { min: 72, max: 82 },
      population: { min: 70, max: 85 },
      resources: { min: 60, max: 80 },
      goods: { min: 75, max: 90 },
      social: { min: 70, max: 85 }
    }
  };

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {t('deiIndicator', { defaultValue: 'DEI Indicator' })}
        </h2>
        <p className="text-sm text-gray-400">
          {t('deiDescription', { defaultValue: 'Dynamic Equilibrium Index' })}
        </p>
      </div>
      
      <OverallDeiIndicator
        value={deiMetrics.overall.value}
        minBand={deiMetrics.overall.minBand}
        maxBand={deiMetrics.overall.maxBand}
        pillars={deiMetrics.pillars}
        equilibriumBands={deiMetrics.equilibriumBands}
      />
    </div>
  );
};

export default DeiMetricsManager;
