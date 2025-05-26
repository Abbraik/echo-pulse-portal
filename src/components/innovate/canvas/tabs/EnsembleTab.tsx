
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export const EnsembleTab: React.FC = () => {
  const { t } = useTranslation();

  // Mock Monte Carlo histogram data
  const histogramData = [
    { range: '70-72', count: 45 },
    { range: '72-74', count: 128 },
    { range: '74-76', count: 242 },
    { range: '76-78', count: 285 },
    { range: '78-80', count: 195 },
    { range: '80-82', count: 85 },
    { range: '82-84', count: 20 }
  ];

  const stats = {
    mean: 77.2,
    median: 76.8,
    stdDev: 2.4,
    p10: 73.5,
    p90: 81.1,
    runs: 1000
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t('monteCarloEnsemble')}</h2>
          <p className="text-muted-foreground">{t('distributionOf')} {stats.runs} {t('simulationRuns')}</p>
        </div>
        <Button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600">
          <Download size={16} />
          {t('downloadData')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Histogram */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">{t('outcomeDistribution')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData}>
                <XAxis 
                  dataKey="range" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="rgba(20, 184, 166, 0.8)" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4 text-sm text-muted-foreground">
            DEI Index Range
          </div>
        </div>

        {/* Statistics */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">{t('statisticalSummary')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('mean')}</span>
              <span className="font-mono font-bold text-teal-400">{stats.mean}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('median')}</span>
              <span className="font-mono font-bold">{stats.median}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('stdDeviation')}</span>
              <span className="font-mono">{stats.stdDev}</span>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <div className="text-sm font-medium mb-2">{t('percentiles')}</div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">10th</span>
                <span className="font-mono">{stats.p10}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">90th</span>
                <span className="font-mono">{stats.p90}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="text-sm text-muted-foreground">{t('confidenceInterval')}</div>
              <div className="text-lg font-bold text-center mt-2">
                [{stats.p10} - {stats.p90}]
              </div>
              <div className="text-xs text-center text-muted-foreground">80% CI</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">{t('ensembleInsights')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-sm font-medium text-green-400 mb-1">{t('robustOutcome')}</div>
            <div className="text-sm">95% of scenarios show DEI improvement above baseline</div>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="text-sm font-medium text-yellow-400 mb-1">{t('variabilityAlert')}</div>
            <div className="text-sm">High variance suggests sensitivity to initial conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
};
