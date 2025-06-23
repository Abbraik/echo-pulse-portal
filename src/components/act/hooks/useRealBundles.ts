
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bundle, BundleFormData } from '../types/act-types';

export const useRealBundles = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['bundles', statusFilter],
    queryFn: async (): Promise<Bundle[]> => {
      let query = supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching bundles:', error);
        throw error;
      }

      return (data || []).map(bundle => ({
        id: bundle.id,
        name: bundle.name,
        summary: bundle.summary,
        createdBy: bundle.created_by,
        leveragePoints: Array.isArray(bundle.leverage_points) ? bundle.leverage_points : [], // Ensure array
        objectives: bundle.objectives || [],
        pillars: bundle.pillars || [],
        geography: bundle.geography || [],
        tags: bundle.tags || [],
        status: bundle.status as 'draft' | 'active' | 'pilot' | 'completed',
        coherence: bundle.coherence || 0,
        ndiImpact: bundle.ndi_impact || 0,
        isApproved: bundle.is_approved || false,
        createdAt: new Date(bundle.created_at),
        updatedAt: new Date(bundle.updated_at)
      }));
    }
  });
};

export const useRealBundle = (bundleId: string) => {
  return useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async (): Promise<Bundle | null> => {
      if (!bundleId) return null;
      
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching bundle:', error);
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        summary: data.summary,
        createdBy: data.created_by,
        leveragePoints: Array.isArray(data.leverage_points) ? data.leverage_points : [], // Ensure array
        objectives: data.objectives || [],
        pillars: data.pillars || [],
        geography: data.geography || [],
        tags: data.tags || [],
        status: data.status as 'draft' | 'active' | 'pilot' | 'completed',
        coherence: data.coherence || 0,
        ndiImpact: data.ndi_impact || 0,
        isApproved: data.is_approved || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    },
    enabled: !!bundleId
  });
};

export const useCreateBundle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bundleData: BundleFormData) => {
      const { data, error } = await supabase
        .from('bundles')
        .insert([{
          name: bundleData.name,
          summary: bundleData.summary,
          objectives: bundleData.objectives || [],
          pillars: bundleData.pillars || [],
          geography: bundleData.geography || [],
          tags: bundleData.tags?.map(tag => tag.name) || [],
          leverage_points: [], // Initialize as empty array
          status: bundleData.status || 'draft',
          coherence: bundleData.coherence || 0,
          ndi_impact: bundleData.ndiImpact || 0,
          is_approved: bundleData.isApproved || false,
          created_by: bundleData.id || 'system'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    }
  });
};

export const useUpdateBundle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bundleId, updates }: { bundleId: string; updates: Partial<BundleFormData> }) => {
      const { data, error } = await supabase
        .from('bundles')
        .update({
          name: updates.name,
          summary: updates.summary,
          objectives: updates.objectives,
          pillars: updates.pillars,
          geography: updates.geography,
          tags: updates.tags?.map(tag => tag.name),
          status: updates.status,
          coherence: updates.coherence,
          ndi_impact: updates.ndiImpact,
          is_approved: updates.isApproved,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    }
  });
};

export const useApproveBundle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bundleId: string) => {
      const { data, error } = await supabase
        .from('bundles')
        .update({
          status: 'active',
          is_approved: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    }
  });
};

export const useRealBundleActions = () => {
  const createBundle = useCreateBundle();
  const updateBundle = useUpdateBundle();
  const approveBundle = useApproveBundle();

  return {
    createBundle,
    updateBundle,
    approveBundle
  };
};
