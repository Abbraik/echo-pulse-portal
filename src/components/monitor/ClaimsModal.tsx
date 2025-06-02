
import React from 'react';
import { X, Users, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

interface ClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const ClaimsModal: React.FC<ClaimsModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { t } = useTranslation();

  const mockClaims = [
    { id: 1, issue: 'Bundle coordination conflict', zone: 'Act', age: 5, severity: 'high' },
    { id: 2, issue: 'Resource allocation dispute', zone: 'Think', age: 3, severity: 'medium' },
    { id: 3, issue: 'Timeline adjustment needed', zone: 'Innovate', age: 2, severity: 'low' },
    { id: 4, issue: 'Stakeholder alignment issue', zone: 'Learn', age: 4, severity: 'high' },
    { id: 5, issue: 'Technical specification conflict', zone: 'Monitor', age: 1, severity: 'medium' }
  ];

  const facilitators = [
    { name: 'Alex Chen', zone: 'Multi-Zone', availability: 85 },
    { name: 'Maria Rodriguez', zone: 'Think/Act', availability: 60 },
    { name: 'David Kim', zone: 'Learn/Innovate', availability: 90 },
    { name: 'Sarah Johnson', zone: 'Act/Monitor', availability: 45 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass-panel-deep border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            <Clock size={20} className="inline mr-2" />
            Open Facilitator Claims
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Claims Table */}
          <motion.div 
            className="glass-panel p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Issue</TableHead>
                  <TableHead className="text-gray-300">Zone</TableHead>
                  <TableHead className="text-gray-300">Age (days)</TableHead>
                  <TableHead className="text-gray-300">Severity</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClaims.map((claim, index) => (
                  <motion.tr 
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <TableCell className="font-medium text-white">{claim.issue}</TableCell>
                    <TableCell className="text-gray-300">{claim.zone}</TableCell>
                    <TableCell className="text-gray-300">{claim.age}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(claim.severity)}>
                        {claim.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Reassign" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilitators.map((facilitator) => (
                            <SelectItem key={facilitator.name} value={facilitator.name}>
                              <div className="flex justify-between items-center w-full">
                                <span>{facilitator.name}</span>
                                <div className="flex items-center ml-2">
                                  <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                                    <div 
                                      className="bg-teal-400 h-2 rounded-full"
                                      style={{ width: `${facilitator.availability}%` }}
                                    />
                                  </div>
                                  <span className="text-xs">{facilitator.availability}%</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </motion.div>

          {/* Summary Stats */}
          <motion.div 
            className="grid grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {mockClaims.filter(c => c.severity === 'high').length}
              </div>
              <div className="text-sm text-gray-400">High Priority</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">
                {mockClaims.filter(c => c.severity === 'medium').length}
              </div>
              <div className="text-sm text-gray-400">Medium Priority</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {mockClaims.filter(c => c.severity === 'low').length}
              </div>
              <div className="text-sm text-gray-400">Low Priority</div>
            </div>
            <div className="glass-panel p-4 text-center">
              <div className="text-2xl font-bold text-teal-400">
                {(mockClaims.reduce((sum, claim) => sum + claim.age, 0) / mockClaims.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Avg Age (days)</div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
