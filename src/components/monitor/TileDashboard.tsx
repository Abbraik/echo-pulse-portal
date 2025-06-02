
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Import existing tile components
import { DEIStabilityTile } from './tiles/DEIStabilityTile';
import { SystemTrendsTile } from './tiles/SystemTrendsTile';
import { BundleTile } from './tiles/BundleTile';
import { ScenarioKPITile } from './tiles/ScenarioKPITile';
import { ClaimsTile } from './tiles/ClaimsTile';
import { HandoffTile } from './tiles/HandoffTile';
import { EntropyTile } from './tiles/EntropyTile';
import { AlertsTile } from './tiles/AlertsTile';
import { RiskMatrixTile } from './tiles/RiskMatrixTile';

// Import new weight 4 tiles
import { ResourceMarketTile } from './tiles/ResourceMarketTile';
import { SocialOutcomesTile } from './tiles/SocialOutcomesTile';

// Import new weight 2 tiles
import { PopulationDeviationTile } from './tiles/PopulationDeviationTile';
import { ResourceStockTile } from './tiles/ResourceStockTile';
import { RenewalConsumptionTile } from './tiles/RenewalConsumptionTile';
import { ExtractionPressureTile } from './tiles/ExtractionPressureTile';
import { PriceDeviationTile } from './tiles/PriceDeviationTile';
import { CapacityUtilizationTile } from './tiles/CapacityUtilizationTile';
import { EmploymentRateTile } from './tiles/EmploymentRateTile';
import { EducationCompletionTile } from './tiles/EducationCompletionTile';
import { HealthStatusTile } from './tiles/HealthStatusTile';
import { LivingConditionsTile } from './tiles/LivingConditionsTile';
import { HouseholdRevenueTile } from './tiles/HouseholdRevenueTile';
import { EnvironmentalQualityTile } from './tiles/EnvironmentalQualityTile';

// Import weight 1 tiles
import { KPISummaryTile } from './tiles/KPISummaryTile';

import { CollapsedTilesStrip } from './tiles/CollapsedTilesStrip';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface TileState {
  id: string;
  weight: number;
  isCollapsed: boolean;
  isFullScreen: boolean;
}

