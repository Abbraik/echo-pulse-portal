
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
        fullName: data.full_name,
        role: data.role,
        language: data.language,
        theme: data.theme,
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
      
      // Ensure user exists in core.users
      await supabase
        .from('users')
        .upsert({ id: user.id, email: user.email || '' }, { onConflict: 'id' });
      
      // Update or create profile
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: updates.fullName,
          role: updates.role || 'director_general',
          language: updates.language || 'en',
          theme: updates.theme || 'dark',
          avatar_url: updates.avatarUrl,
          department: updates.department,
          zone: updates.zone,
          preferences: updates.preferences || {}
        }, { onConflict: 'id' })
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
