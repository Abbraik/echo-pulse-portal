
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { taskTemplates } from '../data/taskTemplates';

export const useTaskGeneration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bundleId, leveragePointIds }: { bundleId: string; leveragePointIds: string[] }) => {
      // For now, we'll simulate the task generation since we don't have the backend table yet
      // In a real implementation, this would call the supabase RPC function
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate tasks based on templates
      const generatedTasks = [];
      for (const pointId of leveragePointIds) {
        const template = taskTemplates.find(t => t.leveragePointId === pointId);
        if (template) {
          generatedTasks.push(...template.tasks.map(task => ({
            bundleId,
            leveragePointId: pointId,
            ...task,
            id: crypto.randomUUID(),
            status: 'open' as const,
            createdAt: new Date(),
            createdBy: 'current-user'
          })));
        }
      }
      
      console.log('Generated tasks:', generatedTasks);
      return generatedTasks;
    },
    onSuccess: (tasks) => {
      toast({
        title: 'Tasks Generated Successfully',
        description: `Generated ${tasks.length} actionable tasks from selected leverage points.`,
      });
      queryClient.invalidateQueries({ queryKey: ['bundle-tasks'] });
    },
    onError: (error) => {
      console.error('Error generating tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate tasks from leverage points.',
        variant: 'destructive'
      });
    },
  });
};
