
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoreProfile } from '@/types/core';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useCurrentProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['current-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        role: data.role,
        language: 'en', // Default since not in current schema
        theme: 'dark', // Default since not in current schema
        avatarUrl: data.avatar_url,
        department: data.department,
        zone: data.zone,
        preferences: data.preferences || {},
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } as CoreProfile;
    },
    enabled: !!user,
  });
};

export const useProfileActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<CoreProfile>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: updates.fullName?.split(' ')[0],
          last_name: updates.fullName?.split(' ').slice(1).join(' '),
          avatar_url: updates.avatarUrl,
          department: updates.department,
          zone: updates.zone,
          preferences: updates.preferences || {}
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-profile'] });
      toast({ title: "Profile updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update profile", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return { updateProfile };
};
