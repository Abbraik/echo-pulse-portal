
import { useState, useEffect } from 'react';

type PanelType = 'approvals' | 'health' | 'coordination' | 'toolbox' | 'canvas' | 'simulation' | 'results' | null;

export const useFullscreenPanel = () => {
  const [fullscreenPanel, setFullscreenPanel] = useState<PanelType>(null);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenPanel) {
        setFullscreenPanel(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullscreenPanel]);

  // Session storage for state persistence
  useEffect(() => {
    const saved = sessionStorage.getItem('fullscreen-panel');
    if (saved && saved !== 'null') {
      setFullscreenPanel(saved as PanelType);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('fullscreen-panel', fullscreenPanel || 'null');
  }, [fullscreenPanel]);

  const toggleFullscreen = (panel: PanelType) => {
    setFullscreenPanel(fullscreenPanel === panel ? null : panel);
  };

  const exitFullscreen = () => {
    setFullscreenPanel(null);
  };

  const isFullscreen = (panel: PanelType) => {
    return fullscreenPanel === panel;
  };

  return {
    fullscreenPanel,
    toggleFullscreen,
    exitFullscreen,
    isFullscreen,
  };
};
