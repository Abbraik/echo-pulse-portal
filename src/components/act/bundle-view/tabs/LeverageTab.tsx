import React from 'react';
import { Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../../types/act-types';
import EnhancedLeverageSelector from '../../components/EnhancedLeverageSelector';
import CoherenceMatrix from '../../canvas/working-canvas/CoherenceMatrix';
interface LeverageTabProps {
  bundle: Bundle;
}
const LeverageTab: React.FC<LeverageTabProps> = ({
  bundle
}) => {
  const {
    t
  } = useTranslation();

  // Convert bundle.leveragePoints to string array if needed
  const leveragePointIds = Array.isArray(bundle.leveragePoints) ? bundle.leveragePoints.filter((point): point is string => typeof point === 'string') : [];
  return <div className="space-y-6">
      {/* Enhanced Leverage Point Selector Section */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">{t('leveragePoints', {
            defaultValue: 'Leverage Points'
          })}</h3>
          <Button variant="outline" size="sm" className="bg-white/5">
            <Sparkles className="h-4 w-4 mr-1" />
            {t('suggestPoints', {
            defaultValue: 'Suggest Points'
          })}
          </Button>
        </div>
        
        <EnhancedLeverageSelector bundleId={bundle.id} initialPoints={leveragePointIds} onUpdate={points => {
        console.log('Leverage points updated:', points);
      }} />
      </GlassCard>

      {/* Coherence Matrix Section */}
      
    </div>;
};
export default LeverageTab;