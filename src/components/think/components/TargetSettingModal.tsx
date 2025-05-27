
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, X, Save } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SubIndicator {
  name: string;
  value: number;
  target?: number;
  unit?: string;
  description: string;
  trend?: number[];
}

interface TargetSettingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator: SubIndicator;
  pillarName: string;
  onSave: (target: number) => void;
}

export const TargetSettingModal: React.FC<TargetSettingModalProps> = ({
  open,
  onOpenChange,
  indicator,
  pillarName,
  onSave
}) => {
  const { t } = useTranslation();
  const [targetValue, setTargetValue] = useState(indicator.target?.toString() || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    const numValue = parseFloat(targetValue);
    
    if (isNaN(numValue)) {
      setError(t('invalidNumber'));
      return;
    }
    
    // Basic validation based on unit type
    if (indicator.unit === '%' && (numValue < 0 || numValue > 100)) {
      setError(t('percentageRange'));
      return;
    }
    
    if (indicator.unit === 'ratio' && numValue < 0) {
      setError(t('ratioPositive'));
      return;
    }
    
    setError('');
    onSave(numValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onOpenChange(false)}
    >
      <motion.div
        className="glass-panel-deep p-6 w-full max-w-md"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Target size={16} />
            </div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
              {t('setTarget')}
            </h3>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label={t('close')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-300">
              {t('pillar')}
            </Label>
            <div className="mt-1 text-teal-400 font-medium">
              {pillarName}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-300">
              {t('indicator')}
            </Label>
            <div className="mt-1 text-white font-medium">
              {indicator.name}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {indicator.description}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-300">
              {t('currentValue')}
            </Label>
            <div className="mt-1 font-mono text-white">
              {indicator.value} {indicator.unit || ''}
            </div>
          </div>

          <div>
            <Label htmlFor="target-input" className="text-sm font-medium text-gray-300">
              {t('targetValue')}
            </Label>
            <Input
              id="target-input"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`${t('enterTarget')}...`}
              className="mt-1 bg-white/10 border-white/20 focus:border-teal-500"
              step="any"
              autoFocus
            />
            {indicator.unit && (
              <div className="mt-1 text-xs text-gray-400">
                {t('unit')}: {indicator.unit}
              </div>
            )}
            {error && (
              <div className="mt-1 text-xs text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            <Save size={16} className="mr-2" />
            {t('saveTarget')}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
