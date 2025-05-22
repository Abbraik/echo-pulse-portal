
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Video, Mic, MessageCircle } from 'lucide-react';

export const CoCreationForum: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t('futuresCoCreationForum')}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Mic size={14} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Video size={14} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)]">
        <div className="glass-panel p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">{t('liveDebateArena')}</h4>
          <div className="bg-gray-800/40 rounded-lg flex items-center justify-center h-[80%]">
            <Video className="w-6 h-6 text-gray-500 mr-2" />
            <span className="text-gray-500">{t('joinVideoRoom')}</span>
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-xs text-gray-400">0 {t('participants')}</span>
            <Button size="sm" variant="outline" className="h-7 text-xs">
              {t('joinRoom')}
            </Button>
          </div>
        </div>
        
        <div className="glass-panel p-4 rounded-lg flex flex-col">
          <h4 className="text-sm font-medium mb-2">{t('collectiveWisdomEngine')}</h4>
          <div className="flex-1 overflow-y-auto bg-gray-800/20 rounded-lg p-3 mb-3">
            <div className="mb-4">
              <h5 className="text-xs font-medium text-gray-300 mb-1">{t('livePollsAndVotes')}</h5>
              <div className="glass-panel p-2 rounded-lg">
                <p className="text-sm mb-2">{t('shouldWeCapResourcePrices')}</p>
                <div className="flex gap-2 mb-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                    {t('yes')}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                    {t('no')}
                  </Button>
                </div>
                <div className="h-1 w-full bg-gray-700/40 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>65%</span>
                  <span>35%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-xs font-medium text-gray-300 mb-1">{t('insightSparks')}</h5>
              <div className="glass-panel p-2 rounded-lg mb-2">
                <p className="text-sm italic">"{t('insightSparkExample1')}"</p>
              </div>
              <div className="glass-panel p-2 rounded-lg">
                <p className="text-sm italic">"{t('insightSparkExample2')}"</p>
              </div>
            </div>
          </div>
          
          <Button size="sm" className="gap-1">
            <MessageCircle size={14} />
            <span>{t('recordInsight')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
