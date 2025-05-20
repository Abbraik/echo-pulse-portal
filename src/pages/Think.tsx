
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Layout, Layers, Network, BarChart3, ArrowRight } from 'lucide-react';
import SystemFramingStudio from '@/components/think/SystemFramingStudio';
import OverallDeiIndicator from '@/components/think/OverallDeiIndicator';
import PillarBreakouts from '@/components/think/PillarBreakouts';
import StrategyBuilder from '@/components/think/StrategyBuilder';
import SimulationLab from '@/components/think/SimulationLab';
import AiAdvisorSidebar from '@/components/think/AiAdvisorSidebar';
import FooterCTA from '@/components/think/FooterCTA';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeiForesightTab from '@/components/think/DeiForesightTab';
import EquilibriumSolverTab from '@/components/think/EquilibriumSolverTab';

// Mock data for DEI metrics and scenarios
const mockDEIMetrics = { 
  overall: 74,
  pillars: {
    population: {
      value: 78,
      subIndicators: [
        { name: 'Fertility Rate', value: 2.1, trend: [2.0, 2.1, 2.1, 2.2, 2.1] },
        { name: 'Age-Dependency Ratio', value: 52, trend: [55, 54, 53, 52, 52] },
        { name: 'Migration Volatility', value: 18, trend: [22, 20, 19, 18, 18] },
        { name: 'Population Growth Stability', value: 76, trend: [72, 73, 75, 76, 76] }
      ]
    },
    resources: {
      value: 65,
      subIndicators: [
        { name: 'Water Consumption per Capita', value: 130, trend: [145, 140, 135, 132, 130] },
        { name: 'Energy Use per GDP', value: 68, trend: [72, 70, 69, 68, 68] },
        { name: 'Agricultural Yield Index', value: 72, trend: [68, 69, 70, 71, 72] }
      ]
    },
    goods: {
      value: 82,
      subIndicators: [
        { name: 'Manufacturing Output Growth', value: 3.2, trend: [2.9, 3.0, 3.1, 3.2, 3.2] },
        { name: 'Service Sector Resilience Index', value: 79, trend: [75, 76, 78, 79, 79] },
        { name: 'Supply-Chain Robustness', value: 81, trend: [77, 78, 79, 80, 81] }
      ]
    },
    social: {
      value: 71,
      subIndicators: [
        { name: 'Education Attainment Rate', value: 74, trend: [70, 71, 73, 74, 74] },
        { name: 'Health Service Coverage', value: 82, trend: [78, 79, 80, 81, 82] },
        { name: 'Social Cohesion Index', value: 68, trend: [64, 65, 66, 67, 68] },
        { name: 'Trust Index', value: 72, trend: [68, 69, 70, 71, 72] }
      ]
    }
  },
  equilibriumBands: {
    overall: { min: 70, max: 85 },
    population: { min: 75, max: 85 },
    resources: { min: 60, max: 80 },
    goods: { min: 70, max: 90 },
    social: { min: 65, max: 85 },
  }
};

// Mock data for the SystemFramingStudio component
const mockCldData = {
  nodes: [],
  edges: []
};

const mockSnaData = {
  nodes: [],
  edges: []
};

const mockScenarios = [
  { id: 1, name: "Baseline", date: "2025-01-01", probability: 0.4, sparkline: [65, 68, 72, 78, 76] },
  { id: 2, name: "Optimistic", date: "2025-02-15", probability: 0.2, sparkline: [65, 70, 75, 82, 88] },
  { id: 3, name: "Pessimistic", date: "2025-03-10", probability: 0.4, sparkline: [65, 62, 58, 55, 52] },
];

const mockSensitivity = [
  { parameter: "Water Tariff", delta: 8, impact: 34 },
  { parameter: "Migration Policy", delta: 5, impact: 28 },
  { parameter: "Educational Investment", delta: 12, impact: 25 },
  { parameter: "Energy Subsidies", delta: -7, impact: 22 },
  { parameter: "Healthcare Access", delta: 9, impact: 20 },
];

const mockExecutionImpact = {
  bundlesAffected: 7,
  budgetChange: 45000000,
  timelineShift: 4,
};

