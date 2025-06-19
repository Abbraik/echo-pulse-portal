
import React from 'react';
import { StrategicCommand } from '@/types/sg';
import Gauge from '@/components/ui/custom/Gauge';

interface StrategicCommandPanelProps {
  data: StrategicCommand;
}

const StrategicCommandPanel: React.FC<StrategicCommandPanelProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* DEI & Trust Gauges */}
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <Gauge
            value={data.deiComposite.current}
            max={100}
            label="DEI Composite"
            color="teal"
            size="md"
            showValue
          />
          <div className="mt-2">
            <span className="text-xs text-gray-400">Target: {data.deiComposite.target}</span>
          </div>
        </div>
        <div className="text-center">
          <Gauge
            value={data.trustIndex.current}
            max={100}
            label="Trust Index"
            color="blue"
            size="md"
            showValue
          />
          <div className="mt-2">
            <span className="text-xs text-gray-400">Target: {data.trustIndex.target}</span>
          </div>
        </div>
      </div>

      {/* PSI Scores */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-teal-400">PSI Scores</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data.psiScores).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
              <span className="text-xs text-gray-300">{key}</span>
              <span className="text-sm font-medium text-white">{(value * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Entropy Trends Preview */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-teal-400">Zone Entropy</h4>
        <div className="space-y-2">
          {data.entropyTrends.map((trend) => (
            <div key={trend.zone} className="flex justify-between items-center">
              <span className="text-xs text-gray-300">{trend.zone}</span>
              <div className="flex items-center space-x-1">
                {trend.values.map((value, index) => (
                  <div
                    key={index}
                    className="w-2 h-8 bg-gradient-to-t from-teal-600 to-teal-400 rounded-sm"
                    style={{ height: `${value * 32}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrategicCommandPanel;
