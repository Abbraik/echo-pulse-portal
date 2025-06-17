
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bundle, BundleFormData, mapDatabaseBundleToUI, mapUIBundleToDatabase } from '../types/act-types';
import { useToast } from '@/hooks/use-toast';
import { BundleStatus } from '@/types/database';

export const useRealBundles = (statusFilter?: string) => {
  return useQuery({
    queryKey: ['bundles', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        // Type-safe status filtering
        const validStatuses: BundleStatus[] = ['draft', 'active', 'pilot', 'completed'];
        if (validStatuses.includes(statusFilter as BundleStatus)) {
          query = query.eq('status', statusFilter as BundleStatus);
        }
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
      const dbData = mapUIBundleToDatabase(bundleData);
      
      const { data, error } = await supabase
        .from('bundles')
        .insert({
          ...dbData,
          created_by: 'test-user-id', // In real app, get from auth
        })
        .select()
        .single();

      if (error) throw error;
      return mapDatabaseBundleToUI(data);
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
    mutationFn: async ({ bundleId, updates }: { bundleId: string; updates: Partial<BundleFormData> }) => {
      const dbUpdates = mapUIBundleToDatabase(updates as BundleFormData);
      
      const { data, error } = await supabase
        .from('bundles')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId)
        .select()
        .single();

      if (error) throw error;
      return mapDatabaseBundleToUI(data);
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
        .update({ 
          is_approved: true, 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', bundleId)
        .select()
        .single();

      if (error) throw error;
      return mapDatabaseBundleToUI(data);
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

// Single bundle hook for fetching individual bundles
export const useRealBundle = (bundleId: string) => {
  return useQuery({
    queryKey: ['bundle', bundleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .eq('id', bundleId)
        .single();
      
      if (error) throw error;
      return mapDatabaseBundleToUI(data);
    },
    enabled: !!bundleId,
  });
};
