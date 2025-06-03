
import React from 'react';
import { motion } from 'framer-motion';

interface InstrumentPanelProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  domainFilter: string;
  onDomainFilterChange: (domain: string) => void;
  chartType: 'bar' | 'line';
  onChartTypeChange: (type: 'bar' | 'line') => void;
  showChartType: boolean;
}

const InstrumentPanel: React.FC<InstrumentPanelProps> = ({
  timeRange,
  onTimeRangeChange,
  domainFilter,
  onDomainFilterChange,
  chartType,
  onChartTypeChange,
  showChartType,
}) => {
  const timeRangeOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days'];
  const domainOptions = ['All Domains', 'Population', 'Resources', 'Social', 'Workflow'];

  const selectStyle = {
    background: 'rgba(20, 30, 50, 0.6)',
    color: '#E0E0E0',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontFamily: 'Noto Sans',
    fontSize: '12px',
    fontWeight: 400,
    minWidth: '120px',
  };

  const labelStyle = {
    fontFamily: 'Noto Sans',
    fontSize: '12px',
    fontWeight: 400,
    color: '#E0E0E0',
    marginRight: '8px',
  };

  return (
    <motion.div
      className="flex items-center gap-4 p-3 rounded-lg"
      style={{
        background: 'rgba(10, 20, 35, 0.45)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 195, 0.12)',
        borderRadius: '1rem',
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Time Range Selector */}
      <div className="flex items-center">
        <label style={labelStyle}>Time Range:</label>
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          style={selectStyle}
        >
          {timeRangeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Domain Filter */}
      <div className="flex items-center">
        <label style={labelStyle}>Domain:</label>
        <select
          value={domainFilter}
          onChange={(e) => onDomainFilterChange(e.target.value)}
          style={selectStyle}
        >
          {domainOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Chart Type Toggle */}
      {showChartType && (
        <div className="flex items-center">
          <label style={labelStyle}>Chart Style:</label>
          <div className="flex items-center space-x-3">
            <label className="flex items-center cursor-pointer">
              <div
                className="w-4 h-4 rounded-full border-2 mr-2 transition-all duration-150"
                style={{
                  background: chartType === 'bar' ? '#00FFC3' : 'transparent',
                  borderColor: chartType === 'bar' ? '#00FFC3' : '#E0E0E0',
                }}
                onMouseEnter={(e) => {
                  if (chartType !== 'bar') {
                    e.currentTarget.style.borderColor = '#00FFC3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (chartType !== 'bar') {
                    e.currentTarget.style.borderColor = '#E0E0E0';
                  }
                }}
              />
              <input
                type="radio"
                name="chartType"
                value="bar"
                checked={chartType === 'bar'}
                onChange={() => onChartTypeChange('bar')}
                className="hidden"
                aria-label="Bar chart"
              />
              <span style={labelStyle}>Bar</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <div
                className="w-4 h-4 rounded-full border-2 mr-2 transition-all duration-150"
                style={{
                  background: chartType === 'line' ? '#00FFC3' : 'transparent',
                  borderColor: chartType === 'line' ? '#00FFC3' : '#E0E0E0',
                }}
                onMouseEnter={(e) => {
                  if (chartType !== 'line') {
                    e.currentTarget.style.borderColor = '#00FFC3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (chartType !== 'line') {
                    e.currentTarget.style.borderColor = '#E0E0E0';
                  }
                }}
              />
              <input
                type="radio"
                name="chartType"
                value="line"
                checked={chartType === 'line'}
                onChange={() => onChartTypeChange('line')}
                className="hidden"
                aria-label="Line chart"
              />
              <span style={labelStyle}>Line</span>
            </label>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InstrumentPanel;
