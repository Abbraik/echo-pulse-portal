
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

  const scenarios = [
    { 
      id: 'baseline', 
      name: 'Current Baseline', 
      popDev: 0, 
      resource: 0, 
      social: 0,
      color: '#9CA3AF',
      branch: { x: 20, y: 40 }
    },
    { 
      id: 'policy-focus', 
      name: 'Policy-Focused Reform', 
      popDev: 12, 
      resource: -5, 
      social: 18,
      color: '#3B82F6',
      branch: { x: 40, y: 20 }
    },
    { 
      id: 'tech-innovation', 
      name: 'Tech Innovation Hub', 
      popDev: 25, 
      resource: 15, 
      social: 8,
      color: '#10B981',
      branch: { x: 60, y: 30 }
    },
    { 
      id: 'community-driven', 
      name: 'Community-Driven Model', 
      popDev: 18, 
      resource: 8, 
      social: 32,
      color: '#F59E0B',
      branch: { x: 80, y: 50 }
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
    <div className="h-full flex flex-col gap-6 p-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
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
        <div className="flex-1 grid grid-rows-[60%_40%] gap-4">
          {/* Fishbone Diagram */}
          <motion.div
            className="glass-panel p-6 rounded-xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h-full relative">
              {/* Main Spine */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" 
                          refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="rgba(20, 184, 166, 0.8)" />
                  </marker>
                </defs>
                {/* Horizontal spine */}
                <line x1="10%" y1="50%" x2="90%" y2="50%" 
                      stroke="rgba(20, 184, 166, 0.8)" strokeWidth="3" 
                      markerEnd="url(#arrowhead)" />
                
                {/* Scenario branches */}
                {scenarios.map((scenario, index) => (
                  <g key={scenario.id}>
                    <line 
                      x1="50%" y1="50%" 
                      x2={`${scenario.branch.x}%`} y2={`${scenario.branch.y}%`}
                      stroke={scenario.color} strokeWidth="2" 
                    />
                  </g>
                ))}
              </svg>

              {/* Scenario Nodes */}
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  className="absolute cursor-pointer"
                  style={{ 
                    left: `${scenario.branch.x}%`, 
                    top: `${scenario.branch.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-lg ${
                      selectedScenario === scenario.id 
                        ? 'border-white shadow-white/50' 
                        : 'border-white/50'
                    }`}
                    style={{ backgroundColor: scenario.color }}
                  >
                    <span className="text-white font-bold text-sm">
                      {Math.round((scenario.popDev + scenario.resource + scenario.social) / 3)}
                    </span>
                  </div>
                  {selectedScenario === scenario.id && (
                    <motion.div
                      className="absolute top-20 left-1/2 transform -translate-x-1/2 glass-panel p-3 rounded-lg min-w-48 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-sm font-medium text-white mb-2">{scenario.name}</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Pop. Dev:</span>
                          <span className={scenario.popDev > 0 ? 'text-green-400' : scenario.popDev < 0 ? 'text-red-400' : 'text-gray-400'}>
                            {scenario.popDev > 0 ? '+' : ''}{scenario.popDev}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resources:</span>
                          <span className={scenario.resource > 0 ? 'text-green-400' : scenario.resource < 0 ? 'text-red-400' : 'text-gray-400'}>
                            {scenario.resource > 0 ? '+' : ''}{scenario.resource}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Social Index:</span>
                          <span className={scenario.social > 0 ? 'text-green-400' : scenario.social < 0 ? 'text-red-400' : 'text-gray-400'}>
                            {scenario.social > 0 ? '+' : ''}{scenario.social}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* Spine Labels */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                Current State
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                Future Vision
              </div>
            </div>
          </motion.div>

          {/* Summary Chart */}
          <motion.div
            className="glass-panel p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h4 className="font-medium text-gray-300 mb-3">{t('impactComparison')}</h4>
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
                  height={60}
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
                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                  {fishboneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      ) : (
        /* Detailed Table View */
        <motion.div
          className="flex-1 glass-panel p-6 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-sm font-medium text-gray-300">{t('scenario')}</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">{t('populationDev')}</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">{t('resourceStock')}</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-300">{t('socialIndex')}</th>
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
                          className="w-4 h-4 rounded-full" 
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
