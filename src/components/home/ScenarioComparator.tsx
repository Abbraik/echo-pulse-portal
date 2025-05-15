
import React from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, GlassCardFooter } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

interface ScenarioCardProps {
  title: string;
  value: number;
  delta: number;
  isPositive: boolean;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, value, delta, isPositive }) => {
  const { isRTL } = useTranslation();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative"
    >
      <GlassCard className="h-full" variant="deep">
        <GlassCardHeader>
          <GlassCardTitle>{title}</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent className="text-center">
          <div className="text-4xl font-bold mb-2">{value}</div>
          <div className={`text-sm flex items-center justify-center ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(delta)}%
          </div>
          <div className="mt-4 h-20 flex items-center justify-center">
            {/* This would be replaced with a real chart in a full implementation */}
            <div className="w-full h-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-md relative overflow-hidden">
              <div className="absolute inset-0 flex items-center">
                <div className={`h-0.5 w-full bg-gradient-to-r ${isPositive ? 'from-teal-300 to-emerald-500' : 'from-amber-300 to-rose-500'}`}></div>
              </div>
              <div className="absolute inset-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="absolute h-full w-0.5 bg-white/10" style={{ left: `${i * 25}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </GlassCardContent>
        <GlassCardFooter className="justify-center">
          <Button variant="outline" className="w-full" size="sm">
            <span>View Details</span>
            <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </GlassCardFooter>
      </GlassCard>
      
      {/* Particle trail effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-teal-300/50"
            initial={{ x: '50%', y: '100%', opacity: 0.8 }}
            animate={{ 
              y: ['100%', '-20%'],
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

const ScenarioComparator = () => {
  const { t } = useTranslation();
  
  return (
    <ParallaxCard className="h-full">
      <GlassCard className="h-full p-6">
        <GlassCardHeader>
          <div className="flex items-center justify-between">
            <GlassCardTitle gradient>Scenario Comparator</GlassCardTitle>
            <Button variant="outline" size="sm" className="rounded-full">
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Compare All
            </Button>
          </div>
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScenarioCard
              title="Baseline"
              value={84}
              delta={2.5}
              isPositive={true}
            />
            <ScenarioCard
              title="High-Migration"
              value={72}
              delta={8.3}
              isPositive={false}
            />
          </div>
        </GlassCardContent>
      </GlassCard>
    </ParallaxCard>
  );
};

export default ScenarioComparator;
