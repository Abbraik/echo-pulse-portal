
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

export const CompareTab: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('fishbone');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const scenarios = [
    { 
      id: 'baseline', 
      name: 'Current Baseline', 
      popDev: 0, 
      resource: 0, 
      social: 0,
      color: '#9CA3AF',
      branch: { x: 15, y: 50, angle: 0 },
      dei: 45,
      coverage: 68
    },
    { 
      id: 'policy-focus', 
      name: 'Policy-Focused Reform', 
      popDev: 12, 
      resource: -5, 
      social: 18,
      color: '#3B82F6',
      branch: { x: 35, y: 25, angle: -30 },
      dei: 58,
      coverage: 75
    },
    { 
      id: 'tech-innovation', 
      name: 'Tech Innovation Hub', 
      popDev: 25, 
      resource: 15, 
      social: 8,
      color: '#10B981',
      branch: { x: 55, y: 35, angle: -15 },
      dei: 62,
      coverage: 82
    },
    { 
      id: 'community-driven', 
      name: 'Community-Driven Model', 
      popDev: 18, 
      resource: 8, 
      social: 32,
      color: '#F59E0B',
      branch: { x: 75, y: 65, angle: 20 },
      dei: 71,
      coverage: 89
    },
    { 
      id: 'hybrid-approach', 
      name: 'Hybrid Innovation', 
      popDev: 28, 
      resource: 12, 
      social: 25,
      color: '#8B5CF6',
      branch: { x: 85, y: 40, angle: -10 },
      dei: 76,
      coverage: 94
    }
  ];

  const renderTrendIcon = (value: number) => {
    if (value > 10) return <TrendingUp className="text-green-400" size={16} />;
    if (value < -10) return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-gray-400" size={16} />;
  };

  const fishboneData = scenarios.map(scenario => ({
    ...scenario,
    value: Math.round((scenario.popDev + scenario.resource + scenario.social) / 3)
  }));

  return (
    <div className="h-full flex flex-col">
      {/* Controls Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4">
        <h2 className="font-noto-bold text-xl text-teal-300">{t('scenarioComparison')}</h2>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
            <ToggleGroupItem value="fishbone" className="px-4">
              {t('fishboneDiagram')}
            </ToggleGroupItem>
            <ToggleGroupItem value="table" className="px-4">
              {t('detailedTable')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {viewMode === 'fishbone' ? (
        <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
          {/* Fishbone Diagram - 60% height */}
          <motion.div
            className="glass-panel rounded-xl relative overflow-hidden"
            style={{ height: '60%' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h-full relative p-6">
              {/* Enhanced SVG Fishbone */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(20, 184, 166, 0.3)" />
                    <stop offset="50%" stopColor="rgba(20, 184, 166, 0.8)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <marker id="arrowhead-spine" markerWidth="12" markerHeight="8" 
                          refX="12" refY="4" orient="auto">
                    <polygon points="0 0, 12 4, 0 8" fill="url(#spineGradient)" />
                  </marker>
                </defs>
                
                {/* Main Spine with Gradient */}
                <motion.line 
                  x1="8%" y1="50%" x2="92%" y2="50%" 
                  stroke="url(#spineGradient)" 
                  strokeWidth="4" 
                  markerEnd="url(#arrowhead-spine)"
                  filter="url(#glow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                
                {/* Scenario Branches with Curves */}
                {scenarios.map((scenario, index) => {
                  const spineX = 8 + (84 * (index + 1) / (scenarios.length + 1));
                  const branchEndX = scenario.branch.x;
                  const branchEndY = scenario.branch.y;
                  
                  // Create curved path
                  const controlX = spineX + (branchEndX - spineX) * 0.6;
                  const controlY = 50 + (branchEndY - 50) * 0.3;
                  const pathData = `M ${spineX} 50 Q ${controlX} ${controlY} ${branchEndX} ${branchEndY}`;
                  
                  return (
                    <motion.path
                      key={scenario.id}
                      d={pathData}
                      stroke={scenario.color}
                      strokeWidth="3"
                      fill="none"
                      filter="url(#glow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    />
                  );
                })}
              </svg>

              {/* Scenario Nodes with Glass Morphism */}
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  className="absolute cursor-pointer"
                  style={{ 
                    left: `${scenario.branch.x}%`, 
                    top: `${scenario.branch.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                  onMouseEnter={() => setHoveredNode(scenario.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div 
                    className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center glass-panel-deep transition-all duration-300 ${
                      selectedScenario === scenario.id || hoveredNode === scenario.id
                        ? 'border-white shadow-2xl shadow-white/30 scale-110' 
                        : 'border-white/30'
                    }`}
                    style={{ 
                      backgroundColor: `${scenario.color}40`,
                      borderColor: hoveredNode === scenario.id ? scenario.color : undefined
                    }}
                  >
                    <span className="text-white font-bold text-lg">
                      {Math.round((scenario.popDev + scenario.resource + scenario.social) / 3)}
                    </span>
                    <span className="text-xs text-white/80">DEI: {scenario.dei}</span>
                  </div>
                  
                  {/* Enhanced Tooltip */}
                  {(selectedScenario === scenario.id || hoveredNode === scenario.id) && (
                    <motion.div
                      className="absolute top-24 left-1/2 transform -translate-x-1/2 glass-panel-deep p-4 rounded-xl min-w-64 z-10 border border-teal-400/30"
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-sm font-bold text-white mb-3">{scenario.name}</div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Pop. Dev:</span>
                            <span className={scenario.popDev > 0 ? 'text-green-400' : scenario.popDev < 0 ? 'text-red-400' : 'text-gray-400'}>
                              {scenario.popDev > 0 ? '+' : ''}{scenario.popDev}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Resources:</span>
                            <span className={scenario.resource > 0 ? 'text-green-400' : scenario.resource < 0 ? 'text-red-400' : 'text-gray-400'}>
                              {scenario.resource > 0 ? '+' : ''}{scenario.resource}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Social:</span>
                            <span className={scenario.social > 0 ? 'text-green-400' : scenario.social < 0 ? 'text-red-400' : 'text-gray-400'}>
                              {scenario.social > 0 ? '+' : ''}{scenario.social}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Coverage:</span>
                            <span className="text-teal-400">{scenario.coverage}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Spine Labels */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-300 font-medium">
                Current State
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-300 font-medium">
                Future Vision
              </div>
            </div>
          </motion.div>

          {/* Summary Chart - 40% height */}
          <motion.div
            className="glass-panel rounded-xl mt-4 overflow-hidden"
            style={{ height: '40%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="h-full p-4">
              <h4 className="font-medium text-gray-300 mb-3">{t('impactComparison')}</h4>
              <div style={{ height: 'calc(100% - 2rem)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fishboneData}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)' }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
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
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {fishboneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Detailed Table View - Full Height */
        <motion.div
          className="flex-1 glass-panel mx-6 mb-6 rounded-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-full overflow-auto p-6">
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-sm">
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-sm font-medium text-gray-300">{t('scenario')}</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">{t('populationDev')}</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">{t('resourceStock')}</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">{t('socialIndex')}</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">DEI</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, index) => (
                  <motion.tr
                    key={scenario.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/30" 
                          style={{ backgroundColor: scenario.color }}
                        />
                        <span className="font-medium text-gray-200">{scenario.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {renderTrendIcon(scenario.popDev)}
                        <span className={`font-mono ${
                          scenario.popDev > 0 ? 'text-green-400' : scenario.popDev < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {scenario.popDev > 0 ? '+' : ''}{scenario.popDev}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {renderTrendIcon(scenario.resource)}
                        <span className={`font-mono ${
                          scenario.resource > 0 ? 'text-green-400' : scenario.resource < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {scenario.resource > 0 ? '+' : ''}{scenario.resource}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {renderTrendIcon(scenario.social)}
                        <span className={`font-mono ${
                          scenario.social > 0 ? 'text-green-400' : scenario.social < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {scenario.social > 0 ? '+' : ''}{scenario.social}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-mono text-teal-400">{scenario.dei}</span>
                    </td>
                    <td className="py-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-teal-400 hover:text-teal-300"
                        onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                      >
                        <BarChart3 size={16} className="mr-1" />
                        {t('details')}
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};
