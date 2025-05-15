
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Gauge, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import GaugeComponent from '@/components/ui/custom/Gauge';
import SparklineChart from '@/components/think/components/SparklineChart';

interface KpiData {
  id: string;
  name: string;
  value: number;
  target: number;
  min: number;
  max: number;
  color: string;
  type: 'gauge' | 'grid' | 'sparkline';
  icon: React.ElementType;
  data?: number[];
}

const KpiCarousel: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [kpis, setKpis] = useState<KpiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

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

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (autoplay) {
      interval = setInterval(() => {
        // Auto-rotate logic would go here if we weren't using the Carousel component
        // which handles this internally
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay]);

  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  if (loading) {
    return (
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
        
        {/* Indicator dots for mobile */}
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
      </GlassCard>
    </div>
  );
};

interface KpiCardProps {
  kpi: KpiData;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const { t } = useTranslation();
  const Icon = kpi.icon;
  
  return (
    <GlassCard className="h-full rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-white/10">
      <AspectRatio ratio={4/3}>
        <GlassCardContent className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-base">{kpi.name}</h3>
            <Icon className={`h-5 w-5 text-${kpi.color}-400`} />
          </div>
          
          <div className="flex-grow flex items-center justify-center py-2">
            {kpi.type === 'gauge' && (
              <div className="flex flex-col items-center">
                <GaugeComponent 
                  value={kpi.value} 
                  min={kpi.min} 
                  max={kpi.max}
                  size="md"
                  color={kpi.color}
                  showValue={true}
                />
              </div>
            )}
            
            {kpi.type === 'grid' && (
              <div className="grid grid-cols-4 gap-1 w-full max-w-[120px]">
                {Array.from({ length: 16 }).map((_, i) => {
                  // Calculate a value between 0 and 1 for each cell
                  const cellValue = 0.3 + (Math.sin(i * 0.5) + 1) / 2 * 0.7;
                  return (
                    <div 
                      key={i}
                      className="aspect-square rounded-sm"
                      style={{ 
                        backgroundColor: `rgba(59, 130, 246, ${cellValue})`,
                        transform: `scale(${0.8 + cellValue * 0.2})` 
                      }}
                    />
                  );
                })}
              </div>
            )}
            
            {kpi.type === 'sparkline' && (
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold mb-2">{kpi.value}%</div>
                {kpi.data && <SparklineChart data={kpi.data} />}
              </div>
            )}
          </div>
          
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs hover:bg-white/10 w-full justify-between"
            >
              <span>View Details</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </GlassCardContent>
      </AspectRatio>
    </GlassCard>
  );
};

export default KpiCarousel;
