
import React from 'react';
import { X, Settings, Play, Plus, ArrowRight, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface AlertDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  alert: {
    id: number;
    metric: string;
    deviation: string;
    time: string;
    severity: 'low' | 'medium' | 'high';
    data?: { date: string; value: number }[];
    subIndicators?: { name: string; value: number; trend: number[] }[];
  } | null;
}

const mockChartData = [
  { date: 'Jan', value: 65 },
  { date: 'Feb', value: 68 },
  { date: 'Mar', value: 70 },
  { date: 'Apr', value: 72 },
  { date: 'May', value: 75 },
  { date: 'Jun', value: 74 },
  { date: 'Jul', value: 72 },
  { date: 'Aug', value: 70 },
  { date: 'Sep', value: 67 },
  { date: 'Oct', value: 65 },
  { date: 'Nov', value: 63 },
  { date: 'Dec', value: 58 },
];

const mockSubIndicators = [
  { name: 'Water Usage', value: -5.2, trend: [65, 63, 60, 58, 55] },
  { name: 'Energy Consumption', value: -2.4, trend: [70, 69, 68, 67, 66] },
  { name: 'Material Efficiency', value: -3.8, trend: [75, 72, 70, 68, 65] },
];

export const AlertDetailPopup: React.FC<AlertDetailPopupProps> = ({ isOpen, onClose, alert }) => {
  const { t, isRTL } = useTranslation();
  
  if (!alert) return null;

  const data = alert.data || mockChartData;
  const subIndicators = alert.subIndicators || mockSubIndicators;
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 hover:bg-red-600';
      case 'medium': return 'bg-amber-500 hover:bg-amber-600';
      case 'low': return 'bg-teal-500 hover:bg-teal-600';
      default: return 'bg-teal-500 hover:bg-teal-600';
    }
  };

  const handleCreateBundle = () => {
    console.log('Create bundle for alert:', alert);
    onClose();
  };

  const handleApplyPlaybook = () => {
    console.log('Apply playbook for alert:', alert);
    onClose();
  };

  const handleRunMicroSim = () => {
    console.log('Run micro-sim for alert:', alert);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl overflow-hidden glass-panel-deep ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl flex items-center">
            {alert.metric}
            <span className={`text-${alert.deviation.startsWith('-') ? 'red' : 'green'}-400 mx-2`}>
              {alert.deviation}
            </span>
            <Badge className={getSeverityColor(alert.severity)} variant="outline">
              {t(alert.severity as any)}
            </Badge>
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
          {/* Left Column - Detailed Metrics */}
          <div className="md:col-span-3 space-y-4">
            <div className="h-48 glass-panel p-4">
              <h3 className="text-sm font-medium mb-2">{t('historicalTrend' as any)}</h3>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }} 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(23, 23, 23, 0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#38bdf8" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="glass-panel p-4">
              <h3 className="text-sm font-medium mb-2">{t('exactDeviation' as any)}</h3>
              <p className={`text-lg font-medium ${alert.deviation.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                {alert.deviation} vs. {t('equilibriumBand' as any)}
              </p>
            </div>
            
            <div className="glass-panel p-4">
              <h3 className="text-sm font-medium mb-3">{t('affectedSubIndicators' as any)}</h3>
              <div className="space-y-3">
                {subIndicators.map((indicator, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{indicator.name}</p>
                      <span className={`text-xs ${indicator.value < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {indicator.value > 0 ? '+' : ''}{indicator.value}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {indicator.trend.map((val, j) => (
                        <div 
                          key={j}
                          className="h-6 w-1 rounded-full"
                          style={{ 
                            backgroundColor: indicator.value < 0 ? 'rgba(248, 113, 113, 0.6)' : 'rgba(74, 222, 128, 0.6)',
                            opacity: 0.3 + (j * 0.15)
                          }}
                        />
                      ))}
                      <TrendingDown 
                        className={`h-4 w-4 ${indicator.value < 0 ? 'text-red-400' : 'text-green-400'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Recommended Actions */}
          <div className="md:col-span-2 space-y-4">
            <div className="glass-panel p-4 space-y-4">
              <h3 className="text-sm font-medium">{t('recommendedActions' as any)}</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left" 
                  onClick={handleRunMicroSim}
                >
                  <Settings className="mr-2 h-4 w-4" /> 
                  {t('runMicroSim' as any)}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={handleApplyPlaybook}
                >
                  <Play className="mr-2 h-4 w-4" /> 
                  {t('applyPlaybook' as any)}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={handleCreateBundle}
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  {t('createBundle' as any)}
                </Button>
              </div>
            </div>
            
            <div className="glass-panel p-4">
              <h3 className="text-sm font-medium mb-2">{t('impactAssessment' as any)}</h3>
              <p className="text-sm text-gray-400 mb-2">
                {t('alertImpactDescription' as any)}
              </p>
              <div className="flex items-center space-x-2">
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full" 
                    style={{ width: '65%' }}
                  />
                </div>
                <span className="text-xs font-medium">65%</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between mt-4 gap-2">
          <Button 
            variant="outline" 
            onClick={() => console.log('Investigate in THINK')}
            className="flex-1"
          >
            {t('investigateInThink' as any)}
          </Button>
          <Button 
            className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500"
            onClick={() => console.log('Escalate to ACT')}
          >
            {t('escalateToAct' as any)}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
