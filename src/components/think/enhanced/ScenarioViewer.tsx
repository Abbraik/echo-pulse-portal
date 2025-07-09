import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';

interface Scenario {
  id: number;
  name: string;
  date: string;
  probability: number;
  sparkline: number[];
  indicators: {
    dei: number;
    resourceStock: number;
    populationVolatility: number;
  };
}

interface ScenarioViewerProps {
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
}

const ScenarioViewer: React.FC<ScenarioViewerProps> = ({
  scenarios,
  selectedScenario,
  onScenarioChange
}) => {
  const { t } = useTranslation();

  // Add safety checks for selectedScenario
  if (!selectedScenario || !selectedScenario.indicators) {
    return (
      <GlassCard className="p-6" variant="deep">
        <div className="text-center text-gray-400">
          <p>No scenario selected</p>
        </div>
      </GlassCard>
    );
  }

  const MiniGauge: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
    <motion.div
      className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10"
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - value / 100)}`}
            initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - value / 100)}` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-2 text-center">{label}</span>
    </motion.div>
  );

  return (
    <GlassCard className="p-6" variant="deep">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Monitor className="w-5 h-5 text-teal-400 mr-3" />
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
            {t('scenarioViewer')}
          </h3>
        </div>
        
        <Select 
          value={selectedScenario.id.toString()} 
          onValueChange={(value) => {
            const scenario = scenarios.find(s => s.id === parseInt(value));
            if (scenario) onScenarioChange(scenario);
          }}
        >
          <SelectTrigger className="w-[200px] bg-white/10 border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/20">
            {scenarios.map((scenario) => (
              <SelectItem key={scenario.id} value={scenario.id.toString()}>
                <div className="flex items-center gap-2">
                  <span>{scenario.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {(scenario.probability * 100).toFixed(0)}%
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <MiniGauge 
          value={selectedScenario.indicators.dei} 
          label="DEI Index" 
          color="#14b8a6" 
        />
        <MiniGauge 
          value={selectedScenario.indicators.resourceStock} 
          label="Resource Stock" 
          color="#3b82f6" 
        />
        <MiniGauge 
          value={selectedScenario.indicators.populationVolatility} 
          label="Pop. Volatility" 
          color="#8b5cf6" 
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>Last Updated: {selectedScenario.date}</span>
        <div className="flex items-center gap-2">
          <span>Probability:</span>
          <Badge variant="secondary" className="bg-teal-500/20 text-teal-400">
            {(selectedScenario.probability * 100).toFixed(0)}%
          </Badge>
        </div>
      </div>
    </GlassCard>
  );
};

export default ScenarioViewer;