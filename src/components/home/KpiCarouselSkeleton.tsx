
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from "@/components/ui/skeleton";

const KpiCarouselSkeleton: React.FC = () => (
  <div className="w-full">
    <GlassCard className="animate-pulse p-6 h-64">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-32 h-4" />
      </div>
    </GlassCard>
  </div>
);

export default KpiCarouselSkeleton;
