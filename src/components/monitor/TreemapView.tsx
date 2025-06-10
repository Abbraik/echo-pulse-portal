
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Info, X, TrendingUp, AlertTriangle, CheckCircle, Calendar, Users, Settings } from 'lucide-react';

interface TreemapData {
  id: string;
  name: string;
  value: number;
  weight: number;
  status: 'healthy' | 'warning' | 'critical';
  category: string;
  target: number;
  trend: number[];
  lastUpdated: string;
  owner: string;
  description: string;
}

interface TreemapViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

const TreemapView: React.FC<TreemapViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<TreemapData | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  // 40 comprehensive indicators with 10% reduced values
  const indicators: TreemapData[] = useMemo(() => [
    { id: '1', name: 'DEI Composite Score', value: 70, weight: 15, status: 'warning', category: 'Strategic', target: 80, trend: [75, 74, 72, 70, 69], lastUpdated: '2025-01-10', owner: 'Strategy Team', description: 'Overall diversity, equity and inclusion composite metric across all organizational dimensions.' },
    { id: '2', name: 'Network Resilience', value: 83, weight: 12, status: 'healthy', category: 'Operational', target: 85, trend: [78, 80, 82, 83, 84], lastUpdated: '2025-01-10', owner: 'IT Operations', description: 'System network stability and fault tolerance capabilities.' },
    { id: '3', name: 'Resource Efficiency', value: 83, weight: 10, status: 'healthy', category: 'Operational', target: 85, trend: [85, 87, 86, 83, 84], lastUpdated: '2025-01-10', owner: 'Operations', description: 'Optimal utilization of computational and human resources.' },
    { id: '4', name: 'Social Cohesion Index', value: 77, weight: 9, status: 'warning', category: 'Community', target: 90, trend: [88, 85, 80, 77, 76], lastUpdated: '2025-01-10', owner: 'Community Relations', description: 'Measure of internal team collaboration and external stakeholder engagement.' },
    { id: '5', name: 'Innovation Pipeline', value: 82, weight: 8, status: 'healthy', category: 'Strategic', target: 85, trend: [76, 78, 80, 82, 83], lastUpdated: '2025-01-10', owner: 'R&D Team', description: 'Active innovation projects and breakthrough potential assessment.' },
    { id: '6', name: 'Trust Recovery Rate', value: 60, weight: 8, status: 'critical', category: 'Strategic', target: 75, trend: [72, 68, 65, 62, 60], lastUpdated: '2025-01-10', owner: 'Executive Leadership', description: 'Stakeholder confidence restoration following systemic challenges.' },
    { id: '7', name: 'Workflow Optimization', value: 60, weight: 7, status: 'critical', category: 'Operational', target: 75, trend: [72, 68, 64, 61, 60], lastUpdated: '2025-01-10', owner: 'Process Engineering', description: 'Efficiency of core operational workflows and process automation.' },
    { id: '8', name: 'Knowledge Transfer', value: 75, weight: 7, status: 'healthy', category: 'Learning', target: 80, trend: [70, 72, 74, 75, 76], lastUpdated: '2025-01-10', owner: 'Learning & Development', description: 'Effectiveness of institutional knowledge sharing and retention.' },
    { id: '9', name: 'Stakeholder Engagement', value: 79, weight: 6, status: 'healthy', category: 'Community', target: 85, trend: [75, 77, 78, 79, 80], lastUpdated: '2025-01-10', owner: 'Stakeholder Relations', description: 'Quality and frequency of stakeholder interactions and feedback incorporation.' },
    { id: '10', name: 'Security Posture', value: 88, weight: 6, status: 'healthy', category: 'Operational', target: 90, trend: [85, 86, 87, 88, 89], lastUpdated: '2025-01-10', owner: 'Security Team', description: 'Overall cybersecurity resilience and threat response capability.' },
    { id: '11', name: 'Adaptive Capacity', value: 72, weight: 5, status: 'warning', category: 'Strategic', target: 80, trend: [68, 70, 71, 72, 73], lastUpdated: '2025-01-10', owner: 'Strategy Team', description: 'Organizational ability to respond to changing environmental conditions.' },
    { id: '12', name: 'Data Quality', value: 85, weight: 5, status: 'healthy', category: 'Technical', target: 90, trend: [82, 83, 84, 85, 86], lastUpdated: '2025-01-10', owner: 'Data Engineering', description: 'Accuracy, completeness, and reliability of organizational data assets.' },
    { id: '13', name: 'Performance Metrics', value: 81, weight: 5, status: 'healthy', category: 'Operational', target: 85, trend: [78, 79, 80, 81, 82], lastUpdated: '2025-01-10', owner: 'Analytics Team', description: 'Key performance indicators tracking and trend analysis.' },
    { id: '14', name: 'Risk Mitigation', value: 74, weight: 4, status: 'warning', category: 'Strategic', target: 80, trend: [76, 75, 74, 73, 74], lastUpdated: '2025-01-10', owner: 'Risk Management', description: 'Proactive risk identification and mitigation strategy effectiveness.' },
    { id: '15', name: 'Team Cohesion', value: 76, weight: 4, status: 'healthy', category: 'Community', target: 80, trend: [74, 75, 76, 77, 76], lastUpdated: '2025-01-10', owner: 'HR Team', description: 'Internal team collaboration quality and cross-functional cooperation.' },
    { id: '16', name: 'Learning Velocity', value: 78, weight: 4, status: 'healthy', category: 'Learning', target: 85, trend: [75, 76, 77, 78, 79], lastUpdated: '2025-01-10', owner: 'Learning & Development', description: 'Speed of knowledge acquisition and skill development across teams.' },
    { id: '17', name: 'System Reliability', value: 92, weight: 4, status: 'healthy', category: 'Technical', target: 95, trend: [90, 91, 92, 93, 92], lastUpdated: '2025-01-10', owner: 'Platform Engineering', description: 'System uptime, availability, and consistent performance delivery.' },
    { id: '18', name: 'Communication Flow', value: 73, weight: 3, status: 'warning', category: 'Operational', target: 80, trend: [75, 74, 73, 72, 73], lastUpdated: '2025-01-10', owner: 'Communications', description: 'Information flow efficiency across organizational hierarchies and teams.' },
    { id: '19', name: 'Cultural Alignment', value: 71, weight: 3, status: 'warning', category: 'Community', target: 80, trend: [73, 72, 71, 70, 71], lastUpdated: '2025-01-10', owner: 'Culture & Values', description: 'Alignment between organizational values and daily operational practices.' },
    { id: '20', name: 'Technology Debt', value: 67, weight: 3, status: 'critical', category: 'Technical', target: 75, trend: [70, 69, 68, 67, 66], lastUpdated: '2025-01-10', owner: 'Engineering', description: 'Technical debt accumulation and technical improvement initiatives progress.' },
    { id: '21', name: 'Feedback Integration', value: 74, weight: 3, status: 'warning', category: 'Learning', target: 80, trend: [72, 73, 74, 75, 74], lastUpdated: '2025-01-10', owner: 'Continuous Improvement', description: 'Speed and effectiveness of incorporating stakeholder feedback into operations.' },
    { id: '22', name: 'Environmental Impact', value: 69, weight: 3, status: 'warning', category: 'Sustainability', target: 75, trend: [71, 70, 69, 68, 69], lastUpdated: '2025-01-10', owner: 'Sustainability Team', description: 'Environmental footprint reduction and sustainable practice implementation.' },
    { id: '23', name: 'Market Position', value: 80, weight: 3, status: 'healthy', category: 'Strategic', target: 85, trend: [77, 78, 79, 80, 81], lastUpdated: '2025-01-10', owner: 'Market Intelligence', description: 'Competitive positioning and market share trends analysis.' },
    { id: '24', name: 'Cost Efficiency', value: 82, weight: 2, status: 'healthy', category: 'Financial', target: 85, trend: [80, 81, 82, 83, 82], lastUpdated: '2025-01-10', owner: 'Finance Team', description: 'Operational cost optimization and resource allocation efficiency.' },
    { id: '25', name: 'Vendor Relations', value: 75, weight: 2, status: 'healthy', category: 'Operational', target: 80, trend: [73, 74, 75, 76, 75], lastUpdated: '2025-01-10', owner: 'Procurement', description: 'Quality of vendor partnerships and supply chain resilience.' },
    { id: '26', name: 'Compliance Status', value: 89, weight: 2, status: 'healthy', category: 'Governance', target: 95, trend: [87, 88, 89, 90, 89], lastUpdated: '2025-01-10', owner: 'Compliance Team', description: 'Regulatory compliance adherence and audit readiness status.' },
    { id: '27', name: 'Innovation Adoption', value: 68, weight: 2, status: 'warning', category: 'Strategic', target: 75, trend: [70, 69, 68, 67, 68], lastUpdated: '2025-01-10', owner: 'Innovation Team', description: 'Speed of new technology and process adoption across the organization.' },
    { id: '28', name: 'Customer Satisfaction', value: 86, weight: 2, status: 'healthy', category: 'External', target: 90, trend: [84, 85, 86, 87, 86], lastUpdated: '2025-01-10', owner: 'Customer Success', description: 'External stakeholder satisfaction levels and loyalty metrics.' },
    { id: '29', name: 'Revenue Growth', value: 77, weight: 2, status: 'healthy', category: 'Financial', target: 80, trend: [75, 76, 77, 78, 77], lastUpdated: '2025-01-10', owner: 'Revenue Operations', description: 'Financial performance trends and revenue stream diversification.' },
    { id: '30', name: 'Talent Retention', value: 84, weight: 2, status: 'healthy', category: 'HR', target: 90, trend: [82, 83, 84, 85, 84], lastUpdated: '2025-01-10', owner: 'Human Resources', description: 'Employee retention rates and talent development program effectiveness.' },
    { id: '31', name: 'Process Automation', value: 71, weight: 1, status: 'warning', category: 'Technical', target: 80, trend: [68, 69, 70, 71, 72], lastUpdated: '2025-01-10', owner: 'Automation Team', description: 'Degree of process automation implementation and operational efficiency gains.' },
    { id: '32', name: 'Knowledge Management', value: 73, weight: 1, status: 'warning', category: 'Learning', target: 80, trend: [71, 72, 73, 74, 73], lastUpdated: '2025-01-10', owner: 'Knowledge Systems', description: 'Organizational knowledge capture, storage, and retrieval effectiveness.' },
    { id: '33', name: 'Strategic Alignment', value: 79, weight: 1, status: 'healthy', category: 'Strategic', target: 85, trend: [77, 78, 79, 80, 79], lastUpdated: '2025-01-10', owner: 'Strategy Office', description: 'Alignment between strategic objectives and operational execution.' },
    { id: '34', name: 'Change Management', value: 72, weight: 1, status: 'warning', category: 'Operational', target: 80, trend: [70, 71, 72, 73, 72], lastUpdated: '2025-01-10', owner: 'Change Management', description: 'Effectiveness of organizational change initiatives and adoption rates.' },
    { id: '35', name: 'Digital Transformation', value: 74, weight: 1, status: 'warning', category: 'Strategic', target: 80, trend: [72, 73, 74, 75, 74], lastUpdated: '2025-01-10', owner: 'Digital Strategy', description: 'Progress of digital transformation initiatives and technology modernization.' },
    { id: '36', name: 'Supplier Diversity', value: 66, weight: 1, status: 'critical', category: 'Sustainability', target: 75, trend: [68, 67, 66, 65, 66], lastUpdated: '2025-01-10', owner: 'Procurement', description: 'Diversity metrics within supplier network and inclusive sourcing practices.' },
    { id: '37', name: 'Energy Efficiency', value: 78, weight: 1, status: 'healthy', category: 'Sustainability', target: 85, trend: [76, 77, 78, 79, 78], lastUpdated: '2025-01-10', owner: 'Facilities', description: 'Energy consumption optimization and renewable energy adoption progress.' },
    { id: '38', name: 'Brand Reputation', value: 81, weight: 1, status: 'healthy', category: 'External', target: 85, trend: [79, 80, 81, 82, 81], lastUpdated: '2025-01-10', owner: 'Marketing', description: 'Public perception and brand equity measurement across multiple channels.' },
    { id: '39', name: 'Emergency Preparedness', value: 76, weight: 1, status: 'healthy', category: 'Operational', target: 85, trend: [74, 75, 76, 77, 76], lastUpdated: '2025-01-10', owner: 'Emergency Response', description: 'Disaster recovery capabilities and crisis response plan effectiveness.' },
    { id: '40', name: 'Partnership Quality', value: 73, weight: 1, status: 'warning', category: 'External', target: 80, trend: [71, 72, 73, 74, 73], lastUpdated: '2025-01-10', owner: 'Partnerships', description: 'Strategic partnership value creation and collaborative relationship health.' }
  ], []);

  // Simple treemap algorithm with improved minimum sizes
  const createTreemap = (data: TreemapData[], width: number, height: number) => {
    const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
    const rects: Array<TreemapData & { x: number; y: number; width: number; height: number }> = [];
    
    // Sort by weight descending for better layout
    const sortedData = [...data].sort((a, b) => b.weight - a.weight);
    
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    const minRectSize = 40; // Minimum rectangle size
    
    sortedData.forEach((item) => {
      const area = (item.weight / totalWeight) * width * height;
      const rectWidth = Math.max(minRectSize, Math.sqrt(area * (width / height)));
      const rectHeight = Math.max(minRectSize, area / rectWidth);
      
      // Check if we need to start a new row
      if (currentX + rectWidth > width) {
        currentY += rowHeight;
        currentX = 0;
        rowHeight = 0;
      }
      
      rects.push({
        ...item,
        x: currentX,
        y: currentY,
        width: Math.min(rectWidth, width - currentX),
        height: rectHeight
      });
      
      currentX += rectWidth;
      rowHeight = Math.max(rowHeight, rectHeight);
    });
    
    return rects;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#00FFC3';
      case 'warning': return '#FFC107';
      case 'critical': return '#FF6E6E';
      default: return '#00FFC3';
    }
  };

  const treemapRects = createTreemap(indicators, 800, 500);
  const smallRects = treemapRects.filter(rect => rect.width < 60 || rect.height < 60);

  return (
    <div className="h-full flex flex-col p-4">
      {/* Treemap Container with improved aspect ratio */}
      <div className="flex-1 mb-4">
        <div 
          className="w-full h-full rounded-xl border border-white/10 overflow-hidden"
          style={{
            background: 'rgba(20,30,50,0.6)',
            backdropFilter: 'blur(20px)',
            aspectRatio: '16/9',
            minHeight: '400px'
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 800 500" className="w-full h-full">
            {treemapRects.map((rect) => {
              const canShowText = rect.width > 60 && rect.height > 60;
              return (
                <g key={rect.id}>
                  <rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={getStatusColor(rect.status)}
                    fillOpacity="0.2"
                    stroke={getStatusColor(rect.status)}
                    strokeWidth="2"
                    className="cursor-pointer hover:fillOpacity-0.4 transition-all duration-200"
                    onClick={() => setSelectedIndicator(rect)}
                  />
                  
                  {canShowText ? (
                    <>
                      {/* Title - Fixed position from top */}
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + 16}
                        textAnchor="middle"
                        className="text-xs font-bold fill-white cursor-pointer"
                        onClick={() => setSelectedIndicator(rect)}
                      >
                        {rect.name.length > 12 ? rect.name.substring(0, 12) + '...' : rect.name}
                      </text>
                      
                      {/* Score - Fixed position from bottom */}
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height - 8}
                        textAnchor="middle"
                        className="text-lg font-bold cursor-pointer"
                        fill={getStatusColor(rect.status)}
                        onClick={() => setSelectedIndicator(rect)}
                      >
                        {rect.value}%
                      </text>
                    </>
                  ) : (
                    <>
                      {/* Info icon for small rectangles */}
                      <circle
                        cx={rect.x + rect.width / 2}
                        cy={rect.y + rect.height / 2}
                        r="8"
                        fill={getStatusColor(rect.status)}
                        className="cursor-pointer"
                        onClick={() => setSelectedIndicator(rect)}
                      />
                      <text
                        x={rect.x + rect.width / 2}
                        y={rect.y + rect.height / 2 + 3}
                        textAnchor="middle"
                        className="text-xs font-bold fill-black cursor-pointer"
                        onClick={() => setSelectedIndicator(rect)}
                      >
                        i
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend Panel for Small Indicators */}
      {showLegend && smallRects.length > 0 && (
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-teal-400">Compact Indicators</h4>
            <button
              onClick={() => setShowLegend(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {smallRects.map((rect) => (
              <div
                key={rect.id}
                className="flex items-center space-x-2 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 cursor-pointer transition-colors"
                onClick={() => setSelectedIndicator(rect)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor(rect.status) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white truncate">{rect.name}</div>
                  <div 
                    className="text-xs font-bold"
                    style={{ color: getStatusColor(rect.status) }}
                  >
                    {rect.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Modal - Increased size */}
      <AnimatePresence>
        {selectedIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedIndicator(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getStatusColor(selectedIndicator.status) }}
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedIndicator.name}</h2>
                    <p className="text-slate-300">{selectedIndicator.category} Indicator</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIndicator(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-teal-400">{selectedIndicator.value}%</div>
                    <div className="text-sm text-slate-300">Current Score</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{selectedIndicator.target}%</div>
                    <div className="text-sm text-slate-300">Target</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{selectedIndicator.weight}</div>
                    <div className="text-sm text-slate-300">Weight</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${
                      selectedIndicator.status === 'healthy' ? 'text-green-400' :
                      selectedIndicator.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedIndicator.status === 'healthy' ? <CheckCircle size={24} className="mx-auto" /> :
                       selectedIndicator.status === 'warning' ? <AlertTriangle size={24} className="mx-auto" /> :
                       <AlertTriangle size={24} className="mx-auto" />}
                    </div>
                    <div className="text-sm text-slate-300 capitalize">{selectedIndicator.status}</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                  <p className="text-slate-300">{selectedIndicator.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-md font-bold text-white mb-2 flex items-center">
                      <Users size={16} className="mr-2" />
                      Owner & Updates
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Owner:</span>
                        <span className="text-white">{selectedIndicator.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Updated:</span>
                        <span className="text-white">{selectedIndicator.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white mb-2 flex items-center">
                      <Settings size={16} className="mr-2" />
                      Configuration
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Category:</span>
                        <span className="text-white">{selectedIndicator.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Priority Weight:</span>
                        <span className="text-white">{selectedIndicator.weight}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trend Chart */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-md font-bold text-white mb-3 flex items-center">
                      <TrendingUp size={16} className="mr-2" />
                      5-Period Trend
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
                          <LineChart data={selectedIndicator.trend.map((value, index) => ({ period: index + 1, value }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="period" stroke="#94A3B8" />
                            <YAxis stroke="#94A3B8" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#00FFC3" 
                              strokeWidth={2}
                              dot={{ fill: '#00FFC3', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        ) : (
                          <BarChart data={selectedIndicator.trend.map((value, index) => ({ period: index + 1, value }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="period" stroke="#94A3B8" />
                            <YAxis stroke="#94A3B8" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar dataKey="value" fill="#00FFC3" />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Performance vs Target */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="text-md font-bold text-white mb-3">Performance vs Target</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Current', value: selectedIndicator.value, fill: getStatusColor(selectedIndicator.status) },
                              { name: 'Gap', value: Math.max(0, selectedIndicator.target - selectedIndicator.value), fill: 'rgba(255,255,255,0.1)' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                          >
                            {[
                              { name: 'Current', value: selectedIndicator.value, fill: getStatusColor(selectedIndicator.status) },
                              { name: 'Gap', value: Math.max(0, selectedIndicator.target - selectedIndicator.value), fill: 'rgba(255,255,255,0.1)' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-lg font-bold text-white">
                        {((selectedIndicator.value / selectedIndicator.target) * 100).toFixed(1)}% of Target
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreemapView;
