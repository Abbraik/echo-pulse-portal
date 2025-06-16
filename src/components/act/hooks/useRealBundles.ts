
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bundle as DatabaseBundle } from '@/types/database';
import { Bundle, BundleFormData } from '../types/act-types';
import { useToast } from '@/hooks/use-toast';

// Convert database bundle to UI bundle
const mapDatabaseBundleToUI = (dbBundle: DatabaseBundle): Bundle => ({
  ...dbBundle,
  owner: dbBundle.createdBy,
  lastModified: dbBundle.updatedAt?.toISOString() || new Date().toISOString(),
  createdAt: dbBundle.createdAt || new Date(),
  updatedAt: dbBundle.updatedAt || new Date()
});

export const useRealBundles = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['bundles', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching bundles:', error);
        throw error;
      }

      return data?.map(mapDatabaseBundleToUI) || [];
    },
    retry: 1,
    staleTime: 30000 // 30 seconds
  });
};

export const useRealBundleActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createBundle = useMutation({
    mutationFn: async (bundleData: Omit<BundleFormData, 'id'>) => {
      const { data, error } = await supabase
        .from('bundles')
        .insert({
          name: bundleData.name,
          summary: bundleData.summary,
          status: bundleData.status || 'draft',
          created_by: 'test-user-id', // In real app, get from auth
          leverage_points: bundleData.tags?.map(tag => ({ name: tag.name, type: tag.type })) || [],
          tags: bundleData.tags?.map(tag => tag.name) || [],
          objectives: bundleData.objectives || [],
          pillars: bundleData.pillars || [],
          geography: bundleData.geography || []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast({
        title: "Bundle Created",
        description: "Bundle has been successfully created.",
      });
    },
    onError: (error) => {
      console.error('Error creating bundle:', error);
      toast({
        title: "Error",
        description: "Failed to create bundle. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateBundle = useMutation({
    mutationFn: async ({ bundleId, updates }: { bundleId: string; updates: Partial<DatabaseBundle> }) => {
      const { data, error } = await supabase
        .from('bundles')
        .update(updates)
        .eq('id', bundleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast({
        title: "Bundle Updated",
        description: "Bundle has been successfully updated.",
      });
    }
  });

  const approveBundle = useMutation({
    mutationFn: async (bundleId: string) => {
      const { data, error } = await supabase
        .from('bundles')
        .update({ is_approved: true, status: 'active' })
        .eq('id', bundleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast({
        title: "Bundle Approved",
        description: "Bundle has been approved and activated.",
      });
    }
  });

  return { createBundle, updateBundle, approveBundle };
};
