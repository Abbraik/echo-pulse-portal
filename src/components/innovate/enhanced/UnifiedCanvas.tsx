
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { GitBranch, Network, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { LeveragePointSidebar } from './LeveragePointSidebar';
import { DelayVisualizer } from './DelayVisualizer';

interface UnifiedCanvasProps {
  viewMode: 'cld' | 'sna';
  onViewModeChange: (mode: 'cld' | 'sna') => void;
  overlayMode: boolean;
  onOverlayToggle: () => void;
}

export const UnifiedCanvas: React.FC<UnifiedCanvasProps> = ({
  viewMode,
  onViewModeChange,
  overlayMode,
  onOverlayToggle
}) => {
  const { t } = useTranslation();
  const [showLeveragePoints, setShowLeveragePoints] = useState(false);
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);

  return (
    <div className="relative h-full glass-panel">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-4">
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={onViewModeChange}
          className="glass-panel-deep"
        >
          <ToggleGroupItem value="cld" className="flex items-center gap-2">
            <GitBranch size={16} />
            <span className="hidden sm:inline">CLD</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="sna" className="flex items-center gap-2">
            <Network size={16} />
            <span className="hidden sm:inline">SNA</span>
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          size="sm"
          variant="outline"
          onClick={onOverlayToggle}
          className="glass-panel-deep flex items-center gap-2"
        >
          {overlayMode ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="hidden sm:inline">
            {overlayMode ? t('hideOverlay') : t('showOverlay')}
          </span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowLeveragePoints(!showLeveragePoints)}
          className="glass-panel-deep"
        >
          {t('leveragePoints')}
        </Button>
      </div>

      {/* Main Canvas Area */}
      <div className="h-full w-full relative overflow-hidden rounded-lg">
        <motion.div 
          className="absolute inset-0 bg-black/10 dark:bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Canvas content based on view mode */}
          {viewMode === 'cld' ? (
            <CLDCanvasContent 
              overlayMode={overlayMode}
              onFlowHover={setHoveredFlow}
            />
          ) : (
            <SNACanvasContent overlayMode={overlayMode} />
          )}
        </motion.div>

        {/* Delay Visualizer */}
        <AnimatePresence>
          {hoveredFlow && (
            <DelayVisualizer flowId={hoveredFlow} />
          )}
        </AnimatePresence>
      </div>

      {/* Leverage Point Sidebar */}
      <AnimatePresence>
        {showLeveragePoints && (
          <LeveragePointSidebar 
            onClose={() => setShowLeveragePoints(false)}
            viewMode={viewMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Mock canvas components - these would be enhanced versions of existing ones
const CLDCanvasContent: React.FC<{ 
  overlayMode: boolean; 
  onFlowHover: (flowId: string | null) => void;
}> = ({ overlayMode, onFlowHover }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">CLD Canvas</div>
        <div className="text-sm text-muted-foreground">
          {overlayMode ? 'Overlay Mode: ON' : 'Standard CLD View'}
        </div>
      </div>
    </div>
  );
};

const SNACanvasContent: React.FC<{ overlayMode: boolean }> = ({ overlayMode }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg font-medium mb-2">SNA Canvas</div>
        <div className="text-sm text-muted-foreground">
          {overlayMode ? 'Centrality Overlay: ON' : 'Standard SNA View'}
        </div>
      </div>
    </div>
  );
};
