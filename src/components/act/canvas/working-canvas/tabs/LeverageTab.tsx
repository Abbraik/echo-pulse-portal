
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bundle } from '../../../types/act-types';
import LeveragePointSelector from '../LeveragePointSelector';
import CoherenceMatrix from '../CoherenceMatrix';

interface LeverageTabProps {
  bundle: Bundle;
}

const LeverageTab: React.FC<LeverageTabProps> = ({ bundle }) => {
  const [leveragePoints, setLeveragePoints] = React.useState<string[]>(bundle.leveragePoints || []);

  const handleLeverageUpdate = (points: string[]) => {
    setLeveragePoints(points);
    // Update the bundle object if needed for parent components
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-8 p-6">
        {/* Leverage Point Selector */}
        <div className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
          <LeveragePointSelector
            bundleId={bundle.id}
            leveragePoints={leveragePoints}
            onUpdate={handleLeverageUpdate}
          />
        </div>

        {/* Coherence Matrix */}
        <div className="p-6 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10">
          <CoherenceMatrix
            bundleId={bundle.id}
            objectives={bundle.objectives || []}
            leveragePoints={leveragePoints}
          />
        </div>
      </div>
    </ScrollArea>
  );
};

export default LeverageTab;
