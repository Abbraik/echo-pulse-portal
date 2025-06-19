
import React from 'react';
import { Risk, Anomaly } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface HealthRiskPanelProps {
  risks: Risk[];
  anomalies: Anomaly[];
}

const HealthRiskPanel: React.FC<HealthRiskPanelProps> = ({ risks, anomalies }) => {
  return (
    <div className="space-y-6">
      {/* Risk Matrix Preview */}
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Risk Matrix</h4>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="space-y-2">
            {risks.slice(0, 3).map((risk) => (
              <div key={risk.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-xs text-white">{risk.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Badge variant="outline" className="text-xs">
                    I: {(risk.impact * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    L: {(risk.likelihood * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anomalies */}
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Recent Anomalies</h4>
        <div className="space-y-2">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {anomaly.deviation > 0 ? (
                  <TrendingUp size={14} className="text-green-400" />
                ) : (
                  <TrendingDown size={14} className="text-red-400" />
                )}
                <div>
                  <span className="text-sm text-white">{anomaly.indicator}</span>
                  <div className="text-xs text-gray-400">
                    {new Date(anomaly.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <Badge 
                className={anomaly.deviation > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
              >
                {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}%
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthRiskPanel;