export const TileDashboard: React.FC = () => {
  const [tileStates, setTileStates] = useState<TileState[]>([
    // Weight 5 tiles (2x2)
    { id: 'dei-stability', weight: 5, isCollapsed: false, isFullScreen: false },
    { id: 'alerts', weight: 5, isCollapsed: false, isFullScreen: false },
    
    // Weight 4 tiles (2x1)
    { id: 'system-trends', weight: 4, isCollapsed: false, isFullScreen: false },
    { id: 'scenario-kpi', weight: 4, isCollapsed: false, isFullScreen: false },
    { id: 'entropy', weight: 4, isCollapsed: false, isFullScreen: false },
    { id: 'resource-market', weight: 4, isCollapsed: false, isFullScreen: false },
    { id: 'social-outcomes', weight: 4, isCollapsed: false, isFullScreen: false },
    
    // Weight 3 tiles (1x1 or 1x2)
    { id: 'bundle-infra', weight: 3, isCollapsed: false, isFullScreen: false },
    { id: 'bundle-climate', weight: 3, isCollapsed: false, isFullScreen: false },
    { id: 'bundle-education', weight: 3, isCollapsed: false, isFullScreen: false },
    { id: 'bundle-mobility', weight: 3, isCollapsed: false, isFullScreen: false },
    { id: 'claims', weight: 3, isCollapsed: false, isFullScreen: false },
    { id: 'handoff', weight: 3, isCollapsed: false, isFullScreen: false },
    { id: 'risk-matrix', weight: 3, isCollapsed: false, isFullScreen: false },
    
    // Weight 2 tiles (1x1)
    { id: 'population-deviation', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'resource-stock', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'renewal-consumption', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'extraction-pressure', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'price-deviation', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'capacity-utilization', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'employment-rate', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'education-completion', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'health-status', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'living-conditions', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'household-revenue', weight: 2, isCollapsed: false, isFullScreen: false },
    { id: 'environmental-quality', weight: 2, isCollapsed: false, isFullScreen: false },
    
    // Weight 1 tiles (1x1)
    { id: 'kpi-summary', weight: 1, isCollapsed: false, isFullScreen: false },
  ]);

  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({
    lg: [
      // Weight 5 tiles (2x2)
      { i: 'dei-stability', x: 0, y: 0, w: 2, h: 2 },
      { i: 'alerts', x: 4, y: 0, w: 2, h: 2 },
      
      // Weight 4 tiles (2x1)
      { i: 'system-trends', x: 2, y: 0, w: 2, h: 1 },
      { i: 'scenario-kpi', x: 2, y: 1, w: 2, h: 1 },
      { i: 'entropy', x: 0, y: 2, w: 2, h: 1 },
      { i: 'resource-market', x: 2, y: 2, w: 2, h: 1 },
      { i: 'social-outcomes', x: 4, y: 2, w: 2, h: 1 },
      
      // Weight 3 tiles (1x1)
      { i: 'bundle-infra', x: 0, y: 3, w: 1, h: 1 },
      { i: 'bundle-climate', x: 1, y: 3, w: 1, h: 1 },
      { i: 'bundle-education', x: 2, y: 3, w: 1, h: 1 },
      { i: 'bundle-mobility', x: 3, y: 3, w: 1, h: 1 },
      { i: 'claims', x: 4, y: 3, w: 1, h: 1 },
      { i: 'handoff', x: 5, y: 3, w: 1, h: 1 },
      { i: 'risk-matrix', x: 0, y: 4, w: 1, h: 1 },
      
      // Weight 2 tiles (1x1)
      { i: 'population-deviation', x: 1, y: 4, w: 1, h: 1 },
      { i: 'resource-stock', x: 2, y: 4, w: 1, h: 1 },
      { i: 'renewal-consumption', x: 3, y: 4, w: 1, h: 1 },
      { i: 'extraction-pressure', x: 4, y: 4, w: 1, h: 1 },
      { i: 'price-deviation', x: 5, y: 4, w: 1, h: 1 },
      { i: 'capacity-utilization', x: 0, y: 5, w: 1, h: 1 },
      { i: 'employment-rate', x: 1, y: 5, w: 1, h: 1 },
      { i: 'education-completion', x: 2, y: 5, w: 1, h: 1 },
      { i: 'health-status', x: 3, y: 5, w: 1, h: 1 },
      { i: 'living-conditions', x: 4, y: 5, w: 1, h: 1 },
      { i: 'household-revenue', x: 5, y: 5, w: 1, h: 1 },
      { i: 'environmental-quality', x: 0, y: 6, w: 1, h: 1 },
      
      // Weight 1 tiles (1x1)
      { i: 'kpi-summary', x: 1, y: 6, w: 1, h: 1 },
    ],
    md: [
      // 4 column layout for tablets
      { i: 'dei-stability', x: 0, y: 0, w: 2, h: 2 },
      { i: 'alerts', x: 2, y: 0, w: 2, h: 2 },
      { i: 'system-trends', x: 0, y: 2, w: 2, h: 1 },
      { i: 'scenario-kpi', x: 2, y: 2, w: 2, h: 1 },
      { i: 'entropy', x: 0, y: 3, w: 2, h: 1 },
      { i: 'resource-market', x: 2, y: 3, w: 2, h: 1 },
      { i: 'social-outcomes', x: 0, y: 4, w: 2, h: 1 },
      // Continue with weight 3 and 2 tiles...
    ],
    sm: [
      // 2 column layout for mobile
      { i: 'dei-stability', x: 0, y: 0, w: 2, h: 2 },
      { i: 'alerts', x: 0, y: 2, w: 2, h: 2 },
      { i: 'system-trends', x: 0, y: 4, w: 2, h: 1 },
      { i: 'scenario-kpi', x: 0, y: 5, w: 2, h: 1 },
      // Continue with other tiles...
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
      // Weight 5 tiles
      case 'dei-stability':
        return <DEIStabilityTile key={tileId} {...commonProps} />;
      case 'alerts':
        return <AlertsTile key={tileId} {...commonProps} />;
      
      // Weight 4 tiles
      case 'system-trends':
        return <SystemTrendsTile key={tileId} {...commonProps} />;
      case 'scenario-kpi':
        return <ScenarioKPITile key={tileId} {...commonProps} />;
      case 'entropy':
        return <EntropyTile key={tileId} {...commonProps} />;
      case 'resource-market':
        return <ResourceMarketTile key={tileId} {...commonProps} />;
      case 'social-outcomes':
        return <SocialOutcomesTile key={tileId} {...commonProps} />;
      
      // Weight 3 tiles
      case 'bundle-infra':
      case 'bundle-climate':
      case 'bundle-education':
      case 'bundle-mobility':
        const bundleInfo = bundleData.find(b => b.id === tileId);
        return <BundleTile key={tileId} {...commonProps} bundle={bundleInfo!} />;
      case 'claims':
        return <ClaimsTile key={tileId} {...commonProps} />;
      case 'handoff':
        return <HandoffTile key={tileId} {...commonProps} />;
      case 'risk-matrix':
        return <RiskMatrixTile key={tileId} {...commonProps} />;
      
      // Weight 2 tiles
      case 'population-deviation':
        return <PopulationDeviationTile key={tileId} {...commonProps} />;
      case 'resource-stock':
        return <ResourceStockTile key={tileId} {...commonProps} />;
      case 'renewal-consumption':
        return <RenewalConsumptionTile key={tileId} {...commonProps} />;
      case 'extraction-pressure':
        return <ExtractionPressureTile key={tileId} {...commonProps} />;
      case 'price-deviation':
        return <PriceDeviationTile key={tileId} {...commonProps} />;
      case 'capacity-utilization':
        return <CapacityUtilizationTile key={tileId} {...commonProps} />;
      case 'employment-rate':
        return <EmploymentRateTile key={tileId} {...commonProps} />;
      case 'education-completion':
        return <EducationCompletionTile key={tileId} {...commonProps} />;
      case 'health-status':
        return <HealthStatusTile key={tileId} {...commonProps} />;
      case 'living-conditions':
        return <LivingConditionsTile key={tileId} {...commonProps} />;
      case 'household-revenue':
        return <HouseholdRevenueTile key={tileId} {...commonProps} />;
      case 'environmental-quality':
        return <EnvironmentalQualityTile key={tileId} {...commonProps} />;
      
      // Weight 1 tiles
      case 'kpi-summary':
        return <KPISummaryTile key={tileId} {...commonProps} />;
      
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="w-full min-h-full rounded-2xl backdrop-blur-[24px] border border-white/20 overflow-hidden p-6 relative"
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

      <div className="w-full min-h-full relative">
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
          autoSize={true}
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
