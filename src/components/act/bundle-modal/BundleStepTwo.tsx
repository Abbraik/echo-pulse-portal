
import React from 'react';
import { Info, Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/use-translation';
import { BundleFormData } from '../types/act-types';
import { motion, Reorder } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Check } from 'lucide-react';

interface BundleStepTwoProps {
  formData: BundleFormData;
  setFormData: React.Dispatch<React.SetStateAction<BundleFormData>>;
  errors: Record<string, string>;
}

const BundleStepTwo: React.FC<BundleStepTwoProps> = ({ formData, setFormData, errors }) => {
  const { t, isRTL } = useTranslation();
  
  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };
  
  const handleAddObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ''] });
  };
  
  const handleRemoveObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index);
      setFormData({ ...formData, objectives: newObjectives });
    }
  };
  
  const handleReorderObjectives = (newOrder: string[]) => {
    setFormData({ ...formData, objectives: newOrder });
  };
  
  const togglePillar = (pillar: 'population' | 'resource' | 'services' | 'social') => {
    const currentPillars = [...formData.pillars];
    if (currentPillars.includes(pillar)) {
      setFormData({ 
        ...formData, 
        pillars: currentPillars.filter(p => p !== pillar) 
      });
    } else {
      setFormData({ 
        ...formData, 
        pillars: [...currentPillars, pillar] 
      });
    }
  };
  
  // Sample emirates for geography selection
  const emirates = [
    'All Emirates',
    'Abu Dhabi',
    'Dubai',
    'Sharjah',
    'Ajman',
    'Umm Al-Quwain',
    'Fujairah',
    'Ras Al Khaimah'
  ];
  
  const toggleEmirate = (emirate: string) => {
    let newGeography = [...formData.geography];
    
    if (emirate === 'All Emirates') {
      // If selecting All Emirates, clear all other selections
      newGeography = ['All Emirates'];
    } else {
      // Remove All Emirates if it's there
      newGeography = newGeography.filter(geo => geo !== 'All Emirates');
      
      // Toggle this emirate
      if (newGeography.includes(emirate)) {
        newGeography = newGeography.filter(geo => geo !== emirate);
        
        // If no emirates left, default back to All Emirates
        if (newGeography.length === 0) {
          newGeography = ['All Emirates'];
        }
      } else {
        newGeography.push(emirate);
      }
    }
    
    setFormData({ ...formData, geography: newGeography });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('objectivesAndScope')}</h2>
      
      <div className="space-y-6">
        {/* Objectives */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {t('objectives')} <span className="text-rose-500">*</span>
            </Label>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {t('objectivesTooltip')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Reorder.Group
            axis="y"
            values={formData.objectives}
            onReorder={handleReorderObjectives}
            className="space-y-2"
          >
            {formData.objectives.map((objective, index) => (
              <Reorder.Item key={index} value={objective} className="list-none">
                <GlassCard 
                  variant="default" 
                  className="p-0 border border-white/10 overflow-hidden"
                >
                  <div className="flex items-center">
                    <div className="p-3 cursor-move bg-white/5 flex items-center justify-center">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`${t('objective')} ${index + 1}`}
                      className="border-0 focus-visible:ring-0 rounded-none bg-transparent flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveObjective(index)}
                      className="h-full aspect-square rounded-none bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500"
                      disabled={formData.objectives.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </GlassCard>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          
          {errors.objectives && (
            <p className="text-rose-500 text-xs mt-1">{errors.objectives}</p>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddObjective}
            className="w-full border-dashed border-white/30 bg-white/5 hover:bg-white/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addObjective')}
          </Button>
        </div>
        
        {/* Pillars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {t('pillars')} <span className="text-rose-500">*</span>
            </Label>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {t('pillarsTooltip')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'population', label: t('population'), color: 'blue' },
              { id: 'resource', label: t('resource'), color: 'green' },
              { id: 'services', label: t('services'), color: 'purple' },
              { id: 'social', label: t('social'), color: 'amber' }
            ].map((pillar) => (
              <div 
                key={pillar.id}
                onClick={() => togglePillar(pillar.id as any)}
                className={`
                  rounded-lg border border-white/20 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                  ${formData.pillars.includes(pillar.id as any) 
                    ? `bg-${pillar.color}-500/20 border-${pillar.color}-500/50` 
                    : 'bg-white/5 hover:bg-white/10'}
                `}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${formData.pillars.includes(pillar.id as any) 
                    ? `bg-${pillar.color}-500/30` 
                    : 'bg-white/10'}
                `}>
                  {formData.pillars.includes(pillar.id as any) && (
                    <Check className={`h-4 w-4 text-${pillar.color}-500`} />
                  )}
                </div>
                <span className="text-sm">{pillar.label}</span>
              </div>
            ))}
          </div>
          
          {errors.pillars && (
            <p className="text-rose-500 text-xs mt-1">{errors.pillars}</p>
          )}
        </div>
        
        {/* Geography */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {t('geography')}
            </Label>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  {t('geographyTooltip')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {emirates.map((emirate) => (
              <div
                key={emirate}
                onClick={() => toggleEmirate(emirate)}
                className={`
                  px-3 py-1.5 rounded-full border cursor-pointer transition-all text-sm
                  ${formData.geography.includes(emirate) 
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10 text-gray-300'}
                `}
              >
                {emirate}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleStepTwo;
