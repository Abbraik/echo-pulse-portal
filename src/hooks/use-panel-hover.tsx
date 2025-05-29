
import { useState, useCallback, useRef } from 'react';

type PanelId = 'approvals' | 'health' | 'coordination';

interface PanelHoverState {
  expandedPanel: PanelId | null;
  isAnimating: boolean;
}

export const usePanelHover = () => {
  const [state, setState] = useState<PanelHoverState>({
    expandedPanel: null,
    isAnimating: false,
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePanelHover = useCallback((panelId: PanelId | null) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      expandedPanel: panelId,
      isAnimating: true,
    }));

    // Reset animation state after a shorter, more responsive duration
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, 250);
  }, []);

  const handlePanelLeave = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      expandedPanel: null,
      isAnimating: true,
    }));

    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, 250);
  }, []);

  const getPanelWidth = useCallback((panelId: PanelId) => {
    if (state.expandedPanel === panelId) return 'w-[70%]';
    if (state.expandedPanel && state.expandedPanel !== panelId) return 'w-[80px]';
    return 'w-[33.333%]';
  }, [state.expandedPanel]);

  const isPanelCollapsed = useCallback((panelId: PanelId) => {
    return state.expandedPanel && state.expandedPanel !== panelId;
  }, [state.expandedPanel]);

  return {
    expandedPanel: state.expandedPanel,
    isAnimating: state.isAnimating,
    handlePanelHover,
    handlePanelLeave,
    getPanelWidth,
    isPanelCollapsed,
  };
};
