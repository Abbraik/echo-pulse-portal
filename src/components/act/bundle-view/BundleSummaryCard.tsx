
import React from 'react';
import { Pencil, CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../types/act-types';
import { useRealBundleActions } from '../hooks/useRealBundles';
import { useDemoIntegration } from '@/hooks/use-demo-integration';

interface BundleSummaryCardProps {
  bundle: Bundle;
}

const BundleSummaryCard: React.FC<BundleSummaryCardProps> = ({ bundle }) => {
  const { t } = useTranslation();
  const { approveBundle } = useRealBundleActions();
  const demoIntegration = useDemoIntegration();

  const getBackgroundGradient = (coherence: number) => {
    if (coherence >= 80) return 'from-green-500/20 to-transparent';
    if (coherence >= 60) return 'from-amber-500/20 to-transparent';
    return 'from-rose-500/20 to-transparent';
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(budget);
  };

  const getBundleDetails = async () => {
    // Check if this is a demo bundle and get additional details
    if (demoIntegration.isDemoMode) {
      const allBundles = await demoIntegration.getBundles();
      const demoBundle = allBundles.find(b => b.id === bundle.id);
      return demoBundle;
    }
    return null;
  };

  // For now, we'll use a simpler approach since we can't use async in render
  const getDemoBundleSync = () => {
    if (demoIntegration.isDemoMode && demoIntegration.demoData) {
      // Access the demo data directly from the centralized store
      const resourceData = demoIntegration.demoData.datasets?.['resource-management'];
      const birthRateData = demoIntegration.demoData.datasets?.['birth-rate-stability'];
      
      let demoBundle = null;
      if (resourceData?.bundles) {
        demoBundle = resourceData.bundles.find(b => b.id === bundle.id);
      }
      if (!demoBundle && birthRateData?.bundles) {
        demoBundle = birthRateData.bundles.find(b => b.id === bundle.id);
      }
      
      return demoBundle;
    }
    return null;
  };

  const demoBundle = getDemoBundleSync();

  return (
    <GlassCard className={`mb-6 p-6 overflow-hidden relative bg-gradient-to-r ${getBackgroundGradient(bundle.coherence)}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">
              {t('updatedAgo')}: {new Date(bundle.updatedAt).toLocaleDateString()}
            </div>
            {demoIntegration.isDemoMode && (
              <Badge variant="outline" className="text-xs bg-teal-500/20 text-teal-400 border-teal-500/30">
                Demo Bundle
              </Badge>
            )}
          </div>
          
          <p className="text-base leading-relaxed text-gray-300">
            {bundle.summary || 'No summary available for this bundle.'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">{t('projectedNdi')}</div>
              <div className="text-xl font-bold text-teal-400">
                +{bundle.ndiImpact} <span className="text-sm font-normal">{t('ndiPoints')}</span>
              </div>
            </div>
            
            <div className="glass-panel p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">{t('coherenceScore')}</div>
              <div className="text-xl font-bold text-white">
                {bundle.coherence}%
              </div>
            </div>
            
            <div className="glass-panel p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">
                {demoBundle?.budget ? 'Budget' : t('status')}
              </div>
              <div className="text-md font-medium text-white">
                {demoBundle?.budget ? formatBudget(demoBundle.budget) : bundle.status}
              </div>
            </div>
          </div>

          {/* Demo-specific additional info */}
          {demoBundle && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {demoBundle.timeline && (
                <div className="glass-panel p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Timeline</div>
                  <div className="text-sm text-white">{demoBundle.timeline}</div>
                </div>
              )}
              {demoBundle.stakeholders && (
                <div className="glass-panel p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Key Stakeholders</div>
                  <div className="text-sm text-white">{demoBundle.stakeholders.join(', ')}</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="lg:w-2/5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-gray-400 mb-1">{t('createdBy')}</div>
              <div className="text-sm text-white">{bundle.createdBy || 'Unknown'}</div>
            </div>
            
            <div>
              <div className="text-xs text-gray-400 mb-1">{t('status')}</div>
              <Badge 
                variant={bundle.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {bundle.status}
              </Badge>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <div className="text-xs text-gray-400 mb-2">Objectives</div>
            <div className="space-y-1">
              {bundle.objectives && bundle.objectives.length > 0 ? (
                bundle.objectives.slice(0, 3).map((objective, idx) => (
                  <div key={idx} className="text-sm text-gray-300 bg-white/5 rounded px-2 py-1">
                    {objective}
                  </div>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No objectives defined</span>
              )}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-2">{t('tags')}</div>
            <div className="flex flex-wrap gap-2">
              {bundle.tags && bundle.tags.length > 0 ? (
                bundle.tags.map((tag, idx) => (
                  <Badge 
                    key={`tag-${idx}`}
                    variant="outline"
                    className="text-xs bg-white/5 border-white/20"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-400 text-sm">No tags assigned</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/5"
              onClick={() => {
                console.log('Edit bundle clicked');
              }}
            >
              <Pencil className="h-4 w-4 mr-1" />
              {t('editBundle', { defaultValue: 'Edit Bundle' })}
            </Button>
            
            <Button 
              size="sm"
              onClick={() => {
                approveBundle.mutate(bundle.id);
              }}
              disabled={approveBundle.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {bundle.isApproved ? t('approved') : t('approve', { defaultValue: 'Approve' })}
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default BundleSummaryCard;
