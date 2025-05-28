
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, AlertTriangle, CheckCircle, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GlassCard } from '@/components/ui/glass-card';

interface ApprovalsDecisionsPanelProps {
  data?: {
    strategyBundles: Array<{
      id: string;
      title: string;
      type: 'strategy' | 'structural' | 'external';
      owner: string;
      dueDate: string;
      priority: 'high' | 'medium' | 'low';
      status: 'pending' | 'review' | 'approved';
    }>;
    decisionHeatmap: { pending: number; overdue: number; urgent: number };
    upcomingDeadlines: Array<{ date: string; title: string; type: string }>;
  };
}

export const ApprovalsDecisionsPanel: React.FC<ApprovalsDecisionsPanelProps> = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data if not provided
  const mockData = {
    strategyBundles: [
      { id: '1', title: 'Infrastructure Development Package', type: 'strategy' as const, owner: 'Planning Ministry', dueDate: '2024-02-15', priority: 'high' as const, status: 'pending' as const },
      { id: '2', title: 'Education Reform Bundle', type: 'strategy' as const, owner: 'Education Ministry', dueDate: '2024-02-20', priority: 'medium' as const, status: 'review' as const },
      { id: '3', title: 'THINK Zone Restructure', type: 'structural' as const, owner: 'Zone Lead Council', dueDate: '2024-02-10', priority: 'high' as const, status: 'pending' as const },
      { id: '4', title: 'EU Partnership Directive', type: 'external' as const, owner: 'Foreign Affairs', dueDate: '2024-02-25', priority: 'medium' as const, status: 'pending' as const },
    ],
    decisionHeatmap: { pending: 12, overdue: 3, urgent: 2 },
    upcomingDeadlines: [
      { date: '2024-02-10', title: 'THINK Restructure', type: 'structural' },
      { date: '2024-02-15', title: 'Infrastructure Package', type: 'strategy' },
      { date: '2024-02-20', title: 'Education Reform', type: 'strategy' },
    ]
  };

  const displayData = data || mockData;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategy': return <FileText size={16} className="text-blue-400" />;
      case 'structural': return <AlertTriangle size={16} className="text-purple-400" />;
      case 'external': return <MessageCircle size={16} className="text-orange-400" />;
      default: return <FileText size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-orange-500/20 text-orange-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <GlassCard className="h-full p-4 bg-blue-500/10 border-blue-500/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-400">Approvals & Decisions</h3>
          <Button size="sm" variant="ghost" className="text-blue-400">
            <Filter size={14} className="mr-1" />
            Filter
          </Button>
        </div>

        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="structural">Structural</TabsTrigger>
            <TabsTrigger value="external">External</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Decision Heatmap */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-yellow-500/20 p-2 rounded">
                <div className="text-xl font-bold text-yellow-400">{displayData.decisionHeatmap.pending}</div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
              <div className="bg-red-500/20 p-2 rounded">
                <div className="text-xl font-bold text-red-400">{displayData.decisionHeatmap.overdue}</div>
                <div className="text-xs text-gray-400">Overdue</div>
              </div>
              <div className="bg-orange-500/20 p-2 rounded">
                <div className="text-xl font-bold text-orange-400">{displayData.decisionHeatmap.urgent}</div>
                <div className="text-xs text-gray-400">Urgent</div>
              </div>
            </div>

            {/* Approval Table */}
            <div className="max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white">Title</TableHead>
                    <TableHead className="text-white">Type</TableHead>
                    <TableHead className="text-white">Priority</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.strategyBundles.map((bundle) => (
                    <TableRow key={bundle.id} className="border-white/10">
                      <TableCell className="font-medium text-white">{bundle.title}</TableCell>
                      <TableCell>{getTypeIcon(bundle.type)}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(bundle.priority)}>
                          {bundle.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" className="text-xs bg-green-600 hover:bg-green-700">
                            <CheckCircle size={12} className="mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs border-orange-500/50 text-orange-400">
                            Revise
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Upcoming Deadlines */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-blue-400">Upcoming Deadlines</h4>
              <div className="flex space-x-2 overflow-x-auto">
                {displayData.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex-shrink-0 bg-white/10 p-2 rounded text-center min-w-[100px]">
                    <div className="text-xs text-gray-400">{deadline.date}</div>
                    <div className="text-sm font-medium text-white">{deadline.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </GlassCard>
  );
};
