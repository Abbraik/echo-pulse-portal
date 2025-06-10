
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface HeatmapTableViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

interface IndicatorData {
  id: string;
  name: string;
  value: number;
  target: number;
  category: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: number[];
}

const HeatmapTableView: React.FC<HeatmapTableViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'category' | 'status'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sample data with 10% reduced values
  const indicators: IndicatorData[] = useMemo(() => [
    { id: '1', name: 'DEI Composite Score', value: 63, target: 80, category: 'Strategic', status: 'warning', trend: [68, 67, 65, 63, 62] },
    { id: '2', name: 'Network Resilience', value: 75, target: 85, category: 'Operational', status: 'healthy', trend: [70, 72, 74, 75, 76] },
    { id: '3', name: 'Resource Efficiency', value: 75, target: 85, category: 'Operational', status: 'healthy', trend: [77, 78, 77, 75, 76] },
    { id: '4', name: 'Social Cohesion Index', value: 69, target: 90, category: 'Community', status: 'warning', trend: [79, 77, 73, 69, 68] },
    { id: '5', name: 'Innovation Pipeline', value: 74, target: 85, category: 'Strategic', status: 'healthy', trend: [68, 70, 72, 74, 75] },
    { id: '6', name: 'Trust Recovery Rate', value: 54, target: 75, category: 'Strategic', status: 'critical', trend: [65, 61, 58, 56, 54] },
    { id: '7', name: 'Workflow Optimization', value: 54, target: 75, category: 'Operational', status: 'critical', trend: [65, 61, 58, 55, 54] },
    { id: '8', name: 'Knowledge Transfer', value: 68, target: 80, category: 'Learning', status: 'healthy', trend: [63, 65, 66, 68, 69] },
    { id: '9', name: 'Stakeholder Engagement', value: 71, target: 85, category: 'Community', status: 'healthy', trend: [68, 69, 70, 71, 72] },
    { id: '10', name: 'Security Posture', value: 79, target: 90, category: 'Operational', status: 'healthy', trend: [77, 77, 78, 79, 80] },
    { id: '11', name: 'Adaptive Capacity', value: 65, target: 80, category: 'Strategic', status: 'warning', trend: [61, 63, 64, 65, 66] },
    { id: '12', name: 'Data Quality', value: 77, target: 90, category: 'Technical', status: 'healthy', trend: [74, 75, 76, 77, 78] },
    { id: '13', name: 'Performance Metrics', value: 73, target: 85, category: 'Operational', status: 'healthy', trend: [70, 71, 72, 73, 74] },
    { id: '14', name: 'Risk Mitigation', value: 67, target: 80, category: 'Strategic', status: 'warning', trend: [68, 68, 67, 66, 67] },
    { id: '15', name: 'Team Cohesion', value: 68, target: 80, category: 'Community', status: 'healthy', trend: [67, 68, 68, 69, 68] },
    { id: '16', name: 'Learning Velocity', value: 70, target: 85, category: 'Learning', status: 'healthy', trend: [68, 68, 69, 70, 71] },
    { id: '17', name: 'System Reliability', value: 83, target: 95, category: 'Technical', status: 'healthy', trend: [81, 82, 83, 84, 83] },
    { id: '18', name: 'Communication Flow', value: 66, target: 80, category: 'Operational', status: 'warning', trend: [68, 67, 66, 65, 66] },
    { id: '19', name: 'Cultural Alignment', value: 64, target: 80, category: 'Community', status: 'warning', trend: [66, 65, 64, 63, 64] },
    { id: '20', name: 'Technology Debt', value: 60, target: 75, category: 'Technical', status: 'critical', trend: [63, 62, 61, 60, 59] },
  ], []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#00FFC3';
      case 'warning': return '#FFC107';
      case 'critical': return '#FF6E6E';
      default: return '#00FFC3';
    }
  };

  const getPerformanceColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 0.9) return '#00FFC3';
    if (ratio >= 0.7) return '#FFC107';
    return '#FF6E6E';
  };

  const sortedIndicators = useMemo(() => {
    const sorted = [...indicators].sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
    return sorted;
  }, [indicators, sortBy, sortOrder]);

  const handleSort = (column: 'name' | 'value' | 'category' | 'status') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Heatmap Section - 40% height */}
      <div className="h-2/5 bg-slate-800/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
        <h3 className="text-lg font-bold text-white mb-3">Performance Heatmap</h3>
        <div className="grid grid-cols-10 gap-1 h-full">
          {indicators.slice(0, 20).map((indicator, index) => (
            <motion.div
              key={indicator.id}
              className="rounded-lg flex items-center justify-center cursor-pointer relative group"
              style={{
                backgroundColor: `${getPerformanceColor(indicator.value, indicator.target)}20`,
                border: `1px solid ${getPerformanceColor(indicator.value, indicator.target)}`,
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: `${getPerformanceColor(indicator.value, indicator.target)}40`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <span 
                className="text-xs font-bold"
                style={{ color: getPerformanceColor(indicator.value, indicator.target) }}
              >
                {indicator.value}
              </span>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {indicator.name}: {indicator.value}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Table Section - 60% height */}
      <div className="flex-1 bg-slate-800/40 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Detailed Indicators</h3>
        </div>
        
        <div 
          className="overflow-y-auto h-full"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.20) transparent'
          }}
        >
          <style>{`
            .overflow-y-auto::-webkit-scrollbar {
              width: 6px;
            }
            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.20);
              border-radius: 3px;
            }
            .overflow-y-auto::-webkit-scrollbar-track {
              background: transparent;
            }
          `}</style>
          
          <table className="w-full">
            <thead className="sticky top-0 bg-slate-700/50 backdrop-blur-sm">
              <tr>
                <th 
                  className="text-left p-3 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Indicator {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-center p-3 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('value')}
                >
                  Score {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-center p-3 text-sm font-semibold text-slate-300">Target</th>
                <th 
                  className="text-center p-3 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('category')}
                >
                  Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-center p-3 text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-center p-3 text-sm font-semibold text-slate-300">Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedIndicators.map((indicator, index) => (
                <motion.tr
                  key={indicator.id}
                  className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  style={{ height: '32px' }}
                >
                  <td className="p-2 text-sm text-white">{indicator.name}</td>
                  <td className="p-2 text-center">
                    <span 
                      className="text-sm font-bold"
                      style={{ color: getPerformanceColor(indicator.value, indicator.target) }}
                    >
                      {indicator.value}%
                    </span>
                  </td>
                  <td className="p-2 text-center text-sm text-slate-300">{indicator.target}%</td>
                  <td className="p-2 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-slate-600/50 text-slate-200">
                      {indicator.category}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <div 
                      className="w-3 h-3 rounded-full mx-auto"
                      style={{ backgroundColor: getStatusColor(indicator.status) }}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <svg width="50" height="20" viewBox="0 0 50 20" className="mx-auto">
                      {chartType === 'line' ? (
                        <polyline
                          points={indicator.trend.map((value, i) => `${i * 12.5},${20 - (value / Math.max(...indicator.trend)) * 15}`).join(' ')}
                          fill="none"
                          stroke={getStatusColor(indicator.status)}
                          strokeWidth="1.5"
                        />
                      ) : (
                        indicator.trend.map((value, i) => (
                          <rect
                            key={i}
                            x={i * 10}
                            y={20 - (value / Math.max(...indicator.trend)) * 15}
                            width="8"
                            height={(value / Math.max(...indicator.trend)) * 15}
                            fill={getStatusColor(indicator.status)}
                            opacity="0.8"
                          />
                        ))
                      )}
                    </svg>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HeatmapTableView;
