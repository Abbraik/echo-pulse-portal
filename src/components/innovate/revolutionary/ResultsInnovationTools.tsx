
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import {
  BarChartHorizontal,
  FileSpreadsheet, Rocket,
  MessageSquare, Share2, Download
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResultsInnovationToolsProps {
  showResults: boolean;
  engine: string;
}

export const ResultsInnovationTools: React.FC<ResultsInnovationToolsProps> = ({
  showResults,
  engine
}) => {
  const { t } = useTranslation();
  
  if (!showResults) {
    return (
      <GlassCard className="p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="text-3xl font-bold text-muted-foreground/50 mb-2">
          {t('resultsWillAppearHere')}
        </div>
        <p className="text-muted-foreground max-w-md">
          {t('generateSimulationFirst')}
        </p>
      </GlassCard>
    );
  }
  
  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {/* Impact Dashboard Card */}
      <GlassCard className="p-4 relative overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold flex items-center">
            <BarChartHorizontal size={16} className="mr-1.5 text-teal-400" />
            {t('impactDashboard')}
          </h3>
          <Tabs defaultValue="chart">
            <TabsList className="h-7 p-0.5">
              <TabsTrigger className="text-xs px-2 py-0.5" value="chart">{t('charts')}</TabsTrigger>
              <TabsTrigger className="text-xs px-2 py-0.5" value="metrics">{t('metrics')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 bg-black/10 dark:bg-white/5 rounded-md p-2 mb-3">
          <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground">
            {t('simulationResultsChart')}
          </div>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">ΔNDI</span>
            <span className="font-bold text-teal-400">+3.7 pts</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">{t('confidence')}</span>
            <span className="font-medium">82%</span>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
            {t('analyze')} 
          </Button>
        </div>
      </GlassCard>
      
      {/* Meta-Design Blueprint Card */}
      <GlassCard className="p-4 relative overflow-hidden flex flex-col">
        <h3 className="font-bold flex items-center mb-3">
          <FileSpreadsheet size={16} className="mr-1.5 text-purple-400" />
          {t('metaDesignBlueprint')}
        </h3>
        
        <div className="flex-1 flex flex-col gap-2 mb-3 text-xs">
          <div className="bg-black/10 dark:bg-white/5 rounded-md p-2 flex-1">
            <div className="font-medium text-purple-300 mb-1">{t('coreAssumptions')}</div>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
              <li>{t('assumptionExample1')}</li>
              <li>{t('assumptionExample2')}</li>
            </ul>
          </div>
          
          <div className="bg-black/10 dark:bg-white/5 rounded-md p-2 flex-1">
            <div className="font-medium text-blue-300 mb-1">{t('outcomes')}</div>
            <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
              <li>{t('outcomeExample1')}</li>
              <li>{t('outcomeExample2')}</li>
            </ul>
          </div>
        </div>
        
        <Button size="sm" className="w-full flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700">
          <Rocket size={14} />
          {t('generateBlueprint')}
        </Button>
      </GlassCard>
      
      {/* Comparative Innovation Dashboard */}
      <GlassCard className="p-4 relative overflow-hidden flex flex-col">
        <h3 className="font-bold flex items-center mb-3">
          <Share2 size={16} className="mr-1.5 text-blue-400" />
          {t('comparativeInnovationDashboard')}
        </h3>
        
        <div className="flex-1 mb-3">
          <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground bg-black/10 dark:bg-white/5 rounded-md p-2">
            {t('spiderChartPlaceholder')}
          </div>
        </div>
        
        <div className="flex gap-1 text-xs">
          <Tabs defaultValue="spider" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-7">
              <TabsTrigger className="text-xs" value="spider">{t('spiderGraph')}</TabsTrigger>
              <TabsTrigger className="text-xs" value="bar">{t('barMatrix')}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
            {t('compare')}
          </Button>
        </div>
      </GlassCard>
      
      {/* Futures Co-Creation Forum */}
      <GlassCard className="p-4 relative overflow-hidden flex flex-col">
        <h3 className="font-bold flex items-center mb-3">
          <MessageSquare size={16} className="mr-1.5 text-gold-400" />
          {t('futuresCoCreationForum')}
        </h3>
        
        <div className="flex flex-col flex-1 gap-2 mb-3">
          <div className="bg-black/10 dark:bg-white/5 rounded-md p-2 flex-1 flex flex-col items-center justify-center gap-1 text-center">
            <div className="text-sm font-medium mb-1">{t('liveDebateArena')}</div>
            <Button size="sm" variant="outline" className="text-xs">
              {t('joinRoom')}
            </Button>
          </div>
          
          <div className="bg-black/10 dark:bg-white/5 rounded-md p-2 flex-1">
            <div className="font-medium text-sm mb-1">{t('insightSparks')}</div>
            <div className="text-xs text-muted-foreground italic">"{t('insightSparkExample1')}"</div>
          </div>
        </div>
        
        <Button size="sm" variant="outline" className="w-full flex items-center justify-center gap-1">
          <Download size={14} />
          {t('recordInsight')}
        </Button>
      </GlassCard>
    </div>
  );
};
