import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

interface SubIndicator {
  name: string;
  value: number;
}

interface Pillar {
  value: number;
  subIndicators: SubIndicator[];
}

interface Metrics {
  pillars: {
    population: Pillar;
    resources: Pillar;
    goods: Pillar;
    social: Pillar;
  };
  equilibriumBands: {
    overall: { min: number; max: number };
    population: { min: number; max: number };
    resources: { min: number; max: number };
    goods: { min: number; max: number };
    social: { min: number; max: number };
  };
}

interface Scenario {
  id: number;
  name: string;
  date: string;
  probability: number;
  sparkline: number[];
}

interface DeiForesightTabProps {
  metrics: Metrics;
  scenarios: Scenario[];
}

const DeiForesightTab: React.FC<DeiForesightTabProps> = ({ metrics, scenarios }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* Deviation Heatmap - Keeping this as requested */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-left">{t("deviationFromEquilibrium")}</h3>
        <div className="flex justify-between">
          {/* Population pillar deviation */}
          <PillarDeviationIndicator 
            pillarName="population"
            value={metrics.pillars.population.value}
            minBand={metrics.equilibriumBands.population.min}
            maxBand={metrics.equilibriumBands.population.max}
          />
          
          {/* Resources pillar deviation */}
          <PillarDeviationIndicator 
            pillarName="resources"
            value={metrics.pillars.resources.value}
            minBand={metrics.equilibriumBands.resources.min}
            maxBand={metrics.equilibriumBands.resources.max}
          />
          
          {/* Goods pillar deviation */}
          <PillarDeviationIndicator 
            pillarName="goods"
            value={metrics.pillars.goods.value}
            minBand={metrics.equilibriumBands.goods.min}
            maxBand={metrics.equilibriumBands.goods.max}
          />
          
          {/* Social pillar deviation */}
          <PillarDeviationIndicator 
            pillarName="social"
            value={metrics.pillars.social.value}
            minBand={metrics.equilibriumBands.social.min}
            maxBand={metrics.equilibriumBands.social.max}
          />
        </div>
      </div>
      
      {/* Active scenario details */}
      {scenarios.length > 0 && (
        <div className="bg-navy-900/40 rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-medium mb-4">{t("activeScenarios")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">{t("mostProbable")}</div>
                <div className="text-xl font-bold">
                  {scenarios
                    .sort((a, b) => b.probability - a.probability)[0]?.name || "—"}
                </div>
              </div>
              
              <div className="bg-white/10 p-3 rounded-lg">
                <div className="text-xs text-gray-400 mb-1">{t("mostRecent")}</div>
                <div className="text-xl font-bold">
                  {scenarios
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.name || "—"}
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 p-3 rounded-lg h-full flex flex-col">
              <div className="text-xs text-gray-400 mb-2">{t("scenarioDistribution")}</div>
              <div className="flex-1 flex items-center">
                <div className="w-full h-6 bg-white/5 rounded-full overflow-hidden flex">
                  {scenarios.slice(0, 5).map((scenario, index) => (
                    <div 
                      key={scenario.id}
                      className="h-full" 
                      style={{ 
                        width: `${scenario.probability * 100}%`,
                        backgroundColor: getScenarioColor(index)
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
                {scenarios.slice(0, 3).map((scenario, index) => (
                  <div key={scenario.id} className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: getScenarioColor(index) }}
                    />
                    <span className="truncate">{scenario.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PillarDeviationIndicatorProps {
  pillarName: string;
  value: number;
  minBand: number;
  maxBand: number;
}

const PillarDeviationIndicator: React.FC<PillarDeviationIndicatorProps> = ({ 
  pillarName, 
  value, 
  minBand, 
  maxBand 
}) => {
  const { t } = useTranslation();
  
  // Calculate deviation from equilibrium band
  let deviation = 0;
  let colorClass = "from-green-500/80 to-green-700/80";
  
  if (value < minBand) {
    deviation = minBand - value;
    colorClass = "from-red-500/80 to-red-700/80";
  } else if (value > maxBand) {
    deviation = value - maxBand;
    colorClass = "from-yellow-500/80 to-yellow-700/80";
  }
  
  const deviationText = deviation === 0 ? 
    "0" : 
    (value < minBand ? "-" : "+") + deviation + "%";
  
  return (
    <div className="flex flex-col items-center">
      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-sm font-medium border border-white/10`}>
        {deviationText}
      </div>
      <span className="mt-1 text-xs capitalize">{t(pillarName as any)}</span>
    </div>
  );
};

// Helper function to get colors for scenario visualization
const getScenarioColor = (index: number): string => {
  const colors = [
    "#14b8a6", // teal-500
    "#0ea5e9", // sky-500
    "#8b5cf6", // violet-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
  ];
  
  return colors[index % colors.length];
};

export default DeiForesightTab;
