import { useState, useEffect } from 'react';
import { EnhancedClaim } from '@/types/claims';

// Mock claims data for demo purposes
const mockClaims: EnhancedClaim[] = [
  {
    id: '1',
    zone: 'THINK',
    taskId: 'task-001',
    status: 'open',
    openedAt: new Date('2025-01-08T10:00:00Z'),
    originZone: 'THINK',
    originEntityId: 'scenario-123',
    metadata: { type: 'scenario_review' },
    createdAt: new Date('2025-01-08T10:00:00Z')
  },
  {
    id: '2',
    zone: 'ACT',
    taskId: 'task-002',
    status: 'assigned',
    claimedBy: 'demo-user',
    openedAt: new Date('2025-01-08T09:30:00Z'),
    originZone: 'ACT',
    originEntityId: 'bundle-456',
    metadata: { type: 'bundle_approval' },
    createdAt: new Date('2025-01-08T09:30:00Z')
  },
  {
    id: '3',
    zone: 'MONITOR',
    taskId: 'task-003',
    status: 'closed',
    claimedBy: 'another-user',
    openedAt: new Date('2025-01-08T08:00:00Z'),
    closedAt: new Date('2025-01-08T08:45:00Z'),
    originZone: 'MONITOR',
    originEntityId: 'anomaly-789',
    resolutionNotes: 'Anomaly was a false positive due to data lag',
    resolvedBy: 'another-user',
    resolvedAt: new Date('2025-01-08T08:45:00Z'),
    metadata: { type: 'anomaly_investigation' },
    createdAt: new Date('2025-01-08T08:00:00Z')
  },
  {
    id: '4',
    zone: 'LEARN',
    taskId: 'task-004',
    status: 'open',
    openedAt: new Date('2025-01-08T11:15:00Z'),
    originZone: 'LEARN',
    originEntityId: 'lesson-101',
    metadata: { type: 'lesson_review' },
    createdAt: new Date('2025-01-08T11:15:00Z')
  },
  {
    id: '5',
    zone: 'INNOVATE',
    taskId: 'task-005',
    status: 'open',
    openedAt: new Date('2025-01-08T12:00:00Z'),
    originZone: 'INNOVATE',
    originEntityId: 'innovation-202',
    metadata: { type: 'innovation_assessment' },
    createdAt: new Date('2025-01-08T12:00:00Z')
  }
];

export const useMockClaims = () => {
  const [claims, setClaims] = useState<EnhancedClaim[]>(mockClaims);

  const updateClaimStatus = (claimId: string, status: EnhancedClaim['status'], claimedBy?: string) => {
    setClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { 
            ...claim, 
            status, 
            claimedBy: status === 'assigned' ? claimedBy : status === 'open' ? undefined : claim.claimedBy,
            closedAt: status === 'closed' ? new Date() : undefined,
            resolvedAt: status === 'closed' ? new Date() : undefined,
            resolvedBy: status === 'closed' ? claimedBy : undefined
          }
        : claim
    ));
  };

  return {
    claims,
    updateClaimStatus
  };
};