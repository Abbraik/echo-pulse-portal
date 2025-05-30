
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, Legend } from 'recharts';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, X, Activity, Target, BarChart3 } from 'lucide-react';
import { FishboneDiagram } from '../components/FishboneDiagram';

interface ScenarioData {
  id: string;
  name: string;
  popDev: number;
  resource: number;
  social: number;
  color: string;
  dei: number;
  coverage: number;
  loopType: 'reinforcing' | 'balancing';
  timestamp: string;
  subIndicators: {
    healthcare: number;
    education: number;
    employment: number;
    infrastructure: number;
  };
  timeSeriesData: Array<{
    time: number;
    healthcare: number;
    education: number;
    employment: number;
    infrastructure: number;
  }>;
}

export const CompareTab: React.FC = () => {
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedScenarioDetails, setSelectedScenarioDetails] = useState<ScenarioData | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Enhanced scenario data with full metrics
  const scenarios: ScenarioData[] = [
    { 
      id: 'baseline', 
      name: 'Current Baseline', 
      popDev: 0, 
      resource: 0, 
      social: 0,
      color: '#9CA3AF',
      dei: 45,
      coverage: 68,
      loopType: 'balancing',
      timestamp: '2024-05-30T10:00:00Z',
      subIndicators: { healthcare: 0, education: 0, employment: 0, infrastructure: 0 },
      timeSeriesData: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        healthcare: 45 + Math.random() * 2 - 1,
        education: 45 + Math.random() * 2 - 1,
        employment: 45 + Math.random() * 2 - 1,
        infrastructure: 45 + Math.random() * 2 - 1
      }))
    },
    { 
      id: 'policy-focus', 
      name: 'Policy Reform', 
      popDev: 12, 
      resource: -5, 
      social: 18,
      color: '#3B82F6',
      dei: 58,
      coverage: 75,
      loopType: 'reinforcing',
      timestamp: '2024-05-30T10:30:00Z',
      subIndicators: { healthcare: 15, education: 22, employment: 8, infrastructure: 12 },
      timeSeriesData: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        healthcare: 45 + (i * 1.2) + Math.random() * 2 - 1,
        education: 45 + (i * 1.8) + Math.random() * 2 - 1,
        employment: 45 + (i * 0.7) + Math.random() * 2 - 1,
        infrastructure: 45 + (i * 1.0) + Math.random() * 2 - 1
      }))
    },
    { 
      id: 'tech-innovation', 
      name: 'Tech Hub', 
      popDev: 25, 
      resource: 15, 
      social: 8,
      color: '#10B981',
      dei: 62,
      coverage: 82,
      loopType: 'reinforcing',
      timestamp: '2024-05-30T11:00:00Z',
      subIndicators: { healthcare: 18, education: 28, employment: 35, infrastructure: 20 },
      timeSeriesData: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        healthcare: 45 + (i * 1.5) + Math.random() * 2 - 1,
        education: 45 + (i * 2.3) + Math.random() * 2 - 1,
        employment: 45 + (i * 2.9) + Math.random() * 2 - 1,
        infrastructure: 45 + (i * 1.7) + Math.random() * 2 - 1
      }))
    },
    { 
      id: 'community-driven', 
      name: 'Community Model', 
      popDev: 18, 
      resource: 8, 
      social: 32,
      color: '#F59E0B',
      dei: 71,
      coverage: 89,
      loopType: 'balancing',
      timestamp: '2024-05-30T11:30:00Z',
      subIndicators: { healthcare: 25, education: 30, employment: 20, infrastructure: 15 },
      timeSeriesData: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        healthcare: 45 + (i * 2.1) + Math.random() * 2 - 1,
        education: 45 + (i * 2.5) + Math.random() * 2 - 1,
        employment: 45 + (i * 1.7) + Math.random() * 2 - 1,
        infrastructure: 45 + (i * 1.3) + Math.random() * 2 - 1
      }))
    },
    { 
      id: 'hybrid-approach', 
      name: 'Hybrid Innovation', 
      popDev: 28, 
      resource: 12, 
      social: 25,
      color: '#8B5CF6',
      dei: 76,
      coverage: 94,
      loopType: 'reinforcing',
      timestamp: '2024-05-30T12:00:00Z',
      subIndicators: { healthcare: 32, education: 35, employment: 28, infrastructure: 25 },
      timeSeriesData: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        healthcare: 45 + (i * 2.7) + Math.random() * 2 - 1,
        education: 45 + (i * 2.9) + Math.random() * 2 - 1,
        employment: 45 + (i * 2.3) + Math.random() * 2 - 1,
        infrastructure: 45 + (i * 2.1) + Math.random() * 2 - 1
      }))
    }
  ];

  const handleBranchSelect = (branchId: string) => {
    setSelectedScenario(selectedScenario === branchId ? null : branchId);
  };

  const handleRowGraphToggle = (scenarioId: string) => {
    setExpandedRow(expandedRow === scenarioId ? null : scenarioId);
  };

  const renderTrendIcon = (value: number) => {
    if (value > 10) return <TrendingUp className="text-green-400" size={16} />;
    if (value < -10) return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-gray-400" size={16} />;
  };

  const renderDetailsButton = (scenario: ScenarioData) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-teal-400 hover:text-teal-300 hover:bg-teal-400/10 flex items-center gap-1"
          onClick={() => setSelectedScenarioDetails(scenario)}
        >
          Details <ChevronRight size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl glass-panel-deep border-teal-400/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl text-teal-300">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: scenario.color }}
            />
            {scenario.name}
            <span className={`px-2 py-1 rounded text-xs ${
              scenario.loopType === 'reinforcing' ? 'bg-green-400/20 text-green-400' : 'bg-orange-400/20 text-orange-400'
            }`}>
              {scenario.loopType}
            </span>
          </DialogTitle>
          <div className="text-sm text-gray-300">
            ΔDEI: +{scenario.dei - scenarios[0].dei} | {new Date(scenario.timestamp).toLocaleString()}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Metrics Panel */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-200">Sub-Indicator Changes</h3>
            <div className="space-y-2">
              {Object.entries(scenario.subIndicators).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-2 rounded bg-white/5">
                  <span className="text-gray-300 capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    {renderTrendIcon(value)}
                    <span className={`font-mono ${
                      value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {value > 0 ? '+' : ''}{value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loop Impact Chart */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-200">Loop Impact Analysis</h3>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(scenario.subIndicators).map(([key, value]) => ({
                  name: key,
                  impact: Math.abs(value),
                  color: scenario.color
                }))}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(20, 30, 50, 0.9)',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="impact" fill={scenario.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
          <Button variant="outline" className="border-teal-400/30 text-teal-400 hover:bg-teal-400/10">
            <Target size={16} className="mr-2" />
            Promote to Act
          </Button>
          <div className="text-xs text-gray-400">
            Coverage: {scenario.coverage}% | Type: {scenario.loopType}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Convert scenarios to branches for FishboneDiagram
  const baseline = scenarios[0];
  const branches = scenarios.slice(1).map(scenario => ({
    id: scenario.id,
    name: scenario.name,
    deltaValue: scenario.dei - baseline.dei,
    impactMetric: Math.abs(scenario.dei - baseline.dei),
    type: scenario.loopType,
    color: scenario.color
  }));

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed Height */}
      <div className="flex-shrink-0 p-6 pb-4">
        <h2 className="font-noto-bold text-2xl text-teal-300 mb-2">Scenario Comparison</h2>
        <p className="text-gray-300 text-sm">Interactive analysis of intervention scenarios and their systemic impacts</p>
      </div>

      {/* Main Container - Fixed Width 960px, Full Remaining Height */}
      <div className="flex-1 flex justify-center px-6 pb-6 min-h-0 overflow-hidden">
        <div className="w-full max-w-[960px] h-full glass-panel-deep rounded-2xl overflow-hidden flex flex-col">
          <div className="h-full flex flex-col p-6 min-h-0">
            
            {/* Fishbone Diagram - 60% height, Fixed */}
            <motion.div
              className="relative rounded-xl overflow-hidden mb-4 flex-shrink-0"
              style={{ height: '60%' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FishboneDiagram
                baselineLabel="Current Baseline"
                branches={branches}
                width={912} // 960 - 48px padding
                height={300} // Fixed height for 60%
                onBranchSelect={handleBranchSelect}
                selectedBranchId={selectedScenario}
              />
            </motion.div>

            {/* Scenario Forks Overview - 15% height, Fixed */}
            <motion.div
              className="mb-4 rounded-lg bg-white/5 p-4 flex-shrink-0 overflow-hidden"
              style={{ height: '15%', minHeight: '120px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="font-medium text-gray-200 mb-3">Scenario Forks Overview</h3>
              <div className="flex gap-4 overflow-x-auto h-full">
                {scenarios.slice(1).map((scenario) => (
                  <div
                    key={scenario.id}
                    className="flex-shrink-0 bg-white/5 rounded-lg p-3 min-w-[200px] hover:bg-white/10 transition-colors h-fit"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: scenario.color }}
                      />
                      <span className="font-medium text-gray-200 text-sm">{scenario.name}</span>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1 mb-2">
                      <div>ΔDEI: <span className="text-teal-400">+{scenario.dei - baseline.dei}</span></div>
                      <div>Top Change: <span className="text-green-400">+{Math.max(...Object.values(scenario.subIndicators))}%</span></div>
                    </div>
                    {renderDetailsButton(scenario)}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comparison Table & Graphs - 25% height, Scrollable */}
            <motion.div
              ref={tableRef}
              className="rounded-lg bg-white/5 overflow-hidden flex-1 min-h-0 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="p-4 pb-2 flex-shrink-0">
                <h3 className="font-medium text-gray-200">Detailed Comparison</h3>
              </div>
              <div className="flex-1 overflow-auto min-h-0">
                <table className="w-full">
                  <thead className="bg-slate-900/50 sticky top-0 z-10">
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-4 text-sm font-medium text-gray-300">Scenario</th>
                      <th className="text-center py-2 px-4 text-sm font-medium text-gray-300">Population Δ</th>
                      <th className="text-center py-2 px-4 text-sm font-medium text-gray-300">Resource Δ</th>
                      <th className="text-center py-2 px-4 text-sm font-medium text-gray-300">Social Δ</th>
                      <th className="text-center py-2 px-4 text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((scenario) => (
                      <React.Fragment key={scenario.id}>
                        <tr
                          data-scenario-id={scenario.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: scenario.color }}
                              />
                              <span className="text-gray-200 text-sm">{scenario.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {renderTrendIcon(scenario.popDev)}
                              <span className={`text-xs font-mono ${
                                scenario.popDev > 0 ? 'text-green-400' : scenario.popDev < 0 ? 'text-red-400' : 'text-gray-400'
                              }`}>
                                {scenario.popDev > 0 ? '+' : ''}{scenario.popDev}%
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {renderTrendIcon(scenario.resource)}
                              <span className={`text-xs font-mono ${
                                scenario.resource > 0 ? 'text-green-400' : scenario.resource < 0 ? 'text-red-400' : 'text-gray-400'
                              }`}>
                                {scenario.resource > 0 ? '+' : ''}{scenario.resource}%
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {renderTrendIcon(scenario.social)}
                              <span className={`text-xs font-mono ${
                                scenario.social > 0 ? 'text-green-400' : scenario.social < 0 ? 'text-red-400' : 'text-gray-400'
                              }`}>
                                {scenario.social > 0 ? '+' : ''}{scenario.social}%
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex gap-1 justify-center">
                              {renderDetailsButton(scenario)}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 flex items-center gap-1"
                                onClick={() => handleRowGraphToggle(scenario.id)}
                                aria-expanded={expandedRow === scenario.id}
                              >
                                <Activity size={14} />
                                Graph
                              </Button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Inline Chart */}
                        <AnimatePresence>
                          {expandedRow === scenario.id && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td colSpan={5} className="p-0">
                                <div className="bg-slate-900/30 p-4 border-t border-white/10">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-medium text-gray-200">Time Series Analysis - {scenario.name}</h4>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setExpandedRow(null)}
                                      className="text-gray-400 hover:text-gray-200"
                                    >
                                      <X size={16} />
                                    </Button>
                                  </div>
                                  <div style={{ height: '200px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={scenario.timeSeriesData}>
                                        <XAxis 
                                          dataKey="time" 
                                          axisLine={false}
                                          tickLine={false}
                                          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.7)' }}
                                        />
                                        <YAxis 
                                          axisLine={false}
                                          tickLine={false}
                                          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.7)' }}
                                        />
                                        <Tooltip 
                                          contentStyle={{
                                            backgroundColor: 'rgba(20, 30, 50, 0.9)',
                                            border: '1px solid rgba(20, 184, 166, 0.3)',
                                            borderRadius: '8px'
                                          }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="healthcare" stroke="#3B82F6" strokeWidth={2} />
                                        <Line type="monotone" dataKey="education" stroke="#10B981" strokeWidth={2} />
                                        <Line type="monotone" dataKey="employment" stroke="#F59E0B" strokeWidth={2} />
                                        <Line type="monotone" dataKey="infrastructure" stroke="#8B5CF6" strokeWidth={2} />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
