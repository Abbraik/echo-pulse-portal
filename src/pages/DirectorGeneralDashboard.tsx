import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { useFullscreenDashboard } from '@/hooks/use-fullscreen-dashboard';
import ParticlesBackground from '@/components/ui/particles-background';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import TodaysSnapshot from '@/components/dashboard/enhanced/TodaysSnapshot';
import EnhancedApprovalsPanel from '@/components/dashboard/enhanced/EnhancedApprovalsPanel';
import EnhancedSystemHealthPanel from '@/components/dashboard/enhanced/EnhancedSystemHealthPanel';
import EnhancedCoordinationPanel from '@/components/dashboard/enhanced/EnhancedCoordinationPanel';
import PersonalizationSidebar from '@/components/dashboard/enhanced/PersonalizationSidebar';
import ZoneSnapshotGrid from '@/components/dashboard/enhanced/ZoneSnapshotGrid';
import { FullscreenOverlay } from '@/components/ui/fullscreen-overlay';
import { getDashboardData } from '@/api/dashboard';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import DynamicPanelContainer from '@/components/dashboard/enhanced/DynamicPanelContainer';

const DirectorGeneralDashboard: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { resolvedTheme } = useTheme();
  const { fullscreenPanel, toggleFullscreen, exitFullscreen, isFullscreen } = useFullscreenDashboard();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'full' | 'approvals' | 'health'>('full');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

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
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

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

  const renderFullscreenContent = () => {
    switch (fullscreenPanel) {
      case 'snapshot':
        return (
          <TodaysSnapshot 
            data={dashboardData?.snapshot} 
            lastUpdate={lastUpdate}
            isFullscreen={true}
            onToggleFullscreen={() => toggleFullscreen('snapshot')}
          />
        );
      case 'approvals':
        return (
          <EnhancedApprovalsPanel 
            data={dashboardData?.approvals}
            onViewModeChange={setViewMode}
            currentMode={viewMode}
            isFullscreen={true}
            onToggleFullscreen={() => toggleFullscreen('approvals')}
          />
        );
      case 'health':
        return (
          <EnhancedSystemHealthPanel 
            data={dashboardData?.systemHealth}
            onViewModeChange={setViewMode}
            currentMode={viewMode}
            isFullscreen={true}
            onToggleFullscreen={() => toggleFullscreen('health')}
          />
        );
      case 'coordination':
        return (
          <EnhancedCoordinationPanel 
            data={dashboardData?.coordination}
            isFullscreen={true}
            onToggleFullscreen={() => toggleFullscreen('coordination')}
          />
        );
      case 'zones':
        return (
          <ZoneSnapshotGrid 
            data={dashboardData?.zones}
            isFullscreen={true}
            onToggleFullscreen={() => toggleFullscreen('zones')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground relative ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <ParticlesBackground count={60} colorStart="#14B8A680" colorEnd="#2563EB80" />
      </div>
      
      {/* Fullscreen Panel Overlay */}
      <FullscreenOverlay
        isOpen={!!fullscreenPanel}
        onClose={exitFullscreen}
        title={`${fullscreenPanel} Panel`}
      >
        {renderFullscreenContent()}
      </FullscreenOverlay>
      
      {/* Main Dashboard Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Director Header with Role Banner */}
        <div className="flex-shrink-0 z-20">
          <DirectorHeader />
        </div>
        
        {/* Welcome Message */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-4 mt-4 mb-6"
            >
              <div 
                className="p-4 rounded-2xl relative overflow-hidden"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                      {greeting}, Director General
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                      Welcome to your strategic command center. {dashboardData?.pending || 12} items require your attention.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowWelcome(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="flex-1 flex relative">
          {/* Primary Dashboard Content */}
          <div 
            className={`flex-1 transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'mr-0' : 'mr-80'
            }`}
          >
            <div className="container mx-auto px-4 py-6">
              {/* Today's Snapshot - Fixed height with proper spacing */}
              <motion.section 
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="h-24 relative">
                  <TodaysSnapshot 
                    data={dashboardData?.snapshot} 
                    lastUpdate={lastUpdate}
                    onToggleFullscreen={() => toggleFullscreen('snapshot')}
                  />
                </div>
              </motion.section>
              
              {/* Dynamic Panels Container */}
              <motion.section
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <DynamicPanelContainer
                  dashboardData={dashboardData}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onToggleFullscreen={toggleFullscreen}
                />
              </motion.section>

              {/* Zone Snapshots - Proper spacing from main panels */}
              {viewMode === 'full' && (
                <motion.section
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ZoneSnapshotGrid 
                    data={dashboardData?.zones}
                    onToggleFullscreen={() => toggleFullscreen('zones')}
                  />
                </motion.section>
              )}
            </div>
          </div>

          {/* Personalization Sidebar - Fixed positioning */}
          <div className="fixed top-0 right-0 h-full z-30">
            <PersonalizationSidebar 
              isCollapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              data={dashboardData?.personalization}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorGeneralDashboard;
