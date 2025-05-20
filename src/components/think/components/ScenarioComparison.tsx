
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { useTranslation } from '@/hooks/use-translation';

interface Scenario {
  id: number;
  name: string;
  date: string;
  probability: number;
  sparkline: number[];
}

interface ScenarioImpact {
  scenarioName: string;
  population: number;
  resources: number;
  goods: number;
  social: number;
  executionCost?: number;
  timelineImpact?: number;
}

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  maxScenarios?: number;
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ 
  scenarios,
  maxScenarios = 3 
}) => {
  const { t } = useTranslation();
  
  // Generate impact data based on scenarios (in a real app, this would come from a backend)
  const generateImpactData = (scenarios: Scenario[]): ScenarioImpact[] => {
    return scenarios.slice(0, maxScenarios).map(scenario => {
      // Use the sparkline trend to generate simulated impacts for each pillar
      const lastIndex = scenario.sparkline.length - 1;
      const trendDirection = scenario.sparkline[lastIndex] - scenario.sparkline[0];
      const trendFactor = trendDirection / 10;
      
      // Generate an impact percentage for each pillar (values between -20 and +20)
      return {
        scenarioName: scenario.name,
        population: Math.round((5 + trendFactor + Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1)),
        resources: Math.round((3 + trendFactor + Math.random() * 8) * (Math.random() > 0.5 ? 1 : -1)),
        goods: Math.round((4 + trendFactor + Math.random() * 6) * (Math.random() > 0.4 ? 1 : -1)),
        social: Math.round((6 + trendFactor + Math.random() * 4) * (Math.random() > 0.3 ? 1 : -1)),
        executionCost: Math.round((10 + Math.abs(trendFactor) * 5) * 100000) / 100000,
        timelineImpact: Math.round(Math.abs(trendFactor) * 2 + Math.random() * 3)
      };
    });
  };
  
  // Format the data for the pillar impact chart
  const formatPillarData = (impactData: ScenarioImpact[]) => {
    return [
      {
        name: t('population'),
        ...impactData.reduce((obj, item) => ({
          ...obj,
          [item.scenarioName]: item.population
        }), {})
      },
      {
        name: t('resources'),
        ...impactData.reduce((obj, item) => ({
          ...obj,
          [item.scenarioName]: item.resources
        }), {})
      },
      {
        name: t('goods'),
        ...impactData.reduce((obj, item) => ({
          ...obj,
          [item.scenarioName]: item.goods
        }), {})
      },
      {
        name: t('social'),
        ...impactData.reduce((obj, item) => ({
          ...obj,
          [item.scenarioName]: item.social
        }), {})
      },
    ];
  };
  
  // Format the data for the execution impact chart
  const formatExecutionData = (impactData: ScenarioImpact[]) => {
    const executionData = [];
    
    // Add cost data
    executionData.push({
      name: t('budgetImpact'),
      ...impactData.reduce((obj, item) => ({
        ...obj,
        [item.scenarioName]: item.executionCost
      }), {})
    });
    
    // Add timeline data
    executionData.push({
      name: t('timelineImpact'),
      ...impactData.reduce((obj, item) => ({
        ...obj,
        [item.scenarioName]: item.timelineImpact
      }), {})
    });
    
    return executionData;
  };
  
  if (scenarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">{t('noScenariosToCompare')}</div>
    );
  }
  
  // Generate the comparison data
  const impactData = generateImpactData(scenarios);
  const pillarData = formatPillarData(impactData);
  const executionData = formatExecutionData(impactData);
  
  // Generate colors for each scenario
  const scenarioColors = ['#14b8a6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444'];
  
  // Create an array of scenario names for the chart
  const displayedScenarios = scenarios.slice(0, maxScenarios).map(scenario => scenario.name);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">{t('pillarImpactComparison')}</h3>
        <div className="bg-navy-900/40 p-4 rounded-lg border border-white/10 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pillarData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                type="number"
                tick={{ fill: '#ccc', fontSize: 12 }}
                tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}%`}
              />
              <YAxis 
                dataKey="name"
                type="category"
                tick={{ fill: '#ccc', fontSize: 12 }}
                width={80}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1a2035', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value) => [`${value > 0 ? '+' : ''}${value}%`, '']}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {displayedScenarios.map((scenario, index) => (
                <Bar 
                  key={scenario}
                  dataKey={scenario} 
                  fill={scenarioColors[index % scenarioColors.length]} 
                  radius={[4, 4, 4, 4]}
                >
                  <LabelList 
                    dataKey={scenario} 
                    position="right" 
                    fill="#fff"
                    formatter={(value: any) => {
                      // Fix: Check if value is a number first
                      const numValue = Number(value);
                      return !isNaN(numValue) ? 
                        (numValue > 0 ? `+${numValue}%` : `${numValue}%`) : '';
                    }}
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">{t('executionImpactComparison')}</h3>
        <div className="bg-navy-900/40 p-4 rounded-lg border border-white/10 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={executionData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                type="number"
                tick={{ fill: '#ccc', fontSize: 12 }}
              />
              <YAxis 
                dataKey="name"
                type="category"
                tick={{ fill: '#ccc', fontSize: 12 }}
                width={100}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1a2035', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name, props) => {
                  const key = props.dataKey as string;
                  if (key === t('budgetImpact')) {
                    // Fix: Convert value to number before using toFixed
                    const numValue = Number(value);
                    return !isNaN(numValue) ? [`${numValue.toFixed(2)}M AED`, ''] : [`${value}`, ''];
                  }
                  return [`${value} weeks`, ''];
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {displayedScenarios.map((scenario, index) => (
                <Bar 
                  key={scenario}
                  dataKey={scenario} 
                  fill={scenarioColors[index % scenarioColors.length]} 
                  radius={[4, 4, 4, 4]}
                >
                  <LabelList 
                    dataKey={scenario} 
                    position="right" 
                    fill="#fff"
                  />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparison;
