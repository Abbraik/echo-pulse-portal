
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SparklineChart from '@/components/think/components/SparklineChart';

interface ResourceMarketTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const ResourceMarketTile: React.FC<ResourceMarketTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const resourceData = {
    stockVsTarget: 0.92,
    renewalRate: 1.05,
    consumptionRate: 1.00,
    extractionPressure: 0.35,
    subIndicators: {
      water: { value: 130, trend: 'down' },
      energyPerGDP: { value: 68, trend: 'stable' },
      agriculturalYield: { value: 72, trend: 'up' }
    }
  };

  const progress = (resourceData.stockVsTarget * 100);
  const radius = isFullScreen ? 60 : 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Resource Market Overview"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-between">
              {/* Resource Stock Gauge */}
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <svg width={(radius * 2) + 8} height={(radius * 2) + 8} className="transform -rotate-90">
                    <circle
                      cx={radius + 4}
                      cy={radius + 4}
                      r={radius}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="4"
                    />
                    <motion.circle
                      cx={radius + 4}
                      cy={radius + 4}
                      r={radius}
                      fill="none"
                      stroke="#00FFC3"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      initial={{ strokeDashoffset: strokeDasharray }}
                      animate={{ strokeDashoffset }}
                      transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-sm font-bold text-teal-400">
                      {resourceData.stockVsTarget.toFixed(2)}×
                    </div>
                    <div className="text-xs text-gray-300">Stock vs Target</div>
                  </div>
                </div>
              </div>

              {/* Renewal vs Consumption Bar */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Renewal vs Consumption</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-400 h-2 rounded-full" style={{ width: '52%' }} />
                  </div>
                  <div className="text-xs text-gray-300">
                    {resourceData.renewalRate.toFixed(2)}× / {resourceData.consumptionRate.toFixed(2)}×
                  </div>
                </div>
              </div>

              {/* Extraction Pressure */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Extraction Pressure</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-orange-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${resourceData.extractionPressure * 100}%` }}
                    transition={{ delay: 0.7, duration: 1 }}
                  />
                </div>
                <div className="text-xs text-orange-400 mt-1">{resourceData.extractionPressure.toFixed(2)}</div>
              </div>

              {/* Sub-indicators */}
              <div className="text-xs text-gray-300">
                Water: {resourceData.subIndicators.water.value}
                {resourceData.subIndicators.water.trend === 'down' ? '↓' : 
                 resourceData.subIndicators.water.trend === 'up' ? '↑' : '→'}, 
                Energy/GDP: {resourceData.subIndicators.energyPerGDP.value}, 
                Agri Yield: {resourceData.subIndicators.agriculturalYield.value}↑
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-teal-400 mb-2">12-Month Stock Trend</h4>
                      <SparklineChart data={[0.88, 0.90, 0.91, 0.89, 0.92, 0.92]} width={200} height={40} color="#00FFC3" />
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-teal-400 mb-2">Renewal Rate</h4>
                      <SparklineChart data={[1.02, 1.03, 1.04, 1.05, 1.05, 1.05]} width={200} height={40} color="#10B981" />
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-orange-400 mb-2">Extraction Flow</h4>
                      <SparklineChart data={[0.30, 0.32, 0.34, 0.35, 0.35, 0.35]} width={200} height={40} color="#F97316" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Stock: {resourceData.stockVsTarget}×, Renewal: {resourceData.renewalRate}×, Extraction: {resourceData.extractionPressure}
      </TooltipContent>
    </Tooltip>
  );
};
