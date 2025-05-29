import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, AlertTriangle, CheckCircle, MessageCircle, Filter, Star, ChevronUp, ChevronDown, Plus, ExternalLink, X, Focus, Edit, Users, Activity, TrendingUp, Brain, Zap, Eye, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ApprovalItem {
  id: string;
  title: string;
  type: 'strategy' | 'redesign' | 'external';
  owner: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  isPinned: boolean;
}

interface ApprovalsDecisionsPanelProps {
  data?: {
    items: ApprovalItem[];
  };
  onFocusMode?: (isFocused: boolean) => void;
  onContextualAction?: (action: string, itemTitle: string) => void;
}

export const ApprovalsDecisionsPanel: React.FC<ApprovalsDecisionsPanelProps> = ({ 
  data, 
  onFocusMode,
  onContextualAction 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Extended mock data with 10 items
  const initialItems: ApprovalItem[] = [
    { 
      id: '1', 
      title: 'Infrastructure Development Package', 
      type: 'strategy', 
      owner: 'Planning Ministry', 
      dueDate: '2025-06-02', 
      priority: 'high', 
      isPinned: false 
    },
    { 
      id: '2', 
      title: 'Climate Resilience Framework', 
      type: 'redesign', 
      owner: 'Environment Department', 
      dueDate: '2025-05-30', 
      priority: 'medium', 
      isPinned: true 
    },
    { 
      id: '3', 
      title: 'EU Partnership Directive', 
      type: 'external', 
      owner: 'Foreign Affairs', 
      dueDate: '2025-06-05', 
      priority: 'low', 
      isPinned: false 
    },
    { 
      id: '4', 
      title: 'Education Reform Bundle', 
      type: 'strategy', 
      owner: 'Education Ministry', 
      dueDate: '2025-06-10', 
      priority: 'medium', 
      isPinned: false 
    },
    { 
      id: '5', 
      title: 'Urban Housing Mandate', 
      type: 'redesign', 
      owner: 'Housing Authority', 
      dueDate: '2025-05-28', 
      priority: 'high', 
      isPinned: false 
    },
    { 
      id: '6', 
      title: 'Digital ID Rollout', 
      type: 'external', 
      owner: 'Interior Ministry', 
      dueDate: '2025-06-15', 
      priority: 'low', 
      isPinned: false 
    },
    { 
      id: '7', 
      title: 'Health Data Integration', 
      type: 'strategy', 
      owner: 'Health Ministry', 
      dueDate: '2025-06-08', 
      priority: 'high', 
      isPinned: false 
    },
    { 
      id: '8', 
      title: 'Water Sustainability Act', 
      type: 'redesign', 
      owner: 'Water Authority', 
      dueDate: '2025-06-12', 
      priority: 'medium', 
      isPinned: false 
    },
    { 
      id: '9', 
      title: 'Smart Mobility Plan', 
      type: 'strategy', 
      owner: 'Transport Department', 
      dueDate: '2025-06-20', 
      priority: 'medium', 
      isPinned: false 
    },
    { 
      id: '10', 
      title: 'Cybersecurity Protocol', 
      type: 'external', 
      owner: 'Tech Authority', 
      dueDate: '2025-06-18', 
      priority: 'low', 
      isPinned: false 
    }
  ];

  // State
  const [items, setItems] = useState<ApprovalItem[]>(data?.items || initialItems);
  const [activeFilter, setActiveFilter] = useState<'all' | 'strategy' | 'redesign' | 'external'>('all');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Modal states
  const [approveModal, setApproveModal] = useState<{ open: boolean; item: ApprovalItem | null }>({
    open: false,
    item: null
  });
  const [reviseModal, setReviseModal] = useState<{ open: boolean; item: ApprovalItem | null }>({
    open: false,
    item: null
  });
  const [createModal, setCreateModal] = useState(false);

  // Revision form state
  const [revisionForm, setRevisionForm] = useState({
    comment: '',
    to: '',
    urgency: 'normal' as 'immediate' | 'high' | 'normal'
  });

  // New item form
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'strategy' as ApprovalItem['type'],
    owner: '',
    dueDate: '',
    priority: 'medium' as ApprovalItem['priority']
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          document.getElementById('filter-all')?.focus();
          break;
        case 'p':
          if (selectedRowId) {
            e.preventDefault();
            handlePin(selectedRowId);
          }
          break;
        case 'a':
          if (selectedRowId) {
            e.preventDefault();
            const item = items.find(i => i.id === selectedRowId);
            if (item) handleApproveClick(item);
          }
          break;
        case 'r':
          if (selectedRowId) {
            e.preventDefault();
            const item = items.find(i => i.id === selectedRowId);
            if (item) handleReviseClick(item);
          }
          break;
        case 'escape':
          e.preventDefault();
          setApproveModal({ open: false, item: null });
          setReviseModal({ open: false, item: null });
          setCreateModal(false);
          setSelectedRowId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRowId, items]);

  // Filter logic
  const filteredItems = items.filter(item => 
    activeFilter === 'all' || item.type === activeFilter
  );

  const pinnedItems = filteredItems.filter(item => item.isPinned);
  const unpinnedItems = filteredItems.filter(item => !item.isPinned);

  // Filter counts
  const filterCounts = {
    all: items.length,
    strategy: items.filter(item => item.type === 'strategy').length,
    redesign: items.filter(item => item.type === 'redesign').length,
    external: items.filter(item => item.type === 'external').length,
  };

  // Action handlers
  const handleFilterChange = (filter: typeof activeFilter) => {
    setActiveFilter(filter);
  };

  const handlePin = async (id: string) => {
    setLoading(id);
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      );
      
      const item = prevItems.find(i => i.id === id);
      toast({
        title: item?.isPinned ? "Item Unpinned" : "Item Pinned",
        description: `${item?.title} ${item?.isPinned ? 'removed from' : 'added to'} pinned items.`,
        duration: 3000,
      });
      
      return updatedItems;
    });
    
    setLoading(null);
  };

  const handleApproveClick = (item: ApprovalItem) => {
    setApproveModal({ open: true, item });
  };

  const handleApproveConfirm = async () => {
    if (approveModal.item) {
      setLoading(approveModal.item.id);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => prevItems.filter(item => item.id !== approveModal.item!.id));
      
      toast({
        title: "Approved!",
        description: `${approveModal.item.title} approved and pipeline updated.`,
        duration: 3000,
      });

      // Trigger contextual action
      onContextualAction?.('approve', approveModal.item.title);
      
      setApproveModal({ open: false, item: null });
      setSelectedRowId(null);
      setLoading(null);
    }
  };

  const handleReviseClick = (item: ApprovalItem) => {
    setRevisionForm({
      comment: '',
      to: item.owner,
      urgency: 'normal'
    });
    setReviseModal({ open: true, item });
  };

  const handleReviseSubmit = async () => {
    if (reviseModal.item && revisionForm.comment.trim()) {
      setLoading(reviseModal.item.id);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Revision Sent",
        description: `Revision request sent to ${revisionForm.to}.`,
        duration: 3000,
      });
      
      setReviseModal({ open: false, item: null });
      setSelectedRowId(null);
      setLoading(null);
    }
  };

  const handleCreateNew = async () => {
    if (newItem.title && newItem.owner && newItem.dueDate) {
      setLoading('create');
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const item: ApprovalItem = {
        id: Date.now().toString(),
        ...newItem,
        isPinned: false
      };
      
      setItems(prevItems => [...prevItems, item]);
      
      toast({
        title: "Approval Created",
        description: `${newItem.title} has been added to the approval list.`,
        duration: 3000,
      });
      
      setCreateModal(false);
      setNewItem({
        title: '',
        type: 'strategy',
        owner: '',
        dueDate: '',
        priority: 'medium'
      });
      setLoading(null);
    }
  };

  // Helper functions
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return <FileText size={16} className="text-blue-400" />;
      case 'redesign': return <AlertTriangle size={16} className="text-purple-400" />;
      case 'external': return <MessageCircle size={16} className="text-orange-400" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategy': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'redesign': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'external': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟠';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const ActionButton = ({ 
    children, 
    onClick, 
    disabled, 
    variant = "default",
    size = "sm",
    className = ""
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "default";
    className?: string;
  }) => (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );

  const handleZoneNavigation = (zone: string) => {
    if (approveModal.item) {
      setApproveModal({ open: false, item: null });
      navigate(`/${zone.toLowerCase()}`);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col p-6">
        {/* Title Bar */}
        <div className="flex items-center justify-between h-12 mb-6 border-b border-teal-500/30 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white">
              Approvals & Decisions
            </h3>
            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50 text-sm">
              Live
            </Badge>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex gap-2 mb-6">
          {Object.entries(filterCounts).map(([filter, count]) => (
            <Button
              key={filter}
              id={filter === 'all' ? 'filter-all' : undefined}
              size="sm"
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => handleFilterChange(filter as typeof activeFilter)}
              className={`text-sm transition-all duration-150 ${
                activeFilter === filter 
                  ? 'bg-teal-500 text-white border-teal-500' 
                  : 'border-teal-500/50 text-teal-400 hover:bg-teal-500/20 hover:border-teal-500'
              }`}
              aria-pressed={activeFilter === filter}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
            </Button>
          ))}
        </div>

        {/* Pinned Approvals Section */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-teal-400 mb-3 flex items-center gap-2">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            Pinned Approvals
          </h4>
          {pinnedItems.length > 0 ? (
            <div className="space-y-2">
              {pinnedItems.slice(0, 3).map(item => (
                <motion.div 
                  key={item.id} 
                  className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleApproveClick(item)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="font-medium text-white text-sm truncate">{item.title}</span>
                    <Badge className={`${getTypeColor(item.type)} text-sm shrink-0`}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </Badge>
                    <span className="text-sm text-gray-400 shrink-0">{item.dueDate}</span>
                    <span className={`text-sm ${getPriorityColor(item.priority)} shrink-0`}>
                      {getPriorityDot(item.priority)} {item.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ActionButton
                      onClick={() => handlePin(item.id)}
                      disabled={loading === item.id}
                      variant="ghost"
                      className="text-yellow-400 p-1 h-6 w-6"
                    >
                      <Star size={12} fill="currentColor" />
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleApproveClick(item)}
                      disabled={loading === item.id}
                      className="h-6 px-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle size={10} className="mr-1" />
                      Approve ▶
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleReviseClick(item)}
                      disabled={loading === item.id}
                      variant="outline"
                      className="h-6 px-2 text-sm border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                    >
                      <Edit size={10} className="mr-1" />
                      Revise ✎
                    </ActionButton>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
              <p className="text-gray-400 text-sm">No pinned approvals. Pin key items for quick access.</p>
            </div>
          )}
        </div>

        {/* Main Approval List */}
        <div className="flex-1 min-h-0 overflow-y-auto mb-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-transparent">
                <TableHead className="text-white w-[40%]">Title</TableHead>
                <TableHead className="text-white w-[10%]">Type</TableHead>
                <TableHead className="text-white w-[20%]">Owner</TableHead>
                <TableHead className="text-white w-[15%]">Due Date</TableHead>
                <TableHead className="text-white w-[10%]">Priority</TableHead>
                <TableHead className="text-white w-[5%]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpinnedItems.map((item) => (
                <TableRow 
                  key={item.id}
                  className="border-white/10 hover:bg-white/5 transition-all duration-150 cursor-pointer"
                  onClick={() => {
                    setSelectedRowId(item.id);
                    handleApproveClick(item);
                  }}
                  onMouseEnter={() => setHoveredRowId(item.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  style={{
                    backgroundColor: selectedRowId === item.id ? 'rgba(20, 184, 166, 0.1)' : undefined,
                    borderLeft: selectedRowId === item.id ? '3px solid rgb(20, 184, 166)' : undefined
                  }}
                >
                  <TableCell className="font-medium text-white text-sm">{item.title}</TableCell>
                  <TableCell>
                    <Badge className={`${getTypeColor(item.type)} text-sm`}>
                      <span className="flex items-center gap-1">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{item.owner}</TableCell>
                  <TableCell className="text-gray-300 text-sm">{item.dueDate}</TableCell>
                  <TableCell className="text-sm">
                    <span className={`flex items-center gap-1 ${getPriorityColor(item.priority)}`}>
                      {getPriorityDot(item.priority)} {item.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 transition-opacity duration-200 ${
                      hoveredRowId === item.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <ActionButton
                        onClick={() => handlePin(item.id)}
                        disabled={loading === item.id}
                        variant="ghost"
                        className="text-gray-400 hover:text-yellow-400 p-1 h-6 w-6"
                      >
                        <Star size={12} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleApproveClick(item)}
                        disabled={loading === item.id}
                        className="h-6 px-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve ▶
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleReviseClick(item)}
                        disabled={loading === item.id}
                        variant="outline"
                        className="h-6 px-2 text-sm border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                      >
                        Revise ✎
                      </ActionButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 h-10">
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-400 hover:text-teal-300 text-sm"
          >
            View All Approvals ▶ <ExternalLink size={12} className="ml-1" />
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold h-8"
          >
            <Plus size={14} className="mr-1" />
            Create New Approval
          </Button>
        </div>
      </div>

      {/* Enhanced Approve Details Modal */}
      <Dialog open={approveModal.open} onOpenChange={(open) => setApproveModal({ open, item: null })}>
        <DialogContent 
          className="max-w-none w-[80vw] h-[80vh] p-0 bg-transparent border-0 shadow-none overflow-hidden"
          aria-modal="true"
        >
          {/* Modal Backdrop */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
          
          {/* Glass Panel */}
          <div className="relative w-full h-full bg-white/20 backdrop-blur-xl border border-teal-500/30 rounded-2xl shadow-2xl shadow-teal-500/20 flex flex-col">
            
            {/* Header (10% height) */}
            <div className="h-[10%] flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">
                  {approveModal.item?.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {approveModal.item && (
                  <>
                    <Badge className={getTypeColor(approveModal.item.type)}>
                      {getTypeIcon(approveModal.item.type)}
                      <span className="ml-1">{approveModal.item.type}</span>
                    </Badge>
                    <span className={`text-sm ${getPriorityColor(approveModal.item.priority)}`}>
                      {getPriorityDot(approveModal.item.priority)} {approveModal.item.priority}
                    </span>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setApproveModal({ open: false, item: null })}
                  className="text-white hover:bg-white/10 p-2"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>

            {/* Body (75% height) - Two Column Grid */}
            <div className="h-[75%] overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-6 h-full">
                
                {/* Left Column */}
                <div className="space-y-6">
                  
                  {/* Think Context */}
                  <motion.div 
                    className="p-4 bg-white/10 rounded-xl border border-blue-500/30 hover:border-blue-500/60 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                        <Brain size={20} />
                        Think Context
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleZoneNavigation('think')}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        Go to Think
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Scenario Overview</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <div>Selected: Sustainable Growth</div>
                          <div>Created: 2025-05-15</div>
                          <div className="flex items-center gap-2">
                            <span>Target DEI:</span>
                            <span className="text-green-400">85.2</span>
                            <span>vs Current:</span>
                            <span className="text-orange-400">78.5</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Loop Analysis</h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Infrastructure Loop:</span>
                            <span className="text-green-400">92%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Resource Loop:</span>
                            <span className="text-orange-400">78%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Policy Loop:</span>
                            <span className="text-red-400">65%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Act Context */}
                  <motion.div 
                    className="p-4 bg-white/10 rounded-xl border border-blue-400/30 hover:border-blue-400/60 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                        <Zap size={20} />
                        Act Context
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleZoneNavigation('act')}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Go to Act
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Bundle Details</h4>
                        <div className="text-sm text-gray-300 space-y-1">
                          <div>Bundle: Strategic Infrastructure 2025</div>
                          <div>Objectives: 8 active, 3 completed</div>
                          <div className="flex items-center gap-2">
                            <span>Success Rate:</span>
                            <span className="text-green-400">85%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">KPIs</h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>ROI:</span>
                            <span className="text-green-400">245%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time to Deploy:</span>
                            <span className="text-orange-400">3.2 months</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  
                  {/* Monitor Context */}
                  <motion.div 
                    className="p-4 bg-white/10 rounded-xl border border-teal-500/30 hover:border-teal-500/60 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-teal-400 flex items-center gap-2">
                        <Eye size={20} />
                        Monitor Context
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleZoneNavigation('monitor')}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        Go to Monitor
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Recent Alerts</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={12} className="text-red-400" />
                            <span>Resource constraint detected</span>
                            <span className="text-xs text-gray-400">2h ago</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={12} className="text-orange-400" />
                            <span>Stakeholder feedback pending</span>
                            <span className="text-xs text-gray-400">4h ago</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={12} className="text-yellow-400" />
                            <span>Timeline variance +5 days</span>
                            <span className="text-xs text-gray-400">1d ago</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Live Metrics</h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>DEI Score:</span>
                            <span className="text-green-400">78.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Trust Index:</span>
                            <span className="text-orange-400">82.1</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Migration Flow:</span>
                            <span className="text-blue-400">+2.3%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Learn Context */}
                  <motion.div 
                    className="p-4 bg-white/10 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                        <BookOpen size={20} />
                        Learn Context
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleZoneNavigation('learn')}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        Go to Learn
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Relevant Lessons</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>
                            <div className="flex justify-between">
                              <span>Infrastructure Planning Playbook</span>
                              <span className="text-green-400">94%</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <span>Multi-Stakeholder Coordination</span>
                              <span className="text-orange-400">78%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Innovate Context */}
                  <motion.div 
                    className="p-4 bg-white/10 rounded-xl border border-yellow-500/30 hover:border-yellow-500/60 transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                        <Lightbulb size={20} />
                        Innovate Context
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => handleZoneNavigation('innovate')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Go to Innovate
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Active Experiments</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>
                            <div className="flex justify-between items-center">
                              <span>Smart City Infrastructure</span>
                              <Badge className="bg-green-500/20 text-green-400 text-xs">Prototype</Badge>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center">
                              <span>Adaptive Policy Framework</span>
                              <Badge className="bg-orange-500/20 text-orange-400 text-xs">Testing</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Footer (15% height) */}
            <div className="h-[15%] flex items-center justify-end gap-4 p-6 border-t border-white/10">
              <Button 
                variant="ghost" 
                onClick={() => setApproveModal({ open: false, item: null })}
                disabled={loading === approveModal.item?.id}
                className="text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApproveConfirm} 
                disabled={loading === approveModal.item?.id}
                className="bg-teal-500 hover:bg-teal-600 text-white h-12 px-8 text-lg font-bold"
              >
                {loading === approveModal.item?.id ? 'Confirming...' : 'Confirm Approval'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revise Modal */}
      <Dialog open={reviseModal.open} onOpenChange={(open) => setReviseModal({ open, item: null })}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl" aria-modal="true">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Request Revision</DialogTitle>
            <DialogDescription className="text-gray-300">
              Provide feedback for "{reviseModal.item?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment" className="text-white">Comment *</Label>
              <Textarea
                id="comment"
                value={revisionForm.comment}
                onChange={(e) => setRevisionForm({...revisionForm, comment: e.target.value})}
                className="bg-white/10 border-white/20 text-white mt-1"
                placeholder="Provide feedback for sender..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="to" className="text-white">To</Label>
              <Input
                id="to"
                value={revisionForm.to}
                onChange={(e) => setRevisionForm({...revisionForm, to: e.target.value})}
                className="bg-white/10 border-white/20 text-white mt-1"
              />
            </div>
            <div>
              <Label htmlFor="urgency" className="text-white">Urgency</Label>
              <Select value={revisionForm.urgency} onValueChange={(value) => setRevisionForm({...revisionForm, urgency: value as typeof revisionForm.urgency})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setReviseModal({ open: false, item: null })}
              disabled={loading === reviseModal.item?.id}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReviseSubmit}
              disabled={!revisionForm.comment.trim() || loading === reviseModal.item?.id}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {loading === reviseModal.item?.id ? 'Sending...' : 'Send Revision Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Approval Modal */}
      <Dialog open={createModal} onOpenChange={setCreateModal}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md" aria-modal="true">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Approval</DialogTitle>
            <DialogDescription className="text-gray-300">
              Add a new item to the approval queue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter approval title..."
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-white">Type</Label>
              <Select value={newItem.type} onValueChange={(value) => setNewItem({...newItem, type: value as ApprovalItem['type']})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="redesign">Redesign</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="owner" className="text-white">Owner</Label>
              <Input
                id="owner"
                value={newItem.owner}
                onChange={(e) => setNewItem({...newItem, owner: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter responsible owner..."
              />
            </div>
            <div>
              <Label htmlFor="dueDate" className="text-white">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newItem.dueDate}
                onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="priority" className="text-white">Priority</Label>
              <Select value={newItem.priority} onValueChange={(value) => setNewItem({...newItem, priority: value as ApprovalItem['priority']})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateModal(false)}
              disabled={loading === 'create'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNew}
              disabled={!newItem.title || !newItem.owner || !newItem.dueDate || loading === 'create'}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {loading === 'create' ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
