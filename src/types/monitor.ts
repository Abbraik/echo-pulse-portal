
// Monitor schema types
export interface MonitorHealthMetric {
  id: string;
  runId?: string;
  zone: 'THINK' | 'ACT' | 'LEARN' | 'INNOVATE' | 'MONITOR';
  indicator: string;
  name: string;
  value: number;
  target?: number;
  unit?: string;
  measurementType: 'point' | 'cumulative' | 'average';
  timestamp: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface MonitorClaim {
  id: string;
  zone: 'THINK' | 'ACT' | 'LEARN' | 'INNOVATE' | 'MONITOR';
  taskId: string;
  taskType?: string;
  status: 'open' | 'assigned' | 'closed';
  claimedBy?: string;
  openedAt: Date;
  closedAt?: Date;
  resolutionNotes?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface MonitorAnomaly {
  id: string;
  metricId?: string;
  severity: 'low' | 'medium' | 'high';
  detectedAt: Date;
  details?: string;
  thresholdValue?: number;
  actualValue?: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
  createdAt: Date;
}
