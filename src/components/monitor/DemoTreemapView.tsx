
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { useDemo } from '@/hooks/use-demo';
import { useDemoIntegration } from '@/hooks/use-demo-integration';

export const DemoTreemapView: React.FC = () => {
  const { isActive, currentScenario } = useDemo();
  const { isInDemoZone } = useDemoIntegration();

  if (!isActive || !isInDemoZone('monitor')) {
    return null;
  }

  return (
    <div className="space-y-4" data-demo="treemap-view">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="text-teal-400 border-teal-400/50">
          Demo Mode Active
        </Badge>
        <span className="text-sm text-gray-400">
          Showing {currentScenario} monitoring data
        </span>
      </div>
      
      <GlassCard className="p-6" data-demo="population-sector">
        <h3 className="text-lg font-semibold text-white mb-4">
          Population Dynamics Monitoring
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-teal-300">2.3%</div>
            <div className="text-sm text-gray-400">Population Deviation</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-300">0.78</div>
            <div className="text-sm text-gray-400">Social Cohesion</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-300">1.0</div>
            <div className="text-sm text-gray-400">Growth Balance</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-300">0.82</div>
            <div className="text-sm text-gray-400">Marriage Rate</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
