import React, { useState } from 'react';
import { Play, Square, CheckCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedClaim } from '@/types/claims';
import { useAuth } from '@/hooks/use-auth';

interface ClaimActionsProps {
  claim: EnhancedClaim;
  onClaim: (claimId: string) => void;
  onRelease: (claimId: string) => void;
  onResolve: (data: { claimId: string; notes?: string }) => void;
}

export const ClaimActions: React.FC<ClaimActionsProps> = ({
  claim,
  onClaim,
  onRelease,
  onResolve
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const { user } = useAuth();

  const canClaim = claim.status === 'open';
  const canRelease = claim.status === 'assigned' && claim.claimedBy === user?.id;
  const canResolve = claim.status === 'assigned' && claim.claimedBy === user?.id;

  const handleResolve = () => {
    onResolve({ claimId: claim.id, notes: resolutionNotes });
    setResolutionNotes('');
    setShowResolveDialog(false);
  };

  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
      <div className="flex gap-2">
        {canClaim && (
          <Button
            onClick={() => onClaim(claim.id)}
            className="flex-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300"
          >
            <Play className="h-4 w-4 mr-2" />
            Claim
          </Button>
        )}

        {canRelease && (
          <Button
            onClick={() => onRelease(claim.id)}
            variant="outline"
            className="flex-1"
          >
            <Square className="h-4 w-4 mr-2" />
            Release
          </Button>
        )}
      </div>

      {canResolve && (
        <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
          <DialogTrigger asChild>
            <Button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300">
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel">
            <DialogHeader>
              <DialogTitle>Resolve Claim</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Add resolution notes (optional)..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="glass-input"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleResolve}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300"
                >
                  Confirm Resolution
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowResolveDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};