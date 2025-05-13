
import React, { useState, useEffect } from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { Layout, Layers, Network } from 'lucide-react';
import SystemFramingStudio from '@/components/think/SystemFramingStudio';
import DeiForesightTab from '@/components/think/DeiForesightTab';
import EquilibriumSolverTab from '@/components/think/EquilibriumSolverTab';
import SensitivityTab from '@/components/think/SensitivityTab';
import StrategyGeneratorTab from '@/components/think/StrategyGeneratorTab';
import SnaAnalysisTab from '@/components/think/SnaAnalysisTab';
import AiAdvisorSidebar from '@/components/think/AiAdvisorSidebar';
import FooterCTA from '@/components/think/FooterCTA';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

// Mock data - in a real app, this would come from API calls
const mockCLD = { nodes: [], edges: [] }; 
const mockSNA = { nodes: [], edges: [] };

const mockDEIMetrics = { 
  pillars: {
    population: {
      value: 78,
      subIndicators: [
        { name: 'Fertility Rate', value: 2.1 },
        { name: 'Age-Dependency Ratio', value: 52 },
        { name: 'Migration Volatility', value: 18 },
        { name: 'Population Growth Stability', value: 76 }
      ]
    },
    resources: {
      value: 65,
      subIndicators: [
        { name: 'Water Consumption per Capita', value: 130 },
        { name: 'Energy Use per GDP', value: 68 },
        { name: 'Agricultural Yield Index', value: 72 }
      ]
    },
    goods: {
      value: 82,
      subIndicators: [
        { name: 'Manufacturing Output Growth', value: 3.2 },
        { name: 'Service Sector Resilience Index', value: 79 },
        { name: 'Supply-Chain Robustness', value: 81 }
      ]
    },
    social: {
      value: 71,
      subIndicators: [
        { name: 'Education Attainment Rate', value: 74 },
        { name: 'Health Service Coverage', value: 82 },
        { name: 'Social Cohesion Index', value: 68 }
      ]
    }
  }
};

const mockScenarios = [
  { id: 1, name: "Baseline", date: "2025-01-01", probability: 0.4, sparkline: [65, 68, 72, 78, 76] },
  { id: 2, name: "Optimistic", date: "2025-02-15", probability: 0.2, sparkline: [65, 70, 75, 82, 88] },
  { id: 3, name: "Pessimistic", date: "2025-03-10", probability: 0.4, sparkline: [65, 62, 58, 55, 52] },
];

const mockBands = [
  { name: "Population", min: 75, max: 85 },
  { name: "Resources", min: 60, max: 80 },
  { name: "Goods & Services", min: 70, max: 90 },
  { name: "Social Outcomes", min: 65, max: 85 },
];

const mockSensitivity = [
  { parameter: "Water Tariff", delta: 8, impact: 34 },
  { parameter: "Migration Policy", delta: 5, impact: 28 },
  { parameter: "Educational Investment", delta: 12, impact: 25 },
  { parameter: "Energy Subsidies", delta: -7, impact: 22 },
  { parameter: "Healthcare Access", delta: 9, impact: 20 },
  { parameter: "Supply Chain Resilience", delta: 6, impact: 18 },
  { parameter: "Agricultural Support", delta: 10, impact: 15 },
  { parameter: "Manufacturing Incentives", delta: 4, impact: 12 },
];

// Fixed the priority types to be specific string literals
const mockObjectives = [
  { id: 1, name: "Increase Water Efficiency", description: "Reduce water consumption per capita by 15% through smart irrigation and usage monitoring", priority: "High" as const, delta: 15, timeline: "2030", leveragePoint: "Parameters" },
  { id: 2, name: "Balance Age Demographics", description: "Implement policies to address aging population and support working-age groups", priority: "Medium" as const, delta: 8, timeline: "2035", leveragePoint: "Feedback Loops" },
  { id: 3, name: "Strengthen Social Cohesion", description: "Enhance community engagement and inclusive growth initiatives", priority: "High" as const, delta: 12, timeline: "2028", leveragePoint: "Information Flows" },
];

const ThinkPage: React.FC = () => {
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
              <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">THINK 🔍: Diagnose & Plan</h1>
              <p className="text-sm md:text-base text-gray-400">
                Analyze systems, model relationships, and develop strategies
              </p>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content Layout - Now a vertical stack */}
      <div className="flex flex-col space-y-6">
        {/* System Framing Studio (Full Width) */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4 text-left flex items-center">
            <Layout className="mr-2" size={20} />
            System Framing Studio
          </h2>
          <SystemFramingStudio
            cldData={mockCLD}
            snaData={mockSNA}
          />
        </div>
        
        {/* Full-Width Tabbed Analysis Tools Panel */}
        <div className="glass-panel p-6 flex-1">
          <Tabs defaultValue="dei" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="dei">DEI & Foresight</TabsTrigger>
              <TabsTrigger value="solver">Equilibrium</TabsTrigger>
              <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="sna" className="flex items-center justify-center gap-1">
                <Network size={16} />
                <span>SNA Analysis</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dei" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <DeiForesightTab metrics={mockDEIMetrics} scenarios={mockScenarios} />
            </TabsContent>
            
            <TabsContent value="solver" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <EquilibriumSolverTab initialBands={mockBands} />
            </TabsContent>
            
            <TabsContent value="sensitivity" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <SensitivityTab parameters={mockSensitivity} />
            </TabsContent>
            
            <TabsContent value="strategy" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <StrategyGeneratorTab objectives={mockObjectives} />
            </TabsContent>

            <TabsContent value="sna" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
              <SnaAnalysisTab />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* AI Advisor - Now a full-width component */}
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
