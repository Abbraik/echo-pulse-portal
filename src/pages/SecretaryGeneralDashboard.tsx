import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useSGData } from '@/hooks/useSGData';
import SGDashboardPanel from '@/components/sg/SGDashboardPanel';
import StrategicCommandPanel from '@/components/sg/panels/StrategicCommandPanel';
import ApprovalsPanel from '@/components/sg/panels/ApprovalsPanel';
import CoordinationPanel from '@/components/sg/panels/CoordinationPanel';
import HealthRiskPanel from '@/components/sg/panels/HealthRiskPanel';
import ExecutiveSummaryPanel from '@/components/sg/panels/ExecutiveSummaryPanel';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield, Globe } from 'lucide-react';

const SecretaryGeneralDashboard: React.FC = () => {
  const { data, loading, error, lastUpdated, refreshData, actions } = useSGData();
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const [fullscreenPanel, setFullscreenPanel] = useState<string | null>(null);

  const handleToggleFullscreen = (panelId: string) => {
    setFullscreenPanel(fullscreenPanel === panelId ? null : panelId);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && fullscreenPanel) {
      setFullscreenPanel(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenPanel]);

  if (loading) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center glass-panel-cinematic p-8">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-white mb-2 font-noto">Initializing Command Center</h2>
            <p className="text-teal-200">Loading Secretary General Dashboard...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (error) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white max-w-md glass-panel-cinematic p-8">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-red-400 font-noto">System Alert</h1>
            <p className="text-gray-300 mb-6 font-noto">{error}</p>
            <Button 
              onClick={refreshData} 
              className="bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 border border-teal-500/30 hover:border-teal-400/50 backdrop-blur-sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (!data) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white glass-panel-cinematic p-8">
            <Globe className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 font-noto">No Data Stream</h1>
            <p className="text-gray-400 mb-4 font-noto">Unable to establish data connection</p>
            <Button 
              onClick={refreshData} 
              className="bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 border border-teal-500/30 hover:border-teal-400/50 backdrop-blur-sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reconnect
            </Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Enhanced Dashboard Header */}
        <div className="relative z-10 mb-6 glass-panel-cinematic p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm border border-teal-400/30">
                <Shield size={24} className="text-teal-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 mb-2 font-noto">
                  Secretary General Command Center
                </h1>
                <p className="text-gray-300 font-noto">Strategic oversight and system coordination</p>
                {lastUpdated && (
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    Last synchronized: {new Date(lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={refreshData}
              variant="outline"
              className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/50 backdrop-blur-sm transition-all duration-200"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Data
            </Button>
          </div>
        </div>

        {/* Fullscreen Overlay with Enhanced Styling */}
        {fullscreenPanel && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm p-4">
            <div className="h-full w-full max-w-7xl mx-auto">
              {fullscreenPanel === 'strategic' && data.strategic && (
                <SGDashboardPanel
                  title="Strategic Command"
                  panelId="strategic"
                  isHovered={false}
                  isExpanded={false}
                  isFullscreen={true}
                  onHover={() => {}}
                  onToggleFullscreen={handleToggleFullscreen}
                  className="h-full"
                >
                  <StrategicCommandPanel data={data.strategic} />
                </SGDashboardPanel>
              )}
              {fullscreenPanel === 'approvals' && (
                <SGDashboardPanel
                  title="Approvals & Directives"
                  panelId="approvals"
                  isHovered={false}
                  isExpanded={false}
                  isFullscreen={true}
                  onHover={() => {}}
                  onToggleFullscreen={handleToggleFullscreen}
                  className="h-full"
                >
                  <ApprovalsPanel data={data.approvals} actions={actions} />
                </SGDashboardPanel>
              )}
              {fullscreenPanel === 'coordination' && (
                <SGDashboardPanel
                  title="Coordination Hub"
                  panelId="coordination"
                  isHovered={false}
                  isExpanded={false}
                  isFullscreen={true}
                  onHover={() => {}}
                  onToggleFullscreen={handleToggleFullscreen}
                  className="h-full"
                >
                  <CoordinationPanel data={data.coordination} actions={actions} />
                </SGDashboardPanel>
              )}
              {fullscreenPanel === 'health' && (
                <SGDashboardPanel
                  title="System Health & Risk"
                  panelId="health"
                  isHovered={false}
                  isExpanded={false}
                  isFullscreen={true}
                  onHover={() => {}}
                  onToggleFullscreen={handleToggleFullscreen}
                  className="h-full"
                >
                  <HealthRiskPanel risks={data.risks} anomalies={data.anomalies} actions={actions} />
                </SGDashboardPanel>
              )}
              {fullscreenPanel === 'summary' && (
                <SGDashboardPanel
                  title="Executive Summary"
                  panelId="summary"
                  isHovered={false}
                  isExpanded={false}
                  isFullscreen={true}
                  onHover={() => {}}
                  onToggleFullscreen={handleToggleFullscreen}
                  className="h-full"
                >
                  <ExecutiveSummaryPanel data={data.summary} actions={actions} />
                </SGDashboardPanel>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Dashboard Grid */}
        <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-[calc(100vh-12rem)] ${fullscreenPanel ? 'hidden' : ''}`}>
          {/* Strategic Command */}
          <SGDashboardPanel
            title="Strategic Command"
            panelId="strategic"
            isHovered={hoveredPanel !== null}
            isExpanded={hoveredPanel === 'strategic'}
            isFullscreen={false}
            onHover={setHoveredPanel}
            onToggleFullscreen={handleToggleFullscreen}
            className="md:col-span-1 xl:col-span-1"
          >
            {data.strategic && <StrategicCommandPanel data={data.strategic} />}
          </SGDashboardPanel>

          {/* Approvals & Directives */}
          <SGDashboardPanel
            title="Approvals & Directives"
            panelId="approvals"
            isHovered={hoveredPanel !== null}
            isExpanded={hoveredPanel === 'approvals'}
            isFullscreen={false}
            onHover={setHoveredPanel}
            onToggleFullscreen={handleToggleFullscreen}
            className="md:col-span-1 xl:col-span-1"
          >
            <ApprovalsPanel data={data.approvals} actions={actions} />
          </SGDashboardPanel>

          {/* Coordination Hub */}
          <SGDashboardPanel
            title="Coordination Hub"
            panelId="coordination"
            isHovered={hoveredPanel !== null}
            isExpanded={hoveredPanel === 'coordination'}
            isFullscreen={false}
            onHover={setHoveredPanel}
            onToggleFullscreen={handleToggleFullscreen}
            className="md:col-span-2 xl:col-span-1"
          >
            <CoordinationPanel data={data.coordination} actions={actions} />
          </SGDashboardPanel>

          {/* System Health & Risk */}
          <SGDashboardPanel
            title="System Health & Risk"
            panelId="health"
            isHovered={hoveredPanel !== null}
            isExpanded={hoveredPanel === 'health'}
            isFullscreen={false}
            onHover={setHoveredPanel}
            onToggleFullscreen={handleToggleFullscreen}
            className="md:col-span-1 xl:col-span-1"
          >
            <HealthRiskPanel risks={data.risks} anomalies={data.anomalies} actions={actions} />
          </SGDashboardPanel>

          {/* Executive Summary */}
          <SGDashboardPanel
            title="Executive Summary"
            panelId="summary"
            isHovered={hoveredPanel !== null}
            isExpanded={hoveredPanel === 'summary'}
            isFullscreen={false}
            onHover={setHoveredPanel}
            onToggleFullscreen={handleToggleFullscreen}
            className="md:col-span-1 xl:col-span-2"
          >
            <ExecutiveSummaryPanel data={data.summary} actions={actions} />
          </SGDashboardPanel>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SecretaryGeneralDashboard;
