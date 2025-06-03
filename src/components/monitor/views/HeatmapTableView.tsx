
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Minimize2, Maximize2, Search, Download, TrendingUp } from 'lucide-react';

interface HeatmapTableViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
  onFullscreen: (cardId: string) => void;
  isFullscreen: boolean;
}

const HeatmapTableView: React.FC<HeatmapTableViewProps> = ({ 
  timeRange, 
  domainFilter, 
  chartType, 
  onFullscreen, 
  isFullscreen 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const heatmapData = [
    ['Population', 'Resources', 'Social', 'Workflow'],
    [78, 65, 45, 88], // Strategic row
    [82, 72, 58, 91], // Operational row
  ];

  const indicators = [
    { name: 'DEI Composite', category: 'Strategic', domain: 'Population', current: 78, target: 80, deviation: -2.5 },
    { name: 'Resource Efficiency', category: 'Operational', domain: 'Resources', current: 65, target: 75, deviation: -13.3 },
    { name: 'Social Trust', category: 'Strategic', domain: 'Social', current: 45, target: 70, deviation: -35.7 },
    { name: 'Network Development', category: 'Strategic', domain: 'Population', current: 82, target: 80, deviation: 2.5 },
    { name: 'Bundle Coherence', category: 'Operational', domain: 'Workflow', current: 72, target: 75, deviation: -4.0 },
    { name: 'Workflow Efficiency', category: 'Operational', domain: 'Workflow', current: 88, target: 85, deviation: 3.5 },
    { name: 'Population Dynamics', category: 'Strategic', domain: 'Population', current: 35, target: 60, deviation: -41.7 },
    { name: 'System Stability', category: 'Operational', domain: 'Resources', current: 91, target: 90, deviation: 1.1 },
  ];

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return 'rgba(0,255,195,0.25)';
    if (percentage >= 50) return 'rgba(255,193,7,0.25)';
    return 'rgba(255,110,110,0.25)';
  };

  const getDeviationColor = (deviation: number) => {
    if (deviation > 5) return '#00FFC3';
    if (deviation >= -5) return '#FFC107';
    return '#FF6E6E';
  };

  const filteredIndicators = indicators.filter(indicator =>
    indicator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Heatmap Card */}
      <div
        className="w-full rounded-3xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 20, 40, 0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 255, 195, 0.15)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
          height: isFullscreen ? '40%' : '45%',
        }}
      >
        {/* Header */}
        <div
          className="h-10 flex items-center justify-between px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 700,
              fontSize: '16px',
              color: '#FFFFFF',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            Domain Heatmap
          </h2>
          <div className="flex items-center space-x-2">
            <motion.button
              className="text-white opacity-50 hover:opacity-100"
              whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            >
              <MoreVertical size={16} />
            </motion.button>
            <motion.button
              className="text-white opacity-50 hover:opacity-100"
              whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
            >
              <Minimize2 size={16} />
            </motion.button>
            <motion.button
              className="text-white opacity-50 hover:opacity-100"
              whileHover={{ filter: 'drop-shadow(0 0 8px #00FFC3)' }}
              onClick={() => onFullscreen('main-view')}
            >
              <Maximize2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="p-6 h-full">
          <div className="grid grid-cols-4 gap-4 h-full">
            {heatmapData[0].map((domain, colIndex) => (
              <div key={domain} className="flex flex-col gap-4">
                {['Strategic', 'Operational'].map((category, rowIndex) => {
                  const value = heatmapData[rowIndex + 1][colIndex] as number;
                  const cellId = `${category}-${domain}`;
                  
                  return (
                    <motion.div
                      key={cellId}
                      className="flex-1 flex items-center justify-center rounded-lg cursor-pointer"
                      style={{
                        background: getStatusColor(value),
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                        border: selectedCell === cellId ? '2px solid #00FFC3' : 'none',
                      }}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: '0 0 12px rgba(0,255,195,0.5)',
                      }}
                      onClick={() => setSelectedCell(cellId)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${domain} (${category}): ${value}% in-band`}
                    >
                      <div className="text-center">
                        <div
                          style={{
                            fontFamily: 'Noto Sans',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#00FFC3',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          }}
                        >
                          {domain}
                        </div>
                        <div
                          style={{
                            fontFamily: 'Noto Sans',
                            fontSize: '12px',
                            color: '#E0E0E0',
                          }}
                        >
                          {value}%
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div
        className="w-full flex-1 rounded-3xl relative overflow-hidden"
        style={{
          background: 'rgba(10, 20, 40, 0.45)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 255, 195, 0.15)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Header */}
        <div
          className="h-10 flex items-center justify-between px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Noto Sans',
              fontWeight: 700,
              fontSize: '16px',
              color: '#FFFFFF',
            }}
          >
            All Indicators
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-sm rounded"
                style={{
                  background: 'rgba(20,30,50,0.6)',
                  color: '#E0E0E0',
                  border: '1px solid rgba(255,255,255,0.10)',
                  fontFamily: 'Noto Sans',
                  fontSize: '12px',
                }}
              />
            </div>
            <motion.button
              className="p-1 rounded text-white"
              style={{ background: '#00FFC3' }}
              whileHover={{ scale: 1.05 }}
              aria-label="Export CSV"
            >
              <Download size={14} />
            </motion.button>
            <motion.button
              className="p-1 rounded text-white"
              style={{ background: '#00B8FF' }}
              whileHover={{ scale: 1.05 }}
              aria-label="Open Full Trend Chart"
            >
              <TrendingUp size={14} />
            </motion.button>
          </div>
        </div>

        {/* Table */}
        <div className="p-4 overflow-auto h-full">
          <table className="w-full">
            <thead>
              <tr
                style={{
                  background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
                }}
              >
                <th className="text-left p-3 text-white font-bold text-sm">Indicator</th>
                <th className="text-left p-3 text-white font-bold text-sm">Category</th>
                <th className="text-left p-3 text-white font-bold text-sm">Domain</th>
                <th className="text-left p-3 text-white font-bold text-sm">Current</th>
                <th className="text-left p-3 text-white font-bold text-sm">Target</th>
                <th className="text-left p-3 text-white font-bold text-sm">Deviation %</th>
                <th className="text-left p-3 text-white font-bold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.map((indicator, index) => (
                <motion.tr
                  key={indicator.name}
                  className="h-12 border-b border-white/5"
                  style={{
                    background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  }}
                  whileHover={{
                    background: 'rgba(0,255,195,0.10)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 0 12px rgba(0,255,195,0.4)',
                  }}
                  role="row"
                >
                  <td className="p-3 text-teal-400 font-semibold text-sm">{indicator.name}</td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        background: indicator.category === 'Strategic' ? '#00FFC3' : '#00B8FF',
                        color: '#081226',
                      }}
                    >
                      {indicator.category}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300 text-sm">{indicator.domain}</td>
                  <td className="p-3 text-gray-300 text-sm">{indicator.current}</td>
                  <td className="p-3 text-gray-300 text-sm">{indicator.target}</td>
                  <td
                    className="p-3 text-sm font-semibold"
                    style={{ color: getDeviationColor(indicator.deviation) }}
                  >
                    {indicator.deviation > 0 ? '+' : ''}{indicator.deviation.toFixed(1)}%
                  </td>
                  <td className="p-3">
                    <motion.button
                      className="w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center"
                      whileHover={{ scale: 1.1, boxShadow: '0 0 8px #00FFC3' }}
                      aria-label={`Drill down into ${indicator.name}`}
                    >
                      <Search size={12} className="text-gray-900" />
                    </motion.button>
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
