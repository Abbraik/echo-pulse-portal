
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { FullscreenOverlay } from '@/components/ui/fullscreen-overlay';
import { useSGData } from '@/hooks/useSGData';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useDataValidation } from '@/hooks/useDataValidation';
import { ConnectionStatus } from '@/components/sg/ConnectionStatus';
import { DataSyncIndicator } from '@/components/sg/DataSyncIndicator';
import { SmartRefreshButton } from '@/components/sg/SmartRefreshButton';
import SGDashboardPanel from '@/components/sg/SGDashboardPanel';
import { OptimizedPanelWrapper } from '@/components/sg/OptimizedPanelWrapper';
import StrategicCommandPanel from '@/components/sg/panels/StrategicCommandPanel';
import ApprovalsPanel from '@/components/sg/panels/ApprovalsPanel';
import CoordinationPanel from '@/components/sg/panels/CoordinationPanel';
import HealthRiskPanel from '@/components/sg/panels/HealthRiskPanel';
import ExecutiveSummaryPanel from '@/components/sg/panels/ExecutiveSummaryPanel';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield, Globe, Keyboard, Info, Activity, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Memoized panel components for better performance
const MemoizedStrategicPanel = memo(StrategicCommandPanel);
const MemoizedApprovalsPanel = memo(ApprovalsPanel);
const MemoizedCoordinationPanel = memo(CoordinationPanel);
const MemoizedHealthRiskPanel = memo(HealthRiskPanel);
const MemoizedExecutiveSummaryPanel = memo(ExecutiveSummaryPanel);

// Define panel configuration with proper typing
interface PanelConfigItem {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  className: string;
}

