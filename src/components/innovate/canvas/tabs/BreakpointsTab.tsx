
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export const BreakpointsTab: React.FC = () => {
  const { t } = useTranslation();

  const mockBreakpoints = [
    {
      parameter: 'Trust Threshold',
      value: 72,
      unit: '%',
      effect: 'System oscillation begins',
      severity: 'high',
      direction: 'above'
    },
    {
      parameter: 'Engagement Saturation',
      value: 85,
      unit: '%',
      effect: 'Diminishing returns on interventions',
      severity: 'medium',
      direction: 'above'
    },
    {
      parameter: 'Resource Constraint',
      value: 2.3,
      unit: 'M$',
      effect: 'Program effectiveness drops sharply',
      severity: 'high',
      direction: 'below'
    },
    {
      parameter: 'Policy Lag Duration',
      value: 6,
      unit: 'months',
      effect: 'Stakeholder confidence erodes',
      severity: 'medium',
      direction: 'above'
    },
    {
      parameter: 'Community Participation',
      value: 45,
      unit: '%',
      effect: 'Social networks fragment',
      severity: 'high',
      direction: 'below'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 border-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-400 border-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 border-green-400 bg-green-500/10';
      default: return 'text-gray-400 border-gray-400 bg-gray-500/10';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'above' ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle size={24} className="text-amber-400" />
        <div>
          <h2 className="text-2xl font-bold">{t('systemBreakpoints')}</h2>
          <p className="text-muted-foreground">{t('criticalThresholdsDetected')}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockBreakpoints.map((breakpoint, index) => (
          <div key={index} className="glass-panel p-6 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{breakpoint.parameter}</h3>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${getSeverityColor(breakpoint.severity)}`}>
                    {getDirectionIcon(breakpoint.direction)}
                    <span className="capitalize">{breakpoint.severity}</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{breakpoint.effect}</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold font-mono">
                  {breakpoint.value}
                  <span className="text-sm text-muted-foreground ml-1">
                    {breakpoint.unit}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('threshold')}
                </div>
              </div>
            </div>

            {/* Visual threshold indicator */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{t('safeZone')}</span>
                <span>{t('criticalZone')}</span>
              </div>
              <div className="h-2 bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30 rounded-full relative">
                <div 
                  className="absolute top-0 w-1 h-full bg-white rounded-full shadow-lg"
                  style={{ left: `${Math.random() * 80 + 10}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">{t('breakpointAnalysis')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-500/10 rounded-lg">
            <div className="text-2xl font-bold text-red-400">3</div>
            <div className="text-sm text-muted-foreground">{t('highRiskThresholds')}</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">2</div>
            <div className="text-sm text-muted-foreground">{t('mediumRiskThresholds')}</div>
          </div>
          <div className="text-center p-4 bg-teal-500/10 rounded-lg">
            <div className="text-2xl font-bold text-teal-400">78%</div>
            <div className="text-sm text-muted-foreground">{t('systemStability')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
