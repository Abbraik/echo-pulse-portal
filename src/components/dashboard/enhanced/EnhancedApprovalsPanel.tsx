
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Pin, Eye, Filter, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface EnhancedApprovalsPanelProps {
  data?: any;
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
  currentMode: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isExpanded?: boolean;
  isContracted?: boolean;
}

const EnhancedApprovalsPanel: React.FC<EnhancedApprovalsPanelProps> = ({ 
  data, 
  onViewModeChange,
  currentMode,
  isFullscreen = false,
  onToggleFullscreen,
  isExpanded = false,
  isContracted = false
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>(['1', '3']);

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
  const topItems = isContracted ? displayData.items.slice(0, 2) : displayData.items;
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

  // Dynamic sizing classes
  const getTextSize = () => {
    if (isContracted) return { heading: 'text-sm', body: 'text-xs', icon: 'h-3 w-3' };
    if (isExpanded) return { heading: 'text-lg', body: 'text-sm', icon: 'h-4 w-4' };
    return { heading: 'text-base', body: 'text-sm', icon: 'h-4 w-4' };
  };

  const textSizes = getTextSize();

  const getGridLayout = () => {
    if (isContracted) return 'grid-cols-1';
    if (isExpanded) return 'grid-cols-2 lg:grid-cols-4';
    return 'grid-cols-4';
  };

  if (isContracted) {
    return (
      <div className="p-3 h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h3 className={`font-bold text-blue-400 ${textSizes.heading}`}>Approvals</h3>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {/* Compact Summary */}
        <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
          <div className="bg-yellow-500/20 rounded p-1 text-center">
            <div className={`font-bold text-yellow-400 ${textSizes.body}`}>{displayData.pending}</div>
            <div className="text-gray-400 text-xs">Pending</div>
          </div>
          <div className="bg-red-500/20 rounded p-1 text-center">
            <div className={`font-bold text-red-400 ${textSizes.body}`}>{displayData.overdue}</div>
            <div className="text-gray-400 text-xs">Overdue</div>
          </div>
        </div>

        {/* Top 2 Items */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="space-y-1 h-full">
            {topItems.map((item: any) => (
              <div key={item.id} className="p-2 bg-white/5 rounded text-xs">
                <div className="font-medium text-white truncate mb-1">{item.title}</div>
                <div className="flex items-center justify-between">
                  <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                    {item.priority}
                  </Badge>
                  <span className="text-xs text-gray-400">{item.daysOut}d</span>
                </div>
              </div>
            ))}
            <Button size="sm" variant="ghost" className="w-full text-blue-400 text-xs mt-2">
              View More ▶
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full p-4 relative overflow-hidden flex flex-col`}>
      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <h3 className={`font-bold text-blue-400 ${textSizes.heading}`}>
            Approvals & Decisions
          </h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onToggleFullscreen && (
            <FullscreenButton
              isFullscreen={isFullscreen}
              onToggle={onToggleFullscreen}
            />
          )}
          <Button
            size="sm"
            variant={currentMode === 'approvals' ? 'default' : 'outline'}
            onClick={() => onViewModeChange(currentMode === 'approvals' ? 'full' : 'approvals')}
            className={`text-blue-400 text-xs h-7 ${isExpanded ? 'text-sm h-8' : ''}`}
          >
            <Eye size={textSizes.icon === 'h-3 w-3' ? 10 : 12} className="mr-1" />
            Focus
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className={`text-blue-400 h-7 ${isExpanded ? 'h-8' : ''}`}
          >
            {isDetailsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>

      {/* Decision Heatmap - Fixed */}
      <div className={`grid gap-2 mb-4 flex-shrink-0 ${getGridLayout()}`}>
        <div className={`bg-yellow-500/20 rounded-lg text-center ${isExpanded ? 'p-3' : 'p-2'}`}>
          <div className={`font-bold text-yellow-400 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
            {displayData.pending}
          </div>
          <div className={`text-gray-400 ${textSizes.body}`}>Pending</div>
        </div>
        <div className={`bg-red-500/20 rounded-lg text-center ${isExpanded ? 'p-3' : 'p-2'}`}>
          <div className={`font-bold text-red-400 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
            {displayData.overdue}
          </div>
          <div className={`text-gray-400 ${textSizes.body}`}>Overdue</div>
        </div>
        <div className={`bg-orange-500/20 rounded-lg text-center ${isExpanded ? 'p-3' : 'p-2'}`}>
          <div className={`font-bold text-orange-400 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
            {displayData.urgent}
          </div>
          <div className={`text-gray-400 ${textSizes.body}`}>Urgent</div>
        </div>
        <div className={`bg-blue-500/20 rounded-lg text-center ${isExpanded ? 'p-3' : 'p-2'}`}>
          <div className={`font-bold text-blue-400 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
            {pinnedItems.length}
          </div>
          <div className={`text-gray-400 ${textSizes.body}`}>Pinned</div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 flex-shrink-0 mb-3">
            <TabsTrigger value="all" className={textSizes.body}>All</TabsTrigger>
            <TabsTrigger value="strategy" className={textSizes.body}>Strategy</TabsTrigger>
            <TabsTrigger value="redesign" className={textSizes.body}>Redesign</TabsTrigger>
            <TabsTrigger value="external" className={textSizes.body}>External</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-2">
                {/* Pinned Items */}
                <AnimatePresence>
                  {pinnedItemsData.length > 0 && (
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className={`font-medium text-blue-400 flex items-center ${textSizes.body}`}>
                        <Pin size={12} className="mr-1" />
                        Pinned
                      </h4>
                      {pinnedItemsData.map((item: any) => (
                        <motion.div
                          key={item.id}
                          className={`rounded-lg hover:bg-white/20 transition-all group cursor-pointer ${isExpanded ? 'p-3 bg-white/10' : 'p-2 bg-white/10'}`}
                          whileHover={{ scale: 1.01 }}
                          layout
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`font-medium text-white truncate ${textSizes.body}`}>{item.title}</span>
                                <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                                  {item.priority}
                                </Badge>
                              </div>
                              <div className={`flex items-center space-x-3 text-xs text-gray-400`}>
                                <span className={getTypeColor(item.type)}>{item.type}</span>
                                <span className="truncate">{item.owner}</span>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
                              <Button size="sm" className={`bg-green-600 hover:bg-green-700 text-xs ${isExpanded ? 'h-7 px-3' : 'h-6 px-2'}`}>
                                Approve
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Priority Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium text-blue-400 ${textSizes.body}`}>Priority Items</h4>
                    <Button size="sm" variant="ghost" className={`text-xs text-blue-400 h-6 ${textSizes.body}`}>
                      View All ({displayData.items.length}) ▶
                    </Button>
                  </div>
                  {(isDetailsExpanded ? displayData.items : topItems).map((item: any) => (
                    <motion.div
                      key={item.id}
                      className={`rounded-lg hover:bg-white/10 transition-all group cursor-pointer ${isExpanded ? 'p-3 bg-white/5' : 'p-2 bg-white/5'}`}
                      whileHover={{ scale: 1.01 }}
                      layout
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-medium text-white truncate ${textSizes.body}`}>{item.title}</span>
                            <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                              {item.priority}
                            </Badge>
                            {item.daysOut < 0 && (
                              <Badge className="bg-red-500/20 text-red-400 text-xs">
                                {Math.abs(item.daysOut)}d overdue
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-400">
                            <span className={getTypeColor(item.type)}>{item.type}</span>
                            <span className="truncate">{item.owner}</span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
                          <Button size="sm" className={`bg-green-600 hover:bg-green-700 text-xs ${isExpanded ? 'h-7 px-3' : 'h-6 px-2'}`}>
                            Approve
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedApprovalsPanel;
