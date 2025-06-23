
import React from 'react';
import { Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../../types/act-types';

interface LeverageTabProps {
  bundle: Bundle;
}

const LeverageTab: React.FC<LeverageTabProps> = ({ bundle }) => {
  const { t } = useTranslation();

  return (
    <GlassCard className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('leveragePoints', { defaultValue: 'Leverage Points' })}</h3>
        <Button variant="outline" size="sm" className="bg-white/5">
          <Sparkles className="h-4 w-4 mr-1" />
          {t('suggestPoints', { defaultValue: 'Suggest Points' })}
        </Button>
      </div>
      
      <div className="space-y-4">
        {bundle.leveragePoints && bundle.leveragePoints.length > 0 ? (
          bundle.leveragePoints.map((point, index) => {
            if (!point) return null; // Skip null/undefined points
            
            return (
              <div key={`leverage-${index}`} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <span className="text-gray-300">
                  {typeof point === 'object' && point !== null ? 
                    (point as any).name || `Leverage Point ${index + 1}` : 
                    point
                  }
                </span>
                {typeof point === 'object' && point !== null && (point as any).type && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {(point as any).type}
                  </Badge>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No leverage points identified</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default LeverageTab;
