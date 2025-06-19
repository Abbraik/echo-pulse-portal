
import { useState, useEffect } from 'react';
import { SGDashboardData } from '@/types/sg';

const mockData: SGDashboardData = {
  strategic: {
    deiComposite: { current: 82, target: 85, history: [79, 80, 82] },
    trustIndex: { current: 74, target: 80, history: [70, 73, 74] },
    psiScores: {
      Producer: 0.65,
      Stabilizer: 0.72,
      Innovator: 0.58,
      Unifier: 0.61
    },
    entropyTrends: [
      { zone: 'Think', values: [0.3, 0.35, 0.32] },
      { zone: 'Act', values: [0.4, 0.42, 0.38] },
      { zone: 'Monitor', values: [0.25, 0.28, 0.26] },
      { zone: 'Learn', values: [0.2, 0.22, 0.21] },
      { zone: 'Innovate', values: [0.35, 0.33, 0.36] }
    ]
  },
  approvals: [
    { id: 'a1', type: 'bundle', title: 'Water Resource Quota', createdBy: 'Analyst X', dueIn: '3 days', status: 'pending' },
    { id: 'a2', type: 'policy', title: 'Climate Adaptation Framework', createdBy: 'Policy Team', dueIn: '1 week', status: 'pending' },
    { id: 'a3', type: 'directive', title: 'Digital Transformation', createdBy: 'Tech Lead', dueIn: '5 days', status: 'pending' },
    { id: 'a4', type: 'mandate', title: 'External Compliance Review', createdBy: 'Compliance', dueIn: '2 days', status: 'pending' }
  ],
  coordination: {
    zoneLeads: [
      { zone: 'Think', status: 'good', lastUpdate: '2025-06-10T14:00Z' },
      { zone: 'Act', status: 'warning', lastUpdate: '2025-06-10T13:30Z' },
      { zone: 'Monitor', status: 'good', lastUpdate: '2025-06-10T14:15Z' },
      { zone: 'Learn', status: 'good', lastUpdate: '2025-06-10T13:45Z' },
      { zone: 'Innovate', status: 'critical', lastUpdate: '2025-06-10T12:00Z' }
    ],
    escalations: [
      { id: 'c1', issue: 'Unassigned Claim in Act', severity: 'high', openedAt: '5 h ago' },
      { id: 'c2', issue: 'Monitor Alert Threshold', severity: 'medium', openedAt: '2 h ago' },
      { id: 'c3', issue: 'Resource Allocation Conflict', severity: 'critical', openedAt: '1 h ago' }
    ]
  },
  risks: [
    { id: 'r1', name: 'DEI Drift', impact: 0.8, likelihood: 0.6 },
    { id: 'r2', name: 'Resource Shortage', impact: 0.7, likelihood: 0.4 },
    { id: 'r3', name: 'System Overload', impact: 0.9, likelihood: 0.3 },
    { id: 'r4', name: 'External Dependencies', impact: 0.6, likelihood: 0.7 }
  ],
  anomalies: [
    { id: 'an1', indicator: 'Resource Stock', deviation: -12, timestamp: '2025-06-11T09:00Z' },
    { id: 'an2', indicator: 'Performance Index', deviation: 8, timestamp: '2025-06-11T08:30Z' },
    { id: 'an3', indicator: 'Trust Metric', deviation: -5, timestamp: '2025-06-11T08:00Z' }
  ],
  summary: {
    bullets: [
      'DEI drifted below 80% for 2 consecutive days',
      'Bundle Alpha achieved 92% of target loops',
      'Act→Monitor queue at 5 items (↑25%)'
    ],
    nextBriefing: '2025-06-25T10:00:00Z'
  }
};

export const useSGMockData = () => {
  const [data, setData] = useState<SGDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
};
