
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Search, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PanelHeader from '../shared/PanelHeader';

interface SystemHealthRiskPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isHovered: boolean;
}

const anomalies = [
  { id: '1', title: 'DEI Score Deviation', impact: 'High', confidence: 92 },
  { id: '2', title: 'Resource Allocation Variance', impact: 'Medium', confidence: 78 },
  { id: '3', title: 'Communication Pattern Shift', impact: 'Low', confidence: 65 }
];

const kpiMetrics = [
  { name: 'DEI Index', value: 78.5, unit: '%' },
  { name: 'Migration Flow', value: 12.3, unit: 'K' },
  { name: 'Resource Efficiency', value: 89.2, unit: '%' }
];

const SystemHealthRiskPanel: React.FC<SystemHealthRiskPanelProps> = ({
  isFullscreen,
  onToggleFullscreen,
  isHovered
}) => {
  const [draggedRisk, setDraggedRisk] = useState<string | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="System Health & Risk"
        subtitle="Anomaly Detection"
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div className="flex-1 p-4 space-y-4">
        {/* Risk Matrix */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3">Risk Matrix</h4>
          <div className="relative h-24 bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-red-500/10 rounded-lg border border-white/10">
            <div className="absolute inset-2 grid grid-cols-3 grid-rows-3 gap-1">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded border border-white/10 flex items-center justify-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full opacity-60"></div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-1 left-1 text-xs text-gray-400">Low Impact</div>
            <div className="absolute top-1 right-1 text-xs text-gray-400">High Likelihood</div>
          </div>
        </div>

        {/* Anomaly Detector */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <Activity size={14} className="mr-2" />
            Top Anomalies
          </h4>
          <div className="space-y-2">
            {anomalies.map((anomaly) => (
              <motion.div
                key={anomaly.id}
                className="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                whileHover={{ scale: 1.02, boxShadow: '0 0 8px rgba(20,184,166,0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{anomaly.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs ${getImpactColor(anomaly.impact)}`}>
                        {anomaly.impact} Impact
                      </span>
                      <span className="text-xs text-gray-400">{anomaly.confidence}% confidence</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-teal-400"
                  >
                    <Search size={12} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live KPI Ticker */}
        <div>
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <TrendingUp size={14} className="mr-2" />
            Live KPIs
          </h4>
          <div className="bg-white/5 rounded-lg p-2 overflow-hidden">
            <motion.div
              className="flex space-x-4"
              animate={{ x: [-100, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              {kpiMetrics.map((metric, index) => (
                <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="text-sm font-medium text-teal-400">{metric.name}:</span>
                  <span className="text-sm text-white">{metric.value}{metric.unit}</span>
                  {index < kpiMetrics.length - 1 && (
                    <span className="text-gray-400">•</span>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthRiskPanel;
