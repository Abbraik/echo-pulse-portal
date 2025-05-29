
import { useState, useCallback, useRef } from 'react';

type PanelId = 'approvals' | 'health' | 'coordination';

interface PanelHoverState {
  expandedPanel: PanelId | null;
  isAnimating: boolean;
  fullscreenPanel: PanelId | null;
}

export const usePanelHover = () => {
  const [state, setState] = useState<PanelHoverState>({
    expandedPanel: null,
    isAnimating: false,
    fullscreenPanel: null,
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePanelHover = useCallback((panelId: PanelId | null) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Debounce hover with 100ms delay
    hoverTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        expandedPanel: panelId,
        isAnimating: true,
      }));

      // Reset animation state after transition
      setTimeout(() => {
        setState(prev => ({ ...prev, isAnimating: false }));
      }, 300);
    }, 100);
  }, []);

  const handlePanelLeave = useCallback(() => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Debounce leave with 100ms delay
    hoverTimeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        expandedPanel: null,
        isAnimating: true,
      }));

      setTimeout(() => {
        setState(prev => ({ ...prev, isAnimating: false }));
      }, 300);
    }, 100);
  }, []);

  const handleFullscreen = useCallback((panelId: PanelId | null) => {
    setState(prev => ({
      ...prev,
      fullscreenPanel: panelId,
    }));
  }, []);

  const getPanelTransform = useCallback((panelId: PanelId) => {
    if (state.fullscreenPanel === panelId) return 'scale(1)';
    if (state.expandedPanel === panelId) return 'scaleX(2.4)';
    if (state.expandedPanel && state.expandedPanel !== panelId) return 'translateX(200px) scale(0.18)';
    return 'scale(1)';
  }, [state.expandedPanel, state.fullscreenPanel]);

  const getPanelWidth = useCallback((panelId: PanelId) => {
    if (state.expandedPanel === panelId) return 'w-[80%]';
    if (state.expandedPanel && state.expandedPanel !== panelId) return 'w-[60px]';
    return 'w-[33.333%]';
  }, [state.expandedPanel]);

  const isPanelCollapsed = useCallback((panelId: PanelId) => {
    return state.expandedPanel && state.expandedPanel !== panelId;
  }, [state.expandedPanel]);

  const isFullscreen = useCallback((panelId: PanelId) => {
    return state.fullscreenPanel === panelId;
  }, [state.fullscreenPanel]);

  return {
    expandedPanel: state.expandedPanel,
    isAnimating: state.isAnimating,
    fullscreenPanel: state.fullscreenPanel,
    handlePanelHover,
    handlePanelLeave,
    handleFullscreen,
    setFullscreenPanel: handleFullscreen, // Add this alias for backward compatibility
    getPanelTransform,
    getPanelWidth,
    isPanelCollapsed,
    isFullscreen,
  };
};
