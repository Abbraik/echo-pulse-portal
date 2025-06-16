
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Scenario, CLDNode, CLDEdge } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useScenarios = () => {
  return useQuery({
    queryKey: ['scenarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database fields to TypeScript interface
      return data?.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        createdBy: row.created_by,
        parameters: row.parameters || {},
        results: row.results || {},
        isBaseline: row.is_baseline || false,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      })) as Scenario[];
    },
  });
};

export const useScenario = (scenarioId: string) => {
  return useQuery({
    queryKey: ['scenario', scenarioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
        .select(`
          *,
          cld_nodes(*),
          cld_edges(*)
        `)
        .eq('id', scenarioId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!scenarioId,
  });
};

export const useScenarioActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const createScenario = useMutation({
    mutationFn: async (scenarioData: Partial<Scenario>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('scenarios')
        .insert({
          name: scenarioData.name!,
          description: scenarioData.description,
          created_by: user.id,
          parameters: scenarioData.parameters || {},
          results: scenarioData.results || {},
          is_baseline: scenarioData.isBaseline || false,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Map database fields to TypeScript interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        createdBy: data.created_by,
        parameters: data.parameters || {},
        results: data.results || {},
        isBaseline: data.is_baseline || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as Scenario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      toast({ title: "Scenario created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create scenario", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateScenario = useMutation({
    mutationFn: async ({ scenarioId, updates }: { scenarioId: string; updates: Partial<Scenario> }) => {
      const { error } = await supabase
        .from('scenarios')
        .update({
          name: updates.name,
          description: updates.description,
          parameters: updates.parameters,
          results: updates.results,
          is_baseline: updates.isBaseline,
          updated_at: new Date().toISOString()
        })
        .eq('id', scenarioId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenarios'] });
      queryClient.invalidateQueries({ queryKey: ['scenario'] });
      toast({ title: "Scenario updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update scenario", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return {
    createScenario,
    updateScenario,
  };
};
