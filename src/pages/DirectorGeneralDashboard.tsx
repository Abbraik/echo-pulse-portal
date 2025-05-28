
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import ParticlesBackground from '@/components/ui/particles-background';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import TodaysSnapshot from '@/components/dashboard/enhanced/TodaysSnapshot';
import EnhancedApprovalsPanel from '@/components/dashboard/enhanced/EnhancedApprovalsPanel';
import EnhancedSystemHealthPanel from '@/components/dashboard/enhanced/EnhancedSystemHealthPanel';
import EnhancedCoordinationPanel from '@/components/dashboard/enhanced/EnhancedCoordinationPanel';
import PersonalizationSidebar from '@/components/dashboard/enhanced/PersonalizationSidebar';
import ZoneSnapshotGrid from '@/components/dashboard/enhanced/ZoneSnapshotGrid';
import { getDashboardData } from '@/api/dashboard';

const DirectorGeneralDashboard: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'full' | 'approvals' | 'health'>('full');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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

  return (
    <div className={`min-h-screen bg-background text-foreground relative ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <ParticlesBackground count={60} colorStart="#14B8A680" colorEnd="#2563EB80" />
      </div>
      
      {/* Main Dashboard Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Director Header with Role Banner */}
        <div className="flex-shrink-0 z-20">
          <DirectorHeader />
        </div>
        
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
                <div className="h-24">
                  <TodaysSnapshot 
                    data={dashboardData?.snapshot} 
                    lastUpdate={lastUpdate}
                  />
                </div>
              </motion.section>
              
              {/* Main Panels Grid - Fixed spacing and heights */}
              <div className="space-y-8">
                {(viewMode === 'full' || viewMode === 'approvals') && (
                  <motion.section 
                    className="h-80"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <EnhancedApprovalsPanel 
                      data={dashboardData?.approvals}
                      onViewModeChange={setViewMode}
                      currentMode={viewMode}
                    />
                  </motion.section>
                )}

                {(viewMode === 'full' || viewMode === 'health') && (
                  <motion.section 
                    className="h-80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <EnhancedSystemHealthPanel 
                      data={dashboardData?.systemHealth}
                      onViewModeChange={setViewMode}
                      currentMode={viewMode}
                    />
                  </motion.section>
                )}

                {viewMode === 'full' && (
                  <motion.section 
                    className="h-80"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <EnhancedCoordinationPanel 
                      data={dashboardData?.coordination}
                    />
                  </motion.section>
                )}
              </div>

              {/* Zone Snapshots - Proper spacing from main panels */}
              {viewMode === 'full' && (
                <motion.section
                  className="mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ZoneSnapshotGrid data={dashboardData?.zones} />
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
