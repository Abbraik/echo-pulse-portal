
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import tile components
import { DEIStabilityTile } from './tiles/DEIStabilityTile';
import { SystemTrendsTile } from './tiles/SystemTrendsTile';
import { BundleTile } from './tiles/BundleTile';
import { ScenarioKPITile } from './tiles/ScenarioKPITile';
import { ClaimsTile } from './tiles/ClaimsTile';
import { HandoffTile } from './tiles/HandoffTile';
import { EntropyTile } from './tiles/EntropyTile';
import { AlertsTile } from './tiles/AlertsTile';
import { RiskMatrixTile } from './tiles/RiskMatrixTile';
import { CollapsedTilesStrip } from './tiles/CollapsedTilesStrip';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface TileState {
  id: string;
  isCollapsed: boolean;
  isFullScreen: boolean;
}

export const TileDashboard: React.FC = () => {
  const [tileStates, setTileStates] = useState<TileState[]>([
    { id: 'dei-stability', isCollapsed: false, isFullScreen: false },
    { id: 'system-trends', isCollapsed: false, isFullScreen: false },
    { id: 'bundle-infra', isCollapsed: false, isFullScreen: false },
    { id: 'bundle-climate', isCollapsed: false, isFullScreen: false },
    { id: 'bundle-education', isCollapsed: false, isFullScreen: false },
    { id: 'bundle-mobility', isCollapsed: false, isFullScreen: false },
    { id: 'scenario-kpi', isCollapsed: false, isFullScreen: false },
    { id: 'claims', isCollapsed: false, isFullScreen: false },
    { id: 'handoff', isCollapsed: false, isFullScreen: false },
    { id: 'entropy', isCollapsed: false, isFullScreen: false },
    { id: 'alerts', isCollapsed: false, isFullScreen: false },
    { id: 'risk-matrix', isCollapsed: false, isFullScreen: false },
  ]);

  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({
    lg: [
      { i: 'dei-stability', x: 0, y: 0, w: 2, h: 2 },
      { i: 'system-trends', x: 2, y: 0, w: 2, h: 1 },
      { i: 'bundle-infra', x: 4, y: 0, w: 1, h: 1 },
      { i: 'bundle-climate', x: 5, y: 0, w: 1, h: 1 },
      { i: 'bundle-education', x: 4, y: 1, w: 1, h: 1 },
      { i: 'bundle-mobility', x: 5, y: 1, w: 1, h: 1 },
      { i: 'scenario-kpi', x: 2, y: 1, w: 2, h: 1 },
      { i: 'claims', x: 0, y: 2, w: 1, h: 1 },
      { i: 'handoff', x: 1, y: 2, w: 1, h: 1 },
      { i: 'entropy', x: 2, y: 2, w: 2, h: 1 },
      { i: 'alerts', x: 4, y: 2, w: 2, h: 2 },
      { i: 'risk-matrix', x: 0, y: 3, w: 1, h: 1 },
    ],
    md: [
      { i: 'dei-stability', x: 0, y: 0, w: 2, h: 2 },
      { i: 'system-trends', x: 2, y: 0, w: 2, h: 1 },
      { i: 'bundle-infra', x: 0, y: 2, w: 1, h: 1 },
      { i: 'bundle-climate', x: 1, y: 2, w: 1, h: 1 },
      { i: 'bundle-education', x: 2, y: 2, w: 1, h: 1 },
      { i: 'bundle-mobility', x: 3, y: 2, w: 1, h: 1 },
      { i: 'scenario-kpi', x: 2, y: 1, w: 2, h: 1 },
      { i: 'claims', x: 0, y: 3, w: 1, h: 1 },
      { i: 'handoff', x: 1, y: 3, w: 1, h: 1 },
      { i: 'entropy', x: 0, y: 4, w: 2, h: 1 },
      { i: 'alerts', x: 2, y: 3, w: 2, h: 2 },
      { i: 'risk-matrix', x: 2, y: 4, w: 1, h: 1 },
    ],
    sm: [
      { i: 'dei-stability', x: 0, y: 0, w: 2, h: 2 },
      { i: 'system-trends', x: 0, y: 2, w: 2, h: 1 },
      { i: 'bundle-infra', x: 0, y: 3, w: 1, h: 1 },
      { i: 'bundle-climate', x: 1, y: 3, w: 1, h: 1 },
      { i: 'bundle-education', x: 0, y: 4, w: 1, h: 1 },
      { i: 'bundle-mobility', x: 1, y: 4, w: 1, h: 1 },
      { i: 'scenario-kpi', x: 0, y: 5, w: 2, h: 1 },
      { i: 'claims', x: 0, y: 6, w: 1, h: 1 },
      { i: 'handoff', x: 1, y: 6, w: 1, h: 1 },
      { i: 'entropy', x: 0, y: 7, w: 2, h: 1 },
      { i: 'alerts', x: 0, y: 8, w: 2, h: 2 },
      { i: 'risk-matrix', x: 0, y: 10, w: 1, h: 1 },
    ],
  });

  const breakpoints = { lg: 1280, md: 1024, sm: 600, xs: 0 };
  const cols = { lg: 6, md: 4, sm: 2, xs: 2 };

  const handleCollapse = (tileId: string) => {
    setTileStates(prev => 
      prev.map(tile => 
        tile.id === tileId 
          ? { ...tile, isCollapsed: !tile.isCollapsed }
          : tile
      )
    );
  };

  const handleFullScreen = (tileId: string) => {
    setTileStates(prev => 
      prev.map(tile => 
        tile.id === tileId 
          ? { ...tile, isFullScreen: !tile.isFullScreen }
          : { ...tile, isFullScreen: false }
      )
    );
  };

  const handleLayoutChange = (layout: Layout[], layouts: { [key: string]: Layout[] }) => {
    setLayouts(layouts);
  };

  const visibleTiles = tileStates.filter(tile => !tile.isCollapsed);
  const collapsedTiles = tileStates.filter(tile => tile.isCollapsed);
  const fullScreenTile = tileStates.find(tile => tile.isFullScreen);

  const bundleData = [
    { id: 'bundle-infra', name: 'Infrastructure Dev', success: 72, roi: 15, time: 8 },
    { id: 'bundle-climate', name: 'Climate Resilience', success: 85, roi: 20, time: 5 },
    { id: 'bundle-education', name: 'Education Reform', success: 60, roi: 8, time: 10 },
    { id: 'bundle-mobility', name: 'Smart Mobility', success: 90, roi: 25, time: 6 },
  ];

  const renderTile = (tileId: string) => {
    const tileState = tileStates.find(t => t.id === tileId);
    if (!tileState || tileState.isCollapsed) return null;

    const commonProps = {
      onCollapse: () => handleCollapse(tileId),
      onFullScreen: () => handleFullScreen(tileId),
      isFullScreen: tileState.isFullScreen,
    };

    switch (tileId) {
      case 'dei-stability':
        return <DEIStabilityTile key={tileId} {...commonProps} />;
      case 'system-trends':
        return <SystemTrendsTile key={tileId} {...commonProps} />;
      case 'bundle-infra':
      case 'bundle-climate':
      case 'bundle-education':
      case 'bundle-mobility':
        const bundleInfo = bundleData.find(b => b.id === tileId);
        return <BundleTile key={tileId} {...commonProps} bundle={bundleInfo!} />;
      case 'scenario-kpi':
        return <ScenarioKPITile key={tileId} {...commonProps} />;
      case 'claims':
        return <ClaimsTile key={tileId} {...commonProps} />;
      case 'handoff':
        return <HandoffTile key={tileId} {...commonProps} />;
      case 'entropy':
        return <EntropyTile key={tileId} {...commonProps} />;
      case 'alerts':
        return <AlertsTile key={tileId} {...commonProps} />;
      case 'risk-matrix':
        return <RiskMatrixTile key={tileId} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="w-full h-[800px] rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden p-6 relative"
      style={{
        background: 'rgba(10, 20, 40, 0.6)',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.4)'
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {fullScreenTile && (
        <motion.div
          className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-full h-full p-6">
            {renderTile(fullScreenTile.id)}
          </div>
        </motion.div>
      )}

      <div className="w-full h-full relative">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={120}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          isDraggable={true}
          isResizable={true}
          useCSSTransforms={true}
          compactType="vertical"
          preventCollision={false}
        >
          {visibleTiles.map(tile => (
            <div key={tile.id} className="relative">
              {renderTile(tile.id)}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {collapsedTiles.length > 0 && (
        <CollapsedTilesStrip
          collapsedTiles={collapsedTiles}
          onRestore={handleCollapse}
        />
      )}
    </motion.div>
  );
};
