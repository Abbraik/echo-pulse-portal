
import React from 'react';
import { Button } from '@/components/ui/button';
import { MousePointer2, Pencil, Play, BarChart3, BookOpen, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface StepBarProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const StepBar: React.FC<StepBarProps> = ({ currentStep, onStepChange }) => {
  const { t } = useTranslation();

  const steps = [
    { id: 0, label: t('selectTrigger'), icon: <MousePointer2 size={16} /> },
    { id: 1, label: t('sketch'), icon: <Pencil size={16} /> },
    { id: 2, label: t('simulate'), icon: <Play size={16} /> },
    { id: 3, label: t('results'), icon: <BarChart3 size={16} /> },
    { id: 4, label: t('blueprint'), icon: <BookOpen size={16} /> },
    { id: 5, label: t('forward'), icon: <ArrowRight size={16} /> }
  ];

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30">
      <div className="glass-panel p-2 rounded-2xl">
        <div className="flex flex-col gap-2">
          {steps.map((step, index) => (
            <motion.div key={step.id}>
              <Button
                size="sm"
                variant={currentStep === step.id ? "default" : "ghost"}
                onClick={() => onStepChange(step.id)}
                className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center p-1 ${
                  currentStep === step.id 
                    ? 'bg-teal-500 hover:bg-teal-600 text-white' 
                    : 'hover:bg-white/10'
                }`}
                title={step.label}
              >
                {step.icon}
                <span className="text-xs mt-1 hidden xl:block">{step.label}</span>
              </Button>
              {index < steps.length - 1 && (
                <div className="w-px h-4 bg-white/20 mx-auto my-1" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
