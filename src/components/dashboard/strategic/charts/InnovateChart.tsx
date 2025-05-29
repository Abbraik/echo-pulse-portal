
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Smart City Infrastructure', completed: 75, remaining: 25 },
  { name: 'Adaptive Policy Framework', completed: 45, remaining: 55 },
];

const COLORS = ['#f59e0b', '#374151'];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
};

export const InnovateChart: React.FC = () => {
  return (
    <div className="h-32 w-full flex justify-around items-center">
      {data.map((item, index) => (
        <div key={item.name} className="flex flex-col items-center">
          <div className="h-16 w-16">
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'completed', value: item.completed },
                    { name: 'remaining', value: item.remaining }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={25}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[1]} />
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`${value}%`, 'Progress']}
                />
              </PieChart>
            </ChartContainer>
          </div>
          <span className="text-xs text-gray-300 text-center mt-1 max-w-20">{item.name}</span>
          <span className="text-xs text-amber-400">{item.completed}%</span>
        </div>
      ))}
    </div>
  );
};
