
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, AlertTriangle, CheckCircle, MessageCircle, Filter, Star, ChevronUp, ChevronDown, Plus, ExternalLink, X, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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

export const ApprovalsDecisionsPanel: React.FC<ApprovalsDecisionsPanelProps> = ({ data, onFocusMode }) => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof ApprovalItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRevision, setExpandedRevision] = useState<string | null>(null);
  const [revisionComment, setRevisionComment] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [itemToApprove, setItemToApprove] = useState<ApprovalItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    type: 'strategy' as const,
    owner: '',
    dueDate: '',
    priority: 'medium' as const
  });

  // Mock data with exactly the specified items
  const mockItems: ApprovalItem[] = [
    { id: '1', title: 'Infrastructure Dev Package', type: 'strategy', owner: 'Planning Ministry', dueDate: '2025-06-02', priority: 'high', isPinned: true },
    { id: '2', title: 'Climate Resilience Framework', type: 'redesign', owner: 'Env Dept', dueDate: '2025-05-30', priority: 'medium', isPinned: true },
    { id: '3', title: 'EU Partnership Directive', type: 'external', owner: 'Foreign Affairs', dueDate: '2025-06-05', priority: 'low', isPinned: false },
    { id: '4', title: 'Education Reform Bundle', type: 'strategy', owner: 'Education Ministry', dueDate: '2025-06-10', priority: 'medium', isPinned: false },
    { id: '5', title: 'Urban Housing Mandate', type: 'redesign', owner: 'Housing Authority', dueDate: '2025-05-28', priority: 'high', isPinned: false },
    { id: '6', title: 'Digital ID Rollout', type: 'external', owner: 'Interior Ministry', dueDate: '2025-06-15', priority: 'low', isPinned: false },
  ];

  const [items, setItems] = useState<ApprovalItem[]>(data?.items || mockItems);

  // Keyboard shortcuts implementation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
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
            handleRevise(selectedRowId);
          }
          break;
        case 'escape':
          e.preventDefault();
          setExpandedRevision(null);
          setApproveModalOpen(false);
          setCreateModalOpen(false);
          setSelectedRowId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRowId, items]);

  // Real-time filter counts
  const filterCounts = {
    all: items.length,
    strategy: items.filter(item => item.type === 'strategy').length,
    redesign: items.filter(item => item.type === 'redesign').length,
    external: items.filter(item => item.type === 'external').length,
  };

  // Filter and sort logic
  const filteredItems = items.filter(item => 
    activeFilter === 'all' || item.type === activeFilter
  );

  const sortedItems = sortField ? [...filteredItems].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  }) : filteredItems;

  const pinnedItems = sortedItems.filter(item => item.isPinned);
  const unpinnedItems = sortedItems.filter(item => !item.isPinned);

  // Core functionality handlers
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Sort persists when filters change
  };

  const handleSort = (field: keyof ApprovalItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePin = useCallback((id: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      );
      
      const item = prevItems.find(i => i.id === id);
      toast({
        title: item?.isPinned ? "Item Unpinned" : "Item Pinned",
        description: `${item?.title} ${item?.isPinned ? 'removed from' : 'added to'} pinned items.`,
        duration: 2000,
      });
      
      return updatedItems;
    });
  }, [toast]);

  const handleApproveClick = (item: ApprovalItem) => {
    setItemToApprove(item);
    setApproveModalOpen(true);
  };

  const handleApproveConfirm = () => {
    if (itemToApprove) {
      // Remove approved item from list
      setItems(prevItems => prevItems.filter(item => item.id !== itemToApprove.id));
      
      toast({
        title: "Approved!",
        description: `${itemToApprove.title} has been approved successfully.`,
        duration: 3000,
      });
      
      setApproveModalOpen(false);
      setItemToApprove(null);
      setSelectedRowId(null);
    }
  };

  const handleRevise = (id: string) => {
    if (expandedRevision === id) {
      setExpandedRevision(null);
    } else {
      setExpandedRevision(id);
      setRevisionComment('');
    }
  };

  const handleSubmitRevision = (id: string, title: string) => {
    if (revisionComment.trim()) {
      toast({
        title: "Revision Requested",
        description: `${title} sent for revision with your comments.`,
        duration: 3000,
      });
      setExpandedRevision(null);
      setRevisionComment('');
      setSelectedRowId(null);
    }
  };

  const handleCreateNew = () => {
    if (newItem.title && newItem.owner && newItem.dueDate) {
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
      
      setCreateModalOpen(false);
      setNewItem({
        title: '',
        type: 'strategy',
        owner: '',
        dueDate: '',
        priority: 'medium'
      });
    }
  };

  const toggleFocusMode = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    onFocusMode?.(newFocusMode);
  };

  // Helper functions for styling
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

  // Sortable header component
  const SortableHeader = ({ field, children }: { field: keyof ApprovalItem; children: React.ReactNode }) => (
    <TableHead 
      className="text-white cursor-pointer hover:text-teal-400 transition-colors group"
      onClick={() => handleSort(field)}
      aria-sort={sortField === field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <div className="flex items-center justify-between">
        {children}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {sortField === field ? (
            sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
          ) : (
            <ChevronUp size={14} className="opacity-50" />
          )}
        </div>
      </div>
    </TableHead>
  );

  // Row component with proper interactions
  const ItemRow = ({ item }: { item: ApprovalItem }) => (
    <TableRow 
      key={item.id} 
      className="border-white/10 hover:bg-white/5 transition-all duration-150 group cursor-pointer"
      onClick={() => setSelectedRowId(item.id)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setSelectedRowId(item.id);
        }
      }}
      style={{
        backgroundColor: selectedRowId === item.id ? 'rgba(20, 184, 166, 0.1)' : undefined,
        borderLeft: selectedRowId === item.id ? '3px solid rgb(20, 184, 166)' : undefined
      }}
    >
      <TableCell className="font-medium text-white text-sm w-2/5">{item.title}</TableCell>
      <TableCell className="w-1/10">
        <Badge className={`${getTypeColor(item.type)} text-xs`}>
          <span className="flex items-center gap-1">
            {getTypeIcon(item.type)}
            {item.type}
          </span>
        </Badge>
      </TableCell>
      <TableCell className="text-gray-300 text-xs w-1/5">{item.owner}</TableCell>
      <TableCell className="text-gray-300 text-xs w-3/20">{item.dueDate}</TableCell>
      <TableCell className="text-xs w-1/10">
        <span className={`flex items-center gap-1 ${getPriorityColor(item.priority)}`}>
          {getPriorityDot(item.priority)} {item.priority}
        </span>
      </TableCell>
      <TableCell className="w-1/20">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handlePin(item.id);
            }}
            className={`p-1 h-6 w-6 ${item.isPinned ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
            aria-pressed={item.isPinned}
            aria-label={item.isPinned ? 'Unpin item' : 'Pin item'}
          >
            <Star size={12} fill={item.isPinned ? 'currentColor' : 'none'} />
          </Button>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApproveClick(item);
              }}
              className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
              aria-label={`Approve ${item.title}`}
            >
              <CheckCircle size={10} className="mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleRevise(item.id);
              }}
              className="h-6 px-2 text-xs border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              aria-label={`Request revision for ${item.title}`}
            >
              Revise
            </Button>
          </div>
        </div>
      </TableCell>
    </TableRow>
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
        {/* Title Bar - 48px height */}
        <div className="flex items-center justify-between h-12 mb-6 border-b border-teal-500/30 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white hover:text-teal-400 transition-colors cursor-pointer border-b-2 border-transparent hover:border-teal-400">
              Approvals & Decisions
            </h3>
            <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50 text-xs">
              Live
            </Badge>
            {pinnedItems.length > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-xs">
                Priority Items ({pinnedItems.length})
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={toggleFocusMode}
              className={`text-gray-400 hover:text-teal-400 transition-colors ${focusMode ? 'text-teal-400' : ''}`}
              aria-pressed={focusMode}
              aria-label="Toggle focus mode"
            >
              <Focus size={16} />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-gray-400 hover:text-teal-400"
              aria-label="Expand to full screen"
            >
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>

        {/* Filter Section - 10% */}
        <div className="flex gap-2 mb-4">
          {Object.entries(filterCounts).map(([filter, count]) => (
            <Button
              key={filter}
              id={filter === 'all' ? 'filter-all' : undefined}
              size="sm"
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => handleFilterChange(filter)}
              className={`text-xs transition-all duration-150 ${
                activeFilter === filter 
                  ? 'bg-teal-500 text-white border-teal-500' 
                  : 'border-teal-500/50 text-teal-400 hover:bg-blue-500/20 hover:border-blue-500'
              }`}
              aria-pressed={activeFilter === filter}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
            </Button>
          ))}
        </div>

        {/* Pinned Items Section - 15% */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-teal-400 mb-2 flex items-center gap-1">
            📌 Pinned
          </h4>
          {pinnedItems.length > 0 ? (
            <div className="space-y-2">
              {pinnedItems.slice(0, 3).map(item => (
                <motion.div 
                  key={item.id} 
                  className="bg-white/5 rounded-lg p-3 border border-white/10 h-12 flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex-1 min-w-0 flex items-center gap-4">
                      <span className="font-medium text-white text-sm truncate">{item.title}</span>
                      <Badge className={`${getTypeColor(item.type)} text-xs`}>
                        {item.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{item.owner}</span>
                      <span className="text-xs text-gray-400">{item.dueDate}</span>
                      <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {getPriorityDot(item.priority)} {item.priority}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePin(item.id)}
                      className="text-yellow-400 p-1 h-6 w-6"
                      aria-pressed={true}
                      aria-label="Unpin item"
                    >
                      <Star size={12} fill="currentColor" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              {/* Fill empty slots */}
              {Array.from({ length: 3 - pinnedItems.length }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-white/5 rounded-lg p-3 border border-white/10 h-12 flex items-center">
                  <p className="text-gray-400 text-sm">Pin important items for quick access</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-white/5 rounded-lg p-3 border border-white/10 h-12 flex items-center">
                  <p className="text-gray-400 text-sm">Pin important items for quick access</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Items List - 55% */}
        <div className="flex-1 min-h-0 mb-4 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-transparent">
                <SortableHeader field="title">Title</SortableHeader>
                <SortableHeader field="type">Type</SortableHeader>
                <SortableHeader field="owner">Owner</SortableHeader>
                <SortableHeader field="dueDate">Due Date</SortableHeader>
                <SortableHeader field="priority">Priority</SortableHeader>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpinnedItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ItemRow item={item} />
                  <AnimatePresence>
                    {expandedRevision === item.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <TableCell colSpan={6} className="p-4 bg-white/5">
                          <div className="space-y-3" aria-expanded={true}>
                            <label className="text-sm text-gray-300">Revision Comments:</label>
                            <textarea
                              value={revisionComment}
                              onChange={(e) => setRevisionComment(e.target.value)}
                              placeholder="Enter your revision comments..."
                              className="w-full h-16 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                              rows={2}
                              aria-label="Revision comments"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSubmitRevision(item.id, item.title)}
                                disabled={!revisionComment.trim()}
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                              >
                                Submit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setExpandedRevision(null)}
                                className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 text-xs"
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

        {/* Footer Actions - 10% */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 h-10">
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-400 hover:text-teal-300 text-xs"
          >
            View All Approvals <ExternalLink size={12} className="ml-1" />
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold h-10"
          >
            <Plus size={14} className="mr-1" />
            Create New Approval
          </Button>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Approval</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to approve "{itemToApprove?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveConfirm} className="bg-green-600 hover:bg-green-700">
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Approval Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
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
              <Select value={newItem.type} onValueChange={(value) => setNewItem({...newItem, type: value as any})}>
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
              <Select value={newItem.priority} onValueChange={(value) => setNewItem({...newItem, priority: value as any})}>
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
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNew}
              disabled={!newItem.title || !newItem.owner || !newItem.dueDate}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Save Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
