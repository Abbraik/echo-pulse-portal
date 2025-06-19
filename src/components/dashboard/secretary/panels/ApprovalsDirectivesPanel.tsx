
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Pin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import PanelHeader from '../shared/PanelHeader';

interface ApprovalsDirectivesPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isHovered: boolean;
}

const mockItems = [
  {
    id: '1',
    title: 'Infrastructure Development Package',
    type: 'strategy',
    createdBy: 'Planning Ministry',
    dueIn: '2 days',
    priority: 'high',
    pinned: true
  },
  {
    id: '2',
    title: 'Education Reform Bundle',
    type: 'directive',
    createdBy: 'Education Ministry',
    dueIn: '5 days',
    priority: 'medium',
    pinned: false
  },
  {
    id: '3',
    title: 'Emergency Response Protocol',
    type: 'escalation',
    createdBy: 'Crisis Management',
    dueIn: 'Overdue',
    priority: 'critical',
    pinned: true
  }
];

const ApprovalsDirectivesPanel: React.FC<ApprovalsDirectivesPanelProps> = ({
  isFullscreen,
  onToggleFullscreen,
  isHovered
}) => {
  const [pinnedItems, setPinnedItems] = useState<string[]>(['1', '3']);
  const [selectedTab, setSelectedTab] = useState('approvals');

  const togglePin = (itemId: string) => {
    setPinnedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return <FileText size={14} className="text-blue-400" />;
      case 'directive': return <AlertCircle size={14} className="text-orange-400" />;
      case 'escalation': return <Clock size={14} className="text-red-400" />;
      default: return <FileText size={14} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Approvals & Directives"
        subtitle="Decision Gateway"
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div className="flex-1 p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-4">
            <TabsTrigger value="approvals" className="text-xs">Approvals</TabsTrigger>
            <TabsTrigger value="directives" className="text-xs">Directives</TabsTrigger>
            <TabsTrigger value="escalations" className="text-xs">Escalations</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {mockItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 group"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 12px rgba(0,255,195,0.5)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        {getTypeIcon(item.type)}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-white text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-gray-400">{item.createdBy}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => togglePin(item.id)}
                        className={`h-6 w-6 p-0 ${pinnedItems.includes(item.id) ? 'text-teal-400' : 'text-gray-400'}`}
                      >
                        <Pin size={12} />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                        <span className="text-xs text-gray-400">Due: {item.dueIn}</span>
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-xs h-6 px-2">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-6 px-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/20">
                          Revise
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApprovalsDirectivesPanel;
