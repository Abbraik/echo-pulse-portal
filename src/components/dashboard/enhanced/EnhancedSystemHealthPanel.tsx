
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp, Eye, Settings, X, Play, Pause, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FullscreenButton } from '@/components/ui/fullscreen-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import SparklineChart from '@/components/think/components/SparklineChart';

interface EnhancedSystemHealthPanelProps {
  data?: any;
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  currentMode: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isExpanded?: boolean;
  isContracted?: boolean;
}

const EnhancedSystemHealthPanel: React.FC<EnhancedSystemHealthPanelProps> = ({ 
  data, 
  onViewModeChange,
  currentMode,
  isFullscreen = false,
  onToggleFullscreen,
  isExpanded = false,
  isContracted = false
}) => {
  const [selectedPopup, setSelectedPopup] = useState<string | null>(null);
  const [deiTarget, setDeiTarget] = useState(85);
  const [pinnedMetric, setPinnedMetric] = useState<string | null>(null);
  const [draggedRisk, setDraggedRisk] = useState<string | null>(null);

  // Mock data
  const mockData = {
    kpis: [
      { name: 'Population Volatility', value: 12.3, trend: [10, 12, 11, 13, 12.3], unit: '%' },
      { name: 'Resource Stock Ratio', value: 78.5, trend: [75, 77, 76, 79, 78.5], unit: '%' },
      { name: 'Market Stability', value: 89.2, trend: [87, 88, 90, 89, 89.2], unit: '%' },
      { name: 'Social Cohesion', value: 72.1, trend: [70, 71, 73, 72, 72.1], unit: '%' }
    ],
    deiScore: 78.5,
    psiu: { producer: 82, stabilizer: 76, innovator: 68, unifier: 85 },
    alerts: [
      { id: '1', type: 'critical', message: 'DEI score trending down rapidly', severity: 'critical', timestamp: '2 min ago', cause: 'Population surge in Zone 3' },
      { id: '2', type: 'warning', message: 'THINK loop closure delayed', severity: 'warning', timestamp: '5 min ago', cause: 'Resource allocation bottleneck' },
      { id: '3', type: 'info', message: 'Resource allocation variance detected', severity: 'info', timestamp: '8 min ago', cause: 'Seasonal adjustment needed' }
    ],
    risks: [
      { id: 'risk1', name: 'Population Surge', likelihood: 0.7, impact: 0.8, bundles: 12, description: 'Sudden population increase in urban zones' },
      { id: 'risk2', name: 'Extraction Over-Quota', likelihood: 0.4, impact: 0.9, bundles: 8, description: 'Resource extraction exceeding sustainable limits' },
      { id: 'risk3', name: 'Loop Inconsistency', likelihood: 0.6, impact: 0.6, bundles: 15, description: 'Feedback loops showing irregular patterns' }
    ]
  };

  const displayData = data || mockData;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'warning': return '🟠';
      case 'info': return '🟢';
      default: return '⚪';
    }
  };

  const getRiskMatrixColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 0.7) return 'bg-red-500/30 border-red-500/50';
    if (score >= 0.5) return 'bg-orange-500/30 border-orange-500/50';
    if (score >= 0.3) return 'bg-yellow-500/30 border-yellow-500/50';
    return 'bg-green-500/30 border-green-500/50';
  };

  const getRiskMatrixPosition = (likelihood: number, impact: number) => {
    return {
      left: `${likelihood * 100}%`,
      top: `${(1 - impact) * 100}%`
    };
  };

  if (isContracted) {
    return (
      <div className="p-3 h-full flex flex-col bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-teal-400">System Health</h3>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        
        {/* Compact KPIs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {displayData.kpis.slice(0, 4).map((kpi: any) => (
            <div key={kpi.name} className="p-2 bg-white/5 rounded text-center">
              <div className="text-xs font-bold text-teal-400">{kpi.value}</div>
              <div className="text-xs text-gray-400 truncate">{kpi.name}</div>
            </div>
          ))}
        </div>

        {/* Top Alert */}
        <div className="flex-1 min-h-0">
          <div className="p-2 bg-red-500/20 rounded border border-red-500/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-400 font-medium truncate">{displayData.alerts[0]?.message}</span>
              <span className="text-red-400">{getSeverityIcon(displayData.alerts[0]?.severity)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="h-full p-6 bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-teal-400">System Health & Alerts</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onToggleFullscreen && (
              <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggleFullscreen} />
            )}
            <Button
              size="sm"
              variant={currentMode === 'health' ? 'default' : 'outline'}
              onClick={() => onViewModeChange(currentMode === 'health' ? 'full' : 'health')}
              className="text-teal-400 text-xs"
            >
              <Eye size={12} className="mr-1" />
              Focus
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* 1. KPI Grid (15% height) */}
          <motion.div 
            className="grid grid-cols-4 gap-3 h-[15%]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {displayData.kpis.map((kpi: any, index: number) => (
              <motion.div
                key={kpi.name}
                className="glass-panel p-3 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -2 }}
                onHoverStart={() => setPinnedMetric(kpi.name)}
                onHoverEnd={() => setPinnedMetric(null)}
              >
                <div className="text-lg font-bold text-teal-400">{kpi.value}{kpi.unit}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400 truncate">{kpi.name}</span>
                  <SparklineChart data={kpi.trend} width={30} height={12} color="#14B8A6" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 2. PSIU & DEI Gauges (25% height) */}
          <motion.div 
            className="grid grid-cols-2 gap-4 h-[25%]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* DEI Gauge */}
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-sm font-medium text-teal-400 mb-2">DEI Score</h4>
              <div className="relative h-20 w-20 mx-auto mb-2">
                <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: (displayData.deiScore / 100) * 360 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-teal-400">{displayData.deiScore}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Target size={12} className="text-gray-400" />
                <Slider
                  value={[deiTarget]}
                  onValueChange={(value) => setDeiTarget(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-gray-400">{deiTarget}</span>
              </div>
            </div>

            {/* PSIU Balance */}
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-sm font-medium text-teal-400 mb-2">PSIU Balance</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(displayData.psiu).map(([key, value]) => (
                  <motion.div
                    key={key}
                    className="p-2 bg-white/10 rounded cursor-pointer hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedPopup(`psiu-${key}`)}
                  >
                    <div className="text-sm font-bold text-teal-400">{value}</div>
                    <div className="text-xs text-gray-400 capitalize">{key.charAt(0)}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3. Live Sparklines Row (10% height) */}
          <motion.div 
            className="flex items-center justify-between h-[10%] glass-panel p-3 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {displayData.kpis.map((kpi: any) => (
              <div key={kpi.name} className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">{kpi.name.split(' ')[0]}</span>
                <SparklineChart data={kpi.trend} width={40} height={16} color="#14B8A6" />
              </div>
            ))}
          </motion.div>

          {/* 4. Critical Alerts Feed (25% height) */}
          <motion.div 
            className="h-[25%] glass-panel p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-sm font-medium text-teal-400 mb-3">Critical Alerts</h4>
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {displayData.alerts.map((alert: any) => (
                  <motion.div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} hover:scale-[1.02] hover:shadow-lg transition-all duration-300`}
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="text-sm">{getSeverityIcon(alert.severity)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{alert.message}</div>
                          <div className="text-xs text-gray-400">{alert.cause} • {alert.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPopup(`alert-${alert.id}`)}
                          className="text-teal-400 text-xs h-6"
                        >
                          Investigate ▶
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-400 h-6">
                          <Pause size={10} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* 5. Risk Matrix (25% height) */}
          <motion.div 
            className="h-[25%] glass-panel p-4 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-sm font-medium text-teal-400 mb-3">Risk Matrix</h4>
            <div className="relative h-full border border-white/20 rounded-lg overflow-hidden">
              {/* Matrix Grid */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="border-r border-b border-white/10 flex items-center justify-center text-xs text-gray-400">Low Impact</div>
                <div className="border-b border-white/10 flex items-center justify-center text-xs text-gray-400">High Impact</div>
                <div className="border-r border-white/10 flex items-center justify-center text-xs text-gray-400">Low Likelihood</div>
                <div className="flex items-center justify-center text-xs text-gray-400">High Likelihood</div>
              </div>

              {/* Risk Pins */}
              {displayData.risks.map((risk: any) => (
                <motion.div
                  key={risk.id}
                  className={`absolute w-4 h-4 rounded-full border-2 cursor-pointer hover:scale-125 transition-transform ${getRiskMatrixColor(risk.likelihood, risk.impact)}`}
                  style={getRiskMatrixPosition(risk.likelihood, risk.impact)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + displayData.risks.indexOf(risk) * 0.1 }}
                  onClick={() => setSelectedPopup(`risk-${risk.id}`)}
                  title={`${risk.name}: ${risk.description}`}
                />
              ))}

              {/* Axis Labels */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">Impact →</div>
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-400">Likelihood →</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Popups */}
      <AnimatePresence>
        {selectedPopup && (
          <Dialog open={!!selectedPopup} onOpenChange={() => setSelectedPopup(null)}>
            <DialogContent className="max-w-2xl glass-panel">
              <DialogHeader>
                <DialogTitle className="text-teal-400">
                  {selectedPopup.startsWith('psiu-') && `PSIU ${selectedPopup.split('-')[1].toUpperCase()} Details`}
                  {selectedPopup.startsWith('alert-') && 'Alert Investigation'}
                  {selectedPopup.startsWith('risk-') && 'Risk Analysis'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedPopup.startsWith('psiu-') && (
                  <div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-400">82</div>
                        <div className="text-sm text-gray-400">Current Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">+5</div>
                        <div className="text-sm text-gray-400">This Quarter</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">3</div>
                        <div className="text-sm text-gray-400">Active Levers</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-white">Recommended Actions</h5>
                      {['Optimize resource allocation', 'Strengthen feedback loops', 'Enhance stakeholder engagement'].map((action, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <span className="text-sm text-gray-300">{action}</span>
                          <Button size="sm" variant="outline" className="text-teal-400 text-xs">Apply ▶</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPopup.startsWith('alert-') && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-red-500/20 text-red-400">Critical</Badge>
                      <span className="text-sm text-gray-400">Detected 2 minutes ago</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-white mb-2">Affected Metrics</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">DEI Score</span>
                            <span className="text-red-400">-12%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Population</span>
                            <span className="text-red-400">+25%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-white mb-2">Recommendations</h5>
                        <div className="space-y-1">
                          {['Deploy emergency resources', 'Activate overflow protocols'].map((rec, i) => (
                            <Button key={i} size="sm" variant="outline" className="w-full text-teal-400 text-xs">
                              {rec} ▶
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="default" className="flex-1">Acknowledge</Button>
                      <Button variant="outline" onClick={() => setSelectedPopup(null)}>Close</Button>
                    </div>
                  </div>
                )}

                {selectedPopup.startsWith('risk-') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-orange-400">0.7</div>
                        <div className="text-xs text-gray-400">Likelihood</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-400">0.8</div>
                        <div className="text-xs text-gray-400">Impact</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-400">12</div>
                        <div className="text-xs text-gray-400">Affected Bundles</div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-white mb-2">Mitigation Actions</h5>
                      <div className="space-y-2">
                        {['Implement population controls', 'Activate emergency protocols', 'Deploy additional resources'].map((action, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded">
                            <span className="text-sm text-gray-300">{action}</span>
                            <Button size="sm" variant="outline" className="text-teal-400 text-xs">Apply ▶</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedSystemHealthPanel;
