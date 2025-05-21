
import React, { useState } from 'react';
import { Layout, Network, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/glass-card';
import OverallDeiIndicator from '@/components/think/OverallDeiIndicator';
import PillarBreakouts from '@/components/think/PillarBreakouts';
import DeiForesightTab from '@/components/think/DeiForesightTab';
import SimulationLab from '@/components/think/SimulationLab';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface DeiMetrics {
  overall: number;
  pillars: any;
  equilibriumBands: any;
}

interface DeiAndForesightHubProps {
  metrics: DeiMetrics;
  scenarios: any[];
  onSaveScenario: (scenario: any) => void;
  onSelectScenario: (id: number) => void;
}

const DeiAndForesightHub: React.FC<DeiAndForesightHubProps> = ({
  metrics,
  scenarios,
  onSaveScenario,
  onSelectScenario
}) => {
  const { t, isRTL } = useTranslation();
  const [activeView, setActiveView] = useState<'overview' | 'simulation'>('overview');

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 mr-3">
            <BarChart3 size={20} />
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            {t("deiAndForesightHub").toUpperCase()}
          </h2>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-full p-1">
          <Tabs 
            value={activeView} 
            onValueChange={(v) => setActiveView(v as 'overview' | 'simulation')}
            className="w-full"
          >
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="overview" 
                className={`rounded-full px-4 py-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
              >
                <Layout className="mr-2 h-4 w-4" />
                {t("overview").toUpperCase()}
              </TabsTrigger>
              <TabsTrigger 
                value="simulation" 
                className={`rounded-full px-4 py-1.5 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400`}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {t("simulation").toUpperCase()}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {activeView === 'overview' ? (
        <div>
          <div className="flex flex-col md:flex-row">
            {/* Overall DEI Indicator (Central Orb) */}
            <div className="w-full md:w-1/3 flex justify-center items-center py-6">
              <OverallDeiIndicator 
                value={metrics.overall} 
                minBand={metrics.equilibriumBands.overall.min} 
                maxBand={metrics.equilibriumBands.overall.max}
                pillars={metrics.pillars}
                equilibriumBands={metrics.equilibriumBands}
              />
            </div>
            
            {/* Four Pillar Breakouts */}
            <div className="w-full md:w-2/3">
              <PillarBreakouts 
                pillars={metrics.pillars} 
                equilibriumBands={metrics.equilibriumBands}
              />
            </div>
          </div>
          <DeiForesightTab metrics={metrics} scenarios={scenarios} />
        </div>
      ) : (
        <SimulationLab 
          metrics={metrics} 
          scenarios={scenarios}
          onSaveScenario={onSaveScenario}
          onSelectScenario={onSelectScenario}
        />
      )}
    </GlassCard>
  );
};

export default DeiAndForesightHub;
