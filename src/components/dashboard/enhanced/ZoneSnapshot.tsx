
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Lightbulb, Target, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ZoneSnapshotProps {
  zone: 'THINK' | 'ACT' | 'MONITOR' | 'LEARN' | 'INNOVATE';
  data?: any;
}

export const ZoneSnapshot: React.FC<ZoneSnapshotProps> = ({ zone, data }) => {
  const renderZoneContent = () => {
    switch (zone) {
      case 'THINK':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-teal-400 flex items-center">
                <Lightbulb size={16} className="mr-2" />
                Loop Insights
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Strategy Coherence</span>
                  <Badge className="bg-green-500/20 text-green-400">87%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Scenario Coverage</span>
                  <Badge className="bg-orange-500/20 text-orange-400">72%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Stakeholder Alignment</span>
                  <Badge className="bg-blue-500/20 text-blue-400">94%</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-teal-400">Active Simulations</h4>
              <div className="space-y-2">
                <div className="text-sm text-white">Climate Resilience Model</div>
                <div className="text-sm text-white">Economic Impact Scenario</div>
                <div className="text-sm text-white">Stakeholder Response Analysis</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-teal-400">Recent Outcomes</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <TrendingUp size={12} className="mr-1 text-green-400" />
                  Policy Framework Validated
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <TrendingUp size={12} className="mr-1 text-green-400" />
                  Consensus Reached on Priorities
                </div>
              </div>
            </div>
          </div>
        );

      case 'ACT':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-blue-400 flex items-center">
                <Target size={16} className="mr-2" />
                Bundle KPIs
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Delivery Rate</span>
                  <Badge className="bg-green-500/20 text-green-400">92%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Quality Score</span>
                  <Badge className="bg-blue-500/20 text-blue-400">88%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Resource Efficiency</span>
                  <Badge className="bg-orange-500/20 text-orange-400">76%</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-blue-400">Active Bundles</h4>
              <div className="space-y-2">
                <div className="text-sm text-white">Infrastructure Development</div>
                <div className="text-sm text-white">Education Reform</div>
                <div className="text-sm text-white">Climate Action</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-blue-400">Performance Trends</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <TrendingUp size={12} className="mr-1 text-green-400" />
                  Delivery Acceleration
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <TrendingDown size={12} className="mr-1 text-red-400" />
                  Resource Constraints
                </div>
              </div>
            </div>
          </div>
        );

      case 'MONITOR':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-400 flex items-center">
                <Activity size={16} className="mr-2" />
                KPI Ticker
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">System Health</span>
                  <Badge className="bg-green-500/20 text-green-400">98.2%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Performance Index</span>
                  <Badge className="bg-blue-500/20 text-blue-400">94.7%</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Alert Resolution</span>
                  <Badge className="bg-orange-500/20 text-orange-400">86.3%</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-400">Active Monitoring</h4>
              <div className="space-y-2">
                <div className="text-sm text-white">Real-time System Metrics</div>
                <div className="text-sm text-white">Anomaly Detection</div>
                <div className="text-sm text-white">Performance Thresholds</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-purple-400">Recent Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <AlertTriangle size={12} className="mr-1 text-yellow-400" />
                  Performance Threshold Breach
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Activity size={12} className="mr-1 text-green-400" />
                  System Recovery Completed
                </div>
              </div>
            </div>
          </div>
        );

      case 'LEARN':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-orange-400 flex items-center">
                <Lightbulb size={16} className="mr-2" />
                Top Lessons
              </h4>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded">
                  <div className="text-sm text-white mb-1">Early Stakeholder Engagement</div>
                  <div className="text-xs text-gray-400">Improves outcome success by 40%</div>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <div className="text-sm text-white mb-1">Iterative Implementation</div>
                  <div className="text-xs text-gray-400">Reduces rework cycles by 60%</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-orange-400">Knowledge Patterns</h4>
              <div className="space-y-2">
                <div className="text-sm text-white">Cross-Zone Dependencies</div>
                <div className="text-sm text-white">Resource Optimization</div>
                <div className="text-sm text-white">Stakeholder Dynamics</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-orange-400">Root Cause Analysis</h4>
              <div className="space-y-2">
                <div className="text-sm text-white">Communication Gaps → 32% of delays</div>
                <div className="text-sm text-white">Resource Conflicts → 28% of rework</div>
                <div className="text-sm text-white">Scope Creep → 21% of overruns</div>
              </div>
            </div>
          </div>
        );

      case 'INNOVATE':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-green-400 flex items-center">
                <Lightbulb size={16} className="mr-2" />
                Active Prototypes
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Digital Governance Platform</span>
                  <Badge className="bg-green-500/20 text-green-400">Alpha</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">AI Decision Support</span>
                  <Badge className="bg-blue-500/20 text-blue-400">Beta</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-white">Citizen Engagement Hub</span>
                  <Badge className="bg-orange-500/20 text-orange-400">Concept</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-green-400">Innovation Metrics</h4>
              <div className="space-y-2">
                <div className="text-sm text-white">Experiment Success Rate: 78%</div>
                <div className="text-sm text-white">Time to Market: 12 weeks</div>
                <div className="text-sm text-white">Innovation Index: 94/100</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-green-400">Breakthrough Areas</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-300">
                  <TrendingUp size={12} className="mr-1 text-green-400" />
                  Automated Policy Analysis
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <TrendingUp size={12} className="mr-1 text-green-400" />
                  Predictive Resource Allocation
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-400">Zone snapshot not available</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {renderZoneContent()}
    </motion.div>
  );
};
