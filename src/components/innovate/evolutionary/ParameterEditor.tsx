
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

export const ParameterEditor: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>{t('intensity')}</span>
          <span>60%</span>
        </div>
        <input type="range" className="w-full" defaultValue="60" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>{t('duration')}</span>
          <span>24 weeks</span>
        </div>
        <input type="range" className="w-full" defaultValue="24" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4 weeks</span>
          <span>52 weeks</span>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>{t('integration')}</span>
          <span>75%</span>
        </div>
        <input type="range" className="w-full" defaultValue="75" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Isolated</span>
          <span>Fully Integrated</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="text-sm font-medium mb-2">{t('visualRuleBlocks')}</h3>
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-2 bg-teal-900/30 border border-teal-500/30 rounded-lg text-xs text-teal-300 cursor-move">
            {t('ifDemandIncreases')}
          </div>
          <div className="px-3 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg text-xs text-blue-300 cursor-move">
            {t('thenPriceRises')}
          </div>
          <div className="px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-xs text-purple-300 cursor-move">
            {t('byFactorOf')}
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button variant="outline" size="sm" className="text-xs">
            {t('addRuleBlock')}
          </Button>
        </div>
      </div>
    </div>
  );
};
