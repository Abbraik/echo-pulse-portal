// Updated ACT types to match Phase 2 database structure
import { BundleStatus, KPI } from '@/types/database';

// Bundle tag types (keeping existing for UI compatibility)
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
  | string;

// UI Bundle interface that matches what the frontend expects
export interface Bundle {
  id: string;
  name: string;
  summary?: string;
  status: BundleStatus;
  owner: string; // Maps to created_by from database
  lastModified: string; // Maps to updated_at from database
  leveragePoints: any[]; // Maps to leverage_points from database
  tags: string[]; // Maps to tags from database
  objectives: string[]; // Maps to objectives from database
  pillars: string[]; // Maps to pillars from database
  geography: string[]; // Maps to geography from database
  coherence: number; // Maps to coherence from database
  ndiImpact: number; // Maps to ndi_impact from database
  isApproved: boolean; // Maps to is_approved from database
}

// Bundle form data for creating/editing bundles - Updated to match BundleModal
export interface BundleFormData {
  id?: string;
  name: string;
  summary: string;
  status?: BundleStatus; // Made optional to match BundleModal
  tags?: { name: string; type: string }[];
  objectives?: string[];
  pillars?: ('population' | 'resource' | 'services' | 'social')[];
  geography?: string[];
  owner?: string;
  lastModified?: string;
  isApproved?: boolean;
  coherence?: number;
  ndiImpact?: number;
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

// Helper function to convert UI bundle form to database bundle format
export const mapUIBundleToDatabase = (formData: BundleFormFields) => ({
  name: formData.name,
  summary: formData.summary,
  tags: formData.tags,
  objectives: formData.objectives,
  pillars: formData.pillars,
  geography: formData.geography,
});
