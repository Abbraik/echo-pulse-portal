import React from 'react';
import { AnimatedPage } from '@/components/ui/motion';
import { useClaimManagement } from '@/hooks/useClaimManagement';
import { ClaimCard } from '@/components/claims/ClaimCard';
import { SearchFilterBar } from '@/components/claims/SearchFilterBar';
import { ClaimMetadataPanel } from '@/components/claims/ClaimMetadataPanel';
import { ClaimActions } from '@/components/claims/ClaimActions';
import { DynamicContextLoader } from '@/components/claims/context/DynamicContextLoader';
import { Loader2, Inbox } from 'lucide-react';
import ParticlesBackground from '@/components/ui/particles-background';

const ClaimantPage: React.FC = () => {
  const {
    claims,
    selectedClaim,
    setSelectedClaim,
    filter,
    updateFilter,
    isLoading,
    actions,
    refetch
  } = useClaimManagement();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticlesBackground 
        count={40}
        colorStart="#14B8A6"
        colorEnd="#2563EB"
        minSize={2}
        maxSize={3}
        speed={0.3}
      />
      
      <AnimatedPage>
        <div className="claimant-page grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-screen relative z-10">
          {/* Left Pane: Claim Queue */}
          <div className="queue-pane glass-panel p-6 flex flex-col">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Claim Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and track claims across all zones
              </p>
            </div>

            <SearchFilterBar filter={filter} onChange={updateFilter} />
            
            <div className="claims-list flex-1 space-y-3 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
                  <span className="ml-2 text-muted-foreground">Loading claims...</span>
                </div>
              ) : claims.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No claims found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                claims.map(claim => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    isSelected={selectedClaim?.id === claim.id}
                    onClick={() => setSelectedClaim(claim)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Panes: Claim Details & Origin Context */}
          <div className="details-panes col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Claim Details */}
            <div className="details-pane glass-panel p-6 flex flex-col">
              {selectedClaim ? (
                <>
                  <ClaimMetadataPanel claim={selectedClaim} />
                  <ClaimActions
                    claim={selectedClaim}
                    onClaim={actions.claim}
                    onRelease={actions.release}
                    onResolve={actions.resolve}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a claim to view details</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose a claim from the list to see its metadata and available actions
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Origin Context */}
            <div className="context-pane glass-panel p-6 flex flex-col">
              {selectedClaim ? (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Origin Context
                  </h3>
                  <div className="flex-1 overflow-y-auto">
                    <DynamicContextLoader
                      originZone={selectedClaim.originZone}
                      entityId={selectedClaim.originEntityId}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <div className="h-6 w-6 rounded bg-white/10" />
                    </div>
                    <p className="text-muted-foreground">Context will appear here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a claim to see its origin zone context
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimatedPage>
    </div>
  );
};

export default ClaimantPage;