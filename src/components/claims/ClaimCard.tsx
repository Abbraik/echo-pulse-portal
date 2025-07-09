import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle, User } from 'lucide-react';
import { EnhancedClaim } from '@/types/claims';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ClaimCardProps {
  claim: EnhancedClaim;
  isSelected: boolean;
  onClick: () => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, isSelected, onClick }) => {
  const getStatusIcon = () => {
    switch (claim.status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-orange-400" />;
      case 'assigned':
        return <User className="h-4 w-4 text-blue-400" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getZoneBadgeColor = (zone: string) => {
    const colors: Record<string, string> = {
      THINK: 'bg-purple-500/20 text-purple-300',
      ACT: 'bg-teal-500/20 text-teal-300',
      MONITOR: 'bg-orange-500/20 text-orange-300',
      LEARN: 'bg-green-500/20 text-green-300',
      INNOVATE: 'bg-blue-500/20 text-blue-300',
    };
    return colors[zone] || 'bg-gray-500/20 text-gray-300';
  };

  return (
    <motion.div
      className={`
        glass-card p-4 cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-teal-400 bg-white/10' : 'hover:bg-white/5'}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <Badge className={getZoneBadgeColor(claim.zone)}>
            {claim.zone}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(claim.openedAt, { addSuffix: true })}
        </span>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-sm text-foreground">
          Task #{claim.taskId.slice(0, 8)}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Origin: {claim.originZone}</span>
          <span className="capitalize">{claim.status}</span>
        </div>
        
        {claim.claimedBy && (
          <div className="text-xs text-blue-300">
            Assigned to: {claim.claimedBy.slice(0, 8)}...
          </div>
        )}
      </div>
    </motion.div>
  );
};