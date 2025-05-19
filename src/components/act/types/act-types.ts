
// Bundle tag types
export type BundleTag = 
  | "Water" 
  | "Energy" 
  | "Education" 
  | "Health" 
  | "Economy" 
  | "Digital" 
  | "Innovation" 
  | "Governance"
  | "Sustainability"
  | "Social"
  | "Infrastructure"
  | "Climate"
  | "Incentive"
  | "Short-Term"
  | "Medium-Term"
  | "Long-Term"
  | "High-Priority"
  | string; // Allow custom tags beyond the predefined ones

// Bundle status
export type BundleStatus = 'draft' | 'pending' | 'active';

// Bundle object structure
export interface Bundle {
  id: string;
  name: string;
  summary?: string;
  coherence: number;
  ndiImpact: number;
  isApproved: boolean;
  status: BundleStatus;
  owner: string;
  lastModified: string;
  tags: BundleTag[];
  objectives?: string[];
  pillars?: ('population' | 'resource' | 'services' | 'social')[];
  geography?: string[];
}

// Custom types for Bundle creation form
export type BundleFormFields = {
  name: string;
  summary: string;
  tags: BundleTag[];
  objectives: string[];
  pillars: ('population' | 'resource' | 'services' | 'social')[];
  geography: string[];
};

// Act Zone Command Actions
export type ActCommandAction = 'assign-leverage' | 're-optimize' | 'launch-delivery';
