import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Brain, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ThinkContextPanelProps {
  entityId: string;
}

export const ThinkContextPanel: React.FC<ThinkContextPanelProps> = ({ entityId }) => {
  const { data: scenario, isLoading } = useQuery({
    queryKey: ['think-context', entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scenarios')
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

  if (!scenario) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-muted-foreground">Scenario not found</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-5 w-5 text-purple-400" />
        <h4 className="font-medium text-foreground">Think Zone Context</h4>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-foreground mb-1">Scenario</h5>
          <p className="text-sm text-muted-foreground">{scenario.name}</p>
          {scenario.description && (
            <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
          )}
        </div>

        {scenario.is_baseline && (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            Baseline Scenario
          </Badge>
        )}

        {scenario.parameters && Object.keys(scenario.parameters).length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-2">Parameters</h5>
            <div className="space-y-1">
              {Object.entries(scenario.parameters).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-foreground">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {scenario.results && Object.keys(scenario.results).length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Results Preview
            </h5>
            <div className="space-y-1">
              {Object.entries(scenario.results).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-green-300">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};