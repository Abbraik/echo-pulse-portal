
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, ArrowRight, Info, BarChart3, Activity } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Gauge from '@/components/ui/custom/Gauge';
import { DeiDrillDownModal } from '@/components/monitor/DeiDrillDownModal';
import { BundleDetailModal } from '@/components/monitor/BundleDetailModal';
import { ScenarioComparisonModal } from '@/components/monitor/ScenarioComparisonModal';

export const StrategicOutcomesPanel: React.FC = () => {
  const { t } = useTranslation();
  const [showDeiModal, setShowDeiModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [showScenarioModal, setShowScenarioModal] = useState(false);

  // Mock data
  const deiStability = {
    current: 82,
    target: { min: 80, max: 85 },
    trend: [78, 79, 81, 83, 82, 82]
  };

  const bundles = [
    { id: 1, name: 'Infrastructure Dev', success: 72, roi: 15, time: 8, status: 'on-track' },
    { id: 2, name: 'Climate Resilience', success: 85, roi: 20, time: 5, status: 'on-track' },
    { id: 3, name: 'Education Reform', success: 60, roi: 8, time: 10, status: 'at-risk' },
    { id: 4, name: 'Smart Mobility', success: 90, roi: 25, time: 6, status: 'on-track' }
  ];

  const kpiHeatmap = [
    { name: 'Population Deviation', current: 0.2, target: 0, status: 'good' },
    { name: 'Resource Stock', current: 0.92, target: 0.90, status: 'good' },
    { name: 'Social Cohesion', current: 71, target: 75, status: 'warning' },
    { name: 'Trust Index', current: 68, target: 70, status: 'warning' },
    { name: 'Migration Flow', current: 2.3, target: 2.0, status: 'warning' },
    { name: 'Equity Index', current: 78, target: 80, status: 'good' }
  ];

  const scenarioData = {
    actual: [0.12, 0.11, 0.14, 0.10, 0.09, 0.11, 0.10, 0.08, 0.07, 0.06, 0.05, 0.04],
    scenario: [0.10, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01, 0.00, 0.00]
  };

  const handleBundleClick = (bundle: any) => {
    setSelectedBundle(bundle);
    setShowBundleModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-amber-500/20 text-amber-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full space-y-6">
      {/* DEI Stability & Trend (20% height) */}
      <motion.div 
        className="h-[20%] min-h-[120px] flex gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* DEI Stability Gauge */}
        <div className="flex-1">
          <motion.div
            className="glass-panel-deep p-4 h-full cursor-pointer transition-all duration-300"
            whileHover={{ y: -4, boxShadow: '0 0 30px rgba(20, 184, 166, 0.3)' }}
            onClick={() => setShowDeiModal(true)}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Gauge value={deiStability.current} size="lg" color="teal" showValue />
                <p className="text-xs text-gray-400 mt-2">
                  DEI Stability Band ({deiStability.target.min}%-{deiStability.target.max}%)
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* DEI Trend Sparkline */}
        <div className="flex-1">
          <motion.div
            className="glass-panel-deep p-4 h-full cursor-pointer transition-all duration-300"
            whileHover={{ y: -4 }}
          >
            <h4 className="text-sm font-medium text-gray-300 mb-3">6-Month Trend</h4>
            <div className="h-16 flex items-end gap-2">
              {deiStability.trend.map((value, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className="flex-1 bg-gradient-to-t from-teal-500/40 to-teal-400/60 rounded-sm cursor-pointer"
                      style={{ height: `${(value / 100) * 100}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / 100) * 100}%` }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Month {index + 1}: {value}%</span>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bundle Success & ROI Cards (40% height) */}
      <motion.div 
        className="h-[40%] min-h-[200px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-gray-200 mb-4 font-noto-medium">Bundle Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100%-40px)]">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              className="glass-panel-deep p-4 cursor-pointer transition-all duration-300 group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => handleBundleClick(bundle)}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white truncate">{bundle.name}</h4>
                  <Badge className={bundle.status === 'on-track' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                    {bundle.status === 'on-track' ? 'On Track' : 'At Risk'}
                  </Badge>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">KPI Success</span>
                      <span className="text-white">{bundle.success}%</span>
                    </div>
                    <Progress value={bundle.success} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">ROI</span>
                    <span className="text-sm font-medium text-green-400">+{bundle.roi}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Time to Deploy</span>
                    <span className="text-sm text-gray-300">{bundle.time} mo</span>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* KPI Heatmap & Scenario Validation (40% height) */}
      <motion.div 
        className="h-[40%] min-h-[200px] flex gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* KPI Heatmap */}
        <div className="flex-1">
          <div className="glass-panel-deep p-4 h-full">
            <h4 className="text-sm font-medium text-gray-300 mb-3">KPI Performance Heatmap</h4>
            <div className="grid grid-cols-2 gap-2 h-[calc(100%-40px)]">
              {kpiHeatmap.map((kpi, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${getStatusColor(kpi.status)}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-xs font-medium">{kpi.name}</div>
                      <div className="text-sm mt-1">{kpi.current}</div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <div>Current: {kpi.current}</div>
                      <div>Target: {kpi.target}</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario Comparator */}
        <div className="flex-1">
          <motion.div
            className="glass-panel-deep p-4 h-full cursor-pointer transition-all duration-300"
            whileHover={{ y: -4 }}
            onClick={() => setShowScenarioModal(true)}
          >
            <h4 className="text-sm font-medium text-gray-300 mb-3">Scenario vs Actual</h4>
            <div className="h-24 relative">
              <svg width="100%" height="100%" className="overflow-visible">
                {/* Scenario line (dashed) */}
                <path
                  d={`M 0 ${100 - (scenarioData.scenario[0] * 1000)} ${scenarioData.scenario.map((val, i) => 
                    `L ${(i / (scenarioData.scenario.length - 1)) * 100} ${100 - (val * 1000)}`
                  ).join(' ')}`}
                  stroke="rgba(59, 130, 246, 0.8)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
                
                {/* Actual line (solid) */}
                <path
                  d={`M 0 ${100 - (scenarioData.actual[0] * 1000)} ${scenarioData.actual.map((val, i) => 
                    `L ${(i / (scenarioData.actual.length - 1)) * 100} ${100 - (val * 1000)}`
                  ).join(' ')}`}
                  stroke="rgba(20, 184, 166, 1)"
                  strokeWidth="2"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-blue-400 mr-2"></div>
                <span className="text-gray-400">Scenario</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-teal-400 mr-2"></div>
                <span className="text-gray-400">Actual</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modals */}
      <DeiDrillDownModal 
        isOpen={showDeiModal} 
        onClose={() => setShowDeiModal(false)} 
        data={deiStability}
      />
      
      <BundleDetailModal 
        isOpen={showBundleModal} 
        onClose={() => setShowBundleModal(false)} 
        bundle={selectedBundle}
      />
      
      <ScenarioComparisonModal 
        isOpen={showScenarioModal} 
        onClose={() => setShowScenarioModal(false)} 
        data={scenarioData}
      />
    </div>
  );
};
