
import React, { useState } from 'react';
import ActHeader from '@/components/act/layout/ActHeader';
import ActBackground from '@/components/act/layout/ActBackground';
import ActCommandSection from '@/components/act/layout/ActCommandSection';
import ActMainContent from '@/components/act/layout/ActMainContent';
import ActDeliverySection from '@/components/act/layout/ActDeliverySection';
import ActScrollToTop from '@/components/act/layout/ActScrollToTop';
import { DemoActContextPanel } from '@/components/act/DemoActContextPanel';
import { Bundle } from '@/components/act/types/act-types';
import { DetailView } from '@/components/act/types/detail-view-types';

const Act = () => {
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [detailView, setDetailView] = useState<DetailView>('default');
  const [hideHeader, setHideHeader] = useState(false);
  const [isDeliveryCollapsed, setIsDeliveryCollapsed] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleAction = (action: DetailView) => {
    setDetailView(action);
    
    if (action === 'launch-delivery') {
      // Scroll to delivery section
      setTimeout(() => {
        const deliverySection = document.getElementById('delivery-chains');
        if (deliverySection) {
          deliverySection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleBundleSelect = (bundle: Bundle | null) => {
    setSelectedBundle(bundle);
    setDetailView('default');
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      <ActBackground />
      <div className="relative z-10">
        <ActHeader hideHeader={hideHeader} />
        <div className="container mx-auto px-4 py-8">
          <DemoActContextPanel />
          <ActCommandSection onAction={handleAction} />
          <ActMainContent 
            selectedBundle={selectedBundle}
            onBundleSelect={handleBundleSelect}
            detailView={detailView}
            isDeliveryCollapsed={isDeliveryCollapsed}
          />
          <ActDeliverySection
            detailView={detailView}
            selectedBundleId={selectedBundle?.id || null}
            isCollapsed={isDeliveryCollapsed}
            onToggleCollapse={() => setIsDeliveryCollapsed(!isDeliveryCollapsed)}
          />
        </div>
        <ActScrollToTop 
          showScrollToTop={showScrollToTop}
          onScrollToTop={handleScrollToTop}
        />
      </div>
    </div>
  );
};

export default Act;
