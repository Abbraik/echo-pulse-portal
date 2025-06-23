
import React from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeveragePointChip } from '../types/leverage-types';

interface LeveragePointChipProps {
  point: LeveragePointChip;
  onRemove: (id: string) => void;
}

const LeveragePointChip: React.FC<LeveragePointChipProps> = ({ point, onRemove }) => {
  return (
    <div className="chip inline-flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-sm bg-white/20 border border-white/20 text-white text-sm">
      {point.recommended && (
        <Star className="h-3 w-3 text-teal-400 fill-current" />
      )}
      <span className="font-medium">{point.name}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(point.id)}
        className="h-4 w-4 p-0 ml-1 hover:bg-white/10 rounded-full text-red-400 hover:text-red-300"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default LeveragePointChip;
