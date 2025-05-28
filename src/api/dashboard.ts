// Types for dashboard data
export interface KPI {
  id: number;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  target?: number;
}

export interface Alert {
  id: number;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  details: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  isNew: boolean;
}

export interface ActivityEvent {
  id: number;
  event: string;
  type: string;
  timeAgo: string;
  timestamp: string;
  user?: string;
}

export interface PulseData {
  id: number;
  timestamp: string;
  level: number;
  performance: number;
  stability: number;
  status: string;
}

// Mock API functions
export function getKPIs(): Promise<KPI[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Population Growth',
          value: 1.2,
          change: 0.3,
          trend: 'up',
          unit: '%',
          target: 1.5
        },
        {
          id: 2,
          name: 'Fertility Rate',
          value: 2.1,
          change: -0.2,
          trend: 'down',
          unit: 'children per woman',
          target: 2.3
        },
        {
          id: 3,
          name: 'Migration Rate',
          value: 3.7,
          change: 1.2,
          trend: 'up',
          unit: 'per 1000',
          target: 3.0
        },
        {
          id: 4,
          name: 'Life Expectancy',
          value: 82.4,
          change: 0.5,
          trend: 'up',
          unit: 'years',
          target: 83.0
        }
      ]);
    }, 500);
  });
}

export function getAlerts(): Promise<Alert[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          type: 'warning',
          message: 'Social Trust Declining',
          details: 'Youth social trust metrics show 12% decline over 6 months',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          priority: 'high',
          isNew: true
        },
        {
          id: 2,
          type: 'info',
          message: 'Migration Model Updated',
          details: 'Migration prediction model has been updated with latest census data',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          priority: 'medium',
          isNew: false
        },
        {
          id: 3,
          type: 'error',
          message: 'Education Metric Anomaly',
          details: 'Unexpected variance in education completion rates detected',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          priority: 'high',
          isNew: false
        },
        {
          id: 4,
          type: 'success',
          message: 'Health Index Improved',
          details: 'Population health index shows 3.2% improvement quarter-over-quarter',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          priority: 'low',
          isNew: false
        }
      ]);
    }, 500);
  });
}

export function getActivity(): Promise<ActivityEvent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          event: 'Scenario "Low Migration" created',
          type: 'Scenario',
          timeAgo: '10 minutes ago',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          user: 'Sarah Chen'
        },
        {
          id: 2,
          event: 'System calibration completed',
          type: 'System',
          timeAgo: '2 hours ago',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
          id: 3,
          event: 'Migration model parameters updated',
          type: 'Model',
          timeAgo: '4 hours ago',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
          user: 'Mohammed Al-Farsi'
        },
        {
          id: 4,
          event: 'Quarterly report generated',
          type: 'Report',
          timeAgo: '1 day ago',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          user: 'System'
        },
        {
          id: 5,
          event: 'New data source integrated',
          type: 'Data',
          timeAgo: '2 days ago',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          user: 'Elena Petrova'
        }
      ]);
    }, 500);
  });
}

export function getPulse(): Promise<PulseData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        timestamp: new Date().toISOString(),
        level: 78,
        performance: 92,
        stability: 78,
        status: "System operating within expected parameters"
      });
    }, 500);
  });
}

export const getDashboardData = async () => {
  // Simulate API call for comprehensive dashboard data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        strategic: {
          deiScore: 78.5,
          deiTarget: 85,
          deiTrend: [72, 74, 76, 78, 78.5],
          populationStability: -2.1,
          resourceEfficiency: 12.3,
          socialCohesion: 82.7,
          hasStrategicAlert: true,
        },
        think: {
          targetAlignment: 78,
          topLoops: [
            { name: 'Population & Development', coverage: 75, status: 'attention' },
            { name: 'Economic Migration', coverage: 89, status: 'good' },
            { name: 'Environmental Quality', coverage: 61, status: 'critical' }
          ],
          scenarios: [
            { name: 'Baseline', value: 78.5, color: 'gray' },
            { name: 'Enhanced Migration', value: 82.3, color: 'teal' },
            { name: 'Green Tech Focus', value: 79.1, color: 'blue' }
          ]
        },
        act: {
          pendingApprovals: [
            {
              id: 1,
              title: 'Migration Enhancement Bundle',
              owner: 'Policy Team A',
              dueDate: '2024-01-15',
              riskRating: 'medium'
            },
            {
              id: 2,
              title: 'Resource Optimization Strategy',
              owner: 'Economic Team',
              dueDate: '2024-01-12',
              riskRating: 'low'
            }
          ],
          performance: {
            successRate: 82,
            timeToDeployAvg: 45,
            underperformers: 2
          },
          escalations: [
            'Missed milestone: Social Cohesion Initiative',
            'ROI shortfall: Green Tech Investment'
          ]
        },
        monitor: {
          topAlerts: [
            { type: 'DEI Drift', severity: 'high', description: 'Population volatility increasing' },
            { type: 'Loop Inconsistency', severity: 'medium', description: 'Marriage rate loop underperforming' },
            { type: 'Operational Anomaly', severity: 'low', description: 'Resource extraction spike detected' }
          ],
          liveMetrics: {
            dei: 78.5,
            trust: 82.1,
            migration: '+12.3%'
          },
          recentActivity: [
            'DEI recalculation completed',
            'New scenario analysis started',
            'Alert threshold updated'
          ]
        },
        learn: {
          topLessons: [
            { title: 'Migration Policy Optimization', successRate: 89, playbook: 'MP-2024-01' },
            { title: 'Resource Allocation Strategy', successRate: 76, playbook: 'RA-2024-03' },
            { title: 'Social Cohesion Enhancement', successRate: 82, playbook: 'SC-2024-02' }
          ],
          rootCauses: [
            'Marriage-rate loop underperforming due to social barriers',
            'Resource extraction exceeding sustainable thresholds'
          ],
          knowledgeGaps: [
            'Youth employment correlation with migration patterns',
            'Environmental impact on fertility rates'
          ]
        },
        innovate: {
          prototypes: [
            { name: 'AI-Driven Migration Forecasting', phase: 'Testing', impact: '+5.2% DEI' },
            { name: 'Dynamic Resource Allocation', phase: 'Development', impact: '+3.8% Efficiency' }
          ],
          decisionPoints: [
            { name: 'Blockchain Governance Model', type: 'promote', readiness: 'ready' },
            { name: 'Quantum Social Modeling', type: 'archive', readiness: 'incomplete' }
          ],
          resourceRequests: [
            'Additional data scientists for ML models',
            'Extended cloud computing resources'
          ]
        }
      });
    }, 1000);
  });
};
