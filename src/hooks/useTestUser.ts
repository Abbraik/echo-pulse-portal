
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook to create a test user profile for development
export const useTestUser = () => {
  useEffect(() => {
    const createTestProfile = async () => {
      try {
        // Check if we have a current user session
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (!existingProfile) {
            // Create profile for current user
            const { error } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email || 'director@example.com',
                first_name: 'Test',
                last_name: 'Director',
                role: 'director_general',
                department: 'Executive Office',
                zone: 'EXECUTIVE'
              });
            
            if (error) {
              console.log('Profile creation note:', error.message);
            } else {
              console.log('Test profile created successfully');
            }
          }
        } else {
          // For development, we can work without auth temporarily
          console.log('No authenticated user - working in development mode');
        }
      } catch (error) {
        console.log('Test user setup note:', error);
      }
    };

    createTestProfile();
  }, []);
};
