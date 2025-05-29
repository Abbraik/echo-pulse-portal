
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { metric: 'Success Rate', value: 85, unit: '%' },
  { metric: 'ROI', value: 245, unit: '%' },
  { metric: 'Time Deploy', value: 3.2, unit: 'months' },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
};

export const ActChart: React.FC = () => {
  return (
    <div className="h-32 w-full">
      <ChartContainer config={chartConfig}>
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" fontSize={10} />
          <YAxis dataKey="metric" type="category" fontSize={10} width={80} />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value, name, props) => [`${value}${props.payload.unit}`, 'Value']}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={2} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
