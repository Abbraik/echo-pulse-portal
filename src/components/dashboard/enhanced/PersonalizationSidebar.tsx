
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Settings, Eye, EyeOff, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PersonalizationSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  data?: any;
  viewMode: 'full' | 'approvals' | 'health';
  onViewModeChange: (mode: 'full' | 'approvals' | 'health') => void;
}

const PersonalizationSidebar: React.FC<PersonalizationSidebarProps> = ({
  isCollapsed,
  onToggle,
  data,
  viewMode,
  onViewModeChange
}) => {
  const [notes, setNotes] = useState('Review THINK zone restructure proposal by Friday.\n\nFollow up on EU partnership directive.\n\nSchedule one-on-one with ACT zone lead.');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasUnsavedChanges(true);
  };

  const handleSaveNotes = () => {
    setHasUnsavedChanges(false);
  };

  const mockWhatsNew = [
    { id: '1', title: 'New pattern detected in LEARN zone', type: 'recommendation', time: '1h ago', isNew: true },
    { id: '2', title: 'PSIU imbalance alert resolved', type: 'update', time: '2h ago', isNew: true },
    { id: '3', title: 'Resource optimization opportunity', type: 'flag', time: '3h ago', isNew: false },
  ];

  const newItemsCount = mockWhatsNew.filter(item => item.isNew).length;

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '64px' : '320px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative"
    >
      {/* Toggle Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggle}
        className="absolute top-4 -left-12 z-10 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20"
      >
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </Button>

      <GlassCard 
        className="h-full relative overflow-hidden"
        style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '2rem'
        }}
      >
        <AnimatePresence>
          {isCollapsed ? (
            /* Collapsed State */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 h-full flex flex-col items-center space-y-6"
            >
              {/* Quick Access Presets */}
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant={viewMode === 'full' ? 'default' : 'ghost'}
                  onClick={() => onViewModeChange('full')}
                  className="w-12 h-12 p-0"
                  title="Full View"
                >
                  <Eye size={20} />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'approvals' ? 'default' : 'ghost'}
                  onClick={() => onViewModeChange('approvals')}
                  className="w-12 h-12 p-0 bg-blue-500/20 text-blue-400"
                  title="Approvals Only"
                >
                  A
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'health' ? 'default' : 'ghost'}
                  onClick={() => onViewModeChange('health')}
                  className="w-12 h-12 p-0 bg-teal-500/20 text-teal-400"
                  title="Health Only"
                >
                  H
                </Button>
              </div>

              {/* Notes Indicator */}
              <div className="relative">
                <StickyNote size={24} className="text-gray-400" />
                {hasUnsavedChanges && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* What's New Indicator */}
              <div className="relative">
                <Settings size={24} className="text-gray-400" />
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
              className="p-6 h-full space-y-6 overflow-y-auto"
            >
              {/* Quick Access Presets */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white">Quick Access</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === 'full' ? 'default' : 'ghost'}
                    onClick={() => onViewModeChange('full')}
                    className="justify-start"
                  >
                    <Eye size={16} className="mr-2" />
                    Full View
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'approvals' ? 'default' : 'ghost'}
                    onClick={() => onViewModeChange('approvals')}
                    className="justify-start bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  >
                    <span className="mr-2">📋</span>
                    Approvals Only
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'health' ? 'default' : 'ghost'}
                    onClick={() => onViewModeChange('health')}
                    className="justify-start bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
                  >
                    <span className="mr-2">💚</span>
                    Health Only
                  </Button>
                </div>
              </div>

              {/* DG Notes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white flex items-center">
                    <StickyNote size={16} className="mr-2 text-teal-400" />
                    DG Notes
                  </h4>
                  {hasUnsavedChanges && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Add your personal notes and reminders..."
                  className="w-full h-32 p-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                
                {hasUnsavedChanges && (
                  <Button size="sm" onClick={handleSaveNotes} className="w-full bg-teal-600 hover:bg-teal-700">
                    <Save size={14} className="mr-1" />
                    Save Notes
                  </Button>
                )}
              </div>

              {/* What's New */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white flex items-center">
                    <Settings size={16} className="mr-2 text-teal-400" />
                    What's New
                  </h4>
                  {newItemsCount > 0 && (
                    <Badge className="h-5 w-5 p-0 text-xs bg-red-500 text-white">
                      {newItemsCount}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockWhatsNew.map((item) => (
                    <div key={item.id} className="p-3 bg-white/5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={
                          item.type === 'recommendation' ? 'bg-blue-500/20 text-blue-400' :
                          item.type === 'flag' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-green-500/20 text-green-400'
                        }>
                          {item.type}
                        </Badge>
                        {item.isNew && (
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="text-sm text-white">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
};

export default PersonalizationSidebar;
