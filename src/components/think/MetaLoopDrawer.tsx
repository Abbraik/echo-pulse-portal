import React, { useState } from 'react';
import { X, Network, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { LAM } from '@/components/ui/acronym-tooltip';

interface MetaLoopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetaLoopDrawer: React.FC<MetaLoopDrawerProps> = ({ isOpen, onClose }) => {
  const [metaLoopId, setMetaLoopId] = useState('');
  const [description, setDescription] = useState('');
  const [lamRootPatch, setLamRootPatch] = useState('');
  const [overrideEnabled, setOverrideEnabled] = useState(false);

  const lamOptions = [
    { value: 'adaptive-feedback', label: 'Adaptive Feedback Loop' },
    { value: 'threshold-control', label: 'Threshold Control System' },
    { value: 'oscillation-damper', label: 'Oscillation Damper' },
    { value: 'cascade-stabilizer', label: 'Cascade Stabilizer' },
    { value: 'equilibrium-point', label: 'Equilibrium Point Adjuster' }
  ];

  const handleSave = () => {
    console.log('Saving Meta-Loop:', { metaLoopId, description, lamRootPatch, overrideEnabled });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-80 glass-panel-deep border-l border-white/20 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Network size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Meta-Loop Configuration</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {/* Meta-Loop ID */}
              <div className="space-y-2">
                <Label htmlFor="meta-loop-id" className="text-sm font-medium text-foreground">
                  Meta-Loop ID
                </Label>
                <Input
                  id="meta-loop-id"
                  placeholder="e.g., ML-001-ADAPTIVE"
                  value={metaLoopId}
                  onChange={(e) => setMetaLoopId(e.target.value)}
                  className="glass-panel bg-white/5 border-white/20 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the meta-loop's purpose and behavior..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="glass-panel bg-white/5 border-white/20 text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              {/* LAM Root Patch */}
              <div className="space-y-2">
                <Label htmlFor="lam-root-patch" className="text-sm font-medium text-foreground">
                  <LAM /> Root Patch
                </Label>
                <Select value={lamRootPatch} onValueChange={setLamRootPatch}>
                  <SelectTrigger className="glass-panel bg-white/5 border-white/20 text-foreground">
                    <SelectValue placeholder="Select LAM configuration" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel-dark">
                    {lamOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Override Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="override-enabled" className="text-sm font-medium text-foreground">
                    Override Enabled
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow manual intervention in automated processes
                  </p>
                </div>
                <Switch
                  id="override-enabled"
                  checked={overrideEnabled}
                  onCheckedChange={setOverrideEnabled}
                />
              </div>

              {/* Warning if override is enabled */}
              {overrideEnabled && (
                <motion.div
                  className="flex items-start space-x-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertTriangle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-300">
                    Manual overrides can affect system stability. Use with caution and monitor closely.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 space-y-3">
              <Button
                onClick={handleSave}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Meta-Loop
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};