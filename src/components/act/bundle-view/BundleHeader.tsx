
import React from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { Bundle } from '../types/act-types';

interface BundleHeaderProps {
  bundle: Bundle;
  onClose: () => void;
}

const BundleHeader: React.FC<BundleHeaderProps> = ({ bundle, onClose }) => {
  const { t, isRTL } = useTranslation();

  const getCoherenceColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-amber-400';
    if (value >= 40) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2 p-1 h-8 w-8"
          onClick={() => onClose()}
        >
          {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Button>
        <h2 className="text-xl font-bold uppercase tracking-wide bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          {bundle.name}
        </h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className={`relative flex items-center justify-center w-10 h-10 rounded-full ${getCoherenceColor(bundle.coherence)}`}>
          <div className="absolute inset-0.5 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">{bundle.coherence}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-8 w-8 hover:bg-white/10"
          onClick={() => onClose()}
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};

export default BundleHeader;
