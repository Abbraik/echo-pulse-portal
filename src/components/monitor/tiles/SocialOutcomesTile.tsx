
import React from 'react';
import { motion } from 'framer-motion';
import { BaseTile } from './BaseTile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import SparklineChart from '@/components/think/components/SparklineChart';

interface SocialOutcomesTileProps {
  onCollapse: () => void;
  onFullScreen: () => void;
  isFullScreen?: boolean;
}

export const SocialOutcomesTile: React.FC<SocialOutcomesTileProps> = ({
  onCollapse,
  onFullScreen,
  isFullScreen = false,
}) => {
  const socialData = {
    socialIndex: 71,
    education: { value: 74, trend: 'stable' },
    health: { value: 82, trend: 'up' },
    cohesion: { value: 68, trend: 'up' },
    livingConditionsBaseline: 75,
    householdRevenue: 54, // in k AED
    livingConsumption: 30 // percentage
  };

  const progress = socialData.socialIndex;
  const radius = isFullScreen ? 60 : 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-full h-full">
          <BaseTile
            title="Social Outcomes Overview"
            onCollapse={onCollapse}
            onFullScreen={onFullScreen}
            isFullScreen={isFullScreen}
          >
            <div className="h-full flex flex-col justify-between">
              {/* Social Index Donut */}
              <div className="flex items-center justify-center mb-3">
                <div className="relative">
                  <svg width={(radius * 2) + 8} height={(radius * 2) + 8} className="transform -rotate-90">
                    <circle
                      cx={radius + 4}
                      cy={radius + 4}
                      r={radius}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx={radius + 4}
                      cy={radius + 4}
                      r={radius}
                      fill="none"
                      stroke="#00FFC3"
                      strokeWidth="6"
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
                      {socialData.socialIndex}%
                    </div>
                    <div className="text-xs text-gray-300">Social Index</div>
                  </div>
                </div>
              </div>

              {/* Key Sub-Indicators */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Education:</span>
                  <span className="text-xs text-teal-400">{socialData.education.value}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Health:</span>
                  <span className="text-xs text-teal-400">{socialData.health.value}↑</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-300">Cohesion:</span>
                  <span className="text-xs text-teal-400">{socialData.cohesion.value}↑</span>
                </div>
              </div>

              {/* Living Conditions Bar */}
              <div className="mb-2">
                <div className="text-xs text-gray-400 mb-1">Living Conditions</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-teal-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${socialData.livingConditionsBaseline}%` }}
                    transition={{ delay: 0.7, duration: 1 }}
                  />
                </div>
                <div className="text-xs text-teal-400 mt-1">{socialData.livingConditionsBaseline}% baseline</div>
              </div>

              {/* Revenue & Consumption */}
              <div className="text-xs text-gray-300">
                HH Revenue: {socialData.householdRevenue}k AED; Living Consumption: {socialData.livingConsumption}%
              </div>

              {isFullScreen && (
                <motion.div
                  className="mt-6 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-teal-400 mb-2">Education Trend</h4>
                      <SparklineChart data={[70, 72, 73, 74, 74, 74]} width={120} height={30} color="#00FFC3" />
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-teal-400 mb-2">Health Trend</h4>
                      <SparklineChart data={[78, 79, 80, 81, 82, 82]} width={120} height={30} color="#10B981" />
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-teal-400 mb-2">Living Consumption</h4>
                      <SparklineChart data={[28, 29, 30, 30, 30, 30]} width={120} height={30} color="#F59E0B" />
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="text-sm font-medium text-teal-400 mb-2">HH Revenue</h4>
                      <SparklineChart data={[50, 51, 52, 53, 54, 54]} width={120} height={30} color="#3B82F6" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </BaseTile>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Social Index: {socialData.socialIndex}%, Education: {socialData.education.value}, Health: {socialData.health.value}↑
      </TooltipContent>
    </Tooltip>
  );
};
