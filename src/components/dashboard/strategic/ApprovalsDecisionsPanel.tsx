import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Pin, Eye, Filter, ChevronDown, ChevronUp, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FullscreenButton } from '@/components/ui/fullscreen-button';

interface ApprovalsDecisionsPanelProps {
  data?: any;
  onFocusMode?: () => void;
  onContextualAction?: (action: string, itemTitle: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ApprovalsDecisionsPanel: React.FC<ApprovalsDecisionsPanelProps> = ({ 
  data, 
  onFocusMode, 
  onContextualAction,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [isCompact, setIsCompact] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>(['1', '3']);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentFitStatus, setContentFitStatus] = useState('');

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

  useEffect(() => {
    const checkContentFit = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const isOverflowing = container.scrollHeight > container.clientHeight || container.scrollWidth > container.clientWidth;
      setIsCompact(isOverflowing);
      setContentFitStatus(isOverflowing ? 'content-fit-compacted' : 'content-fit-perfect');
    };

    // Initial check and then re-check on window resize
    checkContentFit();
    window.addEventListener('resize', checkContentFit);

    return () => window.removeEventListener('resize', checkContentFit);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`approval-panel-container ${isCompact ? 'compact-mode' : ''} ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black/60' : 'h-full'
      }`}
      style={{ contentFitStatus }}
    >
      {isFullscreen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onToggleFullscreen} />
      )}
      
      <div className={`${
        isFullscreen 
          ? 'absolute inset-4 md:inset-8 bg-background/95 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden'
          : 'h-full'
      } glass-panel-deep relative flex flex-col`}>
        
        {/* Header - Fixed */}
        <div className="approval-header flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <h3 className="approval-title font-bold text-blue-400">
              Approvals & Decisions
            </h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="approval-small-text text-gray-400">Live</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onToggleFullscreen && (
              <FullscreenButton
                isFullscreen={isFullscreen}
                onToggle={onToggleFullscreen}
                className="approval-button"
              />
            )}
            {isFullscreen && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleFullscreen}
                className="approval-button text-gray-400 hover:text-white"
                aria-label="Close full-screen view"
              >
                <X size={16} />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="approval-button text-blue-400"
            >
              {isDetailsExpanded ? <ChevronUp className="approval-icon" /> : <ChevronDown className="approval-icon" />}
            </Button>
          </div>
        </div>

        {/* Decision Heatmap - Fixed */}
        <div className="flex items-center justify-around p-3 border-b border-white/10 compact-hide">
          <div className="text-center">
            <div className="approval-title text-yellow-400">{displayData.pending}</div>
            <div className="approval-small-text text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="approval-title text-red-400">{displayData.overdue}</div>
            <div className="approval-small-text text-gray-400">Overdue</div>
          </div>
          <div className="text-center">
            <div className="approval-title text-orange-400">{displayData.urgent}</div>
            <div className="approval-small-text text-gray-400">Urgent</div>
          </div>
        </div>

        {/* Filters - Pinned Section */}
        <div className="approval-filters flex items-center justify-between p-3 border-b border-white/10 compact-hide">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" className="approval-button text-blue-400">
              <Filter className="approval-icon" />
              Filters
            </Button>
            <Button size="sm" variant="ghost" className="approval-button text-blue-400">
              <Pin className="approval-icon" />
              Pinned
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="approval-button text-blue-400">
            <MoreHorizontal className="approval-icon" />
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="approval-main flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <TabsList className="approval-filters approval-transition grid w-full grid-cols-4 bg-white/10 flex-shrink-0">
              <TabsTrigger value="all" className="approval-button">All</TabsTrigger>
              <TabsTrigger value="strategy" className="approval-button compact-hide">Strategy</TabsTrigger>
              <TabsTrigger value="redesign" className="approval-button compact-hide">Redesign</TabsTrigger>
              <TabsTrigger value="external" className="approval-button compact-hide">External</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="approval-main-list approval-transition flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="approval-scrollbar space-y-3 p-3">
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
                        <h4 className="approval-small-text font-medium text-blue-400 flex items-center">
                          <Pin size={12} className="mr-1" />
                          Pinned
                        </h4>
                        {pinnedItemsData.map((item: any) => (
                          <motion.div
                            key={item.id}
                            className="approval-transition rounded-lg hover:bg-white/20 group cursor-pointer p-2"
                            whileHover={{ scale: 1.01 }}
                            layout
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="approval-text font-medium text-white truncate">{item.title}</span>
                                  <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                                    {item.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-3 text-xs text-gray-400">
                                  <span className={`${getTypeColor(item.type)} compact-hide`}>{item.type}</span>
                                  <span className="approval-small-text truncate compact-hide">{item.owner}</span>
                                </div>
                              </div>
                              <div className="approval-actions opacity-0 group-hover:opacity-100">
                                <Button 
                                  size="sm" 
                                  className="approval-button bg-green-600 hover:bg-green-700 text-xs"
                                  onClick={() => onContextualAction?.('approve', item.title)}
                                >
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
                      <h4 className="approval-small-text font-medium text-blue-400">Priority Items</h4>
                      <Button size="sm" variant="ghost" className="approval-button text-xs text-blue-400">
                        View All ({displayData.items.length}) ▶
                      </Button>
                    </div>
                    {(isDetailsExpanded ? displayData.items : topItems).map((item: any) => (
                      <motion.div
                        key={item.id}
                        className="approval-transition rounded-lg hover:bg-white/10 group cursor-pointer p-2"
                        whileHover={{ scale: 1.01 }}
                        layout
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="approval-text font-medium text-white truncate">{item.title}</span>
                              <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                                {item.priority}
                              </Badge>
                              {item.daysOut < 0 && (
                                <Badge className="bg-red-500/20 text-red-400 text-xs compact-hide">
                                  {Math.abs(item.daysOut)}d overdue
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              <span className={`${getTypeColor(item.type)} compact-hide`}>{item.type}</span>
                              <span className="approval-small-text truncate compact-hide">{item.owner}</span>
                            </div>
                          </div>
                          <div className="approval-actions opacity-0 group-hover:opacity-100">
                            <Button 
                              size="sm" 
                              className="approval-button bg-green-600 hover:bg-green-700 text-xs"
                              onClick={() => onContextualAction?.('approve', item.title)}
                            >
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
    </div>
  );
};
