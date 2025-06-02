
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface IndicatorWidgetProps {
  title: string;
  value: string;
  status: 'good' | 'warning' | 'danger';
  unit?: string;
  isFullscreen?: boolean;
  isHovered?: boolean;
}

const IndicatorWidget: React.FC<IndicatorWidgetProps> = ({ 
  title, 
  value, 
  status, 
  unit = '',
  isFullscreen, 
  isHovered 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-amber-400';
      case 'danger': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return <TrendingUp className="h-3 w-3" />;
      case 'warning': return <Minus className="h-3 w-3" />;
      case 'danger': return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <div className="h-full w-full p-3 flex flex-col justify-center">
      <div className="text-center">
        <div className="text-xs text-gray-400 mb-1 leading-tight">
          {title}
        </div>
        <div className={`text-lg font-bold ${getStatusColor()} mb-1`}>
          {value}
        </div>
        <div className={`flex items-center justify-center ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
      </div>

      {isFullscreen && (
        <div className="mt-8 w-full">
          <h4 className="text-xl font-semibold text-white mb-4">{title} - 12 Month Trend</h4>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-gray-300">
              12-month line/bar chart for {title} would appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndicatorWidget;
