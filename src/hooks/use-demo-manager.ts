
import { useState, useEffect, useCallback } from 'react';
import { useDemo } from './use-demo';
import { useDemoData } from './use-demo-data';
import { useDemoIntegration } from './use-demo-integration';
import { useNavigate, useLocation } from 'react-router-dom';

interface DemoNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

export const useDemoManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const demo = useDemo();
  const demoData = useDemoData();
  const integration = useDemoIntegration();
  
  const [notifications, setNotifications] = useState<DemoNotification[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Enhanced step completion tracking
  const markStepCompleted = useCallback((stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  }, []);

  // Auto-play functionality
  const startAutoPlay = useCallback((intervalMs: number = 8000) => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
    
    setIsAutoPlaying(true);
    const interval = setInterval(() => {
      if (demo.isActive) {
        const currentStep = demo.getCurrentStep();
        if (currentStep) {
          markStepCompleted(currentStep.id);
        }
        demo.nextStep();
      } else {
        setIsAutoPlaying(false);
        clearInterval(interval);
      }
    }, intervalMs);
    
    setAutoPlayInterval(interval);
  }, [demo, autoPlayInterval, markStepCompleted]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setIsAutoPlaying(false);
  }, [autoPlayInterval]);

  // Enhanced notification system
  const addNotification = useCallback((notification: Omit<DemoNotification, 'id'>) => {
    const id = `demo-notification-${Date.now()}`;
    const newNotification: DemoNotification = {
      id,
      duration: 5000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Smart navigation with context awareness
  const navigateToStep = useCallback((stepId: string) => {
    const scenario = demo.scenarios.find(s => s.id === demo.currentScenario);
    const step = scenario?.steps.find(s => s.id === stepId);
    
    if (!step) return;

    // Navigate to appropriate zone
    const zoneRoutes = {
      think: '/think',
      act: '/act',
      monitor: '/monitor',
      innovate: '/innovate',
      learn: '/learn'
    };

    const targetRoute = zoneRoutes[step.zone as keyof typeof zoneRoutes];
    if (targetRoute && location.pathname !== targetRoute) {
      navigate(targetRoute);
      
      addNotification({
        type: 'info',
        title: 'Zone Navigation',
        message: `Navigating to ${step.zone.toUpperCase()} zone for "${step.title}"`,
        duration: 3000
      });
    }

    // Skip to the specific step
    const stepIndex = scenario.steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      demo.skipToStep(stepIndex);
    }
  }, [demo, location.pathname, navigate, addNotification]);

  // Enhanced step analytics
  const getStepProgress = useCallback(() => {
    if (!demo.currentScenario) return { completed: 0, total: 0, percentage: 0 };
    
    const scenario = demo.scenarios.find(s => s.id === demo.currentScenario);
    if (!scenario) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = Array.from(completedSteps).filter(stepId => 
      scenario.steps.some(s => s.id === stepId)
    ).length;
    
    return {
      completed,
      total: scenario.steps.length,
      percentage: Math.round((completed / scenario.steps.length) * 100)
    };
  }, [demo.currentScenario, demo.scenarios, completedSteps]);

  // Demo session management
  const resetDemoSession = useCallback(() => {
    setCompletedSteps(new Set());
    setNotifications([]);
    stopAutoPlay();
  }, [stopAutoPlay]);

  // Enhanced demo data with context
  const getContextualData = useCallback((dataType: string, context?: any) => {
    if (!integration.isDemoMode) return null;
    
    switch (dataType) {
      case 'scenarios':
        return integration.getScenarios();
      case 'healthMetrics':
        return integration.getHealthMetrics(context?.zone);
      case 'bundles':
        return integration.getBundles();
      case 'tasks':
        return integration.getTasks(context?.bundleId);
      case 'sna':
        return integration.getSNAData();
      case 'loops':
        return integration.getLoopAnalysis();
      case 'anomalies':
        return integration.getAnomalies();
      case 'claims':
        return integration.getClaims();
      default:
        return null;
    }
  }, [integration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  // Reset session when demo mode changes
  useEffect(() => {
    if (!demo.isDemoMode) {
      resetDemoSession();
    }
  }, [demo.isDemoMode, resetDemoSession]);

  return {
    // Demo state
    ...demo,
    ...integration,
    demoData: demoData.demoData,
    
    // Enhanced features
    notifications,
    isAutoPlaying,
    completedSteps: Array.from(completedSteps),
    
    // Actions
    addNotification,
    removeNotification,
    startAutoPlay,
    stopAutoPlay,
    markStepCompleted,
    navigateToStep,
    resetDemoSession,
    getContextualData,
    getStepProgress,
    
    // Utilities
    isStepCompleted: (stepId: string) => completedSteps.has(stepId),
    getCurrentProgress: getStepProgress(),
  };
};
