import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Eye, EyeOff, Plus, Trash2, GripVertical } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { Switch } from '@/components/ui/switch';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  elements: string[];
  color: string;
  order: number;
}

interface LayerManagerProps {
  layers: Layer[];
  onLayerUpdate: (layers: Layer[]) => void;
  onLayerVisibilityChange: (layerId: string, visible: boolean) => void;
  floating?: boolean;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  onLayerUpdate,
  onLayerVisibilityChange,
  floating = true
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [newLayerName, setNewLayerName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const layerColors = [
    '#14b8a6', '#3b82f6', '#8b5cf6', '#f59e0b', 
    '#ef4444', '#10b981', '#6366f1', '#ec4899'
  ];

  const handleAddLayer = () => {
    if (!newLayerName.trim()) return;

    const newLayer: Layer = {
      id: `layer_${Date.now()}`,
      name: newLayerName,
      visible: true,
      elements: [],
      color: layerColors[layers.length % layerColors.length],
      order: layers.length
    };

    onLayerUpdate([...layers, newLayer]);
    setNewLayerName('');
    setShowAddForm(false);
  };

  const handleDeleteLayer = (layerId: string) => {
    const updatedLayers = layers.filter(layer => layer.id !== layerId);
    onLayerUpdate(updatedLayers);
  };

  const handleLayerReorder = (draggedId: string, targetId: string) => {
    const draggedIndex = layers.findIndex(l => l.id === draggedId);
    const targetIndex = layers.findIndex(l => l.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const reorderedLayers = [...layers];
    const [draggedLayer] = reorderedLayers.splice(draggedIndex, 1);
    reorderedLayers.splice(targetIndex, 0, draggedLayer);

    // Update order values
    const updatedLayers = reorderedLayers.map((layer, index) => ({
      ...layer,
      order: index
    }));

    onLayerUpdate(updatedLayers);
  };

  const CardComponent = floating ? motion.div : GlassCard;
  const cardProps = floating 
    ? {
        className: "fixed top-4 left-4 w-80 glass-panel-deep p-4 z-50 border border-white/20 rounded-xl",
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        style: {
          background: 'rgba(20, 30, 50, 0.9)',
          backdropFilter: 'blur(24px)',
          boxShadow: 'inset 0 0 30px rgba(20, 184, 166, 0.15), 0 16px 32px rgba(0, 0, 0, 0.4)'
        }
      }
    : { className: "p-4", variant: "deep" as const };

  return (
    <CardComponent {...cardProps}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Layers className="w-5 h-5 text-teal-400 mr-2" />
          <h3 className="font-semibold text-white">{t('layerManager')}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="outline"
            size="sm"
            className="border-white/20 h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          {floating && (
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex gap-2">
              <Input
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                placeholder={t('layerName')}
                className="flex-1 bg-white/10 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLayer()}
              />
              <Button
                onClick={handleAddLayer}
                size="sm"
                className="bg-teal-500/20 border-teal-500/50 hover:bg-teal-500/30"
              >
                {t('add')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {layers.sort((a, b) => a.order - b.order).map((layer, index) => (
              <motion.div
                key={layer.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center flex-1">
                  <button className="mr-2 cursor-grab">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: layer.color }}
                  />
                  
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{layer.name}</div>
                    <div className="text-xs text-gray-400">
                      {layer.elements.length} {t('elements')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={(checked) => onLayerVisibilityChange(layer.id, checked)}
                    className="data-[state=checked]:bg-teal-500"
                  />
                  
                  <Button
                    onClick={() => handleDeleteLayer(layer.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {layers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('noLayersYet')}</p>
                <p className="text-xs mt-1">{t('clickPlusToAdd')}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </CardComponent>
  );
};

export default LayerManager;