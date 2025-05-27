
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  ArrowRight,
  Filter,
  Clock,
  TrendingUp,
  Target,
  Info
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import LoopVisualization from './LoopVisualization';

interface LoopData {
  id: string;
  name: string;
  type: 'reinforcing' | 'balancing';
  description: string;
  nodes: string[];
  levers: string[];
  netEffect: number;
  coverageRatio: number;
  consistencyScore: number;
  actionableObjectives: string[];
  baselineEffect: number;
  postTargetEffect: number;
}

interface LoopAnalysisTabProps {
  hasTargets?: boolean;
  onPromoteToAct?: (objectives: string[]) => void;
  onAdjustLever?: (lever: string) => void;
}

const LoopAnalysisTab: React.FC<LoopAnalysisTabProps> = ({
  hasTargets = false,
  onPromoteToAct,
  onAdjustLever
}) => {
  const { t, isRTL } = useTranslation();
  const [filterType, setFilterType] = useState<'all' | 'reinforcing' | 'balancing'>('all');
  const [timeHorizon, setTimeHorizon] = useState<number[]>([5]);
  const [expandedLoops, setExpandedLoops] = useState<string[]>([]);
  const [hoveredLoop, setHoveredLoop] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Enhanced loop data with node sequences for visualization
  const loopsData: LoopData[] = [
    {
      id: 'pop-dev',
      name: t('populationDevelopmentLoop'),
      type: 'reinforcing',
      description: t('populationDevelopmentDesc'),
      nodes: ['Population', 'Resource Demand', 'Labor Demand', 'Fertility Confidence', 'Births'],
      levers: [t('childcareSubsidy'), t('migration')],
      netEffect: 12.5,
      coverageRatio: 0.78,
      consistencyScore: 0.85,
      actionableObjectives: ['Increase childcare capacity by 15%', 'Optimize migration quotas'],
      baselineEffect: 45,
      postTargetEffect: 57.5
    },
    {
      id: 'nat-pop-growth',
      name: t('naturalPopulationGrowthLoop'),
      type: 'reinforcing',
      description: t('naturalPopulationGrowthDesc'),
      nodes: ['Cohort Size', 'Marriage Rate', 'Births'],
      levers: [t('matchmakingBudget'), t('weddingGrant')],
      netEffect: 8.3,
      coverageRatio: 0.65,
      consistencyScore: 0.72,
      actionableObjectives: ['Expand marriage support programs'],
      baselineEffect: 32,
      postTargetEffect: 40.3
    },
    {
      id: 'pop-resource',
      name: t('populationResourceMarketLoop'),
      type: 'reinforcing',
      description: t('populationResourceMarketDesc'),
      nodes: ['Population', 'Extraction', 'Revenues', 'Regeneration', 'Resource Stock'],
      levers: [t('reinvestmentRatio'), t('extractionQuota')],
      netEffect: -5.2,
      coverageRatio: 0.82,
      consistencyScore: 0.68,
      actionableObjectives: ['Adjust extraction limits', 'Increase regeneration funding'],
      baselineEffect: 68,
      postTargetEffect: 62.8
    },
    {
      id: 'econ-migration',
      name: t('economicMigrationGrowthLoop'),
      type: 'reinforcing',
      description: t('economicMigrationGrowthDesc'),
      nodes: ['GDP', 'Labor Demand', 'Migration Inflow', 'Population'],
      levers: [t('visaIssuance'), t('skillMatch')],
      netEffect: 15.7,
      coverageRatio: 0.91,
      consistencyScore: 0.89,
      actionableObjectives: ['Streamline visa processing', 'Enhance skill matching'],
      baselineEffect: 58,
      postTargetEffect: 73.7
    },
    {
      id: 'env-quality',
      name: t('environmentalQualityLoop'),
      type: 'balancing',
      description: t('environmentalQualityDesc'),
      nodes: ['Population × Emissions', 'Pollution', 'Env Quality', 'Health & Fertility'],
      levers: [t('greenTechInvestment')],
      netEffect: -3.1,
      coverageRatio: 0.55,
      consistencyScore: 0.61,
      actionableObjectives: ['Increase green tech budget'],
      baselineEffect: 42,
      postTargetEffect: 38.9
    },
    {
      id: 'production',
      name: t('productionProcessLoop'),
      type: 'reinforcing',
      description: t('productionProcessDesc'),
      nodes: ['Capacity & Labor', 'Production', 'Inventory', 'Revenue', 'Capital Investment'],
      levers: [t('industryGrowthFund'), t('depreciationRate')],
      netEffect: 9.8,
      coverageRatio: 0.74,
      consistencyScore: 0.79,
      actionableObjectives: ['Optimize capital allocation'],
      baselineEffect: 51,
      postTargetEffect: 60.8
    },
    {
      id: 'econ-stability',
      name: t('economicStabilityLoop'),
      type: 'reinforcing',
      description: t('economicStabilityDesc'),
      nodes: ['Supply vs Demand', 'Price Stability', 'Consumer Confidence', 'Output'],
      levers: [t('interestRate'), t('reserveRelease')],
      netEffect: 6.4,
      coverageRatio: 0.69,
      consistencyScore: 0.75,
      actionableObjectives: ['Fine-tune monetary policy'],
      baselineEffect: 47,
      postTargetEffect: 53.4
    },
    {
      id: 'global-influence',
      name: t('globalInfluenceLoop'),
      type: 'reinforcing',
      description: t('globalInfluenceDesc'),
      nodes: ['Exports', 'Trade Surplus', 'Foreign Investment', 'Capital Stock'],
      levers: [t('exportIncentive'), t('fdiPromotion')],
      netEffect: 11.2,
      coverageRatio: 0.83,
      consistencyScore: 0.87,
      actionableObjectives: ['Expand export support programs'],
      baselineEffect: 39,
      postTargetEffect: 50.2
    },
    {
      id: 'social-outcomes',
      name: t('socialOutcomesLoop'),
      type: 'reinforcing',
      description: t('socialOutcomesDesc'),
      nodes: ['Education Budget', 'Healthcare Budget', 'Social Outcome Index', 'Labor Productivity', 'Fertility'],
      levers: [t('educationBudget'), t('healthcareBudget')],
      netEffect: 7.9,
      coverageRatio: 0.76,
      consistencyScore: 0.81,
      actionableObjectives: ['Increase social spending efficiency'],
      baselineEffect: 63,
      postTargetEffect: 70.9
    },
    {
      id: 'migration-econ-opps',
      name: t('migrationEconomicOpportunitiesLoop'),
      type: 'reinforcing',
      description: t('migrationEconomicOpportunitiesDesc'),
      nodes: ['Wages & Unemployment', 'Net Migration', 'Skill Mix', 'Productivity'],
      levers: [t('wageSupport'), t('upskillingGrant')],
      netEffect: 13.5,
      coverageRatio: 0.88,
      consistencyScore: 0.92,
      actionableObjectives: ['Enhance wage competitiveness'],
      baselineEffect: 44,
      postTargetEffect: 57.5
    },
    {
      id: 'social-structure',
      name: t('socialStructureLoop'),
      type: 'reinforcing',
      description: t('socialStructureDesc'),
      nodes: ['Social Cohesion', 'Nuptiality Rate', 'Fertility', 'Tax Revenue', 'Cohesion Funding'],
      levers: [t('engagementFund')],
      netEffect: 4.6,
      coverageRatio: 0.58,
      consistencyScore: 0.66,
      actionableObjectives: ['Strengthen community programs'],
      baselineEffect: 35,
      postTargetEffect: 39.6
    }
  ];

  const filteredLoops = loopsData.filter(loop => {
    if (filterType === 'all') return true;
    return loop.type === filterType;
  });

  const toggleLoopExpansion = (loopId: string) => {
    setExpandedLoops(prev => 
      prev.includes(loopId) 
        ? prev.filter(id => id !== loopId)
        : [...prev, loopId]
    );
  };

  const handleRecomputeAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: t('analysisComplete'),
      description: t('loopMetricsUpdated'),
      duration: 3000,
    });
    
    setIsAnalyzing(false);
  };

  const handlePromoteObjectives = (objectives: string[]) => {
    if (onPromoteToAct) {
      onPromoteToAct(objectives);
    }
    
    toast({
      title: t('objectivesPromoted'),
      description: t('checkStrategyBuilder'),
      duration: 3000,
    });
  };

  const getLoopTypeColor = (type: 'reinforcing' | 'balancing') => {
    return type === 'reinforcing' ? 'text-teal-400' : 'text-orange-400';
  };

  const getLoopTypeBadge = (type: 'reinforcing' | 'balancing') => {
    const color = type === 'reinforcing' ? 'bg-teal-500/20 text-teal-400' : 'bg-orange-500/20 text-orange-400';
    return (
      <Badge variant="secondary" className={color}>
        {t(type)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
          {t('loopAnalysis').toUpperCase()}
        </h2>
        <p className="text-sm text-gray-400">
          {t('loopAnalysisDesc')}
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="glass-panel p-4 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            onClick={handleRecomputeAnalysis}
            disabled={isAnalyzing || !hasTargets}
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            <RotateCcw size={16} className="mr-2" />
            {isAnalyzing ? t('analyzing') : t('recomputeDynamics')}
          </Button>
          
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[160px] bg-white/10 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allLoops')}</SelectItem>
                  <SelectItem value="reinforcing">{t('reinforcingLoops')}</SelectItem>
                  <SelectItem value="balancing">{t('balancingLoops')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-400">{t('timeHorizon')}:</span>
              <Slider
                value={timeHorizon}
                min={1}
                max={10}
                step={1}
                onValueChange={setTimeHorizon}
                className="slider-teal flex-1"
              />
              <span className="text-sm text-teal-400 min-w-[60px]">
                {timeHorizon[0]} {t('years')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analysis Table */}
      <motion.div 
        className="glass-panel border border-white/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-gray-300">{t('loopName')}</TableHead>
                <TableHead className="text-gray-300">{t('netEffect')}</TableHead>
                <TableHead className="text-gray-300">{t('coverageRatio')}</TableHead>
                <TableHead className="text-gray-300">{t('consistencyScore')}</TableHead>
                <TableHead className="text-gray-300">{t('actionableObjectives')}</TableHead>
                <TableHead className="text-gray-300">{t('promote')}</TableHead>
                <TableHead className="text-gray-300 w-16">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoops.map((loop, index) => (
                <React.Fragment key={loop.id}>
                  <motion.tr 
                    className="border-white/10 hover:bg-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredLoop(loop.id)}
                    onMouseLeave={() => setHoveredLoop(null)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-medium text-white">{loop.name}</div>
                          {getLoopTypeBadge(loop.type)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${loop.netEffect >= 0 ? 'text-teal-400' : 'text-orange-400'}`}>
                        {loop.netEffect >= 0 ? '+' : ''}{loop.netEffect.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-teal-500 to-teal-400"
                            style={{ width: `${loop.coverageRatio * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{(loop.coverageRatio * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                            style={{ width: `${loop.consistencyScore * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{(loop.consistencyScore * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {loop.actionableObjectives.slice(0, 2).map((obj, idx) => (
                          <div key={idx} className="text-xs text-gray-400 truncate max-w-[200px]">
                            {obj}
                          </div>
                        ))}
                        {loop.actionableObjectives.length > 2 && (
                          <div className="text-xs text-teal-400">
                            +{loop.actionableObjectives.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePromoteObjectives(loop.actionableObjectives);
                        }}
                      >
                        <Target size={12} className="mr-1" />
                        {t('promote')}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLoopExpansion(loop.id)}
                        className="text-gray-400 hover:text-white"
                        aria-expanded={expandedLoops.includes(loop.id)}
                      >
                        {expandedLoops.includes(loop.id) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </Button>
                    </TableCell>
                  </motion.tr>
                  
                  {/* Expanded Details Row */}
                  {expandedLoops.includes(loop.id) && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-white/10"
                        >
                          <div className="p-4">
                            <LoopVisualization
                              loopId={loop.id}
                              name={loop.name}
                              type={loop.type}
                              description={loop.description}
                              nodes={loop.nodes}
                              coverageRatio={loop.coverageRatio}
                              netEffect={loop.netEffect}
                              onPromoteObjective={() => handlePromoteObjectives(loop.actionableObjectives)}
                            />
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Expanded Loop Details */}
      <AnimatePresence>
        {expandedLoops.map(loopId => {
          const loop = loopsData.find(l => l.id === loopId);
          if (!loop) return null;
          
          return (
            <motion.div
              key={loopId}
              className="glass-panel-deep p-6 border border-white/30"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{loop.name}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleLoopExpansion(loopId)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronDown size={16} />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-400">{loop.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Control Levers</h4>
                    <div className="space-y-2">
                      {loop.levers.map((lever, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          className="w-full justify-between border-white/20 text-gray-300 hover:bg-white/10"
                          onClick={() => onAdjustLever && onAdjustLever(lever)}
                        >
                          {lever}
                          <ArrowRight size={12} />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Effect Comparison</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{t('baseline')}:</span>
                        <span className="text-sm text-white">{loop.baselineEffect}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{t('postTarget')}:</span>
                        <span className="text-sm text-teal-400">{loop.postTargetEffect}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full flex">
                          <div 
                            className="bg-gray-500"
                            style={{ width: `${(loop.baselineEffect / 100) * 100}%` }}
                          />
                          <div 
                            className="bg-teal-500"
                            style={{ width: `${((loop.postTargetEffect - loop.baselineEffect) / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-white">{t('actionableObjectives')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {loop.actionableObjectives.map((obj, idx) => (
                      <div key={idx} className="glass-panel p-3 text-sm text-gray-300">
                        {obj}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default LoopAnalysisTab;
