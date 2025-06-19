
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CoreProfile } from '@/types/core';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

export const useModularCurrentProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['modular-current-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return {
        id: data.id,
        fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        role: data.role,
        language: 'en',
        theme: 'dark',
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
