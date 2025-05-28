
import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MonitorSnapshotProps {
  data?: any;
}

const MonitorSnapshot: React.FC<MonitorSnapshotProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();

  const mockData = {
    topAlerts: [
      { type: 'DEI Drift', severity: 'high', description: 'Population volatility increasing' },
      { type: 'Loop Inconsistency', severity: 'medium', description: 'Marriage rate loop underperforming' },
      { type: 'Operational Anomaly', severity: 'low', description: 'Resource extraction spike detected' }
    ],
    liveMetrics: {
      dei: 78.5,
      trust: 82.1,
      migration: '+12.3%'
    },
    recentActivity: [
      'DEI recalculation completed',
      'New scenario analysis started',
      'Alert threshold updated'
    ]
  };

  const displayData = data || mockData;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-orange-400 bg-orange-500/20';
      case 'low': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <GlassCard className="h-full p-6" variant="deep">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
          <Monitor size={20} />
        </div>
        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          MONITOR
        </h2>
      </div>

      <div className="space-y-4">
        {/* Top Alerts */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Top Alerts</h3>
          <div className="space-y-2">
            {displayData.topAlerts.map((alert: any, index: number) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-white/5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={12} className={getSeverityColor(alert.severity).split(' ')[0]} />
                  <div>
                    <p className="text-xs font-medium text-white">{alert.type}</p>
                    <p className="text-xs text-gray-400">{alert.description}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-purple-400 text-xs">
                  Investigate ▶
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Metrics Ticker */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Live Metrics</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">DEI Score</span>
              <span className="text-sm font-medium text-teal-400">{displayData.liveMetrics.dei}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Trust Index</span>
              <span className="text-sm font-medium text-blue-400">{displayData.liveMetrics.trust}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Migration Flow</span>
              <span className="text-sm font-medium text-green-400">{displayData.liveMetrics.migration}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-4 rounded-xl border border-white/20">
          <h3 className="font-medium text-white mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {displayData.recentActivity.map((activity: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Activity size={10} className="text-gray-400" />
                <span className="text-xs text-gray-300">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default MonitorSnapshot;
