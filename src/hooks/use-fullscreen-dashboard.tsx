
import { useState } from 'react';

type PanelType = 'snapshot' | 'approvals' | 'health' | 'coordination' | 'zones' | null;

export const useFullscreenDashboard = () => {
  const [fullscreenPanel, setFullscreenPanel] = useState<PanelType>(null);

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
