
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
      <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
        <header className="mb-6">
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
        
        <div className="flex-1 space-y-6 overflow-y-auto pb-20">
          {/* Smart Library Panel */}
          <section className="h-auto mb-6">
            <SmartLibraryPanel />
          </section>
          
          {/* Knowledge Graph Diagnostics Panel */}
          <section className="h-auto mb-6">
            <KnowledgeGraphPanel />
          </section>
          
          {/* Insight Review Panel */}
          <section className="h-auto mb-6">
            <InsightReviewPanel />
          </section>
        </div>
        
        {/* Top Lessons to Prototype - Fixed Footer */}
        <div className="mt-auto sticky bottom-0 left-0 right-0 p-4 bg-background/50 backdrop-blur-sm z-10">
          <TopLessonsFooter />
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Learn;
