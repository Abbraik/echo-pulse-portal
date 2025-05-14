
import React from 'react';
import { Slider } from '@/components/ui/slider';

const EquilibriumRing: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      {/* Slider positions around the ring */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4">
        <Slider defaultValue={[50]} max={100} step={1} className="h-1" />
      </div>
      
      <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-1/4 rotate-90">
        <Slider defaultValue={[65]} max={100} step={1} className="h-1" />
      </div>
      
      <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4">
        <Slider defaultValue={[35]} max={100} step={1} className="h-1" />
      </div>
      
      <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 w-1/4 rotate-90">
        <Slider defaultValue={[80]} max={100} step={1} className="h-1" />
      </div>
      
      {/* Small value indicators */}
      <div className="absolute top-[18%] left-1/2 transform -translate-x-1/2 text-xs text-white/70">
        50%
      </div>
      
      <div className="absolute top-1/2 left-[18%] transform -translate-y-1/2 text-xs text-white/70">
        65%
      </div>
      
      <div className="absolute bottom-[18%] left-1/2 transform -translate-x-1/2 text-xs text-white/70">
        35%
      </div>
      
      <div className="absolute top-1/2 right-[18%] transform translate-y-1/2 text-xs text-white/70">
        80%
      </div>
    </div>
  );
};

export default EquilibriumRing;
