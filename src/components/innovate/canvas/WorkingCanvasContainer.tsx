
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { WorkingCanvasHeader } from './WorkingCanvasHeader';
import { WorkingCanvasTabBar } from './WorkingCanvasTabBar';
import { WorkingCanvasContent } from './WorkingCanvasContent';
import { LeveragePointSidebar } from '../enhanced/LeveragePointSidebar';

interface ConceptBlock {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  type: string;
}

interface ScenarioForkData {
  id: string;
  name: string;
  active: boolean;
}

interface WorkingCanvasContainerProps {
  selectedItem: ConceptBlock | ScenarioForkData | null;
  onClose: () => void;
}

export const WorkingCanvasContainer: React.FC<WorkingCanvasContainerProps> = ({ 
  selectedItem, 
  onClose 
}) => {
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState('sketch');
  const [leverageSidebarOpen, setLeverageSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cld' | 'sna'>('cld');

  const getItemType = (item: ConceptBlock | ScenarioForkData | null): string => {
    if (!item) return 'Unknown';
    if ('type' in item) return item.type;
    return 'Fork';
  };

  const getItemName = (item: ConceptBlock | ScenarioForkData | null): string => {
    if (!item) return 'System Redesign';
    return item.name;
  };

  return (
    <AnimatePresence>
      {selectedItem && (
        <motion.div
          className="absolute inset-0 w-full h-full z-50"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="w-full h-full glass-panel-cinematic rounded-2xl flex flex-col relative overflow-hidden">
            {/* Enhanced Header */}
            <WorkingCanvasHeader
              itemName={getItemName(selectedItem)}
              itemType={getItemType(selectedItem)}
              activeTab={activeTab}
              onClose={onClose}
            />

            {/* Enhanced Tab Bar */}
            <WorkingCanvasTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Main Content Area - Flex Container */}
            <div className="flex-1 relative overflow-hidden min-h-0">
              <div className="absolute inset-0 flex">
                <div className="working-canvas-content-container">
                  <WorkingCanvasContent
                    activeTab={activeTab}
                    selectedItem={selectedItem}
                    onLeverageSidebarToggle={() => setLeverageSidebarOpen(!leverageSidebarOpen)}
                  />
                </div>

                {/* Enhanced Leverage Point Sidebar */}
                <AnimatePresence>
                  {leverageSidebarOpen && (
                    <>
                      {/* Backdrop overlay */}
                      <motion.div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setLeverageSidebarOpen(false)}
                      />
                      
                      {/* Sidebar */}
                      <motion.div
                        className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-full z-20 w-80`}
                        initial={{ x: isRTL ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: isRTL ? '-100%' : '100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      >
                        <div className="glass-panel-deep h-full rounded-l-xl border-l border-teal-400/30">
                          <LeveragePointSidebar
                            onClose={() => setLeverageSidebarOpen(false)}
                            viewMode={viewMode}
                          />
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
