
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
              <TabsTrigger className="text-xs px-2 py-0.5" value="chart">{t('chartsResults')}</TabsTrigger>
              <TabsTrigger className="text-xs px-2 py-0.5" value="metrics">{t('metricsResults')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 bg-black/10 dark:bg-white/5 rounded-md p-2 mb-3 relative">
          {/* Mock Chart */}
          <div className="absolute inset-0 p-2">
            <div className="h-full w-full relative">
              {/* Mock line chart */}
              <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path
                  d="M0,80 C50,70 100,40 150,60 C200,80 250,20 300,10"
                  fill="none"
                  stroke="rgba(45, 212, 191, 0.7)"
                  strokeWidth="2"
                />
                <path
                  d="M0,90 C50,85 100,95 150,80 C200,65 250,75 300,60"
                  fill="none"
                  stroke="rgba(79, 70, 229, 0.7)"
                  strokeWidth="2"
                />
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-1 right-1 bg-black/30 backdrop-blur-sm rounded px-1 py-0.5 text-xs flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-1"></div>
                  <span>Resources</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-1"></div>
                  <span>Waste</span>
                </div>
              </div>
            </div>
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
        
        <div className="flex-1 mb-3 relative">
          {/* Mock Spider Chart */}
          <div className="h-full w-full bg-black/10 dark:bg-white/5 rounded-md p-2 flex items-center justify-center">
            <svg width="90%" height="90%" viewBox="0 0 200 200">
              {/* Spider web background */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.1)" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.1)" />
              <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.1)" />
              
              {/* Axis lines */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.1)" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.1)" />
              <line x1="38" y1="38" x2="162" y2="162" stroke="rgba(255,255,255,0.1)" />
              <line x1="38" y1="162" x2="162" y2="38" stroke="rgba(255,255,255,0.1)" />
              
              {/* Data polygon - current */}
              <polygon 
                points="100,40 140,80 120,140 80,140 60,80" 
                fill="rgba(45, 212, 191, 0.3)" 
                stroke="rgb(45, 212, 191)" 
                strokeWidth="2"
              />
              
              {/* Data polygon - baseline */}
              <polygon 
                points="100,60 120,90 110,120 90,120 80,90" 
                fill="rgba(79, 70, 229, 0.3)" 
                stroke="rgb(79, 70, 229)" 
                strokeWidth="2"
              />
            </svg>
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
