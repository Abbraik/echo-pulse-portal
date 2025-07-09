import React from 'react';
import { Clock, User, FileText, Tag } from 'lucide-react';
import { EnhancedClaim } from '@/types/claims';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ClaimMetadataPanelProps {
  claim: EnhancedClaim;
}

export const ClaimMetadataPanel: React.FC<ClaimMetadataPanelProps> = ({ claim }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Claim Details
        </h3>
        <Badge variant={claim.status === 'open' ? 'destructive' : claim.status === 'assigned' ? 'default' : 'secondary'}>
          {claim.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>Task ID</span>
          </div>
          <p className="text-foreground font-mono">
            {claim.taskId}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Opened</span>
          </div>
          <p className="text-foreground">
            {format(claim.openedAt, 'MMM dd, yyyy HH:mm')}
          </p>
        </div>

        {claim.claimedBy && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Assigned To</span>
            </div>
            <p className="text-foreground font-mono">
              {claim.claimedBy.slice(0, 8)}...
            </p>
          </div>
        )}

        {claim.resolvedAt && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Resolved</span>
            </div>
            <p className="text-foreground">
              {format(claim.resolvedAt, 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        )}
      </div>

      {claim.resolutionNotes && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Resolution Notes</span>
          </div>
          <div className="glass-card p-3">
            <p className="text-sm text-foreground">
              {claim.resolutionNotes}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Origin Context</h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{claim.originZone}</Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {claim.originEntityId.slice(0, 8)}...
          </span>
        </div>
      </div>
    </div>
  );
};