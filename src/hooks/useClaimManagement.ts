import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { EnhancedClaim, ClaimFilter } from '@/types/claims';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/utils/logger';
import { useMockClaims } from './useMockClaims';

export const useClaimManagement = (initialFilter?: ClaimFilter) => {
  const { claims: mockClaims, updateClaimStatus } = useMockClaims();
  const [selectedClaim, setSelectedClaim] = useState<EnhancedClaim | null>(null);
  const [filter, setFilter] = useState<ClaimFilter>(initialFilter || {});
  const { toast } = useToast();

  // Filter claims based on current filter state
  const filteredClaims = mockClaims.filter(claim => {
    if (filter.zone && claim.zone !== filter.zone) return false;
    if (filter.status && claim.status !== filter.status) return false;
    if (filter.originZone && claim.originZone !== filter.originZone) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        claim.taskId.toLowerCase().includes(searchLower) ||
        claim.zone.toLowerCase().includes(searchLower) ||
        claim.originZone.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Mock query for consistency with the interface
  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['claims', filter],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return filteredClaims;
    },
    initialData: filteredClaims
  });

  // Claim action mutations
  const claimTask = useMutation({
    mutationFn: async (claimId: string) => {
      updateClaimStatus(claimId, 'assigned', 'demo-user');
      logger.action('Demo: Claiming task', { claimId });
    },
    onSuccess: () => {
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
      updateClaimStatus(claimId, 'open');
      logger.action('Demo: Releasing task', { claimId });
    },
    onSuccess: () => {
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
      updateClaimStatus(claimId, 'closed', 'demo-user');
      logger.action('Demo: Resolving task', { claimId, notes });
    },
    onSuccess: () => {
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
    refetch: () => Promise.resolve()
  };
};