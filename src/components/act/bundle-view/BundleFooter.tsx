import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
interface BundleFooterProps {
  currentStep: number;
  totalSteps: number;
  proMode: boolean;
  onProModeChange: (checked: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
}
const BundleFooter: React.FC<BundleFooterProps> = ({
  currentStep,
  totalSteps,
  proMode,
  onProModeChange,
  onPrevious,
  onNext
}) => {
  const {
    t,
    isRTL
  } = useTranslation();
  return <div className="p-6 border-t border-white/10 flex justify-between bg-black/20">
      <Button variant="outline" className="bg-white/5" onClick={onPrevious} disabled={currentStep === 0}>
        {isRTL ? <ChevronRight className="mr-1 h-4 w-4" /> : null}
        {t('previous', {
        defaultValue: 'Previous'
      })}
        {!isRTL ? <ChevronRight className="ml-1 h-4 w-4 rotate-180" /> : null}
      </Button>
      
      
      
      <Button onClick={onNext} disabled={currentStep === totalSteps - 1}>
        {!isRTL ? <ChevronRight className="ml-1 h-4 w-4" /> : null}
        {currentStep < totalSteps - 1 ? t('next', {
        defaultValue: 'Next'
      }) : t('complete', {
        defaultValue: 'Complete'
      })}
        {isRTL ? <ChevronRight className="mr-1 h-4 w-4 rotate-180" /> : null}
      </Button>
    </div>;
};
export default BundleFooter;