
import React, { useState } from 'react';
import { Plus, Eye, EyeOff, Lock, Unlock, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CLDLayer } from '../types/isometric-cld-types';
import { motion, Reorder } from 'framer-motion';

interface LayerManagerProps {
  layers: CLDLayer[];
  onLayersChange: (layers: CLDLayer[]) => void;
  onAddLayer: () => void;
  className?: string;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  onLayersChange,
  onAddLayer,
  className = ''
}) => {
  const [editingLayer, setEditingLayer] = useState<string | null>(null);
  const [newLayerName, setNewLayerName] = useState('');

  const handleToggleVisibility = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    );
    onLayersChange(updatedLayers);
  };

  const handleToggleLock = (layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    );
    onLayersChange(updatedLayers);
  };

  const handleRenameLayer = (layerId: string, newName: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId ? { ...layer, name: newName } : layer
    );
    onLayersChange(updatedLayers);
    setEditingLayer(null);
  };

  const handleReorderLayers = (reorderedLayers: CLDLayer[]) => {
    const updatedLayers = reorderedLayers.map((layer, index) => ({
      ...layer,
      order: index
    }));
    onLayersChange(updatedLayers);
  };

  return (
    <div className={`glass-panel p-4 rounded-2xl w-64 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Layers</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onAddLayer}
          className="h-6 w-6 p-0 text-teal-400 hover:text-teal-300"
        >
          <Plus size={14} />
        </Button>
      </div>

      <Reorder.Group
        axis="y"
        values={layers}
        onReorder={handleReorderLayers}
        className="space-y-2"
      >
        {layers.map((layer) => (
          <Reorder.Item
            key={layer.id}
            value={layer}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-move"
            whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          >
            <GripVertical size={12} className="text-gray-400" />
            
            <div
              className="w-3 h-3 rounded-sm border border-white/20"
              style={{ backgroundColor: layer.color }}
            />

            <Checkbox
              checked={layer.visible}
              onCheckedChange={() => handleToggleVisibility(layer.id)}
              className="w-4 h-4"
            />

            {editingLayer === layer.id ? (
              <Input
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                onBlur={() => handleRenameLayer(layer.id, newLayerName)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameLayer(layer.id, newLayerName);
                  if (e.key === 'Escape') setEditingLayer(null);
                }}
                className="text-xs h-6 flex-1"
                autoFocus
              />
            ) : (
              <span
                className="text-xs text-white flex-1 cursor-pointer"
                onClick={() => {
                  setEditingLayer(layer.id);
                  setNewLayerName(layer.name);
                }}
              >
                {layer.name}
              </span>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleToggleLock(layer.id)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
            </Button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
