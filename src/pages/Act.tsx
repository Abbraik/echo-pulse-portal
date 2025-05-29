
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useTranslation } from '@/hooks/use-translation';
import CommandBar from '@/components/act/CommandBar';
import BundlesRail from '@/components/act/BundlesRail';
import DetailCanvas from '@/components/act/DetailCanvas';
import DeliveryChains from '@/components/act/DeliveryChains';
import PlaybooksLibrary from '@/components/act/PlaybooksLibrary';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// View states for the main detail canvas
export type DetailView = 'assign-leverage' | 're-optimize' | 'launch-delivery' | 'default';

const Act: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { toast } = useToast();
  
  // Track the active detail view based on command bar actions
  const [detailView, setDetailView] = useState<DetailView>('default');
  // Track the currently selected bundle
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  // Track if the playbooks library is expanded
  const [playbooksExpanded, setPlaybooksExpanded] = useState<boolean>(false);
  // Track if we need to scroll to the delivery chains
  const [scrollToDelivery, setScrollToDelivery] = useState(false);
  // Track the visibility of the scroll-to-top button
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  // Track header visibility for cinematic effect
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle command bar actions
  const handleCommandAction = (action: DetailView) => {
    // If no bundle is selected, don't proceed
    if (!selectedBundle && action !== 'default') {
      toast({
        title: t('noSelectedBundle', { defaultValue: 'No Bundle Selected' }),
        description: t('pleaseSelectBundle', { defaultValue: 'Please select a bundle before performing this action.' }),
        variant: "destructive"
      });
      return;
    }

    setDetailView(action);
    
    if (action === 'launch-delivery') {
      // Auto-scroll to delivery chains manager when launch is clicked
      setScrollToDelivery(true);
      
      // Show a toast indicating successful launch
      toast({
        title: t('deliveryLaunched', { defaultValue: 'Delivery Plan Launched' }),
        description: t('bundleLaunchedToDelivery', { defaultValue: 'Bundle has been launched to delivery chains.' }),
      });
    }
  };

  // Handle bundle selection
  const handleBundleSelect = (bundleId: string) => {
    setSelectedBundle(bundleId);
    setDetailView('default'); // Reset the view to default to show the bundle view
  };
  
  // Effect to scroll to delivery chains when needed
  useEffect(() => {
    if (scrollToDelivery) {
      setTimeout(() => {
        document.getElementById('delivery-chains')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
        setScrollToDelivery(false);
      }, 800); // Give time for animations
    }
  }, [scrollToDelivery]);
  
  // Effect to track scroll position for showing scroll-to-top button and header behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollToTop(currentScrollY > 500);
      
      // Header hide/show logic
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(currentScrollY);
    };
    
    // Handle mouse near top to reveal header
    const handleMouseNearTop = (e: MouseEvent) => {
      if (e.clientY < 20 && hideHeader) {
        setHideHeader(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseNearTop);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseNearTop);
    };
  }, [lastScrollY, hideHeader]);
  
  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Enhanced cinematic background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>

      <AnimatedPage>
        {/* Cinematic Header Bar */}
        <motion.header 
          className="sticky top-0 z-50 w-full backdrop-blur-[24px] py-4 px-6 mb-8"
          style={{
            background: 'rgba(20, 30, 50, 0.6)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
            boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: hideHeader ? -100 : 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-3 rounded-2xl bg-blue-500/20 text-blue-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Settings size={28} />
              </motion.div>
              <div className="text-left">
                <motion.h1 
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-500 font-noto-bold"
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  ACT ⚙️: {t("strategyAndDelivery", { defaultValue: "STRATEGY & DELIVERY" })}
                </motion.h1>
                <motion.p 
                  className="text-base text-gray-300 font-noto-medium"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {t("actCoreDesc", { defaultValue: "Transform insights into coordinated delivery" })}
                </motion.p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Container */}
        <div className="max-w-[1440px] mx-auto px-6 pb-8 relative z-10">
          {/* Command Bar Section */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mb-8"
          >
            <div 
              className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
              style={{
                background: 'rgba(20, 30, 50, 0.6)',
                boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl"></div>
              <div className="relative">
                <CommandBar onAction={handleCommandAction} />
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-6 mb-8"
          >
            {/* Bundles Rail (Sidebar) */}
            <motion.div 
              className="w-full lg:w-1/5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div 
                className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
                style={{
                  background: 'rgba(20, 30, 50, 0.6)',
                  boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
                <div className="relative">
                  <BundlesRail 
                    selectedBundle={selectedBundle} 
                    onSelectBundle={handleBundleSelect}
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Detail Canvas (Main content) */}
            <motion.div 
              className="w-full lg:w-4/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div 
                className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
                style={{
                  background: 'rgba(20, 30, 50, 0.6)',
                  boxShadow: 'inset 0 0 30px rgba(59, 130, 246, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-2xl"></div>
                <div className="relative">
                  <DetailCanvas 
                    view={detailView} 
                    selectedBundle={selectedBundle}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Delivery Chains Manager */}
          <motion.div 
            id="delivery-chains"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            className="mb-8"
          >
            <div 
              className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
              style={{
                background: 'rgba(20, 30, 50, 0.6)',
                boxShadow: 'inset 0 0 30px rgba(139, 69, 199, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/5 rounded-2xl"></div>
              <div className="relative">
                <DeliveryChains 
                  highlightBundle={detailView === 'launch-delivery' ? selectedBundle : null}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Playbooks Library */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <div 
              className="rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden relative"
              style={{
                background: 'rgba(20, 30, 50, 0.6)',
                boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/5 rounded-2xl"></div>
              <div className="relative">
                <PlaybooksLibrary 
                  expanded={playbooksExpanded}
                  onToggleExpanded={() => setPlaybooksExpanded(!playbooksExpanded)}
                />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll to top button */}
        {showScrollToTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button 
              variant="outline"
              size="icon" 
              className="fixed bottom-6 right-6 z-50 rounded-full h-12 w-12 backdrop-blur-[24px] border border-white/20 shadow-lg transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(20, 184, 166, 0.8)',
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)'
              }}
              onClick={scrollToTop}
            >
              <ArrowUpCircle className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatedPage>
    </div>
  );
};

export default Act;
