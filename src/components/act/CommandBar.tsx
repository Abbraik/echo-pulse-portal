
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { DetailView } from '@/pages/Act';

interface CommandBarProps {
  onAction: (action: DetailView) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ onAction }) => {
  const { t, isRTL } = useTranslation();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: string } | null>(null);
  
  const handleButtonClick = (action: DetailView, e: React.MouseEvent<HTMLButtonElement>) => {
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipple({
      x, 
      y,
      id: `ripple-${Date.now()}`
    });
    
    // Trigger the action
    onAction(action);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipple(null);
    }, 1000);
  };
  
  return (
    <GlassCard className="w-full p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Conversational Prompt */}
      <div className="text-left flex-1">
        <p className="text-lg font-medium">
          {t('bundleCoherencePrompt', { 
            defaultValue: "Bundle 'Resource Resilience' coherence is 58—next step?"
          })}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className={`flex flex-col md:flex-row gap-2 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <Button 
          variant="outline" 
          className="relative overflow-hidden bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10"
          onClick={(e) => handleButtonClick('assign-leverage', e)}
        >
          <span>{t('assignLeverage', { defaultValue: 'Assign Leverage' })}</span>
          <ArrowRight className="h-4 w-4 ml-1" />
          {ripple && ripple.id.includes('assign') && (
            <motion.span 
              className="absolute bg-white/30 rounded-full pointer-events-none"
              initial={{ width: 0, height: 0, opacity: 0.5, x: ripple.x, y: ripple.y }}
              animate={{ width: 500, height: 500, opacity: 0, x: ripple.x - 250, y: ripple.y - 250 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="relative overflow-hidden bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10"
          onClick={(e) => handleButtonClick('re-optimize', e)}
        >
          <span>{t('reOptimizeBands', { defaultValue: 'Re-optimize Bands' })}</span>
          <ArrowRight className="h-4 w-4 ml-1" />
          {ripple && ripple.id.includes('optimize') && (
            <motion.span 
              className="absolute bg-white/30 rounded-full pointer-events-none"
              initial={{ width: 0, height: 0, opacity: 0.5, x: ripple.x, y: ripple.y }}
              animate={{ width: 500, height: 500, opacity: 0, x: ripple.x - 250, y: ripple.y - 250 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="relative overflow-hidden bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10"
          onClick={(e) => handleButtonClick('launch-delivery', e)}
        >
          <span>{t('launchDeliveryPlan', { defaultValue: 'Launch Delivery Plan' })}</span>
          <ArrowRight className="h-4 w-4 ml-1" />
          {ripple && ripple.id.includes('launch') && (
            <motion.span 
              className="absolute bg-white/30 rounded-full pointer-events-none"
              initial={{ width: 0, height: 0, opacity: 0.5, x: ripple.x, y: ripple.y }}
              animate={{ width: 500, height: 500, opacity: 0, x: ripple.x - 250, y: ripple.y - 250 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

export default CommandBar;
