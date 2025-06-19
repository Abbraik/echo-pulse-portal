
import { SGApiResponse, StrategicCommand, Approval, CoordinationHub, Risk, Anomaly, ExecutiveSummary } from '@/types/sg';

// Mock API delay to simulate real network requests
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced mock data with more realistic values
const mockStrategicData: StrategicCommand = {
  deiComposite: { 
    current: 82, 
    target: 85, 
    history: [79, 80, 82, 81, 83, 82] 
  },
  trustIndex: { 
    current: 74, 
    target: 80, 
    history: [70, 73, 74, 76, 75, 74] 
  },
  psiScores: {
    Producer: 0.65,
    Stabilizer: 0.72,
    Innovator: 0.58,
    Unifier: 0.61
  },
  entropyTrends: [
    { zone: 'Think', values: [0.3, 0.35, 0.32, 0.28, 0.31] },
    { zone: 'Act', values: [0.4, 0.42, 0.38, 0.35, 0.37] },
    { zone: 'Monitor', values: [0.25, 0.28, 0.26, 0.24, 0.27] },
    { zone: 'Learn', values: [0.2, 0.22, 0.21, 0.19, 0.23] },
    { zone: 'Innovate', values: [0.35, 0.33, 0.36, 0.34, 0.38] }
  ]
};

const mockApprovalsData: Approval[] = [
  { 
    id: 'a1', 
    type: 'bundle', 
    title: 'Water Resource Quota Allocation', 
    createdBy: 'Analyst X', 
    dueIn: '3 days', 
    status: 'pending',
    priority: 'high',
    description: 'Critical water resource distribution framework for Q3',
    attachments: 3
  },
  { 
    id: 'a2', 
    type: 'policy', 
    title: 'Climate Adaptation Framework v2.1', 
    createdBy: 'Policy Team Alpha', 
    dueIn: '1 week', 
    status: 'pending',
    priority: 'medium',
    attachments: 7
  },
  { 
    id: 'a3', 
    type: 'directive', 
    title: 'Digital Transformation Initiative', 
    createdBy: 'Tech Lead Beta', 
    dueIn: '5 days', 
    status: 'pending',
    priority: 'critical',
    attachments: 12
  },
  { 
    id: 'a4', 
    type: 'mandate', 
    title: 'External Compliance Review Protocol', 
    createdBy: 'Compliance Office', 
    dueIn: '2 days', 
    status: 'pending',
    priority: 'high',
    attachments: 5
  },
  { 
    id: 'a5', 
    type: 'bundle', 
    title: 'Healthcare Infrastructure Bundle', 
    createdBy: 'Health Division', 
    dueIn: '1 week', 
    status: 'revised',
    priority: 'medium',
    attachments: 8
  }
];

const mockCoordinationData: CoordinationHub = {
  zoneLeads: [
    { 
      zone: 'Think', 
      status: 'good', 
      lastUpdate: '2025-06-19T14:00Z',
      leadName: 'Dr. Sarah Chen',
      activeItems: 12
    },
    { 
      zone: 'Act', 
      status: 'warning', 
      lastUpdate: '2025-06-19T13:30Z',
      leadName: 'Marcus Rodriguez',
      activeItems: 18
    },
    { 
      zone: 'Monitor', 
      status: 'good', 
      lastUpdate: '2025-06-19T14:15Z',
      leadName: 'Aisha Patel',
      activeItems: 7
    },
    { 
      zone: 'Learn', 
      status: 'good', 
      lastUpdate: '2025-06-19T13:45Z',
      leadName: 'Prof. James Wilson',
      activeItems: 9
    },
    { 
      zone: 'Innovate', 
      status: 'critical', 
      lastUpdate: '2025-06-19T12:00Z',
      leadName: 'Elena Kowalski',
      activeItems: 23
    }
  ],
  escalations: [
    { 
      id: 'c1', 
      issue: 'Unassigned Claim in Act Zone', 
      severity: 'high', 
      openedAt: '5 h ago',
      affectedZones: ['Act', 'Monitor'],
      assignedTo: 'Marcus Rodriguez'
    },
    { 
      id: 'c2', 
      issue: 'Monitor Alert Threshold Exceeded', 
      severity: 'medium', 
      openedAt: '2 h ago',
      affectedZones: ['Monitor'],
      assignedTo: 'Aisha Patel'
    },
    { 
      id: 'c3', 
      issue: 'Resource Allocation Conflict', 
      severity: 'critical', 
      openedAt: '1 h ago',
      affectedZones: ['Think', 'Act', 'Innovate'],
      assignedTo: 'Secretary General'
    },
    { 
      id: 'c4', 
      issue: 'Innovation Pipeline Blockage', 
      severity: 'high', 
      openedAt: '3 h ago',
      affectedZones: ['Innovate', 'Learn'],
      assignedTo: 'Elena Kowalski'
    }
  ]
};

