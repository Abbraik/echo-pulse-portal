

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { usePanelCompact } from '@/hooks/use-panel-compact';
import { usePanelHover } from '@/hooks/use-panel-hover';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import { ApprovalsDecisionsPanel } from '@/components/dashboard/strategic/ApprovalsDecisionsPanel';
import { SystemHealthAlertsPanel } from '@/components/dashboard/strategic/SystemHealthAlertsPanel';
import { CoordinationTriggersPanel } from '@/components/dashboard/strategic/CoordinationTriggersPanel';
import { ZoneSnapshot } from '@/components/dashboard/enhanced/ZoneSnapshot';
import { TodaysSnapshot } from '@/components/dashboard/enhanced/TodaysSnapshot';
import { FullscreenOverlay } from '@/components/ui/fullscreen-overlay';
import { CompactPanelWrapper } from '@/components/dashboard/enhanced/CompactPanelWrapper';
import { HoverablePanelWrapper } from '@/components/dashboard/strategic/HoverablePanelWrapper';
import { getDashboardData } from '@/api/dashboard';
import { Button } from '@/components/ui/button';
import { X, Maximize2 } from 'lucide-react';

type ZoneType = 'THINK' | 'ACT' | 'MONITOR' | 'LEARN' | 'INNOVATE';

interface ContextualSnapshot {
  zone: ZoneType;
  trigger: string;
  panelId: string;
}

