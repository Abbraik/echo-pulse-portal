
import { useState, useEffect } from 'react';

type PanelType = 'snapshot' | 'approvals' | 'health' | 'coordination' | 'zones' | 'think' | 'act' | 'monitor' | 'learn' | 'innovate' | null;

export const useFullscreenDashboard = () => {
  const [fullscreenPanel, setFullscreenPanel] = useState<PanelType>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('dashboard-fullscreen-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.lastPanel) {
          // Don't auto-restore fullscreen on page load, just remember the preference
        }
      } catch (error) {
        console.error('Error loading fullscreen state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (fullscreenPanel) {
      localStorage.setItem('dashboard-fullscreen-state', JSON.stringify({
        lastPanel: fullscreenPanel,
        timestamp: Date.now()
      }));
    }
  }, [fullscreenPanel]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreenPanel) {
        setFullscreenPanel(null);
      }
    };

    if (fullscreenPanel) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
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
