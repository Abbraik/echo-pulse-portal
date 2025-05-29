
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { usePanelCompact } from '@/hooks/use-panel-compact';
import ParticlesBackground from '@/components/ui/particles-background';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import { ApprovalsDecisionsPanel } from '@/components/dashboard/strategic/ApprovalsDecisionsPanel';
import { SystemHealthAlertsPanel } from '@/components/dashboard/strategic/SystemHealthAlertsPanel';
import { CoordinationTriggersPanel } from '@/components/dashboard/strategic/CoordinationTriggersPanel';
import { ZoneSnapshot } from '@/components/dashboard/enhanced/ZoneSnapshot';
import { TodaysSnapshot } from '@/components/dashboard/enhanced/TodaysSnapshot';
import { FullscreenOverlay } from '@/components/ui/fullscreen-overlay';
import { CompactPanelWrapper } from '@/components/dashboard/enhanced/CompactPanelWrapper';
import { getDashboardData } from '@/api/dashboard';
import { Button } from '@/components/ui/button';
import { X, Maximize2, Search, Bell, Plus } from 'lucide-react';

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
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Panel compact state management
  const { containerRef } = usePanelCompact();

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
      // Simulate new notifications
      if (Math.random() > 0.7) {
        setHasNewNotifications(true);
        setNotificationCount(prev => prev + 1);
      }
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
          break;
        case 'f':
          e.preventDefault();
          // Focus on global search
          document.getElementById('global-search')?.focus();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFocusMode = (panelId: string) => {
    setHoveredPanel(panelId);
  };

  const handleFullscreen = (panelId: string) => {
    setFullscreenPanel(panelId);
  };

  const handleContextualAction = (zone: ZoneType, trigger: string, panelId: string) => {
    setContextualSnapshot({ zone, trigger, panelId });
  };

  const getPanelWidth = (panelId: string) => {
    if (isMobile) return 'w-full';
    if (hoveredPanel === panelId) return 'w-[60%]';
    if (hoveredPanel && hoveredPanel !== panelId) return 'w-[20%]';
    return 'w-[33.333%]';
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-foreground relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Enhanced animated background */}
      <div className="fixed inset-0 z-0">
        <ParticlesBackground count={120} colorStart="#14B8A680" colorEnd="#2563EB60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
      </div>
      
      {/* Fullscreen Panel Overlay */}
      <FullscreenOverlay
        isOpen={!!fullscreenPanel}
        onClose={() => setFullscreenPanel(null)}
        title={`${fullscreenPanel} Panel`}
      >
        {fullscreenPanel === 'approvals' && (
          <ApprovalsDecisionsPanel 
            data={dashboardData?.approvals}
            onFocusMode={() => {}}
          />
        )}
        {fullscreenPanel === 'health' && (
          <SystemHealthAlertsPanel data={dashboardData?.systemHealth} />
        )}
        {fullscreenPanel === 'coordination' && (
          <CoordinationTriggersPanel data={dashboardData?.coordination} />
        )}
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
        <div className="max-w-[1440px] mx-auto px-6 mb-8 mt-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl p-8"
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
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400"
                  style={{ letterSpacing: '0.05em' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {greeting}, Director General
                </motion.h1>
                <motion.p 
                  className="text-base text-gray-300 mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Strategic Command Center • {dashboardData?.pending || 12} items require your attention • Live Sync Active
                </motion.p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-4 h-4 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
                <span className="text-sm text-gray-400">Last Update: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Today's Snapshot */}
        <div className="max-w-[1440px] mx-auto px-6 mb-6">
          <TodaysSnapshot data={dashboardData?.todaysSnapshot} />
        </div>

        {/* Main Cockpit Panels */}
        <div className="max-w-[1440px] mx-auto px-6" ref={containerRef}>
          <div className={`flex gap-8 h-[50vh] ${isMobile ? 'flex-col h-auto' : ''}`}>
            {/* Approvals & Decisions Panel */}
            <CompactPanelWrapper
              panelId="approvals"
              className={`${getPanelWidth('approvals')} transition-all duration-300 ${isMobile ? 'mb-6' : ''}`}
              onHover={(isHovered) => !isMobile && setHoveredPanel(isHovered ? 'approvals' : null)}
              onFullscreen={() => handleFullscreen('approvals')}
              compactSummary={{
                title: "Approvals",
                items: [
                  { id: '1', title: 'Infrastructure Development Package', priority: 'high' },
                  { id: '3', title: 'THINK Zone Restructure', priority: 'high' }
                ],
                stats: { pending: dashboardData?.approvals?.pending || 12, overdue: 3 }
              }}
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
            </CompactPanelWrapper>

            {/* System Health & Alerts Panel */}
            <CompactPanelWrapper
              panelId="health"
              className={`${getPanelWidth('health')} transition-all duration-300 ${isMobile ? 'mb-6' : ''}`}
              onHover={(isHovered) => !isMobile && setHoveredPanel(isHovered ? 'health' : null)}
              onFullscreen={() => handleFullscreen('health')}
              compactSummary={{
                title: "System Health",
                items: [
                  { id: '1', title: 'DEI score trending down', severity: 'medium' },
                  { id: '2', title: 'THINK loop closure delayed', severity: 'high' }
                ],
                stats: { deiScore: 78.5, worstDrift: 'innovator' }
              }}
            >
              <SystemHealthAlertsPanel 
                data={dashboardData?.systemHealth}
                onAlertClick={(alertType) => {
                  handleContextualAction('MONITOR', `Alert: ${alertType}`, 'health');
                }}
              />
            </CompactPanelWrapper>

            {/* Coordination & Triggers Panel */}
            <CompactPanelWrapper
              panelId="coordination"
              className={`${getPanelWidth('coordination')} transition-all duration-300`}
              onHover={(isHovered) => !isMobile && setHoveredPanel(isHovered ? 'coordination' : null)}
              onFullscreen={() => handleFullscreen('coordination')}
              compactSummary={{
                title: "Coordination",
                items: [
                  { id: '1', title: 'Role Dropouts', severity: 'high' },
                  { id: '2', title: 'Rework Loops', severity: 'medium' }
                ],
                stats: { flags: 3, escalations: 2 }
              }}
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
            </CompactPanelWrapper>
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

          {/* Footer & Utilities */}
          <motion.div 
            className="mt-12 mb-8 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Global Search */}
            <div className="flex items-center space-x-4">
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="global-search"
                  type="text"
                  placeholder="Global search..."
                  className="pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent backdrop-blur-md w-80"
                />
              </motion.div>
              
              {/* Notifications Center */}
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    setHasNewNotifications(false);
                    setNotificationCount(0);
                  }}
                >
                  <Bell size={20} />
                  <AnimatePresence>
                    {notificationCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {notificationCount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>

            {/* Quick-Launch Floating Actions */}
            <div className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
                >
                  <Plus size={16} className="mr-2" />
                  Quick Action
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DirectorGeneralDashboard;