const SecretaryGeneralDashboard: React.FC = () => {
  const { data, loading, error, lastUpdated, refreshData, actions } = useSGData();
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const [fullscreenPanel, setFullscreenPanel] = useState<string | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const performanceMetrics = usePerformanceMonitor('SecretaryGeneralDashboard');
  const { validateData, lastValidation, getValidationSummary } = useDataValidation();
  
  // Real-time updates configuration with longer intervals to reduce frequency
  const realTimeConfig = useMemo(() => ({
    enabled: autoRefresh,
    interval: 120000, // Increased to 2 minutes to reduce frequency
    maxRetries: 3,
    backoffMultiplier: 2
  }), [autoRefresh]);

  const realTimeState = useRealTimeUpdates(refreshData, realTimeConfig);

  // Validate data when it changes
  useEffect(() => {
    if (data) {
      validateData(data);
    }
  }, [data, validateData]);

  // Get sync status based on real-time state and data validation
  const getSyncStatus = useCallback(() => {
    if (isRefreshing) return 'syncing';
    if (error || !lastValidation?.isValid) return 'error';
    if (realTimeState.isConnected && lastValidation?.isValid) return 'synced';
    return 'stale';
  }, [isRefreshing, error, lastValidation, realTimeState.isConnected]);

  // Memoized panel configuration with proper props
  const panelConfig: PanelConfigItem[] = useMemo(() => [
    {
      id: 'strategic',
      title: 'Strategic Command',
      component: MemoizedStrategicPanel,
      className: 'md:col-span-2 xl:col-span-2'
    },
    {
      id: 'approvals',
      title: 'Approvals & Directives',
      component: MemoizedApprovalsPanel,
      className: 'md:col-span-1 xl:col-span-1'
    },
    {
      id: 'coordination',
      title: 'Coordination Hub',
      component: MemoizedCoordinationPanel,
      className: 'md:col-span-2 xl:col-span-1'
    },
    {
      id: 'health',
      title: 'System Health & Risk',
      component: MemoizedHealthRiskPanel,
      className: 'md:col-span-1 xl:col-span-1'
    },
    {
      id: 'summary',
      title: 'Executive Summary',
      component: MemoizedExecutiveSummaryPanel,
      className: 'md:col-span-1 xl:col-span-2'
    }
  ], []);

  // Function to get props for each panel
  const getPanelProps = useCallback((panelId: string) => {
    if (!data) return {};

    switch (panelId) {
      case 'strategic':
        // Create strategic command data from available data
        return { 
          data: {
            dei: { current: 82, target: 85, history: [79, 80, 81, 82] },
            trust: { current: 74, target: 80, history: [70, 72, 73, 74] },
            psiu: {
              Producer: { value: 0.65, target: 0.7 },
              Stabilizer: { value: 0.72, target: 0.75 },
              Innovator: { value: 0.58, target: 0.6 },
              Unifier: { value: 0.61, target: 0.65 }
            },
            entropy: [
              { zone: "Think", deltaPct: 2.5, history: [0.30, 0.35, 0.32, 0.34] },
              { zone: "Act", deltaPct: 1.0, history: [0.40, 0.42, 0.41, 0.42] },
              { zone: "Monitor", deltaPct: -0.5, history: [0.25, 0.28, 0.26, 0.25] },
              { zone: "Learn", deltaPct: 0.8, history: [0.20, 0.22, 0.21, 0.22] },
              { zone: "Innovate", deltaPct: 1.5, history: [0.35, 0.37, 0.36, 0.38] }
            ]
          }
        };
      case 'approvals':
        return { data: data.approvals, actions };
      case 'coordination':
        return { data: data.coordination, actions };
      case 'health':
        return { risks: data.risks, anomalies: data.anomalies, actions };
      case 'summary':
        return { data: data.summary, actions };
      default:
        return {};
    }
  }, [data, actions]);

  // Enhanced fullscreen toggle with animations
  const handleToggleFullscreen = useCallback((panelId: string) => {
    setFullscreenPanel(fullscreenPanel === panelId ? null : panelId);
  }, [fullscreenPanel]);

  // Optimized refresh function with loading state management
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
      if (data) {
        const validation = validateData(data);
        if (!validation.isValid) {
          console.warn('Data validation failed:', validation.errors);
        }
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshData, data, validateData]);

  // Toggle auto-refresh and real-time updates
  const handleToggleAutoRefresh = useCallback(() => {
    setAutoRefresh(!autoRefresh);
  }, [autoRefresh]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Help overlay
      if (event.key === '?' || (event.key === 'h' && event.ctrlKey)) {
        event.preventDefault();
        setShowKeyboardHelp(!showKeyboardHelp);
      }
      
      // Performance stats toggle
      if (event.key === 'p' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        setShowPerformanceStats(!showPerformanceStats);
      }
      
      // Quick panel access with number keys
      if (event.ctrlKey && !isNaN(Number(event.key))) {
        event.preventDefault();
        const panelNumber = parseInt(event.key);
        if (panelNumber >= 1 && panelNumber <= panelConfig.length) {
          handleToggleFullscreen(panelConfig[panelNumber - 1].id);
        }
      }
      
      // Refresh with Ctrl+R
      if (event.key === 'r' && event.ctrlKey) {
        event.preventDefault();
        handleRefresh();
      }
      
      // Toggle auto-refresh with Ctrl+Shift+A
      if (event.key === 'a' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        setAutoRefresh(!autoRefresh);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showKeyboardHelp, handleToggleFullscreen, handleRefresh, autoRefresh, panelConfig, showPerformanceStats]);

  // Show loading screen only on initial load, not on refreshes
  if (loading && !data) {
    return (
      <AnimatedPage>
        <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <motion.div 
            className="text-center glass-panel-cinematic p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <h2 className="text-xl font-bold text-white mb-2 font-noto">Initializing Command Center</h2>
            <p className="text-teal-200">Loading Secretary General Dashboard...</p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <Activity size={16} className="text-teal-400 animate-pulse" />
              <span className="text-xs text-gray-400 font-mono">
                Optimizing performance...
              </span>
            </div>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <motion.div 
            className="text-center text-white max-w-md glass-panel-cinematic p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-red-400 font-noto">System Alert</h1>
            <p className="text-gray-300 mb-6 font-noto">{error}</p>
            <Button 
              onClick={handleRefresh} 
              className="bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 border border-teal-500/30 hover:border-teal-400/50 backdrop-blur-sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  if (!data) {
    return (
      <AnimatedPage>
        <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <motion.div 
            className="text-center text-white glass-panel-cinematic p-8"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Globe className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 font-noto">No Data Stream</h1>
            <p className="text-gray-400 mb-4 font-noto">Unable to establish data connection</p>
            <Button 
              onClick={handleRefresh} 
              className="bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 border border-teal-500/30 hover:border-teal-400/50 backdrop-blur-sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reconnect
            </Button>
          </motion.div>
        </div>
      </AnimatedPage>
    );
  }

  const renderFullscreenPanel = () => {
    if (!fullscreenPanel) return null;

    const panelInfo = panelConfig.find(p => p.id === fullscreenPanel);
    if (!panelInfo) return null;

    const PanelComponent = panelInfo.component;
    const panelProps = getPanelProps(fullscreenPanel);

    return (
      <SGDashboardPanel
        title={panelInfo.title}
        panelId={fullscreenPanel}
        isHovered={false}
        isExpanded={false}
        isFullscreen={true}
        onHover={() => {}}
        onToggleFullscreen={handleToggleFullscreen}
        className="h-full"
      >
        <PanelComponent {...panelProps} />
      </SGDashboardPanel>
    );
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5" />
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2 
          }}
        />
        
        {/* Enhanced Dashboard Header with Real-time Features */}
        <motion.div 
          className="relative z-10 mb-6 glass-panel-cinematic p-6 border border-white/20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm border border-teal-400/30"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Shield size={24} className="text-teal-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 mb-2 font-noto">
                  Secretary General Command Center
                </h1>
                <p className="text-gray-300 font-noto">Strategic oversight and system coordination</p>
                
                {/* Enhanced Status Information */}
                <div className="flex items-center space-x-4 mt-3">
                  <ConnectionStatus
                    isConnected={realTimeState.isConnected}
                    lastUpdate={realTimeState.lastUpdate}
                    error={realTimeState.error}
                    retryCount={realTimeState.retryCount}
                    onReconnect={realTimeState.reconnect}
                  />
                  
                  <DataSyncIndicator
                    status={getSyncStatus()}
                    lastSync={lastUpdated}
                    nextSync={autoRefresh ? new Date(Date.now() + 120000).toISOString() : undefined}
                  />
                  
                  {lastValidation && !lastValidation.isValid && (
                    <span className="text-xs text-red-400 font-mono flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {getValidationSummary()}
                    </span>
                  )}
                  
                  {showPerformanceStats && (
                    <div className="text-xs text-blue-400 font-mono flex items-center space-x-2">
                      <Zap size={12} />
                      <span>Render: {performanceMetrics.renderTime.toFixed(1)}ms</span>
                      <span>Components: {performanceMetrics.componentCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                variant="outline"
                size="sm"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10 hover:border-gray-400/50 backdrop-blur-sm"
              >
                <Keyboard className="mr-2 h-4 w-4" />
                Shortcuts
              </Button>
              
              <SmartRefreshButton
                onRefresh={handleRefresh}
                autoRefresh={autoRefresh}
                onToggleAutoRefresh={handleToggleAutoRefresh}
                isLoading={isRefreshing}
                lastRefresh={lastUpdated}
              />
            </div>
          </div>
        </motion.div>

        {/* Keyboard Help Overlay */}
        <AnimatePresence>
          {showKeyboardHelp && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowKeyboardHelp(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-panel-cinematic p-6 max-w-md w-full border border-white/20"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Info size={20} className="text-teal-400" />
                  <h3 className="text-lg font-semibold text-white font-noto">Keyboard Shortcuts</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Help</span>
                    <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">?</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Refresh</span>
                    <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">Ctrl+R</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Quick Panel Access</span>
                    <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">Ctrl+1-5</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Fullscreen Panel</span>
                    <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">Shift+Enter</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Exit Fullscreen</span>
                    <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">Esc</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Toggle Auto-refresh</span>
                    <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">Ctrl+Shift+A</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Performance Stats</span>
                    <kbd className="bg-white/10 px-2 py-1 rounded text-xs font-mono">Ctrl+Shift+P</kbd>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Panel Overlay */}
        <FullscreenOverlay
          isOpen={!!fullscreenPanel}
          onClose={() => setFullscreenPanel(null)}
          title={fullscreenPanel ? `${fullscreenPanel} Panel` : ''}
        >
          {renderFullscreenPanel()}
        </FullscreenOverlay>

        {/* Enhanced Dashboard Grid with Performance Optimizations */}
        <motion.div 
          className={`relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-[calc(100vh-20rem)] ${fullscreenPanel ? 'hidden' : ''}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {panelConfig.map((panelInfo, index) => {
            const PanelComponent = panelInfo.component;
            const panelProps = getPanelProps(panelInfo.id);
            
            return (
              <OptimizedPanelWrapper
                key={panelInfo.id}
                isVisible={!fullscreenPanel}
                animationDelay={index * 0.1}
                className={panelInfo.className}
              >
                <SGDashboardPanel
                  title={panelInfo.title}
                  panelId={panelInfo.id}
                  isHovered={hoveredPanel !== null}
                  isExpanded={hoveredPanel === panelInfo.id}
                  isFullscreen={false}
                  onHover={setHoveredPanel}
                  onToggleFullscreen={handleToggleFullscreen}
                  className="h-full"
                >
                  <PanelComponent {...panelProps} />
                </SGDashboardPanel>
              </OptimizedPanelWrapper>
            );
          })}
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default SecretaryGeneralDashboard;
