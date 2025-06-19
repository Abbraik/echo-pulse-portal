
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
}

export interface ZoneLead {
  zone: 'Think' | 'Act' | 'Monitor' | 'Learn' | 'Innovate';
  status: 'good' | 'warning' | 'critical';
  lastUpdate: string;
}

export interface Escalation {
  id: string;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  openedAt: string;
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
}

export interface Anomaly {
  id: string;
  indicator: string;
  deviation: number;
  timestamp: string;
}

export interface ExecutiveSummary {
  bullets: string[];
  nextBriefing: string;
}

export interface SGDashboardData {
  strategic: StrategicCommand;
  approvals: Approval[];
  coordination: CoordinationHub;
  risks: Risk[];
  anomalies: Anomaly[];
  summary: ExecutiveSummary;
}
