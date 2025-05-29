import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, AlertTriangle, CheckCircle, MessageCircle, Filter, Star, ChevronUp, ChevronDown, Plus, ExternalLink, X, Focus, Edit, Users, Activity, TrendingUp, Brain, Zap, Eye, BookOpen, Lightbulb, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ThinkChart } from './charts/ThinkChart';
import { ActChart } from './charts/ActChart';
import { MonitorChart } from './charts/MonitorChart';
import { LearnChart } from './charts/LearnChart';
import { InnovateChart } from './charts/InnovateChart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelDimensions, setPanelDimensions] = useState({ width: 0, height: 0 });
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [contentFitStatus, setContentFitStatus] = useState<'perfect' | 'compacted' | null>(null);
  
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
  const [showAllFilters, setShowAllFilters] = useState(false);

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

  // Visualization toggles for the approve modal
  const [visualToggles, setVisualToggles] = useState({
    think: false,
    act: false,
    monitor: false,
    learn: false,
    innovate: false
  });

  // Approval workflow states
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

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

  // ResizeObserver for container dimensions
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setPanelDimensions({ width, height });
        
        // Determine compact mode based on size
        const shouldBeCompact = width < 400 || height < 500;
        
        if (shouldBeCompact !== isCompactMode) {
          setIsCompactMode(shouldBeCompact);
          
          // Visual feedback for content fit
          setContentFitStatus(shouldBeCompact ? 'compacted' : 'perfect');
          setTimeout(() => setContentFitStatus(null), 1000);
        }
      }
    });

    if (panelRef.current) {
      resizeObserver.observe(panelRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isCompactMode]);

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

  // Adaptive display logic
  const maxVisibleItems = isCompactMode ? 2 : Math.floor((panelDimensions.height - 200) / 50);
  const visiblePinnedItems = pinnedItems.slice(0, isCompactMode ? 2 : 3);
  const visibleUnpinnedItems = unpinnedItems.slice(0, maxVisibleItems);

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
    setConfirmSuccess(false);
    setIsConfirming(false);
  };

  const handleApproveConfirm = async () => {
    if (approveModal.item) {
      setIsConfirming(true);
      
      // Mock delay for premium loading experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConfirming(false);
      setConfirmSuccess(true);
      
      // Brief success animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setItems(prevItems => prevItems.filter(item => item.id !== approveModal.item!.id));
      
      toast({
        title: "Approved! 🎉",
        description: `${approveModal.item.title} approved and pipeline updated.`,
        duration: 4000,
      });

      // Trigger contextual action
      onContextualAction?.('approve', approveModal.item.title);
      
      setApproveModal({ open: false, item: null });
      setSelectedRowId(null);
      setConfirmSuccess(false);
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
      case 'strategy': return <FileText size={isCompactMode ? 12 : 16} className="text-blue-400" />;
      case 'redesign': return <AlertTriangle size={isCompactMode ? 12 : 16} className="text-purple-400" />;
      case 'external': return <MessageCircle size={isCompactMode ? 12 : 16} className="text-orange-400" />;
      default: return <FileText size={isCompactMode ? 12 : 16} className="text-gray-400" />;
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

  const TruncatedText = ({ text, maxLength = 30 }: { text: string; maxLength?: number }) => {
    if (text.length <= maxLength) return <span>{text}</span>;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help" aria-label={text}>
              {text.substring(0, maxLength)}...
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p>{text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const ActionButton = ({ 
    children, 
    onClick, 
    disabled, 
    variant = "default",
    size = "sm",
    className = "",
    iconOnly = false
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: "default" | "outline" | "ghost";
    size?: "sm" | "default";
    className?: string;
    iconOnly?: boolean;
  }) => (
    <Button
      size={size}
      variant={variant}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={`${className} ${iconOnly ? 'px-1 min-w-0' : ''} ${isCompactMode ? 'text-xs' : ''}`}
    >
      {children}
    </Button>
  );

  const toggleVisual = (zone: keyof typeof visualToggles) => {
    setVisualToggles(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }));
  };

  const PremiumZoneCard = ({ 
    zone, 
    icon: Icon, 
    title, 
    color, 
    summary, 
    chart: ChartComponent 
  }: {
    zone: keyof typeof visualToggles;
    icon: React.ComponentType<any>;
    title: string;
    color: string;
    summary: React.ReactNode;
    chart: React.ComponentType;
  }) => (
    <motion.div 
      className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
      style={{ 
        background: 'rgba(20, 30, 50, 0.4)',
        backdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.05)'
      }}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 16px 32px rgba(0,0,0,0.2), inset 0 0 30px rgba(20, 184, 166, 0.1)' 
      }}
      role="region"
      aria-label={`${title} context`}
    >
      {/* Animated gradient underline */}
      <motion.div 
        className={`absolute top-0 left-0 h-1 bg-gradient-to-r from-${color}-400 to-${color}-600`}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      
      <div className="p-6">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-2 rounded-lg bg-${color}-500/10 border border-${color}-500/20`}
            >
              <Icon size={20} className={`text-${color}-400`} />
            </motion.div>
            <h3 className={`text-lg font-bold text-${color}-400 tracking-wide`}>
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Switch
                checked={visualToggles[zone]}
                onCheckedChange={() => toggleVisual(zone)}
                className="data-[state=checked]:bg-teal-500"
              />
            </motion.div>
            <Label className="text-sm text-gray-300">Show Visuals</Label>
          </div>
        </div>
        
        {/* Summary Section */}
        <div className="mb-4">
          {summary}
        </div>
        
        {/* Visualization Section */}
        <AnimatePresence>
          {visualToggles[zone] && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div 
                className="p-4 rounded-xl border border-white/5"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <ChartComponent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Details Link */}
        <motion.button
          onClick={() => handleZoneNavigation(zone)}
          className={`mt-4 text-sm text-${color}-400 hover:text-${color}-300 underline underline-offset-4 hover:underline-offset-2 transition-all duration-200`}
          whileHover={{ x: 4 }}
        >
          Go to {title} Details →
        </motion.button>
      </div>
    </motion.div>
  );

  const handleZoneNavigation = (zone: string) => {
    if (approveModal.item) {
      setApproveModal({ open: false, item: null });
      navigate(`/${zone.toLowerCase()}`);
    }
  };

  return (
    <TooltipProvider>
      <div 
        ref={panelRef}
        className={`approval-panel-container h-full w-full flex flex-col transition-all duration-200 ${
          contentFitStatus === 'perfect' ? 'ring-2 ring-green-400/50' : 
          contentFitStatus === 'compacted' ? 'ring-2 ring-red-400/50' : ''
        } ${isCompactMode ? 'compact-mode' : ''}`}
        style={{
          fontSize: 'clamp(12px, 1.2vw, 16px)',
          height: '45vh'
        }}
      >
        {/* Title Bar - 10% */}
        <div className="flex-shrink-0 h-[10%] min-h-[60px] flex items-center justify-between border-b border-teal-500/30 pb-2 px-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-white" style={{ fontSize: 'clamp(14px, 1.5vw, 20px)' }}>
              Approvals & Decisions
            </h3>
            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50">
              Live
            </Badge>
          </div>
        </div>

        {/* Filter Row - Adaptive */}
        <div className="flex-shrink-0 h-[8%] min-h-[50px] flex items-center px-4">
          {isCompactMode ? (
            <Select value={activeFilter} onValueChange={(value) => handleFilterChange(value as typeof activeFilter)}>
              <SelectTrigger className="w-full bg-white/10 border-white/20 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {Object.entries(filterCounts).map(([filter, count]) => (
                  <SelectItem key={filter} value={filter}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {Object.entries(filterCounts).map(([filter, count]) => (
                <Button
                  key={filter}
                  id={filter === 'all' ? 'filter-all' : undefined}
                  size="sm"
                  variant={activeFilter === filter ? "default" : "outline"}
                  onClick={() => handleFilterChange(filter as typeof activeFilter)}
                  className={`transition-all duration-150 ${
                    activeFilter === filter 
                      ? 'bg-teal-500 text-white border-teal-500' 
                      : 'border-teal-500/50 text-teal-400 hover:bg-teal-500/20 hover:border-teal-500'
                  }`}
                  style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}
                  aria-pressed={activeFilter === filter}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Pinned Approvals Section - 15% */}
        <div className="flex-shrink-0 h-[15%] min-h-[100px] px-4 mb-2">
          <h4 className="text-sm font-semibold text-teal-400 mb-2 flex items-center gap-2">
            <Star size={isCompactMode ? 12 : 16} className="text-yellow-400 fill-yellow-400" />
            Pinned Approvals
          </h4>
          <div className="h-full overflow-hidden">
            {visiblePinnedItems.length > 0 ? (
              <div className="space-y-1 h-full overflow-y-auto approval-scrollbar">
                {visiblePinnedItems.map(item => (
                  <motion.div 
                    key={item.id} 
                    className="bg-white/5 rounded-lg p-2 border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => handleApproveClick(item)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <TruncatedText text={item.title} maxLength={isCompactMode ? 20 : 30} />
                      <Badge className={`${getTypeColor(item.type)} text-xs shrink-0`}>
                        <span className="flex items-center gap-1">
                          {getTypeIcon(item.type)}
                          {!isCompactMode && item.type}
                        </span>
                      </Badge>
                      {!isCompactMode && <span className="text-xs text-gray-400 shrink-0">{item.dueDate}</span>}
                      <span className={`text-xs ${getPriorityColor(item.priority)} shrink-0`}>
                        {getPriorityDot(item.priority)} {!isCompactMode && item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <ActionButton
                        onClick={() => handlePin(item.id)}
                        disabled={loading === item.id}
                        variant="ghost"
                        className="text-yellow-400 p-1 h-6 w-6"
                        iconOnly={isCompactMode}
                      >
                        <Star size={isCompactMode ? 10 : 12} fill="currentColor" />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleApproveClick(item)}
                        disabled={loading === item.id}
                        className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white"
                        iconOnly={isCompactMode}
                      >
                        <CheckCircle size={isCompactMode ? 10 : 12} className={!isCompactMode ? "mr-1" : ""} />
                        {!isCompactMode && "Approve ▶"}
                      </ActionButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-3 border border-white/10 text-center h-full flex items-center justify-center">
                <p className="text-gray-400 text-xs">No pinned approvals. Pin key items for quick access.</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Approval List - 65% */}
        <div className="flex-1 min-h-0 px-4 mb-2">
          <div className="h-full overflow-y-auto approval-scrollbar">
            {isCompactMode ? (
              // Compact card view for small containers
              <div className="space-y-2">
                {visibleUnpinnedItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    className="bg-white/5 rounded-lg p-3 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setSelectedRowId(item.id);
                      handleApproveClick(item);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <TruncatedText text={item.title} maxLength={25} />
                      <Badge className={`${getTypeColor(item.type)} text-xs shrink-0`}>
                        {getTypeIcon(item.type)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">{item.owner}</span>
                      <span className={getPriorityColor(item.priority)}>
                        {getPriorityDot(item.priority)}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {unpinnedItems.length > visibleUnpinnedItems.length && (
                  <button 
                    className="w-full text-sm text-teal-400 hover:text-teal-300 transition-colors duration-200 flex items-center justify-center space-x-2 py-2"
                    aria-live="polite"
                  >
                    <span>View {unpinnedItems.length - visibleUnpinnedItems.length} More</span>
                    <span>▶</span>
                  </button>
                )}
              </div>
            ) : (
              // Full table view for larger containers
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-white/20 hover:bg-transparent">
                    <TableHead className="text-white w-[40%]" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>Title</TableHead>
                    <TableHead className="text-white w-[10%]" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>Type</TableHead>
                    <TableHead className="text-white w-[20%]" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>Owner</TableHead>
                    <TableHead className="text-white w-[15%]" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>Due Date</TableHead>
                    <TableHead className="text-white w-[10%]" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>Priority</TableHead>
                    <TableHead className="text-white w-[5%]" style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleUnpinnedItems.map((item) => (
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
                      <TableCell className="font-medium text-white">
                        <TruncatedText text={item.title} maxLength={35} />
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(item.type)} text-xs`}>
                          <span className="flex items-center gap-1">
                            {getTypeIcon(item.type)}
                            {item.type}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <TruncatedText text={item.owner} maxLength={20} />
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">{item.dueDate}</TableCell>
                      <TableCell>
                        <span className={`flex items-center gap-1 ${getPriorityColor(item.priority)} text-sm`}>
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
                            iconOnly
                          >
                            <Star size={12} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleApproveClick(item)}
                            disabled={loading === item.id}
                            className="h-6 px-2 bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            Approve ▶
                          </ActionButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Footer - 10% */}
        <div className="flex-shrink-0 h-[10%] min-h-[50px] flex items-center justify-between pt-2 border-t border-white/10 px-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-400 hover:text-teal-300"
            style={{ fontSize: 'clamp(10px, 1vw, 14px)' }}
          >
            View All Approvals ▶ <ExternalLink size={12} className="ml-1" />
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold"
            style={{ 
              fontSize: 'clamp(10px, 1vw, 14px)',
              height: 'clamp(24px, 2vw, 32px)'
            }}
          >
            <Plus size={14} className="mr-1" />
            {!isCompactMode && "Create New Approval"}
            {isCompactMode && "New"}
          </Button>
        </div>
      </div>

      {/* Premium Approve Details Modal */}
      <Dialog open={approveModal.open} onOpenChange={(open) => setApproveModal({ open, item: null })}>
        <DialogContent 
          className="max-w-none w-[80vw] h-[75vh] p-0 bg-transparent border-0 shadow-none overflow-hidden"
          aria-modal="true"
        >
          {/* Cinematic backdrop */}
          <motion.div 
            className="absolute inset-0"
            style={{ background: 'rgba(10, 20, 40, 0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Premium Glass Panel */}
          <motion.div 
            className="relative w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ 
              background: 'rgba(20, 30, 50, 0.6)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 16px 32px rgba(0,0,0,0.4), inset 0 0 60px rgba(20, 184, 166, 0.1)',
              border: '1px solid rgba(20, 184, 166, 0.2)'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            
            {/* Header (12% height) */}
            <div className="h-[12%] flex items-center justify-between p-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white tracking-wide" style={{ letterSpacing: '0.025em' }}>
                  {approveModal.item?.title}
                </h2>
                {approveModal.item && (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 rounded-full border border-amber-500/50 bg-amber-500/10"
                    >
                      <span className="text-sm text-amber-400 font-medium">
                        {getTypeIcon(approveModal.item.type)}
                        <span className="ml-2">{approveModal.item.type}</span>
                      </span>
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`w-3 h-3 rounded-full ${
                        approveModal.item.priority === 'high' ? 'bg-red-400' :
                        approveModal.item.priority === 'medium' ? 'bg-orange-400' : 'bg-green-400'
                      }`}
                    />
                  </>
                )}
              </div>
              <motion.button
                onClick={() => setApproveModal({ open: false, item: null })}
                className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Body (70% height) - Premium Grid Layout */}
            <div className="h-[70%] overflow-y-auto p-8">
              <div className="grid grid-cols-2 gap-6 h-full">
                
                {/* Think Context */}
                <PremiumZoneCard
                  zone="think"
                  icon={Brain}
                  title="Think"
                  color="teal"
                  chart={ThinkChart}
                  summary={
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-gray-400 mb-1">Selected Scenario</div>
                          <div className="text-sm font-medium text-white">Sustainable Growth</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-gray-400 mb-1">Created</div>
                          <div className="text-sm font-medium text-white">2025-05-15</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Target DEI:</span>
                        <span className="text-green-400 font-medium">85.2</span>
                        <span className="text-gray-300">vs Current:</span>
                        <span className="text-orange-400 font-medium">78.5</span>
                      </div>
                    </div>
                  }
                />

                {/* Act Context */}
                <PremiumZoneCard
                  zone="act"
                  icon={Zap}
                  title="Act"
                  color="blue"
                  chart={ActChart}
                  summary={
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-gray-400 mb-1">Bundle</div>
                        <div className="text-sm font-medium text-white">Strategic Infrastructure 2025</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-300">Objectives:</span>
                          <span className="text-white ml-2">8 active, 3 completed</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Success Rate:</span>
                          <span className="text-green-400 ml-2 font-medium">85%</span>
                        </div>
                      </div>
                    </div>
                  }
                />

                {/* Monitor Context */}
                <PremiumZoneCard
                  zone="monitor"
                  icon={Eye}
                  title="Monitor"
                  color="green"
                  chart={MonitorChart}
                  summary={
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-white">Recent Alerts</h4>
                      <div className="space-y-2 text-sm">
                        {[
                          { icon: AlertTriangle, text: 'Resource constraint detected', time: '2h ago', color: 'text-red-400' },
                          { icon: AlertTriangle, text: 'Stakeholder feedback pending', time: '4h ago', color: 'text-orange-400' },
                          { icon: AlertTriangle, text: 'Timeline variance +5 days', time: '1d ago', color: 'text-yellow-400' }
                        ].map((alert, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                            <alert.icon size={12} className={alert.color} />
                            <span className="text-gray-300 flex-1">{alert.text}</span>
                            <span className="text-xs text-gray-400">{alert.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                />

                {/* Learn Context */}
                <PremiumZoneCard
                  zone="learn"
                  icon={BookOpen}
                  title="Learn"
                  color="purple"
                  chart={LearnChart}
                  summary={
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-white">Relevant Lessons</h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Infrastructure Planning Playbook', rate: 94 },
                          { name: 'Multi-Stakeholder Coordination', rate: 78 }
                        ].map((lesson, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                            <span className="text-sm text-gray-300">{lesson.name}</span>
                            <span className={`text-sm font-medium ${lesson.rate > 85 ? 'text-green-400' : 'text-orange-400'}`}>
                              {lesson.rate}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                />

                {/* Innovate Context */}
                <div className="col-span-2">
                  <PremiumZoneCard
                    zone="innovate"
                    icon={Lightbulb}
                    title="Innovate"
                    color="amber"
                    chart={InnovateChart}
                    summary={
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-white">Active Experiments</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { name: 'Smart City Infrastructure', phase: 'Prototype', progress: 75 },
                            { name: 'Adaptive Policy Framework', phase: 'Testing', progress: 45 }
                          ].map((exp, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-white font-medium">{exp.name}</span>
                                <Badge className={`text-xs ${exp.phase === 'Prototype' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                  {exp.phase}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-400">Progress: {exp.progress}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Footer (18% height) */}
            <div className="h-[18%] flex items-center justify-between p-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <Select>
                  <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Quick navigate to..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="think" onClick={() => handleZoneNavigation('think')}>
                      <div className="flex items-center gap-2">
                        <Brain size={16} className="text-teal-400" />
                        Think Zone
                      </div>
                    </SelectItem>
                    <SelectItem value="act" onClick={() => handleZoneNavigation('act')}>
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-blue-400" />
                        Act Zone
                      </div>
                    </SelectItem>
                    <SelectItem value="monitor" onClick={() => handleZoneNavigation('monitor')}>
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-green-400" />
                        Monitor Zone
                      </div>
                    </SelectItem>
                    <SelectItem value="learn" onClick={() => handleZoneNavigation('learn')}>
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-purple-400" />
                        Learn Zone
                      </div>
                    </SelectItem>
                    <SelectItem value="innovate" onClick={() => handleZoneNavigation('innovate')}>
                      <div className="flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-400" />
                        Innovate Zone
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setApproveModal({ open: false, item: null })}
                  disabled={isConfirming}
                  className="text-white hover:bg-white/10 px-6"
                >
                  Cancel
                </Button>
                <motion.button
                  onClick={handleApproveConfirm}
                  disabled={isConfirming || confirmSuccess}
                  className="relative h-12 px-8 rounded-lg font-bold text-white overflow-hidden"
                  style={{
                    background: confirmSuccess 
                      ? 'linear-gradient(135deg, #10B981, #059669)' 
                      : 'linear-gradient(135deg, #14B8A6, #0891B2)',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {confirmSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={20} />
                        Approved!
                      </motion.div>
                    ) : isConfirming ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={20} className="animate-spin" />
                        Confirming...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Confirm Approval
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Ripple effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
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
    </TooltipProvider>
  );
};
