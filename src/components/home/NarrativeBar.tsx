
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { GlassCard } from "@/components/ui/glass-card";
import { useTranslation } from "@/hooks/use-translation";

interface NarrativeItem {
  id: number;
  text: string;
}

const NarrativeBar: React.FC = () => {
  const { t, isRTL } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Narrative data
  const narratives: NarrativeItem[] = [
    { 
      id: 1, 
      text: "Welcome to the Population Dynamics System—a living governance engine uniting foresight, strategy, monitoring, and innovation." 
    },
    { 
      id: 2, 
      text: "Discover how our policies keep the UAE balanced—simulating futures, launching interventions, and capturing lessons." 
    },
    { 
      id: 3, 
      text: "Your loop to dynamic equilibrium starts here—think, act, monitor, innovate." 
    }
  ];

  // Auto-rotate narratives
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % narratives.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="w-full p-5 overflow-hidden relative" variant="deep">
      {/* Background gradient animation */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/5 to-teal-500/10 opacity-60 pointer-events-none"
        style={{
          backgroundSize: "200% 100%",
          animation: "moveGradient 15s linear infinite"
        }}
      />
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex-1 text-left overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7 }}
              className="text-xl font-medium"
            >
              {narratives[currentIndex].text.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.5 }}
                  className="inline-block mr-1.5"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          </AnimatePresence>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 ml-4 rounded-full hover:bg-white/10 transition-colors"
              >
                <Info className="w-5 h-5 text-teal-400" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-card/95 backdrop-blur-md border-white/20 p-4">
              <div className="text-left">
                <h3 className="font-bold mb-2">The Four Zones</h3>
                <p className="text-sm mb-2">The PDS operates as a continuous loop:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><span className="font-medium">THINK:</span> Simulate scenarios</li>
                  <li><span className="font-medium">ACT:</span> Launch interventions</li>
                  <li><span className="font-medium">MONITOR:</span> Track outcomes</li>
                  <li><span className="font-medium">INNOVATE:</span> Generate new ideas</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Navigation dots */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-3 flex space-x-1.5">
          {narratives.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-teal-400 w-4' : 'bg-gray-500/50'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default NarrativeBar;
