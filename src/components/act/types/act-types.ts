
import { ReactNode } from 'react';
import { DetailView } from '@/pages/Act';

export type BundleTag = 
  | 'Resource' 
  | 'Economic' 
  | 'Social' 
  | 'Governance' 
  | 'Environmental' 
  | 'Cohesion'
  | 'Water'
  | 'Incentive'
  | 'Short-Term'
  | 'Long-Term'
  | 'Education'
  | 'Health'
  | 'Digital'
  | 'Infrastructure'
  | 'Innovation';

export type GlassType = 'default' | 'deep' | 'dark';

export type TaskStatus = 'completed' | 'in-progress' | 'planned';

export type BundleStatus = 'draft' | 'pending' | 'active';

export type BundleCoherence = {
  value: number;
  delta?: number;
  trend: 'up' | 'down' | 'stable';
};

export type PillarType = 'economic' | 'social' | 'environmental' | 'governance';

export interface Bundle {
  id: string;
  name: string;
  summary?: string;
  coherence: BundleCoherence | number;
  ndiImpact: number;
  isApproved: boolean;
  status: BundleStatus;
  owner: string;
  lastModified: string;
  tags: BundleTag[];
  cost?: number;
  primaryPillar?: string;
  objectives?: Objective[];
}

export interface Objective {
  id: string;
  text: string;
  leveragePoint?: LeveragePoint;
  rationale?: string;
  order: number;
}

export interface LeveragePoint {
  id: string;
  number: number;
  name: string;
  description: string;
}

export interface CoherenceMatrixCell {
  pillar: PillarType;
  objective: string;
  value: number;
  conflicts?: string[];
  synergies?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string;
  needsApproval: boolean;
  comments?: Comment[];
  dependencies?: string[];
}

export interface ObjectiveLane {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isTeam: boolean;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  tags: BundleTag[];
  templateData?: any; // This would contain the actual template data structure
}

export interface CommandAction {
  type: DetailView;
  label: string;
  icon: ReactNode;
  description?: string;
}
