
import React from 'react';

interface InstrumentPanelProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  domainFilter: string;
  onDomainFilterChange: (value: string) => void;
  chartType: 'bar' | 'line';
  onChartTypeChange: (value: 'bar' | 'line') => void;
  activeView: string;
}

const InstrumentPanel: React.FC<InstrumentPanelProps> = ({
  timeRange,
  onTimeRangeChange,
  domainFilter,
  onDomainFilterChange,
  chartType,
  onChartTypeChange,
  activeView,
}) => {
  const showChartType = activeView === 'heatmap' || activeView === 'radial';

  return (
    <div 
      className="flex items-center gap-3 px-3 py-1 rounded-2xl"
      style={{
        background: 'rgba(10,20,35,0.45)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,255,195,0.12)',
      }}
    >
      {/* Time Range */}
      <div className="flex items-center gap-2">
        <label 
          className="text-[#E0E0E0] text-xs"
          style={{ fontFamily: 'Noto Sans' }}
        >
          Time Range:
        </label>
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="text-xs px-2 py-1 rounded border-0 outline-none"
          style={{
            background: 'rgba(20,30,50,0.6)',
            color: '#E0E0E0',
            fontFamily: 'Noto Sans',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="Last 90 Days">Last 90 Days</option>
        </select>
      </div>

      {/* Domain Filter */}
      <div className="flex items-center gap-2">
        <label 
          className="text-[#E0E0E0] text-xs"
          style={{ fontFamily: 'Noto Sans' }}
        >
          Domain:
        </label>
        <select
          value={domainFilter}
          onChange={(e) => onDomainFilterChange(e.target.value)}
          className="text-xs px-2 py-1 rounded border-0 outline-none"
          style={{
            background: 'rgba(20,30,50,0.6)',
            color: '#E0E0E0',
            fontFamily: 'Noto Sans',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <option value="All Domains">All Domains</option>
          <option value="Population">Population</option>
          <option value="Resources">Resources</option>
          <option value="Social">Social</option>
          <option value="Workflow">Workflow</option>
        </select>
      </div>

      {/* Chart Type */}
      {showChartType && (
        <div className="flex items-center gap-2">
          <label 
            className="text-[#E0E0E0] text-xs"
            style={{ fontFamily: 'Noto Sans' }}
          >
            Chart Style:
          </label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="chartType"
                value="bar"
                checked={chartType === 'bar'}
                onChange={() => onChartTypeChange('bar')}
                className="sr-only"
              />
              <div 
                className="w-4 h-4 border-2 transition-colors duration-150"
                style={{
                  background: chartType === 'bar' ? '#00FFC3' : 'transparent',
                  borderColor: chartType === 'bar' ? '#00FFC3' : '#E0E0E0',
                }}
              />
              <span 
                className="text-xs text-[#E0E0E0]"
                style={{ fontFamily: 'Noto Sans' }}
              >
                Bar
              </span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="chartType"
                value="line"
                checked={chartType === 'line'}
                onChange={() => onChartTypeChange('line')}
                className="sr-only"
              />
              <div 
                className="w-4 h-4 rounded-full border-2 transition-colors duration-150"
                style={{
                  background: chartType === 'line' ? '#00FFC3' : 'transparent',
                  borderColor: chartType === 'line' ? '#00FFC3' : '#E0E0E0',
                }}
              />
              <span 
                className="text-xs text-[#E0E0E0]"
                style={{ fontFamily: 'Noto Sans' }}
              >
                Line
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstrumentPanel;
