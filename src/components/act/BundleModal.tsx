
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, ChevronLeft, ChevronRight, Trash2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import BundleStepOne from './bundle-modal/BundleStepOne';
import BundleStepTwo from './bundle-modal/BundleStepTwo';
import BundleStepThree from './bundle-modal/BundleStepThree';
import { BundleTag, Bundle } from './types/act-types';

export interface BundleFormData {
  id?: string;
  name: string;
  summary: string;
  tags: BundleTag[];
  objectives: string[];
  pillars: ('population' | 'resource' | 'services' | 'social')[];
  geography: string[];
  status?: 'draft' | 'pending' | 'active';
  owner?: string;
  lastModified?: string;
  isApproved?: boolean;
  coherence?: number;
  ndiImpact?: number;
}

interface BundleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialBundle?: Bundle | null;
  onSave: (bundle: BundleFormData) => void;
  onDelete?: (bundleId: string) => void;
}

const BundleModal: React.FC<BundleModalProps> = ({
  open,
  onOpenChange,
  initialBundle = null,
  onSave,
  onDelete,
}) => {
  const { t, isRTL } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BundleFormData>({
    name: '',
    summary: '',
    tags: [],
    objectives: [''],
    pillars: [],
    geography: ['All Emirates'],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Populate form data if editing an existing bundle
  useEffect(() => {
    if (initialBundle) {
      setFormData({
        id: initialBundle.id,
        name: initialBundle.name,
        summary: initialBundle.summary || '',
        tags: initialBundle.tags || [],
        objectives: ['Improve water conservation', 'Optimize irrigation systems'], // Sample objectives
        pillars: ['resource', 'services'], // Sample pillars
        geography: ['Dubai', 'Abu Dhabi'], // Sample geography
        status: initialBundle.status,
        owner: initialBundle.owner,
        lastModified: initialBundle.lastModified,
        isApproved: initialBundle.isApproved,
        coherence: initialBundle.coherence,
        ndiImpact: initialBundle.ndiImpact,
      });
    } else {
      // Reset form when creating a new bundle
      setFormData({
        name: '',
        summary: '',
        tags: [],
        objectives: [''],
        pillars: [],
        geography: ['All Emirates'],
      });
    }
    setCurrentStep(1);
  }, [initialBundle, open]);

  const isEditMode = !!initialBundle;

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        errors.name = t('bundleNameRequired');
      } else if (formData.name.length < 3 || formData.name.length > 60) {
        errors.name = t('bundleNameLengthError');
      }
      
      if (!formData.summary.trim()) {
        errors.summary = t('bundleSummaryRequired');
      } else if (formData.summary.length < 10 || formData.summary.length > 200) {
        errors.summary = t('bundleSummaryLengthError');
      }
    }
    
    if (currentStep === 2) {
      if (formData.objectives.length === 0 || !formData.objectives.some(obj => obj.trim())) {
        errors.objectives = t('atLeastOneObjectiveRequired');
      }
      
      if (formData.pillars.length === 0) {
        errors.pillars = t('atLeastOnePillarRequired');
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(step => Math.min(step + 1, 3));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(step => Math.max(step - 1, 1));
  };

  const handleSave = () => {
    if (validateCurrentStep()) {
      onSave(formData);
      toast({
        title: isEditMode ? t('bundleUpdated') : t('bundleCreated'),
        description: `${formData.name} ${isEditMode ? t('updatedSuccessfully') : t('createdAsDraft')}`,
      });
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (initialBundle && onDelete) {
      onDelete(initialBundle.id);
      toast({
        title: t('bundleDeleted'),
        description: `${initialBundle.name} ${t('hasBeenDeleted')}`,
      });
      onOpenChange(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BundleStepOne 
            formData={formData} 
            setFormData={setFormData} 
            errors={formErrors} 
          />
        );
      case 2:
        return (
          <BundleStepTwo 
            formData={formData} 
            setFormData={setFormData} 
            errors={formErrors} 
          />
        );
      case 3:
        return (
          <BundleStepThree 
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full md:w-[60%] sm:w-[90%] glass-morphism overflow-hidden p-0 border border-white/20">
        <div className={`bg-gradient-to-r ${isRTL ? 'from-blue-500/10 to-teal-500/10' : 'from-teal-500/10 to-blue-500/10'} px-6 py-4 border-b border-white/10`}>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold tracking-tight uppercase">
              {isEditMode ? `${t('editBundle')}: ${initialBundle?.name}` : t('createNewBundle')}
              
              {isEditMode && initialBundle?.status && (
                <Badge variant="outline" className="ml-2 capitalize text-xs">
                  {t(initialBundle.status)}
                </Badge>
              )}
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              {isEditMode && initialBundle?.status === 'draft' && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleDelete}
                  className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-muted-foreground">
            {t('step')} {currentStep} {t('of')} 3
          </div>
          
          {/* Progress bar */}
          <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {getStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="px-6 py-4 border-t border-white/10 flex justify-between">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('back')}
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                className="flex items-center gap-2"
              >
                {t('next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
              >
                <Save className="h-4 w-4" />
                {isEditMode ? t('updateBundle') : t('saveBundle')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BundleModal;
