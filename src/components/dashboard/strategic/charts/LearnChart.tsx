
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const data = [
  { playbook: 'Infrastructure Planning', success: 94 },
  { playbook: 'Multi-Stakeholder Coord', success: 78 },
];

const chartConfig = {
  success: {
    label: "Success Rate",
    color: "hsl(var(--chart-1))",
  },
};

export const LearnChart: React.FC = () => {
  return (
    <div className="h-32 w-full">
      <ChartContainer config={chartConfig}>
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" fontSize={10} domain={[0, 100]} />
          <YAxis dataKey="playbook" type="category" fontSize={10} width={120} />
          <ChartTooltip 
            content={<ChartTooltipContent />}
            formatter={(value) => [`${value}%`, 'Success Rate']}
          />
          <Bar dataKey="success" fill="#8b5cf6" radius={2} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
