
import React, { useState, useMemo } from 'react';
import { MoreVertical, Minus, Maximize2, Search, Filter, Download, TrendingUp } from 'lucide-react';

interface IndicatorTableProps {
  selectedDomain: string | null;
  selectedCategory: string | null;
}

interface Indicator {
  id: number;
  name: string;
  category: 'Strategic' | 'Operational';
  domain: string;
  currentValue: number | string;
  target: number | string;
  deviation: number;
  status: 'healthy' | 'warning' | 'critical';
}

const indicators: Indicator[] = [
  { id: 1, name: 'DEI Composite Score', category: 'Strategic', domain: 'Population', currentValue: 78, target: 80, deviation: -2.5, status: 'warning' },
  { id: 2, name: 'Resource Efficiency Index', category: 'Strategic', domain: 'Resources', currentValue: 92, target: 85, deviation: 8.2, status: 'healthy' },
  { id: 3, name: 'Social Trust Metric', category: 'Strategic', domain: 'Social', currentValue: 65, target: 75, deviation: -13.3, status: 'critical' },
  { id: 4, name: 'Population Health Score', category: 'Strategic', domain: 'Population', currentValue: 88, target: 80, deviation: 10.0, status: 'healthy' },
  { id: 5, name: 'Open Facilitator Claims', category: 'Operational', domain: 'Workflow', currentValue: '12 open', target: '<10 open', deviation: 20.0, status: 'warning' },
  { id: 6, name: 'Think→Act Queue', category: 'Operational', domain: 'Workflow', currentValue: '5 items', target: '<8 items', deviation: -37.5, status: 'healthy' },
  { id: 7, name: 'Water Usage Efficiency', category: 'Operational', domain: 'Resources', currentValue: 72, target: 80, deviation: -10.0, status: 'warning' },
  { id: 8, name: 'System Error Count', category: 'Operational', domain: 'Workflow', currentValue: 2, target: 1, deviation: 100.0, status: 'critical' }
];

