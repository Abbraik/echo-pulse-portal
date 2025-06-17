
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/use-translation';
import ObjectivesTab from './tabs/ObjectivesTab';
import LeverageTab from './tabs/LeverageTab';
import CoherenceTab from './tabs/CoherenceTab';
import FinalizeTab from './tabs/FinalizeTab';
import { Bundle } from '../types/act-types';

interface BundleStepWizardProps {
  bundle: Bundle;
  currentStep: number;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const BundleStepWizard: React.FC<BundleStepWizardProps> = ({ 
  bundle, 
  currentStep, 
  activeTab, 
  onTabChange 
}) => {
  const { t } = useTranslation();

  const steps = [
    { id: 'objectives', label: t('objectives') },
    { id: 'leverage', label: t('leveragePoints') },
    { id: 'coherence', label: t('coherenceCheck') },
    { id: 'finalize', label: t('finalizeExport') }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="text-sm text-gray-400 mb-4">
        {t('stepOf', { defaultValue: 'Step' })} {currentStep + 1} {t('of', { defaultValue: 'of' })} {steps.length}
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mb-6">
          {steps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              disabled={index > currentStep}
              className={index > currentStep ? 'opacity-50' : ''}
            >
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="flex-1">
          <TabsContent value="objectives" className="h-full">
            <ObjectivesTab bundle={bundle} />
          </TabsContent>
          
          <TabsContent value="leverage" className="h-full">
            <LeverageTab bundle={bundle} />
          </TabsContent>
          
          <TabsContent value="coherence" className="h-full">
            <CoherenceTab bundle={bundle} />
          </TabsContent>
          
          <TabsContent value="finalize" className="h-full">
            <FinalizeTab bundle={bundle} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BundleStepWizard;
