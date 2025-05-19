import React, { useState } from 'react';
import { Check, Info, ThumbsUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/use-translation';
import { DetailView } from '@/pages/Act';
import { motion, AnimatePresence } from 'framer-motion';
import BundleView from './BundleView';

interface DetailCanvasProps {
  view: DetailView;
  selectedBundle: string | null;
}

const DetailCanvas: React.FC<DetailCanvasProps> = ({ view, selectedBundle }) => {
  const { t, isRTL } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Steps for assign leverage flow
  const steps = [
    { id: 'review', title: t('reviewObjectives', { defaultValue: 'Review Objectives' }) },
    { id: 'choose', title: t('chooseLeverage', { defaultValue: 'Choose Leverage' }) },
    { id: 'check', title: t('checkCoherence', { defaultValue: 'Check Coherence' }) },
    { id: 'finalize', title: t('finalize', { defaultValue: 'Finalize' }) },
  ];
  
  // Handle closing the bundle view
  const handleCloseBundleView = () => {
    // Note: This would typically clear the selected bundle in the parent component
    // For now, we'll handle it in the view logic below
  };

  // If a bundle is selected and the view is 'default', show the bundle view
  if (selectedBundle && view === 'default') {
    return <BundleView bundleId={selectedBundle} onClose={handleCloseBundleView} />;
  }
  
  // Otherwise, show the appropriate action view based on the selected action
  const getContent = () => {
    switch (view) {
      case 'assign-leverage':
        return (
          <div className="h-full flex flex-col">
            {/* Stepper header */}
            <div className="flex justify-between mb-8 px-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div 
                    className={`flex flex-col items-center ${index <= currentStepIndex ? 'cursor-pointer' : ''}`}
                    onClick={() => index <= currentStepIndex && setCurrentStepIndex(index)}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${index < currentStepIndex ? 'bg-teal-500 text-white' : 
                          index === currentStepIndex ? 'bg-teal-500 text-white' : 
                          'bg-white/10 text-gray-400'}`}
                    >
                      {index < currentStepIndex ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span 
                      className={`mt-2 text-sm ${index === currentStepIndex ? 'text-teal-400' : 'text-gray-400'}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 flex items-center">
                      <div 
                        className={`h-1 w-full ${
                          index < currentStepIndex ? 'bg-teal-500' : 'bg-white/10'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Step content */}
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${currentStepIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {/* ... keep existing code for the various step views */}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation buttons */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                className="bg-white/5"
                onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                disabled={currentStepIndex === 0}
              >
                {t('previous')}
              </Button>
              <Button
                onClick={() => {
                  if (currentStepIndex < steps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                  } else {
                    // Handle completion
                  }
                }}
              >
                {currentStepIndex < steps.length - 1 ? 
                  t('next') : 
                  t('complete')
                }
              </Button>
            </div>
          </div>
        );
        
      case 're-optimize':
        return (
          <div className="h-full">
            <h2 className="text-xl font-medium mb-6">{t('optimizeBands')}</h2>
            
            {/* Sliders for optimization parameters */}
            <div className="space-y-8">
              {['economic', 'social', 'environmental', 'governance'].map((band) => (
                <div key={band} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize">{t(band as 'economic' | 'social' | 'environmental' | 'governance')}</span>
                    <span className="text-sm text-gray-400">65%</span>
                  </div>
                  <Slider
                    defaultValue={[65]}
                    max={100}
                    step={1}
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between mb-2">
                  <span>{t('weightDistribution')}</span>
                  <span className="text-sm text-gray-400">{t('balanced')}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-6">
                  <div className="bg-teal-500/80 rounded-l-full" />
                  <div className="bg-blue-500/80" />
                  <div className="bg-purple-500/80" />
                  <div className="bg-amber-500/80 rounded-r-full" />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button size="lg" className="px-8">
                  {t('compute')}
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'launch-delivery':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                {t('launchingDeliveryPlan')}
              </h2>
              <p className="text-gray-400 mb-8">
                {t('scrollingToDelivery')}
              </p>
              <motion.div 
                className="text-teal-400 text-6xl"
                animate={{ 
                  y: [0, 10, 0],
                  opacity: [1, 0.6, 1] 
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ↓
              </motion.div>
            </motion.div>
          </div>
        );
        
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Info className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium mb-4">
                {selectedBundle ? 
                  t('selectAction') : 
                  t('selectBundle')
                }
              </h2>
              <p className="text-gray-400 max-w-md mx-auto">
                {t('detailInstructions')}
              </p>
            </motion.div>
          </div>
        );
    }
  };
  
  return (
    <GlassCard className="min-h-[500px] p-6 relative overflow-hidden">
      {view !== 'default' && (
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-teal-500/10 to-blue-500/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
      {getContent()}
    </GlassCard>
  );
};

export default DetailCanvas;
