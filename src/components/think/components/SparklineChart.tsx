
import React from 'react';

interface SparklineChartProps {
  data: number[];
  height?: number;
  width?: number;
  color?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ 
  data, 
  height = 20, 
  width = 60,
  color = "#10b981" 
}) => {
  if (!data || data.length === 0) return null;
  
  const values = [...data];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1; // Avoid division by zero
  
  // Create points for the sparkline
  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default SparklineChart;
