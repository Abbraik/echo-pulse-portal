
import React, { useState } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useTranslation } from '@/hooks/use-translation';
import CommandBar from '@/components/act/CommandBar';
import BundlesRail from '@/components/act/BundlesRail';
import DetailCanvas from '@/components/act/DetailCanvas';
import DeliveryChains from '@/components/act/DeliveryChains';
import PlaybooksLibrary from '@/components/act/PlaybooksLibrary';

// View states for the main detail canvas
export type DetailView = 'assign-leverage' | 're-optimize' | 'launch-delivery' | 'default';

const Act: React.FC = () => {
  const { t } = useTranslation();
  // Track the active detail view based on command bar actions
  const [detailView, setDetailView] = useState<DetailView>('default');
  // Track the currently selected bundle
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  // Track if the playbooks library is expanded
  const [playbooksExpanded, setPlaybooksExpanded] = useState<boolean>(false);

  // Handle command bar actions
  const handleCommandAction = (action: DetailView) => {
    setDetailView(action);
    if (action === 'launch-delivery') {
      // Auto-scroll to delivery chains manager when launch is clicked
      setTimeout(() => {
        document.getElementById('delivery-chains')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Handle bundle selection
  const handleBundleSelect = (bundleId: string) => {
    setSelectedBundle(bundleId);
    setDetailView('default'); // Reset the view to default to show the bundle view
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col h-full">
        {/* Command Bar */}
        <CommandBar onAction={handleCommandAction} />
        
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
      </div>
    </AnimatedPage>
  );
};

export default Act;
