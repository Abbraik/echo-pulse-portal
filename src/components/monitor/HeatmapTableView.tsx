
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, TrendingUp, Eye } from 'lucide-react';

interface HeatmapTableViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

interface HeatmapCell {
  domain: string;
  category: 'strategic' | 'operational';
  value: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface Indicator {
  id: string;
  name: string;
  category: 'strategic' | 'operational';
  domain: string;
  currentValue: number | string;
  target: number | string;
  deviation: number;
  trend: number[];
}

const HeatmapTableView: React.FC<HeatmapTableViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'strategic' | 'operational'>('all');

  const heatmapData: HeatmapCell[] = [
    { domain: 'Population', category: 'strategic', value: 78, status: 'warning' },
    { domain: 'Resources', category: 'strategic', value: 85, status: 'healthy' },
    { domain: 'Social', category: 'strategic', value: 92, status: 'healthy' },
    { domain: 'Workflow', category: 'strategic', value: 67, status: 'critical' },
    { domain: 'Population', category: 'operational', value: 88, status: 'healthy' },
    { domain: 'Resources', category: 'operational', value: 45, status: 'critical' },
    { domain: 'Social', category: 'operational', value: 91, status: 'healthy' },
    { domain: 'Workflow', category: 'operational', value: 82, status: 'healthy' },
  ];

  const indicators: Indicator[] = [
    { id: '1', name: 'DEI Composite', category: 'strategic', domain: 'Population', currentValue: 78, target: 80, deviation: -2.5, trend: [75, 76, 78, 77, 78] },
    { id: '2', name: 'Resource Efficiency', category: 'operational', domain: 'Resources', currentValue: 92, target: 85, deviation: 8.2, trend: [85, 87, 89, 90, 92] },
    { id: '3', name: 'Social Cohesion', category: 'strategic', domain: 'Social', currentValue: 85, target: 90, deviation: -5.6, trend: [88, 86, 85, 84, 85] },
    { id: '4', name: 'Workflow Health', category: 'operational', domain: 'Workflow', currentValue: 67, target: 75, deviation: -10.7, trend: [72, 70, 68, 66, 67] },
    { id: '5', name: 'Population Growth', category: 'strategic', domain: 'Population', currentValue: 88, target: 85, deviation: 3.5, trend: [83, 84, 86, 87, 88] },
    { id: '6', name: 'Infrastructure Load', category: 'operational', domain: 'Resources', currentValue: 45, target: 70, deviation: -35.7, trend: [55, 52, 48, 46, 45] },
    { id: '7', name: 'Innovation Index', category: 'strategic', domain: 'Social', currentValue: 91, target: 85, deviation: 7.1, trend: [86, 87, 89, 90, 91] },
    { id: '8', name: 'System Stability', category: 'operational', domain: 'Workflow', currentValue: 82, target: 80, deviation: 2.5, trend: [79, 80, 81, 81, 82] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(0,255,195,0.25)';
      case 'warning': return 'rgba(255,193,7,0.25)';
      case 'critical': return 'rgba(255,110,110,0.25)';
      default: return 'rgba(0,255,195,0.25)';
    }
  };

  const getDeviationColor = (deviation: number) => {
    if (deviation > 5) return 'text-green-400';
    if (deviation >= -5 && deviation <= 5) return 'text-amber-400';
    return 'text-red-400';
  };

  const handleCellClick = (domain: string, category: string) => {
    const cellKey = `${domain}-${category}`;
    setSelectedCell(selectedCell === cellKey ? null : cellKey);
  };

