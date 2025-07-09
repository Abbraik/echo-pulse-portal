import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ThinkContextPanel } from './ThinkContextPanel';
import { ActContextPanel } from './ActContextPanel';
import { MonitorContextPanel } from './MonitorContextPanel';
import { LearnContextPanel } from './LearnContextPanel';
import { InnovateContextPanel } from './InnovateContextPanel';

const contextComponents = {
  THINK: ThinkContextPanel,
  ACT: ActContextPanel,
  MONITOR: MonitorContextPanel,
  LEARN: LearnContextPanel,
  INNOVATE: InnovateContextPanel,
} as const;

type ZoneKey = keyof typeof contextComponents;

interface DynamicContextLoaderProps {
  originZone: string;
  entityId: string;
}

export const DynamicContextLoader: React.FC<DynamicContextLoaderProps> = ({
  originZone,
  entityId
}) => {
  const ZonePanel = contextComponents[originZone as ZoneKey];
  
  if (!ZonePanel) {
    return (
      <div className="glass-card p-4 text-center">
        <p className="text-muted-foreground">
          Context panel not available for zone: {originZone}
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="glass-card p-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
          <span className="ml-2 text-muted-foreground">Loading context...</span>
        </div>
      }
    >
      <ZonePanel entityId={entityId} />
    </Suspense>
  );
};