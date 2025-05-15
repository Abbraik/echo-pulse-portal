
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, CircleA, CircleB } from "lucide-react";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, GlassCardFooter } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

interface ScenarioCardProps {
  title: string;
  letter: "A" | "B";
  value: number;
  isPositive: boolean;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, letter, value, isPositive }) => {
  const { t, isRTL } = useTranslation();
  const Icon = letter === "A" ? CircleA : CircleB;
  
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        rotateX: 5,
        rotateY: isRTL ? -5 : 5,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300 
      }}
      className="relative"
    >
      <GlassCard className="h-full rounded-3xl overflow-hidden" variant="deep">
        <div className="aspect-square p-6 flex flex-col items-center justify-center">
          {/* Letter badge */}
          <div className="mb-4">
            <Icon size={48} className="text-teal-400" />
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          
          {/* Value */}
          <div className={`text-2xl font-bold mb-2 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : '-'}{value}%
          </div>
          
          {/* Compare button */}
          <Button 
            variant="outline" 
            size="sm"
            className="mt-4 bg-white/5 backdrop-blur-sm border-white/10"
          >
            {t('compare')}
          </Button>
        </div>
      </GlassCard>
      
      {/* Particle trail effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-teal-300/50"
            initial={{ x: '50%', y: '80%', opacity: 0.8 }}
            animate={{ 
              y: ['80%', '0%'],
              opacity: [0.8, 0],
              transition: {
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 2
              }
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const ScenarioComparator: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <ParallaxCard className="h-full">
      <GlassCard className="h-full p-6" variant="deep">
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <GlassCardTitle gradient>{t('scenarioComparator')}</GlassCardTitle>
            <Button variant="outline" size="sm" className="rounded-full">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              {t('compareAll')}
            </Button>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-2 gap-6">
            <ScenarioCard
              title="Baseline"
              letter="A"
              value={7.4}
              isPositive={true}
            />
            <ScenarioCard
              title="High Migration"
              letter="B"
              value={3.2}
              isPositive={false}
            />
          </div>
        </GlassCardContent>
      </GlassCard>
    </ParallaxCard>
  );
};

export default ScenarioComparator;
