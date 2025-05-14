
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Play, PauseCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface EquilibriumBand {
  name: string;
  min: number;
  max: number;
}

interface EquilibriumRingProps {
  data: {
    bands: EquilibriumBand[];
  };
  onFocus: () => void;
}

const EquilibriumRing: React.FC<EquilibriumRingProps> = ({ data, onFocus }) => {
  const [isComputing, setIsComputing] = useState(false);
  const [hasComputed, setHasComputed] = useState(false);
  const [sliderValues, setSliderValues] = useState({
    population: 50,
    resources: 65,
    goods: 35,
    social: 80
  });
  
  const handleCompute = () => {
    setIsComputing(true);
    onFocus();
    
    // Simulate computation
    setTimeout(() => {
      setHasComputed(true);
      setIsComputing(false);
      
      toast({
        title: "Equilibrium Computed",
        description: "New balance bands have been calculated and applied.",
        variant: "default",
      });
    }, 2000);
  };
  
  const handleSliderChange = (position: string, values: number[]) => {
    setSliderValues(prev => ({
      ...prev,
      [position]: values[0]
    }));
  };

  return (
    <div className="w-full h-full relative">
      {/* Slider positions around the ring */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4">
        <Slider 
          defaultValue={[sliderValues.population]} 
          max={100} 
          step={1} 
          className="h-1" 
          onValueChange={(values) => handleSliderChange('population', values)}
        />
      </div>
      
      <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-1/4 rotate-90">
        <Slider 
          defaultValue={[sliderValues.resources]} 
          max={100} 
          step={1} 
          className="h-1" 
          onValueChange={(values) => handleSliderChange('resources', values)}
        />
      </div>
      
      <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4">
        <Slider 
          defaultValue={[sliderValues.goods]} 
          max={100} 
          step={1} 
          className="h-1" 
          onValueChange={(values) => handleSliderChange('goods', values)}
        />
      </div>
      
      <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-1/4 rotate-90">
        <Slider 
          defaultValue={[sliderValues.social]} 
          max={100} 
          step={1} 
          className="h-1" 
          onValueChange={(values) => handleSliderChange('social', values)}
        />
      </div>
      
      {/* Small value indicators */}
      <div className="absolute top-[18%] left-1/2 transform -translate-x-1/2 text-xs text-white/70">
        {sliderValues.population}%
      </div>
      
      <div className="absolute top-1/2 left-[18%] transform -translate-y-1/2 text-xs text-white/70">
        {sliderValues.resources}%
      </div>
      
      <div className="absolute bottom-[18%] left-1/2 transform -translate-x-1/2 text-xs text-white/70">
        {sliderValues.goods}%
      </div>
      
      <div className="absolute top-1/2 right-[18%] transform translate-y-1/2 text-xs text-white/70">
        {sliderValues.social}%
      </div>
      
      {/* Compute Button */}
      <motion.button
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-12 h-12 rounded-full flex items-center justify-center
          ${isComputing ? 'bg-gray-500/50' : 'bg-teal-500/70 hover:bg-teal-500/90'}`}
        disabled={isComputing}
        onClick={handleCompute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isComputing ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white/90 rounded-full animate-spin"></div>
        ) : (
          <Play size={24} className="text-white ml-1" />
        )}
      </motion.button>
      
      {/* Result flip cards */}
      <AnimatePresence>
        {hasComputed && (
          <>
            <motion.div
              className="absolute top-[10%] left-1/2 transform -translate-x-1/2 bg-teal-500/20 backdrop-blur-sm border border-teal-500/40 px-2 py-1 rounded text-xs text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              [78-82]
            </motion.div>
            
            <motion.div
              className="absolute top-1/2 left-[10%] transform -translate-y-1/2 bg-teal-500/20 backdrop-blur-sm border border-teal-500/40 px-2 py-1 rounded text-xs text-white"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              [70-75]
            </motion.div>
            
            <motion.div
              className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 bg-teal-500/20 backdrop-blur-sm border border-teal-500/40 px-2 py-1 rounded text-xs text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              [68-73]
            </motion.div>
            
            <motion.div
              className="absolute top-1/2 right-[10%] transform -translate-y-1/2 bg-teal-500/20 backdrop-blur-sm border border-teal-500/40 px-2 py-1 rounded text-xs text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              [80-85]
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EquilibriumRing;
