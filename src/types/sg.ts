
// Secretary General Dashboard Types
export interface DeiComposite {
  current: number;
  target: number;
  history: number[];
}

export interface TrustIndex {
  current: number;
  target: number;
  history: number[];
}

export interface PsiScores {
  Producer: number;
  Stabilizer: number;
  Innovator: number;
  Unifier: number;
}

export interface EntropyTrend {
  zone: 'Think' | 'Act' | 'Monitor' | 'Learn' | 'Innovate';
  values: number[];
}

export interface StrategicCommand {
  deiComposite: DeiComposite;
  trustIndex: TrustIndex;
  psiScores: PsiScores;
  entropyTrends: EntropyTrend[];
}

export interface Approval {
  id: string;
  type: 'bundle' | 'policy' | 'directive' | 'mandate';
  title: string;
  createdBy: string;
  dueIn: string;
  status: 'pending' | 'approved' | 'revised';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  attachments?: number;
}

export interface ZoneLead {
  zone: 'Think' | 'Act' | 'Monitor' | 'Learn' | 'Innovate';
  status: 'good' | 'warning' | 'critical';
  lastUpdate: string;
  leadName?: string;
  activeItems?: number;
}

export interface Escalation {
  id: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  openedAt: string;
  affectedZones?: string[];
  assignedTo?: string;
}

export interface CoordinationHub {
  zoneLeads: ZoneLead[];
  escalations: Escalation[];
}

export interface Risk {
  id: string;
  name: string;
  impact: number;
  likelihood: number;
  category?: string;
  mitigation?: string;
  owner?: string;
}

export interface Anomaly {
  id: string;
  indicator: string;
  deviation: number;
  timestamp: string;
  zone?: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface ExecutiveSummary {
  bullets: string[];
  nextBriefing: string;
  recentActions?: string[];
  upcomingDeadlines?: Array<{
    title: string;
    date: string;
    type: string;
  }>;
}

export interface SGDashboardData {
  strategic: StrategicCommand;
  approvals: Approval[];
  coordination: CoordinationHub;
  risks: Risk[];
  anomalies: Anomaly[];
  summary: ExecutiveSummary;
}

// API Response Types
export interface SGApiResponse<T> {
  data: T;
  timestamp: string;
  status: 'success' | 'error';
  message?: string;
}

// API Endpoints Interface
export interface SGApiEndpoints {
  strategic: () => Promise<SGApiResponse<StrategicCommand>>;
  approvals: () => Promise<SGApiResponse<Approval[]>>;
  coordination: () => Promise<SGApiResponse<CoordinationHub>>;
  risks: () => Promise<SGApiResponse<Risk[]>>;
  anomalies: () => Promise<SGApiResponse<Anomaly[]>>;
  summary: () => Promise<SGApiResponse<ExecutiveSummary>>;
}