const mockRisksData: Risk[] = [
  { 
    id: 'r1', 
    name: 'DEI Composite Drift', 
    impact: 0.8, 
    likelihood: 0.6,
    category: 'Strategic',
    mitigation: 'Enhanced monitoring and intervention protocols',
    owner: 'Strategic Planning'
  },
  { 
    id: 'r2', 
    name: 'Resource Shortage Critical', 
    impact: 0.7, 
    likelihood: 0.4,
    category: 'Operational',
    mitigation: 'Alternative resource allocation strategies',
    owner: 'Operations'
  },
  { 
    id: 'r3', 
    name: 'System Overload Potential', 
    impact: 0.9, 
    likelihood: 0.3,
    category: 'Technical',
    mitigation: 'Load balancing and capacity expansion',
    owner: 'Technology'
  },
  { 
    id: 'r4', 
    name: 'External Dependencies Risk', 
    impact: 0.6, 
    likelihood: 0.7,
    category: 'External',
    mitigation: 'Diversification of supplier base',
    owner: 'Procurement'
  },
  { 
    id: 'r5', 
    name: 'Compliance Gap Exposure', 
    impact: 0.75, 
    likelihood: 0.5,
    category: 'Regulatory',
    mitigation: 'Compliance audit and remediation',
    owner: 'Legal & Compliance'
  }
];

const mockAnomaliesData: Anomaly[] = [
  { 
    id: 'an1', 
    indicator: 'Resource Stock Level', 
    deviation: -12, 
    timestamp: '2025-06-19T09:00Z',
    zone: 'Act',
    severity: 'medium'
  },
  { 
    id: 'an2', 
    indicator: 'Performance Index Spike', 
    deviation: 8, 
    timestamp: '2025-06-19T08:30Z',
    zone: 'Monitor',
    severity: 'low'
  },
  { 
    id: 'an3', 
    indicator: 'Trust Metric Fluctuation', 
    deviation: -5, 
    timestamp: '2025-06-19T08:00Z',
    zone: 'Think',
    severity: 'medium'
  },
  { 
    id: 'an4', 
    indicator: 'Innovation Rate Drop', 
    deviation: -18, 
    timestamp: '2025-06-19T07:45Z',
    zone: 'Innovate',
    severity: 'high'
  }
];

const mockSummaryData: ExecutiveSummary = {
  bullets: [
    'DEI Composite drifted below 80% threshold for 2 consecutive days',
    'Bundle Alpha delivery achieved 92% of target completion loops',
    'Act→Monitor queue increased to 5 items (+25% from yesterday)',
    'Innovation pipeline shows 18% slowdown requiring intervention'
  ],
  nextBriefing: '2025-06-25T10:00:00Z',
  recentActions: [
    'Approved Water Resource Quota emergency allocation',
    'Escalated Innovation pipeline blockage to Zone Lead',
    'Initiated Trust Index recovery protocol'
  ],
  upcomingDeadlines: [
    { title: 'Climate Framework Review', date: '2025-06-22T15:00Z', type: 'policy' },
    { title: 'Q3 Strategic Assessment', date: '2025-06-25T09:00Z', type: 'strategic' },
    { title: 'Digital Transform Milestone', date: '2025-06-24T12:00Z', type: 'directive' }
  ]
};

// Mock API functions
export const sgMockApi = {
  async getStrategic(): Promise<SGApiResponse<StrategicCommand>> {
    await mockDelay(300);
    return {
      data: mockStrategicData,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  },

  async getApprovals(): Promise<SGApiResponse<Approval[]>> {
    await mockDelay(400);
    return {
      data: mockApprovalsData,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  },

  async getCoordination(): Promise<SGApiResponse<CoordinationHub>> {
    await mockDelay(350);
    return {
      data: mockCoordinationData,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  },

  async getRisks(): Promise<SGApiResponse<Risk[]>> {
    await mockDelay(250);
    return {
      data: mockRisksData,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  },

  async getAnomalies(): Promise<SGApiResponse<Anomaly[]>> {
    await mockDelay(200);
    return {
      data: mockAnomaliesData,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  },

  async getSummary(): Promise<SGApiResponse<ExecutiveSummary>> {
    await mockDelay(300);
    return {
      data: mockSummaryData,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
  },

  // Action endpoints
  async approveItem(id: string): Promise<SGApiResponse<{ success: boolean }>> {
    await mockDelay(500);
    console.log(`Approving item: ${id}`);
    return {
      data: { success: true },
      timestamp: new Date().toISOString(),
      status: 'success',
      message: 'Item approved successfully'
    };
  },

  async reviseItem(id: string, notes: string): Promise<SGApiResponse<{ success: boolean }>> {
    await mockDelay(600);
    console.log(`Revising item: ${id} with notes: ${notes}`);
    return {
      data: { success: true },
      timestamp: new Date().toISOString(),
      status: 'success',
      message: 'Revision request submitted'
    };
  },

  async acknowledgeEscalation(id: string): Promise<SGApiResponse<{ success: boolean }>> {
    await mockDelay(400);
    console.log(`Acknowledging escalation: ${id}`);
    return {
      data: { success: true },
      timestamp: new Date().toISOString(),
      status: 'success',
      message: 'Escalation acknowledged'
    };
  },

  async updateRisk(id: string, impact: number, likelihood: number): Promise<SGApiResponse<{ success: boolean }>> {
    await mockDelay(500);
    console.log(`Updating risk: ${id} - Impact: ${impact}, Likelihood: ${likelihood}`);
    return {
      data: { success: true },
      timestamp: new Date().toISOString(),
      status: 'success',
      message: 'Risk assessment updated'
    };
  },

  async exportSummary(format: 'pdf' | 'xlsx'): Promise<SGApiResponse<{ downloadUrl: string }>> {
    await mockDelay(1500);
    console.log(`Exporting summary as: ${format}`);
    return {
      data: { downloadUrl: `/exports/executive-summary-${Date.now()}.${format}` },
      timestamp: new Date().toISOString(),
      status: 'success',
      message: `Summary exported as ${format.toUpperCase()}`
    };
  }
};
