
// Bundle interface for Act zone
export interface Bundle {
  id: string;
  name: string;
  summary?: string;
  createdBy?: string;
  leveragePoints: string[]; // Updated to include leverage points
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

export interface BundleTag {
  name: string;
  type: 'category' | 'priority' | 'geography' | 'custom';
}

export interface BundleFormData {
  id?: string;
  name: string;
  summary: string;
  tags: BundleTag[];
  objectives: string[];
  pillars: ('population' | 'resource' | 'services' | 'social')[];
  geography: string[];
  status?: 'draft' | 'active' | 'pilot' | 'completed';
  coherence?: number;
  ndiImpact?: number;
  isApproved?: boolean;
}

export interface DeliveryChain {
  id: string;
  name: string;
  status: 'idle' | 'active' | 'delivering' | 'completed';
  bundleId?: string;
  progress: number;
  estimatedCompletion: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PlaybookTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDuration: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
}
