
import React from "react";
import { motion } from "framer-motion";
import { FileCheck, Database, Clock } from "lucide-react";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  delay?: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, delay = 0 }) => {
  const { isRTL } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4 }}
      whileTap={{ y: 0, scale: 0.98 }}
      className="w-full"
    >
      <Button 
        variant="outline" 
        className="w-full h-16 justify-start glass-panel-premium hover:glass-glow"
      >
        <Icon className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">{label}</span>
      </Button>
    </motion.div>
  );
};

const QuickActions: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <ParallaxCard className="h-full">
      <GlassCard className="h-full p-6" variant="deep">
        <GlassCardHeader>
          <GlassCardTitle gradient>{t('quickActions')}</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="flex flex-col space-y-4">
          <ActionButton 
            icon={FileCheck} 
            label="Review Bundles" 
            delay={0.1} 
          />
          <ActionButton 
            icon={Database} 
            label="Diagnose Pillars" 
            delay={0.2} 
          />
          <ActionButton 
            icon={Clock} 
            label="Open Delivery Tasks" 
            delay={0.3} 
          />
        </GlassCardContent>
      </GlassCard>
    </ParallaxCard>
  );
};

export default QuickActions;
