
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDemo } from '@/hooks/use-demo';
import { useNavigate, useLocation } from 'react-router-dom';

const DemoOverlay: React.FC = () => {
  const {
    isDemoMode,
    isActive,
    currentScenario,
    currentStep,
    scenarios,
    getCurrentStep,
    nextStep,
    previousStep,
    exitDemo,
    startScenario
  } = useDemo();

  const navigate = useNavigate();
  const location = useLocation();
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null);

  const currentStepData = getCurrentStep();
  const currentScenarioData = scenarios.find(s => s.id === currentScenario);

  // Handle navigation to correct zone for current step
  useEffect(() => {
    if (isActive && currentStepData) {
      const targetZone = currentStepData.zone;
      const currentPath = location.pathname;
      
      // Navigate to the correct zone if not already there
      if (targetZone === 'think' && !currentPath.includes('/think')) {
        navigate('/think');
      } else if (targetZone === 'act' && !currentPath.includes('/act')) {
        navigate('/act');
      } else if (targetZone === 'monitor' && !currentPath.includes('/monitor')) {
        navigate('/monitor');
      } else if (targetZone === 'innovate' && !currentPath.includes('/innovate')) {
        navigate('/innovate');
      } else if (targetZone === 'learn' && !currentPath.includes('/learn')) {
        navigate('/learn');
      }
    }
  }, [isActive, currentStepData, navigate, location.pathname]);

  // Handle element highlighting
  useEffect(() => {
    if (isActive && currentStepData?.targetElement) {
      // Wait for navigation to complete
      const timer = setTimeout(() => {
        const element = document.querySelector(currentStepData.targetElement!);
        if (element) {
          setHighlightElement(element as HTMLElement);
          // Scroll element into view
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center' 
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setHighlightElement(null);
    }
  }, [isActive, currentStepData]);

  // Add highlight styles to target element
  useEffect(() => {
    if (highlightElement) {
      highlightElement.style.position = 'relative';
      highlightElement.style.zIndex = '1001';
      highlightElement.style.boxShadow = '0 0 0 4px rgba(20, 184, 166, 0.6), 0 0 20px rgba(20, 184, 166, 0.4)';
      highlightElement.style.borderRadius = '12px';
      highlightElement.style.animation = 'demo-pulse 2s infinite';

      return () => {
        highlightElement.style.position = '';
        highlightElement.style.zIndex = '';
        highlightElement.style.boxShadow = '';
        highlightElement.style.borderRadius = '';
        highlightElement.style.animation = '';
      };
    }
  }, [highlightElement]);

  if (!isDemoMode) return null;

  const progress = currentScenarioData 
    ? ((currentStep + 1) / currentScenarioData.steps.length) * 100 
    : 0;

  return (
    <>
      {/* CSS Animation for pulse effect */}
      <style>
        {`
          @keyframes demo-pulse {
            0%, 100% { 
              box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.6), 0 0 20px rgba(20, 184, 166, 0.4);
            }
            50% { 
              box-shadow: 0 0 0 8px rgba(20, 184, 166, 0.8), 0 0 32px rgba(20, 184, 166, 0.6);
            }
          }
        `}
      </style>

      <AnimatePresence>
        {/* Scenario Selection Modal */}
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Choose Your Demo Journey</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={exitDemo}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all"
                    onClick={() => startScenario(scenario.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {scenario.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                          {scenario.description}
                        </p>
                        <Badge variant="outline" className="text-teal-400 border-teal-400/50">
                          {scenario.steps.length} Steps
                        </Badge>
                      </div>
                      <Play className="h-6 w-6 text-teal-400 ml-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Active Demo Overlay */}
        {isActive && currentStepData && (
          <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-[1000] pointer-events-none" />
            
            {/* Step Instructions Panel */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[1002] max-w-2xl w-full mx-4"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                    <span>{currentScenarioData?.name}</span>
                    <span>Step {currentStep + 1} of {currentScenarioData?.steps.length}</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/10" />
                </div>

                {/* Current Step Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-teal-400" />
                    <Badge variant="outline" className="text-teal-400 border-teal-400/50 text-xs">
                      {currentStepData.zone.toUpperCase()}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-300">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousStep}
                      disabled={currentStep === 0}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exitDemo}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Exit Demo
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={nextStep}
                      className="bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      {currentStep === (currentScenarioData?.steps.length || 1) - 1 ? 'Complete' : 'Next Step'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DemoOverlay;
