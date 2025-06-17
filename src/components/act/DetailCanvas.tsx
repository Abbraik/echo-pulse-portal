import React, { useState } from 'react';
import { Check, Info, ThumbsUp, Maximize2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/use-translation';
import { DetailView } from '@/pages/Act';
import { motion, AnimatePresence } from 'framer-motion';
import BundleView from './BundleView';
import ActWorkingCanvas from './canvas/ActWorkingCanvas';
import { useRealBundle } from './hooks/useRealBundles';

interface DetailCanvasProps {
  view: DetailView;
  selectedBundle: string | null;
}

const DetailCanvas: React.FC<DetailCanvasProps> = ({ view, selectedBundle }) => {
  const { t, isRTL } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showWorkingCanvas, setShowWorkingCanvas] = useState(false);
  
  console.log('DetailCanvas - selectedBundle:', selectedBundle, 'view:', view);
  
  // Fetch bundle data if selectedBundle exists using the real bundle hook
  const { data: bundleData, isLoading: bundleLoading, error: bundleError } = useRealBundle(selectedBundle || '');
  
  console.log('DetailCanvas - bundleData:', bundleData, 'loading:', bundleLoading, 'error:', bundleError);
  
  // Steps for assign leverage flow
  const steps = [
    { id: 'review', title: t('reviewObjectives', { defaultValue: 'Review Objectives' }) },
    { id: 'choose', title: t('chooseLeverage', { defaultValue: 'Choose Leverage' }) },
    { id: 'check', title: t('checkCoherence', { defaultValue: 'Check Coherence' }) },
    { id: 'finalize', title: t('finalize', { defaultValue: 'Finalize' }) },
  ];
  
  // Handle closing the bundle view
  const handleCloseBundleView = () => {
    console.log('Close bundle view called');
    // Note: This would typically clear the selected bundle in the parent component
    // For now, we'll handle it in the view logic below
  };

  // If a bundle is selected and the view is 'default', show the bundle view with working canvas option
  if (selectedBundle && view === 'default') {
    console.log('Rendering bundle view for:', selectedBundle);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-6 h-full relative"
      >
        {bundleLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : bundleData ? (
          <>
            {/* Bundle View with Working Canvas Button */}
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
                    {bundleData.name}
                  </h2>
                  <p className="text-gray-400 mt-1">Bundle Details & Configuration</p>
                </div>
                <Button
                  onClick={() => setShowWorkingCanvas(true)}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 flex items-center gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  Open Working Canvas
                </Button>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <BundleView bundleId={selectedBundle} onClose={handleCloseBundleView} />
              </div>
            </div>

            {/* Working Canvas Overlay */}
            {showWorkingCanvas && (
              <ActWorkingCanvas
                bundleId={selectedBundle}
                onClose={() => setShowWorkingCanvas(false)}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Bundle not found</p>
              {bundleError && (
                <p className="text-xs mt-2 text-red-400">Error: {bundleError.message}</p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  }
  
  // Otherwise, show the appropriate action view based on the selected action
  const getContent = () => {
    switch (view) {
      case 'assign-leverage':
        console.log('Rendering assign-leverage view');
        return (
          <div className="h-full flex flex-col p-6">
            {/* Show bundle context if available */}
            {selectedBundle && bundleData && (
              <div className="mb-6 p-4 rounded-xl backdrop-blur-sm bg-teal-500/10 border border-teal-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-teal-300 mb-2">Working with Bundle:</h3>
                    <p className="text-white font-medium">{bundleData.name}</p>
                    {bundleData.summary && (
                      <p className="text-gray-300 text-sm mt-1">{bundleData.summary}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                      <span>Status: {bundleData.status}</span>
                      {bundleData.coherence > 0 && <span>Coherence: {bundleData.coherence}%</span>}
                      {bundleData.ndiImpact > 0 && <span>NDI Impact: {bundleData.ndiImpact}</span>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWorkingCanvas(true)}
                    className="flex items-center gap-2"
                  >
                    <Maximize2 className="h-3 w-3" />
                    Expand
                  </Button>
                </div>
              </div>
            )}

            {/* Cinematic Stepper header */}
            <div className="flex justify-between mb-8 px-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <motion.div 
                    className={`flex flex-col items-center ${index <= currentStepIndex ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (index <= currentStepIndex) {
                        console.log('Step clicked:', index);
                        setCurrentStepIndex(index);
                      }
                    }}
                    whileHover={index <= currentStepIndex ? { scale: 1.05 } : {}}
                    whileTap={index <= currentStepIndex ? { scale: 0.95 } : {}}
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-300
                        ${index < currentStepIndex ? 'bg-teal-500/80 text-white border-teal-400/50 shadow-lg shadow-teal-500/25' : 
                          index === currentStepIndex ? 'bg-teal-500/80 text-white border-teal-400/50 shadow-lg shadow-teal-500/25' : 
                          'bg-white/10 text-gray-400 border-white/20'}`}
                      animate={index === currentStepIndex ? { 
                        boxShadow: [
                          '0 0 20px rgba(20, 184, 166, 0.3)',
                          '0 0 30px rgba(20, 184, 166, 0.5)',
                          '0 0 20px rgba(20, 184, 166, 0.3)'
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {index < currentStepIndex ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Check className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <span className="font-noto-bold">{index + 1}</span>
                      )}
                    </motion.div>
                    <motion.span 
                      className={`mt-3 text-sm font-noto-medium transition-colors duration-300 ${
                        index === currentStepIndex ? 'text-teal-400' : 'text-gray-400'
                      }`}
                      animate={index === currentStepIndex ? { 
                        textShadow: '0 0 10px rgba(20, 184, 166, 0.5)' 
                      } : {}}
                    >
                      {step.title}
                    </motion.span>
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 flex items-center px-4">
                      <motion.div 
                        className={`h-1 w-full rounded-full transition-all duration-500 ${
                          index < currentStepIndex ? 'bg-gradient-to-r from-teal-500 to-teal-400' : 'bg-white/10'
                        }`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: index < currentStepIndex ? 1 : 0.3 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Step content with glassmorphic container */}
            <div className="flex-1 rounded-xl backdrop-blur-sm border border-white/10 p-6 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 rounded-xl"></div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${currentStepIndex}`}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full relative z-10"
                >
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <h3 className="text-xl font-noto-bold text-teal-300 mb-4">
                      {steps[currentStepIndex].title}
                    </h3>
                    <p className="text-gray-300 font-noto-regular mb-6 max-w-md">
                      {bundleData ? 
                        `Configure ${steps[currentStepIndex].title.toLowerCase()} for "${bundleData.name}"` :
                        t('stepContent', { defaultValue: `Complete the ${steps[currentStepIndex].title.toLowerCase()} phase of your strategy.` })
                      }
                    </p>
                    <div className="w-full max-w-sm bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-2">Progress</div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation buttons with enhanced styling */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 font-noto-medium"
                onClick={() => {
                  console.log('Previous step clicked');
                  setCurrentStepIndex(Math.max(0, currentStepIndex - 1));
                }}
                disabled={currentStepIndex === 0}
              >
                {t('previous')}
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all duration-300 font-noto-medium shadow-lg shadow-teal-500/25"
                  onClick={() => {
                    console.log('Next/Complete step clicked');
                    if (currentStepIndex < steps.length - 1) {
                      setCurrentStepIndex(currentStepIndex + 1);
                    } else {
                      // Handle completion
                      console.log('Flow completed');
                    }
                  }}
                >
                  {currentStepIndex < steps.length - 1 ? 
                    t('next') : 
                    t('complete')
                  }
                </Button>
              </motion.div>
            </div>
          </div>
        );
        
      case 're-optimize':
        console.log('Rendering re-optimize view');
        return (
          <div className="h-full p-6">
            {/* Show bundle context if available */}
            {selectedBundle && bundleData && (
              <div className="mb-6 p-4 rounded-xl backdrop-blur-sm bg-teal-500/10 border border-teal-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-teal-300 mb-2">Optimizing Bundle:</h3>
                    <p className="text-white font-medium">{bundleData.name}</p>
                    {bundleData.coherence > 0 && (
                      <p className="text-gray-300 text-sm mt-1">Current coherence: {bundleData.coherence}%</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWorkingCanvas(true)}
                    className="flex items-center gap-2"
                  >
                    <Maximize2 className="h-3 w-3" />
                    Expand
                  </Button>
                </div>
              </div>
            )}

            <motion.h2 
              className="text-2xl font-noto-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {t('optimizeBands')}
            </motion.h2>
            
            {/* Sliders for optimization parameters with enhanced styling */}
            <div className="space-y-8">
              {['economic', 'social', 'environmental', 'governance'].map((band, index) => (
                <motion.div 
                  key={band} 
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-noto-medium text-gray-200">
                      {t(band as 'economic' | 'social' | 'environmental' | 'governance')}
                    </span>
                    <motion.span 
                      className="text-sm text-teal-400 font-noto-bold"
                      animate={{ textShadow: '0 0 10px rgba(20, 184, 166, 0.5)' }}
                    >
                      65%
                    </motion.span>
                  </div>
                  <div className="slider-teal">
                    <Slider
                      defaultValue={[65]}
                      max={100}
                      step={1}
                      className="transition-all duration-300"
                      onValueChange={(value) => console.log(`${band} slider changed:`, value)}
                    />
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                className="pt-6 border-t border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between mb-3">
                  <span className="font-noto-medium text-gray-200">{t('weightDistribution')}</span>
                  <span className="text-sm text-gray-400 font-noto-regular">{t('balanced')}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-8 rounded-lg overflow-hidden">
                  <motion.div 
                    className="bg-teal-500/80 rounded-l-lg"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  />
                  <motion.div 
                    className="bg-blue-500/80"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  />
                  <motion.div 
                    className="bg-purple-500/80"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  />
                  <motion.div 
                    className="bg-amber-500/80 rounded-r-lg"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                  />
                </div>
              </motion.div>
              
              <div className="flex justify-center pt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="px-12 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 font-noto-bold text-lg shadow-lg shadow-teal-500/25 transition-all duration-300"
                    onClick={() => console.log('Compute optimization clicked')}
                  >
                    {t('compute')}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        );
        
      case 'launch-delivery':
        console.log('Rendering launch-delivery view');
        return (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 p-6">
            {/* Show bundle context if available */}
            {selectedBundle && bundleData && (
              <div className="mb-6 p-4 rounded-xl backdrop-blur-sm bg-teal-500/10 border border-teal-500/20">
                <h3 className="text-lg font-semibold text-teal-300 mb-2">Launching Bundle:</h3>
                <p className="text-white font-medium">{bundleData.name}</p>
              </div>
            )}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/20">
                <motion.h2 
                  className="text-3xl font-noto-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(20, 184, 166, 0.5)',
                      '0 0 30px rgba(20, 184, 166, 0.7)',
                      '0 0 20px rgba(20, 184, 166, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {t('launchingDeliveryPlan')}
                </motion.h2>
                <p className="text-gray-300 mb-8 font-noto-medium">
                  {t('scrollingToDelivery')}
                </p>
                <motion.div 
                  className="text-teal-400 text-6xl font-bold"
                  animate={{ 
                    y: [0, 15, 0],
                    opacity: [1, 0.6, 1],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  ↓
                </motion.div>
              </div>
            </motion.div>
          </div>
        );
        
      default:
        console.log('Rendering default view');
        return (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 p-6">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-white/5 rounded-xl p-8 border border-white/20">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Info className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-xl font-noto-bold mb-4 text-gray-200">
                  {selectedBundle ? 
                    t('selectAction') : 
                    t('selectBundle')
                  }
                </h2>
                <p className="text-gray-400 max-w-md mx-auto font-noto-regular">
                  {selectedBundle ? 
                    'Choose an action from the command bar above to work with the selected bundle.' :
                    t('detailInstructions')
                  }
                </p>
              </div>
            </motion.div>
          </div>
        );
    }
  };
  
  return (
    <div className="h-full relative overflow-hidden">
      {view !== 'default' && (
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-teal-500/10 to-blue-500/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      )}
      {getContent()}
    </div>
  );
};

export default DetailCanvas;
