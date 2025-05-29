
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { GlassMasonryCard } from './GlassMasonryCard';

const mockHealthData = {
  deiScore: 78.5,
  psiuDrift: 'moderate',
  alerts: [
    { id: '1', type: 'DEI Trending Down', severity: 'medium', zone: 'THINK' },
    { id: '2', type: 'PSIU Loop Closure Delayed', severity: 'high', zone: 'ACT' },
    { id: '3', type: 'Coordination Latency', severity: 'low', zone: 'MONITOR' }
  ]
};

export const LargeHealthCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="health-large" variant="large" type="health" {...props}>
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600 mb-6" style={{ fontFamily: 'Noto Sans' }}>
        System Health Overview
      </h3>
      
      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* DEI Score Gauge */}
        <div className="relative">
          <div className="text-center mb-4">
            <h4 className="text-sm font-medium text-teal-400 mb-2" style={{ fontFamily: 'Noto Sans' }}>DEI Score</h4>
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(20, 184, 166, 0.2)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(20, 184, 166, 1)"
                  strokeWidth="2"
                  strokeDasharray={`${mockHealthData.deiScore}, 100`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-teal-400">{mockHealthData.deiScore}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* PSIU Drift */}
        <div className="text-center">
          <h4 className="text-sm font-medium text-teal-400 mb-2" style={{ fontFamily: 'Noto Sans' }}>PSIU Drift</h4>
          <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
            <TrendingDown className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <span className="text-sm text-orange-400 capitalize">{mockHealthData.psiuDrift}</span>
          </div>
        </div>
      </div>
    </div>
  </GlassMasonryCard>
);

export const MediumHealthCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="health-medium" variant="medium" type="health" {...props}>
    <div className="h-full">
      <h4 className="text-sm font-semibold text-teal-400 mb-4" style={{ fontFamily: 'Noto Sans' }}>
        Critical Alerts
      </h4>
      
      <div className="space-y-3">
        {mockHealthData.alerts.slice(0, 3).map((alert) => (
          <motion.div
            key={alert.id}
            className="p-3 bg-white/5 rounded-lg border border-white/10"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white">{alert.type}</span>
              <Badge 
                className={`text-xs ${
                  alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                  alert.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {alert.severity}
              </Badge>
            </div>
            <span className="text-xs text-gray-400">{alert.zone} Zone</span>
          </motion.div>
        ))}
      </div>
    </div>
  </GlassMasonryCard>
);

export const SmallHealthCard: React.FC<any> = (props) => (
  <GlassMasonryCard cardId="health-small" variant="small" type="health" {...props}>
    <div className="h-full flex flex-col">
      <h4 className="text-sm font-semibold text-teal-400 mb-4" style={{ fontFamily: 'Noto Sans' }}>
        Entropy Trend
      </h4>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full h-16 relative">
          <svg className="w-full h-full" viewBox="0 0 200 60">
            <path
              d="M10,50 Q50,20 90,30 T170,25"
              stroke="rgba(20, 184, 166, 0.8)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M10,50 Q50,20 90,30 T170,25"
              stroke="url(#sparklineGradient)"
              strokeWidth="1"
              fill="none"
            />
            <defs>
              <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(20, 184, 166, 0.2)" />
                <stop offset="100%" stopColor="rgba(20, 184, 166, 0.8)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      <div className="text-center">
        <span className="text-xs text-gray-400">Last 7 days</span>
      </div>
    </div>
  </GlassMasonryCard>
);
