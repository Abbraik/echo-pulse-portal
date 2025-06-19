
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ActBundle } from '@/types/act';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useNewBundles = (status?: string) => {
  return useQuery({
    queryKey: ['new-bundles', status],
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
      
      return data?.map(row => ({
        id: row.id,
        name: row.name,
        summary: row.summary,
        createdBy: row.created_by,
        leveragePoints: row.leverage_points || [],
        objectives: row.objectives || [],
        pillars: row.pillars || [],
        geography: row.geography || [],
        tags: row.tags || [],
        status: row.status,
        coherence: row.coherence || 50,
        ndiImpact: row.ndi_impact || 0,
        isApproved: row.is_approved || false,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      })) as ActBundle[];
    },
  });
};

export const useNewBundle = (bundleId: string) => {
  return useQuery({
    queryKey: ['new-bundle', bundleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        summary: data.summary,
        createdBy: data.created_by,
        leveragePoints: data.leverage_points || [],
        objectives: data.objectives || [],
        pillars: data.pillars || [],
        geography: data.geography || [],
        tags: data.tags || [],
        status: data.status,
        coherence: data.coherence || 50,
        ndiImpact: data.ndi_impact || 0,
        isApproved: data.is_approved || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as ActBundle;
    },
    enabled: !!bundleId,
  });
};

export const useNewBundleActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const createBundle = useMutation({
    mutationFn: async (bundleData: Partial<ActBundle>) => {
      if (!user) throw new Error('User not authenticated');
      
      // First create user entry in core.users if it doesn't exist
      await supabase
        .from('users')
        .upsert({ id: user.id, email: user.email || '' }, { onConflict: 'id' });
      
      const { data, error } = await supabase
        .from('bundles')
        .insert({
          name: bundleData.name!,
          summary: bundleData.summary,
          created_by: user.id,
          leverage_points: bundleData.leveragePoints || [],
          objectives: bundleData.objectives || [],
          pillars: bundleData.pillars || [],
          geography: bundleData.geography || [],
          tags: bundleData.tags || [],
          status: bundleData.status || 'draft'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-bundles'] });
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

  return { createBundle };
};
