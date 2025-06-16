
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
      return data as Bundle[];
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
      return data as Bundle;
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
          ...bundleData,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Bundle;
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
          ...updates,
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
