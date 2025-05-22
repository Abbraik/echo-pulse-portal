
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, ArrowRight, Download } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export const ImpactDashboardRev: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-sm font-medium mb-2">{t('comparativeChart')}</h3>
        <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            {t('baselineVsForkChart')}
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-sm font-medium mb-3">{t('keyMetrics')}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Δ NDI:</span>
            <span className="text-teal-400">+3.5 points</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('timeToEquilibrium')}:</span>
            <span>3.2 years</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('bundlesImpacted')}:</span>
            <span>4 / 12</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button className="w-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2">
          <Save size={16} />
          {t('saveFork')}
        </Button>
        
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <ArrowRight size={16} />
          {t('promoteToBlueprint')}
        </Button>
        
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Download size={16} />
          {t('exportForkJSON')}
        </Button>
        
        <Button variant="secondary" className="w-full flex items-center justify-center gap-2 mt-4">
          {t('generateMetaDesignBlueprint')}
        </Button>
      </div>
    </div>
  );
};
