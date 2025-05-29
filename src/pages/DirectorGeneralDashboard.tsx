
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import ParticlesBackground from '@/components/ui/particles-background';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import { ApprovalsDecisionsPanel } from '@/components/dashboard/strategic/ApprovalsDecisionsPanel';
import { SystemHealthAlertsPanel } from '@/components/dashboard/strategic/SystemHealthAlertsPanel';
import { CoordinationTriggersPanel } from '@/components/dashboard/strategic/CoordinationTriggersPanel';
import { LoopRibbon } from '@/components/dashboard/enhanced/LoopRibbon';
import { ZoneSnapshot } from '@/components/dashboard/enhanced/ZoneSnapshot';
import { FullscreenOverlay } from '@/components/ui/fullscreen-overlay';
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
          break;
        case 'f':
          e.preventDefault();
          // Focus on filter functionality
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
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-pulse blur-xl"></div>
          <div className="relative z-10 h-full w-full rounded-full border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const currentTime = new Date();
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-foreground relative ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <ParticlesBackground count={80} colorStart="#14B8A680" colorEnd="#2563EB80" />
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
      
      <div className="relative z-10 min-h-screen">
        {/* Director Header */}
        <div className="flex-shrink-0 z-20">
          <DirectorHeader />
        </div>
        
        {/* Loop Ribbon */}
        <div className="sticky top-16 z-30 mb-6">
          <LoopRibbon />
        </div>
        
        {/* Role Banner */}
        <div className="max-w-[1440px] mx-auto px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl p-6"
            style={{ 
              background: 'rgba(10, 20, 40, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(20, 184, 166, 0.3)',
              boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.1), 0 0 40px rgba(20, 184, 166, 0.2)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                  {greeting}, Director General
                </h1>
                <p className="text-sm text-gray-300 mt-2">
                  Strategic Command Center • {dashboardData?.pending || 12} items require your attention • Live Sync Active
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Last Update: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Cockpit Panels */}
        <div className="max-w-[1440px] mx-auto px-6">
          <div className={`flex gap-6 h-[45vh] ${isMobile ? 'flex-col h-auto' : ''}`}>
            {/* Approvals & Decisions Panel */}
            <motion.div
              className={`${getPanelWidth('approvals')} transition-all duration-300 ${isMobile ? 'mb-4' : ''}`}
              onMouseEnter={() => !isMobile && setHoveredPanel('approvals')}
              onMouseLeave={() => !isMobile && setHoveredPanel(null)}
              onFocus={() => handleFocusMode('approvals')}
              style={{ 
                background: 'rgba(10, 20, 40, 0.6)',
                backdropFilter: 'blur(20px)',
                border: hoveredPanel === 'approvals' ? '2px solid rgba(20, 184, 166, 0.5)' : '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '2rem',
                boxShadow: hoveredPanel === 'approvals' 
                  ? 'inset 0 0 30px rgba(20, 184, 166, 0.2), 0 0 40px rgba(20, 184, 166, 0.3)'
                  : 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div className="relative h-full">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFullscreen('approvals')}
                    className="text-gray-400 hover:text-teal-400"
                  >
                    <Maximize2 size={16} />
                  </Button>
                </div>
                <ApprovalsDecisionsPanel 
                  data={dashboardData?.approvals}
                  onFocusMode={(isFocused) => handleFocusMode(isFocused ? 'approvals' : '')}
                  onContextualAction={(action, itemTitle) => {
                    if (action === 'approve') {
                      // Inject relevant zone snapshot based on approval type
                      handleContextualAction('THINK', `Approved: ${itemTitle}`, 'approvals');
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* System Health & Alerts Panel */}
            <motion.div
              className={`${getPanelWidth('health')} transition-all duration-300 ${isMobile ? 'mb-4' : ''}`}
              onMouseEnter={() => !isMobile && setHoveredPanel('health')}
              onMouseLeave={() => !isMobile && setHoveredPanel(null)}
              onFocus={() => handleFocusMode('health')}
              style={{ 
                background: 'rgba(10, 20, 40, 0.6)',
                backdropFilter: 'blur(20px)',
                border: hoveredPanel === 'health' ? '2px solid rgba(20, 184, 166, 0.5)' : '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '2rem',
                boxShadow: hoveredPanel === 'health' 
                  ? 'inset 0 0 30px rgba(20, 184, 166, 0.2), 0 0 40px rgba(20, 184, 166, 0.3)'
                  : 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div className="relative h-full">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFullscreen('health')}
                    className="text-gray-400 hover:text-teal-400"
                  >
                    <Maximize2 size={16} />
                  </Button>
                </div>
                <SystemHealthAlertsPanel 
                  data={dashboardData?.systemHealth}
                  onAlertClick={(alertType) => {
                    handleContextualAction('MONITOR', `Alert: ${alertType}`, 'health');
                  }}
                />
              </div>
            </motion.div>

            {/* Coordination & Triggers Panel */}
            <motion.div
              className={`${getPanelWidth('coordination')} transition-all duration-300`}
              onMouseEnter={() => !isMobile && setHoveredPanel('coordination')}
              onMouseLeave={() => !isMobile && setHoveredPanel(null)}
              onFocus={() => handleFocusMode('coordination')}
              style={{ 
                background: 'rgba(10, 20, 40, 0.6)',
                backdropFilter: 'blur(20px)',
                border: hoveredPanel === 'coordination' ? '2px solid rgba(20, 184, 166, 0.5)' : '1px solid rgba(20, 184, 166, 0.3)',
                borderRadius: '2rem',
                boxShadow: hoveredPanel === 'coordination' 
                  ? 'inset 0 0 30px rgba(20, 184, 166, 0.2), 0 0 40px rgba(20, 184, 166, 0.3)'
                  : 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div className="relative h-full">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleFullscreen('coordination')}
                    className="text-gray-400 hover:text-teal-400"
                  >
                    <Maximize2 size={16} />
                  </Button>
                </div>
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
              </div>
            </motion.div>
          </div>

          {/* Contextual Zone Snapshots */}
          <AnimatePresence>
            {contextualSnapshot && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-6"
              >
                <div 
                  className="relative overflow-hidden rounded-2xl p-6"
                  style={{ 
                    background: 'rgba(10, 20, 40, 0.4)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(20, 184, 166, 0.2)',
                    boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.05)'
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-teal-400">
                        {contextualSnapshot.zone} Zone Snapshot
                      </h3>
                      <span className="text-sm text-gray-400">
                        Triggered by: {contextualSnapshot.trigger}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setContextualSnapshot(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={16} />
                    </Button>
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
      </div>
    </div>
  );
};

export default DirectorGeneralDashboard;
