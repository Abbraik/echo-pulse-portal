
import { ReactNode } from 'react';
import { DetailView } from '@/pages/Act';

export type BundleTag = 'Resource' | 'Economic' | 'Social' | 'Governance' | 'Environmental' | 'Cohesion';

export type GlassType = 'default' | 'deep' | 'dark';

export type TaskStatus = 'completed' | 'in-progress' | 'planned';

export type BundleCoherence = {
  value: number;
  delta?: number;
  trend: 'up' | 'down' | 'stable';
};

export interface Bundle {
  id: string;
  name: string;
  coherence: BundleCoherence;
  isApproved: boolean;
  tags: BundleTag[];
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
