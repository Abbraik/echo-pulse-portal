
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

export const ImpactDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-sm font-medium mb-3">{t('ndiImpact')}</h3>
        <div className="text-center">
          <span className="text-2xl font-bold text-teal-400">+2.8</span>
          <span className="text-xs text-gray-400 ml-1">{t('points')}</span>
        </div>
        <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full" style={{ width: '65%' }}></div>
        </div>
      </div>
      
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-sm font-medium mb-3">{t('deiBreakdown')}</h3>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>{t('diversity')}</span>
              <span className="text-teal-400">+1.5</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full">
              <div className="h-1.5 bg-teal-500 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>{t('equity')}</span>
              <span className="text-amber-400">+0.7</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full">
              <div className="h-1.5 bg-amber-500 rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>{t('inclusion')}</span>
              <span className="text-blue-400">+0.6</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full">
              <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-sm font-medium mb-3">{t('pillarBreakdown')}</h3>
        <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            {t('pillarVisualizationPlaceholder')}
          </div>
        </div>
      </div>
    </div>
  );
};
