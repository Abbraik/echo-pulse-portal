
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { TrendingDown, MessageCircle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

interface AnomalyDetectorProps {
  onViewAnomaly?: (id: number) => void;
}

export const AnomalyDetector: React.FC<AnomalyDetectorProps> = ({ onViewAnomaly }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  
  // Mock anomaly data
  const anomalies = [
    {
      id: 1,
      title: 'Social Trust',
      change: '-3.5%',
      date: '2025-05-18',
      description: 'Unexpected drop in Social Trust index across northern Emirates'
    },
    {
      id: 2,
      title: 'Water Resources',
      change: '-2.8%',
      date: '2025-05-17',
      description: 'Decreasing water availability trend in agricultural regions'
    },
    {
      id: 3,
      title: 'Economic Activity',
      change: '+4.2%',
      date: '2025-05-16',
      description: 'Unusual spike in economic activity in coastal regions'
    }
  ];
  
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle AI query
    console.log('Submitted query:', query);
    setQuery('');
  };
  
  const handleInvestigate = (anomalyId: number) => {
    if (onViewAnomaly) {
      onViewAnomaly(anomalyId);
    }
  };
  
  return (
    <GlassCard className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-left flex items-center">
          <TrendingDown className="mr-2 text-amber-400" size={18} />
          {t('anomalyDetector')}
        </h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {anomalies.map((anomaly) => (
            <CarouselItem key={anomaly.id}>
              <div className="border border-white/10 rounded-lg p-4 bg-gradient-to-br from-transparent to-amber-950/20">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{anomaly.title}</h3>
                  <span className="text-red-400 font-semibold">{anomaly.change}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{anomaly.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{anomaly.date}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
                    onClick={() => handleInvestigate(anomaly.id)}
                  >
                    {t('investigate')}
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* AI Query Box */}
      <form onSubmit={handleQuerySubmit} className="mt-6">
        <div className="relative">
          <Input 
            className="bg-white/5 border-white/10 pl-10 pr-36" 
            placeholder={t('askAboutAnomalies')}
            value={query}
            onChange={handleQueryChange}
          />
          <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Button 
            type="submit"
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-teal-400 hover:text-teal-300"
          >
            {t('askAi')}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};
