
import { useState, useEffect, useCallback } from 'react';

export type PanelId = 'approvals' | 'health' | 'coordination';
export type PanelState = 'hero' | 'contracted' | 'normal';

interface PanelConfig {
  id: PanelId;
  state: PanelState;
  width: string;
  priority: number;
}

interface UseFocalPanelsOptions {
  autoFocusInterval?: number;
  animationDuration?: number;
}

export const useFocalPanels = (options: UseFocalPanelsOptions = {}) => {
  const { autoFocusInterval = 10000, animationDuration = 350 } = options;
  
  const [heroPanelId, setHeroPanelId] = useState<PanelId | null>(null);
  const [hoveredPanelId, setHoveredPanelId] = useState<PanelId | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 600);
      setIsTablet(width >= 600 && width < 1024);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Calculate panel configurations
  const getPanelConfigs = useCallback((): PanelConfig[] => {
    const activeHero = hoveredPanelId || heroPanelId;
    
    if (!activeHero) {
      // Default state - all panels equal
      return [
        { id: 'approvals', state: 'normal', width: '33.333%', priority: 0 },
        { id: 'health', state: 'normal', width: '33.333%', priority: 0 },
        { id: 'coordination', state: 'normal', width: '33.333%', priority: 0 },
      ];
    }

    // Responsive widths
    let heroWidth, contractedWidth;
    if (isMobile) {
      heroWidth = '100%';
      contractedWidth = '0%';
    } else if (isTablet) {
      heroWidth = '60%';
      contractedWidth = '20%';
    } else {
      heroWidth = '50%';
      contractedWidth = '25%';
    }

    return [
      {
        id: 'approvals',
        state: activeHero === 'approvals' ? 'hero' : 'contracted',
        width: activeHero === 'approvals' ? heroWidth : contractedWidth,
        priority: activeHero === 'approvals' ? 1 : 0,
      },
      {
        id: 'health',
        state: activeHero === 'health' ? 'hero' : 'contracted',
        width: activeHero === 'health' ? heroWidth : contractedWidth,
        priority: activeHero === 'health' ? 1 : 0,
      },
      {
        id: 'coordination',
        state: activeHero === 'coordination' ? 'hero' : 'contracted',
        width: activeHero === 'coordination' ? heroWidth : contractedWidth,
        priority: activeHero === 'coordination' ? 1 : 0,
      },
    ];
  }, [heroPanelId, hoveredPanelId, isMobile, isTablet]);

  // Auto-focus based on priority data
  const computeAutoPriority = useCallback((dashboardData: any) => {
    if (!dashboardData) return null;

    let highestPriority = 0;
    let priorityPanel: PanelId | null = null;

    // Check approvals urgency
    const approvalScore = (dashboardData.approvals?.overdue || 0) * 3 + 
                         (dashboardData.approvals?.urgent || 0) * 2;
    if (approvalScore > highestPriority) {
      highestPriority = approvalScore;
      priorityPanel = 'approvals';
    }

    // Check health alerts
    const healthScore = (dashboardData.systemHealth?.alerts || [])
      .filter((alert: any) => alert.severity === 'high').length * 3;
    if (healthScore > highestPriority) {
      highestPriority = healthScore;
      priorityPanel = 'health';
    }

    // Check coordination escalations
    const coordScore = (dashboardData.coordination?.facilitatorEscalations || [])
      .filter((esc: any) => esc.type === 'role').length * 2;
    if (coordScore > highestPriority) {
      highestPriority = coordScore;
      priorityPanel = 'coordination';
    }

    return priorityPanel;
  }, []);

  // Set auto-focus hero
  const setAutoFocus = useCallback((dashboardData: any) => {
    const priorityPanel = computeAutoPriority(dashboardData);
    if (priorityPanel !== heroPanelId) {
      setHeroPanelId(priorityPanel);
    }
  }, [computeAutoPriority, heroPanelId]);

  // Panel interaction handlers
  const handlePanelHover = useCallback((panelId: PanelId | null) => {
    setHoveredPanelId(panelId);
  }, []);

  const handlePanelFocus = useCallback((panelId: PanelId) => {
    setHeroPanelId(panelId);
  }, []);

  const resetPanels = useCallback(() => {
    setHeroPanelId(null);
    setHoveredPanelId(null);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetPanels();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetPanels]);

  return {
    panelConfigs: getPanelConfigs(),
    heroPanelId: hoveredPanelId || heroPanelId,
    isMobile,
    isTablet,
    animationDuration,
    handlePanelHover,
    handlePanelFocus,
    resetPanels,
    setAutoFocus,
  };
};
