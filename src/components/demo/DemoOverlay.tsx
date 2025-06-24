
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, RotateCcw, MapPin, Eye, Target, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDemo } from '@/hooks/use-demo';
import { useNavigate, useLocation } from 'react-router-dom';
import { DemoScenarioSelector } from './DemoScenarioSelector';

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
    toggleDemoMode,
    skipToStep
  } = useDemo();

  const navigate = useNavigate();
  const location = useLocation();
  const [highlightElement, setHighlightElement] = useState<HTMLElement | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const currentStepData = getCurrentStep();
  const currentScenarioData = scenarios.find(s => s.id === currentScenario);

  // Enhanced navigation to correct zone for current step
  useEffect(() => {
    if (isActive && currentStepData && !isNavigating) {
      const targetZone = currentStepData.zone;
      const currentPath = location.pathname;
      
      setIsNavigating(true);
      
      // Navigate to the correct zone if not already there
      if (targetZone === 'think' && !currentPath.includes('/think')) {
        navigate('/think');
      } else if (targetZone === 'act' && !currentPath.includes('/act')) {
        navigate('/act');
      } else if (targetZone === 'monitor' && !currentPath.includes('/monitor')) {
        navigate('/monitor');
      } else if (targetZone === 'learn' && !currentPath.includes('/learn')) {
        navigate('/learn');
      } else if (targetZone === 'innovate' && !currentPath.includes('/innovate')) {
        navigate('/innovate');
      }
      
      // Reset navigation flag after a delay
      setTimeout(() => setIsNavigating(false), 1000);
    }
  }, [isActive, currentStepData, navigate, location.pathname, isNavigating]);

  // Enhanced element highlighting with better selectors
  useEffect(() => {
    if (isActive && currentStepData && !isNavigating) {
      // Wait for navigation to complete
      const timer = setTimeout(() => {
        let element = null;
        const stepId = currentStepData.id;
        
        console.log('Demo: Looking for element for step:', stepId);
        
        // Step-specific selectors that match the actual DOM structure
        const selectorMap: { [key: string]: string[] } = {
          'think-foresight': [
            '[data-demo="foresight-panel"]',
            '.dei-foresight-hub',
            '.glass-card'
          ],
          'loop-sna-analysis': [
            '[data-demo="sna-tab"]',
            'button[data-demo="sna-tab"]',
            '[role="tab"][data-demo="sna-tab"]',
            'button:has(.lucide-network)'
          ],
          'strategy-builder': [
            '[data-demo="strategy-builder"]',
            '[data-demo="foresight-sliders"]',
            'button:has(.lucide-target)',
            '.bg-gradient-to-r.from-teal-600'
          ]
        };
        
        // Get selectors for current step
        const selectors = selectorMap[stepId] || [];
        
        // Try each selector until we find an element
        for (const selector of selectors) {
          try {
            element = document.querySelector(selector);
            if (element) {
              console.log('Demo: Found element with selector:', selector);
              break;
            }
          } catch (e) {
            console.warn('Demo: Invalid selector:', selector, e);
          }
        }
        
        // Fallback selectors if specific ones don't work
        if (!element) {
          const fallbackSelectors = [
            '.glass-card',
            '[role="tablist"]',
            'main section:first-child',
            '.main-content',
            'main'
          ];
          
          for (const selector of fallbackSelectors) {
            element = document.querySelector(selector);
            if (element) {
              console.log('Demo: Using fallback selector:', selector);
              break;
            }
          }
        }
        
        if (element) {
          setHighlightElement(element as HTMLElement);
          // Scroll element into view smoothly
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center' 
          });
        } else {
          console.warn(`Demo: No target element found for step: ${stepId}`);
          setHighlightElement(null);
        }
      }, 1200); // Increased delay to ensure DOM is ready

      return () => clearTimeout(timer);
    } else {
      setHighlightElement(null);
    }
  }, [isActive, currentStepData, isNavigating, location.pathname]);

  // Enhanced highlight styles with stronger visual emphasis
  useEffect(() => {
    if (highlightElement) {
      const originalStyles = {
        position: highlightElement.style.position,
        zIndex: highlightElement.style.zIndex,
        boxShadow: highlightElement.style.boxShadow,
        borderRadius: highlightElement.style.borderRadius,
        animation: highlightElement.style.animation,
        transform: highlightElement.style.transform,
        outline: highlightElement.style.outline,
        transition: highlightElement.style.transition
      };

      // Apply stronger highlighting with proper CSS class
      highlightElement.style.position = 'relative';
      highlightElement.style.zIndex = '1001';
      highlightElement.style.transition = 'all 0.3s ease-in-out';
      highlightElement.classList.add('demo-highlight-active');

      return () => {
        // Restore original styles
        Object.entries(originalStyles).forEach(([property, value]) => {
          (highlightElement.style as any)[property] = value;
        });
        highlightElement.classList.remove('demo-highlight-active');
      };
    }
  }, [highlightElement]);

  const handleStepNavigation = (direction: 'next' | 'previous') => {
    setHighlightElement(null);
    if (direction === 'next') {
      nextStep();
    } else {
      previousStep();
    }
  };

  const handleExitDemo = () => {
    exitDemo();
    if (isDemoMode) {
      toggleDemoMode();
    }
  };

  // Parse step description into structured sections
  const parseStepDescription = (description: string) => {
    const sections = description.split('**').filter(Boolean);
    const parsedSections: { [key: string]: string } = {};
    
    for (let i = 0; i < sections.length; i += 2) {
      const key = sections[i]?.replace(':', '').trim();
      const content = sections[i + 1]?.trim();
      if (key && content) {
        parsedSections[key] = content;
      }
    }
    
    return parsedSections;
  };

  const renderCompactDescription = (description: string) => {
    const sections = parseStepDescription(description);
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Context Section */}
        {sections.Context && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-400" />
              <h4 className="font-semibold text-blue-400 text-sm">Context</h4>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{sections.Context}</p>
          </div>
        )}

        {/* What You'll Do Section */}
        {sections["What You'll Do"] && (
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-teal-400" />
              <h4 className="font-semibold text-teal-400 text-sm">What You'll Do</h4>
            </div>
            <div className="text-gray-300 text-xs leading-relaxed">
              {sections["What You'll Do"].split('•').filter(Boolean).slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-start gap-2 mb-1">
                  <ArrowRight className="h-3 w-3 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span>{item.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Actions Section */}
        {sections["Key Actions"] && (
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-purple-400" />
              <h4 className="font-semibold text-purple-400 text-sm">Key Actions</h4>
            </div>
            <div className="text-gray-300 text-xs leading-relaxed space-y-1">
              {sections["Key Actions"].split(/\d+\./).filter(Boolean).slice(0, 2).map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-xs">{action.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expected Outcomes Section */}
        {sections["Expected Outcomes"] && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <h4 className="font-semibold text-green-400 text-sm">Expected Outcomes</h4>
            </div>
            <div className="text-gray-300 text-xs leading-relaxed">
              {sections["Expected Outcomes"].split('•').filter(Boolean).slice(0, 2).map((outcome, index) => (
                <div key={index} className="flex items-start gap-2 mb-1">
                  <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{outcome.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!isDemoMode) return null;

  const progress = currentScenarioData 
    ? ((currentStep + 1) / currentScenarioData.steps.length) * 100 
    : 0;

  return (
    <>
      {/* Enhanced CSS Animation */}
      <style>{`
        .demo-highlight-active {
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.8), 
                      0 0 0 6px rgba(20, 184, 166, 0.4), 
                      0 0 30px rgba(20, 184, 166, 0.6) !important;
          border-radius: 12px !important;
          outline: 2px solid rgba(20, 184, 166, 0.9) !important;
          animation: demo-pulse 2s infinite !important;
          transform: scale(1.02) !important;
        }
        
        @keyframes demo-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.8), 
                        0 0 0 6px rgba(20, 184, 166, 0.4), 
                        0 0 30px rgba(20, 184, 166, 0.6);
            transform: scale(1.02);
          }
          50% { 
            box-shadow: 0 0 0 6px rgba(20, 184, 166, 1), 
                        0 0 0 12px rgba(20, 184, 166, 0.6), 
                        0 0 40px rgba(20, 184, 166, 0.8);
            transform: scale(1.03);
          }
        }
        
        @keyframes demo-fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .demo-highlight-enter {
          animation: demo-fade-in 0.5s ease-out;
        }
      `}</style>

      <AnimatePresence>
        {/* Enhanced Scenario Selection Modal */}
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
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Choose Your Demo Journey</h2>
                  <p className="text-gray-400">Experience guided walkthroughs of key system dynamics</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExitDemo}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <DemoScenarioSelector />
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Active Demo Overlay - Better positioning */}
        {isActive && currentStepData && (
          <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[1000] pointer-events-none" />
            
            {/* Step Instructions Panel - Improved positioning */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-[50%] z-[1002] max-w-5xl w-full mx-4"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-[70vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border-b border-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-teal-400" />
                      <Badge variant="outline" className="text-teal-400 border-teal-400/50 font-medium px-3 py-1">
                        {currentStepData.zone.toUpperCase()}
                      </Badge>
                      {highlightElement && (
                        <Badge variant="outline" className="text-green-400 border-green-400/50">
                          <Eye className="h-3 w-3 mr-1" />
                          Highlighted
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <span className="font-medium">{currentScenarioData?.name}</span>
                      <span>•</span>
                      <span>Step {currentStep + 1} of {currentScenarioData?.steps.length}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <Progress value={progress} className="h-2 bg-white/10" />
                    {/* Step indicators */}
                    <div className="flex justify-between mt-2">
                      {currentScenarioData?.steps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => skipToStep(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentStep 
                              ? 'bg-teal-400 scale-125 shadow-lg shadow-teal-400/50' 
                              : index < currentStep 
                                ? 'bg-teal-600/80' 
                                : 'bg-white/20 hover:bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {currentStepData.title}
                  </h3>
                </div>

                {/* Content - Compact layout */}
                <div className="p-4 max-h-[300px] overflow-y-auto">
                  {renderCompactDescription(currentStepData.description)}
                </div>

                {/* Footer */}
                <div className="bg-white/5 border-t border-white/10 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStepNavigation('previous')}
                      disabled={currentStep === 0}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExitDemo}
                      className="bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-400/50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Exit Demo
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleStepNavigation('next')}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-medium px-6"
                  >
                    {currentStep === (currentScenarioData?.steps.length || 1) - 1 ? 'Complete Demo' : 'Next Step'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
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
