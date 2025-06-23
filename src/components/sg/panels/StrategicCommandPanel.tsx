
import React from 'react';
import { StrategicCommand } from '@/types/sg';
import Gauge from '@/components/ui/custom/Gauge';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface StrategicCommandPanelProps {
  data: StrategicCommand;
}

const StrategicCommandPanel: React.FC<StrategicCommandPanelProps> = ({ data }) => {
  const getDeltaFromTarget = (current: number, target: number) => {
    return current - target;
  };

  const formatDelta = (delta: number) => {
    const sign = delta >= 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)}`;
  };

  return (
    <div className="space-y-6">
      {/* DEI & Trust Gauges */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel-cinematic p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target size={16} className="text-teal-400 mr-2" />
            <h5 className="text-sm font-medium text-teal-400 font-noto">DEI Composite</h5>
          </div>
          <Gauge
            value={data.deiComposite.current}
            max={100}
            label=""
            color="teal"
            size="sm"
            showValue
          />
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs text-gray-400">Target:</span>
              <span className="text-xs text-white font-medium">{data.deiComposite.target}</span>
              {getDeltaFromTarget(data.deiComposite.current, data.deiComposite.target) >= 0 ? (
                <TrendingUp size={12} className="text-green-400" />
              ) : (
                <TrendingDown size={12} className="text-red-400" />
              )}
            </div>
            <div className={`text-xs font-medium ${
              getDeltaFromTarget(data.deiComposite.current, data.deiComposite.target) >= 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {formatDelta(getDeltaFromTarget(data.deiComposite.current, data.deiComposite.target))}
            </div>
          </div>
        </div>

        <div className="glass-panel-cinematic p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Activity size={16} className="text-blue-400 mr-2" />
            <h5 className="text-sm font-medium text-blue-400 font-noto">Trust Index</h5>
          </div>
          <Gauge
            value={data.trustIndex.current}
            max={100}
            label=""
            color="blue"
            size="sm"
            showValue
          />
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs text-gray-400">Target:</span>
              <span className="text-xs text-white font-medium">{data.trustIndex.target}</span>
              {getDeltaFromTarget(data.trustIndex.current, data.trustIndex.target) >= 0 ? (
                <TrendingUp size={12} className="text-green-400" />
              ) : (
                <TrendingDown size={12} className="text-red-400" />
              )}
            </div>
            <div className={`text-xs font-medium ${
              getDeltaFromTarget(data.trustIndex.current, data.trustIndex.target) >= 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {formatDelta(getDeltaFromTarget(data.trustIndex.current, data.trustIndex.target))}
            </div>
          </div>
        </div>
      </div>

      {/* PSI Scores */}
      <div className="glass-panel-cinematic p-4">
        <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
          <Activity size={14} className="mr-2" />
          PSI Alignment Scores
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data.psiScores).map(([key, value]) => (
            <div key={key} className="glass-panel p-3 hover:neon-border transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300 font-noto-medium">{key}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white font-noto">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entropy Trends Preview */}
      <div className="glass-panel-cinematic p-4">
        <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
          <TrendingUp size={14} className="mr-2" />
          Zone Entropy Dynamics
        </h4>
        <div className="space-y-3">
          {data.entropyTrends.map((trend) => (
            <div key={trend.zone} className="flex justify-between items-center group hover:bg-white/5 p-2 rounded-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-400" />
                <span className="text-sm text-gray-300 font-noto-medium">{trend.zone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-end space-x-0.5">
                  {trend.values.map((value, index) => (
                    <div
                      key={index}
                      className="w-1.5 bg-gradient-to-t from-teal-600 to-teal-400 rounded-sm transition-all duration-300 hover:from-teal-500 hover:to-teal-300"
                      style={{ height: `${Math.max(value * 24, 4)}px` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {(trend.values[trend.values.length - 1] * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategicCommandPanel;
