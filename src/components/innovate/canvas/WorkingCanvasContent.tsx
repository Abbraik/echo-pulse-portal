
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { SketchTab } from './tabs/SketchTab';
import { SimulateTab } from './tabs/SimulateTab';
import { ResultsTab } from './tabs/ResultsTab';
import { BlueprintTab } from './tabs/BlueprintTab';
import { CompareTab } from './tabs/CompareTab';
import { CoCreateTab } from './tabs/CoCreateTab';
import { EnsembleTab } from './tabs/EnsembleTab';
import { BreakpointsTab } from './tabs/BreakpointsTab';
import { PathwaysTab } from './tabs/PathwaysTab';

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

interface WorkingCanvasContentProps {
  activeTab: string;
  selectedItem: ConceptBlock | ScenarioForkData;
  onLeverageSidebarToggle: () => void;
}

export const WorkingCanvasContent: React.FC<WorkingCanvasContentProps> = ({
  activeTab,
  selectedItem,
  onLeverageSidebarToggle
}) => {
  const { t } = useTranslation();

  const renderTabContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'sketch':
          return <SketchTab onLeverageSidebarToggle={onLeverageSidebarToggle} />;
        case 'simulate':
          return <SimulateTab />;
        case 'results':
          return <ResultsTab />;
        case 'blueprint':
          return <BlueprintTab />;
        case 'compare':
          return <CompareTab />;
        case 'co-create':
          return <CoCreateTab />;
        case 'ensemble':
          return <EnsembleTab />;
        case 'breakpoints':
          return <BreakpointsTab />;
        case 'pathways':
          return <PathwaysTab />;
        default:
          return (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="font-noto-medium text-lg text-teal-300">{t('tabNotImplemented')}</div>
                <div className="font-noto-regular text-sm text-gray-400 mt-2">{activeTab}</div>
              </div>
            </div>
          );
      }
    })();

    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="h-full w-full"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center">
      <div className="working-canvas-content-container w-full h-full max-w-[960px] mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};
