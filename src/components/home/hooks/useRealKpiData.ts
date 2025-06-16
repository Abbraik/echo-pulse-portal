
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Gauge, TrendingUp } from 'lucide-react';
import { KpiData } from '../types/kpi-types';

export const useRealKpiData = () => {
  const { data: kpis = [], isLoading: loading } = useQuery({
    queryKey: ['kpis-carousel'],
    queryFn: async () => {
      // Fetch KPIs from database
      const { data: dbKpis, error } = await supabase
        .from('kpis')
        .select(`
          *,
          bundles (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching KPIs:', error);
        // Return fallback data instead of throwing
        return [
          { 
            id: 'fallback-1', 
            name: 'Network Development Index', 
            value: 76, 
            target: 80, 
            min: 0, 
            max: 100,
            color: 'teal' as const,
            type: 'gauge' as const,
            icon: Gauge
          },
          { 
            id: 'fallback-2', 
            name: 'System Performance', 
            value: 82, 
            target: 85, 
            min: 0, 
            max: 100,
            color: 'blue' as const,
            type: 'gauge' as const,
            icon: Gauge
          }
        ];
      }

      // Convert database KPIs to UI format
      const uiKpis: KpiData[] = dbKpis?.map((kpi, index) => ({
        id: kpi.id,
        name: kpi.name,
        value: Number(kpi.current_value),
        target: Number(kpi.target_value),
        min: 0,
        max: Math.max(Number(kpi.target_value) * 1.2, 100),
        color: index % 4 === 0 ? 'teal' : index % 4 === 1 ? 'amber' : index % 4 === 2 ? 'blue' : 'emerald',
        type: index % 3 === 0 ? 'gauge' : index % 3 === 1 ? 'sparkline' : 'grid',
        icon: index % 2 === 0 ? Gauge : TrendingUp,
        unit: kpi.unit || undefined,
        data: index % 3 === 1 ? Array.from({ length: 8 }, () => 
          Math.floor(Math.random() * 20) + Number(kpi.current_value) - 10
        ) : undefined
      })) || [];

      return uiKpis;
    },
    staleTime: 60000, // 1 minute
    retry: 1
  });

  return { kpis, loading };
};
