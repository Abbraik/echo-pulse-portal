
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useRealBundle } from './hooks/useRealBundles';
import BundleHeader from './bundle-view/BundleHeader';
import BundleSummaryCard from './bundle-view/BundleSummaryCard';
import BundleStepWizard from './bundle-view/BundleStepWizard';
import BundleFooter from './bundle-view/BundleFooter';

interface BundleViewProps {
  bundleId: string;
  onClose: () => void;
}

const BundleView: React.FC<BundleViewProps> = ({ bundleId, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [proMode, setProMode] = useState(false);
  const [activeTab, setActiveTab] = useState('objectives');

  const { data: bundle, isLoading, error } = useRealBundle(bundleId);

  const steps = [
    { id: 'objectives', label: 'Objectives' },
    { id: 'leverage', label: 'Leverage Points' },
    { id: 'coherence', label: 'Coherence Check' },
    { id: 'finalize', label: 'Finalize & Export' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setActiveTab(steps[currentStep + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setActiveTab(steps[currentStep - 1].id);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newStepIndex = steps.findIndex(step => step.id === value);
    if (newStepIndex !== -1) {
      setCurrentStep(newStepIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="h-full flex items-center justify-center text-center">
        <div>
          <Info className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">Failed to load bundle data</p>
          <Button variant="outline" onClick={onClose} className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-6">
          <BundleHeader bundle={bundle} onClose={onClose} />
          <BundleSummaryCard bundle={bundle} />
          <BundleStepWizard 
            bundle={bundle}
            currentStep={currentStep}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </ScrollArea>
      
      <BundleFooter
        currentStep={currentStep}
        totalSteps={steps.length}
        proMode={proMode}
        onProModeChange={setProMode}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default BundleView;
