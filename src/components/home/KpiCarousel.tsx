
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
import { useRealKpiData } from './hooks/useRealKpiData';
import { useAutoplay } from './hooks/useAutoplay';
import KpiCard from './KpiCard';
import KpiCarouselSkeleton from './KpiCarouselSkeleton';

const KpiCarousel: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const { kpis, loading } = useRealKpiData();
  const { handleMouseEnter, handleMouseLeave } = useAutoplay();

  if (loading) {
    return <KpiCarouselSkeleton />;
  }

  return (
    <div 
      className="w-full h-full" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <GlassCard className="p-6 relative overflow-hidden h-full" variant="deep">
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-6 text-white">Key Performance Indicators</h2>
          
          <div className="flex-1">
            <Carousel 
              className="w-full h-full"
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent className="h-full">
                {kpis.map((kpi) => (
                  <CarouselItem key={kpi.id} className="md:basis-1/2 lg:basis-1/2 h-full">
                    <div className="p-1 h-full">
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
          </div>
          
          <MobileIndicators kpis={kpis} />
        </div>
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
