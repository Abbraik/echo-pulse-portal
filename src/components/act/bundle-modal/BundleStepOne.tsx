
import React from 'react';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/use-translation';
import { BundleFormData } from '../BundleModal';
import TagSelector from './TagSelector';

interface BundleStepOneProps {
  formData: BundleFormData;
  setFormData: React.Dispatch<React.SetStateAction<BundleFormData>>;
  errors: Record<string, string>;
}

const BundleStepOne: React.FC<BundleStepOneProps> = ({ 
  formData, 
  setFormData, 
  errors 
}) => {
  const { t, isRTL } = useTranslation();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('basicInformation')}</h2>
      
      <div className="space-y-4">
        {/* Bundle Name */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('bundleName')} <span className="text-rose-500">*</span>
            </Label>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {t('bundleNameTooltip')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="relative">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`backdrop-blur-sm bg-white/5 border-white/20 focus:border-teal-500/50 transition-all duration-300 ${
                errors.name ? 'border-rose-500 focus:border-rose-500' : ''
              }`}
              placeholder={t('enterBundleName')}
              maxLength={60}
            />
            {errors.name && (
              <p className="text-rose-500 text-xs mt-1">{errors.name}</p>
            )}
            <div className="text-xs text-right text-gray-400 mt-1">
              {formData.name.length}/60
            </div>
          </div>
        </div>
        
        {/* Bundle Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary" className="text-sm font-medium">
              {t('bundleSummary')} <span className="text-rose-500">*</span>
            </Label>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {t('bundleSummaryTooltip')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="relative">
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className={`backdrop-blur-sm bg-white/5 border-white/20 focus:border-teal-500/50 min-h-[120px] transition-all duration-300 ${
                errors.summary ? 'border-rose-500 focus:border-rose-500' : ''
              }`}
              placeholder={t('enterBundleSummary')}
              maxLength={200}
            />
            {errors.summary && (
              <p className="text-rose-500 text-xs mt-1">{errors.summary}</p>
            )}
            <div className="text-xs text-right text-gray-400 mt-1">
              {formData.summary.length}/200
            </div>
          </div>
        </div>
        
        {/* Bundle Tags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tags" className="text-sm font-medium">
              {t('tags')}
            </Label>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {t('bundleTagsTooltip')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <TagSelector
            selectedTags={formData.tags}
            onTagsChange={(tags) => setFormData({ ...formData, tags })}
          />
        </div>
      </div>
    </div>
  );
};

export default BundleStepOne;
