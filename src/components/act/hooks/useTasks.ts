
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Define Task interface to match database schema
interface Task {
  id: string;
  title: string;
  status: 'to-do' | 'in-progress' | 'completed';
  assignee: string;
  assignee_avatar?: string | null;
  assignee_initial?: string | null;
  due_date?: string | null;
  needs_approval: boolean;
  teams_chat_history?: Json | null;
  description?: string | null;
  dependencies?: string[] | null;
  gantt_start?: number | null;
  gantt_duration?: number | null;
  bundle_id?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

// Chat message interface for type safety when working with teams_chat_history
export interface ChatMessage {
  user: string;
  userColor: string;
  message: string;
  timestamp?: string;
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
    mutationFn: async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
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

  const createTask = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
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
    isCreating: createTaskMutation.isPending,
    error: tasksQuery.error,
    createTask,
    updateTask,
    refetch: tasksQuery.refetch,
  };
};
