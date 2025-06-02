
import React, { useState } from 'react';
import { X, AlertTriangle, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface AlertsRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsRiskModal: React.FC<AlertsRiskModalProps> = ({
  isOpen,
  onClose
}) => {
  const [draggedRisk, setDraggedRisk] = useState<string | null>(null);

  const mockAlerts = [
    { id: 1, severity: 'critical', title: 'Data sync lag with Act Zone', timestamp: '05-30 10:12', cause: 'Network latency spike' },
    { id: 2, severity: 'warning', title: 'Loop Inconsistency detected', timestamp: '05-30 09:48', cause: 'Model drift in Think Zone' },
    { id: 3, severity: 'info', title: 'Minor UI glitch in Learn Canvas', timestamp: '05-30 09:30', cause: 'Browser compatibility' }
  ];

  const mockRisks = [
    { id: 'population-surge', name: 'Population Surge', likelihood: 0.7, impact: 0.8, quadrant: 'high-high' },
    { id: 'extraction-quota', name: 'Extraction Over-Quota', likelihood: 0.5, impact: 0.4, quadrant: 'medium-low' },
    { id: 'loop-drift', name: 'Loop Drift', likelihood: 0.3, impact: 0.6, quadrant: 'low-medium' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-amber-500/20 text-amber-400';
      case 'info': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskPosition = (likelihood: number, impact: number) => {
    return {
      left: `${likelihood * 100}%`,
      bottom: `${impact * 100}%`
    };
  };

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'low-low': return 'bg-green-500/20';
      case 'low-medium': case 'medium-low': return 'bg-amber-500/20';
      case 'high-high': case 'high-low': case 'low-high': return 'bg-red-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
            <AlertTriangle size={20} className="inline mr-2" />
            Alerts & Risk Matrix
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">Alerts Feed</TabsTrigger>
            <TabsTrigger value="risk">Risk Matrix</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="mt-6">
            <motion.div 
              className="space-y-4 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {mockAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  className="glass-panel p-4 hover:scale-[1.02] transition-transform"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <h4 className="font-medium text-white">{alert.title}</h4>
                    </div>
                    <span className="text-xs text-gray-400">{alert.timestamp}</span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3">{alert.cause}</p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Investigate ▶
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Snooze ⏸
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="flex justify-center mt-6">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500">
                Acknowledge All ▶
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="mt-6">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Risk Matrix */}
              <div className="glass-panel p-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">Risk Matrix</h3>
                
                <div className="relative w-full h-80 border border-gray-600 rounded-lg overflow-hidden">
                  {/* Quadrants */}
                  <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-green-500/10 border-r border-b border-gray-600"></div>
                  <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-500/10 border-b border-gray-600"></div>
                  <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-500/10 border-r border-gray-600"></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-red-500/10 border-gray-600"></div>
                  
                  {/* Risk pins */}
                  {mockRisks.map((risk) => (
                    <motion.div
                      key={risk.id}
                      className="absolute w-4 h-4 bg-teal-400 rounded-full cursor-grab flex items-center justify-center"
                      style={getRiskPosition(risk.likelihood, risk.impact)}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.2 }}
                      title={`${risk.name}: L${risk.likelihood}, I${risk.impact}`}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </motion.div>
                  ))}
                  
                  {/* Axis labels */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                    Likelihood →
                  </div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-400">
                    Impact →
                  </div>
                </div>
              </div>

              {/* Risk List */}
              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Risk Registry</h4>
                <div className="space-y-2">
                  {mockRisks.map((risk) => (
                    <div key={risk.id} className="flex justify-between items-center text-sm">
                      <span className="text-white">{risk.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">L: {risk.likelihood}</span>
                        <span className="text-gray-400">I: {risk.impact}</span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Reassess
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
