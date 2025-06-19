
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useModularBundles } from '@/hooks/useModularBundles';
import { useModularHealthMetrics } from '@/hooks/useModularHealthMetrics';
import { useModularCurrentProfile } from '@/hooks/useModularProfiles';
import StrategicOverview from './StrategicOverview';
import SystemHealth from './SystemHealth';
import ZoneSnapshots from './ZoneSnapshots';

const EnhancedDynamicDashboard: React.FC = () => {
  const [layout, setLayout] = useState<'balanced' | 'left-focus' | 'right-focus'>('balanced');
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  
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

  const getLayoutStyles = () => {
    if (expandedPanel) {
      return 'grid-cols-1';
    }
    
    switch (layout) {
      case 'left-focus':
        return 'grid-cols-12 gap-6';
      case 'right-focus':
        return 'grid-cols-12 gap-6';
      default:
        return 'grid-cols-1 lg:grid-cols-3 gap-6';
    }
  };

  const getPanelStyles = (panelId: string) => {
    if (expandedPanel === panelId) {
      return 'col-span-12';
    }
    
    if (expandedPanel && expandedPanel !== panelId) {
      return 'hidden';
    }
    
    switch (layout) {
      case 'left-focus':
        if (panelId === 'strategic') return 'col-span-8';
        return 'col-span-2';
      case 'right-focus':
        if (panelId === 'zones') return 'col-span-8';
        return 'col-span-2';
      default:
        return 'col-span-1';
    }
  };

  const toggleExpanded = (panelId: string) => {
    setExpandedPanel(expandedPanel === panelId ? null : panelId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header with Layout Controls */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Director General Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Welcome back, {profile?.fullName || 'Director'}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={layout === 'balanced' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('balanced')}
              className="text-xs"
            >
              Balanced
            </Button>
            <Button
              variant={layout === 'left-focus' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('left-focus')}
              className="text-xs"
            >
              Strategy Focus
            </Button>
            <Button
              variant={layout === 'right-focus' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('right-focus')}
              className="text-xs"
            >
              Operations Focus
            </Button>
          </div>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className={`grid ${getLayoutStyles()}`}>
          {/* Strategic Overview Panel */}
          <motion.div 
            variants={itemVariants}
            className={`${getPanelStyles('strategic')} transition-all duration-300`}
          >
            <Card className="h-full backdrop-blur-xl bg-slate-800/40 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-white">
                  Strategic Overview
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded('strategic')}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  {expandedPanel === 'strategic' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <StrategicOverview bundles={bundles} />
              </CardContent>
            </Card>
          </motion.div>

          {/* System Health Panel */}
          <motion.div 
            variants={itemVariants}
            className={`${getPanelStyles('health')} transition-all duration-300`}
          >
            <Card className="h-full backdrop-blur-xl bg-slate-800/40 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-white">
                  System Health
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded('health')}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  {expandedPanel === 'health' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <SystemHealth metrics={healthMetrics} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Zone Operations Panel */}
          <motion.div 
            variants={itemVariants}
            className={`${getPanelStyles('zones')} transition-all duration-300`}
          >
            <Card className="h-full backdrop-blur-xl bg-slate-800/40 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-white">
                  Zone Operations
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded('zones')}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  {expandedPanel === 'zones' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <ZoneSnapshots claims={[]} metrics={healthMetrics} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedDynamicDashboard;
