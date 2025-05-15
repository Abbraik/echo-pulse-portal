
import { useState, useEffect } from 'react';
import { Gauge, TrendingUp } from 'lucide-react';
import { KpiData } from '../types/kpi-types';

export const useKpiData = () => {
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setKpis([
        { 
          id: '1', 
          name: 'Network Development Index', 
          value: 76, 
          target: 80, 
          min: 0, 
          max: 100,
          color: 'teal',
          type: 'gauge',
          icon: Gauge
        },
        { 
          id: '2', 
          name: 'Trust Recovery Index', 
          value: 45, 
          target: 60, 
          min: 0, 
          max: 100,
          color: 'amber',
          type: 'gauge',
          icon: Gauge
        },
        { 
          id: '3', 
          name: 'Average Bundle Coherence', 
          value: 82, 
          target: 75, 
          min: 0, 
          max: 100,
          color: 'blue',
          type: 'grid',
          icon: Gauge
        },
        { 
          id: '4', 
          name: 'Pilot Success Rate', 
          value: 73, 
          target: 70, 
          min: 0, 
          max: 100,
          color: 'emerald',
          type: 'sparkline',
          icon: TrendingUp,
          data: [65, 68, 62, 70, 75, 73, 77, 73]
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return { kpis, loading };
};
