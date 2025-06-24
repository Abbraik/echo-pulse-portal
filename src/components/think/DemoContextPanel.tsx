
import React from 'react';
import { useDemo } from '@/hooks/use-demo';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Target, Activity, TrendingUp } from 'lucide-react';

export const DemoContextPanel: React.FC = () => {
  const { isActive, currentScenario, getCurrentStep } = useDemo();
  
  if (!isActive) return null;
  
  const currentStep = getCurrentStep();
  
  if (!currentStep || currentStep.zone !== 'think') return null;

  const getDemoContent = () => {
    switch (currentStep.id) {
      case 'think-foresight':
        return {
          title: 'Resource Stock Analysis',
          metrics: [
            { label: 'Resource Stability', value: '78%', status: 'warning' },
            { label: 'Stock Volatility', value: '23%', status: 'good' },
            { label: 'Depletion Risk', value: '15%', status: 'good' }
          ],
          insights: [
            'Current resource bounds are within acceptable range',
            'Minor adjustments needed for long-term stability',
            'Foresight models show 3-year sustainability window'
          ]
        };
      case 'loop-sna-analysis':
        return {
          title: 'Ministry of Energy Network',
          metrics: [
            { label: 'Network Density', value: '0.42', status: 'good' },
            { label: 'Centralization', value: '0.68', status: 'warning' },
            { label: 'Avg Path Length', value: '2.8', status: 'good' }
          ],
          insights: [
            'High centralization indicates bottleneck risks',
            'Key actors have excessive information control',
            'Redundant pathways needed for resilience'
          ]
        };
      case 'strategy-builder':
        return {
          title: 'Strategic Objective Framework',
          metrics: [
            { label: 'Objectives Defined', value: '3/5', status: 'warning' },
            { label: 'Leverage Points', value: '2/8', status: 'warning' },
            { label: 'Coherence Score', value: '85%', status: 'good' }
          ],
          insights: [
            'Focus on leverage points #3 and #6 for maximum impact',
            'SMART criteria partially met - needs timeline refinement',
            'Strategic alignment with foresight analysis confirmed'
          ]
        };
      case 'think-birth-foresight':
        return {
          title: 'Birth-Rate Scenario Analysis',
          metrics: [
            { label: 'Growth Balance', value: '1.05', status: 'good' },
            { label: 'Birth Rate Trend', value: '-2.3%', status: 'warning' },
            { label: 'Projection Accuracy', value: '92%', status: 'good' }
          ],
          insights: [
            'Demographic transition in progress',
            'Marriage rates correlate with birth rate decline',
            'Economic factors show strong influence on family planning'
          ]
        };
      case 'loop-analysis-r3-r6':
        return {
          title: 'Reinforcing Loops R3 & R6',
          metrics: [
            { label: 'R3 Loop Strength', value: '0.73', status: 'good' },
            { label: 'R6 Loop Strength', value: '0.58', status: 'warning' },
            { label: 'Loop Interaction', value: 'Positive', status: 'good' }
          ],
          insights: [
            'Social cohesion loop (R3) functioning well',
            'Economic stability loop (R6) needs intervention',
            'Loops reinforce each other positively when both strong'
          ]
        };
      case 'population-strategy':
        return {
          title: 'Population Strategy Development',
          metrics: [
            { label: 'Deviation Target', value: '±2.5%', status: 'good' },
            { label: 'Policy Levers', value: '4/7', status: 'warning' },
            { label: 'Timeline', value: '5 years', status: 'good' }
          ],
          insights: [
            'Multi-generational approach required',
            'Housing and education policies are critical levers',
            'Social support systems need strengthening'
          ]
        };
      default:
        return null;
    }
  };

  const content = getDemoContent();
  if (!content) return null;

  return (
    <div className="space-y-4" data-demo="demo-context-panel">
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-teal-400 border-teal-400/50">
            Demo Context
          </Badge>
          <Activity className="h-4 w-4 text-teal-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-4">{content.title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {content.metrics.map((metric, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{metric.label}</span>
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === 'good' ? 'bg-green-400' :
                  metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
              </div>
              <div className="text-lg font-bold text-white">{metric.value}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">Key Insights</span>
          </div>
          {content.insights.map((insight, index) => (
            <div key={index} className="text-sm text-gray-300 flex items-start gap-2">
              <TrendingUp className="h-3 w-3 mt-0.5 text-teal-400 flex-shrink-0" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
