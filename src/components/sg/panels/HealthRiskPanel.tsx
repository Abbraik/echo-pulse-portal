
import React from 'react';
import { Risk, Anomaly } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, TrendingUp, Shield } from 'lucide-react';

interface HealthRiskPanelProps {
  risks: Risk[];
  anomalies: Anomaly[];
  actions?: {
    updateRisk: (id: string, impact: number, likelihood: number) => Promise<void>;
  };
}

const HealthRiskPanel: React.FC<HealthRiskPanelProps> = ({ risks, anomalies, actions }) => {
  const getRiskScore = (risk: Risk) => {
    return (risk.impact * risk.likelihood * 100).toFixed(0);
  };

  const getRiskColor = (score: number) => {
    if (score >= 60) return 'text-red-400';
    if (score >= 40) return 'text-orange-400';
    if (score >= 20) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleUpdateRisk = async (risk: Risk) => {
    if (actions?.updateRisk) {
      const newImpact = prompt(`Update impact for "${risk.name}" (0-1):`, risk.impact.toString());
      const newLikelihood = prompt(`Update likelihood for "${risk.name}" (0-1):`, risk.likelihood.toString());
      
      if (newImpact && newLikelihood) {
        const impact = parseFloat(newImpact);
        const likelihood = parseFloat(newLikelihood);
        
        if (impact >= 0 && impact <= 1 && likelihood >= 0 && likelihood <= 1) {
          await actions.updateRisk(risk.id, impact, likelihood);
        } else {
          alert('Values must be between 0 and 1');
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Matrix Preview */}
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Risk Matrix</h4>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="space-y-2">
            {risks.slice(0, 4).map((risk) => {
              const score = parseInt(getRiskScore(risk));
              return (
                <div key={risk.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-2 flex-1">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <div className="flex-1">
                      <span className="text-xs text-white">{risk.name}</span>
                      {risk.category && (
                        <div className="text-xs text-gray-400">{risk.category}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <Badge variant="outline" className="text-xs">
                        I: {(risk.impact * 100).toFixed(0)}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        L: {(risk.likelihood * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <div className={`text-xs font-bold ${getRiskColor(score)}`}>
                      {score}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleUpdateRisk(risk)}
                    >
                      <Shield size={12} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Anomalies */}
      <div>
        <h4 className="text-sm font-medium text-teal-400 mb-3">Recent Anomalies</h4>
        <div className="space-y-2">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                {anomaly.deviation > 0 ? (
                  <TrendingUp size={14} className="text-green-400" />
                ) : (
                  <TrendingDown size={14} className="text-red-400" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white">{anomaly.indicator}</span>
                    {anomaly.zone && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-1 rounded">
                        {anomaly.zone}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </div>
                  {anomaly.severity && (
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity}
                    </Badge>
                  )}
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
