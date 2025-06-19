
// Act schema types
export interface ActBundle {
  id: string;
  name: string;
  summary?: string;
  createdBy?: string;
  leveragePoints: any[];
  objectives: string[];
  pillars: string[];
  geography: string[];
  tags: string[];
  status: 'draft' | 'active' | 'pilot' | 'completed';
  coherence: number;
  ndiImpact: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActKPI {
  id: string;
  bundleId?: string;
  name: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit?: string;
  measurementFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dataSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActStrategyTask {
  id: string;
  bundleId?: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  dependencies: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
