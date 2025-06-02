
import React, { useState } from 'react';
import { X, BarChart3, Target, Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';

interface AlertInvestigateModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: any;
}

export const AlertInvestigateModal: React.FC<AlertInvestigateModalProps> = ({
  isOpen,
  onClose,
  alert
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('metrics');

  if (!alert) return null;

  // Mock data based on alert type
  const metricsData = [12, 8, 15, 6, 18, 9, 22, 14, 7, 25, 11, 19];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const loopImpacts = [
    { loop: 'Resource Management', coverage: 78, impact: 'medium' },
    { loop: 'Data Processing', coverage: 45, impact: 'high' },
    { loop: 'User Interface', coverage: 92, impact: 'low' },
    { loop: 'System Integration', coverage: 67, impact: 'medium' }
  ];

  const recommendations = [
    {
      id: 1,
      action: 'Restart data sync pipeline',
      impact: 'High',
      effort: 'Low',
      timeline: '15 minutes'
    },
    {
      id: 2,
      action: 'Rollback last bundle deployment',
      impact: 'Medium',
      effort: 'Medium',
      timeline: '2 hours'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-amber-500/20 text-amber-400';
      case 'info': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
              Alert Investigation: {alert.title || alert.name}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getSeverityColor(alert.severity)}>
                {alert.severity || 'risk'}
              </Badge>
              <span className="text-sm text-gray-400">
                {alert.timestamp || `Last seen: ${new Date().toLocaleString()}`}
              </span>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="loops">Loop Impact</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <motion.div 
              className="glass-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                {alert.type === 'risk' ? 'Risk Occurrence Frequency' : 'Failure Rate Over 6 Months'}
              </h3>
              <div className="h-48 relative">
                <svg width="100%" height="100%" className="overflow-visible">
                  {/* Chart bars */}
                  {metricsData.slice(0, 6).map((value, index) => (
                    <motion.rect
                      key={index}
                      x={`${(index / 6) * 100}%`}
                      y={`${100 - (value / Math.max(...metricsData) * 80)}%`}
                      width="12%"
                      height={`${(value / Math.max(...metricsData) * 80)}%`}
                      fill="rgba(239, 68, 68, 0.6)"
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / Math.max(...metricsData) * 80)}%` }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    />
                  ))}
                </svg>
                
                {/* Month labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-400">
                  {months.slice(6).map((month, i) => (
                    <span key={i}>{month}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="loops" className="space-y-4">
            <motion.div 
              className="glass-panel p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-medium text-gray-200 mb-4">Affected Loops & Coverage</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Loop</TableHead>
                    <TableHead className="text-gray-300">Coverage Ratio</TableHead>
                    <TableHead className="text-gray-300">Impact Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loopImpacts.map((loop, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <TableCell className="font-medium text-white">{loop.loop}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-teal-400 h-2 rounded-full"
                              style={{ width: `${loop.coverage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-300">{loop.coverage}%</span>
                        </div>
                      </TableCell>
                      <TableCell className={getImpactColor(loop.impact)}>
                        {loop.impact}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  className="glass-panel p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-white">{rec.action}</h4>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-green-500 to-teal-500"
                    >
                      Apply ▶
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Impact:</span>
                      <span className={`ml-2 ${getImpactColor(rec.impact.toLowerCase())}`}>
                        {rec.impact}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Effort:</span>
                      <span className={`ml-2 ${getImpactColor(rec.effort.toLowerCase())}`}>
                        {rec.effort}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Timeline:</span>
                      <span className="text-blue-400 ml-2">{rec.timeline}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            Acknowledge
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
