
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, CheckCircle, Clock } from 'lucide-react';
import { ActBundle } from '@/types/act';

interface StrategicOverviewProps {
  bundles?: ActBundle[];
}

const StrategicOverview: React.FC<StrategicOverviewProps> = ({ bundles = [] }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const activeBundles = bundles.filter(b => b.status === 'active').length;
  const completedBundles = bundles.filter(b => b.status === 'completed').length;
  const draftBundles = bundles.filter(b => b.status === 'draft').length;
  const avgCoherence = bundles.length > 0 
    ? Math.round(bundles.reduce((sum, b) => sum + b.coherence, 0) / bundles.length)
    : 0;

  const stats = [
    {
      title: 'Active Bundles',
      value: activeBundles,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      title: 'Completed',
      value: completedBundles,
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      title: 'Draft Bundles',
      value: draftBundles,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'from-amber-500/20 to-orange-500/20'
    },
    {
      title: 'Avg Coherence',
      value: `${avgCoherence}%`,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-pink-500/20'
    }
  ];

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Strategic Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br ${stat.bgColor} border border-white/10 shadow-2xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 mb-1">{stat.title}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-white/10 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StrategicOverview;
