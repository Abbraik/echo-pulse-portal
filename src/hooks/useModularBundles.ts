
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ActBundle } from '@/types/act';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useModularBundles = (status?: string) => {
  return useQuery({
    queryKey: ['modular-bundles', status],
    queryFn: async () => {
      let query = supabase
        .from('act.bundles')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status as any);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching bundles:', error);
        // Fallback to public schema if modular schema doesn't exist yet
        const fallbackQuery = supabase
          .from('bundles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (status) {
          fallbackQuery.eq('status', status as any);
        }
        
        const { data: fallbackData, error: fallbackError } = await fallbackQuery;
        if (fallbackError) throw fallbackError;
        
        return fallbackData?.map(row => ({
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
      }
      
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

export const useModularBundleActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const createBundle = useMutation({
    mutationFn: async (bundleData: Partial<ActBundle>) => {
      if (!user) throw new Error('User not authenticated');
      
      // Try modular schema first, fallback to public schema
      let query = supabase.from('act.bundles');
      let fallbackQuery = supabase.from('bundles');
      
      const bundleRecord = {
        name: bundleData.name!,
        summary: bundleData.summary,
        created_by: user.id,
        leverage_points: bundleData.leveragePoints || [],
        objectives: bundleData.objectives || [],
        pillars: bundleData.pillars || [],
        geography: bundleData.geography || [],
        tags: bundleData.tags || [],
        status: bundleData.status || 'draft'
      };
      
      const { data, error } = await query.insert(bundleRecord).select().single();
      
      if (error) {
        // Fallback to public schema
        const { data: fallbackData, error: fallbackError } = await fallbackQuery
          .insert(bundleRecord)
          .select()
          .single();
        
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modular-bundles'] });
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

  return { createBundle };
};
