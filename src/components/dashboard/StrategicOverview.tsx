import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { ApprovalsDecisionsPanel } from './strategic/ApprovalsDecisionsPanel';
import { SystemHealthAlertsPanel } from './strategic/SystemHealthAlertsPanel';
import { CoordinationTriggersPanel } from './strategic/CoordinationTriggersPanel';
import { DGNotesSidebar } from './strategic/DGNotesSidebar';
import { ExecutiveReportButton } from './strategic/ExecutiveReportButton';

interface StrategicOverviewProps {
  data?: {
    hasStrategicAlert: boolean;
    approvals: any;
    systemHealth: any;
    coordination: any;
    notes: any;
  };
}

const StrategicOverview: React.FC<StrategicOverviewProps> = ({ data }) => {
  const { t, isRTL } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Mock data structure for sub-panels
  const panelData = {
    approvals: data?.approvals,
    systemHealth: data?.systemHealth,
    coordination: data?.coordination,
    notes: data?.notes
  };

  const hasStrategicAlert = data?.hasStrategicAlert ?? true;

  return (
    <div className={`transition-all duration-500 ${isExpanded ? 'fixed inset-0 z-50 bg-black/50' : 'h-[40vh] min-h-[400px]'}`}>
      <div className={`h-full flex ${isExpanded ? 'p-4' : ''}`}>
        {/* Main Panel Container */}
        <div className={`flex-1 ${isSidebarCollapsed ? 'mr-12' : 'mr-4'} transition-all duration-300`}>
          <GlassCard 
            className="h-full" 
            variant="deep" 
            style={{ 
              background: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '2rem',
              boxShadow: 'inset 0 1px 0 0 rgba(56, 178, 172, 0.1), 0 0 30px rgba(56, 178, 172, 0.15)'
            }}
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                  STRATEGIC OVERVIEW
                </h2>
                <div className="flex items-center space-x-4">
                  <ExecutiveReportButton />
                  <Button
                    size="sm"
                    className={`${hasStrategicAlert ? 'animate-pulse bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                  >
                    <AlertTriangle size={14} className="mr-2" />
                    Review Strategic Alert ▶
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-500/50 text-gray-400"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </Button>
                </div>
              </div>

              {/* Three Sub-Panels Grid */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Approvals & Decisions Panel */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="h-full"
                >
                  <ApprovalsDecisionsPanel data={panelData.approvals} />
                </motion.div>

                {/* System Health & Alerts Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-full"
                >
                  <SystemHealthAlertsPanel data={panelData.systemHealth} />
                </motion.div>

                {/* Coordination & Triggers Panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="h-full"
                >
                  <CoordinationTriggersPanel data={panelData.coordination} />
                </motion.div>
              </div>

              {/* Footer with System Status */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live Sync Active</span>
                  </div>
                  <div>Last Update: {new Date().toLocaleTimeString()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-xs text-gray-400 hover:text-white"
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  >
                    {isSidebarCollapsed ? 'Show' : 'Hide'} Notes ▶
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* DG Notes Sidebar */}
        <div className="flex-shrink-0">
          <DGNotesSidebar 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            data={panelData.notes}
          />
        </div>
      </div>
    </div>
  );
};

export default StrategicOverview;
