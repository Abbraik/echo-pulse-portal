
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DEIStabilityTile } from './mosaic/DEIStabilityTile';
import { BundleTile } from './mosaic/BundleTile';
import { ScenarioComboTile } from './mosaic/ScenarioComboTile';
import { ClaimsTile } from './mosaic/ClaimsTile';
import { HandoffTile } from './mosaic/HandoffTile';
import { EntropyTile } from './mosaic/EntropyTile';
import { AlertsTile } from './mosaic/AlertsTile';
import { RiskMatrixTile } from './mosaic/RiskMatrixTile';
import { CollapsedTilesStrip } from './mosaic/CollapsedTilesStrip';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface TileConfig {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
}

interface CollapsedTile {
  id: string;
  name: string;
  icon: string;
  originalLayout: TileConfig;
}

export const MosaicDashboard: React.FC = () => {
  const [fullScreenTile, setFullScreenTile] = useState<string | null>(null);
  const [collapsedTiles, setCollapsedTiles] = useState<CollapsedTile[]>([]);
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'dei', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: 'bundle1', x: 2, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'bundle2', x: 3, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'bundle3', x: 4, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'bundle4', x: 5, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'scenario', x: 2, y: 1, w: 2, h: 1, minW: 2, minH: 1, maxW: 4, maxH: 2 },
      { i: 'claims', x: 4, y: 1, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'handoff', x: 5, y: 1, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'entropy', x: 0, y: 2, w: 2, h: 1, minW: 2, minH: 1, maxW: 4, maxH: 2 },
      { i: 'alerts', x: 2, y: 2, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: 'risk', x: 4, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 }
    ],
    md: [
      { i: 'dei', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: 'bundle1', x: 2, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'bundle2', x: 3, y: 0, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'bundle3', x: 2, y: 1, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'bundle4', x: 3, y: 1, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'scenario', x: 0, y: 2, w: 2, h: 1, minW: 2, minH: 1, maxW: 4, maxH: 2 },
      { i: 'claims', x: 2, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'handoff', x: 3, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 },
      { i: 'entropy', x: 0, y: 3, w: 2, h: 1, minW: 2, minH: 1, maxW: 4, maxH: 2 },
      { i: 'alerts', x: 2, y: 3, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: 'risk', x: 0, y: 4, w: 1, h: 1, minW: 1, minH: 1, maxW: 2, maxH: 2 }
    ],
    sm: [
      { i: 'dei', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2, maxW: 2, maxH: 2 },
      { i: 'bundle1', x: 0, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1 },
      { i: 'bundle2', x: 1, y: 2, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1 },
      { i: 'bundle3', x: 0, y: 3, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1 },
      { i: 'bundle4', x: 1, y: 3, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1 },
      { i: 'scenario', x: 0, y: 4, w: 2, h: 1, minW: 2, minH: 1, maxW: 2, maxH: 1 },
      { i: 'claims', x: 0, y: 5, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1 },
      { i: 'handoff', x: 1, y: 5, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1 },
      { i: 'entropy', x: 0, y: 6, w: 2, h: 1, minW: 2, minH: 1, maxW: 2, maxH: 1 },
      { i: 'alerts', x: 0, y: 7, w: 2, h: 2, minW: 2, minH: 2, maxW: 2, maxH: 2 },
      { i: 'risk', x: 0, y: 9, w: 1, h: 1, minW: 1, minH: 1, maxW: 1, maxH: 1 }
    ]
  });

  const handleLayoutChange = useCallback((layout: any, layouts: any) => {
    setLayouts(layouts);
  }, []);

  const handleFullScreen = useCallback((tileId: string | null) => {
    setFullScreenTile(tileId);
  }, []);

  const handleCollapse = useCallback((tileId: string, tileName: string, icon: string) => {
    const currentLayout = layouts.lg.find(item => item.i === tileId);
    if (currentLayout) {
      setCollapsedTiles(prev => [...prev, {
        id: tileId,
        name: tileName,
        icon,
        originalLayout: currentLayout
      }]);
      
      // Remove from layouts
      setLayouts(prev => ({
        lg: prev.lg.filter(item => item.i !== tileId),
        md: prev.md.filter(item => item.i !== tileId),
        sm: prev.sm.filter(item => item.i !== tileId)
      }));
    }
  }, [layouts]);

  const handleRestore = useCallback((collapsedTile: CollapsedTile) => {
    setCollapsedTiles(prev => prev.filter(tile => tile.id !== collapsedTile.id));
    
    // Add back to layouts
    setLayouts(prev => ({
      lg: [...prev.lg, collapsedTile.originalLayout],
      md: [...prev.md, collapsedTile.originalLayout],
      sm: [...prev.sm, collapsedTile.originalLayout]
    }));
  }, []);

  const tileComponents = {
    dei: <DEIStabilityTile onFullScreen={handleFullScreen} onCollapse={handleCollapse} />,
    bundle1: <BundleTile 
      bundleId="bundle1" 
      bundleName="Infrastructure Dev" 
      success={72} 
      roi={15} 
      timeToDeployMonths={8}
      onFullScreen={handleFullScreen} 
      onCollapse={handleCollapse} 
    />,
    bundle2: <BundleTile 
      bundleId="bundle2" 
      bundleName="Climate Resilience" 
      success={85} 
      roi={20} 
      timeToDeployMonths={5}
      onFullScreen={handleFullScreen} 
      onCollapse={handleCollapse} 
    />,
    bundle3: <BundleTile 
      bundleId="bundle3" 
      bundleName="Education Reform" 
      success={60} 
      roi={8} 
      timeToDeployMonths={10}
      onFullScreen={handleFullScreen} 
      onCollapse={handleCollapse} 
    />,
    bundle4: <BundleTile 
      bundleId="bundle4" 
      bundleName="Smart Mobility" 
      success={90} 
      roi={25} 
      timeToDeployMonths={6}
      onFullScreen={handleFullScreen} 
      onCollapse={handleCollapse} 
    />,
    scenario: <ScenarioComboTile onFullScreen={handleFullScreen} onCollapse={handleCollapse} />,
    claims: <ClaimsTile onFullScreen={handleFullScreen} onCollapse={handleCollapse} />,
    handoff: <HandoffTile onFullScreen={handleFullScreen} onCollapse={handleCollapse} />,
    entropy: <EntropyTile onFullScreen={handleFullScreen} onCollapse={handleCollapse} />,
    alerts: <AlertsTile onFullScreen={handleFullScreen} onCollapse={handleCollapse} />,
    risk: <RiskMatrixTile onFullScreen={handleFullScreen} onCollapse={handleCollapse} />
  };

  const activeTiles = Object.keys(tileComponents).filter(
    tileId => !collapsedTiles.some(collapsed => collapsed.id === tileId)
  );

  return (
    <motion.div
      className="w-full h-full rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden p-6"
      style={{
        background: 'rgba(10, 20, 40, 0.6)',
        boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative w-full h-full">
        <AnimatePresence>
          {fullScreenTile && (
            <motion.div
              className="absolute inset-0 z-50 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setFullScreenTile(null)}
            >
              <motion.div
                className="w-full h-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
              >
                {tileComponents[fullScreenTile as keyof typeof tileComponents]}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 6, md: 4, sm: 2 }}
          rowHeight={120}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          isDraggable={true}
          isResizable={true}
          compactType="vertical"
          preventCollision={false}
        >
          {activeTiles.map(tileId => (
            <div 
              key={tileId} 
              className={`tile-container ${fullScreenTile ? 'pointer-events-none opacity-30' : ''}`}
            >
              {tileComponents[tileId as keyof typeof tileComponents]}
            </div>
          ))}
        </ResponsiveGridLayout>

        {collapsedTiles.length > 0 && (
          <CollapsedTilesStrip
            collapsedTiles={collapsedTiles}
            onRestore={handleRestore}
          />
        )}
      </div>
    </motion.div>
  );
};
