
import React from 'react';
import { useDemo } from '@/hooks/use-demo';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Package, Users, Clock, CheckCircle } from 'lucide-react';

export const DemoActContextPanel: React.FC = () => {
  const { isActive, getCurrentStep } = useDemo();
  
  if (!isActive) return null;
  
  const currentStep = getCurrentStep();
  
  if (!currentStep || currentStep.zone !== 'act') return null;

  const getDemoContent = () => {
    switch (currentStep.id) {
      case 'act-bundle-builder':
        return {
          title: 'Resource Management Bundle',
          bundles: [
            {
              name: 'Energy Efficiency Initiative',
              progress: 65,
              tasks: 12,
              priority: 'High',
              deadline: '2024-Q2'
            },
            {
              name: 'Renewable Resource Transition',
              progress: 30,
              tasks: 8,
              priority: 'Medium',
              deadline: '2024-Q3'
            }
          ],
          tasks: [
            { name: 'Stakeholder Analysis', status: 'completed', assignee: 'Policy Team' },
            { name: 'Resource Assessment', status: 'in-progress', assignee: 'Technical Team' },
            { name: 'Implementation Plan', status: 'pending', assignee: 'Operations Team' }
          ]
        };
      case 'population-bundle':
        return {
          title: 'Population Policy Bundle',
          bundles: [
            {
              name: 'Marriage Support Program',
              progress: 45,
              tasks: 15,
              priority: 'High',
              deadline: '2024-Q4'
            },
            {
              name: 'Family Planning Services',
              progress: 70,
              tasks: 10,
              priority: 'Medium',
              deadline: '2024-Q3'
            }
          ],
          tasks: [
            { name: 'Digital Platform Development', status: 'in-progress', assignee: 'Tech Team' },
            { name: 'Community Outreach Plan', status: 'completed', assignee: 'Social Team' },
            { name: 'Service Integration', status: 'pending', assignee: 'Operations Team' }
          ]
        };
      default:
        return null;
    }
  };

  const content = getDemoContent();
  if (!content) return null;

  return (
    <div className="space-y-4" data-demo="bundle-wizard">
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-teal-400 border-teal-400/50">
            Demo Bundle
          </Badge>
          <Package className="h-4 w-4 text-teal-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-4">{content.title}</h3>
        
        <div className="space-y-3 mb-4">
          {content.bundles.map((bundle, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{bundle.name}</span>
                <Badge variant={bundle.priority === 'High' ? 'destructive' : 'secondary'}>
                  {bundle.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{bundle.deadline}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{bundle.tasks} tasks</span>
                </div>
                <div className="ml-auto">
                  <span>{bundle.progress}% complete</span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div 
                  className="bg-teal-400 h-2 rounded-full transition-all"
                  style={{ width: `${bundle.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Recent Tasks
          </h4>
          {content.tasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{task.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{task.assignee}</span>
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'completed' ? 'bg-green-400' :
                  task.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
