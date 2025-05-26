
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Route, Clock, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export const PathwaysTab: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPathway, setSelectedPathway] = useState(0);

  const mockPathways = [
    {
      id: 1,
      name: 'Community-First Pathway',
      description: 'Start with grassroots engagement, build trust through local initiatives',
      steps: [
        { actor: 'Community Leaders', action: 'Host neighborhood forums', duration: '2 weeks' },
        { actor: 'Local NGOs', action: 'Launch peer mentorship programs', duration: '1 month' },
        { actor: 'Municipal Office', action: 'Formalize community feedback loops', duration: '3 weeks' },
        { actor: 'Regional Authority', action: 'Scale successful initiatives', duration: '2 months' }
      ],
      totalTime: '4 months',
      confidence: 87,
      riskLevel: 'Low',
      resources: '$450K'
    },
    {
      id: 2,
      name: 'Policy-Led Pathway',
      description: 'Establish framework first, then deploy resources systematically',
      steps: [
        { actor: 'Regional Authority', action: 'Draft policy framework', duration: '3 weeks' },
        { actor: 'Legislative Body', action: 'Review and approve policies', duration: '6 weeks' },
        { actor: 'Municipal Office', action: 'Implement local regulations', duration: '4 weeks' },
        { actor: 'Community Leaders', action: 'Execute community programs', duration: '8 weeks' }
      ],
      totalTime: '5.5 months',
      confidence: 73,
      riskLevel: 'Medium',
      resources: '$680K'
    },
    {
      id: 3,
      name: 'Hybrid Approach',
      description: 'Parallel community and policy tracks that converge for amplified impact',
      steps: [
        { actor: 'Parallel Teams', action: 'Simultaneous policy & community work', duration: '4 weeks' },
        { actor: 'Coordination Body', action: 'Align and integrate approaches', duration: '2 weeks' },
        { actor: 'Unified Network', action: 'Execute coordinated interventions', duration: '6 weeks' },
        { actor: 'All Stakeholders', action: 'Monitor and optimize outcomes', duration: '4 weeks' }
      ],
      totalTime: '4 months',
      confidence: 91,
      riskLevel: 'Medium',
      resources: '$520K'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'High': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Route size={24} className="text-teal-400" />
        <div>
          <h2 className="text-2xl font-bold">{t('executionPathways')}</h2>
          <p className="text-muted-foreground">{t('snaToPathwayGenerator')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pathway List */}
        <div className="space-y-4">
          {mockPathways.map((pathway, index) => (
            <div 
              key={pathway.id}
              className={`glass-panel p-4 rounded-xl cursor-pointer transition-all ${
                selectedPathway === index ? 'ring-2 ring-teal-500 bg-teal-500/10' : 'hover:bg-white/5'
              }`}
              onClick={() => setSelectedPathway(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{pathway.name}</h3>
                <Button size="sm" variant="outline" className="h-6 px-2">
                  <Eye size={12} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{pathway.description}</p>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{pathway.totalTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{pathway.confidence}% {t('confidence')}</span>
                </div>
                <div className={`px-2 py-1 rounded-full ${getRiskColor(pathway.riskLevel)}`}>
                  {pathway.riskLevel} {t('risk')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pathway Details */}
        <div className="glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {mockPathways[selectedPathway].name}
            </h3>
            <Button className="bg-teal-500 hover:bg-teal-600">
              {t('selectPathway')}
            </Button>
          </div>

          <div className="space-y-4">
            {mockPathways[selectedPathway].steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-teal-500/20 text-teal-300 rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{step.actor}</span>
                    <span className="text-xs text-muted-foreground">{step.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.action}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('totalDuration')}</span>
                <div className="font-semibold">{mockPathways[selectedPathway].totalTime}</div>
              </div>
              <div>
                <span className="text-muted-foreground">{t('estimatedCost')}</span>
                <div className="font-semibold">{mockPathways[selectedPathway].resources}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
