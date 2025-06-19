
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MonitorHealthMetric } from '@/types/monitor';
import { useToast } from '@/components/ui/use-toast';

export const useNewHealthMetrics = (zone?: string) => {
  return useQuery({
    queryKey: ['new-health-metrics', zone],
    queryFn: async () => {
      let query = supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (zone) {
        query = query.eq('zone', zone as any);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data?.map(row => ({
        id: row.id,
        runId: null, // Not available in current schema
        zone: row.zone,
        indicator: 'HEALTH', // Default value since not in current schema
        name: row.name,
        value: row.value,
        target: row.target,
        unit: null, // Not available in current schema
        measurementType: 'point' as const,
        timestamp: new Date(row.timestamp),
        metadata: {},
        createdAt: new Date(row.created_at)
      })) as MonitorHealthMetric[];
    },
  });
};

export const useLatestNewHealthMetrics = () => {
  return useQuery({
    queryKey: ['new-health-metrics-latest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      const latest = new Map();
      data?.forEach((row) => {
        const key = `${row.name}-${row.zone}`;
        if (!latest.has(key)) {
          latest.set(key, {
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
          });
        }
      });
      
      return Array.from(latest.values()) as MonitorHealthMetric[];
    },
  });
};

export const useHealthMetricActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createHealthMetric = useMutation({
    mutationFn: async (metricData: Partial<MonitorHealthMetric>) => {
      const { data, error } = await supabase
        .from('health_metrics')
        .insert({
          zone: metricData.zone as any,
          name: metricData.name!,
          value: metricData.value!,
          target: metricData.target
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-health-metrics'] });
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