const DirectorGeneralDashboard: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const [fullscreenPanel, setFullscreenPanel] = useState<string | null>(null);
  const [contextualSnapshot, setContextualSnapshot] = useState<ContextualSnapshot | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Panel compact state management
  const { containerRef } = usePanelCompact();

  // Add panel hover functionality
  const {
    expandedPanel,
    isAnimating,
    handlePanelHover,
    handlePanelLeave,
    getPanelWidth,
    isPanelCollapsed,
  } = usePanelHover();

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'escape':
          e.preventDefault();
          setFullscreenPanel(null);
          setContextualSnapshot(null);
          handlePanelLeave(); // Reset panel hover state
          break;
        case '1':
          e.preventDefault();
          handlePanelHover('approvals');
          break;
        case '2':
          e.preventDefault();
          handlePanelHover('health');
          break;
        case '3':
          e.preventDefault();
          handlePanelHover('coordination');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePanelHover, handlePanelLeave]);

  const handleFocusMode = (panelId: string) => {
    setHoveredPanel(panelId);
  };

  const handleFullscreen = (panelId: string) => {
    setFullscreenPanel(panelId);
  };

  const handleContextualAction = (zone: ZoneType, trigger: string, panelId: string) => {
    setContextualSnapshot({ zone, trigger, panelId });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div 
          className="relative h-20 w-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-teal-500/30 rounded-full animate-pulse blur-xl"></div>
          <div className="relative z-10 h-full w-full rounded-full border-4 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-teal-400 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentTime = new Date();
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className={`min-h-screen text-foreground relative ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Fullscreen Panel Overlay */}
      <FullscreenOverlay
        isOpen={!!fullscreenPanel}
        onClose={() => setFullscreenPanel(null)}
        title={`${fullscreenPanel} Panel`}
      >
        <div className="p-6">
          {fullscreenPanel === 'approvals' && (
            <ApprovalsDecisionsPanel 
              data={dashboardData?.approvals}
              onFocusMode={(isFocused) => handleFocusMode(isFocused ? 'approvals' : '')}
              onContextualAction={(action, itemTitle) => {
                if (action === 'approve') {
                  handleContextualAction('THINK', `Approved: ${itemTitle}`, 'approvals');
                }
              }}
            />
          )}
          {fullscreenPanel === 'health' && (
            <SystemHealthAlertsPanel 
              data={dashboardData?.systemHealth}
              onAlertClick={(alertType) => {
                handleContextualAction('MONITOR', `Alert: ${alertType}`, 'health');
              }}
            />
          )}
          {fullscreenPanel === 'coordination' && (
            <CoordinationTriggersPanel 
              data={dashboardData?.coordination}
              onRedesignFlag={(flagType) => {
                handleContextualAction('INNOVATE', `Redesign Flag: ${flagType}`, 'coordination');
              }}
              onEscalationAction={(action, zone) => {
                if (action === 'reassign') {
                  handleContextualAction('ACT', `Reassignment in ${zone}`, 'coordination');
                }
              }}
              onZoneLeadClick={(zone) => {
                handleContextualAction('LEARN', `Zone Lead: ${zone}`, 'coordination');
              }}
            />
          )}
        </div>
      </FullscreenOverlay>
      
      <motion.div 
        className="relative z-10 min-h-screen"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Director Header */}
        <div className="flex-shrink-0 z-20">
          <DirectorHeader />
        </div>
        
        {/* Role Banner with enhanced styling */}
        <div className="max-w-[1440px] mx-auto px-6 mb-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl p-6"
            style={{ 
              background: 'rgba(20, 30, 50, 0.6)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
            }}
            whileHover={{ 
              boxShadow: 'inset 0 0 40px rgba(20, 184, 166, 0.2), 0 20px 40px rgba(0, 0, 0, 0.5)',
              transition: { duration: 0.3 }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-2xl"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400"
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {greeting}, Secretary General
                </motion.h1>
                <motion.p 
                  className="text-sm text-gray-300 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Strategic Command Center • {dashboardData?.pending || 12} items require your attention • Live Sync Active
                </motion.p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                <span className="text-xs text-gray-400">Last Update: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Snapshot */}
        <div className="max-w-[1440px] mx-auto px-6 mb-4">
          <TodaysSnapshot data={dashboardData?.todaysSnapshot} />
        </div>

        {/* Main Cockpit Panels - Updated with fullscreen functionality and increased height */}
        <div className="max-w-[1440px] mx-auto px-6 pb-6" ref={containerRef}>
          <div className={`flex gap-4 h-[75vh] min-h-[700px] ${isMobile ? 'flex-col h-auto' : ''}`}>
            {/* Approvals & Decisions Panel */}
            <HoverablePanelWrapper
              panelId="approvals"
              isCollapsed={isPanelCollapsed('approvals')}
              width={getPanelWidth('approvals')}
              onHover={handlePanelHover}
              onLeave={handlePanelLeave}
              onClick={handlePanelHover}
              onFullscreen={() => handleFullscreen('approvals')}
            >
              <ApprovalsDecisionsPanel 
                data={dashboardData?.approvals}
                onFocusMode={(isFocused) => handleFocusMode(isFocused ? 'approvals' : '')}
                onContextualAction={(action, itemTitle) => {
                  if (action === 'approve') {
                    handleContextualAction('THINK', `Approved: ${itemTitle}`, 'approvals');
                  }
                }}
              />
            </HoverablePanelWrapper>

            {/* System Health & Alerts Panel */}
            <HoverablePanelWrapper
              panelId="health"
              isCollapsed={isPanelCollapsed('health')}
              width={getPanelWidth('health')}
              onHover={handlePanelHover}
              onLeave={handlePanelLeave}
              onClick={handlePanelHover}
              onFullscreen={() => handleFullscreen('health')}
            >
              <SystemHealthAlertsPanel 
                data={dashboardData?.systemHealth}
                onAlertClick={(alertType) => {
                  handleContextualAction('MONITOR', `Alert: ${alertType}`, 'health');
                }}
              />
            </HoverablePanelWrapper>

            {/* Coordination & Triggers Panel */}
            <HoverablePanelWrapper
              panelId="coordination"
              isCollapsed={isPanelCollapsed('coordination')}
              width={getPanelWidth('coordination')}
              onHover={handlePanelHover}
              onLeave={handlePanelLeave}
              onClick={handlePanelHover}
              onFullscreen={() => handleFullscreen('coordination')}
            >
              <CoordinationTriggersPanel 
                data={dashboardData?.coordination}
                onRedesignFlag={(flagType) => {
                  handleContextualAction('INNOVATE', `Redesign Flag: ${flagType}`, 'coordination');
                }}
                onEscalationAction={(action, zone) => {
                  if (action === 'reassign') {
                    handleContextualAction('ACT', `Reassignment in ${zone}`, 'coordination');
                  }
                }}
                onZoneLeadClick={(zone) => {
                  handleContextualAction('LEARN', `Zone Lead: ${zone}`, 'coordination');
                }}
              />
            </HoverablePanelWrapper>
          </div>

          {/* Contextual Zone Snapshots */}
          <AnimatePresence>
            {contextualSnapshot && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-8"
              >
                <div 
                  className="relative overflow-hidden rounded-2xl p-8"
                  style={{ 
                    background: 'rgba(20, 30, 50, 0.4)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(20, 184, 166, 0.25)',
                    boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.1), 0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.h3 
                        className="text-xl font-semibold text-teal-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {contextualSnapshot.zone} Zone Snapshot
                      </motion.h3>
                      <motion.span 
                        className="text-sm text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Triggered by: {contextualSnapshot.trigger}
                      </motion.span>
                    </div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setContextualSnapshot(null)}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <X size={16} />
                      </Button>
                    </motion.div>
                  </div>
                  <ZoneSnapshot 
                    zone={contextualSnapshot.zone}
                    data={dashboardData?.zones?.[contextualSnapshot.zone.toLowerCase()]}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DirectorGeneralDashboard;
