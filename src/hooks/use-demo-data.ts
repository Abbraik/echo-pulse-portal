
import { useState, useEffect } from 'react';
import { useDemo } from './use-demo';

// Mock data for Resource Management Demo
const RESOURCE_DEMO_DATA = {
  scenarios: [
    {
      id: 'resource-demo',
      name: 'Resource Management Demo',
      description: 'Optimize resource allocation and reduce extraction pressure',
      parameters: {
        resourceStock: { min: 0.90, max: 1.05, current: 0.97 },
        renewalRatio: { min: 0.8, max: 1.2, current: 1.1 },
        extractionPressure: { min: 0.5, max: 2.0, current: 1.8 }
      }
    }
  ],
  healthMetrics: [
    { id: '1', zone: 'MONITOR', name: 'Resource Stock', value: 0.97, target: 1.0, timestamp: new Date().toISOString() },
    { id: '2', zone: 'MONITOR', name: 'Renewal Ratio', value: 1.1, target: 1.2, timestamp: new Date().toISOString() },
    { id: '3', zone: 'MONITOR', name: 'Extraction Pressure', value: 1.8, target: 1.0, timestamp: new Date().toISOString() }
  ],
  snaData: {
    bottleneck: 'Ministry of Energy',
    criticalPath: ['Resource Allocation', 'Ministry of Energy', 'Distribution Networks'],
    networkHealth: 0.72
  }
};

// Mock data for Birth-Rate Stability Demo
const BIRTH_RATE_DEMO_DATA = {
  scenarios: [
    {
      id: 'birth-rate-demo',
      name: 'Birth-Rate Stability Demo',
      description: 'Stabilize population growth and enhance social cohesion',
      parameters: {
        naturalGrowthBalance: { min: 0.8, max: 1.2, current: 1.0 },
        populationDeviation: { min: -5, max: 5, current: 2.3 },
        socialCohesion: { min: 0.6, max: 1.0, current: 0.78 }
      }
    }
  ],
  healthMetrics: [
    { id: '4', zone: 'MONITOR', name: 'Natural Growth Balance', value: 1.0, target: 1.0, timestamp: new Date().toISOString() },
    { id: '5', zone: 'MONITOR', name: 'Population Deviation', value: 2.3, target: 0, timestamp: new Date().toISOString() },
    { id: '6', zone: 'MONITOR', name: 'Social Cohesion', value: 0.78, target: 0.9, timestamp: new Date().toISOString() }
  ],
  loopAnalysis: {
    R3: { name: 'Marriage Rate Loop', strength: 0.85, status: 'active' },
    R6: { name: 'Education-Employment Loop', strength: 0.92, status: 'active' }
  }
};

export const useDemoData = () => {
  const { isDemoMode, currentScenario } = useDemo();
  const [demoData, setDemoData] = useState<any>(null);

  useEffect(() => {
    if (!isDemoMode || !currentScenario) {
      setDemoData(null);
      return;
    }

    // Load appropriate demo data based on current scenario
    if (currentScenario === 'resource-management') {
      setDemoData(RESOURCE_DEMO_DATA);
    } else if (currentScenario === 'birth-rate-stability') {
      setDemoData(BIRTH_RATE_DEMO_DATA);
    }
  }, [isDemoMode, currentScenario]);

  const getDemoScenarios = () => {
    return demoData?.scenarios || [];
  };

  const getDemoHealthMetrics = () => {
    return demoData?.healthMetrics || [];
  };

  const getDemoSNAData = () => {
    return demoData?.snaData || null;
  };

  const getDemoLoopAnalysis = () => {
    return demoData?.loopAnalysis || null;
  };

  return {
    isDemoMode,
    demoData,
    getDemoScenarios,
    getDemoHealthMetrics,
    getDemoSNAData,
    getDemoLoopAnalysis
  };
};
