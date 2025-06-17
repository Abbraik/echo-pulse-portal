
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRealBundle } from '../hooks/useRealBundles';
import CanvasHeader from './working-canvas/CanvasHeader';
import CanvasTabNavigation from './working-canvas/CanvasTabNavigation';
import OverviewTab from './working-canvas/tabs/OverviewTab';
import ObjectivesTab from './working-canvas/tabs/ObjectivesTab';
import GeographyTab from './working-canvas/tabs/GeographyTab';
import LeverageTab from './working-canvas/tabs/LeverageTab';
import StakeholdersTab from './working-canvas/tabs/StakeholdersTab';
import MetricsTab from './working-canvas/tabs/MetricsTab';

interface ActWorkingCanvasProps {
  bundleId: string | null;
  onClose: () => void;
}

const ActWorkingCanvas: React.FC<ActWorkingCanvasProps> = ({ bundleId, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: bundle, isLoading, error } = useRealBundle(bundleId || '');

  if (!bundleId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 w-full h-full z-50 glass-panel-cinematic rounded-2xl flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="absolute inset-0 w-full h-full z-50 glass-panel-cinematic rounded-2xl flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Error loading bundle data</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab bundle={bundle} />;
      case 'objectives':
        return <ObjectivesTab bundle={bundle} />;
      case 'geography':
        return <GeographyTab bundle={bundle} />;
      case 'leverage':
        return <LeverageTab bundle={bundle} />;
      case 'stakeholders':
        return <StakeholdersTab />;
      case 'metrics':
        return <MetricsTab bundle={bundle} />;
      default:
        return <div className="text-center text-gray-400">Tab content not available</div>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 w-full h-full z-50"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <div className="w-full h-full glass-panel-cinematic rounded-2xl flex flex-col relative overflow-hidden">
          <CanvasHeader bundle={bundle} onClose={onClose} />
          <CanvasTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActWorkingCanvas;
