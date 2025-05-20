
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { ArrowDown, ArrowUp, X } from 'lucide-react';

interface SubIndicator {
  name: string;
  value: number;
  trend: number[];
}

interface Pillar {
  value: number;
  subIndicators: SubIndicator[];
}

interface Pillars {
  population: Pillar;
  resources: Pillar;
  goods: Pillar;
  social: Pillar;
}

interface EquilibriumBands {
  overall: { min: number; max: number };
  population: { min: number; max: number };
  resources: { min: number; max: number };
  goods: { min: number; max: number };
  social: { min: number; max: number };
}

interface PillarBreakoutsProps {
  pillars: Pillars;
  equilibriumBands: EquilibriumBands;
}

const PillarBreakouts: React.FC<PillarBreakoutsProps> = ({
  pillars,
  equilibriumBands
}) => {
  const { t } = useTranslation();
  const [activePillar, setActivePillar] = useState<keyof Pillars | null>(null);
  
  // Render a mini sparkline chart
  const renderSparkline = (data: number[], color: string = 'bg-teal-500') => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end h-4 space-x-0.5">
        {data.map((value, i) => (
          <div 
            key={i}
            className={`w-0.5 ${color}`}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '15%',
            }}
          />
        ))}
      </div>
    );
  };
  
  // Function to determine if a value is within equilibrium
  const isInEquilibrium = (value: number, pillarKey: keyof Pillars) => {
    const band = equilibriumBands[pillarKey];
    return value >= band.min && value <= band.max;
  };
  
  // Get trend direction based on the last two values
  const getTrendDirection = (trend: number[]) => {
    if (trend.length < 2) return 'stable';
    const lastValue = trend[trend.length - 1];
    const prevValue = trend[trend.length - 2];
    if (lastValue > prevValue) return 'up';
    if (lastValue < prevValue) return 'down';
    return 'stable';
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Population Pillar */}
      <PillarCard
        title={t("populationPillar")}
        value={pillars.population.value}
        subIndicators={pillars.population.subIndicators}
        inEquilibrium={isInEquilibrium(pillars.population.value, 'population')}
        band={equilibriumBands.population}
        onClick={() => setActivePillar('population')}
      />
      
      {/* Resources Pillar */}
      <PillarCard
        title={t("resourcesPillar")}
        value={pillars.resources.value}
        subIndicators={pillars.resources.subIndicators}
        inEquilibrium={isInEquilibrium(pillars.resources.value, 'resources')}
        band={equilibriumBands.resources}
        onClick={() => setActivePillar('resources')}
      />
      
      {/* Goods & Services Pillar */}
      <PillarCard
        title={t("goodsPillar")}
        value={pillars.goods.value}
        subIndicators={pillars.goods.subIndicators}
        inEquilibrium={isInEquilibrium(pillars.goods.value, 'goods')}
        band={equilibriumBands.goods}
        onClick={() => setActivePillar('goods')}
      />
      
      {/* Social Outcomes Pillar */}
      <PillarCard
        title={t("socialPillar")}
        value={pillars.social.value}
        subIndicators={pillars.social.subIndicators}
        inEquilibrium={isInEquilibrium(pillars.social.value, 'social')}
        band={equilibriumBands.social}
        onClick={() => setActivePillar('social')}
      />
      
      {/* Detailed Pillar Panel */}
      <AnimatePresence>
        {activePillar && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePillar(null)}
          >
            <motion.div
              className="glass-panel-deep p-6 w-full max-w-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">
                  {activePillar === 'population' && t("populationPillar")}
                  {activePillar === 'resources' && t("resourcesPillar")}
                  {activePillar === 'goods' && t("goodsPillar")}
                  {activePillar === 'social' && t("socialPillar")}
                </h3>
                <button 
                  className="p-2 hover:bg-white/10 rounded-full"
                  onClick={() => setActivePillar(null)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-medium">{t("indicator")}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{t("value")}</span>
                    <span className="font-medium w-16 text-center">{t("trend")}</span>
                  </div>
                </div>
                {pillars[activePillar].subIndicators.map((indicator, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <span className="text-sm">{indicator.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-mono">
                        {typeof indicator.value === 'number' && indicator.value % 1 === 0 
                          ? indicator.value 
                          : indicator.value.toFixed(1)}
                      </span>
                      <div className="w-16 flex items-center justify-center">
                        {renderSparkline(
                          indicator.trend, 
                          getTrendDirection(indicator.trend) === 'up' 
                            ? 'bg-teal-500' 
                            : getTrendDirection(indicator.trend) === 'down' 
                              ? 'bg-red-500' 
                              : 'bg-gray-500'
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual Pillar Card Component
interface PillarCardProps {
  title: string;
  value: number;
  subIndicators: SubIndicator[];
  inEquilibrium: boolean;
  band: { min: number; max: number };
  onClick: () => void;
}

const PillarCard: React.FC<PillarCardProps> = ({
  title,
  value,
  subIndicators,
  inEquilibrium,
  band,
  onClick
}) => {
  const { t } = useTranslation();
  
  // Get trend for the first 3 sub-indicators (or fewer if less exist)
  const topSubIndicators = subIndicators.slice(0, 3);
  
  return (
    <motion.div
      className="glass-panel-dark p-4 cursor-pointer hover:ring-1 hover:ring-teal-500/30 transition-shadow"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{title}</h3>
        <div className={`text-2xl font-bold ${
          inEquilibrium ? 'text-teal-400' : 'text-yellow-400'
        }`}>
          {value}%
        </div>
      </div>
      
      <div className={`text-xs px-2 py-0.5 rounded-full inline-block mb-3 ${
        inEquilibrium 
          ? 'bg-teal-500/20 text-teal-400' 
          : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {inEquilibrium 
          ? t("inBalance") 
          : `${value < band.min ? t("below") : t("above")} ${t("equilibrium")}`}
      </div>
      
      <div className="space-y-2 mt-3">
        {topSubIndicators.map((indicator, idx) => {
          const trend = getTrendDirection(indicator.trend);
          
          return (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="text-gray-400">{indicator.name}</span>
              <div className="flex items-center gap-1">
                <span>{typeof indicator.value === 'number' && indicator.value % 1 === 0 
                  ? indicator.value 
                  : indicator.value.toFixed(1)}
                </span>
                {trend === 'up' && <ArrowUp size={12} className="text-teal-400" />}
                {trend === 'down' && <ArrowDown size={12} className="text-red-400" />}
              </div>
            </div>
          );
        })}
        
        {subIndicators.length > 3 && (
          <div className="text-xs text-right text-teal-400 mt-1">
            +{subIndicators.length - 3} {t("more")}...
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PillarBreakouts;
