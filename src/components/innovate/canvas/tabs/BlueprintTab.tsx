
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Download, Send, Edit, CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

export const BlueprintTab: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [blueprintData, setBlueprintData] = useState({
    selectedInnovations: ['youth-engagement-boost', 'social-trust-protocol'],
    assumptions: ['Youth engagement correlates with social trust', 'Community programs show impact within 6 months'],
    risks: ['Implementation delays', 'Stakeholder resistance'],
    timeline: '12 months'
  });

  const wizardSteps = [
    { id: 1, title: t('selectInnovations'), completed: true },
    { id: 2, title: t('defineAssumptions'), completed: true },
    { id: 3, title: t('assessRisks'), completed: false },
    { id: 4, title: t('finalizeBlueprint'), completed: false }
  ];

  const mockInnovations = [
    { id: 'youth-engagement-boost', name: 'Youth Engagement Amplifier', impact: '+23% social participation', selected: true },
    { id: 'social-trust-protocol', name: 'Social Trust Protocol', impact: '+18% community cohesion', selected: true },
    { id: 'policy-automation', name: 'Policy Automation Hub', impact: '+15% efficiency', selected: false },
    { id: 'resource-optimizer', name: 'Resource Flow Optimizer', impact: '+12% allocation accuracy', selected: false }
  ];

  const mockStocksFlows = [
    { type: 'Stock', name: 'Youth Engagement Level', baseline: 45, target: 68, unit: 'index' },
    { type: 'Stock', name: 'Social Trust Index', baseline: 72, target: 85, unit: 'index' },
    { type: 'Flow', name: 'Trust Building Rate', baseline: 2.3, target: 4.1, unit: 'points/month' },
    { type: 'Flow', name: 'Engagement Growth', baseline: 1.2, target: 2.8, unit: 'points/month' }
  ];

  return (
    <div className="h-full grid grid-cols-[300px_1fr] gap-6 p-6">
      {/* Left Sidebar - Wizard Steps */}
      <motion.div
        className="glass-panel p-6 rounded-xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="font-noto-bold text-lg text-teal-300 mb-6">{t('blueprintGenerator')}</h3>
        
        <div className="space-y-4">
          {wizardSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                currentStep === step.id 
                  ? 'bg-teal-500/20 border border-teal-400/30' 
                  : 'hover:bg-white/5'
              }`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-green-500' : currentStep === step.id ? 'bg-teal-500' : 'bg-gray-600'
              }`}>
                {step.completed ? (
                  <CheckCircle2 size={14} className="text-white" />
                ) : (
                  <span className="text-white text-xs">{step.id}</span>
                )}
              </div>
              <span className={`text-sm ${
                currentStep === step.id ? 'text-teal-300 font-medium' : 'text-gray-300'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-teal-300 border-teal-400/30"
          >
            <Edit size={16} className="mr-2" />
            {t('editParameters')}
          </Button>
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500"
          >
            <Send size={16} className="mr-2" />
            {t('sendToThinkZone')}
          </Button>
        </div>
      </motion.div>

      {/* Right Panel - Live Preview */}
      <motion.div
        className="glass-panel p-6 rounded-xl overflow-y-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-noto-bold text-xl text-teal-300">{t('blueprintPreview')}</h3>
          <Button variant="outline" size="sm" className="text-gray-300 border-gray-500/30">
            <Download size={16} className="mr-2" />
            {t('exportPDF')}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Executive Summary */}
          <div>
            <h4 className="font-noto-medium text-lg text-gray-200 mb-3">{t('executiveSummary')}</h4>
            <div className="glass-panel-deep p-4 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">
                This blueprint outlines a comprehensive system redesign focusing on youth engagement and social trust enhancement. 
                The proposed innovations leverage behavioral insights and community-driven approaches to achieve measurable improvements 
                in social cohesion metrics over a 12-month implementation period.
              </p>
            </div>
          </div>

          {/* Selected Innovations */}
          <div>
            <h4 className="font-noto-medium text-lg text-gray-200 mb-3">{t('selectedInnovations')}</h4>
            <div className="space-y-3">
              {mockInnovations.filter(innovation => innovation.selected).map((innovation) => (
                <div key={innovation.id} className="glass-panel-deep p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-200">{innovation.name}</span>
                    <Badge variant="secondary" className="bg-teal-500/20 text-teal-300">
                      {innovation.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Extracted from Sketch Tab innovations and validated through Simulation Tab modeling.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* System Model Changes */}
          <div>
            <h4 className="font-noto-medium text-lg text-gray-200 mb-3">{t('systemModelChanges')}</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-sm font-medium text-gray-300">{t('element')}</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-300">{t('baseline')}</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-300">{t('target')}</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-300">{t('change')}</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStocksFlows.map((item, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              item.type === 'Stock' 
                                ? 'border-blue-400/30 text-blue-300' 
                                : 'border-green-400/30 text-green-300'
                            }`}
                          >
                            {item.type}
                          </Badge>
                          <span className="text-sm text-gray-200">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm font-mono text-gray-300">{item.baseline}</td>
                      <td className="py-3 text-sm font-mono text-gray-300">{item.target}</td>
                      <td className="py-3">
                        <span className="text-sm font-mono text-green-400">
                          +{((item.target - item.baseline) / item.baseline * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Implementation Timeline */}
          <div>
            <h4 className="font-noto-medium text-lg text-gray-200 mb-3">{t('implementationTimeline')}</h4>
            <div className="glass-panel-deep p-4 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium text-gray-200">Months 1-3: Foundation Setup</span>
                    <p className="text-xs text-gray-400">Infrastructure and stakeholder alignment</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium text-gray-200">Months 4-8: Core Implementation</span>
                    <p className="text-xs text-gray-400">Deploy selected innovations and monitor initial impact</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div>
                    <span className="text-sm font-medium text-gray-200">Months 9-12: Optimization & Scale</span>
                    <p className="text-xs text-gray-400">Refine approaches and prepare for system-wide deployment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <h4 className="font-noto-medium text-lg text-gray-200 mb-3">{t('riskAssessment')}</h4>
            <div className="space-y-3">
              <div className="glass-panel-deep p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-200">Implementation Complexity</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">Medium Risk</Badge>
                </div>
                <p className="text-xs text-gray-400">Multiple stakeholder coordination required; phased approach recommended</p>
              </div>
              <div className="glass-panel-deep p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-200">Resource Availability</span>
                  <Badge className="bg-green-500/20 text-green-300">Low Risk</Badge>
                </div>
                <p className="text-xs text-gray-400">Budget allocated and technical resources confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
