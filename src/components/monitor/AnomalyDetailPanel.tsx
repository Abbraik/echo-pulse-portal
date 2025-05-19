
import React from 'react';
import { X, ArrowLeft, Play, Plus, Search, TrendingDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AnomalyDetailPanelProps {
  anomaly: {
    id: number;
    title: string;
    change: string;
    date: string;
    description: string;
    rootCause?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AnomalyDetailPanel: React.FC<AnomalyDetailPanelProps> = ({
  anomaly,
  isOpen,
  onClose
}) => {
  const { t, isRTL } = useTranslation();
  
  if (!anomaly) return null;
  
  const handleDeepAnalysis = () => {
    console.log('Run deep analysis in THINK for anomaly:', anomaly);
    onClose();
  };
  
  const handleTriggerPlaybook = () => {
    console.log('Trigger playbook for anomaly:', anomaly);
    onClose();
  };
  
  const handleNewBundle = () => {
    console.log('Create new bundle for anomaly:', anomaly);
    onClose();
  };
  
  const handleViewInMonitor = () => {
    console.log('View in MONITOR for anomaly:', anomaly);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side={isRTL ? "left" : "right"}
        className="w-full sm:max-w-md glass-panel-deep border-r-0 border-l-0"
      >
        <SheetHeader className={`flex flex-row items-center justify-between ${isRTL ? 'rtl' : 'ltr'}`}>
          <div className="flex flex-col items-start">
            <SheetTitle className="text-xl flex items-center">
              {anomaly.title}
              <span className={`text-${anomaly.change.startsWith('-') ? 'red' : 'green'}-400 ml-2`}>
                {anomaly.change}
              </span>
            </SheetTitle>
            <p className="text-xs text-gray-400">{anomaly.date}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="mt-0">
            {isRTL ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </Button>
        </SheetHeader>
        
        <div className="my-6 space-y-6">
          {/* Overview Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{t('overview')}</h3>
            <p className="text-sm text-gray-400">{anomaly.description}</p>
            
            <div className="flex items-center justify-between mt-2 glass-panel p-3">
              <span className="text-sm">{t('severity')}</span>
              <Badge className="bg-amber-500">{t('medium')}</Badge>
            </div>
          </div>
          
          <Separator />
          
          {/* Root Cause Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{t('rootCauseHint')}</h3>
            <div className="glass-panel p-3">
              <p className="text-sm">{anomaly.rootCause || t('linkedFeedbackLoop')}</p>
              
              <div className="flex items-center mt-2 text-xs text-teal-400">
                <div className="h-1 w-1 rounded-full bg-teal-400 mr-1"></div>
                <span>{t('social')}</span>
                <ArrowRight className="h-3 w-3 mx-1" />
                <span>{t('trust')}</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">{t('quickActions')}</h3>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-left" 
              onClick={handleDeepAnalysis}
            >
              <Search className="mr-2 h-4 w-4" />
              {t('runDeepAnalysisThink')}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={handleTriggerPlaybook}
            >
              <Play className="mr-2 h-4 w-4" />
              {t('triggerPlaybook')}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={handleNewBundle}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('newBundle')}
            </Button>
          </div>
        </div>
        
        <SheetFooter className="mt-auto">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleViewInMonitor}
          >
            {t('viewInMonitor')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
