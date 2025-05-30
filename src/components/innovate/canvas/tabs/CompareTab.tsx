
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
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
}

export const CompareTab: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('fishbone');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Enhanced scenario data with baseline as anchor
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
      loopType: 'balancing'
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
      loopType: 'reinforcing'
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
      loopType: 'reinforcing'
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
      loopType: 'balancing'
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
      loopType: 'reinforcing'
    }
  ];

  const handleBranchSelect = (branchId: string) => {
    setSelectedScenario(selectedScenario === branchId ? null : branchId);
    
    if (tableRef.current) {
      const rowElement = tableRef.current.querySelector(`[data-scenario-id="${branchId}"]`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const renderTrendIcon = (value: number) => {
    if (value > 10) return <TrendingUp className="text-green-400" size={16} />;
    if (value < -10) return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-gray-400" size={16} />;
  };

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
              <FishboneDiagram
                baselineLabel="Current Baseline"
                branches={branches}
                width={928} // Approximate width based on container
                height={360} // 60% of typical container height
                onBranchSelect={handleBranchSelect}
                selectedBranchId={selectedScenario}
              />

              {/* Enhanced Spine Labels */}
              <div className="absolute left-6 top-8 text-sm text-gray-300 font-medium">
                Current State
              </div>
              <div className="absolute right-6 top-8 text-sm text-gray-300 font-medium">
                Future Vision
              </div>
            </div>
          </motion.div>

          {/* Enhanced Summary Chart - 40% height */}
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
                  <BarChart data={scenarios}>
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
                    <Bar dataKey="dei" radius={[4, 4, 0, 0]}>
                      {scenarios.map((entry, index) => (
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
        /* Detailed Table View */
        <motion.div
          ref={tableRef}
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
                    data-scenario-id={scenario.id}
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
                        onClick={() => handleBranchSelect(scenario.id)}
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
