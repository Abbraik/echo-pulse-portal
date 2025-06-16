
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { BundleFormData } from '../types/act-types';
import { Check, MapPin, Tag, Users, Calendar, Diamond } from 'lucide-react';

interface BundleStepThreeProps {
  formData: BundleFormData;
}

const BundleStepThree: React.FC<BundleStepThreeProps> = ({ formData }) => {
  const { t, isRTL } = useTranslation();

  const getPillarLabel = (pillar: string) => {
    switch (pillar) {
      case 'population': return t('population');
      case 'resource': return t('resource');
      case 'services': return t('services');
      case 'social': return t('social');
      default: return pillar;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('reviewAndSave')}</h2>
      
      <div className="space-y-6">
        <GlassCard variant="deep" className="border border-white/10 p-6">
          <h3 className="text-lg font-medium mb-4">{formData.name}</h3>
          <p className="text-gray-300 mb-6">{formData.summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objectives */}
            <div className="space-y-3">
              <h4 className="text-sm text-gray-400 uppercase tracking-wider">{t('objectives')}</h4>
              <ul className="space-y-2">
                {formData.objectives?.map((objective, index) => (
                  objective.trim() ? (
                    <li key={index} className="flex items-center gap-2">
                      <div className="bg-teal-500/20 text-teal-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{objective}</span>
                    </li>
                  ) : null
                ))}
              </ul>
            </div>
            
            {/* Other details */}
            <div className="space-y-3">
              {/* Pillars */}
              <div className="space-y-2">
                <h4 className="text-sm text-gray-400 uppercase tracking-wider">{t('pillars')}</h4>
                <div className="flex flex-wrap gap-1">
                  {formData.pillars?.map(pillar => (
                    <div 
                      key={pillar} 
                      className={`
                        px-2.5 py-1 rounded-full text-xs
                        ${pillar === 'population' ? 'bg-blue-500/20 text-blue-400' :
                          pillar === 'resource' ? 'bg-green-500/20 text-green-400' :
                          pillar === 'services' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-amber-500/20 text-amber-400'}
                      `}
                    >
                      {getPillarLabel(pillar)}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Geography */}
              <div className="space-y-2">
                <h4 className="text-sm text-gray-400 uppercase tracking-wider">{t('geography')}</h4>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formData.geography?.includes('All Emirates') ? 
                      t('allEmirates') : 
                      formData.geography?.join(', ')}
                  </span>
                </div>
              </div>
              
              {/* Tags */}
              {formData.tags && formData.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm text-gray-400 uppercase tracking-wider">{t('tags')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <div 
                        key={index}
                        className="px-2.5 py-1 rounded-full text-xs bg-white/10"
                      >
                        {typeof tag === 'string' ? tag : tag.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
        
        {/* Bundle status info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-teal-500/20 p-2 rounded-lg">
              <Diamond className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <h4 className="font-medium">{t('bundleStatusInfo')}</h4>
              <p className="text-sm text-gray-400 mt-1">
                {t('bundleStatusDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleStepThree;
