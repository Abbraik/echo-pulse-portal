
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import Gauge from '@/components/ui/custom/Gauge';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface MicroSimPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAlert: any;
  isRTL: boolean;
}

export const MicroSimPanel: React.FC<MicroSimPanelProps> = ({
  isOpen,
  onClose,
  selectedAlert,
  isRTL
}) => {
  const { t } = useTranslation();
  const [impactScore, setImpactScore] = React.useState(72);
  const [parameterValue, setParameterValue] = React.useState(0);
  
  // Reset values when panel opens with a new alert
  React.useEffect(() => {
    if (isOpen && selectedAlert) {
      setParameterValue(0);
      setImpactScore(72);
    }
  }, [isOpen, selectedAlert]);

  // Update impact score when parameter changes
  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setParameterValue(value);
    
    // Simulate impact calculation based on parameter change
    const newImpact = 72 + (value / 2);
    setImpactScore(Math.min(Math.max(newImpact, 0), 100));
  };
  
  const handleApplyChanges = () => {
    toast({
      title: t('changesApplied'),
      description: t('recalibrationSuccess'),
    });
    onClose();
  };
  
  return (
    <motion.div 
      className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-80 md:w-96 glass-panel-deep z-50 shadow-2xl transform transition-all ${isRTL ? 'origin-left' : 'origin-right'}`}
      initial={{ 
        transform: isRTL ? 'translateX(-100%)' : 'translateX(100%)',
        opacity: 0
      }}
      animate={{ 
        transform: isOpen ? 'translateX(0)' : isRTL ? 'translateX(-100%)' : 'translateX(100%)',
        opacity: isOpen ? 1 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            {t('recalibration')}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {selectedAlert && (
            <div className="space-y-6">
              <div className="glass-panel p-4">
                <h4 className="text-sm font-medium mb-2">
                  {t('parameter')}: {selectedAlert.indicator}
                </h4>
                <input 
                  type="range" 
                  min="-10" 
                  max="10" 
                  step="1" 
                  value={parameterValue}
                  onChange={handleParameterChange}
                  className="w-full accent-teal-500"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>-10%</span>
                  <span>0%</span>
                  <span>+10%</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-sm font-medium mb-2">{t('systemImpactProjection')}</h4>
                <div className="flex justify-center py-4">
                  <Gauge 
                    value={impactScore} 
                    size="md" 
                    color={impactScore > 80 ? "teal" : impactScore > 60 ? "blue" : impactScore > 40 ? "amber" : "rose"} 
                  />
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('equityImpact')}</span>
                    <span className={parameterValue > 0 ? "text-green-400" : parameterValue < 0 ? "text-red-400" : "text-gray-400"}>
                      {parameterValue > 0 ? "+" : ""}{parameterValue * 1.2}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>{t('coherenceEffect')}</span>
                    <span className={parameterValue > 0 ? "text-green-400" : parameterValue < 0 ? "text-red-400" : "text-gray-400"}>
                      {parameterValue > 0 ? "+" : ""}{parameterValue * 0.8}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>{t('timeToEquilibrium')}</span>
                    <span className={parameterValue < 0 ? "text-green-400" : parameterValue > 0 ? "text-amber-400" : "text-gray-400"}>
                      {parameterValue > 0 ? "+" : ""}{parameterValue * 0.3} {t('days')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel p-3 mt-4">
                <p className="text-xs text-gray-400">
                  {t('recalibrationNote')}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <Button 
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90" 
            onClick={handleApplyChanges}
          >
            {t('applyChanges')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
