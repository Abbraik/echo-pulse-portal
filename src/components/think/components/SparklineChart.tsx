
import React from 'react';

interface SparklineChartProps {
  data: number[];
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data }) => {
  const width = 80;
  const height = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  // Calculate points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="ml-2">
      <polyline
        points={points}
        fill="none"
        stroke="#14B8A6"
        strokeWidth="2"
      />
    </svg>
  );
};

export default SparklineChart;
