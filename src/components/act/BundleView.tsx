import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, Pencil, CheckCircle, Info, ChevronRight, ArrowRight, Check, Sparkles, Plus } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useRealBundle, useRealBundleActions } from './hooks/useRealBundles';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BundleViewProps {
  bundleId: string;
  onClose: () => void;
}

const BundleView: React.FC<BundleViewProps> = ({ bundleId, onClose }) => {
  const { t, isRTL } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [proMode, setProMode] = useState(false);
  const [activeTab, setActiveTab] = useState('objectives');

  // Fetch real bundle data from database
  const { data: bundle, isLoading, error } = useRealBundle(bundleId);
  const { updateBundle, approveBundle } = useRealBundleActions();

  // Wizard steps
  const steps = [
    { id: 'objectives', label: t('objectives') },
    { id: 'leverage', label: t('leveragePoints') },
    { id: 'coherence', label: t('coherenceCheck') },
    { id: 'finalize', label: t('finalizeExport') }
  ];

  // Function to get coherence color based on value (0-100)
  const getCoherenceColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-amber-400';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  // Determine background gradient based on coherence score
  const getBackgroundGradient = (coherence: number) => {
    if (coherence >= 80) return 'from-green-500/20 to-transparent';
    if (coherence >= 60) return 'from-amber-500/20 to-transparent';
    return 'from-rose-500/20 to-transparent';
  };

  // Handler for stepping through the wizard
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

  // Handling tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newStepIndex = steps.findIndex(step => step.id === value);
    if (newStepIndex !== -1) {
      setCurrentStep(newStepIndex);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Error state
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
          {/* Header with title and controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 p-1 h-8 w-8"
                onClick={() => onClose()}
              >
                {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
              </Button>
              <h2 className="text-xl font-bold uppercase tracking-wide bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                {bundle.name}
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Coherence badge */}
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-full ${getCoherenceColor(bundle.coherence)}`}>
                <div className="absolute inset-0.5 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{bundle.coherence}</span>
                </div>
              </div>
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8 hover:bg-white/10"
                onClick={() => onClose()}
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* Bundle summary section */}
          <GlassCard className={`mb-6 p-6 overflow-hidden relative bg-gradient-to-r ${getBackgroundGradient(bundle.coherence)}`}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Narrative */}
              <div className="lg:w-3/5 space-y-4">
                <div className="text-sm text-gray-400 mb-2">
                  {t('updatedAgo')}: {new Date(bundle.updatedAt).toLocaleDateString()}
                </div>
                <p className="text-base leading-relaxed text-gray-300">
                  {bundle.summary || 'No summary available for this bundle.'}
                </p>
                
                {/* Key metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">{t('projectedNdi')}</div>
                    <div className="text-xl font-bold text-teal-400">
                      +{bundle.ndiImpact} <span className="text-sm font-normal">{t('ndiPoints')}</span>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">{t('coherenceScore')}</div>
                    <div className="text-xl font-bold text-white">
                      {bundle.coherence}%
                    </div>
                  </div>
                  
                  <div className="glass-panel p-4 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">{t('status')}</div>
                    <div className="text-md font-medium text-white capitalize">
                      {bundle.status}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right column - Metadata */}
              <div className="lg:w-2/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">{t('createdBy')}</div>
                    <div className="text-sm text-white">{bundle.createdBy || 'Unknown'}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-400 mb-1">{t('status')}</div>
                    <Badge 
                      variant={bundle.status === 'active' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {bundle.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-2">{t('tags')}</div>
                  <div className="flex flex-wrap gap-2">
                    {bundle.tags && bundle.tags.length > 0 ? (
                      bundle.tags.map((tag, idx) => (
                        <Badge 
                          key={`tag-${idx}`}
                          variant="outline"
                          className="text-xs bg-white/5 border-white/20"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No tags assigned</span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/5"
                    onClick={() => {
                      // Handle edit bundle
                      console.log('Edit bundle clicked');
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    {t('editBundle', { defaultValue: 'Edit Bundle' })}
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => {
                      approveBundle.mutate(bundleId);
                    }}
                    disabled={approveBundle.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {bundle.isApproved ? t('approved') : t('approve', { defaultValue: 'Approve' })}
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Stepper wizard */}
          <div className="flex-1 flex flex-col">
            {/* Step indicator */}
            <div className="text-sm text-gray-400 mb-4">
              {t('stepOf', { defaultValue: 'Step' })} {currentStep + 1} {t('of', { defaultValue: 'of' })} {steps.length}
            </div>
            
            {/* Tabs navigator */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
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
              
              {/* Tab content */}
              <div className="flex-1">
                <TabsContent value="objectives" className="h-full">
                  <GlassCard className="h-full p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">{t('objectives', { defaultValue: 'Objectives' })}</h3>
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4 mr-1" />
                        {t('helpButton', { defaultValue: 'Help' })}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {bundle.objectives && bundle.objectives.length > 0 ? (
                        bundle.objectives.map((objective, index) => (
                          <motion.div 
                            key={`obj-${index}`}
                            className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <Input 
                                value={objective} 
                                className="border-none bg-transparent focus-visible:ring-0 px-0 text-base"
                                readOnly
                              />
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <p>No objectives defined for this bundle</p>
                        </div>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 border-dashed border-white/20 bg-white/5"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('addObjective', { defaultValue: 'Add Objective' })}
                      </Button>
                    </div>
                  </GlassCard>
                </TabsContent>
                
                {/* Other tab contents remain similar but connect to real bundle data */}
                <TabsContent value="leverage" className="h-full">
                  <GlassCard className="h-full p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">{t('leveragePoints', { defaultValue: 'Leverage Points' })}</h3>
                      <Button variant="outline" size="sm" className="bg-white/5">
                        <Sparkles className="h-4 w-4 mr-1" />
                        {t('suggestPoints', { defaultValue: 'Suggest Points' })}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {bundle.leveragePoints && bundle.leveragePoints.length > 0 ? (
                        bundle.leveragePoints.map((point, index) => (
                          <div key={`leverage-${index}`} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-gray-300">
                              {typeof point === 'object' ? point.name || `Leverage Point ${index + 1}` : point}
                            </span>
                            {typeof point === 'object' && point.type && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {point.type}
                              </Badge>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <p>No leverage points identified</p>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </TabsContent>
                
                <TabsContent value="coherence" className="h-full">
                  <GlassCard className="h-full p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium">{t('coherenceCheck', { defaultValue: 'Coherence Check' })}</h3>
                      <div className={`relative flex items-center justify-center w-12 h-12 rounded-full ${getCoherenceColor(bundle.coherence)}`}>
                        <div className="absolute inset-1 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{bundle.coherence}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">{t('pillarCoverage', { defaultValue: 'Pillar Coverage' })}</h4>
                        {bundle.pillars && bundle.pillars.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {bundle.pillars.map((pillar, index) => (
                              <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                                <span className="text-sm text-gray-300 capitalize">{pillar}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">No pillars assigned</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-4">{t('geographicCoverage', { defaultValue: 'Geographic Coverage' })}</h4>
                        {bundle.geography && bundle.geography.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {bundle.geography.map((location, index) => (
                              <Badge key={index} variant="outline" className="bg-blue-500/10 border-blue-500/30">
                                {location}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">No geographic areas specified</p>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>
                
                <TabsContent value="finalize" className="h-full">
                  <GlassCard className="h-full p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">{t('finalizeExport', { defaultValue: 'Finalize & Export' })}</h3>
                      <p className="text-gray-400">
                        Review bundle summary before exporting to the Delivery Chain Manager.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                        <h4 className="font-medium mb-4">{t('exportSummary', { defaultValue: 'Export Summary' })}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">{t('bundleName', { defaultValue: 'Bundle Name' })}</div>
                            <div className="font-medium text-white">{bundle.name}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-1">{t('coherenceScore', { defaultValue: 'Coherence Score' })}</div>
                            <div className="font-medium text-white">{bundle.coherence}%</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-1">{t('projectedNdi', { defaultValue: 'Projected NDI Impact' })}</div>
                            <div className="font-medium text-teal-400">+{bundle.ndiImpact} {t('ndiPoints')}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-400 mb-1">{t('status', { defaultValue: 'Status' })}</div>
                            <div className="font-medium text-white capitalize">{bundle.status}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          {t('commentsForApprover', { defaultValue: 'Comments for Approver' })}
                        </label>
                        <Textarea 
                          placeholder={t('addComments', { defaultValue: 'Add any additional comments...' }) as string}
                          className="bg-white/5 border-white/20"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
                        <Button variant="outline" className="md:order-1 bg-white/5">
                          {t('saveDraft', { defaultValue: 'Save Draft' })}
                        </Button>
                        <Button className="md:order-2">
                          {t('exportToDelivery', { defaultValue: 'Export to Delivery' })}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </ScrollArea>
      
      {/* Footer navigation */}
      <div className="p-6 border-t border-white/10 flex justify-between bg-black/20">
        <Button
          variant="outline"
          className="bg-white/5"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          {isRTL ? <ChevronRight className="mr-1 h-4 w-4" /> : null}
          {t('previous', { defaultValue: 'Previous' })}
          {!isRTL ? <ChevronRight className="ml-1 h-4 w-4 rotate-180" /> : null}
        </Button>
        
        <div className="flex items-center">
          <span className="mr-2 text-sm">{t('proMode', { defaultValue: 'Pro Mode' })}</span>
          <Switch checked={proMode} onCheckedChange={setProMode} />
        </div>
        
        <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
          {!isRTL ? <ChevronRight className="ml-1 h-4 w-4" /> : null}
          {currentStep < steps.length - 1 ? 
            t('next', { defaultValue: 'Next' }) : 
            t('complete', { defaultValue: 'Complete' })
          }
          {isRTL ? <ChevronRight className="mr-1 h-4 w-4 rotate-180" /> : null}
        </Button>
      </div>
    </div>
  );
};

export default BundleView;
