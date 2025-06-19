
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
      
      // Try modular schema first
      const { data, error } = await supabase
        .from('core.profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching from modular schema:', error);
        // Fallback to public schema
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (fallbackError) throw fallbackError;
        
        return {
          id: fallbackData.id,
          fullName: `${fallbackData.first_name || ''} ${fallbackData.last_name || ''}`.trim(),
          role: fallbackData.role,
          language: 'en',
          theme: 'dark',
          avatarUrl: fallbackData.avatar_url,
          department: fallbackData.department,
          zone: fallbackData.zone,
          preferences: fallbackData.preferences || {},
          createdAt: new Date(fallbackData.created_at),
          updatedAt: new Date(fallbackData.updated_at)
        } as CoreProfile;
      }
      
      return {
        id: data.id,
        fullName: data.full_name,
        role: data.role,
        language: data.language || 'en',
        theme: data.theme || 'dark',
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
