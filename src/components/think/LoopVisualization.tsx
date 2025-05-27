
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp,
  Target,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface LoopVisualizationProps {
  onPromoteObjective?: (loopId: string, objective: string) => void;
}

interface Loop {
  id: string;
  name: string;
  type: 'reinforcing' | 'balancing';
  description: string;
  steps: string[];
  levers: string[];
  effect: number;
  trend: number[];
  keyMetrics: {
    coverage: number;
    consistency: number;
    impact: number;
  };
}

const LoopVisualization: React.FC<LoopVisualizationProps> = ({
  onPromoteObjective
}) => {
  const { t, isRTL } = useTranslation();
  const [expandedLoop, setExpandedLoop] = useState<string | null>(null);
  const [hoveredLoop, setHoveredLoop] = useState<string | null>(null);

  const loops: Loop[] = [
    {
      id: 'pop-dev',
      name: t('populationDevelopmentLoop'),
      type: 'reinforcing',
      description: t('populationDevelopmentDesc'),
      steps: ['Population', 'Resource Demand', 'Labor Demand', 'Fertility Confidence', 'Births'],
      levers: [t('childcareSubsidy'), t('migration')],
      effect: 12.5,
      trend: [45, 48, 51, 55, 57.5],
      keyMetrics: {
        coverage: 0.78,
        consistency: 0.85,
        impact: 4.2
      }
    },
    {
      id: 'nat-pop-growth',
      name: t('naturalPopulationGrowthLoop'),
      type: 'reinforcing',
      description: t('naturalPopulationGrowthDesc'),
      steps: ['Childbearing Cohort', 'Marriage Rate', 'Births', 'Cohort Size'],
      levers: [t('matchmakingBudget'), t('weddingGrant')],
      effect: 8.3,
      trend: [32, 34, 36, 38, 40.3],
      keyMetrics: {
        coverage: 0.65,
        consistency: 0.72,
        impact: 3.8
      }
    },
    {
      id: 'pop-resource',
      name: t('populationResourceMarketLoop'),
      type: 'reinforcing',
      description: t('populationResourceMarketDesc'),
      steps: ['Population', 'Extraction Volume', 'Revenues', 'Regeneration Programs', 'Resource Stock'],
      levers: [t('reinvestmentRatio'), t('extractionQuota')],
      effect: -5.2,
      trend: [68, 66, 64, 63, 62.8],
      keyMetrics: {
        coverage: 0.82,
        consistency: 0.68,
        impact: 3.5
      }
    },
    {
      id: 'econ-migration',
      name: t('economicMigrationGrowthLoop'),
      type: 'reinforcing',
      description: t('economicMigrationGrowthDesc'),
      steps: ['GDP Output', 'Labor Demand', 'Migration Inflow', 'Population'],
      levers: [t('visaIssuance'), t('skillMatch')],
      effect: 15.7,
      trend: [58, 62, 67, 71, 73.7],
      keyMetrics: {
        coverage: 0.91,
        consistency: 0.89,
        impact: 4.8
      }
    },
    {
      id: 'env-quality',
      name: t('environmentalQualityLoop'),
      type: 'balancing',
      description: t('environmentalQualityDesc'),
      steps: ['Population × Emissions', 'Pollution', 'Env Quality', 'Health & Fertility'],
      levers: [t('greenTechInvestment')],
      effect: -3.1,
      trend: [42, 41, 40, 39, 38.9],
      keyMetrics: {
        coverage: 0.55,
        consistency: 0.61,
        impact: 2.9
      }
    },
    {
      id: 'production',
      name: t('productionProcessLoop'),
      type: 'reinforcing',
      description: t('productionProcessDesc'),
      steps: ['Capacity & Labor', 'Production', 'Inventory', 'Revenue', 'Capital Investment'],
      levers: [t('industryGrowthFund'), t('depreciationRate')],
      effect: 9.8,
      trend: [51, 54, 57, 59, 60.8],
      keyMetrics: {
        coverage: 0.74,
        consistency: 0.79,
        impact: 4.1
      }
    },
    {
      id: 'econ-stability',
      name: t('economicStabilityLoop'),
      type: 'reinforcing',
      description: t('economicStabilityDesc'),
      steps: ['Supply vs Demand', 'Price Stability', 'Consumer Confidence', 'Output'],
      levers: [t('interestRate'), t('reserveRelease')],
      effect: 6.4,
      trend: [47, 49, 51, 52, 53.4],
      keyMetrics: {
        coverage: 0.69,
        consistency: 0.75,
        impact: 3.7
      }
    },
    {
      id: 'global-influence',
      name: t('globalInfluenceLoop'),
      type: 'reinforcing',
      description: t('globalInfluenceDesc'),
      steps: ['Exports', 'Trade Surplus', 'Foreign Investment', 'Capital Stock'],
      levers: [t('exportIncentive'), t('fdiPromotion')],
      effect: 11.2,
      trend: [39, 42, 45, 48, 50.2],
      keyMetrics: {
        coverage: 0.83,
        consistency: 0.87,
        impact: 4.5
      }
    },
    {
      id: 'social-outcomes',
      name: t('socialOutcomesLoop'),
      type: 'reinforcing',
      description: t('socialOutcomesDesc'),
      steps: ['Education & Healthcare Budgets', 'Social Outcome Index', 'Labor Productivity', 'Fertility'],
      levers: [t('educationBudget'), t('healthcareBudget')],
      effect: 7.9,
      trend: [63, 65, 67, 69, 70.9],
      keyMetrics: {
        coverage: 0.76,
        consistency: 0.81,
        impact: 4.0
      }
    },
    {
      id: 'migration-econ-opps',
      name: t('migrationEconomicOpportunitiesLoop'),
      type: 'reinforcing',
      description: t('migrationEconomicOpportunitiesDesc'),
      steps: ['Wages & Unemployment', 'Net Migration', 'Skill Mix', 'Productivity'],
      levers: [t('wageSupport'), t('upskillingGrant')],
      effect: 13.5,
      trend: [44, 47, 51, 54, 57.5],
      keyMetrics: {
        coverage: 0.88,
        consistency: 0.92,
        impact: 4.6
      }
    },
    {
      id: 'social-structure',
      name: t('socialStructureLoop'),
      type: 'reinforcing',
      description: t('socialStructureDesc'),
      steps: ['Social Cohesion', 'Nuptiality Rate', 'Fertility', 'Tax Revenues', 'Cohesion Funding'],
      levers: [t('engagementFund')],
      effect: 4.6,
      trend: [35, 36, 37, 38, 39.6],
      keyMetrics: {
        coverage: 0.58,
        consistency: 0.66,
        impact: 3.2
      }
    }
  ];

  const renderLoopDiagram = (loop: Loop) => {
    const isHovered = hoveredLoop === loop.id;
    const isExpanded = expandedLoop === loop.id;
    const size = window.innerWidth < 640 ? 80 : 120;
    const radius = size / 2 - 20;
    const center = size / 2;
    
    const getStepPosition = (index: number, total: number) => {
      const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      };
    };

    const strokeColor = loop.type === 'reinforcing' ? '#14b8a6' : '#f97316';
    const glowColor = loop.type === 'reinforcing' ? 'rgba(20, 184, 166, 0.3)' : 'rgba(249, 115, 22, 0.3)';

    return (
      <div className="relative flex flex-col items-center">
        <svg 
          width={size} 
          height={size} 
          className="mb-3"
          style={{ filter: isHovered ? `drop-shadow(0 0 10px ${glowColor})` : 'none' }}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={isHovered ? 3 : 2}
            strokeDasharray="5,5"
            opacity={0.6}
          />
          
          {/* Directional arrows showing flow */}
          {loop.steps.map((_, index) => {
            const current = getStepPosition(index, loop.steps.length);
            const next = getStepPosition((index + 1) % loop.steps.length, loop.steps.length);
            
            // Calculate arrow position (midpoint of arc)
            const midAngle = ((index + 0.5) / loop.steps.length) * 2 * Math.PI - Math.PI / 2;
            const arrowX = center + (radius - 10) * Math.cos(midAngle);
            const arrowY = center + (radius - 10) * Math.sin(midAngle);
            
            // Calculate arrow rotation
            const nextAngle = ((index + 1) / loop.steps.length) * 2 * Math.PI - Math.PI / 2;
            const rotation = (nextAngle * 180) / Math.PI;
            
            return (
              <g key={index}>
                {/* Arc segment */}
                <path
                  d={`M ${current.x} ${current.y} A ${radius} ${radius} 0 0 1 ${next.x} ${next.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isHovered ? 3 : 2}
                  opacity={0.8}
                />
                
                {/* Arrow marker */}
                <polygon
                  points="0,-3 6,0 0,3"
                  fill={strokeColor}
                  transform={`translate(${arrowX}, ${arrowY}) rotate(${rotation})`}
                  opacity={0.9}
                />
              </g>
            );
          })}
          
          {/* Center label */}
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold text-2xl"
            fill={strokeColor}
            style={{ 
              filter: isHovered ? `drop-shadow(0 0 5px ${glowColor})` : 'none',
              fontSize: window.innerWidth < 640 ? '20px' : '28px'
            }}
          >
            {loop.type === 'reinforcing' ? 'R' : 'B'}
          </text>
        </svg>
      </div>
    );
  };

  const generateTrendData = (trend: number[]) => {
    return trend.map((value, index) => ({
      period: `T${index + 1}`,
      value,
      baseline: trend[0]
    }));
  };

  const handlePromoteLoop = (loop: Loop) => {
    const objective = `Optimize ${loop.name} to achieve ${loop.effect > 0 ? 'increase' : 'decrease'} of ${Math.abs(loop.effect)}% in system effect`;
    if (onPromoteObjective) {
      onPromoteObjective(loop.id, objective);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
          {t('loopVisualization').toUpperCase()}
        </h3>
        <p className="text-sm text-gray-400">
          {t('loopVisualizationDesc')}
        </p>
      </motion.div>

      {/* Loop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loops.map((loop, index) => (
          <motion.div
            key={loop.id}
            className={`glass-panel p-4 cursor-pointer transition-all duration-300 ${
              hoveredLoop === loop.id ? 'border-2' : 'border'
            }`}
            style={{ 
              borderColor: hoveredLoop === loop.id 
                ? loop.type === 'reinforcing' ? '#14b8a6' : '#f97316'
                : 'rgba(255, 255, 255, 0.2)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredLoop(loop.id)}
            onMouseLeave={() => setHoveredLoop(null)}
            onClick={() => setExpandedLoop(expandedLoop === loop.id ? null : loop.id)}
            role="button"
            tabIndex={0}
            aria-label={`${loop.name} ${loop.type} loop`}
            aria-describedby={`${loop.id}-description`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setExpandedLoop(expandedLoop === loop.id ? null : loop.id);
              }
            }}
          >
            {/* Loop Diagram */}
            {renderLoopDiagram(loop)}
            
            {/* Loop Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white text-sm">{loop.name}</h4>
                <Badge 
                  variant="secondary" 
                  className={`${
                    loop.type === 'reinforcing' 
                      ? 'bg-teal-500/20 text-teal-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}
                >
                  {t(loop.type)}
                </Badge>
              </div>
              
              <p id={`${loop.id}-description`} className="text-xs text-gray-400 line-clamp-2">
                {loop.description}
              </p>
              
              {/* Key Metrics */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${loop.effect >= 0 ? 'text-teal-400' : 'text-orange-400'}`}>
                  {loop.effect >= 0 ? '+' : ''}{loop.effect.toFixed(1)}%
                </span>
                <span className="text-gray-400">
                  Impact: {loop.keyMetrics.impact.toFixed(1)}
                </span>
              </div>
              
              {/* Expand indicator */}
              <div className="flex justify-center pt-2">
                {expandedLoop === loop.id ? (
                  <ChevronUp size={16} className="text-teal-400" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Loop Details */}
      <AnimatePresence>
        {expandedLoop && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel-deep p-6 border border-white/30"
          >
            {(() => {
              const loop = loops.find(l => l.id === expandedLoop);
              if (!loop) return null;

              const trendData = generateTrendData(loop.trend);

              return (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{loop.name}</h3>
                    <Button
                      onClick={() => handlePromoteLoop(loop)}
                      className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                      size="sm"
                    >
                      <Target size={16} className="mr-2" />
                      {t('promoteObjective')}
                    </Button>
                  </div>

                  {/* Loop Flow */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Loop Flow</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {loop.steps.map((step, index) => (
                        <React.Fragment key={step}>
                          <span className="glass-panel px-3 py-1 text-sm text-gray-300 rounded-full">
                            {step}
                          </span>
                          {index < loop.steps.length - 1 && (
                            <span className="text-teal-400">→</span>
                          )}
                        </React.Fragment>
                      ))}
                      <span className="text-teal-400">→</span>
                      <span className="glass-panel px-3 py-1 text-sm text-teal-400 rounded-full border border-teal-500/50">
                        {loop.steps[0]}
                      </span>
                    </div>
                  </div>

                  {/* Control Levers */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Control Levers</h4>
                    <div className="flex flex-wrap gap-2">
                      {loop.levers.map((lever) => (
                        <Badge key={lever} variant="outline" className="border-teal-500/50 text-teal-400">
                          {lever}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Trend Chart */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Effect Trajectory</h4>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <XAxis 
                            dataKey="period" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="baseline" 
                            stroke="#6b7280" 
                            strokeDasharray="5,5"
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={loop.type === 'reinforcing' ? '#14b8a6' : '#f97316'}
                            strokeWidth={2}
                            dot={{ fill: loop.type === 'reinforcing' ? '#14b8a6' : '#f97316', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="glass-panel p-3 text-center">
                      <div className="text-lg font-bold text-teal-400">
                        {(loop.keyMetrics.coverage * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-400">Coverage</div>
                    </div>
                    <div className="glass-panel p-3 text-center">
                      <div className="text-lg font-bold text-blue-400">
                        {(loop.keyMetrics.consistency * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-400">Consistency</div>
                    </div>
                    <div className="glass-panel p-3 text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {loop.keyMetrics.impact.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Impact Score</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoopVisualization;
