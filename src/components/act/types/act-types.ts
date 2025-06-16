// Updated ACT types to match Phase 2 database structure
import { Bundle as DatabaseBundle, BundleStatus, KPI } from '@/types/database';

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

// Extended Bundle interface that combines database structure with UI needs
export interface Bundle extends Omit<DatabaseBundle, 'createdBy' | 'createdAt' | 'updatedAt'> {
  owner: string; // Maps to createdBy for UI compatibility
  lastModified: string; // Maps to updatedAt for UI compatibility
  ndiImpact: number; // Already matches database
  coherence: number; // Already matches database
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
export const mapDatabaseBundleToUI = (dbBundle: DatabaseBundle): Bundle => ({
  ...dbBundle,
  owner: dbBundle.createdBy,
  lastModified: dbBundle.updatedAt.toString(),
  tags: dbBundle.tags as BundleTag[],
});

// Helper function to convert UI bundle form to database bundle
export const mapUIBundleToDatabase = (formData: BundleFormFields): Partial<DatabaseBundle> => ({
  name: formData.name,
  summary: formData.summary,
  tags: formData.tags,
  objectives: formData.objectives,
  pillars: formData.pillars,
  geography: formData.geography,
});
