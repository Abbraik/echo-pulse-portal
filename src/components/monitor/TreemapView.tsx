
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, TrendingUp, BarChart3, LineChart, Activity } from 'lucide-react';

interface TreemapViewProps {
  timeRange: string;
  domainFilter: string;
  chartType: 'bar' | 'line';
}

interface TreemapData {
  id: string;
  name: string;
  value: number;
  target: number;
  category: 'strategic' | 'operational';
  weight: number;
  status: 'in-band' | 'warning' | 'critical';
  description: string;
  breakdown?: string[];
  lastTrend: string;
  actionHint: string;
}

interface DrillDownModalProps {
  data: TreemapData;
  isOpen: boolean;
  onClose: () => void;
  chartType: 'bar' | 'line';
}

const DrillDownModal: React.FC<DrillDownModalProps> = ({ data, isOpen, onClose, chartType }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'breakdown' | 'actions'>('overview');
  
  const recentValues = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: data.value + (Math.random() - 0.5) * 10,
    remark: i === 29 ? 'Current' : ['Stable', 'Improving', 'Declining', 'Volatile'][Math.floor(Math.random() * 4)]
  }));

  const generateChartData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      value: 60 + Math.random() * 40,
      target: data.target,
      performance: Math.random() > 0.5 ? 'above' : 'below'
    }));
  };

  const chartData = generateChartData();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[900px] h-[700px] rounded-2xl overflow-hidden glass-panel-cinematic"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <X size={20} />
        </button>

        <div className="p-8 h-full flex flex-col font-noto">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-4 h-4 rounded-full ${
              data.status === 'in-band' ? 'bg-emerald-500' :
              data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <h3 className="text-2xl font-bold text-teal-400" style={{ fontFamily: 'Noto Sans' }}>
              {data.name}
            </h3>
            <div className="text-lg text-slate-300">
              {data.value} / {data.target}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            {(['overview', 'trends', 'breakdown', 'actions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-teal-500 text-slate-900'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: 'Noto Sans' }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'overview' && (
              <div className="h-full space-y-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3 text-teal-400">Description</h4>
                  <p className="text-slate-300 leading-relaxed">{data.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-2 text-teal-400">Current Status</h4>
                    <div className="text-2xl font-bold text-white">{data.value}</div>
                    <div className="text-sm text-slate-400">Target: {data.target}</div>
                    <div className="text-sm text-slate-400 mt-2">{data.lastTrend}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-2 text-teal-400">Performance</h4>
                    <div className="text-lg font-medium text-white">
                      {Math.round((data.value / data.target) * 100)}%
                    </div>
                    <div className={`text-sm mt-1 ${
                      data.status === 'in-band' ? 'text-emerald-400' :
                      data.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {data.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="h-full space-y-4">
                <div className="bg-white/5 rounded-lg p-4 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    {chartType === 'bar' ? <BarChart3 size={20} /> : <LineChart size={20} />}
                    <h4 className="text-lg font-semibold text-teal-400">12-Month Trend ({chartType})</h4>
                  </div>
                  <div className="h-48 flex items-end space-x-2">
                    {chartData.map((item, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div className="text-xs text-slate-400 mb-1">{item.value.toFixed(0)}</div>
                        {chartType === 'bar' ? (
                          <div
                            className="w-full rounded-t transition-all duration-500"
                            style={{
                              height: `${(item.value / 100) * 160}px`,
                              background: item.performance === 'above' ? 
                                'linear-gradient(to top, #10b981, #34d399)' : 
                                'linear-gradient(to top, #f59e0b, #fbbf24)',
                            }}
                          />
                        ) : (
                          <div className="relative w-full h-40">
                            <div 
                              className="absolute bottom-0 w-2 h-2 rounded-full bg-teal-400"
                              style={{ left: '50%', transform: 'translateX(-50%)', bottom: `${(item.value / 100) * 160}px` }}
                            />
                            {i > 0 && (
                              <svg className="absolute inset-0 w-full h-full">
                                <line
                                  x1="0%"
                                  y1={`${100 - (chartData[i-1].value / 100) * 100}%`}
                                  x2="100%"
                                  y2={`${100 - (item.value / 100) * 100}%`}
                                  stroke="#14b8a6"
                                  strokeWidth="2"
                                />
                              </svg>
                            )}
                          </div>
                        )}
                        <div className="text-xs text-slate-500 mt-1">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3 text-teal-400">Recent Values</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {recentValues.slice(-7).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-slate-400">{item.date}</span>
                        <span className="text-white font-medium">{item.value.toFixed(1)}</span>
                        <span className="text-slate-500 italic">{item.remark}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'breakdown' && (
              <div className="h-full space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 text-teal-400">Component Breakdown</h4>
                  {data.breakdown && data.breakdown.length > 0 ? (
                    <div className="space-y-3">
                      {data.breakdown.map((item, index) => {
                        const match = item.match(/(\d+)%?/);
                        const percentage = match ? parseInt(match[1]) : Math.floor(Math.random() * 100);
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300">{item}</span>
                              <span className="text-white font-medium">{percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  background: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-slate-400 italic">No breakdown data available</div>
                  )}
                </div>

                <div className="bg-white/5 rounded-lg p-4 flex-1">
                  <h4 className="text-lg font-semibold mb-4 text-teal-400">Contributing Factors</h4>
                  <div className="space-y-2">
                    {['Primary Factor', 'Secondary Factor', 'Tertiary Factor'].map((factor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-teal-400" />
                        <span className="text-slate-300">{factor}: Impact {(90 - index * 15)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="h-full space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-3 text-teal-400">Recommended Actions</h4>
                  <p className="text-slate-300 mb-4">{data.actionHint}</p>
                  
                  <div className="space-y-3">
                    {['Immediate Action', 'Short-term Strategy', 'Long-term Plan'].map((action, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <Activity size={16} className="text-teal-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-white">{action}</div>
                          <div className="text-sm text-slate-400 mt-1">
                            Priority: {['High', 'Medium', 'Low'][index]} | 
                            Timeline: {['1-7 days', '1-4 weeks', '1-6 months'][index]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-teal-500 hover:bg-teal-400 text-slate-900">
                    Go to Detailed View
                  </button>
                  <button className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-blue-500 hover:bg-blue-400 text-white">
                    Create Action Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TreemapView: React.FC<TreemapViewProps> = ({ timeRange, domainFilter, chartType }) => {
  const [filter, setFilter] = useState<'all' | 'strategic' | 'operational'>('all');
  const [hoveredRect, setHoveredRect] = useState<string | null>(null);
  const [selectedRect, setSelectedRect] = useState<TreemapData | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: TreemapData } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const treemapData: TreemapData[] = [
    // Strategic Indicators - values reduced by 10%
    { 
      id: 's1', 
      name: 'DEI Composite', 
      value: 70.2, // reduced from 78
      target: 80, 
      category: 'strategic', 
      weight: 120, 
      status: 'warning', // updated based on new value
      description: 'Overall "Demographic-Equilibrium Index" – a weighted blend of population, age-structure, fertility balance, and social cohesion metrics.',
      breakdown: [
        'Population Stability: 99%',
        'Age Structure Balance: 95%', 
        'Fertility Confidence: 96%',
        'Social Cohesion: 100%'
      ],
      lastTrend: '↑1.5% last month',
      actionHint: 'Hover to drill into full DEI report.'
    },
    { 
      id: 's2', 
      name: 'Trust Recovery Index', 
      value: 80.1, // reduced from 89
      target: 100, 
      category: 'strategic', 
      weight: 90, 
      status: 'in-band',
      description: 'A composite gauge of stakeholder trust (public surveys, partner feedback, system transparency scores).',
      breakdown: [
        'Public Survey Score: 92/100',
        'Partner Feedback Score: 85/100',
        'Transparency Index: 90/100'
      ],
      lastTrend: '↑2% last 7 days',
      actionHint: 'Click to see detailed trust-building recommendations.'
    },
    { 
      id: 's3', 
      name: 'Network Development Index', 
      value: 57.6, // reduced from 64
      target: 100, 
      category: 'strategic', 
      weight: 80, 
      status: 'warning',
      description: 'Degree of causal network coverage in the Think zone: how many loops and CLD nodes have been robustly mapped vs. total recommended.',
      breakdown: [
        'Population → Resource loop (2/5 nodes missing)',
        'Migration → Economic loop (1/4 nodes missing)',
        'Environment Feedback loop (0/3 nodes missing)'
      ],
      lastTrend: '+4 loops mapped last week',
      actionHint: 'Click to view full CLD mapping status.'
    },
    { 
      id: 's4', 
      name: 'Bundle Coherence Score', 
      value: 64.8, // reduced from 72
      target: 90, 
      category: 'strategic', 
      weight: 70, 
      status: 'warning',
      description: 'Average "loop coverage" across active strategic bundles (i.e., how many identified leverage points each bundle actually addresses).',
      breakdown: [
        'Missing "Resource Recycling" leverage point in Bundle Beta',
        '"Education Budget" loop underweighted in Bundle Gamma'
      ],
      lastTrend: '+7% this month',
      actionHint: 'Click to open strategy builder for coherence improvements.'
    },
    { 
      id: 's5', 
      name: 'Population Stability Rate', 
      value: 76.5, // reduced from 85
      target: 90, 
      category: 'strategic', 
      weight: 60, 
      status: 'warning', // updated based on new value
      description: 'Measure of population growth/decline stability within optimal ranges.',
      breakdown: ['Birth Rate: 94%', 'Migration Balance: 88%', 'Retention: 92%'],
      lastTrend: '↑3% last quarter',
      actionHint: 'View population dynamics analysis.'
    },
    { 
      id: 's6', 
      name: 'Resource Stock vs. Target', 
      value: 66.6, // reduced from 74
      target: 85, 
      category: 'strategic', 
      weight: 50, 
      status: 'warning',
      description: 'Current resource reserves compared to strategic targets.',
      breakdown: ['Energy: 78%', 'Water: 71%', 'Materials: 73%'],
      lastTrend: '↓2% last month',
      actionHint: 'Optimize resource allocation strategies.'
    },
    { 
      id: 's7', 
      name: 'Economic Output Growth (%)', 
      value: 2.88, // reduced from 3.2
      target: 4.0, 
      category: 'strategic', 
      weight: 45, 
      status: 'warning',
      description: 'Annual GDP growth rate and productivity measures.',
      breakdown: ['Manufacturing: 2.8%', 'Services: 3.6%', 'Innovation: 3.1%'],
      lastTrend: '↑0.3% last quarter',
      actionHint: 'Review economic stimulus measures.'
    },
    { 
      id: 's8', 
      name: 'Social Cohesion Index', 
      value: 73.8, // reduced from 82
      target: 85, 
      category: 'strategic', 
      weight: 40, 
      status: 'warning', // updated based on new value
      description: 'Measurement of community bonds and social trust levels.',
      breakdown: ['Community Trust: 88%', 'Civic Participation: 79%', 'Social Networks: 85%'],
      lastTrend: '↑1% last week',
      actionHint: 'Explore community strengthening initiatives.'
    },
    { 
      id: 's9', 
      name: 'Renewal vs. Consumption Balance', 
      value: 78.3, // reduced from 87
      target: 90, 
      category: 'strategic', 
      weight: 35, 
      status: 'warning', // updated based on new value
      description: 'Ratio of renewable resource generation to consumption rates.',
      breakdown: ['Renewable Energy: 92%', 'Water Cycle: 84%', 'Material Recycling: 85%'],
      lastTrend: '↑2% last quarter',
      actionHint: 'Accelerate sustainability initiatives.'
    },
    { 
      id: 's10', 
      name: 'Fertility Confidence Level', 
      value: 61.2, // reduced from 68
      target: 75, 
      category: 'strategic', 
      weight: 30, 
      status: 'warning',
      description: 'Composite measure of reproductive health and family planning confidence.',
      breakdown: ['Health Access: 85%', 'Economic Security: 62%', 'Social Support: 77%'],
      lastTrend: '↑2% last month',
      actionHint: 'Review family support policies.'
    },
    { 
      id: 's11', 
      name: 'Age-Structure Balance Ratio', 
      value: 68.4, // reduced from 76
      target: 80, 
      category: 'strategic', 
      weight: 25, 
      status: 'warning', // updated based on new value
      description: 'Balance between working-age and dependent populations.',
      breakdown: ['Working Age: 78%', 'Youth Dependency: 82%', 'Elder Dependency: 74%'],
      lastTrend: '↓1% last month',
      actionHint: 'Analyze demographic transitions.'
    },
    { 
      id: 's12', 
      name: 'Supply–Demand Gap', 
      value: 6.3, // reduced from 7
      target: 5, 
      category: 'strategic', 
      weight: 20, 
      status: 'warning',
      description: 'Percentage gap between supply and demand across key sectors.',
      breakdown: ['Housing: 8%', 'Food: 5%', 'Energy: 9%'],
      lastTrend: '↓1% last month',
      actionHint: 'Balance supply chain optimization.'
    },
    { 
      id: 's13', 
      name: 'Price Stability Index', 
      value: 84.6, // reduced from 94
      target: 95, 
      category: 'strategic', 
      weight: 15, 
      status: 'warning', // updated based on new value
      description: 'Measure of price volatility across essential goods and services.',
      breakdown: ['Food Prices: 96%', 'Energy Prices: 91%', 'Housing Costs: 95%'],
      lastTrend: '↑1% last week',
      actionHint: 'Monitor inflation indicators.'
    },
    { 
      id: 's14', 
      name: 'Capacity Utilization (Key Sectors)', 
      value: 70.2, // reduced from 78
      target: 85, 
      category: 'strategic', 
      weight: 12, 
      status: 'warning',
      description: 'Percentage of maximum capacity being utilized in critical sectors.',
      breakdown: ['Manufacturing: 82%', 'Healthcare: 76%', 'Education: 74%'],
      lastTrend: '↑3% last month',
      actionHint: 'Expand capacity in underutilized sectors.'
    },
    { 
      id: 's15', 
      name: 'Environmental Quality Index', 
      value: 63.9, // reduced from 71
      target: 80, 
      category: 'strategic', 
      weight: 10, 
      status: 'warning',
      description: 'Composite environmental health and sustainability metrics.',
      breakdown: ['Air Quality: 74%', 'Water Quality: 69%', 'Biodiversity: 70%'],
      lastTrend: '↑3% last year',
      actionHint: 'Accelerate environmental protection.'
    },
    { 
      id: 's16', 
      name: 'Employment Rate', 
      value: 81.9, // reduced from 91
      target: 95, 
      category: 'strategic', 
      weight: 8, 
      status: 'warning', // updated based on new value
      description: 'Percentage of working-age population in employment.',
      breakdown: ['Full-time: 85%', 'Part-time: 12%', 'Self-employed: 8%'],
      lastTrend: '↑2% last quarter',
      actionHint: 'Support job creation programs.'
    },
    { 
      id: 's17', 
      name: 'Education Completion Rate', 
      value: 79.2, // reduced from 88
      target: 92, 
      category: 'strategic', 
      weight: 8, 
      status: 'warning', // updated based on new value
      description: 'Percentage completing secondary and tertiary education.',
      breakdown: ['Secondary: 94%', 'Tertiary: 67%', 'Vocational: 85%'],
      lastTrend: '↑1% last year',
      actionHint: 'Enhance educational pathways.'
    },
    { 
      id: 's18', 
      name: 'Health Status Index', 
      value: 74.7, // reduced from 83
      target: 88, 
      category: 'strategic', 
      weight: 8, 
      status: 'warning', // updated based on new value
      description: 'Composite health outcome measures across population.',
      breakdown: ['Life Expectancy: 87%', 'Disease Prevention: 81%', 'Mental Health: 79%'],
      lastTrend: '↑2% last year',
      actionHint: 'Strengthen healthcare systems.'
    },
    { 
      id: 's19', 
      name: 'Household Revenue Level', 
      value: 68.4, // reduced from 76
      target: 80, 
      category: 'strategic', 
      weight: 5, 
      status: 'warning', // updated based on new value
      description: 'Average household income relative to living cost benchmarks.',
      breakdown: ['Median Income: 78%', 'Income Distribution: 74%', 'Purchasing Power: 76%'],
      lastTrend: '↑1% last quarter',
      actionHint: 'Review income support policies.'
    },
    { 
      id: 's20', 
      name: 'Global Influence Score', 
      value: 58.5, // reduced from 65
      target: 75, 
      category: 'strategic', 
      weight: 5, 
      status: 'warning',
      description: 'Measure of international standing and diplomatic influence.',
      breakdown: ['Trade Relations: 72%', 'Diplomatic Ties: 61%', 'Cultural Impact: 63%'],
      lastTrend: '↑2% last quarter',
      actionHint: 'Strengthen international partnerships.'
    },

    // Operational Indicators - values reduced by 10%
    { 
      id: 'o1', 
      name: 'Open Facilitator Claims', 
      value: 10.8, // reduced from 12
      target: 0, 
      category: 'operational', 
      weight: 100, 
      status: 'critical',
      description: 'Number of workflow "claims" (roles/tasks) in any zone that remain unassigned or unresolved.',
      breakdown: ['Think: 4', 'Act: 3', 'Monitor: 2', 'Learn: 2', 'Innovate: 1'],
      lastTrend: 'Oldest: 5 days',
      actionHint: 'Click to view claim queue and assign resources.'
    },
    { 
      id: 'o2', 
      name: 'System Error Count', 
      value: 4.5, // reduced from 5
      target: 0, 
      category: 'operational', 
      weight: 90, 
      status: 'warning',
      description: 'Number of software/system-integrity warnings or errors in the portal over the last 24 hours.',
      breakdown: [
        '2 × API timeout (Act zone)',
        '1 × Database write failure (Monitor zone)',
        '2 × UI rendering glitch (Learn zone)'
      ],
      lastTrend: 'Most Recent: Data sync failure at 03:45 UTC',
      actionHint: 'Click to view full error logs and resolve issues.'
    },
    { 
      id: 'o3', 
      name: 'Think→Act Queue Length', 
      value: 3.6, // reduced from 4
      target: 0, 
      category: 'operational', 
      weight: 60, 
      status: 'warning',
      description: 'How many analysis outputs (loop findings, simulations) are waiting for strategy translation in Act.',
      breakdown: [
        'DEI target adjustment proposal',
        '"Population Volatility vs. Resource Gap" report',
        '"Social Cohesion Feedback" network analysis'
      ],
      lastTrend: 'Avg Wait: 2.3 days',
      actionHint: 'Click to forward to strategy builder or reassign to Act leads.'
    },
    { 
      id: 'o4', 
      name: 'Act→Monitor Queue Length', 
      value: 2.7, // reduced from 3
      target: 0, 
      category: 'operational', 
      weight: 50, 
      status: 'warning',
      description: 'Number of planned bundles/strategies sent to Monitor for validation that haven\'t yet been evaluated on real-world data.',
      breakdown: [
        'Bundle Delta (Population Incentives)',
        'Bundle Epsilon (Resource Quotas)',
        'Bundle Zeta (Social Cohesion Programs)'
      ],
      lastTrend: 'Avg Delay: 1.8 days',
      actionHint: 'Click to run new simulations or update real-world data feeds.'
    },
    { 
      id: 'o5', 
      name: 'DEI Stability Band %', 
      value: 84.6, // reduced from 94
      target: 98, 
      category: 'operational', 
      weight: 45, 
      status: 'warning', // updated based on new value
      description: 'Percentage of time DEI metrics remain within acceptable variance bands.',
      breakdown: ['Within Target: 94%', 'Minor Variance: 4%', 'Major Variance: 2%'],
      lastTrend: '↑1% last week',
      actionHint: 'Monitor stability patterns.'
    },
    { 
      id: 'o6', 
      name: 'Bundle ROI Achievement (%)', 
      value: 78.3, // reduced from 87
      target: 90, 
      category: 'operational', 
      weight: 40, 
      status: 'warning', // updated based on new value
      description: 'Percentage of strategic bundles meeting their ROI targets.',
      breakdown: ['Above Target: 45%', 'On Target: 42%', 'Below Target: 13%'],
      lastTrend: '↑3% last month',
      actionHint: 'Optimize underperforming bundles.'
    },
    { 
      id: 'o7', 
      name: 'Latency of Real-World Data Sync', 
      value: 1.89, // reduced from 2.1
      target: 1.0, 
      category: 'operational', 
      weight: 35, 
      status: 'warning',
      description: 'Average delay in hours between real-world events and system data updates.',
      breakdown: ['Economic Data: 1.8h', 'Social Data: 2.4h', 'Environmental: 2.1h'],
      lastTrend: '↓0.3h last week',
      actionHint: 'Improve data pipeline efficiency.'
    },
    { 
      id: 'o8', 
      name: 'Claims Aging (Avg Days Open)', 
      value: 2.88, // reduced from 3.2
      target: 1.0, 
      category: 'operational', 
      weight: 30, 
      status: 'critical',
      description: 'Average number of days open claims have been unresolved.',
      breakdown: ['<1 day: 25%', '1-3 days: 45%', '>3 days: 30%'],
      lastTrend: '↑0.5 days last week',
      actionHint: 'Expedite claim resolution processes.'
    },
    { 
      id: 'o9', 
      name: 'Workflow Handoff Delay (hrs)', 
      value: 5.85, // reduced from 6.5
      target: 2.0, 
      category: 'operational', 
      weight: 25, 
      status: 'warning',
      description: 'Average delay in hours for workflow transitions between zones.',
      breakdown: ['Think→Act: 4.2h', 'Act→Monitor: 8.1h', 'Monitor→Learn: 7.2h'],
      lastTrend: '↓1.2h last week',
      actionHint: 'Streamline handoff procedures.'
    },
    { 
      id: 'o10', 
      name: 'Data Pipeline Failure Rate (%)', 
      value: 1.89, // reduced from 2.1
      target: 0.5, 
      category: 'operational', 
      weight: 20, 
      status: 'warning',
      description: 'Percentage of data pipeline executions that fail or timeout.',
      breakdown: ['Ingestion: 1.8%', 'Processing: 2.4%', 'Output: 2.1%'],
      lastTrend: '↓0.3% last week',
      actionHint: 'Improve pipeline reliability.'
    },
    { 
      id: 'o11', 
      name: 'Number of Active Alerts', 
      value: 6.3, // reduced from 7
      target: 3, 
      category: 'operational', 
      weight: 15, 
      status: 'warning',
      description: 'Current number of active system alerts requiring attention.',
      breakdown: ['High Priority: 2', 'Medium Priority: 3', 'Low Priority: 2'],
      lastTrend: '↓2 alerts last day',
      actionHint: 'Address outstanding alerts.'
    },
    { 
      id: 'o12', 
      name: 'Anomalies Detected (24h)', 
      value: 2.7, // reduced from 3
      target: 1, 
      category: 'operational', 
      weight: 12, 
      status: 'warning',
      description: 'Number of anomalies detected in system behavior over last 24 hours.',
      breakdown: ['Data Anomalies: 2', 'Performance Anomalies: 1', 'Security Anomalies: 0'],
      lastTrend: '↓1 anomaly last day',
      actionHint: 'Investigate recent anomalies.'
    },
    { 
      id: 'o13', 
      name: 'Entropy Score (Think Zone)', 
      value: 20.7, // reduced from 23
      target: 15, 
      category: 'operational', 
      weight: 10, 
      status: 'warning',
      description: 'Measure of disorder/inefficiency in Think zone processes.',
      breakdown: ['Process Variance: 28%', 'Resource Utilization: 18%', 'Output Quality: 23%'],
      lastTrend: '↓2 points last month',
      actionHint: 'Optimize Think zone workflows.'
    },
    { 
      id: 'o14', 
      name: 'Entropy Score (Act Zone)', 
      value: 17.1, // reduced from 19
      target: 15, 
      category: 'operational', 
      weight: 10, 
      status: 'warning',
      description: 'Measure of disorder/inefficiency in Act zone processes.',
      breakdown: ['Process Variance: 22%', 'Resource Utilization: 16%', 'Output Quality: 19%'],
      lastTrend: '↓1 point last week',
      actionHint: 'Streamline Act zone operations.'
    },
    { 
      id: 'o15', 
      name: 'Entropy Score (Monitor Zone)', 
      value: 12.6, // reduced from 14
      target: 15, 
      category: 'operational', 
      weight: 8, 
      status: 'in-band',
      description: 'Measure of disorder/inefficiency in Monitor zone processes.',
      breakdown: ['Process Variance: 12%', 'Resource Utilization: 16%', 'Output Quality: 14%'],
      lastTrend: '→ stable last month',
      actionHint: 'Maintain current efficiency levels.'
    },
    { 
      id: 'o16', 
      name: 'Entropy Score (Learn Zone)', 
      value: 15.3, // reduced from 17
      target: 15, 
      category: 'operational', 
      weight: 8, 
      status: 'warning',
      description: 'Measure of disorder/inefficiency in Learn zone processes.',
      breakdown: ['Process Variance: 19%', 'Resource Utilization: 15%', 'Output Quality: 17%'],
      lastTrend: '↓3 points last month',
      actionHint: 'Continue Learn zone optimization.'
    },
    { 
      id: 'o17', 
      name: 'Entropy Score (Innovate Zone)', 
      value: 18.9, // reduced from 21
      target: 15, 
      category: 'operational', 
      weight: 8, 
      status: 'warning',
      description: 'Measure of disorder/inefficiency in Innovate zone processes.',
      breakdown: ['Process Variance: 25%', 'Resource Utilization: 17%', 'Output Quality: 21%'],
      lastTrend: '↓1 point last week',
      actionHint: 'Focus on Innovate zone efficiency.'
    },
    { 
      id: 'o18', 
      name: 'User Session Errors / Hour', 
      value: 0.72, // reduced from 0.8
      target: 0.2, 
      category: 'operational', 
      weight: 5, 
      status: 'warning',
      description: 'Average number of user-facing errors per hour across all sessions.',
      breakdown: ['UI Errors: 0.5/h', 'API Errors: 0.2/h', 'Auth Errors: 0.1/h'],
      lastTrend: '↓0.2/h last week',
      actionHint: 'Continue error reduction initiatives.'
    },
    { 
      id: 'o19', 
      name: 'Average Bundle Validation Time (days)', 
      value: 2.52, // reduced from 2.8
      target: 1.5, 
      category: 'operational', 
      weight: 5, 
      status: 'warning',
      description: 'Average time taken to validate new strategic bundles.',
      breakdown: ['Data Collection: 1.2 days', 'Analysis: 1.1 days', 'Review: 0.5 days'],
      lastTrend: '↓0.4 days last month',
      actionHint: 'Accelerate validation processes.'
    },
    { 
      id: 'o20', 
      name: 'Pending Playbook Triggers', 
      value: 1.8, // reduced from 2
      target: 0, 
      category: 'operational', 
      weight: 3, 
      status: 'warning',
      description: 'Number of automated playbook triggers that are pending execution.',
      breakdown: ['Resource Triggers: 1', 'Performance Triggers: 1', 'Alert Triggers: 0'],
      lastTrend: '→ stable last day',
      actionHint: 'Execute pending triggers.'
    },
  ];

  const filteredData = treemapData.filter(item => 
    filter === 'all' || item.category === filter
  );

  const getBaseColor = (category: string) => {
    return category === 'strategic' ? 'rgba(0,184,255,0.8)' : 'rgba(0,255,195,0.8)';
  };

  const getStatusOverlay = (status: string) => {
    switch (status) {
      case 'in-band': return 'rgba(0,255,195,0.2)';
      case 'warning': return 'rgba(255,193,7,0.2)';
      case 'critical': return 'rgba(255,110,110,0.2)';
      default: return 'rgba(0,255,195,0.2)';
    }
  };

  // Squarified treemap algorithm similar to S&P 500
  const calculateLayout = (data: TreemapData[]) => {
    if (data.length === 0) return [];

    const totalWeight = data.reduce((sum, item) => sum + item.weight, 0);
    const containerWidth = 100;
    const containerHeight = 100;
    const totalArea = containerWidth * containerHeight;

    // Sort by weight descending (largest first, like S&P 500)
    const sortedData = [...data].sort((a, b) => b.weight - a.weight);
    
    // Calculate normalized areas
    const itemsWithArea = sortedData.map(item => ({
      ...item,
      area: (item.weight / totalWeight) * totalArea,
    }));

    const result: (TreemapData & { x: number; y: number; width: number; height: number })[] = [];

    // Squarified treemap implementation
    let currentX = 0;
    let currentY = 0;
    let remainingWidth = containerWidth;
    let remainingHeight = containerHeight;
    let i = 0;

    while (i < itemsWithArea.length) {
      // Determine how many items to place in current row
      let rowItems: typeof itemsWithArea = [];
      let rowArea = 0;
      let bestAspectRatio = Infinity;
      let bestRowItems: typeof itemsWithArea = [];

      // Try different row lengths to find best aspect ratio
      for (let j = i; j < itemsWithArea.length; j++) {
        const testItems = itemsWithArea.slice(i, j + 1);
        const testArea = testItems.reduce((sum, item) => sum + item.area, 0);
        
        if (testArea > remainingWidth * remainingHeight) break;
        
        // Calculate aspect ratios for this row configuration
        const rowHeight = testArea / remainingWidth;
        let maxAspectRatio = 0;
        
        testItems.forEach(item => {
          const itemWidth = item.area / rowHeight;
          const aspectRatio = Math.max(itemWidth / rowHeight, rowHeight / itemWidth);
          maxAspectRatio = Math.max(maxAspectRatio, aspectRatio);
        });

        if (maxAspectRatio < bestAspectRatio) {
          bestAspectRatio = maxAspectRatio;
          bestRowItems = [...testItems];
          rowArea = testArea;
        } else {
          break; // Adding more items makes aspect ratio worse
        }
      }

      rowItems = bestRowItems.length > 0 ? bestRowItems : [itemsWithArea[i]];
      rowArea = rowItems.reduce((sum, item) => sum + item.area, 0);

      // Calculate row height
      const rowHeight = Math.min(rowArea / remainingWidth, remainingHeight);
      
      // Place items in this row
      let itemX = currentX;
      rowItems.forEach(item => {
        const itemWidth = item.area / rowHeight;
        
        result.push({
          ...item,
          x: itemX,
          y: currentY,
          width: itemWidth,
          height: rowHeight
        });
        
        itemX += itemWidth;
      });

      // Update position for next row
      i += rowItems.length;
      currentY += rowHeight;
      remainingHeight -= rowHeight;
      
      // If we're running out of height, expand remaining items to fill
      if (i < itemsWithArea.length && remainingHeight < 5) {
        remainingHeight = containerHeight - currentY;
      }
    }

    return result;
  };

  const layoutData = calculateLayout(filteredData);

  const handleMouseEnter = (item: TreemapData & { x: number; y: number; width: number; height: number }, event: React.MouseEvent) => {
    setHoveredRect(item.id);
    setTooltip({
      x: event.clientX,
      y: event.clientY,
      data: item,
    });
  };

  const handleMouseLeave = () => {
    setHoveredRect(null);
    setTooltip(null);
  };

  const handleRectClick = (item: TreemapData) => {
    setSelectedRect(item);
  };

  const canShowLabels = (width: number, height: number) => {
    return width >= 8 && height >= 4;
  };

  const getTextSize = (width: number, height: number, textLength: number) => {
    const baseSize = Math.min(width / 12, height / 6);
    const lengthAdjusted = Math.max(width / (textLength * 0.8), 0.6);
    return Math.min(baseSize, lengthAdjusted, 1.8);
  };

  const getSecondaryTextSize = (width: number, height: number) => {
    const maxSize = Math.min(width / 15, height / 8);
    return Math.min(maxSize, 1.2);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + '…';
  };

  const getPercentage = (value: number, target: number) => {
    if (target === 0) return value === 0 ? 100 : 0;
    return Math.round((value / target) * 100);
  };

  const getStatusFromPercentage = (percentage: number, isInverted: boolean = false) => {
    if (isInverted) {
      if (percentage <= 25) return 'in-band';
      if (percentage <= 75) return 'warning';
      return 'critical';
    } else {
      if (percentage >= 75) return 'in-band';
      if (percentage >= 50) return 'warning';
      return 'critical';
    }
  };

  return (
    <>
      <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-40 bg-black/40' : ''}`}>
        {isFullscreen && (
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-teal-500 hover:bg-teal-400 text-slate-900"
              style={{ fontFamily: 'Noto Sans' }}
            >
              Back to Monitor
            </button>
          </div>
        )}

        <div className={`${isFullscreen ? 'absolute inset-8 top-20' : 'h-full'} flex flex-col`}>
          {/* Filter Pills */}
          <div className="flex justify-center gap-4 py-4 px-6">
            {(['all', 'strategic', 'operational'] as const).map((filterOption) => (
              <motion.button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200`}
                style={{
                  fontFamily: 'Noto Sans',
                  ...(filter === filterOption
                    ? {
                        background: '#00FFC3',
                        color: '#081226',
                        boxShadow: '0 0 12px rgba(0,255,195,0.6)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.08)',
                        color: '#E0E0E0',
                        border: '1px solid rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                      }
                  ),
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filterOption === 'all' ? 'All Indicators' : 
                 filterOption === 'strategic' ? 'Strategic Only' : 'Operational Only'}
              </motion.button>
            ))}
          </div>

          {/* Legend (Full-screen only) */}
          {isFullscreen && (
            <div className="flex justify-center gap-8 py-3 px-6">
              {[
                { color: 'rgba(0,255,195,0.8)', label: 'In-Band' },
                { color: 'rgba(255,193,7,0.8)', label: 'Warning' },
                { color: 'rgba(255,110,110,0.8)', label: 'Critical' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ background: item.color }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Noto Sans', color: '#E0E0E0' }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* SVG Treemap */}
          <div className="flex-1 p-6 relative">
            <motion.div
              layout
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
                {layoutData.map((item, index) => {
                  const percentage = getPercentage(item.value, item.target);
                  const isOperational = item.category === 'operational';
                  const actualStatus = isOperational ? getStatusFromPercentage(percentage, true) : item.status;
                  
                  const titleFontSize = getTextSize(item.width, item.height, item.name.length);
                  const valueFontSize = getSecondaryTextSize(item.width, item.height);
                  const maxTitleLength = Math.floor(item.width / 1.2);
                  const truncatedTitle = truncateText(item.name, maxTitleLength);
                  
                  return (
                    <motion.g
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ 
                        opacity: hoveredRect && hoveredRect !== item.id ? 0.7 : 1,
                        scale: hoveredRect === item.id ? 1.02 : 1,
                      }}
                      transition={{ 
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                      style={{ transformOrigin: `${item.x + item.width/2}% ${item.y + item.height/2}%` }}
                    >
                      <rect
                        x={item.x}
                        y={item.y}
                        width={item.width}
                        height={item.height}
                        fill={getBaseColor(item.category)}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="0.05"
                        style={{
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => handleMouseEnter(item, e)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleRectClick(item)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${item.name}: ${item.value}/${item.target} (${percentage}%) ${actualStatus}`}
                      />
                      
                      {/* Status Overlay */}
                      <rect
                        x={item.x}
                        y={item.y}
                        width={item.width}
                        height={item.height}
                        fill={getStatusOverlay(actualStatus)}
                        style={{ pointerEvents: 'none' }}
                      />

                      {canShowLabels(item.width, item.height) ? (
                        <g>
                          <defs>
                            <clipPath id={`textClip-${item.id}`}>
                              <rect
                                x={item.x + 0.3}
                                y={item.y + 0.3}
                                width={Math.max(0, item.width - 0.6)}
                                height={Math.max(0, item.height - 0.6)}
                              />
                            </clipPath>
                          </defs>
                          {/* Title Text - Fixed positioning */}
                          <text
                            x={item.x + item.width/2}
                            y={item.y + 2.0} // Fixed position from top
                            textAnchor="middle"
                            clipPath={`url(#textClip-${item.id})`}
                            className="font-bold"
                            style={{ 
                              fontFamily: 'Noto Sans, system-ui, sans-serif',
                              pointerEvents: 'none',
                              fill: '#FFFFFF',
                              overflow: 'hidden',
                            }}
                            fontSize={Math.max(titleFontSize, 0.7)}
                          >
                            {truncatedTitle}
                          </text>
                          {/* Value Text - Fixed positioning */}
                          <text
                            x={item.x + item.width/2}
                            y={item.y + item.height/2 + 0.2}
                            textAnchor="middle"
                            clipPath={`url(#textClip-${item.id})`}
                            className="font-medium"
                            style={{ 
                              fontFamily: 'Noto Sans, system-ui, sans-serif',
                              pointerEvents: 'none',
                              fill: '#E0E0E0',
                              overflow: 'hidden',
                            }}
                            fontSize={Math.max(valueFontSize, 0.5)}
                          >
                            {item.value} / {item.target}
                          </text>
                          {/* Percentage Text - Fixed positioning */}
                          <text
                            x={item.x + item.width/2}
                            y={item.y + item.height - 1.5} // Fixed position from bottom
                            textAnchor="middle"
                            clipPath={`url(#textClip-${item.id})`}
                            className="font-medium"
                            style={{ 
                              fontFamily: 'Noto Sans, system-ui, sans-serif',
                              pointerEvents: 'none',
                              fill: '#94A3B8',
                              overflow: 'hidden',
                            }}
                            fontSize={Math.max(valueFontSize * 0.8, 0.4)}
                          >
                            ({percentage}%)
                          </text>
                        </g>
                      ) : (
                        <text
                          x={item.x + item.width/2}
                          y={item.y + item.height/2}
                          textAnchor="middle"
                          fontSize={Math.min(item.width/3, item.height/3, 1.5)}
                          fill="#FFFFFF"
                          style={{ pointerEvents: 'none' }}
                        >
                          ℹ️
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </svg>
            </motion.div>

            {/* Fullscreen Toggle */}
            {!isFullscreen && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-3 right-3 w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
              >
                <span className="text-xl">⛶</span>
              </button>
            )}

            {/* Enhanced Tooltip */}
            {tooltip && (
              <div
                className="fixed z-50 px-5 py-4 rounded-lg text-sm pointer-events-none max-w-xs"
                style={{
                  left: tooltip.x + 12,
                  top: tooltip.y - 12,
                  background: 'rgba(20,30,50,0.95)',
                  backdropFilter: 'blur(20px)',
                  color: '#E0E0E0',
                  fontFamily: 'Noto Sans, system-ui, sans-serif',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <div className="font-bold mb-3 text-base" style={{ color: '#00FFC3' }}>
                  {tooltip.data.name}
                </div>
                <div className="mb-2 font-medium">Current: {tooltip.data.value} / {tooltip.data.target}</div>
                <div className="mb-2 font-medium">Progress: {getPercentage(tooltip.data.value, tooltip.data.target)}%</div>
                <div className="mb-3 text-sm text-slate-400 font-medium">{tooltip.data.lastTrend}</div>
                
                {tooltip.data.breakdown && (
                  <div className="mb-3">
                    <div className="text-sm font-semibold mb-2 text-slate-300">Breakdown:</div>
                    {tooltip.data.breakdown.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="text-sm text-slate-300 mb-1">• {item}</div>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-slate-400 italic font-medium">
                  {tooltip.data.actionHint}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drill-Down Modal */}
      <AnimatePresence>
        {selectedRect && (
          <DrillDownModal
            data={selectedRect}
            isOpen={!!selectedRect}
            onClose={() => setSelectedRect(null)}
            chartType={chartType}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TreemapView;
