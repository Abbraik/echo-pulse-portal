
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Pin, Eye, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EnhancedApprovalsPanelProps {
  data?: any;
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  currentMode: string;
}

const EnhancedApprovalsPanel: React.FC<EnhancedApprovalsPanelProps> = ({ 
  data, 
  onViewModeChange,
  currentMode 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>(['1', '3']); // Mock pinned items

  // Mock data
  const mockData = {
    pending: 12,
    overdue: 3,
    urgent: 2,
    items: [
      { id: '1', title: 'Infrastructure Development Package', type: 'strategy', owner: 'Planning Ministry', dueDate: '2024-02-15', priority: 'high', daysOut: 2 },
      { id: '2', title: 'Education Reform Bundle', type: 'strategy', owner: 'Education Ministry', dueDate: '2024-02-20', priority: 'medium', daysOut: 7 },
      { id: '3', title: 'THINK Zone Restructure', type: 'redesign', owner: 'Zone Lead Council', dueDate: '2024-02-10', priority: 'high', daysOut: -2 },
      { id: '4', title: 'EU Partnership Directive', type: 'external', owner: 'Foreign Affairs', dueDate: '2024-02-25', priority: 'medium', daysOut: 12 },
    ]
  };

  const displayData = data || mockData;
  const topItems = displayData.items.slice(0, 2);
  const pinnedItemsData = displayData.items.filter((item: any) => pinnedItems.includes(item.id));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategy': return 'text-blue-400';
      case 'redesign': return 'text-purple-400';
      case 'external': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <GlassCard 
      className="h-full p-6 relative"
      style={{ 
        background: 'rgba(59, 130, 246, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '2rem'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-blue-400">Approvals & Decisions</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live Updates</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={currentMode === 'approvals' ? 'default' : 'outline'}
            onClick={() => onViewModeChange(currentMode === 'approvals' ? 'full' : 'approvals')}
            className="text-blue-400"
          >
            <Eye size={14} className="mr-1" />
            Focus Mode
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>

      {/* Decision Heatmap */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-yellow-500/20 p-3 rounded-xl text-center">
          <div className="text-2xl font-bold text-yellow-400">{displayData.pending}</div>
          <div className="text-xs text-gray-400">Pending</div>
        </div>
        <div className="bg-red-500/20 p-3 rounded-xl text-center">
          <div className="text-2xl font-bold text-red-400">{displayData.overdue}</div>
          <div className="text-xs text-gray-400">Overdue</div>
        </div>
        <div className="bg-orange-500/20 p-3 rounded-xl text-center">
          <div className="text-2xl font-bold text-orange-400">{displayData.urgent}</div>
          <div className="text-xs text-gray-400">Urgent</div>
        </div>
        <div className="bg-blue-500/20 p-3 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-400">{pinnedItems.length}</div>
          <div className="text-xs text-gray-400">Pinned</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="strategy">Strategy</TabsTrigger>
          <TabsTrigger value="redesign">Redesign</TabsTrigger>
          <TabsTrigger value="external">External</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {/* Pinned Items */}
          {pinnedItemsData.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-400 flex items-center">
                <Pin size={14} className="mr-1" />
                Pinned Items
              </h4>
              {pinnedItemsData.map((item: any) => (
                <motion.div
                  key={item.id}
                  className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">{item.title}</span>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className={getTypeColor(item.type)}>{item.type}</span>
                        <span>{item.owner}</span>
                        <span>{item.dueDate}</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve ▶
                      </Button>
                      <Button size="sm" variant="outline" className="border-orange-500 text-orange-400">
                        Revise
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Top Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-blue-400">Priority Items</h4>
              <Button size="sm" variant="ghost" className="text-xs text-blue-400">
                View All ({displayData.items.length}) ▶
              </Button>
            </div>
            {(isExpanded ? displayData.items : topItems).map((item: any) => (
              <motion.div
                key={item.id}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{item.title}</span>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                      {item.daysOut < 0 && (
                        <Badge className="bg-red-500/20 text-red-400">
                          {Math.abs(item.daysOut)}d overdue
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className={getTypeColor(item.type)}>{item.type}</span>
                      <span>{item.owner}</span>
                      <span>{item.dueDate}</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Approve ▶
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500 text-orange-400">
                      Investigate ▶
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </GlassCard>
  );
};

export default EnhancedApprovalsPanel;
