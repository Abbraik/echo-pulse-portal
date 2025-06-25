
import { useState, useEffect } from 'react';
import { DEMO_DATASETS, DEMO_OBJECTIVES } from '@/api/demo-data';

export const useDemoData = () => {
  const [demoData, setDemoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and provide centralized demo data
    const timer = setTimeout(() => {
      setDemoData({
        datasets: DEMO_DATASETS,
        objectives: DEMO_OBJECTIVES,
        currentScenario: 'resource-management' // default
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getDataForScenario = (scenarioId: string) => {
    if (!demoData) return null;
    return DEMO_DATASETS[scenarioId as keyof typeof DEMO_DATASETS] || null;
  };

  const getAllBundles = () => {
    if (!demoData) return [];
    
    const allBundles: any[] = [];
    Object.values(DEMO_DATASETS).forEach(dataset => {
      if (dataset.bundles) {
        allBundles.push(...dataset.bundles);
      }
    });
    return allBundles;
  };

  const getAllTasks = () => {
    if (!demoData) return [];
    
    const allTasks: any[] = [];
    Object.values(DEMO_DATASETS).forEach(dataset => {
      if (dataset.tasks) {
        allTasks.push(...dataset.tasks);
      }
    });
    return allTasks;
  };

  return {
    demoData,
    loading,
    getDataForScenario,
    getAllBundles,
    getAllTasks,
    objectives: DEMO_OBJECTIVES
  };
};
