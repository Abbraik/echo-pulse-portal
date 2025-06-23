
import React from 'react';
import { MousePointer2, Hand, ZoomIn, Plus, GitBranch, Undo2, Redo2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolType, CLDTool } from '../types/isometric-cld-types';
import { motion } from 'framer-motion';

interface CLDToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleLayers: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

const tools: CLDTool[] = [
  { id: 'select', name: 'Select', icon: <MousePointer2 size={16} />, shortcut: 'V' },
  { id: 'pan', name: 'Pan', icon: <Hand size={16} />, shortcut: 'H' },
  { id: 'zoom', name: 'Zoom', icon: <ZoomIn size={16} />, shortcut: 'Z' },
  { id: 'add-node', name: 'Add Node', icon: <Plus size={16} />, shortcut: 'N' },
  { id: 'add-connector', name: 'Add Connector', icon: <GitBranch size={16} />, shortcut: 'C' }
];

export const CLDToolbar: React.FC<CLDToolbarProps> = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onToggleLayers,
  canUndo,
  canRedo,
  className = ''
}) => {
  return (
    <motion.div 
      className={`glass-panel p-3 rounded-2xl flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            size="sm"
            variant={activeTool === tool.id ? "default" : "ghost"}
            onClick={() => onToolChange(tool.id)}
            className={`h-8 px-3 ${
              activeTool === tool.id 
                ? 'bg-teal-500/30 text-teal-300 hover:bg-teal-500/40' 
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title={`${tool.name} (${tool.shortcut})`}
          >
            {tool.icon}
          </Button>
        ))}
      </div>

      <div className="w-px h-6 bg-white/20 mx-2" />

      {/* History Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 px-3 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 px-3 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/20 mx-2" />

      {/* Layer Toggle */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onToggleLayers}
        className="h-8 px-3 text-gray-300 hover:text-white hover:bg-white/10"
        title="Toggle Layers Panel (L)"
      >
        <Layers size={16} />
      </Button>
    </motion.div>
  );
};
