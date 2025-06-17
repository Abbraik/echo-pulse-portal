
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../../types/act-types';

interface CoherenceTabProps {
  bundle: Bundle;
}

const CoherenceTab: React.FC<CoherenceTabProps> = ({ bundle }) => {
  const { t } = useTranslation();

  const getCoherenceColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-amber-400';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <GlassCard className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('coherenceCheck', { defaultValue: 'Coherence Check' })}</h3>
        <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${getCoherenceColor(bundle.coherence)}`}>
          <div className="absolute inset-1 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">{bundle.coherence}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">{t('pillarCoverage', { defaultValue: 'Pillar Coverage' })}</h4>
          {bundle.pillars && bundle.pillars.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {bundle.pillars.map((pillar, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                  <span className="text-sm text-gray-300 capitalize">{pillar}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No pillars assigned</p>
          )}
        </div>
        
        <div>
          <h4 className="font-medium mb-4">{t('geographicCoverage', { defaultValue: 'Geographic Coverage' })}</h4>
          {bundle.geography && bundle.geography.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {bundle.geography.map((location, index) => (
                <Badge key={index} variant="outline" className="bg-blue-500/10 border-blue-500/30">
                  {location}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No geographic areas specified</p>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default CoherenceTab;
