
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../../types/act-types';

interface FinalizeTabProps {
  bundle: Bundle;
}

const FinalizeTab: React.FC<FinalizeTabProps> = ({ bundle }) => {
  const { t } = useTranslation();

  return (
    <GlassCard className="h-full p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('finalizeExport', { defaultValue: 'Finalize & Export' })}</h3>
        <p className="text-gray-400">
          Review bundle summary before exporting to the Delivery Chain Manager.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="font-medium mb-4">{t('exportSummary', { defaultValue: 'Export Summary' })}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">{t('bundleName', { defaultValue: 'Bundle Name' })}</div>
              <div className="font-medium text-white">{bundle.name}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">{t('coherenceScore', { defaultValue: 'Coherence Score' })}</div>
              <div className="font-medium text-white">{bundle.coherence}%</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">{t('projectedNdi', { defaultValue: 'Projected NDI Impact' })}</div>
              <div className="font-medium text-teal-400">+{bundle.ndiImpact} {t('ndiPoints')}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-400 mb-1">{t('status', { defaultValue: 'Status' })}</div>
              <div className="font-medium text-white capitalize">{bundle.status}</div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            {t('commentsForApprover', { defaultValue: 'Comments for Approver' })}
          </label>
          <Textarea 
            placeholder={t('addComments', { defaultValue: 'Add any additional comments...' }) as string}
            className="bg-white/5 border-white/20"
            rows={3}
          />
        </div>
        
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
          <Button variant="outline" className="md:order-1 bg-white/5">
            {t('saveDraft', { defaultValue: 'Save Draft' })}
          </Button>
          <Button className="md:order-2">
            {t('exportToDelivery', { defaultValue: 'Export to Delivery' })}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default FinalizeTab;
