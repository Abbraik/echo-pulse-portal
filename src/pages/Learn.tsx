
import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { BookOpen, Info, Search, Clock, Filter, Calendar } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/use-translation';
import { SmartLibraryPanel } from '@/components/learn/SmartLibraryPanel';
import { KnowledgeGraphPanel } from '@/components/learn/KnowledgeGraphPanel';
import { InsightReviewPanel } from '@/components/learn/InsightReviewPanel';
import { TopLessonsFooter } from '@/components/learn/TopLessonsFooter';

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
              <h1 className="text-3xl font-extrabold">{t('learnZoneTitle')}: {t('knowledgeGraphTitle')}</h1>
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
        {/* Smart Library Panel - 35% viewport height */}
        <section className="h-auto mb-8">
          <SmartLibraryPanel />
        </section>
        
        {/* Knowledge Graph Diagnostics Panel - 35% viewport height */}
        <section className="h-auto mb-8">
          <KnowledgeGraphPanel />
        </section>
        
        {/* Insight Review Panel - 25% viewport height */}
        <section className="h-auto">
          <InsightReviewPanel />
        </section>
      </div>
      
      {/* Top Lessons to Prototype - 5% viewport height (Footer) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 h-[5vh] flex justify-center">
        <TopLessonsFooter />
      </div>
    </AnimatedPage>
  );
};

export default Learn;
