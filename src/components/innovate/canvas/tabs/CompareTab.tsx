
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTranslation } from '@/hooks/use-translation';

export const CompareTab: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('spider');

  const mockRadarData = [
    { indicator: 'Equity', baseline: 8.8, redesign: 9.2, fullMark: 10 },
    { indicator: 'Cohesion', baseline: 8.0, redesign: 8.7, fullMark: 10 },
    { indicator: 'Resilience', baseline: 7.5, redesign: 8.1, fullMark: 10 },
    { indicator: 'Trust', baseline: 7.2, redesign: 8.6, fullMark: 10 },
    { indicator: 'Engagement', baseline: 6.8, redesign: 8.3, fullMark: 10 },
    { indicator: 'Innovation', baseline: 7.1, redesign: 7.9, fullMark: 10 }
  ];

  const mockBarData = [
    { name: 'Equity', baseline: 8.8, redesign: 9.2 },
    { name: 'Cohesion', baseline: 8.0, redesign: 8.7 },
    { name: 'Resilience', baseline: 7.5, redesign: 8.1 },
    { name: 'Trust', baseline: 7.2, redesign: 8.6 },
    { name: 'Engagement', baseline: 6.8, redesign: 8.3 },
    { name: 'Innovation', baseline: 7.1, redesign: 7.9 }
  ];

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('scenarioComparison')}</h2>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
            <ToggleGroupItem value="spider" className="px-4">
              {t('spiderChart')}
            </ToggleGroupItem>
            <ToggleGroupItem value="bar" className="px-4">
              {t('barMatrix')}
            </ToggleGroupItem>
          </ToggleGroup>
          <Button className="bg-teal-500 hover:bg-teal-600">
            {t('compareScenarios')}
          </Button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl">
        {viewMode === 'spider' ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={mockRadarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="indicator" 
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                />
                <Radar
                  name="Baseline"
                  dataKey="baseline"
                  stroke="rgba(156, 163, 175, 0.8)"
                  fill="rgba(156, 163, 175, 0.1)"
                  strokeWidth={2}
                />
                <Radar
                  name="Redesign"
                  dataKey="redesign"
                  stroke="rgba(20, 184, 166, 1)"
                  fill="rgba(20, 184, 166, 0.2)"
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBarData} barGap={10}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  domain={[0, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.7)' }}
                />
                <Bar 
                  dataKey="baseline" 
                  fill="rgba(156, 163, 175, 0.8)" 
                  radius={[2, 2, 0, 0]}
                  name="Baseline"
                />
                <Bar 
                  dataKey="redesign" 
                  fill="rgba(20, 184, 166, 1)" 
                  radius={[2, 2, 0, 0]}
                  name="Redesign"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex justify-center mt-6 gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>{t('baseline')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span>{t('redesign')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
