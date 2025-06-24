
// Integration hook for connecting demo mode with existing data hooks
import { useDemo } from './use-demo';
import { useDemoData } from './use-demo-data';
import { DemoAPI } from '../api/demo-endpoints';
import { useEffect } from 'react';

export const useDemoIntegration = () => {
  const { isDemoMode, currentScenario, isActive, getCurrentStep } = useDemo();
  const demoData = useDemoData();

  // Sync demo API state with demo context
  useEffect(() => {
    DemoAPI.setDemoMode(isDemoMode, currentScenario || undefined);
  }, [isDemoMode, currentScenario]);

  // Helper to determine if we should use demo data
  const shouldUseDemoData = (dataType?: string) => {
    if (!isDemoMode || !currentScenario) return false;
    return true;
  };

  // Enhanced data fetching with demo integration
  const getScenarios = async () => {
    if (shouldUseDemoData('scenarios')) {
      return DemoAPI.getScenarios();
    }
    // Return real data fetching logic here
    return [];
  };

  const getHealthMetrics = async (zone?: string) => {
    if (shouldUseDemoData('healthMetrics')) {
      return DemoAPI.getHealthMetrics(zone);
    }
    // Return real data fetching logic here
    return [];
  };

  const getBundles = async () => {
    if (shouldUseDemoData('bundles')) {
      return DemoAPI.getBundles();
    }
    // Return real data fetching logic here
    return [];
  };

  const getTasks = async (bundleId?: string) => {
    if (shouldUseDemoData('tasks')) {
      return DemoAPI.getTasks(bundleId);
    }
    // Return real data fetching logic here
    return [];
  };

  const getSNAData = async () => {
    if (shouldUseDemoData('sna')) {
      return DemoAPI.getSNAData();
    }
    return null;
  };

  const getLoopAnalysis = async () => {
    if (shouldUseDemoData('loops')) {
      return DemoAPI.getLoopAnalysis();
    }
    return null;
  };

  const getAnomalies = async () => {
    if (shouldUseDemoData('anomalies')) {
      return DemoAPI.getAnomalies();
    }
    return [];
  };

  const getClaims = async () => {
    if (shouldUseDemoData('claims')) {
      return DemoAPI.getClaims();
    }
    return [];
  };

  // Demo step helpers
  const getCurrentStepData = () => {
    return getCurrentStep();
  };

  const isCurrentStep = (stepId: string) => {
    const currentStep = getCurrentStep();
    return currentStep?.id === stepId;
  };

  const isInDemoZone = (zoneName: string) => {
    const currentStep = getCurrentStep();
    return currentStep?.zone === zoneName;
  };

  return {
    isDemoMode,
    isActive,
    currentScenario,
    shouldUseDemoData,
    getScenarios,
    getHealthMetrics,
    getBundles,
    getTasks,
    getSNAData,
    getLoopAnalysis,
    getAnomalies,
    getClaims,
    getCurrentStepData,
    isCurrentStep,
    isInDemoZone,
    demoData: demoData.demoData
  };
};
