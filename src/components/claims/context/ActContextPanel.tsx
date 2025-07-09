import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Target, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActContextPanelProps {
  entityId: string;
}

export const ActContextPanel: React.FC<ActContextPanelProps> = ({ entityId }) => {
  const { data: bundle, isLoading } = useQuery({
    queryKey: ['act-context', entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bundles')
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

  if (!bundle) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-muted-foreground">Bundle not found</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="h-5 w-5 text-teal-400" />
        <h4 className="font-medium text-foreground">Act Zone Context</h4>
      </div>

      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-medium text-foreground mb-1">Bundle</h5>
          <p className="text-sm text-muted-foreground">{bundle.name}</p>
          {bundle.summary && (
            <p className="text-xs text-muted-foreground mt-1">{bundle.summary}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge 
            variant={bundle.status === 'active' ? 'default' : 'secondary'}
            className={bundle.status === 'active' ? 'bg-teal-500/20 text-teal-300' : ''}
          >
            {bundle.status}
          </Badge>
          {bundle.is_approved && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              Approved
            </Badge>
          )}
        </div>

        {bundle.coherence && (
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Coherence:</span>
            <span className="text-sm text-foreground font-medium">{bundle.coherence}%</span>
          </div>
        )}

        {bundle.objectives && bundle.objectives.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-2">Objectives</h5>
            <div className="space-y-1">
              {bundle.objectives.slice(0, 3).map((objective: string, index: number) => (
                <div key={index} className="text-xs text-muted-foreground">
                  • {objective}
                </div>
              ))}
              {bundle.objectives.length > 3 && (
                <div className="text-xs text-muted-foreground italic">
                  +{bundle.objectives.length - 3} more objectives
                </div>
              )}
            </div>
          </div>
        )}

        {bundle.leverage_points && Array.isArray(bundle.leverage_points) && bundle.leverage_points.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-foreground mb-2">Leverage Points</h5>
            <div className="flex flex-wrap gap-1">
              {bundle.leverage_points.slice(0, 3).map((point: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {point}
                </Badge>
              ))}
              {bundle.leverage_points.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{bundle.leverage_points.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};