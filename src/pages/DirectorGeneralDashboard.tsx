import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { useAsymmetricPanels } from '@/hooks/use-asymmetric-panels';
import { useFullscreenPanel } from '@/hooks/use-fullscreen-panel';
import ParticlesBackground from '@/components/ui/particles-background';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import { ApprovalsDecisionsPanel } from '@/components/dashboard/strategic/ApprovalsDecisionsPanel';
import { SystemHealthAlertsPanel } from '@/components/dashboard/strategic/SystemHealthAlertsPanel';
import { CoordinationTriggersPanel } from '@/components/dashboard/strategic/CoordinationTriggersPanel';
import { ZoneSnapshot } from '@/components/dashboard/enhanced/ZoneSnapshot';
import { TodaysSnapshot } from '@/components/dashboard/enhanced/TodaysSnapshot';
import { FullscreenOverlay } from '@/components/ui/fullscreen-overlay';
import { AsymmetricPanelWrapper } from '@/components/dashboard/enhanced/AsymmetricPanelWrapper';
import { getDashboardData } from '@/api/dashboard';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';

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
  const [contextualSnapshot, setContextualSnapshot] = useState<ContextualSnapshot | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Asymmetric panel state management
  const {
    heroPanel,
    hoveredPanel,
    setHoveredPanel,
    getPanelWidth,
    resetLayout,
    isTransitioning
  } = useAsymmetricPanels(dashboardData);

  // Fullscreen panel state management
  const {
    fullscreenPanel,
    toggleFullscreen,
    exitFullscreen
  } = useFullscreenPanel();

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
          exitFullscreen();
          setContextualSnapshot(null);
          break;
        case 'r':
          e.preventDefault();
          resetLayout();
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
  }, [resetLayout, exitFullscreen]);

  // Double click outside handler
  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-panel]')) {
        resetLayout();
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);
    return () => document.removeEventListener('dblclick', handleDoubleClick);
  }, [resetLayout]);

  const handleContextualAction = (zone: ZoneType, trigger: string, panelId: string) => {
    setContextualSnapshot({ zone, trigger, panelId });
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
        onClose={exitFullscreen}
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

        {/* Global Search Bar */}
        <div className="max-w-[1440px] mx-auto px-6 mb-6">
          <motion.div 
            className="relative max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
        </div>

        {/* Today's Snapshot */}
        <div className="max-w-[1440px] mx-auto px-6 mb-6">
          <TodaysSnapshot data={dashboardData?.todaysSnapshot} />
        </div>

        {/* Asymmetric Panels Layout */}
        <div className="max-w-[1440px] mx-auto px-6">
          <div className={`flex gap-4 ${isMobile ? 'flex-col' : ''}`}>
            {/* Approvals & Decisions Panel */}
            <AsymmetricPanelWrapper
              panelId="approvals"
              title="Approvals & Decisions"
              className={`${isMobile ? 'w-full' : getPanelWidth('approvals')} transition-all duration-300 ease-in-out group`}
              isHero={heroPanel === 'approvals' || hoveredPanel === 'approvals'}
              isHovered={hoveredPanel === 'approvals'}
              isTransitioning={isTransitioning}
              onHover={(isHovered) => !isMobile && setHoveredPanel(isHovered ? 'approvals' : null)}
              onDoubleClick={resetLayout}
              compactSummary={{
                title: "Approvals",
                items: [
                  { id: '1', title: 'Infrastructure Development Package', priority: 'high' },
                  { id: '3', title: 'THINK Zone Restructure', priority: 'high' }
                ],
                stats: { pending: dashboardData?.approvals?.pending || 12, overdue: 3 }
              }}
              data-panel="approvals"
            >
              <ApprovalsDecisionsPanel 
                data={dashboardData?.approvals}
                onFocusMode={() => {}}
                onContextualAction={(action, itemTitle) => {
                  if (action === 'approve') {
                    handleContextualAction('THINK', `Approved: ${itemTitle}`, 'approvals');
                  }
                }}
                onFullscreen={() => toggleFullscreen('approvals')}
              />
            </AsymmetricPanelWrapper>

            {/* System Health & Alerts Panel */}
            <AsymmetricPanelWrapper
              panelId="health"
              title="System Health & Alerts"
              className={`${isMobile ? 'w-full' : getPanelWidth('health')} transition-all duration-300 ease-in-out group`}
              isHero={heroPanel === 'health' || hoveredPanel === 'health'}
              isHovered={hoveredPanel === 'health'}
              isTransitioning={isTransitioning}
              onHover={(isHovered) => !isMobile && setHoveredPanel(isHovered ? 'health' : null)}
              onDoubleClick={resetLayout}
              compactSummary={{
                title: "System Health",
                items: [
                  { id: '1', title: 'DEI score trending down', severity: 'medium' },
                  { id: '2', title: 'THINK loop closure delayed', severity: 'high' }
                ],
                stats: { deiScore: 78.5, worstDrift: 'innovator' }
              }}
              data-panel="health"
            >
              <SystemHealthAlertsPanel 
                data={dashboardData?.systemHealth}
                onAlertClick={(alertType) => {
                  handleContextualAction('MONITOR', `Alert: ${alertType}`, 'health');
                }}
                onFullscreen={() => toggleFullscreen('health')}
              />
            </AsymmetricPanelWrapper>

            {/* Coordination & Triggers Panel */}
            <AsymmetricPanelWrapper
              panelId="coordination"
              title="Coordination & Triggers"
              className={`${isMobile ? 'w-full' : getPanelWidth('coordination')} transition-all duration-300 ease-in-out group`}
              isHero={heroPanel === 'coordination' || hoveredPanel === 'coordination'}
              isHovered={hoveredPanel === 'coordination'}
              isTransitioning={isTransitioning}
              onHover={(isHovered) => !isMobile && setHoveredPanel(isHovered ? 'coordination' : null)}
              onDoubleClick={resetLayout}
              compactSummary={{
                title: "Coordination",
                items: [
                  { id: '1', title: 'Role Dropouts', severity: 'high' },
                  { id: '2', title: 'Rework Loops', severity: 'medium' }
                ],
                stats: { flags: 3, escalations: 2 }
              }}
              data-panel="coordination"
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
                onFullscreen={() => toggleFullscreen('coordination')}
              />
            </AsymmetricPanelWrapper>
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
