
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Approval, ApprovalStatus } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';

export const useApprovals = (userId?: string, status?: ApprovalStatus) => {
  return useQuery({
    queryKey: ['approvals', userId, status],
    queryFn: async () => {
      let query = supabase
        .from('approvals')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.contains('assigned_to', [userId]);
      }
      
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Approval[];
    },
  });
};

export const useApprovalActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const approveApproval = useMutation({
    mutationFn: async (approvalId: string) => {
      const { error } = await supabase
        .from('approvals')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', approvalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      toast({ title: "Approval granted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to approve", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const rejectApproval = useMutation({
    mutationFn: async ({ approvalId, notes }: { approvalId: string; notes?: string }) => {
      const { error } = await supabase
        .from('approvals')
        .update({ 
          status: 'rejected', 
          revision_notes: notes,
          updated_at: new Date().toISOString() 
        })
        .eq('id', approvalId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      toast({ title: "Approval rejected" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to reject approval", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return {
    approveApproval,
    rejectApproval,
  };
};
