import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedClaim, ClaimFilter } from '@/types/claims';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/utils/logger';

export const useClaimManagement = (initialFilter?: ClaimFilter) => {
  const [selectedClaim, setSelectedClaim] = useState<EnhancedClaim | null>(null);
  const [filter, setFilter] = useState<ClaimFilter>(initialFilter || {});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch claims with real-time updates
  const { data: claims = [], isLoading, refetch } = useQuery({
    queryKey: ['claims', filter],
    queryFn: async () => {
      let query = supabase
        .from('claims')
        .select('*')
        .order('opened_at', { ascending: false });

      if (filter.zone) {
        query = query.eq('zone', filter.zone as any);
      }
      if (filter.status) {
        query = query.eq('status', filter.status as any);
      }
      if (filter.originZone) {
        query = query.eq('origin_zone', filter.originZone);
      }

      const { data, error } = await query;
      
      if (error) {
        logger.error('Failed to fetch claims', error);
        throw error;
      }

      return data?.map(row => ({
        id: row.id,
        zone: row.zone,
        taskId: row.task_id,
        status: row.status,
        claimedBy: row.claimed_by,
        openedAt: new Date(row.opened_at),
        closedAt: row.closed_at ? new Date(row.closed_at) : undefined,
        originZone: row.origin_zone,
        originEntityId: row.origin_entity_id,
        resolutionNotes: row.resolution_notes,
        resolvedBy: row.resolved_by,
        resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
        metadata: row.metadata || {},
        createdAt: new Date(row.created_at)
      })) as EnhancedClaim[];
    },
  });

  // Claim action mutations
  const claimTask = useMutation({
    mutationFn: async (claimId: string) => {
      const { error } = await supabase.rpc('claim_task', { claim_id: claimId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast({ title: "Claim assigned successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to claim task", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const releaseTask = useMutation({
    mutationFn: async (claimId: string) => {
      const { error } = await supabase.rpc('release_task', { claim_id: claimId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast({ title: "Claim released successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to release task", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const resolveTask = useMutation({
    mutationFn: async ({ claimId, notes }: { claimId: string; notes?: string }) => {
      const { error } = await supabase.rpc('resolve_task', { 
        claim_id: claimId, 
        notes: notes || null 
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast({ title: "Claim resolved successfully" });
      setSelectedClaim(null);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to resolve claim", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('claims-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'claims' },
        () => {
          logger.debug('Claims updated, refetching...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const updateFilter = useCallback((newFilter: Partial<ClaimFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  return {
    claims,
    selectedClaim,
    setSelectedClaim,
    filter,
    updateFilter,
    isLoading,
    actions: {
      claim: claimTask.mutate,
      release: releaseTask.mutate,
      resolve: resolveTask.mutate,
    },
    refetch
  };
};