import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AcronymTooltipProps {
  acronym: string;
  definition: string;
  children: React.ReactNode;
}

export const AcronymTooltip: React.FC<AcronymTooltipProps> = ({ 
  acronym, 
  definition, 
  children 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted decoration-muted-foreground cursor-help">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="glass-panel-dark max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold text-primary">{acronym}</p>
            <p className="text-sm text-muted-foreground">{definition}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Predefined acronym definitions
export const acronymDefinitions = {
  TRI: "System Resilience Index - measures loop stability",
  SRT: "Sprint Response Time - delivery window metric", 
  LAM: "Loop Adjustment Mechanism - auto-tuning system",
  "DE-Band": "Dynamic Equilibrium Band - healthy operating range",
  ORS: "Operational Response System - execution framework",
  REL: "Resilience Enhancement Logic - improvement recommendations"
};

// Convenience component for common acronyms
export const TRI: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AcronymTooltip acronym="TRI" definition={acronymDefinitions.TRI}>
    {children || 'TRI'}
  </AcronymTooltip>
);

export const SRT: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AcronymTooltip acronym="SRT" definition={acronymDefinitions.SRT}>
    {children || 'SRT'}
  </AcronymTooltip>
);

export const LAM: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AcronymTooltip acronym="LAM" definition={acronymDefinitions.LAM}>
    {children || 'LAM'}
  </AcronymTooltip>
);

export const DEBand: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AcronymTooltip acronym="DE-Band" definition={acronymDefinitions["DE-Band"]}>
    {children || 'DE-Band'}
  </AcronymTooltip>
);

export const ORS: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AcronymTooltip acronym="ORS" definition={acronymDefinitions.ORS}>
    {children || 'ORS'}
  </AcronymTooltip>
);

export const REL: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AcronymTooltip acronym="REL+" definition={acronymDefinitions.REL}>
    {children || 'REL+'}
  </AcronymTooltip>
);