  const filteredIndicators = indicators.filter(indicator => {
    const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || indicator.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const domains = ['Population', 'Resources', 'Social', 'Workflow'];

  return (
    <div className="h-full flex flex-col">
      {/* Heatmap Section */}
      <div 
        className="h-1/2 m-3 mb-1 rounded-2xl p-3"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
        }}
      >
        <div className="h-full grid grid-rows-3 grid-cols-4 gap-3">
          {/* Column Headers */}
          <div className="col-span-4 grid grid-cols-4 gap-3 items-center">
            {domains.map(domain => (
              <div key={domain} className="text-center">
                <span 
                  className="text-sm font-medium text-[#E0E0E0]"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  {domain}
                </span>
              </div>
            ))}
          </div>

          {/* Strategic Row */}
          <div className="col-span-4 grid grid-cols-4 gap-3">
            {domains.map(domain => {
              const cellData = heatmapData.find(cell => 
                cell.domain === domain && cell.category === 'strategic'
              );
              const cellKey = `${domain}-strategic`;
              const isSelected = selectedCell === cellKey;
              
              return (
                <motion.div
                  key={cellKey}
                  className="aspect-square rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
                  style={{
                    background: getStatusColor(cellData?.status || 'healthy'),
                    border: isSelected ? '2px solid #00FFC3' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isSelected ? '0 0 12px rgba(0,255,195,0.5)' : 'inset 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCellClick(domain, 'strategic')}
                  role="button"
                  aria-label={`${domain} (Strategic): ${cellData?.value}% ${cellData?.status}`}
                >
                  <span 
                    className="text-xs font-medium text-[#00FFC3] mb-1"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    Strategic
                  </span>
                  <span 
                    className="text-lg font-bold text-[#00FFC3]"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {cellData?.value}%
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Operational Row */}
          <div className="col-span-4 grid grid-cols-4 gap-3">
            {domains.map(domain => {
              const cellData = heatmapData.find(cell => 
                cell.domain === domain && cell.category === 'operational'
              );
              const cellKey = `${domain}-operational`;
              const isSelected = selectedCell === cellKey;
              
              return (
                <motion.div
                  key={cellKey}
                  className="aspect-square rounded-lg cursor-pointer flex flex-col items-center justify-center relative"
                  style={{
                    background: getStatusColor(cellData?.status || 'healthy'),
                    border: isSelected ? '2px solid #00FFC3' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: isSelected ? '0 0 12px rgba(0,255,195,0.5)' : 'inset 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleCellClick(domain, 'operational')}
                  role="button"
                  aria-label={`${domain} (Operational): ${cellData?.value}% ${cellData?.status}`}
                >
                  <span 
                    className="text-xs font-medium text-[#00FFC3] mb-1"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    Operational
                  </span>
                  <span 
                    className="text-lg font-bold text-[#00FFC3]"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {cellData?.value}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div 
        className="h-1/2 m-3 mt-1 rounded-2xl flex flex-col"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
        }}
      >
        {/* Table Header */}
        <div 
          className="h-8 flex items-center justify-between px-4 rounded-t-2xl flex-shrink-0"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
          }}
        >
          <h3 
            className="font-bold text-white text-sm"
            style={{ fontFamily: 'Noto Sans' }}
          >
            All Indicators
          </h3>
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#E0E0E0]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-6 pr-2 py-1 text-xs rounded border-0 outline-none"
                style={{
                  background: 'rgba(20,30,50,0.6)',
                  color: '#E0E0E0',
                  fontFamily: 'Noto Sans',
                  border: '1px solid rgba(255,255,255,0.20)',
                  width: '100px',
                }}
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-2 py-1 text-xs rounded border-0 outline-none"
              style={{
                background: 'rgba(20,30,50,0.6)',
                color: '#E0E0E0',
                fontFamily: 'Noto Sans',
                border: '1px solid rgba(255,255,255,0.20)',
              }}
            >
              <option value="all">All Categories</option>
              <option value="strategic">Strategic</option>
              <option value="operational">Operational</option>
            </select>
            
            <button 
              className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-[#00FFC3] transition-colors"
              aria-label="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-[#00FFC3] transition-colors"
              aria-label="Full Trend Chart"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="h-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(0,255,195,0.2) 0%, rgba(0,184,255,0.2) 100%)',
                }}
              >
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Indicator
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Category
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Domain
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Current
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Target
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Deviation %
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Trend
                </th>
                <th 
                  className="text-left px-2 font-bold text-white text-xs"
                  style={{ fontFamily: 'Noto Sans' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.slice(0, 8).map((indicator, index) => (
                <motion.tr
                  key={indicator.id}
                  className={`h-10 cursor-pointer transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white/2' : 'bg-transparent'
                  } hover:bg-[rgba(0,255,195,0.10)]`}
                  whileHover={{
                    y: -2,
                    boxShadow: '0 0 12px rgba(0,255,195,0.4)',
                  }}
                >
                  <td 
                    className="px-2 font-medium text-[#00FFC3] text-xs"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {indicator.name}
                  </td>
                  <td className="px-2">
                    <span 
                      className={`px-2 py-1 rounded-full font-medium text-xs ${
                        indicator.category === 'strategic' 
                          ? 'bg-[#00FFC3] text-[#081226]' 
                          : 'bg-[#00B8FF] text-[#081226]'
                      }`}
                      style={{ fontFamily: 'Noto Sans' }}
                    >
                      {indicator.category === 'strategic' ? 'Strategic' : 'Operational'}
                    </span>
                  </td>
                  <td 
                    className="px-2 text-[#E0E0E0] text-xs"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {indicator.domain}
                  </td>
                  <td 
                    className="px-2 text-[#E0E0E0] text-xs"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {indicator.currentValue}
                  </td>
                  <td 
                    className="px-2 text-[#E0E0E0] text-xs"
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {indicator.target}
                  </td>
                  <td 
                    className={`px-2 font-medium text-xs ${getDeviationColor(indicator.deviation)}`}
                    style={{ fontFamily: 'Noto Sans' }}
                  >
                    {indicator.deviation > 0 ? '+' : ''}{indicator.deviation}%
                  </td>
                  <td className="px-2">
                    <svg width="60" height="20" viewBox="0 0 60 20">
                      {chartType === 'line' ? (
                        <polyline
                          points={indicator.trend.map((value, i) => `${i * 15},${20 - (value / Math.max(...indicator.trend)) * 15}`).join(' ')}
                          fill="none"
                          stroke="#00FFC3"
                          strokeWidth="1"
                        />
                      ) : (
                        indicator.trend.map((value, i) => (
                          <rect
                            key={i}
                            x={i * 12}
                            y={20 - (value / Math.max(...indicator.trend)) * 15}
                            width="8"
                            height={(value / Math.max(...indicator.trend)) * 15}
                            fill="#00FFC3"
                          />
                        ))
                      )}
                    </svg>
                  </td>
                  <td className="px-2">
                    <button 
                      className="w-5 h-5 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-lg transition-all duration-200"
                      style={{ boxShadow: '0 0 8px rgba(0,255,195,0.4)' }}
                      aria-label={`Drill down into ${indicator.name}`}
                    >
                      <Eye className="w-3 h-3 text-[#081226]" />
                    </button>
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
