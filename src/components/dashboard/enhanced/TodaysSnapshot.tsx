
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TodaysSnapshotProps {
  data?: {
    headline: string;
    severity: 'critical' | 'warning' | 'info';
    metric: string;
    change: string;
    hasStrategicAlert: boolean;
  };
  lastUpdate: Date;
}

const TodaysSnapshot: React.FC<TodaysSnapshotProps> = ({ data, lastUpdate }) => {
  // Mock data if not provided
  const mockData = {
    headline: "DEI out-of-band: Population Volatility",
    severity: 'critical' as const,
    metric: "↑15%",
    change: "+0.25 in 12 cycles",
    hasStrategicAlert: true
  };

  const displayData = data || mockData;

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-red-400',
          bg: 'bg-red-500/20',
          icon: AlertTriangle,
          pulse: 'animate-pulse'
        };
      case 'warning':
        return {
          color: 'text-orange-400',
          bg: 'bg-orange-500/20',
          icon: TrendingUp,
          pulse: ''
        };
      default:
        return {
          color: 'text-teal-400',
          bg: 'bg-teal-500/20',
          icon: Activity,
          pulse: ''
        };
    }
  };

  const config = getSeverityConfig(displayData.severity);
  const IconComponent = config.icon;

  return (
    <GlassCard 
      className="h-full p-4 relative overflow-hidden"
      style={{ 
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        borderRadius: '2rem',
        boxShadow: 'inset 0 1px 0 0 rgba(20, 184, 166, 0.1), 0 0 30px rgba(20, 184, 166, 0.15)'
      }}
    >
      {/* Live Sync Indicator */}
      <div className="absolute top-3 right-4 flex items-center space-x-2 z-10">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-400">Live • {lastUpdate.toLocaleTimeString()}</span>
      </div>

      <div className="flex items-center justify-between h-full">
        {/* Main Insight */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className={`p-2 rounded-xl ${config.bg} ${config.pulse} flex-shrink-0`}>
            <IconComponent size={20} className={config.color} />
          </div>
          
          <div className="space-y-1 flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-white">Today's Critical Insight</h2>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 truncate">
                {displayData.headline}
              </span>
              <Badge className={`${config.color} ${config.bg} font-bold text-sm px-2 py-1 flex-shrink-0`}>
                {displayData.metric}
              </Badge>
            </div>
            <p className="text-xs text-gray-400">{displayData.change}</p>
          </div>
        </div>

        {/* Strategic Alert CTA */}
        <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
          {displayData.hasStrategicAlert && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Button
                size="sm"
                className={`${config.pulse} ${config.color === 'text-red-400' ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'} text-white font-semibold px-4 py-2`}
              >
                <AlertTriangle size={16} className="mr-2" />
                Review Alert ▶
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default TodaysSnapshot;