// Initial equilibrium bands for the solver
const initialBands = [
  { name: "Population", min: 70, max: 85 },
  { name: "Resources", min: 60, max: 80 },
  { name: "Goods & Services", min: 70, max: 90 },
  { name: "Social Outcomes", min: 65, max: 85 },
];

const ThinkPage: React.FC = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState("simulation");

  // Handle scroll behavior for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Handle mouse near top to reveal header
    const handleMouseNearTop = (e: MouseEvent) => {
      if (e.clientY < 20 && hideHeader) {
        setHideHeader(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseNearTop);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseNearTop);
    };
  }, [lastScrollY, hideHeader]);

  const showToast = (message: string) => {
    toast({
      title: t("simulationComplete"),
      description: message,
      duration: 5000,
    });
  };

  return (
    <AnimatedPage>
      {/* Top Navigation Bar */}
      <motion.header 
        className="sticky top-0 z-50 w-full glass-panel py-3 px-6 mb-8 border-b border-white/20"
        initial={{ y: 0 }}
        animate={{ y: hideHeader ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Layers size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">THINK 🔍: {t("strategyZone")}</h1>
              <p className="text-sm md:text-base text-gray-400">
                {t("thinkCoreDesc")}
              </p>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content Layout */}
      <div className="flex flex-col gap-6">
        {/* System Framing Studio (Full Width) */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-left flex items-center">
            <Layout className="mr-2" size={20} />
            {t("systemFramingStudio")}
          </h2>
          <SystemFramingStudio cldData={mockCldData} snaData={mockSnaData} />
        </GlassCard>
        
        {/* Tabbed Interface for Other Components */}
        <GlassCard className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="simulation" className="flex items-center gap-2">
                <BarChart3 size={16} />
                <span>{t("simulationLab")}</span>
              </TabsTrigger>
              <TabsTrigger value="dei" className="flex items-center gap-2">
                <Network size={16} />
                <span>{t("deiHubTitle")}</span>
              </TabsTrigger>
              <TabsTrigger value="strategy" className="flex items-center gap-2">
                <ArrowRight size={16} />
                <span>{t("strategyBuilder")}</span>
              </TabsTrigger>
              <TabsTrigger value="equilibrium" className="flex items-center gap-2">
                <Layout size={16} />
                <span>{t("equilibriumSolver")}</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Simulation Lab Tab */}
            <TabsContent value="simulation">
              <SimulationLab metrics={mockDEIMetrics} />
            </TabsContent>
            
            {/* DEI & Foresight Hub Tab */}
            <TabsContent value="dei">
              <div className="flex flex-col md:flex-row">
                {/* Overall DEI Indicator (Central Orb) */}
                <div className="w-full md:w-1/3 flex justify-center items-center py-6">
                  <OverallDeiIndicator 
                    value={mockDEIMetrics.overall} 
                    minBand={mockDEIMetrics.equilibriumBands.overall.min} 
                    maxBand={mockDEIMetrics.equilibriumBands.overall.max}
                  />
                </div>
                
                {/* Four Pillar Breakouts */}
                <div className="w-full md:w-2/3">
                  <PillarBreakouts 
                    pillars={mockDEIMetrics.pillars} 
                    equilibriumBands={mockDEIMetrics.equilibriumBands}
                  />
                </div>
              </div>
              <DeiForesightTab metrics={mockDEIMetrics} scenarios={mockScenarios} />
            </TabsContent>
            
            {/* Strategy Builder Tab */}
            <TabsContent value="strategy">
              <StrategyBuilder 
                sensitivityParameters={mockSensitivity} 
                executionImpact={mockExecutionImpact}
                onCompute={(approach) => {
                  showToast(`${approach} - ${t("strategyComputeToast", { 
                    approach, 
                    impact: mockExecutionImpact.budgetChange / 1000000
                  })}`);
                }}
              />
            </TabsContent>
            
            {/* Equilibrium Solver Tab */}
            <TabsContent value="equilibrium">
              <EquilibriumSolverTab initialBands={initialBands} />
            </TabsContent>
          </Tabs>
        </GlassCard>
        
        {/* AI Advisor (Full-Width) */}
        <AiAdvisorSidebar className="glass-panel p-4" />
      </div>

      {/* Footer CTA */}
      <div className="mt-8">
        <FooterCTA />
      </div>
    </AnimatedPage>
  );
};

export default ThinkPage;
