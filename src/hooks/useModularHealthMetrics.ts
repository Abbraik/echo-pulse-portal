
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MonitorHealthMetric } from '@/types/monitor';
import { useToast } from '@/components/ui/use-toast';

export const useModularHealthMetrics = (zone?: string) => {
  return useQuery({
    queryKey: ['modular-health-metrics', zone],
    queryFn: async () => {
      let query = supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (zone) {
        query = query.eq('zone', zone as any);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching health metrics:', error);
        throw error;
      }
      
      return data?.map(row => ({
        id: row.id,
        runId: null,
        zone: row.zone,
        indicator: 'HEALTH',
        name: row.name,
        value: row.value,
        target: row.target,
        unit: null,
        measurementType: 'point' as const,
        timestamp: new Date(row.timestamp),
        metadata: {},
        createdAt: new Date(row.created_at)
      })) as MonitorHealthMetric[];
    },
  });
};

export const useModularHealthMetricActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createHealthMetric = useMutation({
    mutationFn: async (metricData: Partial<MonitorHealthMetric>) => {
      const metricRecord = {
        zone: metricData.zone as any,
        name: metricData.name!,
        value: metricData.value!,
        target: metricData.target
      };
      
      const { data, error } = await supabase
        .from('health_metrics')
        .insert(metricRecord)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modular-health-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
      toast({ title: "Health metric created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create health metric", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return { createHealthMetric };
};
