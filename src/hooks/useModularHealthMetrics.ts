
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MonitorHealthMetric } from '@/types/monitor';
import { useToast } from '@/components/ui/use-toast';

export const useModularHealthMetrics = (zone?: string) => {
  return useQuery({
    queryKey: ['modular-health-metrics', zone],
    queryFn: async () => {
      let query = supabase
        .from('monitor.health_metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (zone) {
        query = query.eq('zone', zone as any);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching from modular schema:', error);
        // Fallback to public schema
        let fallbackQuery = supabase
          .from('health_metrics')
          .select('*')
          .order('timestamp', { ascending: false });

        if (zone) {
          fallbackQuery = fallbackQuery.eq('zone', zone as any);
        }

        const { data: fallbackData, error: fallbackError } = await fallbackQuery;
        if (fallbackError) throw fallbackError;
        
        return fallbackData?.map(row => ({
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
      }
      
      return data?.map(row => ({
        id: row.id,
        runId: row.run_id,
        zone: row.zone,
        indicator: row.indicator,
        name: row.name,
        value: row.value,
        target: row.target,
        unit: row.unit,
        measurementType: row.measurement_type as 'point' | 'cumulative' | 'average',
        timestamp: new Date(row.timestamp),
        metadata: row.metadata || {},
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
      // Try modular schema first
      let query = supabase.from('monitor.health_metrics');
      let fallbackQuery = supabase.from('health_metrics');
      
      const metricRecord = {
        zone: metricData.zone as any,
        indicator: metricData.indicator!,
        name: metricData.name!,
        value: metricData.value!,
        target: metricData.target,
        unit: metricData.unit,
        measurement_type: metricData.measurementType,
        metadata: metricData.metadata || {}
      };
      
      const { data, error } = await query.insert(metricRecord).select().single();
      
      if (error) {
        // Fallback to public schema
        const { data: fallbackData, error: fallbackError } = await fallbackQuery
          .insert({
            zone: metricData.zone as any,
            name: metricData.name!,
            value: metricData.value!,
            target: metricData.target
          })
          .select()
          .single();
        
        if (fallbackError) throw fallbackError;
        return fallbackData;
      }
      
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
