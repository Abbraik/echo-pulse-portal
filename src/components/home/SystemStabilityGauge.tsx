
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ActivityIcon } from "lucide-react";
import { PulseData } from "@/api/dashboard";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { useTranslation } from "@/hooks/use-translation";
import Gauge from '@/components/ui/custom/Gauge';

interface SystemStabilityGaugeProps {
  pulse: PulseData | null;
}

const SystemStabilityGauge: React.FC<SystemStabilityGaugeProps> = ({ pulse }) => {
  const { t } = useTranslation();
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Animate gauge value on load
  useEffect(() => {
    if (pulse?.stability) {
      const timer = setTimeout(() => {
        setAnimatedValue(pulse.stability);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pulse?.stability]);
  
  const getStabilityLabel = (value: number) => {
    if (value < 30) return "Unstable";
    if (value < 70) return "Cautious";
    return "Equilibrium";
  };

  return (
    <ParallaxCard className="h-full">
      <GlassCard className="h-full" variant="deep">
        <GlassCardHeader>
          <div className="flex items-center">
            <ActivityIcon className="h-5 w-5 mr-2 text-teal-400" />
            <GlassCardTitle gradient>{t('systemStabilityGauge')}</GlassCardTitle>
          </div>
        </GlassCardHeader>
        <GlassCardContent className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* 3D effect elements - soft shadows and highlights */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-teal-500/5 rounded-full blur-lg"></div>
            
            {/* Main gauge component */}
            <Gauge 
              value={animatedValue} 
              min={0} 
              max={100}
              size="xl"
              color={animatedValue > 70 ? "teal" : animatedValue > 30 ? "gold" : "rose"}
              label={getStabilityLabel(animatedValue)}
              showValue={true}
            />
            
            {/* Pulse rings - animate when out of equilibrium */}
            {animatedValue < 70 && (
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(20, 184, 166, 0)',
                    '0 0 0 10px rgba(20, 184, 166, 0.1)',
                    '0 0 0 20px rgba(20, 184, 166, 0)',
                  ]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2.5
                }}
              />
            )}
          </div>
          
          <p className="mt-6 text-center text-muted-foreground text-sm">
            {pulse?.status || t('systemStatusSummary')}
          </p>
          
          {/* Equilibrium bands visualization */}
          <div className="mt-6 w-full max-w-sm flex justify-between">
            <div className="text-xs text-rose-500">Unstable</div>
            <div className="text-xs text-gold-400">Cautious</div>
            <div className="text-xs text-teal-500">Equilibrium</div>
          </div>
          <div className="mt-1 w-full max-w-sm h-1.5 rounded-full bg-gray-700/30 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 via-gold-400 to-teal-500" style={{ width: '100%' }}></div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </ParallaxCard>
  );
};

export default SystemStabilityGauge;
