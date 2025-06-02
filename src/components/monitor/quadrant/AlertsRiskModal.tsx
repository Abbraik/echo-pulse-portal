
import React, { useState } from 'react';
import { X, AlertTriangle, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface AlertsRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsRiskModal: React.FC<AlertsRiskModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  // Mock alerts data
  const alerts = [
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

  // Mock risk data
  const risks = [
    { name: 'Population Surge', likelihood: 0.7, impact: 0.8, id: 1 },
    { name: 'Extraction Over-Quota', likelihood: 0.5, impact: 0.4, id: 2 },
    { name: 'Loop Drift', likelihood: 0.3, impact: 0.6, id: 3 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'info': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRiskQuadrantColor = (likelihood: number, impact: number) => {
    if (likelihood > 0.5 && impact > 0.5) return 'bg-red-500/20';
    if (likelihood > 0.5 || impact > 0.5) return 'bg-amber-500/20';
    return 'bg-green-500/20';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl glass-panel-deep border-0 max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500">
            <AlertTriangle size={20} className="inline mr-2" />
            Alerts & Risk Matrix
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Feed */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">System Alerts</h3>
            <div className="glass-panel p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <Badge className="bg-red-500/20 text-red-400">3 Critical</Badge>
                  <Badge className="bg-amber-500/20 text-amber-400">5 Warning</Badge>
                  <Badge className="bg-green-500/20 text-green-400">10 Info</Badge>
                </div>
                <Button size="sm" variant="outline">
                  Acknowledge All ▶
                </Button>
              </div>
              
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${getSeverityColor(alert.severity)}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
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
                          onClick={() => setSelectedAlert(alert)}
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
            </div>
          </div>

          {/* Risk Matrix */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Risk Matrix</h3>
            <div className="glass-panel p-4">
              <div className="relative h-64 grid grid-cols-2 gap-2 mb-4">
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
                {risks.map((risk, index) => (
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
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Risk Items</h4>
                {risks.map((risk, index) => (
                  <motion.div
                    key={risk.id}
                    className="flex items-center justify-between p-2 rounded bg-gray-700/20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-sm text-gray-300">{risk.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        L:{risk.likelihood} I:{risk.impact}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${getRiskQuadrantColor(risk.likelihood, risk.impact)}`}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  Reassess Risk ▶
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
