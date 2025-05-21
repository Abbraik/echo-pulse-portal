
import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { BookOpen, Info, Filter, Search, ArrowRight, Clock, Tag, Network, FileText, MessageSquareText, AlertTriangle, Activity, FileX } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatternIntelligenceLayer } from '@/components/learn/PatternIntelligenceLayer';
import { DiagnosticAnalysisLayer } from '@/components/learn/DiagnosticAnalysisLayer';
import { ReflexIntegrationLayer } from '@/components/learn/ReflexIntegrationLayer';
import { LearningFlowDiagram } from '@/components/learn/LearningFlowDiagram';

const Learn: React.FC = () => {
  const { t, isRTL } = useTranslation();

  return (
    <AnimatedPage>
      <header className="mb-8">
        <div className="glass-panel p-6 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            <BookOpen size={24} />
          </div>
          <div className="text-left">
            <div className="flex items-center">
              <h1 className="text-3xl font-extrabold">{t('learnZoneTitle')}: {t('reflexiveMemoryTitle')}</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                    <Info size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{t('learnZoneDescription')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-gray-400">
              {t('learnZoneSubtitle')}
            </p>
          </div>
        </div>
      </header>
      
      <div className="space-y-8 pb-20">
        {/* Memory & Pattern Intelligence Layer */}
        <section>
          <PatternIntelligenceLayer />
        </section>
        
        {/* Diagnostic & Causal Analysis Layer */}
        <section>
          <DiagnosticAnalysisLayer />
        </section>
        
        {/* Human–AI Reflex Integration Layer */}
        <section>
          <ReflexIntegrationLayer />
        </section>
      </div>
      
      {/* Learning Flow Diagram (Sticky Footer) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center">
        <LearningFlowDiagram />
      </div>
    </AnimatedPage>
  );
};

export default Learn;
