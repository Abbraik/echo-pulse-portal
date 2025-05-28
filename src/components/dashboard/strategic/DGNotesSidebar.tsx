
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Bell, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DGNotesSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  data?: {
    notes: string;
    whatsNew: Array<{
      id: string;
      title: string;
      type: 'recommendation' | 'flag' | 'update';
      timestamp: string;
      isNew: boolean;
    }>;
  };
}

export const DGNotesSidebar: React.FC<DGNotesSidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  data 
}) => {
  const [notes, setNotes] = useState(data?.notes || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock data if not provided
  const mockData = {
    notes: 'Review THINK zone restructure proposal by Friday.\n\nFollow up on EU partnership directive.\n\nSchedule one-on-one with ACT zone lead.',
    whatsNew: [
      { id: '1', title: 'New pattern detected in LEARN zone', type: 'recommendation' as const, timestamp: '1h ago', isNew: true },
      { id: '2', title: 'PSIU imbalance alert resolved', type: 'update' as const, timestamp: '2h ago', isNew: true },
      { id: '3', title: 'Resource optimization opportunity', type: 'flag' as const, timestamp: '3h ago', isNew: false },
    ]
  };

  const displayData = data || mockData;

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasUnsavedChanges(true);
  };

  const handleSaveNotes = () => {
    // Here you would save to backend
    setHasUnsavedChanges(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-500/20 text-blue-400';
      case 'flag': return 'bg-orange-500/20 text-orange-400';
      case 'update': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const newItemsCount = displayData.whatsNew.filter(item => item.isNew).length;

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '48px' : '300px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full relative"
    >
      <GlassCard className="h-full relative overflow-hidden">
        {/* Toggle Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggle}
          className="absolute top-4 -right-12 z-10 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20"
        >
          {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>

        <AnimatePresence>
          {isCollapsed ? (
            /* Collapsed State */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 h-full flex flex-col items-center space-y-4"
            >
              <div className="relative">
                <StickyNote size={24} className="text-gray-400" />
                {hasUnsavedChanges && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="relative">
                <Bell size={24} className="text-gray-400" />
                {newItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                    {newItemsCount}
                  </Badge>
                )}
              </div>
            </motion.div>
          ) : (
            /* Expanded State */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 h-full space-y-4"
            >
              {/* DG Notes */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-white/10 rounded">
                  <div className="flex items-center space-x-2">
                    <StickyNote size={16} className="text-teal-400" />
                    <span className="text-sm font-medium text-white">DG Notes</span>
                  </div>
                  {hasUnsavedChanges && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Add your personal notes and reminders..."
                    className="w-full h-32 p-2 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                  {hasUnsavedChanges && (
                    <Button size="sm" onClick={handleSaveNotes} className="w-full bg-teal-600 hover:bg-teal-700">
                      <Save size={14} className="mr-1" />
                      Save Notes
                    </Button>
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* What's New Feed */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-white/10 rounded">
                  <div className="flex items-center space-x-2">
                    <Bell size={16} className="text-teal-400" />
                    <span className="text-sm font-medium text-white">What's New</span>
                    {newItemsCount > 0 && (
                      <Badge className="h-5 w-5 p-0 text-xs bg-red-500 text-white">
                        {newItemsCount}
                      </Badge>
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {displayData.whatsNew.map((item) => (
                      <div key={item.id} className="p-2 bg-white/5 rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge className={getTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                          {item.isNew && (
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="text-sm text-white">{item.title}</div>
                        <div className="text-xs text-gray-400">{item.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};
