
import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  Pencil, 
  Check, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from './types/act-types';

// Mock data for bundle details
const mockBundleDetails = {
  name: "WATER EFFICIENCY BOOST",
  coherence: { value: 74, trend: 'up' as const },
  lastUpdated: "2h ago",
  narrative: "Boosts resource efficiency by optimizing water tariffs and incentives—model predicts +3.2 NDI points over 12 months.",
  ndiImpact: 3.2,
  cost: "AED 500 M",
  pillar: "Resource Efficiency",
  owner: "Sarah Chen",
  status: "Draft",
  tags: ["Water", "Incentive", "Short-Term"],
  objectives: [
    { id: 'obj1', text: "Increase Water Tariff by 5%" },
    { id: 'obj2', text: "Implement Smart Metering in 70% of households" },
    { id: 'obj3', text: "Create Water Conservation Incentive Program" }
  ]
};

interface BundleViewProps {
  bundleId: string;
  onClose: () => void;
}

const BundleView: React.FC<BundleViewProps> = ({ bundleId, onClose }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [proMode, setProMode] = useState(false);
  
  const steps = [
    { id: 'objectives', label: t('objectives', { defaultValue: 'Objectives' }) },
    { id: 'leveragePoints', label: t('leveragePoints', { defaultValue: 'Leverage Points' }) },
    { id: 'coherenceCheck', label: t('coherenceCheck', { defaultValue: 'Coherence Check' }) },
    { id: 'finalize', label: t('finalizeExport', { defaultValue: 'Finalize & Export' }) },
  ];

  const getCoherenceColor = (value: number) => {
    if (value >= 80) return 'bg-green-500 border-green-500';
    if (value >= 60) return 'bg-amber-500 border-amber-500';
    return 'bg-rose-500 border-rose-500';
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 h-[60px]">
        <div className="flex items-center">
          <h2 className="text-lg font-bold uppercase">{mockBundleDetails.name}</h2>
          <div className={`ml-4 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getCoherenceColor(mockBundleDetails.coherence.value)}`}>
            <span className="text-sm font-bold">{mockBundleDetails.coherence.value}</span>
          </div>
          <span className="ml-4 text-xs text-gray-400">{t('updatedAgo', { defaultValue: 'Updated' })} {mockBundleDetails.lastUpdated}</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{t('back', { defaultValue: 'Back' })}</span>
          </Button>
          <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t('close', { defaultValue: 'Close' })}</span>
          </Button>
        </div>
      </div>

      {/* Bundle Summary Panel */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6 border-b border-white/10">
        {/* Left Column (60%) */}
        <div className="md:col-span-3">
          <p className="text-lg mb-4">{mockBundleDetails.narrative}</p>
          
          <div className="flex space-x-4">
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg flex-1 text-center">
              <div className="text-sm text-gray-400">{t('projectedNdi', { defaultValue: 'Projected NDI Impact' })}</div>
              <div className="text-xl font-bold text-teal-400">+{mockBundleDetails.ndiImpact} pts</div>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg flex-1 text-center">
              <div className="text-sm text-gray-400">{t('estimatedCost', { defaultValue: 'Estimated Cost' })}</div>
              <div className="text-xl font-bold">{mockBundleDetails.cost}</div>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg flex-1 text-center">
              <div className="text-sm text-gray-400">{t('primaryPillar', { defaultValue: 'Primary Pillar' })}</div>
              <div className="text-xl font-bold">{mockBundleDetails.pillar}</div>
            </div>
          </div>
        </div>
        
        {/* Right Column (40%) */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-2">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">{t('owner', { defaultValue: 'Owner' })}</div>
              <div className="font-medium">{mockBundleDetails.owner}</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-sm text-gray-400 mb-1">{t('status', { defaultValue: 'Status' })}</div>
            <Badge variant="outline" className="bg-white/10">
              {mockBundleDetails.status}
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-1">{t('tags', { defaultValue: 'Tags' })}</div>
            <div className="flex flex-wrap gap-2">
              {mockBundleDetails.tags.map((tag) => (
                <div key={tag} className="px-3 py-1 bg-white/5 rounded-full text-sm flex items-center">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button className="flex-1">
              <Pencil className="mr-1 h-4 w-4" />
              {t('editBundle', { defaultValue: 'Edit Bundle' })}
            </Button>
            <Button variant="outline" className="flex-1">
              <Check className="mr-1 h-4 w-4" />
              {t('approve', { defaultValue: 'Approve' })}
            </Button>
          </div>
        </div>
      </div>

      {/* Four-Step Wizard */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stepper Navigation */}
        <div className="px-6 pt-4">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`text-center cursor-pointer ${currentStep === index ? 'text-teal-400' : 'text-gray-400'}`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="mb-1">{step.label}</div>
                <div 
                  className={`h-1 transition-all duration-300 ${currentStep === index ? 'bg-teal-400' : 'bg-white/10'}`}
                ></div>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400">
            {t('stepOf', { defaultValue: 'Step' })} {currentStep + 1} {t('of', { defaultValue: 'of' })} {steps.length}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentStep === 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{t('objectives', { defaultValue: 'Objectives' })}</h3>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    {t('help', { defaultValue: 'Help' })}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {mockBundleDetails.objectives.map((objective, index) => (
                    <div 
                      key={objective.id}
                      className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <div>{objective.text}</div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full mt-4">
                    + {t('addObjective', { defaultValue: 'Add Objective' })}
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{t('leveragePoints', { defaultValue: 'Leverage Points' })}</h3>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    {t('suggestPoints', { defaultValue: 'Suggest Points' })}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {mockBundleDetails.objectives.map((objective) => (
                    <div 
                      key={objective.id}
                      className="p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                    >
                      <h4 className="font-medium mb-2">{objective.text}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">
                            {t('selectLeveragePoint', { defaultValue: 'Select Leverage Point' })}
                          </label>
                          <select className="w-full bg-white/5 border border-white/20 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500">
                            <option>Parameters — Fast Feedback</option>
                            <option>Information Flows — Medium Feedback</option>
                            <option>Goals — Slow Feedback</option>
                            <option>Paradigms — Very Slow Feedback</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">
                            {t('rationale', { defaultValue: 'Rationale' })}
                          </label>
                          <textarea 
                            className="w-full bg-white/5 border border-white/20 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            rows={2}
                            placeholder={t('explainWhy', { defaultValue: 'Explain why this leverage point...' }) as string}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{t('coherenceCheck', { defaultValue: 'Coherence Check' })}</h3>
                  <div className="flex items-center bg-white/5 rounded-full px-3 py-1">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getCoherenceColor(mockBundleDetails.coherence.value)}`}></div>
                    <span>{mockBundleDetails.coherence.value}%</span>
                  </div>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">{t('heatmapMatrix', { defaultValue: 'Heatmap Matrix' })}</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="p-2 border-b border-white/10 text-left">{t('pillar', { defaultValue: 'Pillar' })}</th>
                            {mockBundleDetails.objectives.map((obj, i) => (
                              <th key={obj.id} className="p-2 border-b border-white/10 text-center">
                                {t('objective', { defaultValue: 'Obj.' })} {i+1}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {['Economic', 'Social', 'Environmental', 'Governance'].map((pillar) => (
                            <tr key={pillar}>
                              <td className="p-2 border-b border-white/10">{pillar}</td>
                              {mockBundleDetails.objectives.map((obj) => (
                                <td key={`${pillar}-${obj.id}`} className="p-2 border-b border-white/10 text-center">
                                  <div className={`w-6 h-6 mx-auto rounded-sm ${
                                    Math.random() > 0.7 ? 'bg-red-500/40' : 
                                    Math.random() > 0.4 ? 'bg-amber-500/40' : 'bg-green-500/40'
                                  } hover:scale-110 transition-transform cursor-pointer`}></div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full">
                      {t('autoBalance', { defaultValue: 'Auto-Balance Conflicts' })}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">{t('finalizeExport', { defaultValue: 'Finalize & Export' })}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg text-center">
                      <div className="text-sm text-gray-400">{t('coherenceScore', { defaultValue: 'Coherence Score' })}</div>
                      <div className="text-2xl font-bold text-teal-400">{mockBundleDetails.coherence.value}%</div>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg text-center">
                      <div className="text-sm text-gray-400">{t('projectedNdi', { defaultValue: 'Projected NDI Impact' })}</div>
                      <div className="text-2xl font-bold text-blue-400">+{mockBundleDetails.ndiImpact} pts</div>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-sm rounded-lg text-center">
                      <div className="text-sm text-gray-400">{t('estimatedCost', { defaultValue: 'Estimated Cost' })}</div>
                      <div className="text-2xl font-bold">{mockBundleDetails.cost}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-1 block">{t('commentsForApprover', { defaultValue: 'Comments for Approver' })}</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/20 rounded p-3 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows={4}
                      placeholder={t('addComments', { defaultValue: 'Add any additional comments...' }) as string}
                    ></textarea>
                  </div>
                  
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                    <Button className="flex-1 bg-teal-500 hover:bg-teal-600">
                      {t('exportToDelivery', { defaultValue: 'Export to Delivery' })}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      {t('saveDraft', { defaultValue: 'Save Draft' })}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-white/10 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t('back', { defaultValue: 'Back' })}
        </Button>
        
        <div className="flex items-center">
          <span className="text-sm mr-2">{t('proMode', { defaultValue: 'Pro Mode' })}</span>
          <Switch checked={proMode} onCheckedChange={setProMode} />
        </div>
        
        <Button 
          onClick={handleNextStep}
          disabled={currentStep === steps.length - 1}
        >
          {t('next', { defaultValue: 'Next' })}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  );
};

export default BundleView;
