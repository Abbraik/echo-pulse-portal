
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import {
  BarChartHorizontal,
  FileSpreadsheet, Rocket,
  MessageSquare, Share2, Download, TrendingUp, Users, Video
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface ResultsInnovationToolsProps {
  showResults: boolean;
  engine: string;
  activeTab?: string;
}

export const ResultsInnovationTools: React.FC<ResultsInnovationToolsProps> = ({
  showResults,
  engine,
  activeTab = 'impact'
}) => {
  const { t } = useTranslation();
  
  if (!showResults) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <div className="text-3xl font-bold text-muted-foreground/50 mb-2">
          {t('resultsWillAppearHere')}
        </div>
        <p className="text-muted-foreground max-w-md">
          {t('generateSimulationFirst')}
        </p>
      </div>
    );
  }
  
  // Render the appropriate tab content based on activeTab
  switch (activeTab) {
    case 'impact':
      return <ImpactDashboardContent engine={engine} />;
    case 'blueprint':
      return <BlueprintContent />;
    case 'compare':
      return <ComparativeContent />;
    case 'co-create':
      return <CoCreateContent />;
    default:
      return <ImpactDashboardContent engine={engine} />;
  }
};

// Impact Dashboard Tab Content
const ImpactDashboardContent: React.FC<{ engine: string }> = ({ engine }) => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 h-full flex flex-col">
      <motion.div 
        className="flex-1 bg-black/10 dark:bg-white/5 rounded-md p-3 mb-3 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Impact Chart */}
        <div className="absolute inset-0 p-3">
          <div className="h-full w-full relative">
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* DEI Line */}
              <path
                d="M0,80 C50,75 100,70 150,60 C200,55 250,50 300,45"
                fill="none"
                stroke="rgba(45, 212, 191, 0.8)"
                strokeWidth="3"
              />
              {/* Social Trust Line */}
              <path
                d="M0,85 C50,80 100,75 150,65 C200,60 250,55 300,50"
                fill="none"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="3"
              />
              {/* Baseline reference */}
              <line
                x1="0"
                y1="72"
                x2="300"
                y2="72"
                stroke="rgba(156, 163, 175, 0.5)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              
              {/* Data points */}
              <circle cx="300" cy="45" r="3" fill="#2dd4bf" />
              <circle cx="300" cy="50" r="3" fill="#3b82f6" />
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-1 right-1 bg-black/30 backdrop-blur-sm rounded px-2 py-1 text-xs flex items-center gap-3">
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-teal-400 rounded-full mr-1"></div>
                <span>DEI: 72 → 75 (+3)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-0.5 bg-blue-500 rounded-full mr-1"></div>
                <span>{t('socialTrustMetric')}: 69 → 72 (+3)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="flex justify-between items-center text-xs">
        <div className="flex flex-col">
          <span className="text-muted-foreground">DEI</span>
          <span className="font-bold text-teal-400">72 → 75 (+3)</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">{t('socialTrustMetric')}</span>
          <span className="font-medium">69 → 72 (+3)</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Impact</span>
          <span className="font-medium text-green-400">High</span>
        </div>
        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
          <TrendingUp size={12} className="mr-1" />
          {t('analyze')} 
        </Button>
      </div>
    </div>
  );
};

// Blueprint Tab Content
const BlueprintContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 h-full flex flex-col">
      <motion.div 
        className="flex-1 flex flex-col gap-3 mb-3 text-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
          <div className="font-medium text-purple-300 mb-1">{t('coreAssumptions')}</div>
          <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
            <li>{t('increasedYouthEngagement')}</li>
            <li>Community programs scale effectively</li>
          </ul>
        </div>
        
        <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
          <div className="font-medium text-blue-300 mb-1">{t('newStocksFlows')}</div>
          <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
            <li>{t('engagementPrograms')} stock</li>
            <li>Trust feedback loop added</li>
          </ul>
        </div>
        
        <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
          <div className="font-medium text-amber-300 mb-1">{t('risks')}</div>
          <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
            <li>{t('volunteerBurnout')}</li>
            <li>Funding sustainability</li>
          </ul>
        </div>
      </motion.div>
      
      <Button size="sm" className="w-full flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700">
        <Download size={14} />
        {t('exportBlueprint')}
      </Button>
    </div>
  );
};

