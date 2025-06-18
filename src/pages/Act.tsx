import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTestUser } from '@/hooks/useTestUser';
import { useToast } from '@/hooks/use-toast';
import { Bundle } from '@/components/act/types/act-types';
import { useActScroll } from '@/hooks/useActScroll';
import ParticlesBackground from '@/components/ui/particles-background';
import ActBackground from '@/components/act/layout/ActBackground';
import ActHeader from '@/components/act/layout/ActHeader';
import ActCommandSection from '@/components/act/layout/ActCommandSection';
import ActMainContent from '@/components/act/layout/ActMainContent';
import ActDeliverySection from '@/components/act/layout/ActDeliverySection';
import ActPlaybooksSection from '@/components/act/layout/ActPlaybooksSection';
import ActScrollToTop from '@/components/act/layout/ActScrollToTop';

// View states for the main detail canvas
export type DetailView = 'assign-leverage' | 're-optimize' | 'launch-delivery' | 'default';

const Act: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Initialize test user for development
  useTestUser();
  
  // Track the active detail view based on command bar actions
  const [detailView, setDetailView] = useState<DetailView>('default');
  // Track the currently selected bundle - using consistent Bundle type
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  // Track if the playbooks library is expanded
  const [playbooksExpanded, setPlaybooksExpanded] = useState<boolean>(false);
  
  // Use scroll hook
  const { scrollToDelivery, setScrollToDelivery, showScrollToTop, hideHeader, scrollToTop } = useActScroll();

  // Handle command bar actions
  const handleCommandAction = (action: DetailView) => {
    console.log('Command action triggered:', action, 'Selected bundle:', selectedBundle?.id);
    
    // If no bundle is selected, don't proceed with bundle-specific actions
    if (!selectedBundle && action !== 'default') {
      console.log('No bundle selected, showing toast');
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

  // Handle bundle selection - using consistent Bundle type
  const handleBundleSelect = (bundle: Bundle | null) => {
    console.log('Bundle selected:', bundle?.id, bundle?.name);
    setSelectedBundle(bundle);
    setDetailView('default'); // Reset the view to default to show the bundle view
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <ParticlesBackground 
        count={60}
        colorStart="#14B8A6"
        colorEnd="#2563EB"
        minSize={2}
        maxSize={4}
        speed={0.5}
      />
      <ActBackground />

      <AnimatedPage>
        <ActHeader hideHeader={hideHeader} />

        {/* Main Content Container */}
        <div className="max-w-[1440px] mx-auto px-6 pb-8 relative z-10">
          <ActCommandSection onAction={handleCommandAction} />
          
          <ActMainContent 
            selectedBundle={selectedBundle}
            onBundleSelect={handleBundleSelect}
            detailView={detailView}
          />
          
          <ActDeliverySection 
            detailView={detailView}
            selectedBundleId={selectedBundle?.id || null}
          />
          
          <ActPlaybooksSection 
            playbooksExpanded={playbooksExpanded}
            onToggleExpanded={() => setPlaybooksExpanded(!playbooksExpanded)}
          />
        </div>
        
        <ActScrollToTop 
          showScrollToTop={showScrollToTop}
          onScrollToTop={scrollToTop}
        />
      </AnimatedPage>
    </div>
  );
};

export default Act;
