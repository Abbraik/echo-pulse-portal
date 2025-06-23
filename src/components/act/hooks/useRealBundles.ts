
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bundle } from '../types/act-types';

// Mock bundles data with leverage points
const mockBundles: Bundle[] = [
  {
    id: "6aa7593a-f2e6-4a0a-aace-c652bfa68925",
    name: "Education Innovation Hub",
    summary: "Modern learning platforms and curriculum reform",
    createdBy: "9b431078-a2b4-4d42-b0a8-2ec8a351dedc",
    leveragePoints: ["2", "5", "9"], // Buffer Sizes, Feedback Loops, Goals of the System
    objectives: [
      "Improve learning outcomes",
      "Increase digital literacy", 
      "Enhance teacher capabilities"
    ],
    pillars: ["Education", "Technology", "Human Development"],
    geography: ["National", "Rural Areas"],
    tags: ["education", "innovation", "technology"],
    status: "draft",
    coherence: 90,
    ndiImpact: 75.5,
    isApproved: false,
    createdAt: new Date("2025-06-16T05:40:57.466Z"),
    updatedAt: new Date("2025-06-16T05:40:57.466Z")
  },
  {
    id: "7bb8694b-g3f7-5b1b-bbdf-d763cga79936",
    name: "Healthcare Digital Transformation",
    summary: "Digitizing healthcare services and improving accessibility",
    createdBy: "9b431078-a2b4-4d42-b0a8-2ec8a351dedc", 
    leveragePoints: ["1", "6", "10"], // Constants & Parameters, Information Flows, Paradigm or Mindset
    objectives: [
      "Reduce patient wait times",
      "Improve diagnostic accuracy",
      "Expand telemedicine reach"
    ],
    pillars: ["Healthcare", "Technology", "Access"],
    geography: ["Urban", "Remote Areas"],
    tags: ["healthcare", "digital", "transformation"],
    status: "active",
    coherence: 85,
    ndiImpact: 80.2,
    isApproved: true,
    createdAt: new Date("2025-06-15T10:20:30.123Z"),
    updatedAt: new Date("2025-06-16T14:15:45.789Z")
  },
  {
    id: "8cc9705c-h4g8-6c2c-cceg-e874dhb80047",
    name: "Sustainable Energy Initiative", 
    summary: "Renewable energy transition and grid modernization",
    createdBy: "9b431078-a2b4-4d42-b0a8-2ec8a351dedc",
    leveragePoints: ["3", "7", "12"], // Stock & Flow Structures, Rules of the System, Meta-Rules
    objectives: [
      "Increase renewable energy capacity",
      "Modernize power grid infrastructure", 
      "Reduce carbon emissions"
    ],
    pillars: ["Environment", "Infrastructure", "Economy"],
    geography: ["National", "Industrial Zones"],
    tags: ["energy", "sustainability", "infrastructure"],
    status: "pilot",
    coherence: 78,
    ndiImpact: 88.7,
    isApproved: true,
    createdAt: new Date("2025-06-14T08:45:12.456Z"),
    updatedAt: new Date("2025-06-16T16:30:22.654Z")
  }
];

export const useRealBundles = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['bundles', statusFilter],
    queryFn: async (): Promise<Bundle[]> => {
      // For now, return mock data instead of making real API calls
      // In production, this would fetch from Supabase
      let filteredBundles = mockBundles;
      
      if (statusFilter && statusFilter !== 'all') {
        filteredBundles = mockBundles.filter(bundle => bundle.status === statusFilter);
      }
      
      return filteredBundles;
    }
  });
};

export const useRealBundle = (bundleId: string) => {
  return useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async (): Promise<Bundle | null> => {
      // Find the bundle in mock data
      const bundle = mockBundles.find(b => b.id === bundleId);
      return bundle || null;
    }
  });
};

export const useRealBundleActions = () => {
  const queryClient = useQueryClient();

  const createBundle = useMutation({
    mutationFn: async (bundleData: any) => {
      // Mock implementation - in production this would call Supabase
      const newBundle = {
        id: crypto.randomUUID(),
        ...bundleData,
        created_by: "9b431078-a2b4-4d42-b0a8-2ec8a351dedc",
        leverage_points: bundleData.leveragePoints || [],
        ndi_impact: bundleData.ndiImpact || 0,
        is_approved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Add to mock data
      mockBundles.push({
        ...newBundle,
        createdBy: newBundle.created_by,
        leveragePoints: newBundle.leverage_points,
        ndiImpact: newBundle.ndi_impact,
        isApproved: newBundle.is_approved,
        createdAt: new Date(newBundle.created_at),
        updatedAt: new Date(newBundle.updated_at)
      });
      
      return newBundle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    }
  });

  const updateBundle = useMutation({
    mutationFn: async ({ bundleId, updates }: { bundleId: string; updates: any }) => {
      // Mock implementation - in production this would call Supabase
      const bundleIndex = mockBundles.findIndex(b => b.id === bundleId);
      if (bundleIndex !== -1) {
        const updatedBundle = {
          ...mockBundles[bundleIndex],
          ...updates,
          updatedAt: new Date()
        };
        mockBundles[bundleIndex] = updatedBundle;
        
        return {
          id: updatedBundle.id,
          name: updatedBundle.name,
          summary: updatedBundle.summary,
          created_by: updatedBundle.createdBy,
          leverage_points: updatedBundle.leveragePoints,
          objectives: updatedBundle.objectives,
          pillars: updatedBundle.pillars,
          geography: updatedBundle.geography,
          tags: updatedBundle.tags,
          status: updatedBundle.status,
          coherence: updatedBundle.coherence,
          ndi_impact: updatedBundle.ndiImpact,
          is_approved: updatedBundle.isApproved,
          created_at: updatedBundle.createdAt.toISOString(),
          updated_at: updatedBundle.updatedAt.toISOString()
        };
      }
      throw new Error('Bundle not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundle'] });
    }
  });

  const approveBundle = useMutation({
    mutationFn: async (bundleId: string) => {
      // Mock implementation - in production this would call Supabase
      const bundleIndex = mockBundles.findIndex(b => b.id === bundleId);
      if (bundleIndex !== -1) {
        mockBundles[bundleIndex] = {
          ...mockBundles[bundleIndex],
          isApproved: true,
          status: 'active',
          updatedAt: new Date()
        };
        return mockBundles[bundleIndex];
      }
      throw new Error('Bundle not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundle'] });
    }
  });

  return {
    createBundle,
    updateBundle,
    approveBundle
  };
};
