
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import {
  BarChartHorizontal,
  FileSpreadsheet, Rocket,
  MessageSquare, Share2, Download
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

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
    <GlassCard className="p-4 h-full flex flex-col shadow-[inset_0_0_15px_rgba(20,184,166,0.15)]">
      <Tabs defaultValue="impact" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mb-4 bg-background/30">
          <TabsTrigger value="impact" className="flex items-center gap-1.5">
            <BarChartHorizontal size={16} />
            {t('impactDashboard')}
          </TabsTrigger>
          <TabsTrigger value="blueprint" className="flex items-center gap-1.5">
            <FileSpreadsheet size={16} />
            {t('metaDesignBlueprint')}
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-1.5">
            <Share2 size={16} />
            {t('comparativeInnovation')}
          </TabsTrigger>
          <TabsTrigger value="cocreate" className="flex items-center gap-1.5">
            <MessageSquare size={16} />
            {t('futuresCoCreation')}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* Impact Dashboard Tab */}
          <TabsContent value="impact" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex-1 bg-black/10 dark:bg-white/5 rounded-md p-3 mb-3 relative overflow-hidden">
              {/* Mock Chart */}
              <div className="absolute inset-0 p-3">
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
                <span className="text-muted-foreground">NDI</span>
                <span className="font-bold text-teal-400">68 → 70.4 (+2.4)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">DEI</span>
                <span className="font-medium">65 → 66.7 (+1.7)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Trust</span>
                <span className="font-medium">69 → 72 (+3)</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                {t('analyze')} 
              </Button>
            </div>
          </TabsContent>

          {/* Meta-Design Blueprint Tab */}
          <TabsContent value="blueprint" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex-1 flex flex-col gap-3 mb-3 text-xs">
              <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
                <div className="font-medium text-purple-300 mb-1">{t('coreAssumptions')}</div>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  <li>UBI → Equitable Access</li>
                  <li>Commons → Shared Resources</li>
                </ul>
              </div>
              
              <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
                <div className="font-medium text-blue-300 mb-1">{t('newStocksFlows')}</div>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  <li>Well-Being stock added</li>
                  <li>Resilience loop added</li>
                </ul>
              </div>
              
              <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
                <div className="font-medium text-amber-300 mb-1">{t('outcomesRisks')}</div>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  <li>+3.2% Trust</li>
                  <li>-1.5% Resource Consumption</li>
                </ul>
              </div>
            </div>
            
            <Button size="sm" className="w-full flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700">
              <Download size={14} />
              {t('exportBlueprint')}
            </Button>
          </TabsContent>

          {/* Comparative Innovation Tab */}
          <TabsContent value="compare" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex-1 mb-3 relative">
              {/* Mock Spider Chart */}
              <div className="h-full w-full bg-black/10 dark:bg-white/5 rounded-md p-3 flex items-center justify-center">
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
                  
                  {/* Labels */}
                  <text x="100" y="15" textAnchor="middle" fontSize="10" fill="currentColor">Equity (8.5)</text>
                  <text x="185" y="100" textAnchor="start" fontSize="10" fill="currentColor">Resilience (7.2)</text>
                  <text x="100" y="190" textAnchor="middle" fontSize="10" fill="currentColor">Sustainability (6.8)</text>
                  <text x="15" y="100" textAnchor="end" fontSize="10" fill="currentColor">Cohesion (7.9)</text>
                  <text x="30" y="30" textAnchor="end" fontSize="10" fill="currentColor">Growth (5.5)</text>
                  
                  {/* Data polygon - current */}
                  <polygon 
                    points="100,30 160,60 130,140 70,140 40,60" 
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
                    className="animate-pulse-subtle"
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
          </TabsContent>

          {/* Futures Co-Creation Tab */}
          <TabsContent value="cocreate" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex flex-col flex-1 gap-3 mb-3">
              <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1 flex flex-col items-center justify-center gap-1 text-center">
                <div className="text-sm font-medium mb-1">{t('liveDebateArena')}</div>
                <Button size="sm" variant="outline" className="text-xs">
                  {t('joinRoom')}
                </Button>
              </div>
              
              <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
                <div className="font-medium text-sm mb-1">{t('insightSparks')}</div>
                <div className="text-xs text-muted-foreground italic">"How would UBI affect migration patterns?"</div>
                <div className="text-xs text-muted-foreground mt-2 italic">"Can circular economy principles scale globally?"</div>
              </div>
            </div>
            
            <Button size="sm" variant="outline" className="w-full flex items-center justify-center gap-1">
              <Download size={14} />
              {t('recordInsight')}
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </GlassCard>
  );
};
