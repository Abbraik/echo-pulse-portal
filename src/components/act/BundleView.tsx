
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft, Pencil, CheckCircle, Info, ChevronRight, ArrowRight, Check, Sparkles } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface BundleViewProps {
  bundleId: string;
  onClose: () => void;
}

const BundleView: React.FC<BundleViewProps> = ({ bundleId, onClose }) => {
  const { t, isRTL } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [proMode, setProMode] = useState(false);
  const [activeTab, setActiveTab] = useState('objectives');

  // Mock bundle data for the UI
  const bundle = {
    id: bundleId,
    name: 'Water Efficiency Boost',
    coherence: 58,
    lastUpdated: '2h ago',
    narrative: 'Boosts resource efficiency by optimizing water tariffs and incentives—model predicts +3.2 NDI points over 12 months.',
    ndiImpact: 3.2,
    cost: 500,
    primaryPillar: 'Resource Efficiency',
    owner: 'Water Management Team',
    status: 'draft',
    tags: ['Water', 'Incentive', 'Short-Term']
  };

  // Simulated objectives for this bundle
  const objectives = [
    { id: 'o1', text: 'Increase Water Tariff by 5%' },
    { id: 'o2', text: 'Create Incentive Program for Conservation' },
    { id: 'o3', text: 'Upgrade Infrastructure to Reduce Leakage' },
  ];

  // Wizard steps
  const steps = [
    { id: 'objectives', label: t('objectives') },
    { id: 'leverage', label: t('leveragePoints') },
    { id: 'coherence', label: t('coherenceCheck') },
    { id: 'finalize', label: t('finalizeExport') }
  ];

  // Mock data for the coherence heatmap
  const pillars = ['economic', 'social', 'environmental', 'governance'];
  
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

  return (
    <motion.div 
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      layoutId={`bundle-detail-${bundleId}`}
    >
      {/* Header with title and controls */}
      <div className="flex justify-between items-center mb-4">
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
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Narrative */}
          <div className="md:w-3/5">
            <div className="text-sm text-gray-400 mb-1">
              {t('updatedAgo')}: {bundle.lastUpdated}
            </div>
            <p className="text-lg mb-4">{bundle.narrative}</p>
            
            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-3 rounded-lg">
                <div className="text-xs text-gray-400">{t('projectedNdi')}</div>
                <div className="text-xl font-bold text-teal-400">+{bundle.ndiImpact} <span className="text-sm font-normal">{t('ndiPoints')}</span></div>
              </div>
              
              <div className="glass-panel p-3 rounded-lg">
                <div className="text-xs text-gray-400">{t('estimatedCost')}</div>
                <div className="text-xl font-bold">{bundle.cost} <span className="text-sm font-normal">{t('million')}</span></div>
              </div>
              
              <div className="glass-panel p-3 rounded-lg">
                <div className="text-xs text-gray-400">{t('primaryPillar')}</div>
                <div className="text-md font-medium">{bundle.primaryPillar}</div>
              </div>
            </div>
          </div>
          
          {/* Right column - Metadata */}
          <div className="md:w-2/5">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-400">{t('owner')}</div>
                  <div className="text-sm">{bundle.owner}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400">{t('status')}</div>
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs 
                    ${bundle.status === 'draft' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                      bundle.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                      'bg-green-500/20 text-green-500 border border-green-500/30'}`}
                  >
                    {bundle.status === 'draft' ? t('draft') : 
                      bundle.status === 'pending' ? t('pendingApproval') : 
                      t('active')}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">{t('tags')}</div>
                <div className="flex flex-wrap gap-2">
                  {bundle.tags.map((tag, idx) => (
                    <span 
                      key={`tag-${idx}`}
                      className="px-2 py-0.5 rounded-full text-xs bg-white/5 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm" className="bg-white/5">
                  <Pencil className="h-4 w-4 mr-1" />
                  {t('editBundle', { defaultValue: 'Edit Bundle' })}
                </Button>
                
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {t('approve', { defaultValue: 'Approve' })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stepper wizard */}
      <div className="flex-1 flex flex-col">
        {/* Step indicator */}
        <div className="text-sm text-gray-400 mb-2">
          {t('stepOf', { defaultValue: 'Step' })} {currentStep + 1} {t('of', { defaultValue: 'of' })} {steps.length}
        </div>
        
        {/* Tabs navigator */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4">
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
          <div className="flex-1 mt-4">
            <TabsContent value="objectives" className="h-full">
              <GlassCard className="h-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{t('objectives', { defaultValue: 'Objectives' })}</h3>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    {t('helpButton', { defaultValue: 'Help' })}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {objectives.map((objective, index) => (
                    <motion.div 
                      key={objective.id}
                      className="p-4 border border-white/10 rounded-lg bg-white/5 flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={0.1}
                    >
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Input 
                          value={t(objective.id === 'o1' ? 'increaseWaterTariff' : 
                                    objective.id === 'o2' ? 'createIncentiveProgram' : 
                                    'upgradeInfrastructure')} 
                          className="border-none bg-transparent focus-visible:ring-0 px-0 text-base"
                        />
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 border-dashed border-white/20 bg-white/5"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('addObjective', { defaultValue: 'Add Objective' })}
                  </Button>
                </div>
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="leverage" className="h-full">
              <GlassCard className="h-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{t('leveragePoints', { defaultValue: 'Leverage Points' })}</h3>
                  <Button variant="outline" size="sm" className="bg-white/5">
                    <Sparkles className="h-4 w-4 mr-1" />
                    {t('suggestPoints', { defaultValue: 'Suggest Points' })}
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {objectives.map((objective, index) => (
                    <motion.div 
                      key={`leverage-${objective.id}`}
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="p-3 border border-white/10 rounded-lg bg-white/5">
                        <div className="flex items-center mb-3">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm">
                            {index + 1}
                          </div>
                          <div className="font-medium">
                            {t(objective.id === 'o1' ? 'increaseWaterTariff' : 
                               objective.id === 'o2' ? 'createIncentiveProgram' : 
                               'upgradeInfrastructure')}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">{t('selectLeveragePoint', { defaultValue: 'Select Leverage Point' })}</label>
                            <select className="w-full bg-white/5 border border-white/20 rounded-md p-2">
                              <option value="">{t('leveragePointPlaceholder', { defaultValue: 'Select a leverage point...' })}</option>
                              <option value="1">1 - Parameters</option>
                              <option value="2">2 - Buffers</option>
                              <option value="3">3 - Stock and Flow Structures</option>
                              <option value="4">4 - Delays</option>
                              <option value="5">5 - Balancing Feedback Loops</option>
                              <option value="6">6 - Reinforcing Feedback Loops</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">{t('rationale', { defaultValue: 'Rationale' })}</label>
                            <Textarea 
                              placeholder={t('explainWhy', { defaultValue: 'Explain why this leverage point...' }) as string} 
                              className="bg-white/5 border-white/20"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
                
                <div className="mb-6">
                  <h4 className="font-medium mb-2">{t('heatmapMatrix', { defaultValue: 'Heatmap Matrix' })}</h4>
                  
                  {/* Heatmap grid */}
                  <div className="relative overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium">{t('pillar', { defaultValue: 'Pillar' })}</th>
                          {objectives.map((obj, i) => (
                            <th key={`header-${obj.id}`} className="px-4 py-2 text-center text-sm font-medium">
                              {t('objective', { defaultValue: 'Obj.' })} {i + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pillars.map((pillar, p) => (
                          <tr key={`row-${pillar}`} className={p % 2 === 0 ? 'bg-white/5' : ''}>
                            <td className="px-4 py-3 text-sm capitalize">{t(pillar as 'economic' | 'social' | 'environmental' | 'governance')}</td>
                            {objectives.map((obj, o) => {
                              // Generate mock coherence scores - different for each cell
                              let coherence: number;
                              if (pillar === 'environmental' && obj.id === 'o1') {
                                coherence = 30; // Conflict example
                              } else if (pillar === 'economic' && obj.id === 'o2') {
                                coherence = 90; // Synergy example
                              } else {
                                coherence = 50 + (p * 10) + (o * 5); // Random variation
                              }
                              
                              return (
                                <td key={`cell-${pillar}-${obj.id}`} className="px-4 py-3">
                                  <div className="flex justify-center">
                                    <motion.div 
                                      className={`w-8 h-8 rounded-md ${getCoherenceColor(coherence)} cursor-pointer`}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                      animate={coherence < 40 ? {
                                        scale: [1, 1.05, 1],
                                        transition: { repeat: Infinity, duration: 2 }
                                      } : {}}
                                    />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Conflict detection panel */}
                <div className="p-4 border border-rose-500/30 bg-rose-500/10 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-rose-400">{t('conflicts', { defaultValue: 'Conflicts' })}</h4>
                      <p className="text-sm mt-1">
                        {t('conflictsDetected', { defaultValue: 'Conflicts detected between Economic and Environmental pillars' })}
                      </p>
                    </div>
                    <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                      {t('autoBalance', { defaultValue: 'Auto-Balance Conflicts' })}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="finalize" className="h-full">
              <GlassCard className="h-full p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{t('finalizeExport', { defaultValue: 'Finalize & Export' })}</h3>
                  <p className="text-gray-400">
                    {isRTL ? 
                      "مراجعة ملخص الحزمة قبل التصدير إلى مدير سلسلة التسليم." : 
                      "Review bundle summary before exporting to the Delivery Chain Manager."}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                    <h4 className="font-medium mb-3">{t('exportSummary', { defaultValue: 'Export Summary' })}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{t('bundleName', { defaultValue: 'Bundle Name' })}</div>
                        <div className="font-medium">{bundle.name}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{t('coherenceScore', { defaultValue: 'Coherence Score' })}</div>
                        <div className="font-medium">{bundle.coherence}%</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{t('projectedNdi', { defaultValue: 'Projected NDI Impact' })}</div>
                        <div className="font-medium text-teal-400">+{bundle.ndiImpact} {t('ndiPoints')}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">{t('estimatedCost', { defaultValue: 'Estimated Cost' })}</div>
                        <div className="font-medium">{bundle.cost} {t('million')} {t('aed')}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">
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
      
      {/* Footer navigation */}
      <div className="mt-6 flex justify-between">
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
    </motion.div>
  );
};

export default BundleView;

// Missing or undefined icon components
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
