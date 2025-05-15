
import React, { useState } from 'react';
import { Check, Pencil, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

interface Bundle {
  id: string;
  name: string;
  coherence: number;
  isApproved: boolean;
}

interface BundlesRailProps {
  selectedBundle: string | null;
  onSelectBundle: (bundleId: string) => void;
}

const BundlesRail: React.FC<BundlesRailProps> = ({ 
  selectedBundle, 
  onSelectBundle 
}) => {
  const { t } = useTranslation();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [rapidTestMode, setRapidTestMode] = useState(false);
  
  // Sample data for bundles
  const bundles: Bundle[] = [
    { id: 'b1', name: 'Resource Resilience', coherence: 58, isApproved: false },
    { id: 'b2', name: 'Education Reform', coherence: 87, isApproved: true },
    { id: 'b3', name: 'Health Infrastructure', coherence: 72, isApproved: false },
    { id: 'b4', name: 'Digital Governance', coherence: 45, isApproved: false },
  ];
  
  const getCoherenceColor = (coherence: number) => {
    if (coherence >= 80) return 'bg-green-500';
    if (coherence >= 60) return 'bg-gold-400';
    return 'bg-rose-500';
  };
  
  const getBundleCardClass = (bundle: Bundle) => {
    let baseClass = 'relative p-3 rounded-lg transition-all duration-300 hover:shadow-lg';
    
    // Apply different styling based on selection status
    if (selectedBundle === bundle.id) {
      baseClass += ' ring-2 ring-teal-500 shadow-md';
    } else {
      baseClass += ' border border-white/10';
    }
    
    // Apply heat map coloring if enabled
    if (showHeatmap) {
      const opacity = bundle.coherence / 100 * 0.7 + 0.1; // Scale from 0.1 to 0.8
      baseClass += ` ${getCoherenceColor(bundle.coherence)} bg-opacity-${Math.round(opacity * 100)}`;
    } else {
      baseClass += ' bg-white/5 backdrop-blur-sm';
    }
    
    return baseClass;
  };
  
  return (
    <GlassCard className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-medium">{t('bundles', { defaultValue: 'Bundles' })}</h2>
      </div>
      
      {/* Bundle cards container */}
      <div className="p-3 flex-1 overflow-y-auto space-y-2">
        {bundles.map(bundle => (
          <motion.div 
            key={bundle.id}
            className={getBundleCardClass(bundle)}
            onClick={() => onSelectBundle(bundle.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium">{bundle.name}</span>
              
              {/* Coherence badge */}
              <span className={`px-2 py-0.5 text-xs rounded-full ${getCoherenceColor(bundle.coherence)} text-white`}>
                {bundle.coherence}%
              </span>
            </div>
            
            {/* Mini delta chart - simplified representation */}
            <div className="mt-2 h-6 bg-white/5 rounded-md overflow-hidden">
              <div 
                className="h-full bg-teal-500/30"
                style={{ width: `${bundle.coherence}%` }}
              />
            </div>
            
            {/* Action buttons */}
            <div className="mt-2 flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle review action
                }}
              >
                <Pencil className="h-4 w-4 text-gray-400" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-1 h-auto hover:bg-white/10 ${bundle.isApproved ? 'text-green-500' : 'text-gray-400'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle approve action
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
        
        {/* New Bundle button */}
        <motion.div 
          className="p-3 rounded-lg border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="h-5 w-5 mr-2 text-teal-400" />
          <span>{t('newBundle', { defaultValue: 'New Bundle' })}</span>
        </motion.div>
      </div>
      
      {/* Toggle controls */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">{t('showCoherenceHeatmap', { defaultValue: 'Show Coherence Heatmap' })}</span>
          <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">{t('rapidTestMode', { defaultValue: 'Switch to Rapid-Test Mode' })}</span>
          <Switch checked={rapidTestMode} onCheckedChange={setRapidTestMode} />
        </div>
      </div>
    </GlassCard>
  );
};

export default BundlesRail;
