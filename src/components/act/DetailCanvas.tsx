
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/use-translation';
import { DetailView } from '@/pages/Act';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailCanvasProps {
  view: DetailView;
  selectedBundle: string | null;
}

const DetailCanvas: React.FC<DetailCanvasProps> = ({ view, selectedBundle }) => {
  const { t } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const steps = [
    { id: 'review', title: t('reviewObjectives', { defaultValue: 'Review Objectives' }) },
    { id: 'choose', title: t('chooseLeverage', { defaultValue: 'Choose Leverage' }) },
    { id: 'check', title: t('checkCoherence', { defaultValue: 'Check Coherence' }) },
    { id: 'finalize', title: t('finalize', { defaultValue: 'Finalize' }) },
  ];

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
                  {currentStepIndex === 0 && (
                    <div className="h-full flex flex-col">
                      <h3 className="text-xl font-medium mb-4">{t('reviewObjectivesTitle', { defaultValue: 'Review Bundle Objectives' })}</h3>
                      <div className="flex-1 space-y-4">
                        {/* Placeholder for objectives */}
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                          <h4 className="font-medium">{t('objective1', { defaultValue: 'Improve resource allocation efficiency' })}</h4>
                          <p className="text-sm text-gray-400 mt-1">{t('objective1Desc', { defaultValue: 'Optimize distribution of critical resources across all sectors' })}</p>
                        </div>
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                          <h4 className="font-medium">{t('objective2', { defaultValue: 'Increase sustainability metrics' })}</h4>
                          <p className="text-sm text-gray-400 mt-1">{t('objective2Desc', { defaultValue: 'Ensure long-term viability of resource management practices' })}</p>
                        </div>
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                          <h4 className="font-medium">{t('objective3', { defaultValue: 'Reduce dependency on external sources' })}</h4>
                          <p className="text-sm text-gray-400 mt-1">{t('objective3Desc', { defaultValue: 'Develop internal capacity for resource generation and management' })}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentStepIndex === 1 && (
                    <div className="h-full">
                      <h3 className="text-xl font-medium mb-4">{t('chooseLeverageTitle', { defaultValue: 'Choose Leverage Points' })}</h3>
                      {/* Leverage points selection UI */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                          <div 
                            key={`leverage-${i}`}
                            className="p-4 border border-white/10 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                          >
                            <h4 className="font-medium">{t(`leverage${i}`, { defaultValue: `Leverage Point ${i}` })}</h4>
                            <p className="text-sm text-gray-400 mt-1">{t(`leverage${i}Desc`, { defaultValue: 'Description of this leverage point and its potential impact' })}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentStepIndex === 2 && (
                    <div className="h-full">
                      <h3 className="text-xl font-medium mb-4">{t('checkCoherenceTitle', { defaultValue: 'Check Bundle Coherence' })}</h3>
                      {/* Coherence visualization */}
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                          74%
                        </div>
                        <p className="mt-4 text-center">{t('coherenceImproved', { defaultValue: 'Bundle coherence improved by 16%' })}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentStepIndex === 3 && (
                    <div className="h-full">
                      <h3 className="text-xl font-medium mb-4">{t('finalizeTitle', { defaultValue: 'Finalize Bundle Configuration' })}</h3>
                      {/* Finalization options */}
                      <div className="space-y-4">
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                          <h4 className="font-medium">{t('bundleName', { defaultValue: 'Bundle Name' })}</h4>
                          <input 
                            type="text" 
                            className="w-full mt-2 bg-white/5 border border-white/20 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            defaultValue="Resource Resilience"
                          />
                        </div>
                        
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                          <h4 className="font-medium">{t('bundleDescription', { defaultValue: 'Bundle Description' })}</h4>
                          <textarea 
                            className="w-full mt-2 bg-white/5 border border-white/20 rounded p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            rows={3}
                            defaultValue="A comprehensive approach to improving resource resilience across sectors"
                          />
                        </div>
                        
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5">
                          <h4 className="font-medium">{t('assignApprovers', { defaultValue: 'Assign Approvers' })}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="bg-white/10 px-3 py-1 rounded-full text-sm">Sarah Chen</div>
                            <div className="bg-white/10 px-3 py-1 rounded-full text-sm">Mohammed Al-Farsi</div>
                            <div className="border border-dashed border-white/20 px-3 py-1 rounded-full text-sm text-gray-400">+ Add More</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                {t('previous', { defaultValue: 'Previous' })}
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
                  t('next', { defaultValue: 'Next' }) : 
                  t('complete', { defaultValue: 'Complete' })
                }
              </Button>
            </div>
          </div>
        );
        
      case 're-optimize':
        return (
          <div className="h-full">
            <h2 className="text-xl font-medium mb-6">{t('optimizeBands', { defaultValue: 'Optimize Equilibrium Bands' })}</h2>
            
            {/* Sliders for optimization parameters */}
            <div className="space-y-8">
              {['economic', 'social', 'environmental', 'governance'].map((band) => (
                <div key={band} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="capitalize">{t(band, { defaultValue: band })}</span>
                    <span className="text-sm text-gray-400">65%</span>
                  </div>
                  <Slider
                    defaultValue={[65]}
                    max={100}
                    step={1}
                    className="z-0"
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between mb-2">
                  <span>{t('weightDistribution', { defaultValue: 'Weight Distribution' })}</span>
                  <span className="text-sm text-gray-400">{t('balanced', { defaultValue: 'Balanced' })}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-6">
                  <div className="bg-teal-500/80 rounded-l-full" />
                  <div className="bg-blue-500/80" />
                  <div className="bg-purple-500/80" />
                  <div className="bg-gold-500/80 rounded-r-full" />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button size="lg" className="px-8">
                  {t('compute', { defaultValue: 'Compute' })}
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
              <h2 className="text-2xl font-bold mb-4">
                {t('launchingDeliveryPlan', { defaultValue: 'Launching Delivery Plan' })}
              </h2>
              <p className="text-gray-400 mb-8">
                {t('scrollingToDelivery', { defaultValue: 'Scrolling to Delivery Chains Manager...' })}
              </p>
              <div className="animate-pulse text-teal-400 text-6xl">↓</div>
            </motion.div>
          </div>
        );
        
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <h2 className="text-xl font-medium mb-4">
              {selectedBundle ? 
                t('selectAction', { defaultValue: 'Select an action from the command bar' }) : 
                t('selectBundle', { defaultValue: 'Select a bundle from the sidebar' })
              }
            </h2>
            <p className="text-gray-400">
              {t('detailInstructions', { defaultValue: 'Use the command bar above to assign leverage, optimize bands, or launch a delivery plan' })}
            </p>
          </div>
        );
    }
  };
  
  return (
    <GlassCard className="min-h-[500px] p-6">
      {getContent()}
    </GlassCard>
  );
};

export default DetailCanvas;
