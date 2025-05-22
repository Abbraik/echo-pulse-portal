
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, SkipForward } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export const SimulatorControls: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">{t('simulationMode')}</h4>
          <Select defaultValue="single">
            <SelectTrigger className="w-full bg-white/5 border-white/10">
              <SelectValue placeholder={t('selectMode')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">{t('singleRun')}</SelectItem>
              <SelectItem value="batch">{t('batchSweep')}</SelectItem>
              <SelectItem value="monte">{t('monteCarlo')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">{t('timeHorizon')}</h4>
          <Select defaultValue="5years">
            <SelectTrigger className="w-full bg-white/5 border-white/10">
              <SelectValue placeholder={t('selectTimespan')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1year">1 {t('year')}</SelectItem>
              <SelectItem value="5years">5 {t('years')}</SelectItem>
              <SelectItem value="10years">10 {t('years')}</SelectItem>
              <SelectItem value="20years">20 {t('years')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">{t('timeStep')}</span>
          <span className="text-sm">0.25</span>
        </div>
        <input type="range" className="w-full" defaultValue="25" min="1" max="100" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{t('fine')}</span>
          <span>{t('coarse')}</span>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button className="flex-1 bg-teal-600 hover:bg-teal-500 gap-1">
          <Play size={16} />
          {t('runSimulation')}
        </Button>
        <Button variant="outline" className="flex-1 gap-1">
          <SkipForward size={16} />
          {t('batchRun')}
        </Button>
      </div>
    </div>
  );
};
