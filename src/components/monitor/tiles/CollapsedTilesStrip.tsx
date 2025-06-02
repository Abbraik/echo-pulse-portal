
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Gauge, 
  TrendingUp, 
  Package, 
  BarChart3, 
  AlertTriangle, 
  ArrowRightLeft, 
  Activity, 
  Bell, 
  Grid2X2 
} from 'lucide-react';

interface CollapsedTile {
  id: string;
  isCollapsed: boolean;
}

interface CollapsedTilesStripProps {
  collapsedTiles: CollapsedTile[];
  onRestore: (tileId: string) => void;
}

export const CollapsedTilesStrip: React.FC<CollapsedTilesStripProps> = ({
  collapsedTiles,
  onRestore,
}) => {
  const getIconForTile = (tileId: string) => {
    switch (tileId) {
      case 'dei-stability': return <Gauge size={24} />;
      case 'system-trends': return <TrendingUp size={24} />;
      case 'bundle-infra':
      case 'bundle-climate':
      case 'bundle-education':
      case 'bundle-mobility': return <Package size={24} />;
      case 'scenario-kpi': return <BarChart3 size={24} />;
      case 'claims': return <AlertTriangle size={24} />;
      case 'handoff': return <ArrowRightLeft size={24} />;
      case 'entropy': return <Activity size={24} />;
      case 'alerts': return <Bell size={24} />;
      case 'risk-matrix': return <Grid2X2 size={24} />;
      default: return <Package size={24} />;
    }
  };

  const getTitleForTile = (tileId: string) => {
    switch (tileId) {
      case 'dei-stability': return 'DEI Stability';
      case 'system-trends': return 'System Trends';
      case 'bundle-infra': return 'Infrastructure Dev';
      case 'bundle-climate': return 'Climate Resilience';
      case 'bundle-education': return 'Education Reform';
      case 'bundle-mobility': return 'Smart Mobility';
      case 'scenario-kpi': return 'Scenario & KPIs';
      case 'claims': return 'Claims';
      case 'handoff': return 'Handoff';
      case 'entropy': return 'Zone Entropy';
      case 'alerts': return 'System Alerts';
      case 'risk-matrix': return 'Risk Matrix';
      default: return 'Unknown Tile';
    }
  };

  if (collapsedTiles.length === 0) return null;

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-20 p-3 rounded-b-2xl overflow-x-auto"
      style={{
        background: 'rgba(10, 20, 40, 0.8)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(20, 184, 166, 0.3)'
      }}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 h-full">
        {collapsedTiles.map((tile, index) => (
          <Tooltip key={tile.id}>
            <TooltipTrigger asChild>
              <motion.button
                className="w-14 h-14 rounded-xl border border-teal-500/30 bg-teal-500/10 flex items-center justify-center text-teal-400 hover:bg-teal-500/20 transition-colors"
                onClick={() => onRestore(tile.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {getIconForTile(tile.id)}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              Restore {getTitleForTile(tile.id)}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </motion.div>
  );
};
