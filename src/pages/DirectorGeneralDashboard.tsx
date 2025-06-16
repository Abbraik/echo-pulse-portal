
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useHealthMetrics, useLatestHealthMetrics } from '@/hooks/useHealthMetrics';
import { useApprovals } from '@/hooks/useApprovals';
import { useBundles } from '@/hooks/useBundles';
import { useClaims } from '@/hooks/useClaims';
import DirectorHeader from '@/components/dashboard/DirectorHeader';
import StrategicOverview from '@/components/dashboard/StrategicOverview';
import ThinkSnapshot from '@/components/dashboard/ThinkSnapshot';
import ActSnapshot from '@/components/dashboard/ActSnapshot';
import MonitorSnapshot from '@/components/dashboard/MonitorSnapshot';
import LearnSnapshot from '@/components/dashboard/LearnSnapshot';
import InnovateSnapshot from '@/components/dashboard/InnovateSnapshot';
import { EnhancedDashboardGrid } from '@/components/dashboard/enhanced/EnhancedDashboardGrid';

const DirectorGeneralDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'classic' | 'enhanced'>('enhanced');

  // Fetch real data using our hooks
  const { data: healthMetrics, isLoading: healthLoading } = useLatestHealthMetrics();
  const { data: pendingApprovals, isLoading: approvalsLoading } = useApprovals(undefined, 'pending');
  const { data: activeBundles, isLoading: bundlesLoading } = useBundles('active');
  const { data: openClaims, isLoading: claimsLoading } = useClaims(undefined, 'open');

  // Transform data for components
  const strategicData = {
    hasStrategicAlert: (pendingApprovals?.length || 0) > 3,
    approvals: {
      pendingCount: pendingApprovals?.length || 0,
      highPriority: pendingApprovals?.filter(a => a.dueAt && new Date(a.dueAt) < new Date(Date.now() + 24 * 60 * 60 * 1000)).length || 0,
      items: pendingApprovals?.slice(0, 5) || []
    },
    systemHealth: {
      deiScore: healthMetrics?.find(m => m.name === 'DEI Score')?.value || 78.5,
      metrics: healthMetrics || [],
      alerts: openClaims?.filter(c => c.zone === 'MONITOR').length || 0
    },
    coordination: {
      activeBundles: activeBundles?.length || 0,
      openClaims: openClaims?.length || 0,
      zones: ['THINK', 'ACT', 'LEARN', 'INNOVATE', 'MONITOR'].map(zone => ({
        name: zone,
        status: openClaims?.some(c => c.zone === zone) ? 'attention' : 'good',
        claims: openClaims?.filter(c => c.zone === zone).length || 0
      }))
    }
  };

  const actData = {
    pendingApprovals: pendingApprovals?.map(approval => ({
      id: approval.id,
      title: approval.title,
      owner: 'System', // We don't have owner mapping yet
      dueDate: approval.dueAt ? new Date(approval.dueAt).toLocaleDateString() : 'No due date',
      riskRating: approval.dueAt && new Date(approval.dueAt) < new Date(Date.now() + 24 * 60 * 60 * 1000) ? 'high' : 'low'
    })) || [],
    performance: {
      successRate: Math.round((activeBundles?.filter(b => b.isApproved).length || 0) / Math.max(activeBundles?.length || 1, 1) * 100),
      timeToDeployAvg: 45, // Mock data for now
      underperformers: activeBundles?.filter(b => !b.isApproved && b.status === 'active').length || 0
    },
    escalations: openClaims?.filter(c => c.zone === 'ACT').map(c => 
      `Open claim: ${c.metadata?.bundle_name || 'Unknown task'}`
    ).slice(0, 3) || []
  };

  const monitorData = {
    topAlerts: openClaims?.slice(0, 3).map(claim => ({
      type: claim.metadata?.type || 'System Alert',
      severity: 'medium',
      description: claim.metadata?.bundle_name || 'System monitoring alert'
    })) || [],
    liveMetrics: {
      dei: healthMetrics?.find(m => m.name === 'DEI Score')?.value || 78.5,
      trust: healthMetrics?.find(m => m.name === 'Trust Index')?.value || 82.1,
      migration: '+12.3%' // Mock data
    },
    recentActivity: [
      'Health metrics updated',
      `${openClaims?.length || 0} active claims`,
      `${activeBundles?.length || 0} active bundles`
    ]
  };

  if (viewMode === 'enhanced') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <DirectorHeader 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
          isLoading={healthLoading || approvalsLoading || bundlesLoading || claimsLoading}
        />
        <EnhancedDashboardGrid strategicData={strategicData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <DirectorHeader 
        viewMode={viewMode} 
        onViewModeChange={setViewMode}
        isLoading={healthLoading || approvalsLoading || bundlesLoading || claimsLoading}
      />
      
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Strategic Overview - Takes full width */}
        <StrategicOverview data={strategicData} />
        
        {/* Zone Snapshots Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ThinkSnapshot />
          <ActSnapshot data={actData} />
          <div className="xl:col-span-1 lg:col-span-2 xl:col-start-1 xl:row-start-2">
            <MonitorSnapshot data={monitorData} />
          </div>
          <div className="xl:col-span-1 xl:col-start-2 xl:row-start-2">
            <LearnSnapshot />
          </div>
          <div className="xl:col-span-1 xl:col-start-3 xl:row-start-2">
            <InnovateSnapshot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorGeneralDashboard;
