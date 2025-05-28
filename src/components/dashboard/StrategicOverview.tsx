import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Gauge from '@/components/ui/custom/Gauge';

interface StrategicOverviewProps {
  data?: {
    deiScore: number;
    deiTarget: number;
    deiTrend: number[];
    populationStability: number;
    resourceEfficiency: number;
    socialCohesion: number;
    hasStrategicAlert: boolean;
  };
}

const StrategicOverview: React.FC<StrategicOverviewProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();

  // Mock data if not provided
  const mockData = {
    deiScore: 78.5,
    deiTarget: 85,
    deiTrend: [72, 74, 76, 78, 78.5],
    populationStability: -2.1,
    resourceEfficiency: 12.3,
    socialCohesion: 82.7,
    hasStrategicAlert: true,
  };

  const displayData = data || mockData;

  const kpiCards = [
    {
      title: 'Population Stability Δ',
      value: displayData.populationStability,
      unit: '%',
      trend: displayData.populationStability >= 0 ? 'up' : 'down',
      color: displayData.populationStability >= 0 ? 'text-teal-400' : 'text-orange-400'
    },
    {
      title: 'Resource Efficiency Δ',
      value: displayData.resourceEfficiency,
      unit: '%',
      trend: 'up',
      color: 'text-teal-400'
    },
    {
      title: 'Social Cohesion Index',
      value: displayData.socialCohesion,
      unit: '',
      trend: 'up',
      color: 'text-teal-400'
    }
  ];

  return (
    <div className="h-full">
      <GlassCard className="h-full p-6" variant="deep">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* DEI System Health Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                DEI SYSTEM HEALTH
              </h3>
              <p className="text-sm text-gray-400">Composite Score</p>
            </div>
            
            <div className="relative mb-4">
              <Gauge
                value={displayData.deiScore}
                max={100}
                size="xl"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {displayData.deiScore}
                  </div>
                  <div className="text-sm text-gray-400">
                    Target: {displayData.deiTarget}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trend Sparkline */}
            <div className="w-full mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">12-Month Trend</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp size={12} className="text-teal-400" />
                  <span className="text-xs text-teal-400">+6.5%</span>
                </div>
              </div>
              <div className="h-8 flex items-end space-x-1">
                {displayData.deiTrend.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-teal-500/50 to-teal-400/30 rounded-sm"
                    style={{ height: `${(value / 100) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* High-Level KPI Cards */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              {kpiCards.map((kpi, index) => (
                <motion.div
                  key={kpi.title}
                  className="glass-panel p-4 rounded-xl border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-300">{kpi.title}</h4>
                    {kpi.trend === 'up' ? (
                      <TrendingUp size={16} className={kpi.color} />
                    ) : (
                      <TrendingDown size={16} className={kpi.color} />
                    )}
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-2xl font-bold ${kpi.color}`}>
                      {kpi.value > 0 && kpi.title.includes('Δ') ? '+' : ''}
                      {kpi.value}
                    </span>
                    <span className="text-sm text-gray-400">{kpi.unit}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${
                          kpi.trend === 'up' ? 'from-teal-500 to-teal-400' : 'from-orange-500 to-orange-400'
                        }`}
                        style={{ width: `${Math.abs(kpi.value)}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Strategic Alert */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            {displayData.hasStrategicAlert && (
              <motion.div
                className="glass-panel p-4 rounded-xl border border-orange-500/50 bg-orange-500/10"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle size={20} className="text-orange-400" />
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                    PSIU Alert
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Population structure imbalance detected. Resource allocation may be affected.
                </p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  <Target size={14} className="mr-2" />
                  Review Strategic Alert
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default StrategicOverview;
