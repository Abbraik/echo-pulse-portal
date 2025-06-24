
// Integration hook for connecting demo mode with existing data hooks
import { useDemo } from './use-demo';
import { useDemoData } from './use-demo-data';
import { DemoAPI } from '../api/demo-endpoints';
import { useEffect } from 'react';

export const useDemoIntegration = () => {
  const { isDemoMode, currentScenario } = useDemo();
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

  // Wrapper functions for data fetching that switch between demo and real data
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

  return {
    isDemoMode,
    currentScenario,
    shouldUseDemoData,
    getScenarios,
    getHealthMetrics,
    getBundles,
    getTasks,
    demoData: demoData.demoData
  };
};
