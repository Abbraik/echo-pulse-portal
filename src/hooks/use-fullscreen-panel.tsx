
import { useState } from 'react';

type PanelType = 'toolbox' | 'canvas' | 'simulation' | 'results' | null;

export const useFullscreenPanel = () => {
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
