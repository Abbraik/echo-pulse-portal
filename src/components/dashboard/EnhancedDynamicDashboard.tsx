
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useModularBundles } from '@/hooks/useModularBundles';
import { useModularHealthMetrics } from '@/hooks/useModularHealthMetrics';
import { useModularCurrentProfile } from '@/hooks/useModularProfiles';
import DynamicPanelContainer from './enhanced/DynamicPanelContainer';
import AlertsAnomalySection from '../monitor/AlertsAnomalySection';

const EnhancedDynamicDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'full' | 'approvals' | 'health'>('full');
  const [fullscreenPanel, setFullscreenPanel] = useState<string | null>(null);
  
  const { data: profile } = useModularCurrentProfile();
  const { data: healthMetrics } = useModularHealthMetrics();
  const { data: bundles } = useModularBundles();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const handleViewModeChange = (mode: 'full' | 'approvals' | 'health') => {
    setViewMode(mode);
  };

  const handleToggleFullscreen = (panel: string) => {
    setFullscreenPanel(fullscreenPanel === panel ? null : panel);
  };

  // Mock dashboard data structure
  const dashboardData = {
    approvals: {
      pending: bundles?.filter(b => !b.isApproved).length || 0,
      recent: bundles?.slice(0, 3) || []
    },
    systemHealth: {
      metrics: healthMetrics || [],
      overall: healthMetrics?.length > 0 ? 85 : 0
    },
    coordination: {
      activeTasks: 12,
      zones: ['THINK', 'ACT', 'LEARN', 'INNOVATE', 'MONITOR']
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
            Director General Dashboard
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Welcome back, {profile?.fullName || 'Director'}. Navigate strategic decisions, monitor system health, 
            and coordinate operations across all zones from your centralized command center.
          </p>
        </motion.div>

        {/* View Mode Controls */}
        <motion.div variants={itemVariants} className="flex justify-center gap-3">
          <Button
            variant={viewMode === 'full' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('full')}
            className="text-sm"
          >
            Full Overview
          </Button>
          <Button
            variant={viewMode === 'approvals' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('approvals')}
            className="text-sm"
          >
            Approvals Focus
          </Button>
          <Button
            variant={viewMode === 'health' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('health')}
            className="text-sm"
          >
            Health Focus
          </Button>
        </motion.div>

        {/* Alerts Section */}
        <motion.div variants={itemVariants}>
          <AlertsAnomalySection />
        </motion.div>

        {/* Dynamic Three Panel Container */}
        <motion.div variants={itemVariants}>
          <DynamicPanelContainer
            dashboardData={dashboardData}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedDynamicDashboard;
