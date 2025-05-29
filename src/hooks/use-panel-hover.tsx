
import { useState, useCallback } from 'react';

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

  const handlePanelHover = useCallback((panelId: PanelId | null) => {
    setState(prev => ({
      ...prev,
      expandedPanel: panelId,
      isAnimating: true,
    }));

    // Reset animation state after transition
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, 300);
  }, []);

  const handlePanelLeave = useCallback(() => {
    setState(prev => ({
      ...prev,
      expandedPanel: null,
      isAnimating: true,
    }));

    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, 300);
  }, []);

  const getPanelWidth = useCallback((panelId: PanelId) => {
    if (state.expandedPanel === panelId) return 'w-[80%]';
    if (state.expandedPanel && state.expandedPanel !== panelId) return 'w-[60px]';
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
