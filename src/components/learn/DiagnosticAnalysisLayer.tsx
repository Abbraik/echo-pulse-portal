
import React from 'react';
import { ArrowRight, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Badge } from '@/components/ui/badge';

export const DiagnosticAnalysisLayer: React.FC = () => {
  const { t } = useTranslation();
  
  // Sample data for demonstration
  const causalInsights = [
    { driver: 'Community Engagement Gap', confidence: 92, description: 'Lack of early stakeholder involvement caused 60% of resource allocation issues' },
    { driver: 'Budget Timing Constraints', confidence: 87, description: 'Late fiscal releases delayed implementation of key programs' },
    { driver: 'Policy Implementation Lag', confidence: 79, description: 'Average 30-day gap between policy approval and field implementation' },
  ];
  
  const bundleEffectiveness = [
    { component: 'Training Programs', target: 85, actual: 76, variance: -9 },
    { component: 'Resource Distribution', target: 90, actual: 92, variance: 2 },
    { component: 'Stakeholder Engagement', target: 75, actual: 68, variance: -7 },
    { component: 'Technology Deployment', target: 80, actual: 65, variance: -15 },
  ];
  
  const fatigueAlerts = [
    { bundle: 'Community Workshop Series', reason: 'Overused in rural areas', severity: 'high' },
    { bundle: 'Direct Resource Allocation', reason: 'Diminishing returns', severity: 'medium' },
    { bundle: 'Policy Education Campaign', reason: 'Target audience fatigue', severity: 'low' },
  ];
  
  return (
    <GlassCard className="p-6 h-[30vh] overflow-y-auto">
      <GlassCardHeader className="pb-4">
        <GlassCardTitle gradient>{t('diagnosticCausalAnalysis')}</GlassCardTitle>
      </GlassCardHeader>
      
      <GlassCardContent>
        <div className="grid grid-cols-5 gap-6">
          {/* Left side: Interactive Diagnostics Canvas (60%) */}
          <div className="col-span-3">
            <div className="glass-panel p-4 rounded-xl h-full relative">
              <h3 className="text-lg font-semibold mb-3">{t('causalInferenceEngine')}</h3>
              
              <div className="h-[calc(100%-3rem)] bg-white/5 rounded-lg border border-white/10 relative">
                {/* Simulated CLD graph with causal relationships */}
                <svg className="w-full h-full">
                  {/* Nodes */}
                  <circle cx="25%" cy="30%" r="20" className="fill-blue-500/30 stroke-blue-500 stroke-1" />
                  <circle cx="60%" cy="25%" r="20" className="fill-teal-500/30 stroke-teal-500 stroke-1" />
                  <circle cx="75%" cy="60%" r="20" className="fill-amber-500/30 stroke-amber-500 stroke-1" />
                  <circle cx="40%" cy="70%" r="20" className="fill-rose-500/30 stroke-rose-500 stroke-1 animate-pulse" />
                  <circle cx="20%" cy="60%" r="16" className="fill-purple-500/30 stroke-purple-500 stroke-1" />
                  
                  {/* Connecting lines */}
                  <line x1="25%" y1="30%" x2="60%" y2="25%" className="stroke-white/50 stroke-1" />
                  <line x1="60%" y1="25%" x2="75%" y2="60%" className="stroke-white/50 stroke-1" />
                  <line x1="75%" y1="60%" x2="40%" y2="70%" className="stroke-white/50 stroke-1" />
                  <line x1="40%" y1="70%" x2="20%" y2="60%" className="stroke-white/50 stroke-1" />
                  <line x1="20%" y1="60%" x2="25%" y2="30%" className="stroke-white/50 stroke-1" />
                  
                  {/* Arrows on lines */}
                  <polygon points="58,25 54,23 54,27" className="fill-white/50" />
                  <polygon points="73,58 71,54 75,54" className="fill-white/50" />
                  <polygon points="42,68 46,66 46,70" className="fill-white/50" />
                  <polygon points="22,58 26,56 26,60" className="fill-white/50" />
                  <polygon points="27,31 29,35 25,35" className="fill-white/50" />
                  
                  {/* Labels */}
                  <text x="25%" y="30%" textAnchor="middle" className="fill-white text-xs font-medium" dy=".3em">Policy</text>
                  <text x="60%" y="25%" textAnchor="middle" className="fill-white text-xs font-medium" dy=".3em">Budget</text>
                  <text x="75%" y="60%" textAnchor="middle" className="fill-white text-xs font-medium" dy=".3em">Impact</text>
                  <text x="40%" y="70%" textAnchor="middle" className="fill-white text-xs font-medium" dy=".3em">Fatigue</text>
                  <text x="20%" y="60%" textAnchor="middle" className="fill-white text-xs font-medium" dy=".3em">Access</text>
                </svg>
                
                {/* Pattern Drift Tracker - Animated Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-[45%] left-[40%] w-[20%] h-[1px] bg-gradient-to-r from-teal-500 to-blue-500 opacity-70" 
                    style={{ transform: 'rotate(30deg)' }}></div>
                  
                  <div className="absolute top-[60%] left-[50%] w-[15%] h-[1px] bg-gradient-to-r from-amber-500 to-rose-500 opacity-70" 
                    style={{ transform: 'rotate(-15deg)' }}></div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs bg-white/10">
                  {t('toggleSimulation')}
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-white/10">
                  {t('viewBundleGenetics')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right side: Diagnostics Summary Cards (40%) */}
          <div className="col-span-2 space-y-4">
            {/* Causal Insights Card */}
            <div className="glass-panel p-4 rounded-xl">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-1" /> 
                {t('causalInsights')}
              </h3>
              
              <div className="space-y-3">
                {causalInsights.map((insight, i) => (
                  <div key={i} className="glass-panel-dark p-2 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{insight.driver}</span>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-300/20">
                        {insight.confidence}% {t('confidence')}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{insight.description}</p>
                    <Button variant="ghost" size="sm" className="w-full mt-1 text-xs justify-start text-blue-400">
                      {t('explore')} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bundle Effectiveness */}
            <div className="glass-panel p-4 rounded-xl">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" /> 
                {t('bundleEffectiveness')}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-1">{t('component')}</th>
                      <th className="py-1">{t('target')}</th>
                      <th className="py-1">{t('actual')}</th>
                      <th className="py-1">{t('variance')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bundleEffectiveness.map((item, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="py-1.5">{item.component}</td>
                        <td className="py-1.5 text-center">{item.target}%</td>
                        <td className="py-1.5 text-center">{item.actual}%</td>
                        <td className={`py-1.5 text-center ${
                          item.variance > 0 ? 'text-green-400' : 
                          item.variance < 0 ? 'text-rose-400' : ''
                        }`}>
                          {item.variance > 0 ? '+' : ''}{item.variance}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Fatigue Alerts */}
            <div className="glass-panel p-4 rounded-xl">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" /> 
                {t('fatigueAlerts')}
              </h3>
              
              <div className="space-y-2">
                {fatigueAlerts.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${
                        alert.severity === 'high' ? 'bg-rose-500' :
                        alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></span>
                      <span>{alert.bundle}</span>
                    </div>
                    <span className="text-gray-400">{alert.reason}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-xs font-medium mb-1">{t('reconciliationReport')}</h4>
                <div className="h-16 bg-white/5 rounded-lg p-2">
                  <div className="h-full flex items-center justify-center relative">
                    <div className="h-[1px] w-full bg-gray-500 absolute"></div>
                    <div className="h-[1px] w-full bg-blue-500/50 absolute" style={{ transform: 'rotate(-5deg)' }}></div>
                    <div className="h-[1px] w-full bg-teal-500/50 absolute" style={{ transform: 'rotate(3deg)' }}></div>
                    <div className="absolute top-1 right-1 text-[10px] text-gray-400">
                      {t('forecast')} vs {t('actual')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};
