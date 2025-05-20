
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { 
  SlidersHorizontal, 
  TrendingUp, 
  TrendingDown, 
  SquareArrowRight, 
  Shield, 
  BarChart2, 
  Zap
} from 'lucide-react';

interface SensitivityParameter {
  parameter: string;
  delta: number;
  impact: number;
}

interface ExecutionImpact {
  bundlesAffected: number;
  budgetChange: number;
  timelineShift: number;
}

interface StrategyBuilderProps {
  sensitivityParameters: SensitivityParameter[];
  executionImpact: ExecutionImpact;
  onCompute: (approach: string) => void;
}

type Approach = 'conservative' | 'balanced' | 'aggressive';

const StrategyBuilder: React.FC<StrategyBuilderProps> = ({
  sensitivityParameters,
  executionImpact,
  onCompute
}) => {
  const { t, isRTL } = useTranslation();
  const [selectedApproach, setSelectedApproach] = useState<Approach>('balanced');
  
  const approachModifiers = {
    conservative: { 
      deltaMultiplier: 0.5, 
      confidenceInterval: 2, 
      timeToEquilibrium: 12,
      risk: 'low',
      icon: Shield
    },
    balanced: { 
      deltaMultiplier: 1, 
      confidenceInterval: 5, 
      timeToEquilibrium: 8,
      risk: 'medium',
      icon: BarChart2
    },
    aggressive: { 
      deltaMultiplier: 2, 
      confidenceInterval: 10, 
      timeToEquilibrium: 4,
      risk: 'high',
      icon: Zap
    }
  };
  
  const selectedModifiers = approachModifiers[selectedApproach];
  
  // Calculate the total impact based on the selected approach
  const calculateTotalImpact = () => {
    return sensitivityParameters.reduce((total, param) => {
      return total + (param.impact * selectedModifiers.deltaMultiplier) / 10;
    }, 0).toFixed(1);
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };
  
  return (
    <div className="space-y-6">
      {/* Approach Selector */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-left">{t("selectApproach")}</h3>
        <div className="grid grid-cols-3 gap-2">
          <ApproachButton 
            title={t("conservativeApproach")}
            description={t("conservativeDesc")}
            icon={Shield}
            isSelected={selectedApproach === 'conservative'}
            onClick={() => setSelectedApproach('conservative')}
            riskLevel="low"
          />
          
          <ApproachButton 
            title={t("balancedApproach")}
            description={t("balancedDesc")}
            icon={BarChart2}
            isSelected={selectedApproach === 'balanced'}
            onClick={() => setSelectedApproach('balanced')}
            riskLevel="medium"
          />
          
          <ApproachButton 
            title={t("aggressiveApproach")}
            description={t("aggressiveDesc")}
            icon={Zap}
            isSelected={selectedApproach === 'aggressive'}
            onClick={() => setSelectedApproach('aggressive')}
            riskLevel="high"
          />
        </div>
      </div>
      
      {/* Parameter Sensitivity Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-3 text-left flex items-center">
            <SlidersHorizontal className="mr-1" size={14} />
            {t("sensitivityParameters")}
          </h3>
          <div className="glass-panel-dark p-4">
            {/* Top sensitivity parameters */}
            <div className="space-y-4">
              {sensitivityParameters.map((param, idx) => {
                const adjustedDelta = param.delta * selectedModifiers.deltaMultiplier;
                const isPositiveDelta = adjustedDelta > 0;
                
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{param.parameter}</span>
                      <div className="flex items-center">
                        <span className={`
                          px-1.5 py-0.5 text-xs rounded
                          ${isPositiveDelta ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                        `}>
                          {isPositiveDelta ? '+' : ''}{adjustedDelta.toFixed(1)}Δ
                        </span>
                        <span className="ml-2">{param.impact}% {t("impact")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                          style={{ width: `${param.impact * 2}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${param.impact * 2}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                      </div>
                      {/* Parameter adjustment slider would go here in a real implementation */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Impact Forecast & Execution Preview */}
        <div className="space-y-6">
          {/* Impact Forecast */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-left flex items-center">
              {parseFloat(calculateTotalImpact()) >= 0 
                ? <TrendingUp className="mr-1" size={14} /> 
                : <TrendingDown className="mr-1" size={14} />
              }
              {t("impactForecast")}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="glass-panel-dark p-3 text-center">
                <div className="text-2xl font-bold text-teal-400">
                  {parseFloat(calculateTotalImpact()) >= 0 ? '+' : ''}{calculateTotalImpact()}
                </div>
                <div className="text-xs text-gray-400">{t("deiPoints")}</div>
              </div>
              
              <div className="glass-panel-dark p-3 text-center">
                <div className="text-2xl font-bold text-teal-400">
                  {selectedModifiers.timeToEquilibrium}
                </div>
                <div className="text-xs text-gray-400">{t("months")}</div>
              </div>
              
              <div className="glass-panel-dark p-3 text-center">
                <div className="text-2xl font-bold text-teal-400">
                  ±{selectedModifiers.confidenceInterval}%
                </div>
                <div className="text-xs text-gray-400">{t("confidence")}</div>
              </div>
            </div>
          </div>
          
          {/* Execution Impact Preview */}
          <div>
            <h3 className="text-sm font-medium mb-3 text-left">{t("executionImpact")}</h3>
            <div className="glass-panel-dark p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{t("bundlesAffected")}</span>
                <span className="font-medium">{executionImpact.bundlesAffected}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{t("budgetChange")}</span>
                <span className={`font-medium ${
                  executionImpact.budgetChange >= 0 ? 'text-teal-400' : 'text-red-400'
                }`}>
                  {formatCurrency(executionImpact.budgetChange)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{t("timelineShift")}</span>
                <span className="font-medium">
                  {executionImpact.timelineShift} {t("weeks")}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <button 
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                  onClick={() => {
                    // In a real app, this would link to the ACT Zone with filtered data
                    window.location.href = '/act';
                  }}
                >
                  <span>{t("viewInAct")}</span>
                  <SquareArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Compute Button */}
      <div className="pt-2">
        <button
          className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg text-white font-medium hover:from-teal-400 hover:to-blue-500 transition-colors shadow-lg shadow-blue-600/20 group"
          onClick={() => onCompute(t(
            selectedApproach === 'conservative' ? 'conservativeApproach' : 
            selectedApproach === 'balanced' ? 'balancedApproach' : 
            'aggressiveApproach'
          ))}
        >
          <span className="group-hover:scale-105 inline-block transition-transform">
            {t("computeNewBands")}
          </span>
        </button>
      </div>
    </div>
  );
};

// Approach Button Component
interface ApproachButtonProps {
  title: string;
  description: string;
  icon: React.FC<{ size?: number | string }>;
  isSelected: boolean;
  onClick: () => void;
  riskLevel: 'low' | 'medium' | 'high';
}

const ApproachButton: React.FC<ApproachButtonProps> = ({
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
  riskLevel
}) => {
  return (
    <motion.button
      className={`p-3 rounded-lg text-left flex flex-col h-28 relative overflow-hidden transition-all ${
        isSelected 
          ? 'ring-2 ring-teal-500/70 bg-gradient-to-br from-teal-900/70 to-blue-900/70' 
          : 'bg-white/5 hover:bg-white/10'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Pulsing background for selected approach */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
      
      <div className="flex justify-between items-start">
        <Icon size={16} />
        <div className={`text-xs px-1.5 py-0.5 rounded ${
          riskLevel === 'low' ? 'bg-green-500/20 text-green-400' :
          riskLevel === 'medium' ? 'bg-blue-500/20 text-blue-400' :
          'bg-amber-500/20 text-amber-400'
        }`}>
          {riskLevel === 'low' ? 'Low Risk' :
           riskLevel === 'medium' ? 'Medium Risk' :
           'High Risk'}
        </div>
      </div>
      <div className="mt-2">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-400 mt-1 line-clamp-2">{description}</div>
      </div>
    </motion.button>
  );
};

export default StrategyBuilder;
