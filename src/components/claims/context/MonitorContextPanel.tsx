import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MonitorContextPanelProps {
  entityId: string;
}

export const MonitorContextPanel: React.FC<MonitorContextPanelProps> = ({ entityId }) => {
  const { data: anomaly, isLoading } = useQuery({
    queryKey: ['monitor-context', entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anomalies')
        .select('*')
        .eq('id', entityId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="glass-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded" />
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!anomaly) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-muted-foreground">Anomaly not found</p>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-300';
      case 'medium':
        return 'bg-orange-500/20 text-orange-300';
      case 'low':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-5 w-5 text-orange-400" />
        <h4 className="font-medium text-foreground">Monitor Zone Context</h4>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-400" />
          <Badge className={getSeverityColor(anomaly.severity)}>
            {anomaly.severity} severity
          </Badge>
          {anomaly.acknowledged && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              Acknowledged
            </Badge>
          )}
        </div>

        {anomaly.details && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1">Details</h5>
            <p className="text-sm text-muted-foreground">{anomaly.details}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Detected:</span>
            <p className="text-foreground">
              {anomaly.detected_at ? new Date(anomaly.detected_at).toLocaleString() : 'Unknown'}
            </p>
          </div>
          
          {anomaly.acknowledged_at && (
            <div>
              <span className="text-muted-foreground">Acknowledged:</span>
              <p className="text-foreground">
                {new Date(anomaly.acknowledged_at).toLocaleString()}
              </p>
            </div>
          )}
          
          {anomaly.resolved && anomaly.resolved_at && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Resolved:</span>
              <p className="text-green-300">
                {new Date(anomaly.resolved_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {anomaly.metric_id && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Related Metric
            </h5>
            <p className="text-xs text-muted-foreground font-mono">
              {anomaly.metric_id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};