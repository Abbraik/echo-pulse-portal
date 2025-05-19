
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useTranslation } from '@/hooks/use-translation';
import CommandBar from '@/components/act/CommandBar';
import BundlesRail from '@/components/act/BundlesRail';
import DetailCanvas from '@/components/act/DetailCanvas';
import DeliveryChains from '@/components/act/DeliveryChains';
import PlaybooksLibrary from '@/components/act/PlaybooksLibrary';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  // Effect to track scroll position for showing scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col">
        {/* Command Bar */}
        <CommandBar 
          onAction={handleCommandAction} 
        />
        
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          {/* Bundles Rail (Sidebar) */}
          <div className="w-full lg:w-1/5">
            <BundlesRail 
              selectedBundle={selectedBundle} 
              onSelectBundle={handleBundleSelect}
            />
          </div>
          
          {/* Detail Canvas (Main content) */}
          <div className="w-full lg:w-4/5">
            <DetailCanvas 
              view={detailView} 
              selectedBundle={selectedBundle}
            />
          </div>
        </div>
        
        {/* Delivery Chains Manager */}
        <div id="delivery-chains" className="mt-6">
          <DeliveryChains 
            highlightBundle={detailView === 'launch-delivery' ? selectedBundle : null}
          />
        </div>
        
        {/* Playbooks Library */}
        <div className="mt-6">
          <PlaybooksLibrary 
            expanded={playbooksExpanded}
            onToggleExpanded={() => setPlaybooksExpanded(!playbooksExpanded)}
          />
        </div>
        
        {/* Scroll to top button */}
        {showScrollToTop && (
          <Button 
            variant="outline"
            size="icon" 
            className="fixed bottom-6 right-6 z-50 rounded-full h-12 w-12 bg-teal-500/80 hover:bg-teal-600 border-0 shadow-lg"
            onClick={scrollToTop}
          >
            <ArrowUpCircle className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Act;
