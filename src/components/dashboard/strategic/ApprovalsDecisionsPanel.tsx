
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, AlertTriangle, CheckCircle, MessageCircle, Filter, Star, ChevronUp, ChevronDown, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GlassCard } from '@/components/ui/glass-card';
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
}

export const ApprovalsDecisionsPanel: React.FC<ApprovalsDecisionsPanelProps> = ({ data }) => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof ApprovalItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRevision, setExpandedRevision] = useState<string | null>(null);
  const [revisionComment, setRevisionComment] = useState('');

  // Mock data
  const mockItems: ApprovalItem[] = [
    { id: '1', title: 'Infrastructure Dev Package', type: 'strategy', owner: 'Planning Ministry', dueDate: '2025-06-02', priority: 'high', isPinned: true },
    { id: '2', title: 'Climate Resilience Framework', type: 'redesign', owner: 'Env Dept', dueDate: '2025-05-30', priority: 'medium', isPinned: true },
    { id: '3', title: 'EU Partnership Directive', type: 'external', owner: 'Foreign Affairs', dueDate: '2025-06-05', priority: 'low', isPinned: false },
    { id: '4', title: 'Education Reform Bundle', type: 'strategy', owner: 'Education Ministry', dueDate: '2025-06-10', priority: 'medium', isPinned: false },
    { id: '5', title: 'Urban Housing Mandate', type: 'redesign', owner: 'Housing Authority', dueDate: '2025-05-28', priority: 'high', isPinned: false },
    { id: '6', title: 'Digital ID Rollout', type: 'external', owner: 'Interior Ministry', dueDate: '2025-06-15', priority: 'low', isPinned: false },
  ];

  const [items, setItems] = useState<ApprovalItem[]>(data?.items || mockItems);

  const filterCounts = {
    all: items.length,
    strategy: items.filter(item => item.type === 'strategy').length,
    redesign: items.filter(item => item.type === 'redesign').length,
    external: items.filter(item => item.type === 'external').length,
  };

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

  const handleSort = (field: keyof ApprovalItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePin = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isPinned: !item.isPinned } : item
    ));
  };

  const handleApprove = (id: string, title: string) => {
    toast({
      title: "Approved!",
      description: `${title} has been approved successfully.`,
      duration: 3000,
    });
  };

  const handleRevise = (id: string) => {
    setExpandedRevision(expandedRevision === id ? null : id);
    setRevisionComment('');
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
    }
  };

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

  const SortableHeader = ({ field, children }: { field: keyof ApprovalItem; children: React.ReactNode }) => (
    <TableHead 
      className="text-white cursor-pointer hover:text-teal-400 transition-colors group"
      onClick={() => handleSort(field)}
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

  const ItemRow = ({ item, showActions = true }: { item: ApprovalItem; showActions?: boolean }) => (
    <TableRow key={item.id} className="border-white/10 hover:bg-white/5 transition-colors group">
      <TableCell className="font-medium text-white text-sm">{item.title}</TableCell>
      <TableCell>
        <Badge className={`${getTypeColor(item.type)} text-xs`}>
          <span className="flex items-center gap-1">
            {getTypeIcon(item.type)}
            {item.type}
          </span>
        </Badge>
      </TableCell>
      <TableCell className="text-gray-300 text-xs">{item.owner}</TableCell>
      <TableCell className="text-gray-300 text-xs">{item.dueDate}</TableCell>
      <TableCell className="text-xs">
        <span className={`flex items-center gap-1 ${getPriorityColor(item.priority)}`}>
          {getPriorityDot(item.priority)} {item.priority}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handlePin(item.id)}
            className={`p-1 h-6 w-6 ${item.isPinned ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
          >
            <Star size={12} fill={item.isPinned ? 'currentColor' : 'none'} />
          </Button>
          {showActions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                size="sm"
                onClick={() => handleApprove(item.id, item.title)}
                className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle size={10} className="mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRevise(item.id)}
                className="h-6 px-2 text-xs border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                Revise
              </Button>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div 
      className="h-full flex flex-col"
      style={{ 
        background: 'rgba(10, 20, 40, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        borderRadius: '2rem',
        padding: '24px',
        boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between h-12 mb-6 border-b border-teal-500/30 pb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-white">Approvals & Decisions</h3>
          <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/50 text-xs">
            Live
          </Badge>
        </div>
        <Button size="sm" variant="ghost" className="text-gray-400 hover:text-teal-400">
          <ExternalLink size={16} />
        </Button>
      </div>

      {/* Filter Section */}
      <div className="flex gap-2 mb-4">
        {Object.entries(filterCounts).map(([filter, count]) => (
          <Button
            key={filter}
            size="sm"
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
            className={`text-xs ${
              activeFilter === filter 
                ? 'bg-teal-500 text-white border-teal-500' 
                : 'border-teal-500/50 text-teal-400 hover:bg-teal-500/10'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
          </Button>
        ))}
      </div>

      {/* Pinned Items */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-teal-400 mb-2 flex items-center gap-1">
          📌 Pinned
        </h4>
        {pinnedItems.length > 0 ? (
          <div className="space-y-2">
            {pinnedItems.slice(0, 3).map(item => (
              <div key={item.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm truncate">{item.title}</span>
                      <Badge className={`${getTypeColor(item.type)} text-xs`}>
                        {item.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{item.owner}</span>
                      <span>{item.dueDate}</span>
                      <span className={getPriorityColor(item.priority)}>
                        {getPriorityDot(item.priority)} {item.priority}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePin(item.id)}
                    className="text-yellow-400 p-1 h-6 w-6"
                  >
                    <Star size={12} fill="currentColor" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
            <p className="text-gray-400 text-sm">Pin important items for quick access</p>
          </div>
        )}
      </div>

      {/* Priority Items List */}
      <div className="flex-1 min-h-0 mb-4">
        <div className="h-full overflow-y-auto">
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
                          <div className="space-y-3">
                            <label className="text-sm text-gray-300">Revision Comments:</label>
                            <textarea
                              value={revisionComment}
                              onChange={(e) => setRevisionComment(e.target.value)}
                              placeholder="Enter your revision comments..."
                              className="w-full h-16 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
                              rows={2}
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
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          className="text-teal-400 hover:text-teal-300 text-xs"
        >
          View All Approvals <ExternalLink size={12} className="ml-1" />
        </Button>
        <Button
          size="sm"
          className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold h-10"
        >
          <Plus size={14} className="mr-1" />
          Create New Approval
        </Button>
      </div>
    </div>
  );
};
