
import React, { useState } from 'react';
import { InnovateToolbox } from './InnovateToolbox';
import { SystemRedesignOverview } from './SystemRedesignOverview';
import { WorkingCanvas } from './WorkingCanvas';
import { GlassCard } from '../ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence } from 'framer-motion';

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

interface InnovateDesignHubProps {
  mode: 'lesson-driven' | 'freeform' | 'moonshot';
}

export const InnovateDesignHub: React.FC<InnovateDesignHubProps> = ({ mode }) => {
  const { t, isRTL } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<ConceptBlock | ScenarioForkData | null>(null);

  const handleItemSelect = (item: ConceptBlock | ScenarioForkData) => {
    setSelectedItem(item);
  };

  const handleCloseCanvas = () => {
    setSelectedItem(null);
  };

  return (
    <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} h-full gap-4`}>
      {/* Left sidebar: Toolbox */}
      <div className="w-[30%] min-h-0">
        <GlassCard className="h-full">
          <ScrollArea className="h-full">
            <InnovateToolbox 
              mode={mode}
              onBlockSelect={handleItemSelect}
              onForkSelect={handleItemSelect}
            />
          </ScrollArea>
        </GlassCard>
      </div>

      {/* Right side: Dynamic workspace */}
      <div className="w-[70%] min-h-0">
        <GlassCard className="h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <WorkingCanvas 
                key="working-canvas"
                selectedItem={selectedItem}
                onClose={handleCloseCanvas}
              />
            ) : (
              <SystemRedesignOverview key="overview" />
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
};
