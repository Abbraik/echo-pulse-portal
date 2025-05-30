
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, FileText, Target, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StrategicOverview } from '@/components/dashboard/StrategicOverview';
import { EnhancedSystemHealthPanel } from '@/components/dashboard/enhanced/EnhancedSystemHealthPanel';
import { SystemHealthAlertsPanel } from '@/components/dashboard/strategic/SystemHealthAlertsPanel';
import { DynamicPanelContainer } from '@/components/dashboard/enhanced/DynamicPanelContainer';
import { PersonalizationSidebar } from '@/components/dashboard/enhanced/PersonalizationSidebar';
import { DGNotesSidebar } from '@/components/dashboard/strategic/DGNotesSidebar';
import { ExecutiveReportButton } from '@/components/dashboard/strategic/ExecutiveReportButton';

type ViewMode = 'full' | 'approvals' | 'health';

const DirectorGeneralDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('full');
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [systemHealthFullscreen, setSystemHealthFullscreen] = useState(false);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSystemHealthFullscreen = () => {
    setSystemHealthFullscreen(!systemHealthFullscreen);
  };

  if (systemHealthFullscreen) {
    return (
      <div className="h-screen w-full p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <EnhancedSystemHealthPanel
          onViewModeChange={handleViewModeChange}
          currentMode={viewMode}
          isFullscreen={true}
          onToggleFullscreen={handleSystemHealthFullscreen}
          isExpanded={true}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Director General Dashboard</h1>
            <p className="text-gray-400">Strategic oversight and system coordination</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <ExecutiveReportButton />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotes(true)}
              className="text-teal-400 border-teal-400/30 hover:bg-teal-400/10"
            >
              <FileText size={16} className="mr-2" />
              Notes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPersonalization(true)}
              className="text-teal-400 border-teal-400/30 hover:bg-teal-400/10"
            >
              <Settings size={16} className="mr-2" />
              Customize
            </Button>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Strategic Overview - Left Column */}
          <motion.div
            className="col-span-8 h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full glass-panel-deep border-white/10">
              <StrategicOverview 
                viewMode={viewMode} 
                onViewModeChange={handleViewModeChange}
              />
            </Card>
          </motion.div>

          {/* Enhanced System Health Panel - Right Column */}
          <motion.div
            className="col-span-4 h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full glass-panel-deep border-white/10 overflow-hidden">
              <EnhancedSystemHealthPanel
                onViewModeChange={handleViewModeChange}
                currentMode={viewMode}
                isFullscreen={systemHealthFullscreen}
                onToggleFullscreen={handleSystemHealthFullscreen}
              />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Sidebars */}
      {showPersonalization && (
        <PersonalizationSidebar onClose={() => setShowPersonalization(false)} />
      )}
      
      {showNotes && (
        <DGNotesSidebar onClose={() => setShowNotes(false)} />
      )}
    </div>
  );
};

export default DirectorGeneralDashboard;
