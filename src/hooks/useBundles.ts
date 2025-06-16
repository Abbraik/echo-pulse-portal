
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bundle, BundleStatus } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useBundles = (status?: BundleStatus) => {
  return useQuery({
    queryKey: ['bundles', status],
    queryFn: async () => {
      let query = supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database fields to TypeScript interface
      return data?.map(row => ({
        id: row.id,
        name: row.name,
        summary: row.summary,
        status: row.status,
        createdBy: row.created_by,
        leveragePoints: row.leverage_points || [],
        tags: row.tags || [],
        objectives: row.objectives || [],
        pillars: row.pillars || [],
        geography: row.geography || [],
        coherence: row.coherence || 50,
        ndiImpact: row.ndi_impact || 0,
        isApproved: row.is_approved || false,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      })) as Bundle[];
    },
  });
};

export const useBundle = (bundleId: string) => {
  return useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single();
      
      if (error) throw error;
      
      // Map database fields to TypeScript interface
      return {
        id: data.id,
        name: data.name,
        summary: data.summary,
        status: data.status,
        createdBy: data.created_by,
        leveragePoints: data.leverage_points || [],
        tags: data.tags || [],
        objectives: data.objectives || [],
        pillars: data.pillars || [],
        geography: data.geography || [],
        coherence: data.coherence || 50,
        ndiImpact: data.ndi_impact || 0,
        isApproved: data.is_approved || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as Bundle;
    },
    enabled: !!bundleId,
  });
};

export const useBundleActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const createBundle = useMutation({
    mutationFn: async (bundleData: Partial<Bundle>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('bundles')
        .insert({
          name: bundleData.name!,
          summary: bundleData.summary,
          status: bundleData.status || 'draft',
          created_by: user.id,
          leverage_points: bundleData.leveragePoints || [],
          tags: bundleData.tags || [],
          objectives: bundleData.objectives || [],
          pillars: bundleData.pillars || [],
          geography: bundleData.geography || [],
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Map database fields to TypeScript interface
      return {
        id: data.id,
        name: data.name,
        summary: data.summary,
        status: data.status,
        createdBy: data.created_by,
        leveragePoints: data.leverage_points || [],
        tags: data.tags || [],
        objectives: data.objectives || [],
        pillars: data.pillars || [],
        geography: data.geography || [],
        coherence: data.coherence || 50,
        ndiImpact: data.ndi_impact || 0,
        isApproved: data.is_approved || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as Bundle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast({ title: "Bundle created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create bundle", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateBundle = useMutation({
    mutationFn: async ({ bundleId, updates }: { bundleId: string; updates: Partial<Bundle> }) => {
      const { error } = await supabase
        .from('bundles')
        .update({
          name: updates.name,
          summary: updates.summary,
          status: updates.status,
          leverage_points: updates.leveragePoints,
          tags: updates.tags,
          objectives: updates.objectives,
          pillars: updates.pillars,
          geography: updates.geography,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundle'] });
      toast({ title: "Bundle updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update bundle", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const approveBundle = useMutation({
    mutationFn: async (bundleId: string) => {
      const { error } = await supabase
        .from('bundles')
        .update({ 
          is_approved: true, 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast({ title: "Bundle approved and activated" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to approve bundle", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return {
    createBundle,
    updateBundle,
    approveBundle,
  };
};
