
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, AlertTriangle, CheckCircle, MessageCircle, Filter, Star, ChevronUp, ChevronDown, Plus, ExternalLink, X, Focus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
}

export const ApprovalsDecisionsPanel: React.FC<ApprovalsDecisionsPanelProps> = ({ 
  data, 
  onFocusMode 
}) => {
  const { toast } = useToast();
  
  // Mock data
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
  ];

  // State
  const [items, setItems] = useState<ApprovalItem[]>(data?.items || initialItems);
  const [activeFilter, setActiveFilter] = useState<'all' | 'strategy' | 'redesign' | 'external'>('all');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  // Modal states
  const [approveModal, setApproveModal] = useState<{ open: boolean; item: ApprovalItem | null }>({
    open: false,
    item: null
  });
  const [createModal, setCreateModal] = useState(false);
  const [reviseRowId, setReviseRowId] = useState<string | null>(null);
  const [reviseComment, setReviseComment] = useState('');

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
            handleReviseClick(selectedRowId);
          }
          break;
        case 'escape':
          e.preventDefault();
          setReviseRowId(null);
          setReviseComment('');
          setApproveModal({ open: false, item: null });
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
        description: `${approveModal.item.title} has been approved successfully.`,
        duration: 3000,
      });
      
      setApproveModal({ open: false, item: null });
      setSelectedRowId(null);
      setLoading(null);
    }
  };

  const handleReviseClick = (id: string) => {
    if (reviseRowId === id) {
      setReviseRowId(null);
      setReviseComment('');
    } else {
      setReviseRowId(id);
      setReviseComment('');
    }
  };

  const handleReviseSubmit = async (id: string) => {
    if (reviseComment.trim()) {
      setLoading(id);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const item = items.find(i => i.id === id);
      toast({
        title: "Feedback Submitted",
        description: `Feedback submitted for ${item?.title}.`,
        duration: 3000,
      });
      
      setReviseRowId(null);
      setReviseComment('');
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

  const toggleFocusMode = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    onFocusMode?.(newFocusMode);
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

  return (
    <>
      <div 
        className={`h-full flex flex-col transition-all duration-300 ${focusMode ? 'ring-2 ring-teal-500 ring-opacity-50' : ''}`}
        style={{ 
          background: 'rgba(10, 20, 40, 0.6)',
          backdropFilter: 'blur(20px)',
          border: focusMode ? '2px solid rgba(20, 184, 166, 0.5)' : '1px solid rgba(20, 184, 166, 0.3)',
          borderRadius: '2rem',
          padding: '24px',
          margin: '0',
          boxShadow: focusMode 
            ? 'inset 0 0 30px rgba(20, 184, 166, 0.2), 0 0 40px rgba(20, 184, 166, 0.3)'
            : 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
        }}
      >
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
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={toggleFocusMode}
              className={`text-gray-400 hover:text-teal-400 transition-colors ${focusMode ? 'text-teal-400' : ''}`}
              aria-pressed={focusMode}
            >
              <Focus size={16} />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-gray-400 hover:text-teal-400"
            >
              <ExternalLink size={16} />
            </Button>
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
                  className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
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
                      onClick={() => handleReviseClick(item.id)}
                      disabled={loading === item.id}
                      variant="outline"
                      className="h-6 px-2 text-sm border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                    >
                      <Edit size={10} className="mr-1" />
                      Revise ▶
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
                <React.Fragment key={item.id}>
                  <TableRow 
                    className="border-white/10 hover:bg-white/5 transition-all duration-150 cursor-pointer"
                    onClick={() => setSelectedRowId(item.id)}
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
                      <div className="flex items-center gap-1">
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
                          <CheckCircle size={10} className="mr-1" />
                          Approve ▶
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleReviseClick(item.id)}
                          disabled={loading === item.id}
                          variant="outline"
                          className="h-6 px-2 text-sm border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Edit size={10} className="mr-1" />
                          Revise ✎
                        </ActionButton>
                      </div>
                    </TableCell>
                  </TableRow>
                  <AnimatePresence>
                    {reviseRowId === item.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <TableCell colSpan={6} className="p-4 bg-white/5">
                          <div className="space-y-3">
                            <label className="text-sm text-gray-300">Revision Comments:</label>
                            <Textarea
                              value={reviseComment}
                              onChange={(e) => setReviseComment(e.target.value)}
                              placeholder="Enter your revision comments..."
                              className="w-full h-16 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleReviseSubmit(item.id)}
                                disabled={!reviseComment.trim() || loading === item.id}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
                              >
                                {loading === item.id ? 'Submitting...' : 'Submit'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReviseRowId(null);
                                  setReviseComment('');
                                }}
                                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 text-sm"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
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

      {/* Approve Confirmation Modal */}
      <Dialog open={approveModal.open} onOpenChange={(open) => setApproveModal({ open, item: null })}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Approval</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to approve "{approveModal.item?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setApproveModal({ open: false, item: null })}
              disabled={loading === approveModal.item?.id}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApproveConfirm} 
              disabled={loading === approveModal.item?.id}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading === approveModal.item?.id ? 'Confirming...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Approval Modal */}
      <Dialog open={createModal} onOpenChange={setCreateModal}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
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
