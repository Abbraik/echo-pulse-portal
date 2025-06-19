
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Monitor, BookOpen, Lightbulb } from 'lucide-react';
import { MonitorClaim, MonitorHealthMetric } from '@/types/monitor';

interface ZoneSnapshotsProps {
  claims?: MonitorClaim[];
  metrics?: MonitorHealthMetric[];
}

const ZoneSnapshots: React.FC<ZoneSnapshotsProps> = ({ claims = [], metrics = [] }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const zones = [
    { 
      name: 'THINK', 
      icon: Brain, 
      color: 'from-purple-500/20 to-indigo-500/20',
      iconColor: 'text-purple-400'
    },
    { 
      name: 'ACT', 
      icon: Zap, 
      color: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400'
    },
    { 
      name: 'MONITOR', 
      icon: Monitor, 
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400'
    },
    { 
      name: 'LEARN', 
      icon: BookOpen, 
      color: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400'
    },
    { 
      name: 'INNOVATE', 
      icon: Lightbulb, 
      color: 'from-pink-500/20 to-red-500/20',
      iconColor: 'text-pink-400'
    }
  ];

  const getZoneStats = (zoneName: string) => {
    const zoneClaims = claims.filter(c => c.zone === zoneName);
    const zoneMetrics = metrics.filter(m => m.zone === zoneName);
    
    return {
      openClaims: zoneClaims.filter(c => c.status === 'open').length,
      assignedClaims: zoneClaims.filter(c => c.status === 'assigned').length,
      avgMetricValue: zoneMetrics.length > 0 
        ? Math.round(zoneMetrics.reduce((sum, m) => sum + m.value, 0) / zoneMetrics.length)
        : 0,
      metricsCount: zoneMetrics.length
    };
  };

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Zone Snapshots
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {zones.map((zone, index) => {
          const stats = getZoneStats(zone.name);
          
          return (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${zone.color} border border-white/10 shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                <div className={`p-2 rounded-lg bg-white/10 ${zone.iconColor}`}>
                  <zone.icon size={20} />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Open Claims</span>
                  <span className={`text-lg font-bold ${zone.iconColor}`}>
                    {stats.openClaims}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Assigned</span>
                  <span className="text-lg font-bold text-white">
                    {stats.assignedClaims}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Avg Score</span>
                  <span className="text-lg font-bold text-white">
                    {stats.avgMetricValue}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-white/10">
                  <span className="text-xs text-slate-400">
                    {stats.metricsCount} metrics tracked
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ZoneSnapshots;
