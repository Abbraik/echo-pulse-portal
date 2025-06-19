
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useSGMockData } from '@/hooks/useSGMockData';
import SGDashboardPanel from '@/components/sg/SGDashboardPanel';
import StrategicCommandPanel from '@/components/sg/panels/StrategicCommandPanel';
import ApprovalsPanel from '@/components/sg/panels/ApprovalsPanel';
import CoordinationPanel from '@/components/sg/panels/CoordinationPanel';
import HealthRiskPanel from '@/components/sg/panels/HealthRiskPanel';
import ExecutiveSummaryPanel from '@/components/sg/panels/ExecutiveSummaryPanel';

const SecretaryGeneralDashboard: React.FC = () => {
  const { data, loading } = useSGMockData();
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
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AnimatedPage>
    );
  }

  if (!data) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-2">Error Loading Dashboard</h1>
            <p className="text-gray-400">Please try refreshing the page</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 font-noto">Secretary General Dashboard</h1>
          <p className="text-gray-300">Strategic oversight and system coordination</p>
        </div>

        {/* Fullscreen Overlay */}
        {fullscreenPanel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4">
            <div className="h-full w-full max-w-6xl mx-auto">
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
                  <ApprovalsPanel data={data.approvals} />
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
                  <CoordinationPanel data={data.coordination} />
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
                  <HealthRiskPanel risks={data.risks} anomalies={data.anomalies} />
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
                  <ExecutiveSummaryPanel data={data.summary} />
                </SGDashboardPanel>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-[calc(100vh-12rem)] ${fullscreenPanel ? 'hidden' : ''}`}>
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
            <ApprovalsPanel data={data.approvals} />
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
            <CoordinationPanel data={data.coordination} />
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
            <HealthRiskPanel risks={data.risks} anomalies={data.anomalies} />
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
            <ExecutiveSummaryPanel data={data.summary} />
          </SGDashboardPanel>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SecretaryGeneralDashboard;
