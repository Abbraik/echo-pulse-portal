

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MousePointer, 
  Hand, 
  ZoomIn, 
  Plus, 
  Link, 
  Undo, 
  Redo, 
  Grid, 
  Layers,
  Save,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CLDToolbarProps {
  selectedTool: 'select' | 'pan' | 'add-node' | 'add-connector';
  onToolChange: (tool: 'select' | 'pan' | 'add-node' | 'add-connector') => void;
  snapToGrid: boolean;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CLDToolbar: React.FC<CLDToolbarProps> = ({
  selectedTool,
  onToolChange,
  snapToGrid,
  onToggleGrid,
  onUndo,
  onRedo,
  onSave,
  onReset,
  canUndo,
  canRedo
}) => {
  const tools = [
    { id: 'select' as const, icon: MousePointer, label: 'Select (V)', shortcut: 'V' },
    { id: 'pan' as const, icon: Hand, label: 'Pan (H)', shortcut: 'H' },
    { id: 'add-node' as const, icon: Plus, label: 'Add Node (N)', shortcut: 'N' },
    { id: 'add-connector' as const, icon: Link, label: 'Add Connector (C)', shortcut: 'C' },
  ];

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    switch (key) {
      case 'v':
        onToolChange('select');
        break;
      case 'h':
        onToolChange('pan');
        break;
      case 'n':
        onToolChange('add-node');
        break;
      case 'c':
        onToolChange('add-connector');
        break;
      case 'g':
        onToggleGrid();
        break;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <motion.div
      className="absolute top-4 left-4 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="flex flex-col items-center gap-1 p-2 backdrop-blur-[20px] border border-white/20 rounded-xl"
        style={{
          background: 'rgba(20, 30, 50, 0.8)',
          boxShadow: 'inset 0 0 20px rgba(20, 184, 166, 0.1)'
        }}
      >
        {/* Selection Tools */}
        <div className="flex flex-col items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              className={`h-10 w-10 p-0 transition-all duration-200 ${
                selectedTool === tool.id
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'hover:bg-white/10 text-white/70 hover:text-white'
              }`}
              title={tool.label}
            >
              <tool.icon size={16} />
            </Button>
          ))}
        </div>

        <Separator orientation="horizontal" className="w-8 bg-white/20 my-1" />

        {/* Action Tools */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={16} />
          </Button>
        </div>

        <Separator orientation="horizontal" className="w-8 bg-white/20 my-1" />

        {/* View Controls */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant={snapToGrid ? 'default' : 'ghost'}
            size="sm"
            onClick={onToggleGrid}
            className={`h-10 w-10 p-0 transition-all duration-200 ${
              snapToGrid
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
            title="Toggle Grid (G)"
          >
            <Grid size={16} />
          </Button>
        </div>

        <Separator orientation="horizontal" className="w-8 bg-white/20 my-1" />

        {/* File Operations */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white"
            title="Save (Ctrl+S)"
          >
            <Save size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-10 w-10 p-0 hover:bg-white/10 text-white/70 hover:text-white"
            title="Reset Canvas"
          >
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CLDToolbar;

