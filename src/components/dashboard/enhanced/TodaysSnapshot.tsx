
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface TodaysSnapshotProps {
  data?: {
    headline: string;
    severity: 'critical' | 'warning' | 'info';
    metric: string;
    change: string;
    hasStrategicAlert: boolean;
  };
  lastUpdate: Date;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const TodaysSnapshot: React.FC<TodaysSnapshotProps> = ({ 
  data, 
  lastUpdate, 
  isFullscreen = false,
  onToggleFullscreen 
}) => {
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
      className={`${isFullscreen ? 'h-full p-8' : 'h-24 p-4'} relative overflow-hidden flex items-center group`}
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
        {onToggleFullscreen && (
          <FullscreenButton
            isFullscreen={isFullscreen}
            onToggle={onToggleFullscreen}
          />
        )}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-400">Live • {lastUpdate.toLocaleTimeString()}</span>
      </div>

      <div className={`flex items-center justify-between w-full ${isFullscreen ? 'flex-col space-y-8' : ''}`}>
        {/* Main Insight */}
        <div className={`flex items-center space-x-4 flex-1 min-w-0 ${isFullscreen ? 'w-full justify-center' : ''}`}>
          <div className={`p-2 rounded-xl ${config.bg} ${config.pulse} flex-shrink-0 ${isFullscreen ? 'p-4' : ''}`}>
            <IconComponent size={isFullscreen ? 32 : 20} className={config.color} />
          </div>
          
          <div className={`space-y-1 flex-1 min-w-0 ${isFullscreen ? 'text-center' : ''}`}>
            <h2 className={`font-semibold text-white ${isFullscreen ? 'text-2xl' : 'text-sm'}`}>
              Today's Critical Insight
            </h2>
            <div className={`flex items-center space-x-2 ${isFullscreen ? 'justify-center flex-wrap text-center' : 'flex-wrap'}`}>
              <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 ${isFullscreen ? 'text-3xl' : 'text-lg'} ${isFullscreen ? '' : 'truncate'}`}>
                {displayData.headline}
              </span>
              <Badge className={`${config.color} ${config.bg} font-bold ${isFullscreen ? 'text-lg px-4 py-2' : 'text-sm px-2 py-1'} flex-shrink-0`}>
                {displayData.metric}
              </Badge>
            </div>
            <p className={`text-gray-400 ${isFullscreen ? 'text-lg' : 'text-xs'}`}>
              {displayData.change}
            </p>
          </div>
        </div>

        {/* Strategic Alert CTA */}
        <div className={`flex items-center space-x-4 flex-shrink-0 ${isFullscreen ? 'w-full justify-center' : 'ml-4'}`}>
          {displayData.hasStrategicAlert && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Button
                size={isFullscreen ? "lg" : "sm"}
                className={`${config.pulse} ${config.color === 'text-red-400' ? 'bg-red-600 hover:bg-red-700' : 'bg-teal-600 hover:bg-teal-700'} text-white font-semibold ${isFullscreen ? 'px-8 py-4 text-lg' : 'px-4 py-2'}`}
              >
                <AlertTriangle size={isFullscreen ? 20 : 16} className="mr-2" />
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
