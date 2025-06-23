import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Define Task interface
interface Task {
  id: string;
  title: string;
  status: 'to-do' | 'in-progress' | 'completed';
  assignee: string;
  assignee_avatar?: string;
  assignee_initial?: string;
  due_date?: string;
  needs_approval: boolean;
  teams_chat_history?: {
    user: string;
    userColor: string;
    message: string;
  }[];
  description?: string;
  dependencies?: string[];
  gantt_start?: number; // Day offset
  gantt_duration?: number; // Days
}

export const useTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      if (error) throw error;
      return data as Task[];
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createTask = async (newTask: Omit<Task, 'id'>) => {
    return createTaskMutation.mutateAsync(newTask);
  };
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTask = async (id: string, updates: Partial<Task>) => {
    return updateTaskMutation.mutateAsync({ id, updates });
  };

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading || createTaskMutation.isPending || updateTaskMutation.isPending,
    error: tasksQuery.error,
    createTask,
    updateTask,
    refetch: tasksQuery.refetch,
  };
};
