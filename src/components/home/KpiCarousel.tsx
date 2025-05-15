
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { useKpiData } from './hooks/useKpiData';
import { useAutoplay } from './hooks/useAutoplay';
import KpiCard from './KpiCard';
import KpiCarouselSkeleton from './KpiCarouselSkeleton';

const KpiCarousel: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { kpis, loading } = useKpiData();
  const { handleMouseEnter, handleMouseLeave } = useAutoplay();

  if (loading) {
    return <KpiCarouselSkeleton />;
  }

  return (
    <div 
      className="w-full" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <GlassCard className="p-6 relative overflow-hidden" variant="deep">
        <h2 className="text-xl font-semibold mb-6">Key Performance Indicators</h2>
        
        <Carousel 
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent>
            {kpis.map((kpi) => (
              <CarouselItem key={kpi.id} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <KpiCard kpi={kpi} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:flex justify-end mt-4">
            <CarouselPrevious className="relative static transform-none mx-2" />
            <CarouselNext className="relative static transform-none mx-2" />
          </div>
        </Carousel>
        
        <MobileIndicators kpis={kpis} />
      </GlassCard>
    </div>
  );
};

const MobileIndicators: React.FC<{ kpis: Array<{id: string}> }> = ({ kpis }) => (
  <div className="flex justify-center mt-4 md:hidden space-x-2">
    {kpis.map((kpi, index) => (
      <div
        key={kpi.id}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          index === 0 ? 'bg-teal-400 w-4' : 'bg-gray-600'
        }`}
      />
    ))}
  </div>
);

export default KpiCarousel;
