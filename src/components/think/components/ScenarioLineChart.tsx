
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area } from 'recharts';

interface ChartDataPoint {
  time: number;
  baseline: number;
  scenario: number;
}

interface ScenarioLineChartProps {
  data: ChartDataPoint[];
}

export const ScenarioLineChart: React.FC<ScenarioLineChartProps> = ({ data }) => {
  const [showScenarioLine, setShowScenarioLine] = useState(false);
  
  // Animate the scenario line when data changes
  useEffect(() => {
    setShowScenarioLine(false);
    const timer = setTimeout(() => {
      setShowScenarioLine(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        {/* Baseline band */}
        <defs>
          <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        
        {/* X and Y Axes */}
        <XAxis 
          dataKey="time" 
          tick={{ fill: '#94A3B8' }}
          tickFormatter={(value) => `Y${value + 1}`}
          stroke="#475569"
        />
        <YAxis 
          tick={{ fill: '#94A3B8' }}
          domain={[40, 100]}
          stroke="#475569"
        />
        
        {/* Baseline area */}
        <Area 
          type="monotone" 
          dataKey="baseline" 
          stroke="#14B8A6" 
          strokeWidth={2}
          fill="url(#baselineGradient)" 
          activeDot={false}
        />
        
        {/* Scenario line with animation */}
        {showScenarioLine && (
          <Line 
            type="monotone" 
            dataKey="scenario" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 3, fill: '#3B82F6' }}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        )}
        
        {/* Reference lines */}
        <ReferenceLine y={80} stroke="#14B8A6" strokeOpacity={0.3} strokeDasharray="3 3" />
        <ReferenceLine y={60} stroke="#14B8A6" strokeOpacity={0.3} strokeDasharray="3 3" />
        
        {/* Tooltip */}
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.9)', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white'
          }}
          itemStyle={{ color: 'white' }}
          labelStyle={{ color: '#94A3B8' }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
          labelFormatter={(label) => `Year ${label + 1}`}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
