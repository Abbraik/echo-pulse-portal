
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { MonitorHealthMetric } from '@/types/monitor';

interface SystemHealthProps {
  metrics?: MonitorHealthMetric[];
}

const SystemHealth: React.FC<SystemHealthProps> = ({ metrics = [] }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const getHealthStatus = (value: number, target?: number) => {
    if (!target) return 'unknown';
    const percentage = (value / target) * 100;
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return CheckCircle;
      case 'warning':
      case 'critical':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          System Health
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, index) => {
          const status = getHealthStatus(metric.value, metric.target);
          const StatusIcon = getStatusIcon(status);
          const percentage = metric.target 
            ? Math.round((metric.value / metric.target) * 100) 
            : 0;

          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-4 rounded-xl backdrop-blur-xl bg-slate-800/40 border border-white/10 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {metric.zone}
                </span>
                <StatusIcon 
                  size={16} 
                  className={getStatusColor(status)}
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white line-clamp-2">
                  {metric.name}
                </h4>
                
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${getStatusColor(status)}`}>
                    {metric.value}{metric.unit && ` ${metric.unit}`}
                  </span>
                  {metric.target && (
                    <span className="text-xs text-slate-400">
                      /{metric.target}
                    </span>
                  )}
                </div>
                
                {metric.target && (
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        status === 'excellent' || status === 'good' 
                          ? 'bg-emerald-400' 
                          : status === 'warning' 
                          ? 'bg-amber-400' 
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SystemHealth;
