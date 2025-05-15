
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import GaugeComponent from '@/components/ui/custom/Gauge';
import SparklineChart from '@/components/think/components/SparklineChart';
import { KpiData } from './types/kpi-types';

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
            {kpi.type === 'gauge' && <GaugeVisualization kpi={kpi} />}
            {kpi.type === 'grid' && <GridVisualization />}
            {kpi.type === 'sparkline' && <SparklineVisualization kpi={kpi} />}
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

// Visualization components

const GaugeVisualization: React.FC<{kpi: KpiData}> = ({ kpi }) => (
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
);

const GridVisualization: React.FC = () => (
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
);

const SparklineVisualization: React.FC<{kpi: KpiData}> = ({ kpi }) => (
  <div className="flex flex-col items-center">
    <div className="text-2xl font-bold mb-2">{kpi.value}%</div>
    {kpi.data && <SparklineChart data={kpi.data} />}
  </div>
);

export default KpiCard;
