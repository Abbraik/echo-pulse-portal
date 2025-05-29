
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', dei: 72, target: 82 },
  { month: 'Feb', dei: 74, target: 82 },
  { month: 'Mar', dei: 76, target: 82 },
  { month: 'Apr', dei: 78, target: 82 },
  { month: 'May', dei: 79, target: 82 },
  { month: 'Jun', dei: 78, target: 82 },
];

const chartConfig = {
  dei: {
    label: "DEI Score",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
};

export const ThinkChart: React.FC = () => {
  return (
    <div className="h-32 w-full">
      <ChartContainer config={chartConfig}>
        <LineChart data={data}>
          <XAxis dataKey="month" fontSize={10} />
          <YAxis fontSize={10} domain={[70, 85]} />
          <ReferenceLine y={82} stroke="#14b8a6" strokeDasharray="3 3" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="dei" 
            stroke="#14b8a6" 
            strokeWidth={2}
            dot={{ fill: '#14b8a6', r: 3 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
