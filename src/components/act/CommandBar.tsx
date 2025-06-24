import React, { useState } from 'react';
import { ArrowRight, Brain, Activity, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { DetailView } from '@/components/act/types/detail-view-types';

interface CommandBarProps {
  onAction: (action: DetailView) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ onAction }) => {
  const { t, isRTL } = useTranslation();
  const [ripple, setRipple] = useState<{ x: number; y: number; id: string } | null>(null);
  
  const handleButtonClick = (action: DetailView, e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Command bar action clicked:', action);
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipple({
      x, 
      y,
      id: `ripple-${action}-${Date.now()}`
    });
    
    // Trigger the action
    onAction(action);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipple(null);
    }, 1000);
  };

  // Action button configurations  
  const actionButtons = [
    {
      key: 'assign-leverage',
      action: 'assign-leverage' as DetailView,
      label: t('assignLeverage', { defaultValue: 'Assign Leverage' }),
      icon: <Brain className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />,
      color: 'from-teal-500 to-blue-500'
    },
    {
      key: 're-optimize',
      action: 're-optimize' as DetailView,
      label: t('reOptimizeBands', { defaultValue: 'Re-optimize Bands' }),
      icon: <Activity className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />,
      color: 'from-blue-500 to-purple-500'
    },
    {
      key: 'launch-delivery',
      action: 'launch-delivery' as DetailView,
      label: t('launchDeliveryPlan', { defaultValue: 'Launch Delivery Plan' }),
      icon: <Rocket className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />,
      color: 'from-purple-500 to-pink-500'
    }
  ];
  
  return (
    <GlassCard className="w-full py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Conversational Prompt */}
      <div className="text-left flex-1">
        <div className="relative">
          <motion.div 
            className="absolute -top-6 -left-2 h-10 w-10 opacity-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <h2 className="text-lg md:text-xl font-medium bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {t('bundleCoherencePrompt', { 
              defaultValue: "Bundle 'Resource Resilience' coherence is 58—next step?"
            })}
          </h2>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        {actionButtons.map(btn => (
          <motion.div 
            key={btn.key}
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="relative overflow-hidden bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 w-full sm:w-auto"
              onClick={(e) => handleButtonClick(btn.action, e)}
            >
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-r ${btn.color}`} />
              <div className="flex items-center">
                {isRTL ? (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    <span className="mx-1">{btn.label}</span>
                    {btn.icon}
                  </>
                ) : (
                  <>
                    {btn.icon}
                    <span className="mx-1">{btn.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </div>
              
              {ripple && ripple.id.includes(btn.action) && (
                <motion.span 
                  className="absolute bg-white/30 rounded-full pointer-events-none"
                  initial={{ width: 0, height: 0, opacity: 0.5, x: ripple.x, y: ripple.y }}
                  animate={{ width: 500, height: 500, opacity: 0, x: ripple.x - 250, y: ripple.y - 250 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </Button>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

export default CommandBar;
