
import { useState, useEffect, useCallback } from 'react';

type PanelType = 'approvals' | 'health' | 'coordination';

interface PanelPriority {
  panelId: PanelType;
  score: number;
  reason: string;
}

interface UseAsymmetricPanelsReturn {
  heroPanel: PanelType;
  hoveredPanel: PanelType | null;
  setHoveredPanel: (panel: PanelType | null) => void;
  getPanelWidth: (panelId: PanelType) => string;
  resetLayout: () => void;
  isTransitioning: boolean;
}

export const useAsymmetricPanels = (dashboardData?: any): UseAsymmetricPanelsReturn => {
  const [heroPanel, setHeroPanel] = useState<PanelType>('approvals');
  const [hoveredPanel, setHoveredPanel] = useState<PanelType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate panel priority based on data
  const calculatePanelPriority = useCallback((): PanelPriority[] => {
    const priorities: PanelPriority[] = [];

    // Approvals priority based on pending high-priority items
    const approvalsScore = (dashboardData?.approvals?.pending || 0) * 10 + 
                          (dashboardData?.approvals?.overdue || 0) * 20;
    priorities.push({
      panelId: 'approvals',
      score: approvalsScore,
      reason: `${dashboardData?.approvals?.pending || 0} pending, ${dashboardData?.approvals?.overdue || 0} overdue`
    });

    // Health priority based on critical alerts and DEI score
    const healthScore = (dashboardData?.systemHealth?.criticalAlerts || 0) * 15 + 
                       (dashboardData?.systemHealth?.deiScore < 80 ? 25 : 0);
    priorities.push({
      panelId: 'health',
      score: healthScore,
      reason: `${dashboardData?.systemHealth?.criticalAlerts || 0} critical alerts`
    });

    // Coordination priority based on flags and escalations
    const coordinationScore = (dashboardData?.coordination?.flags || 0) * 12 + 
                             (dashboardData?.coordination?.escalations || 0) * 18;
    priorities.push({
      panelId: 'coordination',
      score: coordinationScore,
      reason: `${dashboardData?.coordination?.flags || 0} flags, ${dashboardData?.coordination?.escalations || 0} escalations`
    });

    return priorities.sort((a, b) => b.score - a.score);
  }, [dashboardData]);

  // Auto-promote most critical panel every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hoveredPanel) {
        const priorities = calculatePanelPriority();
        const mostCritical = priorities[0];
        
        if (mostCritical && mostCritical.panelId !== heroPanel) {
          setIsTransitioning(true);
          setHeroPanel(mostCritical.panelId);
          console.log(`Auto-promoted ${mostCritical.panelId} to hero: ${mostCritical.reason}`);
          
          setTimeout(() => setIsTransitioning(false), 400);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [heroPanel, hoveredPanel, calculatePanelPriority]);

  // Update hero panel when critical events occur
  useEffect(() => {
    if (dashboardData) {
      const priorities = calculatePanelPriority();
      const mostCritical = priorities[0];
      
      // If score is significantly higher than current hero, promote it
      const currentHeroScore = priorities.find(p => p.panelId === heroPanel)?.score || 0;
      if (mostCritical && mostCritical.score > currentHeroScore + 30) {
        setIsTransitioning(true);
        setHeroPanel(mostCritical.panelId);
        console.log(`Event-driven promotion: ${mostCritical.panelId} - ${mostCritical.reason}`);
        
        setTimeout(() => setIsTransitioning(false), 400);
      }
    }
  }, [dashboardData, heroPanel]);

  const getPanelWidth = useCallback((panelId: PanelType): string => {
    const activeHero = hoveredPanel || heroPanel;
    
    if (activeHero === panelId) {
      return 'w-1/2'; // 50%
    }
    
    // For non-hero panels, distribute remaining 50% as 30% and 20%
    if (activeHero === 'approvals') {
      return panelId === 'health' ? 'w-[30%]' : 'w-[20%]';
    } else if (activeHero === 'health') {
      return panelId === 'approvals' ? 'w-[30%]' : 'w-[20%]';
    } else { // coordination is hero
      return panelId === 'approvals' ? 'w-[30%]' : 'w-[20%]';
    }
  }, [heroPanel, hoveredPanel]);

  const resetLayout = useCallback(() => {
    setHeroPanel('approvals');
    setHoveredPanel(null);
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 400);
  }, []);

  return {
    heroPanel,
    hoveredPanel,
    setHoveredPanel,
    getPanelWidth,
    resetLayout,
    isTransitioning
  };
};
