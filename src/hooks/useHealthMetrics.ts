
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { HealthMetric, ZoneName } from '@/types/database';

export const useHealthMetrics = (zone?: ZoneName) => {
  return useQuery({
    queryKey: ['health-metrics', zone],
    queryFn: async () => {
      let query = supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (zone) {
        query = query.eq('zone', zone);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database fields to TypeScript interface
      return data?.map(row => ({
        id: row.id,
        name: row.name,
        zone: row.zone,
        value: row.value,
        target: row.target,
        timestamp: new Date(row.timestamp),
        createdAt: new Date(row.created_at)
      })) as HealthMetric[];
    },
  });
};

export const useLatestHealthMetrics = () => {
  return useQuery({
    queryKey: ['health-metrics-latest'],
    queryFn: async () => {
      // Get the latest metric for each name/zone combination
      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      // Group by name and zone to get latest values
      const latest = new Map();
      data?.forEach((row) => {
        const key = `${row.name}-${row.zone}`;
        if (!latest.has(key)) {
          latest.set(key, {
            id: row.id,
            name: row.name,
            zone: row.zone,
            value: row.value,
            target: row.target,
            timestamp: new Date(row.timestamp),
            createdAt: new Date(row.created_at)
          });
        }
      });
      
      return Array.from(latest.values()) as HealthMetric[];
    },
  });
};

export const useHealthMetricHistory = (metricId: string, range: string = '30d') => {
  return useQuery({
    queryKey: ['health-metric-history', metricId, range],
    queryFn: async () => {
      const daysBack = parseInt(range.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      const { data, error } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('id', metricId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      return data?.map(row => ({
        id: row.id,
        name: row.name,
        zone: row.zone,
        value: row.value,
        target: row.target,
        timestamp: new Date(row.timestamp),
        createdAt: new Date(row.created_at)
      })) as HealthMetric[];
    },
  });
};
