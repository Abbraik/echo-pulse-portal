
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

interface DataPoint {
  date: string;
  value: number;
  event: string | null;
}

interface DeiTrendChartProps {
  data: DataPoint[];
  minBand: number;
  maxBand: number;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t, isRTL } = useTranslation();
  
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className={`glass-panel p-2 ${isRTL ? 'rtl' : ''}`}>
        <p className="text-sm font-medium">{formatDate(dataPoint.date)}</p>
        <p className="text-xs">
          DEI: <span className="font-semibold">{dataPoint.value}</span>
        </p>
        {dataPoint.event && (
          <p className="text-xs text-teal-400">{t('event')}: {dataPoint.event}</p>
        )}
      </div>
    );
  }
  
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (payload.event) {
    return (
      <svg x={cx - 6} y={cy - 6} width={12} height={12}>
        <circle cx="6" cy="6" r="5" fill="#2DD4BF" stroke="white" strokeWidth="1" />
      </svg>
    );
  }
  
  return null;
};

const DeiTrendChart: React.FC<DeiTrendChartProps> = ({
  data,
  minBand,
  maxBand,
}) => {
  const { resolvedTheme } = useTheme();
  const { isRTL } = useTranslation();
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: data.length - 1 });
  
  // Calculate min and max values for y-axis
  const minValue = Math.min(Math.floor(minBand * 0.9), ...data.map(d => d.value));
  const maxValue = Math.max(Math.ceil(maxBand * 1.1), ...data.map(d => d.value));
  
  // Handle range change (for date scrubber)
  const handleRangeChange = (start: number, end: number) => {
    setVisibleRange({ start, end });
  };
  
  const visibleData = data.slice(visibleRange.start, visibleRange.end + 1);
  
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={visibleData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#1E293B40' : '#94A3B840'} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 11 }}
            stroke={resolvedTheme === 'dark' ? '#94A3B880' : '#64748B80'}
            reversed={isRTL}
          />
          <YAxis 
            domain={[minValue, maxValue]} 
            tick={{ fontSize: 11 }} 
            stroke={resolvedTheme === 'dark' ? '#94A3B880' : '#64748B80'}
            mirror={isRTL}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Equilibrium band */}
          <ReferenceArea 
            y1={minBand} 
            y2={maxBand} 
            fill={resolvedTheme === 'dark' ? '#14B8A620' : '#14B8A610'} 
            strokeOpacity={0.3}
          />
          
          {/* Min and max band reference lines */}
          <ReferenceLine 
            y={minBand} 
            stroke="#14B8A6" 
            strokeDasharray="3 3"
            strokeWidth={1.5}
            label={{ 
              value: `Min: ${minBand}`, 
              position: 'insideBottomRight',
              style: { fill: '#14B8A6', fontSize: 11 }
            }}
          />
          <ReferenceLine 
            y={maxBand} 
            stroke="#14B8A6" 
            strokeDasharray="3 3"
            strokeWidth={1.5}
            label={{ 
              value: `Max: ${maxBand}`, 
              position: 'insideTopRight',
              style: { fill: '#14B8A6', fontSize: 11 }
            }}
          />
          
          {/* Main DEI line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#2DD4BF', stroke: '#FFFFFF', strokeWidth: 2 }}
            animationDuration={1500}
          />
          
          {/* Event dots */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="transparent"
            dot={<CustomDot />}
            activeDot={false}
          />
          
          {/* Gradient for the line */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
      
      {/* Simple date scrubber - can be enhanced with a real slider component */}
      <div className="w-full h-[15%] flex items-center justify-center">
        <div className="w-full max-w-lg h-2 bg-gray-300/20 rounded-full relative">
          <div 
            className="absolute inset-y-0 bg-teal-500/40 rounded-full"
            style={{ 
              left: `${(visibleRange.start / data.length) * 100}%`, 
              right: `${100 - ((visibleRange.end + 1) / data.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DeiTrendChart;
