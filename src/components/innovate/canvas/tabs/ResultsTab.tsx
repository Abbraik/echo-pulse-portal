
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { KeyInsightCard } from '../../enhanced/KeyInsightCard';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

export const ResultsTab: React.FC = () => {
  const { t } = useTranslation();

  const mockInsights = [
    {
      type: 'opportunity' as const,
      title: 'Significant DEI Improvement',
      description: 'Your design increased DEI by +3.1 points in 12 months; top driver: Youth Engagement.',
      confidence: 87
    },
    {
      type: 'pattern' as const,
      title: 'Accelerated Trust Building',
      description: 'Social trust shows exponential growth after month 6 due to feedback loops.',
      confidence: 73
    }
  ];

  const mockData = [
    { month: 0, baseline: 72, redesign: 72, upper: 74, lower: 70 },
    { month: 3, baseline: 72.5, redesign: 73.8, upper: 76.2, lower: 71.4 },
    { month: 6, baseline: 73, redesign: 75.2, upper: 78.1, lower: 72.3 },
    { month: 9, baseline: 73.2, redesign: 76.8, upper: 80.5, lower: 73.1 },
    { month: 12, baseline: 73.5, redesign: 78.6, upper: 82.8, lower: 74.4 }
  ];

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      {/* Key Insight Card */}
      <KeyInsightCard insights={mockInsights} />

      {/* Results Visualization */}
      <div className="glass-panel p-6 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{t('deiTrajectoryComparison')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('baselineVsRedesignScenario')} (12 {t('months')})
          </p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                domain={[68, 85]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
              />
              
              {/* Confidence bands */}
              <Line 
                type="monotone" 
                dataKey="upper" 
                stroke="rgba(20, 184, 166, 0.2)" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="2 2"
              />
              <Line 
                type="monotone" 
                dataKey="lower" 
                stroke="rgba(20, 184, 166, 0.2)" 
                strokeWidth={1}
                dot={false}
                strokeDasharray="2 2"
              />
              
              {/* Main lines */}
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="rgba(156, 163, 175, 0.8)" 
                strokeWidth={2}
                dot={{ r: 4, fill: 'rgba(156, 163, 175, 0.8)' }}
              />
              <Line 
                type="monotone" 
                dataKey="redesign" 
                stroke="rgba(20, 184, 166, 1)" 
                strokeWidth={3}
                dot={{ r: 5, fill: 'rgba(20, 184, 166, 1)' }}
              />
              
              {/* Target line */}
              <ReferenceLine 
                y={75} 
                stroke="rgba(251, 191, 36, 0.8)" 
                strokeDasharray="5 5"
                label={{ value: "Target", position: "topRight" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center mt-4 gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>{t('baseline')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span>{t('redesign')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-teal-500 rounded-full"></div>
            <span>90% {t('confidence')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
