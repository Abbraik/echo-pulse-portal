
import React from 'react';
import { Pencil, CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../types/act-types';
import { useRealBundleActions } from '../hooks/useRealBundles';

interface BundleSummaryCardProps {
  bundle: Bundle;
}

const BundleSummaryCard: React.FC<BundleSummaryCardProps> = ({ bundle }) => {
  const { t } = useTranslation();
  const { approveBundle } = useRealBundleActions();

  const getBackgroundGradient = (coherence: number) => {
    if (coherence >= 80) return 'from-green-500/20 to-transparent';
    if (coherence >= 60) return 'from-amber-500/20 to-transparent';
    return 'from-rose-500/20 to-transparent';
  };

  return (
    <GlassCard className={`mb-6 p-6 overflow-hidden relative bg-gradient-to-r ${getBackgroundGradient(bundle.coherence)}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5 space-y-4">
          <div className="text-sm text-gray-400 mb-2">
            {t('updatedAgo')}: {new Date(bundle.updatedAt).toLocaleDateString()}
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
              <div className="text-xs text-gray-400 mb-1">{t('status')}</div>
              <div className="text-md font-medium text-white capitalize">
                {bundle.status}
              </div>
            </div>
          </div>
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
