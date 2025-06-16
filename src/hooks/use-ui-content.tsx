
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UIContent {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  page?: string;
  component?: string;
}

interface UseUIContentReturn {
  content: Record<string, string>;
  loading: boolean;
  error: string | null;
  getContent: (key: string, fallback?: string) => string;
  refreshContent: () => Promise<void>;
}

export const useUIContent = (page?: string, category?: string): UseUIContentReturn => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('ui_content').select('*');
      
      if (page) {
        query = query.or(`page.eq.${page},page.eq.global`);
      }
      
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      const contentMap: Record<string, string> = {};
      data?.forEach((item: UIContent) => {
        contentMap[item.key] = item.value;
      });

      setContent(contentMap);
    } catch (err) {
      console.error('Error fetching UI content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const getContent = (key: string, fallback: string = key): string => {
    return content[key] || fallback;
  };

  const refreshContent = async () => {
    await fetchContent();
  };

  useEffect(() => {
    fetchContent();
  }, [page, category]);

  return {
    content,
    loading,
    error,
    getContent,
    refreshContent
  };
};
