
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
          className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} w-[70vw] h-screen z-50`}
          initial={{ x: isRTL ? '-100%' : '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isRTL ? '-100%' : '100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="w-full h-full glass-panel-deep rounded-l-2xl flex flex-col relative overflow-hidden">
            {/* Header */}
            <WorkingCanvasHeader
              itemName={getItemName(selectedItem)}
              itemType={getItemType(selectedItem)}
              activeTab={activeTab}
              onClose={onClose}
            />

            {/* Tab Bar */}
            <WorkingCanvasTabBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
              <WorkingCanvasContent
                activeTab={activeTab}
                selectedItem={selectedItem}
                onLeverageSidebarToggle={() => setLeverageSidebarOpen(!leverageSidebarOpen)}
              />

              {/* Leverage Point Sidebar */}
              <AnimatePresence>
                {leverageSidebarOpen && (
                  <motion.div
                    className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-full z-10`}
                    initial={{ x: isRTL ? '-100%' : '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: isRTL ? '-100%' : '100%' }}
                    transition={{ duration: 0.3 }}
                  >
                    <LeveragePointSidebar
                      onClose={() => setLeverageSidebarOpen(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