// Comparative Tab Content
const ComparativeContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 h-full flex flex-col">
      <motion.div 
        className="flex-1 mb-3 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Spider Chart */}
        <div className="h-full w-full bg-black/10 dark:bg-white/5 rounded-md p-3 flex items-center justify-center">
          <svg width="90%" height="90%" viewBox="0 0 200 200">
            {/* Spider web background */}
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.1)" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.1)" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.1)" />
            
            {/* Axis lines */}
            <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.1)" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.1)" />
            <line x1="38" y1="38" x2="162" y2="162" stroke="rgba(255,255,255,0.1)" />
            <line x1="38" y1="162" x2="162" y2="38" stroke="rgba(255,255,255,0.1)" />
            
            {/* Labels with actual mock values */}
            <text x="100" y="15" textAnchor="middle" fontSize="10" fill="currentColor">{t('equityMetric')} (8.8)</text>
            <text x="185" y="100" textAnchor="start" fontSize="10" fill="currentColor">{t('resilience')} (7.5)</text>
            <text x="100" y="190" textAnchor="middle" fontSize="10" fill="currentColor">{t('sustainability')} (6.9)</text>
            <text x="15" y="100" textAnchor="end" fontSize="10" fill="currentColor">{t('cohesion')} (8.0)</text>
            <text x="30" y="30" textAnchor="end" fontSize="10" fill="currentColor">{t('growth')} (5.2)</text>
            
            {/* Data polygon - current scenario */}
            <polygon 
              points="100,30 165,65 138,140 62,120 48,58" 
              fill="rgba(45, 212, 191, 0.3)" 
              stroke="rgb(45, 212, 191)" 
              strokeWidth="2"
            />
            
            {/* Data polygon - baseline comparison */}
            <polygon 
              points="100,50 140,80 120,130 80,110 70,70" 
              fill="rgba(79, 70, 229, 0.3)" 
              stroke="rgb(79, 70, 229)" 
              strokeWidth="2"
              strokeDasharray="3,3"
            />
          </svg>
        </div>
      </motion.div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-teal-400 rounded-full mr-1"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-indigo-500 rounded-full mr-1 opacity-70"></div>
            <span>Baseline</span>
          </div>
        </div>
        <Button size="sm" variant="outline" className="text-xs">
          {t('compareScenarios')}
        </Button>
      </div>
    </div>
  );
};

// Co-Create Tab Content
const CoCreateContent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 h-full flex flex-col">
      <motion.div 
        className="flex flex-col flex-1 gap-3 mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <Video size={20} className="text-blue-400" />
          <div className="text-sm font-medium mb-1">{t('liveDebateArena')}</div>
          <div className="text-xs text-gray-400">"{t('trustRedesign')}" - 3 participants</div>
          <Button size="sm" variant="outline" className="text-xs">
            {t('joinRoom')}
          </Button>
        </div>
        
        <div className="bg-black/10 dark:bg-white/5 rounded-md p-3 flex-1">
          <div className="font-medium text-sm mb-2 flex items-center gap-2">
            <MessageSquare size={14} />
            {t('insightSparks')}
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground italic bg-white/5 p-2 rounded">
              "{t('unintendedEffectsOnCohesion')}"
            </div>
            <div className="text-xs text-muted-foreground italic bg-white/5 p-2 rounded">
              "How do we measure long-term trust recovery?"
            </div>
          </div>
        </div>
      </motion.div>
      
      <Button size="sm" variant="outline" className="w-full flex items-center justify-center gap-1">
        <MessageSquare size={14} />
        {t('recordInsight')}
      </Button>
    </div>
  );
};
