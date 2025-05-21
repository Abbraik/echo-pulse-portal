
import React from 'react';
import { ArrowRight, X } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const LearningFlowDiagram: React.FC = () => {
  const { t, isRTL } = useTranslation();
  
  return (
    <div className="glass-panel p-3 w-full max-w-3xl">
      <h3 className="text-sm font-medium mb-3">{t('learningFlowDiagram')}</h3>
      
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col items-center space-y-1">
          <div className="bg-blue-500/30 px-3 py-1 rounded-lg text-blue-300 font-medium">
            MONITOR
          </div>
          <span className="text-xs text-gray-400">{t('signalsIn')}</span>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              {!isRTL ? <ArrowRight className="mx-2 text-gray-400" /> : null}
              <div className="h-[2px] w-12 bg-gray-400"></div>
              {isRTL ? <ArrowRight className="mx-2 text-gray-400 transform rotate-180" /> : null}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{t('monitorToLearn')}</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="flex flex-col items-center space-y-1">
          <div className="bg-teal-500/30 px-3 py-1 rounded-lg text-teal-300 font-medium">
            LEARN
          </div>
          <span className="text-xs text-gray-400">{t('reflexiveMemory')}</span>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              {!isRTL ? <ArrowRight className="mx-2 text-gray-400" /> : null}
              <div className="h-[2px] w-12 bg-gray-400"></div>
              {isRTL ? <ArrowRight className="mx-2 text-gray-400 transform rotate-180" /> : null}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{t('learnToInnovate')}</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="flex flex-col items-center space-y-1">
          <div className="bg-purple-500/30 px-3 py-1 rounded-lg text-purple-300 font-medium">
            INNOVATE
          </div>
          <span className="text-xs text-gray-400">{t('systemRedesign')}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between px-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="h-[2px] w-12 bg-gray-600"></div>
                <X className="mx-1 text-gray-600" size={14} />
                <div className="h-[2px] w-12 bg-gray-600"></div>
              </div>
              <div className="flex items-center mt-2">
                <div className="bg-gray-700/30 px-3 py-1 rounded-lg text-gray-400 font-medium text-sm">
                  THINK
                </div>
                <div className="w-12"></div>
                <div className="bg-gray-700/30 px-3 py-1 rounded-lg text-gray-400 font-medium text-sm">
                  ACT
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{t('directModificationBlocked')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
