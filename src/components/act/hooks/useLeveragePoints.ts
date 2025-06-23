
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LeveragePoint } from '../types/leverage-types';

export const useLeveragePoints = () => {
  return useQuery({
    queryKey: ['leverage-points'],
    queryFn: async (): Promise<LeveragePoint[]> => {
      const { data, error } = await supabase.rpc('get_leverage_points');
      
      if (error) {
        console.error('Error fetching leverage points:', error);
        throw error;
      }
      
      // Cast the Json type to our expected LeveragePoint[] type
      return (data as LeveragePoint[]) || [];
    }
  });
};

export const useUpdateBundleLeverage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ bundleId, points }: { bundleId: string; points: string[] }) => {
      const { error } = await supabase.rpc('update_bundle_leverage', {
        bundle_id: bundleId,
        points: points
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      queryClient.invalidateQueries({ queryKey: ['bundle'] });
      toast({
        title: 'Leverage points saved',
        description: 'Bundle leverage points have been updated successfully',
      });
    },
    onError: (error) => {
      console.error('Error updating leverage points:', error);
      toast({
        title: 'Error',
        description: 'Failed to update leverage points',
        variant: 'destructive'
      });
    },
  });
};
