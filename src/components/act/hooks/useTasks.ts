
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  bundle_id?: string;
  title: string;
  description?: string;
  status: 'to-do' | 'in-progress' | 'completed';
  assignee: string;
  assignee_avatar?: string;
  assignee_initial?: string;
  due_date?: string;
  needs_approval: boolean;
  teams_chat_history?: any[];
  dependencies?: string[];
  gantt_start?: number;
  gantt_duration?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface CreateTaskData {
  bundle_id?: string;
  title: string;
  description?: string;
  status?: 'to-do' | 'in-progress' | 'completed';
  assignee: string;
  assignee_avatar?: string;
  assignee_initial?: string;
  due_date?: string;
  needs_approval?: boolean;
  gantt_start?: number;
  gantt_duration?: number;
}

export const useTasks = (bundleId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', bundleId],
    queryFn: async () => {
      let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
      
      if (bundleId) {
        query = query.eq('bundle_id', bundleId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Task[];
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: CreateTaskData) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Created",
        description: "Task has been successfully created.",
      });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, updates }: { taskId: string; updates: Partial<CreateTaskData> }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Updated",
        description: "Task has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Deleted",
        description: "Task has been successfully deleted.",
      });
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};
