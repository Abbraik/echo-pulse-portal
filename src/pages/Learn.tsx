
import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';

const Learn: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <AnimatedPage>
      <motion.div 
        className="flex flex-col min-h-screen overflow-hidden relative z-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Cinematic Header Bar with Premium Styling */}
        <motion.header 
          className="mb-8 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div 
            className="p-8 flex items-center justify-between rounded-2xl border border-white/20 relative overflow-hidden"
            style={{
              background: 'rgba(20, 30, 50, 0.6)',
              backdropFilter: 'blur(24px)',
              boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-blue-500/5 opacity-50"></div>
            
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''} space-x-6 ${isRTL ? 'space-x-reverse' : ''} relative z-10`}>
              <motion.div 
                className="p-4 rounded-xl text-teal-400 relative"
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
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen size={32} />
                {/* Subtle pulse effect */}
                <motion.div 
                  className="absolute inset-0 rounded-xl bg-teal-400/20"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="text-left">
                <div className="flex items-center">
                  <motion.h1 
                    className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 font-noto-bold" 
                    style={{ letterSpacing: '0.05em' }}
                    initial={{ letterSpacing: '-0.5em', opacity: 0 }}
                    animate={{ letterSpacing: '0.05em', opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  >
                    {t('learnZoneTitle')}: {t('knowledgeGraphTitle')}
                  </motion.h1>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="icon" className="ml-3 h-8 w-8 text-platinum hover:bg-teal-500/20">
                          <Info size={20} />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="max-w-xs z-50"
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
                <motion.p 
                  className="text-lg text-gray-300 font-noto-medium mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  {t('learnZoneSubtitle')}
                </motion.p>
              </div>
            </div>

            {/* Premium gradient border animation */}
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.3), rgba(37, 99, 235, 0.3), rgba(20, 184, 166, 0.3))',
                backgroundSize: '300% 300%'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.header>
        
        {/* Main Content Container with Cinematic Layout */}
        <div className="flex-1 max-w-[1440px] mx-auto w-full px-6 space-y-8 pb-24">
          {/* Smart Library Panel with Enhanced Animations */}
          <motion.section 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: pageLoaded ? 1 : 0, y: pageLoaded ? 0 : 30 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="relative">
              <SmartLibraryPanel />
              {/* Ambient glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.1), transparent 70%)',
                  filter: 'blur(20px)'
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
          </motion.section>
          
          {/* Knowledge Graph Diagnostics Panel */}
          <motion.section 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: pageLoaded ? 1 : 0, y: pageLoaded ? 0 : 30 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="relative">
              <KnowledgeGraphPanel />
              {/* Diagnostic glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 70%, rgba(37, 99, 235, 0.1), transparent 60%)',
                  filter: 'blur(25px)'
                }}
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
          </motion.section>
          
          {/* Insight Review Panel */}
          <motion.section 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: pageLoaded ? 1 : 0, y: pageLoaded ? 0 : 30 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="relative">
              <InsightReviewPanel />
              {/* Review glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 70% 30%, rgba(147, 51, 234, 0.1), transparent 60%)',
                  filter: 'blur(30px)'
                }}
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                  x: [0, 5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>
          </motion.section>
        </div>
        
        {/* Top Lessons Footer with Cinematic Glass */}
        <motion.div 
          className="mt-auto sticky bottom-0 left-0 right-0 p-6 z-20 relative"
          style={{
            background: 'rgba(20, 30, 50, 0.8)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          {/* Floating particles effect */}
          <motion.div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [-20, -60, -20],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
          
          <TopLessonsFooter />
          
          {/* Premium border gradient */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(20, 184, 166, 0.5), rgba(37, 99, 235, 0.5), transparent)'
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Responsive breakpoint indicators (dev helper) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-black/50 px-2 py-1 rounded z-50">
            <span className="sm:hidden">XS</span>
            <span className="hidden sm:inline md:hidden">SM</span>
            <span className="hidden md:inline lg:hidden">MD</span>
            <span className="hidden lg:inline xl:hidden">LG</span>
            <span className="hidden xl:inline 2xl:hidden">XL</span>
            <span className="hidden 2xl:inline">2XL</span>
          </div>
        )}
      </motion.div>
    </AnimatedPage>
  );
};

export default Learn;
