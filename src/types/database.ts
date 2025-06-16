
// Core database types matching Phase 2 specification

export type UUID = string;
export type UserID = string;

// Enum types
export type ApprovalType = 'strategy' | 'bundle' | 'redesign' | 'externalDirective';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revisionRequested';
export type ZoneName = 'THINK' | 'ACT' | 'LEARN' | 'INNOVATE' | 'MONITOR';
export type ClaimStatus = 'open' | 'assigned' | 'closed';
export type BundleStatus = 'draft' | 'active' | 'pilot' | 'completed';
export type SeverityLevel = 'low' | 'medium' | 'high';

// Dashboard Data Models
export interface Approval {
  id: UUID;
  type: ApprovalType;
  title: string;
  createdBy: UserID;
  assignedTo: UserID[];
  createdAt: Date;
  dueAt?: Date;
  status: ApprovalStatus;
  contextSnapshot: Record<string, any>;
  revisionNotes?: string;
  updatedAt: Date;
}

export interface HealthMetric {
  id: UUID;
  name: string;
  zone: ZoneName;
  value: number;
  target?: number;
  timestamp: Date;
  createdAt: Date;
}

export interface Claim {
  id: UUID;
  zone: ZoneName;
  taskId: UUID;
  status: ClaimStatus;
  claimedBy?: UserID;
  openedAt: Date;
  closedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

// ACT Zone Models
export interface Bundle {
  id: UUID;
  name: string;
  summary?: string;
  status: BundleStatus;
  createdBy: UserID;
  leveragePoints: any[];
  tags: string[];
  objectives: string[];
  pillars: string[];
  geography: string[];
  coherence: number;
  ndiImpact: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface KPI {
  id: UUID;
  bundleId?: UUID;
  name: string;
  currentValue: number;
  targetValue: number;
  unit?: string;
  createdAt: Date;
  updatedAt: Date;
}

// THINK Zone Models
export interface Scenario {
  id: UUID;
  name: string;
  description?: string;
  createdBy: UserID;
  parameters: Record<string, any>;
  results: Record<string, any>;
  isBaseline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CLDNode {
  id: UUID;
  scenarioId?: UUID;
  label: string;
  positionX: number;
  positionY: number;
  nodeType: string;
  createdAt: Date;
}

export interface CLDEdge {
  id: UUID;
  scenarioId?: UUID;
  sourceId?: UUID;
  targetId?: UUID;
  polarity: -1 | 1;
  strength: number;
  createdAt: Date;
}

// MONITOR Zone Models
export interface Anomaly {
  id: UUID;
  metricId?: UUID;
  severity: SeverityLevel;
  detectedAt: Date;
  details?: string;
  acknowledged: boolean;
  acknowledgedBy?: UserID;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

// LEARN Zone Models
export interface Lesson {
  id: UUID;
  title: string;
  content: string;
  sourceBundleId?: UUID;
  tags: string[];
  createdBy: UserID;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// File Storage
export interface FileAttachment {
  id: UUID;
  fileKey: string;
  originalName: string;
  fileSize?: number;
  contentType?: string;
  url?: string;
  uploadedBy: UserID;
  entityType?: string;
  entityId?: UUID;
  createdAt: Date;
}
