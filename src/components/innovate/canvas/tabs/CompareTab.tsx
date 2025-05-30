
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

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

interface TooltipData {
  scenario: ScenarioData;
  visible: boolean;
  x: number;
  y: number;
}

export const CompareTab: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('fishbone');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [spineAnimated, setSpineAnimated] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
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

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (diagramRef.current) {
        const rect = diagramRef.current.getBoundingClientRect();
        setContainerDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [viewMode]);

  // Trigger spine animation
  useEffect(() => {
    if (containerDimensions.width > 0 && viewMode === 'fishbone') {
      const timer = setTimeout(() => setSpineAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [containerDimensions.width, viewMode]);

  // Calculate branch positions with proper spine anchor
  const calculateBranchPositions = () => {
    const { width, height } = containerDimensions;
    if (width === 0 || height === 0) return [];

    // Spine configuration: 30% down from top, 150px height area
    const spineY = height * 0.3;
    const spineStartX = width * 0.08; // 8% from left edge
    const spineEndX = width * 0.92;   // 8% from right edge
    const spineLength = spineEndX - spineStartX;
    
    const baseline = scenarios[0]; // Current Baseline
    const redesignScenarios = scenarios.slice(1); // All others
    const isSmallScreen = width < 600;
    const maxBranchLength = isSmallScreen ? 80 : 120;

    // Position baseline at spine start
    const baselinePosition = {
      ...baseline,
      spineX: spineStartX,
      spineY: spineY,
      branchX: spineStartX,
      branchY: spineY,
      branchLength: 0,
      angle: 0,
      isBaseline: true
    };

    // Calculate redesign scenario positions along spine
    const redesignPositions = redesignScenarios.map((scenario, index) => {
      // Equally space along spine
      const segmentWidth = spineLength / (redesignScenarios.length + 1);
      const spineX = spineStartX + segmentWidth * (index + 1);

      // Calculate branch length based on DEI improvement
      const deiImprovement = Math.abs(scenario.dei - baseline.dei);
      const branchLength = Math.min(maxBranchLength, (deiImprovement / 50) * maxBranchLength);

      // Alternate branches above and below spine
      const isUp = index % 2 === 0;
      const angle = isSmallScreen ? (isUp ? -60 : 60) : (isUp ? -30 : 30);
      
      const branchX = spineX + Math.cos((angle * Math.PI) / 180) * branchLength;
      const branchY = spineY + Math.sin((angle * Math.PI) / 180) * branchLength;

      return {
        ...scenario,
        spineX,
        spineY,
        branchX,
        branchY,
        branchLength,
        angle,
        isBaseline: false
      };
    });

    return [baselinePosition, ...redesignPositions];
  };

  const positionedScenarios = calculateBranchPositions();

  const handleBranchClick = (scenario: ScenarioData) => {
    setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id);
    
    if (tableRef.current) {
      const rowElement = tableRef.current.querySelector(`[data-scenario-id="${scenario.id}"]`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBranchHover = (scenario: ScenarioData, event: React.MouseEvent, isEntering: boolean) => {
    if (isEntering) {
      setHoveredNode(scenario.id);
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        scenario,
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    } else {
      setHoveredNode(null);
      setTooltip(null);
    }
  };

  const renderTrendIcon = (value: number) => {
    if (value > 10) return <TrendingUp className="text-green-400" size={16} />;
    if (value < -10) return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-gray-400" size={16} />;
  };

  const renderFishboneDiagram = () => {
    const { width, height } = containerDimensions;
    if (width === 0 || height === 0 || positionedScenarios.length === 0) return null;

    const spineY = height * 0.3;
    const spineStartX = width * 0.08;
    const spineEndX = width * 0.92;

    return (
      <svg className="absolute inset-0 w-full h-full" role="img" aria-label="Fishbone diagram comparing scenarios to current baseline">
        <defs>
          <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(20, 184, 166, 0.6)" />
            <stop offset="50%" stopColor="rgba(20, 184, 166, 1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Enhanced Main Spine */}
        <motion.line 
          x1={spineStartX} y1={spineY} 
          x2={spineEndX} y2={spineY}
          stroke="url(#spineGradient)" 
          strokeWidth="6" 
          strokeLinecap="round"
          filter={hoveredNode === 'baseline' ? "url(#pulseGlow)" : "url(#neonGlow)"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: spineAnimated ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode('baseline')}
          onMouseLeave={() => setHoveredNode(null)}
        />
        
        {/* Scenario Branches */}
        {positionedScenarios.map((scenario, index) => {
          if (scenario.isBaseline || scenario.branchLength === 0) return null;
          
          // Create smooth Bézier curve for branch
          const controlX = scenario.spineX + (scenario.branchX - scenario.spineX) * 0.6;
          const controlY = scenario.spineY + (scenario.branchY - scenario.spineY) * 0.8;
          const pathData = `M ${scenario.spineX} ${scenario.spineY} Q ${controlX} ${controlY} ${scenario.branchX} ${scenario.branchY}`;
          
          const branchColor = scenario.loopType === 'reinforcing' ? '#14b8a6' : '#f97316';
          const isSelected = selectedScenario === scenario.id;
          const isHovered = hoveredNode === scenario.id;
          
          return (
            <motion.path
              key={scenario.id}
              d={pathData}
              stroke={branchColor}
              strokeWidth={isSelected ? "8" : isHovered ? "6" : "4"}
              fill="none"
              filter="url(#neonGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: spineAnimated ? 1 : 0 }}
              transition={{ 
                delay: 0.5 + (index - 1) * 0.1, 
                duration: 0.3, 
                ease: "easeOut" 
              }}
              style={{ 
                transition: 'stroke-width 0.3s ease',
                opacity: isSelected || isHovered ? 1 : 0.8
              }}
            />
          );
        })}
      </svg>
    );
  };

  const renderBranchHeads = () => {
    return positionedScenarios.map((scenario, index) => {
      const isBaseline = scenario.isBaseline;
      const isSelected = selectedScenario === scenario.id;
      const isHovered = hoveredNode === scenario.id;
      
      return (
        <motion.div
          key={scenario.id}
          className="absolute cursor-pointer"
          style={{ 
            left: scenario.branchX, 
            top: scenario.branchY,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: isBaseline ? 0.1 : 0.8 + (index - 1) * 0.1, 
            type: "spring", 
            stiffness: 200 
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => handleBranchClick(scenario)}
          onMouseEnter={(e) => handleBranchHover(scenario, e, true)}
          onMouseLeave={(e) => handleBranchHover(scenario, e, false)}
          role="button"
          aria-label={`Scenario ${scenario.name}: DEI ${isBaseline ? scenario.dei : `+${scenario.dei - scenarios[0].dei}`}%`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBranchClick(scenario);
            }
          }}
        >
          <div 
            className={`${
              isBaseline 
                ? 'w-20 h-20 rounded-full' 
                : 'w-25 h-12 rounded-lg'
            } border-2 flex flex-col items-center justify-center glass-panel-deep transition-all duration-300 ${
              isSelected || isHovered
                ? 'border-white shadow-2xl shadow-white/30 backdrop-blur-[32px]' 
                : 'border-white/40 backdrop-blur-[20px]'
            }`}
            style={{ 
              backgroundColor: `${scenario.color}40`,
              borderColor: isHovered ? scenario.color : undefined,
              minWidth: isBaseline ? '80px' : '100px',
              minHeight: isBaseline ? '80px' : '50px'
            }}
          >
            <span className="text-white font-bold text-xs text-center leading-tight px-1">
              {isBaseline ? 'Current' : scenario.name.split(' ')[0]}
            </span>
            <span className="text-xs text-white/80">
              {isBaseline ? '(+0)' : `+${scenario.dei - scenarios[0].dei}`}
            </span>
          </div>
        </motion.div>
      );
    });
  };

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
          {/* Enhanced Fishbone Diagram - 60% height */}
          <motion.div
            ref={diagramRef}
            className="glass-panel rounded-xl relative overflow-hidden"
            style={{ height: '60%' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="h-full relative p-6">
              {renderFishboneDiagram()}
              {renderBranchHeads()}

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
        /* ... keep existing code (Detailed Table View) */
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
                        onClick={() => handleBranchClick(scenario)}
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

      {/* Enhanced Interactive Tooltip */}
      <AnimatePresence>
        {tooltip && tooltip.visible && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%) translateY(-100%)'
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            role="tooltip"
          >
            <div className="glass-panel-deep p-4 rounded-xl border border-teal-400/30 min-w-64">
              <div className="text-sm font-bold text-white mb-3">{tooltip.scenario.name}</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">DEI Change:</span>
                    <span className="text-teal-400">
                      {tooltip.scenario.id === 'baseline' ? '0%' : `+${tooltip.scenario.dei - scenarios[0].dei}%`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Coverage:</span>
                    <span className="text-teal-400">{tooltip.scenario.coverage}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Loop Type:</span>
                    <span className={tooltip.scenario.loopType === 'reinforcing' ? 'text-green-400' : 'text-orange-400'}>
                      {tooltip.scenario.loopType}
                    </span>
                  </div>
                  <button className="text-teal-400 hover:text-teal-300 text-xs pointer-events-auto">
                    View Details ▶
                  </button>
                </div>
              </div>
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-teal-400/30"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
