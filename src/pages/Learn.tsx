
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
import { motion } from 'framer-motion';

const Learn: React.FC = () => {
  const { t, isRTL } = useTranslation();

  return (
    <AnimatedPage>
      <motion.div 
        className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden relative z-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Cinematic Header Bar */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div 
            className="p-8 flex items-center space-x-6 rounded-2xl border border-white/20"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              backdropFilter: 'blur(24px)',
              boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <motion.div 
              className="p-4 rounded-xl text-teal-400"
              style={{
                background: 'rgba(20, 184, 166, 0.2)',
                boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.3)'
              }}
              animate={{ 
                boxShadow: [
                  'inset 0 0 20px rgba(20, 184, 166, 0.3)',
                  'inset 0 0 30px rgba(20, 184, 166, 0.5)',
                  'inset 0 0 20px rgba(20, 184, 166, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen size={32} />
            </motion.div>
            <div className="text-left">
              <div className="flex items-center">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-noto-bold" 
                    style={{ letterSpacing: '0.05em' }}>
                  {t('learnZoneTitle')}: {t('knowledgeGraphTitle')}
                </h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-3 h-8 w-8 text-platinum">
                      <Info size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="max-w-xs"
                    style={{
                      background: 'rgba(20, 30, 50, 0.9)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <p className="text-gray-300">{t('learnZoneDescription')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-lg text-gray-300 font-noto-medium mt-2">
                {t('learnZoneSubtitle')}
              </p>
            </div>
          </div>
        </motion.header>
        
        {/* Primary Sections with Sequential Animation */}
        <div className="flex-1 space-y-8 overflow-y-auto pb-24">
          {/* Smart Library Panel */}
          <motion.section 
            className="h-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SmartLibraryPanel />
          </motion.section>
          
          {/* Knowledge Graph Diagnostics Panel */}
          <motion.section 
            className="h-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <KnowledgeGraphPanel />
          </motion.section>
          
          {/* Insight Review Panel */}
          <motion.section 
            className="h-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <InsightReviewPanel />
          </motion.section>
        </div>
        
        {/* Top Lessons Footer - Fixed with Cinematic Glass */}
        <motion.div 
          className="mt-auto sticky bottom-0 left-0 right-0 p-6 z-10"
          style={{
            background: 'rgba(20, 30, 50, 0.8)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <TopLessonsFooter />
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
};

export default Learn;
