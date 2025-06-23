
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Eye, EyeOff, Lock, Unlock, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CLDLayer } from '../types/isometric-cld-types';

interface LayerManagerProps {
  layers: CLDLayer[];
  onToggleLayer: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onAddLayer: (name: string) => void;
  onReorderLayers: (layers: CLDLayer[]) => void;
  onRenameLayer: (layerId: string, newName: string) => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  onToggleLayer,
  onToggleLock,
  onAddLayer,
  onReorderLayers,
  onRenameLayer
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newLayerName, setNewLayerName] = useState('');
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      onAddLayer(newLayerName.trim());
      setNewLayerName('');
    }
  };

  const handleRename = (layerId: string, newName: string) => {
    if (newName.trim()) {
      onRenameLayer(layerId, newName.trim());
    }
    setEditingLayerId(null);
  };

  return (
    <motion.div
      className="absolute top-4 right-4 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="backdrop-blur-[20px] border border-white/20 rounded-xl overflow-hidden"
        style={{
          background: 'rgba(20, 30, 50, 0.8)',
          boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-teal-400" />
            <span className="text-white font-medium">Layers</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/60">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/10"
            >
              <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                {/* Layer List */}
                {layers.map((layer) => (
                  <motion.div
                    key={layer.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <GripVertical size={12} className="text-white/40 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: layer.color }}
                    />

                    <Checkbox
                      checked={layer.visible}
                      onCheckedChange={() => onToggleLayer(layer.id)}
                      className="border-white/20"
                    />

                    {editingLayerId === layer.id ? (
                      <Input
                        value={layer.name}
                        onChange={(e) => handleRename(layer.id, e.target.value)}
                        onBlur={() => setEditingLayerId(null)}
                        onKeyPress={(e) => e.key === 'Enter' && handleRename(layer.id, e.currentTarget.value)}
                        className="flex-1 h-6 text-xs bg-white/10 border-white/20 text-white"
                        autoFocus
                      />
                    ) : (
                      <span
                        className="flex-1 text-xs text-white cursor-pointer"
                        onClick={() => setEditingLayerId(layer.id)}
                      >
                        {layer.name}
                      </span>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleLock(layer.id)}
                      className="h-6 w-6 p-0 hover:bg-white/10"
                    >
                      {layer.locked ? (
                        <Lock size={10} className="text-red-400" />
                      ) : (
                        <Unlock size={10} className="text-white/60" />
                      )}
                    </Button>
                  </motion.div>
                ))}

                {/* Add New Layer */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <Input
                    value={newLayerName}
                    onChange={(e) => setNewLayerName(e.target.value)}
                    placeholder="Layer name..."
                    className="flex-1 h-8 text-xs bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddLayer()}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddLayer}
                    className="h-8 w-8 p-0 hover:bg-teal-500/20 text-teal-400"
                  >
                    <Plus size={12} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LayerManager;
