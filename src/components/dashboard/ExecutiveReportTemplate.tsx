
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ChevronLeft, ChevronRight, Maximize2, Eye } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/hooks/use-theme';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ExecutiveReportTemplateProps {
  onClose?: () => void;
}

const ExecutiveReportTemplate: React.FC<ExecutiveReportTemplateProps> = ({ onClose }) => {
  const { t, isRTL } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock data
  const mockData = {
    deiScore: 78,
    psiuBalance: [
      { name: 'Producer', value: 80, color: '#14B8A6' },
      { name: 'Stabilizer', value: 70, color: '#10B981' },
      { name: 'Innovator', value: 60, color: '#8B5CF6' },
      { name: 'Unifier', value: 90, color: '#F97316' }
    ],
    entropyTrend: [
      { cycle: 1, value: 0.4 },
      { cycle: 2, value: 0.42 },
      { cycle: 3, value: 0.45 },
      { cycle: 4, value: 0.48 },
      { cycle: 5, value: 0.52 },
      { cycle: 6, value: 0.55 },
      { cycle: 7, value: 0.58 },
      { cycle: 8, value: 0.61 },
      { cycle: 9, value: 0.63 },
      { cycle: 10, value: 0.64 },
      { cycle: 11, value: 0.65 },
      { cycle: 12, value: 0.65 }
    ],
    kpis: [
      { name: 'Population Deviation (heads)', current: '15,000', target: '0', delta: '–15K', status: '🟠 Warning' },
      { name: 'Resource Stock Ratio', current: '0.92', target: '1.00', delta: '–0.08', status: '🟢 OK' },
      { name: 'Supply–Demand Gap (%)', current: '+3%', target: '0%', delta: '–3%', status: '🟢 OK' },
      { name: 'Employment Rate (%)', current: '68%', target: '75%', delta: '+7%', status: '🔴 Alert' }
    ],
    loops: [
      { name: 'Population & Development', coverage: 75, consistency: 88, objective: 'Increase childcare subsidy by 15%' },
      { name: 'Environmental Quality', coverage: 73, consistency: 73, objective: 'Allocate AED 10M to Green Tech Investment' },
      { name: 'Econ & Migration Growth', coverage: 50, consistency: 50, objective: 'Tighten visa issuance by –10%' }
    ],
    approvals: [
      { title: 'Healthcare Budget Increase', type: 'Strategy Bundle', owner: 'Dr. Al-Rashid', due: '2024-02-15', priority: 'High' },
      { title: 'Education Reform Initiative', type: 'Structural Redesign', owner: 'Prof. Al-Mansouri', due: '2024-02-20', priority: 'Medium' },
      { title: 'Digital Infrastructure Plan', type: 'External Directive', owner: 'Eng. Al-Zaabi', due: '2024-02-25', priority: 'High' }
    ],
    zoneLeads: [
      { zone: 'THINK', delivery: 85, entropy: 0.3, lastClosure: '2024-01-28' },
      { zone: 'ACT', delivery: 92, entropy: 0.4, lastClosure: '2024-01-30' },
      { zone: 'MONITOR', delivery: 78, entropy: 0.6, lastClosure: '2024-01-25' },
      { zone: 'LEARN', delivery: 88, entropy: 0.35, lastClosure: '2024-01-29' },
      { zone: 'INNOVATE', delivery: 82, entropy: 0.45, lastClosure: '2024-01-27' }
    ]
  };

  const slides = [
    {
      title: 'Cover Slide',
      component: () => (
        <div className="h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Background UAE map blur effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 blur-3xl"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 space-y-8"
          >
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Executive Briefing
            </h1>
            <h2 className="text-4xl font-semibold text-white">
              Population Dynamics System
            </h2>
            <div className="space-y-4 text-xl text-gray-300">
              <p>{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p>Director General</p>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      title: 'Strategic Snapshot',
      component: () => (
        <div className="p-8 space-y-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Strategic Snapshot
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DEI Health Gauge */}
            <GlassCard className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-4 text-teal-400">DEI System Health</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${mockData.deiScore * 3.51} 351`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#14B8A6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{mockData.deiScore}%</span>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400">In Target Band</Badge>
            </GlassCard>

            {/* PSIU Balance */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-400">PSIU Balance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockData.psiuBalance}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {mockData.psiuBalance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {mockData.psiuBalance.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-white">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Entropy Trend */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-400">Entropy Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockData.entropyTrend}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    dot={false}
                  />
                  <XAxis dataKey="cycle" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <Badge className="bg-orange-500/20 text-orange-400">↑ 0.25 (12 cycles)</Badge>
              </div>
            </GlassCard>
          </div>
        </div>
      )
    },
    {
      title: 'Key KPIs Table',
      component: () => (
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Key Performance Indicators
          </h2>
          
          <GlassCard className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-teal-400">KPI</TableHead>
                  <TableHead className="text-teal-400">Current</TableHead>
                  <TableHead className="text-teal-400">Target</TableHead>
                  <TableHead className="text-teal-400">Δ</TableHead>
                  <TableHead className="text-teal-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.kpis.map((kpi, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                    <TableCell className="font-medium text-white">{kpi.name}</TableCell>
                    <TableCell className="text-white">{kpi.current}</TableCell>
                    <TableCell className="text-white">{kpi.target}</TableCell>
                    <TableCell className="text-white">{kpi.delta}</TableCell>
                    <TableCell>{kpi.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        </div>
      )
    },
    {
      title: 'Loop Analysis Summary',
      component: () => (
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Loop Analysis Summary
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-400">Top Loops by Coverage Gap</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-teal-400">Loop Name</TableHead>
                    <TableHead className="text-teal-400">Coverage (%)</TableHead>
                    <TableHead className="text-teal-400">Consistency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.loops.map((loop, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                      <TableCell className="font-medium text-white">{loop.name}</TableCell>
                      <TableCell className="text-white">{loop.coverage}%</TableCell>
                      <TableCell className="text-white">{loop.consistency}/100</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-400">Coverage vs Consistency</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockData.loops}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="coverage" fill="#14B8A6" name="Coverage %" />
                  <Bar dataKey="consistency" fill="#3B82F6" name="Consistency" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Objectives</h3>
            <div className="space-y-3">
              {mockData.loops.map((loop, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg">
                  <div className="font-medium text-white">{loop.name}</div>
                  <div className="text-sm text-gray-300">{loop.objective}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )
    },
    {
      title: 'Approvals & Decisions',
      component: () => (
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Pending Approvals & Decisions
          </h2>
          
          <GlassCard className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-teal-400">Title</TableHead>
                  <TableHead className="text-teal-400">Type</TableHead>
                  <TableHead className="text-teal-400">Owner</TableHead>
                  <TableHead className="text-teal-400">Due Date</TableHead>
                  <TableHead className="text-teal-400">Priority</TableHead>
                  <TableHead className="text-teal-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.approvals.map((item, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white/5' : ''}>
                    <TableCell className="font-medium text-white">{item.title}</TableCell>
                    <TableCell className="text-white">{item.type}</TableCell>
                    <TableCell className="text-white">{item.owner}</TableCell>
                    <TableCell className="text-white">{item.due}</TableCell>
                    <TableCell>
                      <Badge className={
                        item.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                        item.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }>
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="border-orange-500 text-orange-400">
                          Revise
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        </div>
      )
    },
    {
      title: 'Cross-Zone Governance',
      component: () => (
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Cross-Zone Governance
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {mockData.zoneLeads.map((zone) => (
              <GlassCard key={zone.zone} className="p-4 text-center">
                <h3 className="font-semibold text-teal-400 mb-3">{zone.zone}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Delivery:</span>
                    <span className="text-white font-medium">{zone.delivery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Entropy:</span>
                    <span className="text-white font-medium">{zone.entropy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Last Closure:</span>
                    <span className="text-white font-medium">{zone.lastClosure}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                  Open Council
                </Button>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Facilitator Escalations</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium text-white">Role dropouts >3 in last sprint</div>
                  <div className="text-sm text-gray-300">THINK Zone • 2 hours ago</div>
                </div>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Reassign
                </Button>
              </div>
              <div className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium text-white">Budget allocation pending approval</div>
                  <div className="text-sm text-gray-300">ACT Zone • 4 hours ago</div>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Escalate
                </Button>
              </div>
              <div className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-medium text-white">System integration blocker</div>
                  <div className="text-sm text-gray-300">MONITOR Zone • 6 hours ago</div>
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Critical
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )
    },
    {
      title: 'DG Notes & Appendix',
      component: () => (
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Director General Notes
          </h2>
          
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Personal Annotations</h3>
            <textarea
              className="w-full h-64 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              placeholder="Add your strategic notes, observations, and directives here..."
            />
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Data Sources & Methodology</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Population data sourced from Federal Competitiveness and Statistics Centre</p>
              <p>• PSIU metrics calculated using weighted average of zone performance indicators</p>
              <p>• Entropy measurements based on system complexity analysis over 12-cycle rolling window</p>
              <p>• DEI composite scoring methodology available in Technical Appendix B</p>
              <p>• All data current as of {new Date().toLocaleDateString()}</p>
            </div>
          </GlassCard>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleExportPDF = () => {
    // Mock PDF export
    console.log('Exporting to PDF...');
    alert('PDF export functionality would be implemented here');
  };

  const handleExportPPTX = () => {
    // Mock PPTX export
    console.log('Exporting to PPTX...');
    alert('PPTX export functionality would be implemented here');
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-full'}`}>
      <GlassCard className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Executive Report Template
            </h1>
            <Badge className="bg-blue-500/20 text-blue-400">
              {currentSlide + 1} / {slides.length}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700">
              <Download size={16} className="mr-2" />
              PDF
            </Button>
            <Button size="sm" onClick={handleExportPPTX} className="bg-orange-600 hover:bg-orange-700">
              <FileText size={16} className="mr-2" />
              PPTX
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Eye size={16} /> : <Maximize2 size={16} />}
            </Button>
            {onClose && (
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {slides[currentSlide].component()}
          </motion.div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-white/20">
          <Button
            size="sm"
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </Button>

          <div className="text-center">
            <h3 className="font-medium text-white">{slides[currentSlide].title}</h3>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ExecutiveReportTemplate;
