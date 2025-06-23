
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../../types/act-types';
import CoherenceMatrix from '../../canvas/working-canvas/CoherenceMatrix';

interface CoherenceTabProps {
  bundle: Bundle;
}

const CoherenceTab: React.FC<CoherenceTabProps> = ({ bundle }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Overall Coherence Summary */}
      <GlassCard className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{t('coherenceAnalysis', { defaultValue: 'Coherence Analysis' })}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-teal-400">{bundle.coherence || 0}%</div>
              <div className="text-sm text-gray-400">{t('overallCoherence', { defaultValue: 'Overall Coherence' })}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{bundle.pillars?.length || 0}</div>
              <div className="text-sm text-gray-400">{t('pillarsCovered', { defaultValue: 'Pillars Covered' })}</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{bundle.geography?.length || 0}</div>
              <div className="text-sm text-gray-400">{t('geographicCoverage', { defaultValue: 'Geographic Coverage' })}</div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Coherence Matrix */}
      <GlassCard className="p-6">
        <CoherenceMatrix
          bundleId={bundle.id}
          objectives={bundle.objectives || []}
          leveragePoints={bundle.leveragePoints || []}
        />
      </GlassCard>
    </div>
  );
};

export default CoherenceTab;
