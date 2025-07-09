// Enhanced claim types for the claimant system
export interface EnhancedClaim {
  id: string;
  zone: string;
  taskId: string;
  status: 'open' | 'assigned' | 'closed';
  claimedBy?: string;
  openedAt: Date;
  closedAt?: Date;
  originZone: string;
  originEntityId: string;
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface ClaimFilter {
  zone?: string;
  status?: string;
  search?: string;
  originZone?: string;
}

export interface ClaimAction {
  type: 'claim' | 'release' | 'resolve' | 'reassign';
  claimId: string;
  notes?: string;
  assigneeId?: string;
}