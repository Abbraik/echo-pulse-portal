
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MonitorClaim } from '@/types/monitor';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useNewClaims = (zone?: string, status?: string) => {
  return useQuery({
    queryKey: ['new-claims', zone, status],
    queryFn: async () => {
      let query = supabase
        .from('claims')
        .select('*')
        .order('opened_at', { ascending: false });

      if (zone) {
        query = query.eq('zone', zone as any);
      }
      
      if (status) {
        query = query.eq('status', status as any);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(row => ({
        id: row.id,
        zone: row.zone,
        taskId: row.task_id,
        taskType: null, // Not available in current schema
        status: row.status,
        claimedBy: row.claimed_by,
        openedAt: new Date(row.opened_at),
        closedAt: row.closed_at ? new Date(row.closed_at) : undefined,
        resolutionNotes: null, // Not available in current schema
        metadata: row.metadata || {},
        createdAt: new Date(row.created_at)
      })) as MonitorClaim[];
    },
  });
};

export const useNewClaimActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const assignClaim = useMutation({
    mutationFn: async (claimId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('claims')
        .update({ 
          status: 'assigned', 
          claimed_by: user.id
        })
        .eq('id', claimId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-claims'] });
      toast({ title: "Claim assigned successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to assign claim", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const closeClaim = useMutation({
    mutationFn: async ({ claimId, notes }: { claimId: string; notes?: string }) => {
      const { error } = await supabase
        .from('claims')
        .update({ 
          status: 'closed', 
          closed_at: new Date().toISOString()
        })
        .eq('id', claimId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-claims'] });
      toast({ title: "Claim closed successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to close claim", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return { assignClaim, closeClaim };
};
