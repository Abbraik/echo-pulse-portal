
// Core schema types
export interface CoreUser {
  id: string;
  email: string;
  createdAt: Date;
}

export interface CoreProfile {
  id: string;
  fullName?: string;
  role: 'admin' | 'director_general' | 'zone_lead' | 'analyst';
  language?: 'en' | 'ar';
  theme?: 'light' | 'dark';
  avatarUrl?: string;
  department?: string;
  zone?: string;
  preferences: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoreScenario {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  version: number;
  isBaseline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoreRun {
  id: string;
  scenarioId?: string;
  name?: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface CoreApproval {
  id: string;
  type: 'strategy' | 'bundle' | 'redesign' | 'external_directive';
  title: string;
  description?: string;
  createdBy?: string;
  assignedTo: string[];
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  contextSnapshot: Record<string, any>;
  revisionNotes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  dueAt?: Date;
}
