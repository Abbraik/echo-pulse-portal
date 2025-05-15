
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassCardContent } from "@/components/ui/glass-card";
import { useTranslation } from "@/hooks/use-translation";

const HeroCard = () => {
  const { t, isRTL } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      <GlassCard 
        className="p-8 overflow-hidden relative"
        glowOnHover
        variant="deep"
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/5 opacity-60 pointer-events-none" />
        
        {/* Content */}
        <GlassCardContent className="text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            {t('systemStatus')}
          </h1>
          
          <p className="text-lg md:text-xl mb-6 font-medium">
            System is drifting: <span className="text-amber-500">Social Trust ↓12%</span> among youth
          </p>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white button-glow relative overflow-hidden group"
          >
            <span>Consider Social Trust</span>
            <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            
            {/* Ripple effect on hover */}
            <span className="absolute inset-0 pointer-events-none">
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <motion.span
                  initial={{ scale: 0, opacity: 0.8, x: "50%", y: "50%" }}
                  whileHover={{ 
                    scale: 2, 
                    opacity: 0,
                    transition: { duration: 0.8, ease: "easeOut" }
                  }}
                  className="absolute h-10 w-10 rounded-full bg-white/30 -translate-x-1/2 -translate-y-1/2"
                />
              </span>
            </span>
          </Button>
        </GlassCardContent>
      </GlassCard>
    </motion.div>
  );
};

export default HeroCard;
