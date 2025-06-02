
import React from 'react';
import { X, ArrowRight, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';

interface BundleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bundle: any;
}

export const BundleDetailModal: React.FC<BundleDetailModalProps> = ({
  isOpen,
  onClose,
  bundle
}) => {
  const { t } = useTranslation();

  if (!bundle) return null;

  // Mock sub-indicators data
  const subIndicators = [
    { name: 'Population Development', baseline: 0.8, current: 0.3, target: 0.5, delta: -0.5 },
    { name: 'Resource Stock Ratio', baseline: 0.85, current: 0.92, target: 0.90, delta: 0.07 },
    { name: 'Infrastructure Quality', baseline: 65, current: 72, target: 75, delta: 7 },
    { name: 'Service Accessibility', baseline: 70, current: 78, target: 80, delta: 8 },
    { name: 'Environmental Impact', baseline: 3.2, current: 2.8, target: 2.5, delta: -0.4 }
  ];

  const loopImpacts = [
    { loop: 'Infrastructure Development', coverage: 85 },
    { loop: 'Resource Management', coverage: 72 },
    { loop: 'Social Services', coverage: 90 },
    { loop: 'Economic Growth', coverage: 68 },
    { loop: 'Environmental Balance', coverage: 78 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              {bundle.name} Bundle Details
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Badge className={bundle.status === 'on-track' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                {bundle.status === 'on-track' ? 'On Track' : 'At Risk'}
              </Badge>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Promote to Learn ▶
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div 
              className="glass-panel p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-sm font-medium text-gray-300 mb-2">KPI Success Rate</h4>
              <div className="text-2xl font-bold text-teal-400 mb-2">{bundle.success}%</div>
              <Progress value={bundle.success} className="h-2" />
            </motion.div>
            
            <motion.div 
              className="glass-panel p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-sm font-medium text-gray-300 mb-2">ROI Performance</h4>
              <div className="text-2xl font-bold text-green-400 mb-2">+{bundle.roi}%</div>
              <div className="text-xs text-gray-400">vs baseline projection</div>
            </motion.div>
            
            <motion.div 
              className="glass-panel p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-sm font-medium text-gray-300 mb-2">Time to Deploy</h4>
              <div className="text-2xl font-bold text-blue-400 mb-2">{bundle.time}</div>
              <div className="text-xs text-gray-400">months remaining</div>
            </motion.div>
          </div>

          {/* Sub-Indicators Table */}
          <motion.div 
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-medium text-gray-200 mb-4">Sub-Indicators Performance</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Indicator</TableHead>
                  <TableHead className="text-gray-300">Baseline</TableHead>
                  <TableHead className="text-gray-300">Current</TableHead>
                  <TableHead className="text-gray-300">Target</TableHead>
                  <TableHead className="text-gray-300">Δ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subIndicators.map((indicator, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <TableCell className="font-medium text-white">{indicator.name}</TableCell>
                    <TableCell className="text-gray-300">{indicator.baseline}</TableCell>
                    <TableCell className="text-white">{indicator.current}</TableCell>
                    <TableCell className="text-gray-300">{indicator.target}</TableCell>
                    <TableCell className={indicator.delta > 0 ? 'text-green-400' : 'text-red-400'}>
                      {indicator.delta > 0 ? '+' : ''}{indicator.delta}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Loop Impact Chart */}
          <motion.div 
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-medium text-gray-200 mb-4">Loop Impact Coverage</h3>
            <div className="space-y-3">
              {loopImpacts.map((loop, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 flex-1">{loop.loop}</span>
                  <div className="flex items-center flex-1 mx-4">
                    <Progress value={loop.coverage} className="h-2 flex-1" />
                  </div>
                  <span className="text-sm font-medium text-teal-400 w-12">{loop.coverage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <TrendingUp size={14} className="mr-2" />
            Refine Strategy ▶
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
