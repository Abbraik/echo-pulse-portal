
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

// UI Bundle interface that matches what the frontend expects - updated to align with database
export interface Bundle {
  id: string;
  name: string;
  summary?: string;
  status: BundleStatus;
  createdBy: string; // Aligned with database created_by
  createdAt: string; // Added for consistency
  updatedAt: string; // Aligned with database updated_at
  leveragePoints: any[]; // Maps to leverage_points from database
  tags: string[]; // Maps to tags from database
  objectives: string[]; // Maps to objectives from database
  pillars: string[]; // Maps to pillars from database
  geography: string[]; // Maps to geography from database
  coherence: number; // Maps to coherence from database
  ndiImpact: number; // Maps to ndi_impact from database
  isApproved: boolean; // Maps to is_approved from database
}

// Bundle form data for creating/editing bundles - Updated to match database schema
export interface BundleFormData {
  id?: string;
  name: string;
  summary: string;
  status?: BundleStatus;
  tags?: { name: string; type: string }[];
  objectives?: string[];
  pillars?: ('population' | 'resource' | 'services' | 'social')[];
  geography?: string[];
  leveragePoints?: any[]; // Added for consistency
  coherence?: number;
  ndiImpact?: number;
  isApproved?: boolean;
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

// Helper function to convert database bundle to UI bundle
export const mapDatabaseBundleToUI = (dbBundle: any): Bundle => ({
  id: dbBundle.id,
  name: dbBundle.name,
  summary: dbBundle.summary,
  status: dbBundle.status,
  createdBy: dbBundle.created_by,
  createdAt: new Date(dbBundle.created_at).toISOString(),
  updatedAt: new Date(dbBundle.updated_at).toISOString(),
  leveragePoints: Array.isArray(dbBundle.leverage_points) ? dbBundle.leverage_points : [],
  tags: dbBundle.tags || [],
  objectives: dbBundle.objectives || [],
  pillars: dbBundle.pillars || [],
  geography: dbBundle.geography || [],
  coherence: dbBundle.coherence || 0,
  ndiImpact: dbBundle.ndi_impact || 0,
  isApproved: dbBundle.is_approved || false
});

// Helper function to convert UI bundle form to database bundle format
export const mapUIBundleToDatabase = (formData: BundleFormData) => ({
  name: formData.name,
  summary: formData.summary,
  status: formData.status || 'draft',
  leverage_points: formData.tags?.map(tag => ({ name: tag.name, type: tag.type })) || [],
  tags: formData.tags?.map(tag => tag.name) || [],
  objectives: formData.objectives || [],
  pillars: formData.pillars || [],
  geography: formData.geography || [],
});
