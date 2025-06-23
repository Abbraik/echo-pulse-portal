
export interface LeveragePointTaskTemplate {
  leveragePointId: string;
  tasks: { title: string; description: string; }[];
}

export interface ActTask {
  id: string;
  bundleId: string;
  title: string;
  description?: string;
  leveragePointId?: string;
  createdBy: string;
  status: 'open' | 'in_progress' | 'done';
  createdAt: Date;
}
