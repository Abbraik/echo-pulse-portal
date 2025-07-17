import React from 'react';
import { Badge } from '@/components/ui/badge';
import { REL } from '@/components/ui/acronym-tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DEBandBadgeProps {
  status: 'healthy' | 'warning' | 'critical';
  relRecommendation?: string;
}

export const DEBandBadge: React.FC<DEBandBadgeProps> = ({ 
  status, 
  relRecommendation = "Optimize feedback loops for better stability" 
}) => {
  const getBadgeVariant = () => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getBadgeColor = () => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return '';
    }
  };

  const getStatusEmoji = () => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getBadgeVariant()}
            className={`cursor-help text-xs px-2 py-1 ${getBadgeColor()}`}
          >
            <span className="mr-1" role="img" aria-label={`${status} status`}>
              {getStatusEmoji()}
            </span>
            DE-Band
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="glass-panel-dark max-w-xs">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">
              <REL /> Recommendation
            </p>
            <p className="text-xs text-muted-foreground">
              {relRecommendation}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};