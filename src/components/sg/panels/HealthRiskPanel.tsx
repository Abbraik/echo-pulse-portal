
import React from 'react';
import { Risk, Anomaly } from '@/types/sg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, TrendingUp, Shield, Activity, Zap, Target } from 'lucide-react';

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

  const getRiskBorderColor = (score: number) => {
    if (score >= 60) return 'border-red-500/30 hover:border-red-400/50';
    if (score >= 40) return 'border-orange-500/30 hover:border-orange-400/50';
    if (score >= 20) return 'border-yellow-500/30 hover:border-yellow-400/50';
    return 'border-green-500/30 hover:border-green-400/50';
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      <div className="glass-panel-cinematic p-4">
        <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
          <Target size={14} className="mr-2" />
          Risk Assessment Matrix
        </h4>
        <div className="space-y-3">
          {risks.slice(0, 4).map((risk) => {
            const score = parseInt(getRiskScore(risk));
            return (
              <div key={risk.id} className={`glass-panel p-3 border transition-all duration-300 group hover:neon-border ${getRiskBorderColor(score)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                      <AlertTriangle size={14} className="text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-noto-medium group-hover:text-teal-200 transition-colors">
                          {risk.name}
                        </span>
                        <div className={`text-sm font-bold font-mono ${getRiskColor(score)}`}>
                          {score}
                        </div>
                      </div>
                      {risk.category && (
                        <div className="text-xs text-gray-400 font-noto mb-2">{risk.category}</div>
                      )}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs font-mono bg-white/5 border-white/20">
                            I: {(risk.impact * 100).toFixed(0)}%
                          </Badge>
                          <Badge variant="outline" className="text-xs font-mono bg-white/5 border-white/20">
                            L: {(risk.likelihood * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-400 hover:text-teal-300 hover:bg-teal-500/10"
                          onClick={() => handleUpdateRisk(risk)}
                        >
                          <Shield size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomalies */}
      <div className="glass-panel-cinematic p-4">
        <h4 className="text-sm font-medium text-teal-400 mb-4 font-noto flex items-center">
          <Activity size={14} className="mr-2" />
          System Anomalies
        </h4>
        <div className="space-y-3">
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className="glass-panel p-3 hover:neon-border transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                    {anomaly.deviation > 0 ? (
                      <TrendingUp size={14} className="text-green-400" />
                    ) : (
                      <TrendingDown size={14} className="text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white font-noto-medium group-hover:text-teal-200 transition-colors">
                        {anomaly.indicator}
                      </span>
                      {anomaly.zone && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 font-mono">
                          {anomaly.zone}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400 font-mono">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </div>
                      {anomaly.severity && (
                        <Badge className={`${getSeverityColor(anomaly.severity)} text-xs font-mono border flex items-center gap-1`}>
                          <Zap size={10} />
                          {anomaly.severity.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <Badge 
                    className={`${anomaly.deviation > 0 ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} text-sm font-mono border font-bold`}
                  >
                    {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthRiskPanel;
