import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Users, AlertTriangle, Activity, TrendingUp, TrendingDown, 
  ArrowRight, Search, Settings, Bell, FileText, Target
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClaimsModal } from '@/components/monitor/ClaimsModal';
import { HandoffDrawer } from '@/components/monitor/HandoffDrawer';
import { EntropyModal } from '@/components/monitor/EntropyModal';
import { AlertInvestigateModal } from '@/components/monitor/AlertInvestigateModal';

export const OperationalHealthPanel: React.FC = () => {
  const { t } = useTranslation();
  const [showClaimsModal, setShowClaimsModal] = useState(false);
  const [showHandoffDrawer, setShowHandoffDrawer] = useState(false);
  const [showEntropyModal, setShowEntropyModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [alertsExpanded, setAlertsExpanded] = useState(true);

  // Mock data
  const claimsData = {
    open: 12,
    oldest: 5,
    distribution: [1, 2, 5, 3, 1]
  };

  const handoffQueues = [
    { from: 'Think', to: 'Act', count: 4, avgDays: 2 },
    { from: 'Act', to: 'Monitor', count: 3, avgDays: 1 }
  ];

  const entropyData = {
    Think: { value: 0.24, trend: 'up' as const },
    Act: { value: 0.30, trend: 'down' as const },
    Monitor: { value: 0.27, trend: 'stable' as const },
    Learn: { value: 0.18, trend: 'up' as const },
    Innovate: { value: 0.22, trend: 'down' as const }
  };

  const systemAlerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Data sync lag with Act Zone',
      timestamp: '2025-05-30 10:12',
      cause: 'Network connectivity issues detected'
    },
    {
      id: 2,
      severity: 'warning',
      title: 'Loop Inconsistency detected',
      timestamp: '2025-05-30 09:48',
      cause: 'Feedback loop parameters out of range'
    },
    {
      id: 3,
      severity: 'info',
      title: 'Minor UI glitch in Learn Canvas',
      timestamp: '2025-05-30 09:30',
      cause: 'Component rendering delay'
    }
  ];

  const riskMatrix = {
    risks: [
      { name: 'Population Surge', likelihood: 0.7, impact: 0.8, id: 1 },
      { name: 'Extraction Over-Quota', likelihood: 0.5, impact: 0.4, id: 2 },
      { name: 'Loop Drift', likelihood: 0.3, impact: 0.6, id: 3 }
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp size={12} className="text-red-400" />;
      case 'down': return <TrendingDown size={12} className="text-green-400" />;
      default: return <div className="w-3 h-0.5 bg-gray-400" />;
    }
  };

  const handleAlertInvestigate = (alert: any) => {
    setSelectedAlert(alert);
    setShowAlertModal(true);
  };

  const getRiskQuadrantColor = (likelihood: number, impact: number) => {
    if (likelihood > 0.5 && impact > 0.5) return 'bg-red-500/20';
    if (likelihood > 0.5 || impact > 0.5) return 'bg-amber-500/20';
    return 'bg-green-500/20';
  };

  return (
    <div className="h-full space-y-4">
      {/* Claims & Escalations Dashboard (20% height) */}
      <motion.div 
        className="h-[20%] min-h-[100px] grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Open Claims Tile */}
        <motion.div
          className="glass-panel-deep p-4 cursor-pointer transition-all duration-300 group"
          whileHover={{ y: -4, boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }}
          onClick={() => setShowClaimsModal(true)}
        >
          <div className="flex items-center mb-2">
            <Clock size={16} className="text-teal-400 mr-2" />
            <h4 className="text-sm font-medium text-white">Open Claims</h4>
          </div>
          <div className="text-2xl font-bold text-teal-400 mb-1">{claimsData.open}</div>
          <div className="text-xs text-gray-400">Oldest: {claimsData.oldest}d</div>
          <div className="h-2 mt-2 flex gap-1">
            {claimsData.distribution.map((val, i) => (
              <div 
                key={i} 
                className="flex-1 bg-teal-500/30 rounded-sm"
                style={{ height: `${(val / Math.max(...claimsData.distribution)) * 100}%` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Zone Handoff Queues */}
        <motion.div
          className="glass-panel-deep p-4 cursor-pointer transition-all duration-300 group"
          whileHover={{ y: -4, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
          onClick={() => setShowHandoffDrawer(true)}
        >
          <div className="flex items-center mb-2">
            <Users size={16} className="text-blue-400 mr-2" />
            <h4 className="text-sm font-medium text-white">Handoff Queues</h4>
          </div>
          <div className="space-y-2">
            {handoffQueues.map((queue, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{queue.from}→{queue.to}</span>
                <span className="text-sm text-blue-400">{queue.count} ({queue.avgDays}d)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Entropy Index */}
        <motion.div
          className="glass-panel-deep p-4 cursor-pointer transition-all duration-300 group"
          whileHover={{ y: -4, boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}
          onClick={() => setShowEntropyModal(true)}
        >
          <div className="flex items-center mb-2">
            <Activity size={16} className="text-amber-400 mr-2" />
            <h4 className="text-sm font-medium text-white">Entropy Index</h4>
          </div>
          <div className="space-y-1">
            {Object.entries(entropyData).slice(0, 3).map(([zone, data]) => (
              <div key={zone} className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{zone}</span>
                <div className="flex items-center">
                  <span className="text-xs text-amber-400 mr-1">{data.value}</span>
                  {getTrendIcon(data.trend)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Workflow Handoff Status Chart (20% height) */}
      <motion.div 
        className="h-[20%] min-h-[80px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glass-panel-deep p-4 h-full">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Workflow Handoff Status</h4>
          <div className="space-y-3">
            {handoffQueues.map((queue, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">{queue.from} → {queue.to}</span>
                  <span className="text-xs text-blue-400">{queue.count} items</span>
                </div>
                <div className="h-4 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(queue.count / 10) * 100}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* System Alerts Feed (30% height) */}
      <motion.div 
        className="h-[30%] min-h-[150px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-panel-deep p-4 h-full">
          <div 
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => setAlertsExpanded(!alertsExpanded)}
          >
            <h4 className="text-sm font-medium text-gray-300">
              System Alerts ({systemAlerts.filter(a => a.severity === 'critical').length} 🔴, {systemAlerts.filter(a => a.severity === 'warning').length} 🟠, {systemAlerts.filter(a => a.severity === 'info').length} 🟢)
            </h4>
            <Button variant="ghost" size="sm" className="text-gray-400">
              {alertsExpanded ? '▼' : '▶'}
            </Button>
          </div>
          
          {alertsExpanded && (
            <ScrollArea className="h-[calc(100%-50px)]">
              <div className="space-y-2">
                {systemAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${getSeverityColor(alert.severity)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="text-sm font-medium">{alert.title}</h5>
                        <p className="text-xs text-gray-400 mt-1">{alert.cause}</p>
                      </div>
                      <div className="text-xs text-gray-400">{alert.timestamp}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleAlertInvestigate(alert)}
                      >
                        <Search size={12} className="mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        ⏸ Snooze
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </motion.div>

      {/* Risk Matrix (30% height) */}
      <motion.div 
        className="h-[30%] min-h-[150px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-panel-deep p-4 h-full">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Risk Matrix</h4>
          <div className="relative h-[calc(100%-40px)] grid grid-cols-2 gap-2">
            {/* Risk quadrants */}
            <div className="bg-green-500/10 rounded border border-green-500/20 p-2 flex items-center justify-center text-xs text-green-400">
              Low Impact<br/>Low Likelihood
            </div>
            <div className="bg-amber-500/10 rounded border border-amber-500/20 p-2 flex items-center justify-center text-xs text-amber-400">
              High Impact<br/>Low Likelihood
            </div>
            <div className="bg-orange-500/10 rounded border border-orange-500/20 p-2 flex items-center justify-center text-xs text-orange-400">
              Low Impact<br/>High Likelihood
            </div>
            <div className="bg-red-500/10 rounded border border-red-500/20 p-2 flex items-center justify-center text-xs text-red-400">
              High Impact<br/>High Likelihood
            </div>
            
            {/* Risk pins */}
            {riskMatrix.risks.map((risk, index) => (
              <Tooltip key={risk.id}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="absolute w-3 h-3 bg-teal-400 rounded-full cursor-pointer shadow-lg"
                    style={{
                      left: `${risk.likelihood * 50}%`,
                      top: `${(1 - risk.impact) * 50}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.5, boxShadow: '0 0 20px rgba(20, 184, 166, 0.6)' }}
                    onClick={() => handleAlertInvestigate({ ...risk, type: 'risk' })}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <div className="font-medium">{risk.name}</div>
                    <div className="text-xs">Likelihood: {risk.likelihood}, Impact: {risk.impact}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modals and Drawers */}
      <ClaimsModal 
        isOpen={showClaimsModal} 
        onClose={() => setShowClaimsModal(false)} 
        data={claimsData}
      />
      
      <HandoffDrawer 
        isOpen={showHandoffDrawer} 
        onClose={() => setShowHandoffDrawer(false)} 
        data={handoffQueues}
      />
      
      <EntropyModal 
        isOpen={showEntropyModal} 
        onClose={() => setShowEntropyModal(false)} 
        data={entropyData}
      />
      
      <AlertInvestigateModal 
        isOpen={showAlertModal} 
        onClose={() => setShowAlertModal(false)} 
        alert={selectedAlert}
      />
    </div>
  );
};