const IndicatorTable: React.FC<IndicatorTableProps> = ({ selectedDomain, selectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredIndicators = useMemo(() => {
    return indicators.filter(indicator => {
      const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || indicator.category === categoryFilter;
      const matchesDomain = domainFilter === 'All' || indicator.domain === domainFilter;
      const matchesSelection = 
        (!selectedDomain || indicator.domain === selectedDomain) &&
        (!selectedCategory || indicator.category === selectedCategory);
      
      return matchesSearch && matchesCategory && matchesDomain && matchesSelection;
    });
  }, [searchTerm, categoryFilter, domainFilter, selectedDomain, selectedCategory]);

  const totalPages = Math.ceil(filteredIndicators.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedIndicators = filteredIndicators.slice(startIndex, startIndex + rowsPerPage);

  const getDeviationColor = (deviation: number) => {
    if (deviation > 5) return '#00FFC3'; // Green
    if (deviation >= -5) return '#FFC107'; // Amber
    return '#FF6E6E'; // Red
  };

  const domains = ['All', 'Population', 'Resources', 'Social', 'Workflow'];
  const categories = ['All', 'Strategic', 'Operational'];

  return (
    <div 
      className="w-full h-full"
      style={{
        background: 'rgba(10,20,40,0.45)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,255,195,0.15)',
        borderRadius: '1.5rem',
        boxShadow: '0 12px 24px rgba(0,0,0,0.6)'
      }}
    >
      {/* Inner Glass */}
      <div 
        className="w-full h-full relative"
        style={{
          background: 'rgba(20,30,50,0.6)',
          backdropFilter: 'blur(32px)',
          borderRadius: '1.25rem',
          margin: '2px'
        }}
      >
        {/* Header */}
        <div 
          className="h-8 flex items-center justify-between px-4"
          style={{
            background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)',
            borderRadius: '1.25rem 1.25rem 0 0'
          }}
        >
          <h3 
            className="text-white font-bold text-sm"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
          >
            All Indicators
          </h3>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 h-6 px-2 text-xs bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:border-[#00FFC3]"
              />
              <Search size={12} className="absolute right-2 top-1.5 text-white/50" />
            </div>
            
            {/* Filter Dropdowns */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-6 px-2 text-xs bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-[#00FFC3]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-[#1a2332] text-white">{cat}</option>
              ))}
            </select>
            
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="h-6 px-2 text-xs bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-[#00FFC3]"
            >
              {domains.map(domain => (
                <option key={domain} value={domain} className="bg-[#1a2332] text-white">{domain}</option>
              ))}
            </select>
            
            <div className="flex items-center gap-2">
              <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all" aria-label="Export CSV">
                <Download size={14} />
              </button>
              <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all" aria-label="Open Full Trend Chart">
                <TrendingUp size={14} />
              </button>
              <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
                <MoreVertical size={14} />
              </button>
              <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
                <Minus size={14} />
              </button>
              <button className="text-white opacity-50 hover:opacity-100 hover:text-[#00FFC3] transition-all">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr 
                className="h-10 text-white text-xs font-bold"
                style={{ background: 'linear-gradient(90deg, #00FFC3 0%, #00B8FF 100%)' }}
              >
                <th className="text-left px-3">Indicator</th>
                <th className="text-center px-2">Category</th>
                <th className="text-center px-2">Domain</th>
                <th className="text-center px-2">Current Value</th>
                <th className="text-center px-2">Target</th>
                <th className="text-center px-2">Deviation %</th>
                <th className="text-center px-2">Trend</th>
                <th className="text-center px-2">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody>
              {paginatedIndicators.map((indicator, index) => (
                <tr 
                  key={indicator.id}
                  className="h-12 text-xs text-[#E0E0E0] border-b border-white/5 hover:bg-[rgba(0,255,195,0.10)] hover:transform hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(0,255,195,0.4)] transition-all duration-200 cursor-pointer"
                  style={{ background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                >
                  <td className="px-3 font-semibold text-[#00FFC3]">{indicator.name}</td>
                  <td className="text-center">
                    <span 
                      className="px-2 py-1 rounded-full text-white text-xs font-medium"
                      style={{ 
                        background: indicator.category === 'Strategic' ? '#00FFC3' : '#00B8FF',
                        color: '#081226'
                      }}
                    >
                      {indicator.category}
                    </span>
                  </td>
                  <td className="text-center text-[#E0E0E0]">{indicator.domain}</td>
                  <td className="text-center font-medium">{indicator.currentValue}</td>
                  <td className="text-center">{indicator.target}</td>
                  <td 
                    className="text-center font-bold"
                    style={{ color: getDeviationColor(indicator.deviation) }}
                  >
                    {indicator.deviation > 0 ? '+' : ''}{indicator.deviation}%
                  </td>
                  <td className="text-center">
                    <div className="w-16 h-4 mx-auto bg-white/10 rounded relative overflow-hidden">
                      <div 
                        className="h-full bg-[#00FFC3] rounded"
                        style={{ width: `${Math.min(Math.abs(indicator.deviation) + 20, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="text-center">
                    <button 
                      className="w-5 h-5 rounded-full bg-[#00FFC3] flex items-center justify-center hover:shadow-[0_0_8px_rgba(0,255,195,0.5)] transition-all"
                      aria-label={`Drill down into ${indicator.name}`}
                    >
                      <Search size={10} className="text-[#081226]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer - Pagination */}
        <div className="h-8 flex items-center justify-between px-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-[#E0E0E0]">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="h-6 px-2 text-xs bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-[#00FFC3]"
            >
              <option value={8} className="bg-[#1a2332] text-white">8</option>
              <option value={15} className="bg-[#1a2332] text-white">15</option>
              <option value={25} className="bg-[#1a2332] text-white">25</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-[#00FFC3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ◀ Prev
            </button>
            <span className="text-xs text-[#E0E0E0]">
              {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="text-[#00FFC3] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorTable;
