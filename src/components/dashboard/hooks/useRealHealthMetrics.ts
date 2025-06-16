
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealHealthMetrics = () => {
  return useQuery({
    queryKey: ['health-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching health metrics:', error);
        // Return fallback data
        return {
          THINK: [{ name: 'Analysis Quality', value: 78, target: 85 }],
          ACT: [{ name: 'Bundle Delivery', value: 65, target: 80 }],
          LEARN: [{ name: 'Knowledge Capture', value: 88, target: 90 }],
          INNOVATE: [{ name: 'Innovation Rate', value: 42, target: 60 }],
          MONITOR: [{ name: 'System Stability', value: 92, target: 95 }]
        };
      }

      // Group metrics by zone
      const groupedMetrics = data?.reduce((acc, metric) => {
        if (!acc[metric.zone]) {
          acc[metric.zone] = [];
        }
        acc[metric.zone].push({
          name: metric.name,
          value: Number(metric.value),
          target: Number(metric.target) || undefined
        });
        return acc;
      }, {} as Record<string, Array<{ name: string; value: number; target?: number }>>);

      return groupedMetrics || {};
    },
    staleTime: 30000, // 30 seconds
    retry: 1
  });
};
