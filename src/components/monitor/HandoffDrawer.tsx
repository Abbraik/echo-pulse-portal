
import React from 'react';
import { X, ArrowRight, Clock, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface HandoffDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
}

export const HandoffDrawer: React.FC<HandoffDrawerProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { t } = useTranslation();

  const mockKanbanItems = [
    {
      id: 1,
      title: 'Climate Adaptation Strategy',
      from: 'Think',
      to: 'Act',
      age: 3,
      sla: 'warning',
      type: 'bundle'
    },
    {
      id: 2,
      title: 'Infrastructure Assessment',
      from: 'Think',
      to: 'Act',
      age: 1,
      sla: 'good',
      type: 'task'
    },
    {
      id: 3,
      title: 'Performance Review',
      from: 'Act',
      to: 'Monitor',
      age: 2,
      sla: 'good',
      type: 'report'
    }
  ];

  const getSlaColor = (sla: string) => {
    switch (sla) {
      case 'good': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-amber-500/20 text-amber-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bundle': return '📦';
      case 'task': return '📋';
      case 'report': return '📊';
      default: return '📄';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg glass-panel-deep border-0">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            <Users size={20} className="inline mr-2" />
            Workflow Handoff Queue
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Queue Overview */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {data.map((queue, index) => (
              <div key={index} className="glass-panel p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {queue.from} → {queue.to}
                  </span>
                  <ArrowRight size={16} className="text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">{queue.count}</div>
                <div className="text-xs text-gray-400">Avg: {queue.avgDays} days</div>
              </div>
            ))}
          </motion.div>

          {/* Kanban Items */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-gray-200">Items in Queue</h3>
            
            {mockKanbanItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="glass-panel p-4 hover:scale-[1.02] transition-transform cursor-pointer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getTypeIcon(item.type)}</span>
                    <h4 className="text-sm font-medium text-white">{item.title}</h4>
                  </div>
                  <Badge className={getSlaColor(item.sla)}>
                    SLA {item.sla}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-400">
                    <Clock size={12} className="mr-1" />
                    {item.age} days in queue
                  </div>
                  <div className="flex items-center text-blue-400">
                    {item.from} <ArrowRight size={12} className="mx-1" /> {item.to}
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    View Context
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Escalate
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* SLA Summary */}
          <motion.div 
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-sm font-medium text-gray-300 mb-3">SLA Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-400">On Time</span>
                <span className="text-sm font-medium">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-400">At Risk</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-400">Overdue</span>
                <span className="text-sm font-medium">8%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
